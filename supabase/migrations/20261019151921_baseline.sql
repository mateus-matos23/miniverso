-- Baseline: reproduz o schema atual do projeto remoto.

-- Tabela de clientes
create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  caminho_logo text not null,
  status text not null default 'draft',
  ordem integer not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint clientes_nome_key unique (nome),
  constraint clientes_status_check check (status in ('draft', 'published')),
  constraint clientes_ordem_check check (ordem >= 0)
);

-- Tabela de conteudos
create table public.conteudos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null,
  titulo text not null,
  descricao text not null,
  tipo_midia text not null,
  caminho_midia text not null,
  status text not null default 'draft',
  ordem integer not null default 0,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint conteudos_cliente_id_fkey foreign key (cliente_id) references public.clientes (id) on delete restrict,
  constraint conteudos_tipo_midia_check check (tipo_midia in ('imagem', 'video')),
  constraint conteudos_status_check check (status in ('draft', 'published')),
  constraint conteudos_ordem_check check (ordem >= 0)
);

-- Indices
create index clientes_publicados_ordem_idx on public.clientes (ordem, id) where status = 'published';
create index conteudos_cliente_id_idx on public.conteudos (cliente_id);
create index conteudos_publicados_ordem_idx on public.conteudos (ordem, id) where status = 'published';

-- Funcao que atualiza atualizado_em em cada UPDATE
create or replace function public.definir_atualizado_em()
returns trigger
language plpgsql
set search_path to 'public'
as $$
begin
  new.atualizado_em = now();
  return new;
end;
$$;

create trigger clientes_definir_atualizado_em
  before update on public.clientes
  for each row execute function public.definir_atualizado_em();

create trigger conteudos_definir_atualizado_em
  before update on public.conteudos
  for each row execute function public.definir_atualizado_em();

-- RLS habilitada
alter table public.clientes enable row level security;
alter table public.conteudos enable row level security;

-- Grants: revoga tudo e concede somente o necessario
revoke all on public.clientes from anon, authenticated;
revoke all on public.conteudos from anon, authenticated;

grant select on public.clientes to anon;
grant select, insert, update, delete on public.clientes to authenticated;
grant select on public.conteudos to anon;
grant select, insert, update, delete on public.conteudos to authenticated;

-- Policies de public.clientes
create policy "Admin pode ler todos os clientes" on public.clientes
  for select to authenticated
  using ((( select ((auth.jwt() -> 'app_metadata') ->> 'role')) = 'admin'));

create policy "Publico pode ler clientes publicados" on public.clientes
  for select to anon, authenticated
  using (status = 'published');

create policy "Admin pode criar clientes" on public.clientes
  for insert to authenticated
  with check ((( select ((auth.jwt() -> 'app_metadata') ->> 'role')) = 'admin'));

create policy "Admin pode editar clientes" on public.clientes
  for update to authenticated
  using ((( select ((auth.jwt() -> 'app_metadata') ->> 'role')) = 'admin'))
  with check ((( select ((auth.jwt() -> 'app_metadata') ->> 'role')) = 'admin'));

create policy "Admin pode excluir clientes" on public.clientes
  for delete to authenticated
  using ((( select ((auth.jwt() -> 'app_metadata') ->> 'role')) = 'admin'));

-- Policies de public.conteudos
create policy "Admin pode ler todos os conteudos" on public.conteudos
  for select to authenticated
  using ((( select ((auth.jwt() -> 'app_metadata') ->> 'role')) = 'admin'));

create policy "Publico pode ler conteudos publicados" on public.conteudos
  for select to anon, authenticated
  using (status = 'published');

create policy "Admin pode criar conteudos" on public.conteudos
  for insert to authenticated
  with check ((( select ((auth.jwt() -> 'app_metadata') ->> 'role')) = 'admin'));

create policy "Admin pode editar conteudos" on public.conteudos
  for update to authenticated
  using ((( select ((auth.jwt() -> 'app_metadata') ->> 'role')) = 'admin'))
  with check ((( select ((auth.jwt() -> 'app_metadata') ->> 'role')) = 'admin'));

create policy "Admin pode excluir conteudos" on public.conteudos
  for delete to authenticated
  using ((( select ((auth.jwt() -> 'app_metadata') ->> 'role')) = 'admin'));

-- Storage: bucket privado 'miniverso'
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('miniverso', 'miniverso', false, 52428800, array['image/jpeg', 'image/png', 'video/mp4'])
on conflict (id) do nothing;

-- Storage: policies do bucket 'miniverso' (somente admin)
create policy "Admin pode listar arquivos do miniverso" on storage.objects
  for select to authenticated
  using (bucket_id = 'miniverso' and (( select ((auth.jwt() -> 'app_metadata') ->> 'role')) = 'admin'));

create policy "Admin pode enviar arquivos para o miniverso" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'miniverso' and (( select ((auth.jwt() -> 'app_metadata') ->> 'role')) = 'admin'));

create policy "Admin pode atualizar arquivos do miniverso" on storage.objects
  for update to authenticated
  using (bucket_id = 'miniverso' and (( select ((auth.jwt() -> 'app_metadata') ->> 'role')) = 'admin'))
  with check (bucket_id = 'miniverso' and (( select ((auth.jwt() -> 'app_metadata') ->> 'role')) = 'admin'));

create policy "Admin pode excluir arquivos do miniverso" on storage.objects
  for delete to authenticated
  using (bucket_id = 'miniverso' and (( select ((auth.jwt() -> 'app_metadata') ->> 'role')) = 'admin'));
