-- Ajustes de midia e telemetria.
-- a) Indice da paginacao por cursor de listarMidias (criado_em desc, id desc).
-- b) midias_criado_em_idx fica redundante com o indice novo.
-- c) definir_atualizado_em e funcao de trigger: ninguem precisa executa-la diretamente.
-- d) limpar_telemetria apaga em lotes de 5000 ate nao sobrar linha vencida.

-- a) Paginacao por cursor: ordem (criado_em desc, id desc) cobre o ORDER BY e o filtro do cursor.
create index if not exists midias_criado_em_id_idx on public.midias (criado_em desc, id desc);

-- b) O indice (criado_em desc) e prefixo do novo; remove o redundante.
drop index if exists public.midias_criado_em_idx;

-- c) Trigger function: so o gatilho a usa. Revoga execucao direta do client e do public.
revoke execute on function public.definir_atualizado_em() from public, anon, authenticated;

-- d) Retencao em lotes. Mesma regra da versao anterior:
--    eventos e web_vitals com mais de 90 dias; leads arquivados com mais de 2 anos.
--    Lotes de 5000 evitam um DELETE gigante de uma vez. Dentro de uma unica chamada de
--    funcao tudo ainda roda numa transacao; so o tamanho de cada statement e limitado.
create or replace function private.limpar_telemetria()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_lote constant integer := 5000;
  v_linhas integer;
begin
  loop
    delete from public.eventos
    where id in (
      select e.id from public.eventos e
      where e.criado_em < now() - interval '90 days'
      limit v_lote
    );
    get diagnostics v_linhas = row_count;
    exit when v_linhas = 0;
  end loop;

  loop
    delete from public.web_vitals
    where id in (
      select w.id from public.web_vitals w
      where w.criado_em < now() - interval '90 days'
      limit v_lote
    );
    get diagnostics v_linhas = row_count;
    exit when v_linhas = 0;
  end loop;

  loop
    delete from public.leads
    where id in (
      select l.id from public.leads l
      where l.status = 'arquivado' and l.criado_em < now() - interval '2 years'
      limit v_lote
    );
    get diagnostics v_linhas = row_count;
    exit when v_linhas = 0;
  end loop;
end;
$$;

-- Mantem a execucao restrita (o cron roda como dono da funcao)
revoke execute on function private.limpar_telemetria() from public, anon, authenticated;
