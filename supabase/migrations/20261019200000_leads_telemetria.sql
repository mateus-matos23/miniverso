-- Leads do formulario de contato e telemetria anonima (pageviews, cliques em CTAs e Web Vitals).
-- Insercoes passam sempre por funcoes SECURITY DEFINER; anon nunca escreve direto nas tabelas.
-- Leitura do dashboard: somente admin (private.is_admin()).

-- a) Tabela de leads
create table public.leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text not null,
  escola text null,
  cargo text null,
  interesse text not null,
  mensagem text not null,
  status text not null default 'novo',
  notas text not null default '',
  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  pagina text null,
  ip_hash text not null,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint leads_nome_tamanho_check check (char_length(nome) between 2 and 120),
  constraint leads_email_tamanho_check check (char_length(email) <= 200),
  constraint leads_email_formato_check check (email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$'),
  constraint leads_escola_tamanho_check check (escola is null or char_length(escola) <= 160),
  constraint leads_cargo_tamanho_check check (cargo is null or char_length(cargo) <= 80),
  constraint leads_interesse_check check (interesse in ('implantacao', 'projeto_personalizado', 'parceria', 'outro')),
  constraint leads_mensagem_tamanho_check check (char_length(mensagem) between 10 and 2000),
  constraint leads_status_check check (status in ('novo', 'em_contato', 'convertido', 'arquivado')),
  constraint leads_notas_tamanho_check check (char_length(notas) <= 4000),
  constraint leads_utm_source_tamanho_check check (utm_source is null or char_length(utm_source) <= 100),
  constraint leads_utm_medium_tamanho_check check (utm_medium is null or char_length(utm_medium) <= 100),
  constraint leads_utm_campaign_tamanho_check check (utm_campaign is null or char_length(utm_campaign) <= 100),
  constraint leads_pagina_tamanho_check check (pagina is null or char_length(pagina) <= 200),
  constraint leads_ip_hash_tamanho_check check (char_length(ip_hash) <= 128)
);

-- Indices
create index leads_status_criado_em_idx on public.leads (status, criado_em desc);
create index leads_criado_em_idx on public.leads (criado_em desc);
-- Limite de envios por visitante (rate limit de registrar_lead)
create index leads_ip_hash_criado_em_idx on public.leads (ip_hash, criado_em desc);

-- Trigger: atualizado_em em cada UPDATE (funcao criada na baseline)
create trigger leads_definir_atualizado_em
  before update on public.leads
  for each row execute function public.definir_atualizado_em();

-- RLS habilitada
alter table public.leads enable row level security;

-- Grants: sem insert. A insercao acontece somente pela funcao registrar_lead.
revoke all on public.leads from anon, authenticated;
grant select, update, delete on public.leads to authenticated;

-- Policies de public.leads: somente admin
create policy "leads: admin le" on public.leads
  for select to authenticated
  using ((select private.is_admin()));

create policy "leads: admin edita" on public.leads
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "leads: admin exclui" on public.leads
  for delete to authenticated
  using ((select private.is_admin()));

-- b) Tabela de eventos (pageview e cta_click; lead entra pela funcao registrar_lead)
create table public.eventos (
  id bigint generated always as identity primary key,
  tipo text not null,
  caminho text not null,
  alvo text null,
  referrer_host text null,
  utm_source text null,
  utm_medium text null,
  utm_campaign text null,
  dispositivo text not null,
  visitante_hash text not null,
  criado_em timestamptz not null default now(),
  constraint eventos_tipo_check check (tipo in ('pageview', 'cta_click', 'lead')),
  constraint eventos_caminho_tamanho_check check (char_length(caminho) <= 200),
  constraint eventos_alvo_tamanho_check check (alvo is null or char_length(alvo) <= 80),
  constraint eventos_referrer_host_tamanho_check check (referrer_host is null or char_length(referrer_host) <= 200),
  constraint eventos_utm_source_tamanho_check check (utm_source is null or char_length(utm_source) <= 100),
  constraint eventos_utm_medium_tamanho_check check (utm_medium is null or char_length(utm_medium) <= 100),
  constraint eventos_utm_campaign_tamanho_check check (utm_campaign is null or char_length(utm_campaign) <= 100),
  constraint eventos_dispositivo_check check (dispositivo in ('mobile', 'tablet', 'desktop')),
  constraint eventos_visitante_hash_tamanho_check check (char_length(visitante_hash) <= 128)
);

