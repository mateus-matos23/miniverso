-- Reordenacao transacional de conteudos (projetos) e clientes.
-- A lista enviada precisa conter exatamente todos os ids da tabela, sem repeticao.
-- Cada item recebe ordem = posicao (0, 1, 2...), na mesma sequencia que a landing usa.

-- Projetos (conteudos)
create or replace function public.reordenar_conteudos(p_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not (select private.is_admin()) then
    raise exception 'acesso negado' using errcode = '42501';
  end if;

  -- Trava contra inserts concorrentes enquanto a ordem e recalculada
  lock table public.conteudos in share row exclusive mode;

  if p_ids is null
    or cardinality(p_ids) <> (select count(*) from public.conteudos)
    or (select count(distinct x) from unnest(p_ids) as u(x)) <> cardinality(p_ids)
    or exists (
      select 1 from unnest(p_ids) as u(x)
      where not exists (select 1 from public.conteudos c where c.id = u.x)
    )
  then
    raise exception 'lista de ordem invalida';
  end if;

  update public.conteudos c
  set ordem = o.posicao - 1
  from unnest(p_ids) with ordinality as o(id, posicao)
  where c.id = o.id
    and c.ordem <> o.posicao - 1;
end;
$$;

-- Clientes
create or replace function public.reordenar_clientes(p_ids uuid[])
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not (select private.is_admin()) then
    raise exception 'acesso negado' using errcode = '42501';
  end if;

  -- Trava contra inserts concorrentes enquanto a ordem e recalculada
  lock table public.clientes in share row exclusive mode;

  if p_ids is null
    or cardinality(p_ids) <> (select count(*) from public.clientes)
    or (select count(distinct x) from unnest(p_ids) as u(x)) <> cardinality(p_ids)
    or exists (
      select 1 from unnest(p_ids) as u(x)
      where not exists (select 1 from public.clientes c where c.id = u.x)
    )
  then
    raise exception 'lista de ordem invalida';
  end if;

  update public.clientes c
  set ordem = o.posicao - 1
  from unnest(p_ids) with ordinality as o(id, posicao)
  where c.id = o.id
    and c.ordem <> o.posicao - 1;
end;
$$;

-- Permissoes das funcoes: sem execucao para anon e public; somente authenticated
revoke execute on function public.reordenar_conteudos(uuid[]) from public, anon;
grant execute on function public.reordenar_conteudos(uuid[]) to authenticated;

revoke execute on function public.reordenar_clientes(uuid[]) from public, anon;
grant execute on function public.reordenar_clientes(uuid[]) to authenticated;
