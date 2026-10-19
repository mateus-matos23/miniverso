-- Leads e telemetria passam a ser gravados somente pelo servidor (secret key, role service_role).
-- anon e authenticated deixam de executar registrar_lead e registrar_telemetria: antes, qualquer
-- um chamava a RPC com a publishable key e escolhia p_ip_hash/p_visitante_hash, burlando o rate limit.
-- Teto global de telemetria: 20000 linhas (eventos + web_vitals) na ultima hora.

-- a) Indice de criado_em usado pelo teto global. eventos_criado_em_idx ja existe (migration de leads);
-- web_vitals so tinha indices compostos com criado_em no meio, entao cria um proprio.
create index if not exists web_vitals_criado_em_idx on public.web_vitals (criado_em);

-- b) Permissoes: somente service_role executa
revoke execute on function public.registrar_lead(text, text, text, text, text, text, text, text, text, text, text) from anon, authenticated;
grant execute on function public.registrar_lead(text, text, text, text, text, text, text, text, text, text, text) to service_role;

revoke execute on function public.registrar_telemetria(text, text, jsonb, jsonb) from anon, authenticated;
grant execute on function public.registrar_telemetria(text, text, jsonb, jsonb) to service_role;

-- c) registrar_lead: valida o hash antes de tudo; corpo igual ao da migration de leads
create or replace function public.registrar_lead(
  p_nome text,
  p_email text,
  p_escola text,
  p_cargo text,
  p_interesse text,
  p_mensagem text,
  p_utm_source text,
  p_utm_medium text,
  p_utm_campaign text,
  p_pagina text,
  p_ip_hash text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_id uuid;
  v_pagina text := nullif(trim(p_pagina), '');
  v_utm_source text := nullif(trim(p_utm_source), '');
  v_utm_medium text := nullif(trim(p_utm_medium), '');
  v_utm_campaign text := nullif(trim(p_utm_campaign), '');
begin
  -- Hash de visitante: sha256 em hexadecimal minusculo (64 caracteres)
  if p_ip_hash is null or p_ip_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'hash_invalido' using errcode = '22023';
  end if;

  -- Rate limit por ip_hash e global
  if (
    select count(*) from public.leads
    where ip_hash = p_ip_hash and criado_em > now() - interval '10 minutes'
  ) >= 3 then
    raise exception 'limite_excedido' using errcode = 'P0001';
  end if;

  if (
    select count(*) from public.leads
    where ip_hash = p_ip_hash and criado_em > now() - interval '24 hours'
  ) >= 10 then
    raise exception 'limite_excedido' using errcode = 'P0001';
  end if;

  if (
    select count(*) from public.leads
    where criado_em > now() - interval '1 hour'
  ) >= 200 then
    raise exception 'limite_excedido' using errcode = 'P0001';
  end if;

  insert into public.leads (
    nome, email, escola, cargo, interesse, mensagem,
    utm_source, utm_medium, utm_campaign, pagina, ip_hash
  )
  values (
    trim(p_nome),
    trim(p_email),
    nullif(trim(p_escola), ''),
    nullif(trim(p_cargo), ''),
    trim(p_interesse),
    trim(p_mensagem),
    v_utm_source,
    v_utm_medium,
    v_utm_campaign,
    v_pagina,
    p_ip_hash
  )
  returning id into v_id;

  -- Evento de conversao para o dashboard. Formulario nao envia dispositivo: usa desktop.
  insert into public.eventos (
    tipo, caminho, dispositivo, visitante_hash, utm_source, utm_medium, utm_campaign
  )
  values (
    'lead', coalesce(v_pagina, '/'), 'desktop', p_ip_hash,
    v_utm_source, v_utm_medium, v_utm_campaign
  );

  return v_id;
end;
$$;

revoke execute on function public.registrar_lead(text, text, text, text, text, text, text, text, text, text, text) from public;

-- d) registrar_telemetria: hash invalido e teto global ignoram o lote; corpo igual ao original
create or replace function public.registrar_telemetria(
  p_visitante_hash text,
  p_dispositivo text,
  p_eventos jsonb,
  p_vitals jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_eventos jsonb;
  v_vitals jsonb;
  v_item jsonb;
  v_dispositivo text;
  v_versao uuid;
  v_linhas_recentes bigint;
begin
  -- Hash de visitante invalido: ignora
  if p_visitante_hash is null or p_visitante_hash !~ '^[0-9a-f]{64}$' then
    return;
  end if;

  v_eventos := case when jsonb_typeof(p_eventos) = 'array' then p_eventos else '[]'::jsonb end;
  v_vitals := case when jsonb_typeof(p_vitals) = 'array' then p_vitals else '[]'::jsonb end;

  -- Lote grande demais: ignora
  if jsonb_array_length(v_eventos) + jsonb_array_length(v_vitals) > 20 then
    return;
  end if;

  -- Teto global: 20000 linhas (eventos + web vitals) na ultima hora
  if (
    (select count(*) from public.eventos e where e.criado_em > now() - interval '1 hour')
    + (select count(*) from public.web_vitals w where w.criado_em > now() - interval '1 hour')
  ) >= 20000 then
    return;
  end if;

  -- Visitante acima do limite na ultima hora: ignora
  select
    (select count(*) from public.eventos e
      where e.visitante_hash = p_visitante_hash and e.criado_em > now() - interval '1 hour')
    + (select count(*) from public.web_vitals w
      where w.visitante_hash = p_visitante_hash and w.criado_em > now() - interval '1 hour')
  into v_linhas_recentes;

  if v_linhas_recentes >= 300 then
    return;
  end if;

  v_dispositivo := case
    when p_dispositivo in ('mobile', 'tablet', 'desktop') then p_dispositivo
    else 'desktop'
  end;

  -- Eventos: somente pageview e cta_click
  for v_item in select value from jsonb_array_elements(v_eventos) loop
    if coalesce(v_item->>'tipo', '') not in ('pageview', 'cta_click') then
      continue;
    end if;

    begin
      insert into public.eventos (
        tipo, caminho, alvo, referrer_host, utm_source, utm_medium, utm_campaign,
        dispositivo, visitante_hash
      )
      values (
        v_item->>'tipo',
        v_item->>'caminho',
        nullif(trim(v_item->>'alvo'), ''),
        nullif(trim(v_item->>'referrer_host'), ''),
        nullif(trim(v_item->>'utm_source'), ''),
        nullif(trim(v_item->>'utm_medium'), ''),
        nullif(trim(v_item->>'utm_campaign'), ''),
        v_dispositivo,
        p_visitante_hash
      );
    exception when others then
      null;
    end;
  end loop;

  -- Web Vitals
  for v_item in select value from jsonb_array_elements(v_vitals) loop
    begin
      -- versao_id so e aceito se existir em landing_versoes; senao grava null
      v_versao := null;
      if coalesce(v_item->>'versao_id', '') ~* '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
        select lv.id into v_versao
        from public.landing_versoes lv
        where lv.id = (v_item->>'versao_id')::uuid;
      end if;

      insert into public.web_vitals (
        metrica, valor, rating, navegacao, caminho, dispositivo, versao_id, visitante_hash
      )
      values (
        v_item->>'metrica',
        (v_item->>'valor')::double precision,
        v_item->>'rating',
        nullif(trim(v_item->>'navegacao'), ''),
        v_item->>'caminho',
        v_dispositivo,
        v_versao,
        p_visitante_hash
      );
    exception when others then
      null;
    end;
  end loop;
end;
$$;

revoke execute on function public.registrar_telemetria(text, text, jsonb, jsonb) from public;