-- Indices
create index eventos_criado_em_idx on public.eventos (criado_em);
create index eventos_tipo_criado_em_idx on public.eventos (tipo, criado_em);
-- Limite de linhas por visitante (registrar_telemetria)
create index eventos_visitante_hash_criado_em_idx on public.eventos (visitante_hash, criado_em);

-- RLS habilitada
alter table public.eventos enable row level security;

-- Grants: somente leitura pelo admin
revoke all on public.eventos from anon, authenticated;
grant select on public.eventos to authenticated;

create policy "eventos: admin le" on public.eventos
  for select to authenticated
  using ((select private.is_admin()));

-- c) Tabela de Web Vitals
create table public.web_vitals (
  id bigint generated always as identity primary key,
  metrica text not null,
  valor double precision not null,
  rating text not null,
  navegacao text null,
  caminho text not null,
  dispositivo text not null,
  versao_id uuid null references public.landing_versoes (id) on delete set null,
  visitante_hash text not null,
  criado_em timestamptz not null default now(),
  constraint web_vitals_metrica_check check (metrica in ('LCP', 'INP', 'CLS', 'FCP', 'TTFB')),
  constraint web_vitals_valor_check check (valor >= 0 and valor < 600000),
  constraint web_vitals_rating_check check (rating in ('good', 'needs-improvement', 'poor')),
  constraint web_vitals_navegacao_tamanho_check check (navegacao is null or char_length(navegacao) <= 30),
  constraint web_vitals_caminho_tamanho_check check (char_length(caminho) <= 200),
  constraint web_vitals_dispositivo_check check (dispositivo in ('mobile', 'tablet', 'desktop')),
  constraint web_vitals_visitante_hash_tamanho_check check (char_length(visitante_hash) <= 128)
);

-- Indices
create index web_vitals_metrica_criado_em_idx on public.web_vitals (metrica, criado_em);
create index web_vitals_versao_id_idx on public.web_vitals (versao_id);
-- Limite de linhas por visitante (registrar_telemetria)
create index web_vitals_visitante_hash_criado_em_idx on public.web_vitals (visitante_hash, criado_em);

-- RLS habilitada
alter table public.web_vitals enable row level security;

-- Grants: somente leitura pelo admin
revoke all on public.web_vitals from anon, authenticated;
grant select on public.web_vitals to authenticated;

create policy "web_vitals: admin le" on public.web_vitals
  for select to authenticated
  using ((select private.is_admin()));

-- d) Funcao de registro de lead (chamada pelo formulario publico)
-- Limites: 3 envios em 10 min, 10 em 24 h e 200 no total na ultima hora.
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

-- e) Funcao de telemetria (chamada pelo cliente, em lote)
-- Ignora silenciosamente lotes com mais de 20 itens e visitantes com 300+ linhas na ultima hora.
-- Itens invalidos sao descartados um a um.
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
  v_eventos := case when jsonb_typeof(p_eventos) = 'array' then p_eventos else '[]'::jsonb end;
  v_vitals := case when jsonb_typeof(p_vitals) = 'array' then p_vitals else '[]'::jsonb end;

  -- Lote grande demais: ignora
  if jsonb_array_length(v_eventos) + jsonb_array_length(v_vitals) > 20 then
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

-- f) Leitura agregada do dashboard (somente admin; SECURITY INVOKER)

