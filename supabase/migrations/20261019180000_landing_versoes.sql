-- Versoes da landing page editavel.
-- Cada linha guarda o conteudo completo (jsonb) de uma versao da landing.
-- Existe no maximo 1 rascunho (draft) e 1 publicada (published); as demais ficam como archived.
-- Quando nao ha versao publicada, a aplicacao usa os defaults definidos em codigo.

-- Tabela de versoes
create table public.landing_versoes (
  id uuid primary key default gen_random_uuid(),
  conteudo jsonb not null,
  status text not null default 'draft',
  nota text null,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  publicado_em timestamptz null,
  constraint landing_versoes_conteudo_objeto_check check (jsonb_typeof(conteudo) = 'object'),
  constraint landing_versoes_conteudo_tamanho_check check (octet_length(conteudo::text) < 500000),
  constraint landing_versoes_status_check check (status in ('draft', 'published', 'archived')),
  constraint landing_versoes_nota_tamanho_check check (nota is null or char_length(nota) <= 200),
  constraint landing_versoes_publicado_em_check check (status = 'draft' or publicado_em is not null)
);

-- Indices
-- Unicidade: um unico rascunho e uma unica versao publicada
create unique index landing_versoes_um_rascunho on public.landing_versoes (status) where status = 'draft';
create unique index landing_versoes_uma_publicada on public.landing_versoes (status) where status = 'published';
-- Historico: versoes publicadas e arquivadas, da mais recente para a mais antiga
create index landing_versoes_historico_idx on public.landing_versoes (publicado_em desc) where status in ('published', 'archived');

-- Trigger: atualizado_em em cada UPDATE (funcao criada na baseline)
create trigger landing_versoes_definir_atualizado_em
  before update on public.landing_versoes
  for each row execute function public.definir_atualizado_em();

-- RLS habilitada
alter table public.landing_versoes enable row level security;

-- Grants: revoga tudo e concede somente o necessario
revoke all on public.landing_versoes from anon, authenticated;

grant select on public.landing_versoes to anon;
grant select, insert, update, delete on public.landing_versoes to authenticated;

-- Policies de public.landing_versoes
create policy "landing_versoes: leitura" on public.landing_versoes
  for select to anon, authenticated
  using (status = 'published' or (select private.is_admin()));

create policy "landing_versoes: admin cria" on public.landing_versoes
  for insert to authenticated
  with check ((select private.is_admin()));

create policy "landing_versoes: admin edita" on public.landing_versoes
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "landing_versoes: admin exclui" on public.landing_versoes
  for delete to authenticated
  using ((select private.is_admin()));

-- Funcoes RPC (somente admin)

-- Salva o conteudo no rascunho unico (cria ou substitui) e retorna o id
create or replace function public.salvar_rascunho_landing(p_conteudo jsonb)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if not (select private.is_admin()) then
    raise exception 'acesso negado' using errcode = '42501';
  end if;

  insert into public.landing_versoes (conteudo, status)
  values (p_conteudo, 'draft')
  on conflict (status) where status = 'draft'
  do update set conteudo = excluded.conteudo
  returning id into v_id;

  return v_id;
end;
$$;

-- Publica o rascunho: a publicada atual vira archived e o rascunho vira published (atomico)
create or replace function public.publicar_landing(p_nota text default null)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_id uuid;
begin
  if not (select private.is_admin()) then
    raise exception 'acesso negado' using errcode = '42501';
  end if;

  select id into v_id
  from public.landing_versoes
  where status = 'draft';

  if v_id is null then
    raise exception 'nenhum rascunho para publicar';
  end if;

  update public.landing_versoes
  set status = 'archived'
  where status = 'published';

  update public.landing_versoes
  set status = 'published',
      publicado_em = pg_catalog.now(),
      nota = p_nota
  where id = v_id;

  return v_id;
end;
$$;

-- Apaga o rascunho, se existir
create or replace function public.descartar_rascunho_landing()
returns void
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if not (select private.is_admin()) then
    raise exception 'acesso negado' using errcode = '42501';
  end if;

  delete from public.landing_versoes
  where status = 'draft';
end;
$$;

-- Copia o conteudo de uma versao publicada ou arquivada para o rascunho e retorna o id do rascunho
create or replace function public.restaurar_versao_landing(p_id uuid)
returns uuid
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_conteudo jsonb;
  v_id uuid;
begin
  if not (select private.is_admin()) then
    raise exception 'acesso negado' using errcode = '42501';
  end if;

  select conteudo into v_conteudo
  from public.landing_versoes
  where id = p_id
    and status in ('published', 'archived');

  if not found then
    raise exception 'versao nao encontrada';
  end if;

  insert into public.landing_versoes (conteudo, status)
  values (v_conteudo, 'draft')
  on conflict (status) where status = 'draft'
  do update set conteudo = excluded.conteudo
  returning id into v_id;

  return v_id;
end;
$$;

-- Permissoes das funcoes: sem execucao para anon e public; somente authenticated
revoke execute on function public.salvar_rascunho_landing(jsonb) from public, anon;
grant execute on function public.salvar_rascunho_landing(jsonb) to authenticated;

revoke execute on function public.publicar_landing(text) from public, anon;
grant execute on function public.publicar_landing(text) to authenticated;

revoke execute on function public.descartar_rascunho_landing() from public, anon;
grant execute on function public.descartar_rascunho_landing() to authenticated;

revoke execute on function public.restaurar_versao_landing(uuid) from public, anon;
grant execute on function public.restaurar_versao_landing(uuid) to authenticated;