-- Visitantes, pageviews, leads, serie diaria, CTAs, origens e dispositivos do periodo
create or replace function public.metricas_resumo(p_inicio timestamptz, p_fim timestamptz)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_dia_inicio date;
  v_dia_fim date;
  v_por_dia jsonb;
  v_resultado jsonb;
begin
  if not (select private.is_admin()) then
    raise exception 'acesso negado' using errcode = '42501';
  end if;

  -- Dias no fuso de Fortaleza que cobrem o periodo [p_inicio, p_fim)
  v_dia_inicio := (p_inicio at time zone 'America/Fortaleza')::date;
  v_dia_fim := ((p_fim - interval '1 microsecond') at time zone 'America/Fortaleza')::date;

  with dias as (
    select g::date as dia
    from generate_series(v_dia_inicio::timestamp, v_dia_fim::timestamp, interval '1 day') as g
  ),
  ev as (
    select (e.criado_em at time zone 'America/Fortaleza')::date as dia,
           count(distinct e.visitante_hash) as visitantes,
           count(*) as pageviews
    from public.eventos e
    where e.tipo = 'pageview' and e.criado_em >= p_inicio and e.criado_em < p_fim
    group by 1
  ),
  ld as (
    select (l.criado_em at time zone 'America/Fortaleza')::date as dia,
           count(*) as leads
    from public.leads l
    where l.criado_em >= p_inicio and l.criado_em < p_fim
    group by 1
  )
  select coalesce(
    jsonb_agg(
      jsonb_build_object(
        'dia', to_char(dias.dia, 'YYYY-MM-DD'),
        'visitantes', coalesce(ev.visitantes, 0),
        'pageviews', coalesce(ev.pageviews, 0),
        'leads', coalesce(ld.leads, 0)
      )
      order by dias.dia
    ),
    '[]'::jsonb
  )
  into v_por_dia
  from dias
  left join ev on ev.dia = dias.dia
  left join ld on ld.dia = dias.dia;

  select jsonb_build_object(
    'visitantes', (
      select count(distinct e.visitante_hash) from public.eventos e
      where e.tipo = 'pageview' and e.criado_em >= p_inicio and e.criado_em < p_fim
    ),
    'pageviews', (
      select count(*) from public.eventos e
      where e.tipo = 'pageview' and e.criado_em >= p_inicio and e.criado_em < p_fim
    ),
    'leads', (
      select count(*) from public.leads l
      where l.criado_em >= p_inicio and l.criado_em < p_fim
    ),
    'por_dia', v_por_dia,
    'ctas', coalesce((
      select jsonb_agg(jsonb_build_object('alvo', t.alvo, 'cliques', t.cliques))
      from (
        select e.alvo, count(*) as cliques
        from public.eventos e
        where e.tipo = 'cta_click' and e.alvo is not null
          and e.criado_em >= p_inicio and e.criado_em < p_fim
        group by e.alvo
        order by count(*) desc, e.alvo
        limit 10
      ) t
    ), '[]'::jsonb),
    'origens', coalesce((
      select jsonb_agg(jsonb_build_object('origem', t.origem, 'visitantes', t.visitantes))
      from (
        select coalesce(e.utm_source, e.referrer_host, 'direto') as origem,
               count(distinct e.visitante_hash) as visitantes
        from public.eventos e
        where e.tipo = 'pageview' and e.criado_em >= p_inicio and e.criado_em < p_fim
        group by 1
        order by count(distinct e.visitante_hash) desc, 1
        limit 8
      ) t
    ), '[]'::jsonb),
    'dispositivos', coalesce((
      select jsonb_agg(jsonb_build_object('dispositivo', t.dispositivo, 'visitantes', t.visitantes))
      from (
        select e.dispositivo, count(distinct e.visitante_hash) as visitantes
        from public.eventos e
        where e.tipo = 'pageview' and e.criado_em >= p_inicio and e.criado_em < p_fim
        group by e.dispositivo
        order by count(distinct e.visitante_hash) desc, e.dispositivo
      ) t
    ), '[]'::jsonb)
  )
  into v_resultado;

  return v_resultado;
end;
$$;

-- P75 e percentual "bom" por metrica e dispositivo
create or replace function public.web_vitals_resumo(p_inicio timestamptz, p_fim timestamptz)
returns table (
  metrica text,
  dispositivo text,
  p75 double precision,
  amostras bigint,
  pct_bom numeric
)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not (select private.is_admin()) then
    raise exception 'acesso negado' using errcode = '42501';
  end if;

  return query
  select
    w.metrica,
    w.dispositivo,
    percentile_cont(0.75) within group (order by w.valor)::double precision,
    count(*),
    round(100.0 * count(*) filter (where w.rating = 'good') / count(*), 1)
  from public.web_vitals w
  where w.criado_em >= p_inicio and w.criado_em < p_fim
  group by w.metrica, w.dispositivo
  order by w.metrica, w.dispositivo;
end;
$$;

-- P75 por versao da landing (somente vitals com versao_id)
create or replace function public.web_vitals_por_versao(p_inicio timestamptz)
returns table (
  versao_id uuid,
  publicado_em timestamptz,
  nota text,
  metrica text,
  dispositivo text,
  p75 double precision,
  amostras bigint
)
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not (select private.is_admin()) then
    raise exception 'acesso negado' using errcode = '42501';
  end if;

  return query
  select
    v.id,
    v.publicado_em,
    v.nota,
    w.metrica,
    w.dispositivo,
    percentile_cont(0.75) within group (order by w.valor)::double precision,
    count(*)
  from public.web_vitals w
  join public.landing_versoes v on v.id = w.versao_id
  where w.versao_id is not null and w.criado_em >= p_inicio
  group by v.id, v.publicado_em, v.nota, w.metrica, w.dispositivo
  order by v.publicado_em desc nulls last, w.metrica, w.dispositivo;
end;
$$;

-- g) Retencao: eventos e web vitals com mais de 90 dias; leads arquivados com mais de 2 anos
create or replace function private.limpar_telemetria()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  delete from public.eventos where criado_em < now() - interval '90 days';
  delete from public.web_vitals where criado_em < now() - interval '90 days';
  delete from public.leads where status = 'arquivado' and criado_em < now() - interval '2 years';
end;
$$;

-- Permissoes das funcoes
-- Publicas (formulario e telemetria): execute para anon e authenticated
revoke execute on function public.registrar_lead(text, text, text, text, text, text, text, text, text, text, text) from public;
grant execute on function public.registrar_lead(text, text, text, text, text, text, text, text, text, text, text) to anon, authenticated;

revoke execute on function public.registrar_telemetria(text, text, jsonb, jsonb) from public;
grant execute on function public.registrar_telemetria(text, text, jsonb, jsonb) to anon, authenticated;

-- Leitura do dashboard: somente authenticated (a funcao ainda confere admin)
revoke execute on function public.metricas_resumo(timestamptz, timestamptz) from public, anon;
grant execute on function public.metricas_resumo(timestamptz, timestamptz) to authenticated;

revoke execute on function public.web_vitals_resumo(timestamptz, timestamptz) from public, anon;
grant execute on function public.web_vitals_resumo(timestamptz, timestamptz) to authenticated;

revoke execute on function public.web_vitals_por_versao(timestamptz) from public, anon;
grant execute on function public.web_vitals_por_versao(timestamptz) to authenticated;

-- Retencao: somente o pg_cron (dono da funcao) executa
revoke execute on function private.limpar_telemetria() from public, anon, authenticated;

-- h) Agendamento diario (03h UTC) com pg_cron. Idempotente: desagenda antes de agendar.
create extension if not exists pg_cron;

do $$
begin
  if exists (select 1 from cron.job where jobname = 'limpar-telemetria') then
    perform cron.unschedule('limpar-telemetria');
  end if;

  perform cron.schedule('limpar-telemetria', '0 3 * * *', 'select private.limpar_telemetria()');
end $$;
