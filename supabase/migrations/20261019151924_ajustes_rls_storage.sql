-- Ajustes de RLS, integridade e storage.

-- a) Schema privado para o helper de admin (nao exposto pela Data API)
create schema if not exists private;

-- Helper: verdadeiro quando o JWT do usuario tem app_metadata.role = 'admin'
create or replace function private.is_admin()
returns boolean
language sql
stable
security invoker
set search_path = ''
as $$
  select coalesce(((select auth.jwt()) -> 'app_metadata' ->> 'role') = 'admin', false)
$$;

grant usage on schema private to anon, authenticated;
grant execute on function private.is_admin() to anon, authenticated;
revoke execute on function private.is_admin() from public;

-- b) Policies de public.clientes e public.conteudos: troca por versao com private.is_admin()
-- Remove as policies antigas de clientes
drop policy "Admin pode ler todos os clientes" on public.clientes;
drop policy "Publico pode ler clientes publicados" on public.clientes;
drop policy "Admin pode criar clientes" on public.clientes;
drop policy "Admin pode editar clientes" on public.clientes;
drop policy "Admin pode excluir clientes" on public.clientes;

-- Remove as policies antigas de conteudos
drop policy "Admin pode ler todos os conteudos" on public.conteudos;
drop policy "Publico pode ler conteudos publicados" on public.conteudos;
drop policy "Admin pode criar conteudos" on public.conteudos;
drop policy "Admin pode editar conteudos" on public.conteudos;
drop policy "Admin pode excluir conteudos" on public.conteudos;

-- Novas policies de clientes
create policy "clientes: leitura" on public.clientes
  for select to anon, authenticated
  using (status = 'published' or (select private.is_admin()));

create policy "clientes: admin cria" on public.clientes
  for insert to authenticated
  with check ((select private.is_admin()));

create policy "clientes: admin edita" on public.clientes
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "clientes: admin exclui" on public.clientes
  for delete to authenticated
  using ((select private.is_admin()));

-- Novas policies de conteudos
create policy "conteudos: leitura" on public.conteudos
  for select to anon, authenticated
  using (status = 'published' or (select private.is_admin()));

create policy "conteudos: admin cria" on public.conteudos
  for insert to authenticated
  with check ((select private.is_admin()));

create policy "conteudos: admin edita" on public.conteudos
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "conteudos: admin exclui" on public.conteudos
  for delete to authenticated
  using ((select private.is_admin()));

-- c) Integridade: unicidade e tamanhos de campos
-- Caminhos de arquivo nao podem repetir entre clientes/conteudos
alter table public.clientes
  add constraint clientes_caminho_logo_key unique (caminho_logo),
  add constraint clientes_nome_tamanho check (char_length(nome) between 2 and 120);

alter table public.conteudos
  add constraint conteudos_caminho_midia_key unique (caminho_midia),
  add constraint conteudos_titulo_tamanho check (char_length(titulo) between 1 and 90),
  add constraint conteudos_descricao_tamanho check (char_length(descricao) between 1 and 400);

-- Nome unico sem diferenciar maiusculas/minusculas (substitui a unique case-sensitive)
create unique index clientes_nome_lower_key on public.clientes (lower(nome));
alter table public.clientes drop constraint clientes_nome_key;

-- d) Funcao do trigger: search_path fixo e now() qualificado
alter function public.definir_atualizado_em() set search_path = '';

-- create or replace substitui todos os atributos, por isso search_path = '' e repetido aqui
create or replace function public.definir_atualizado_em()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.atualizado_em = pg_catalog.now();
  return new;
end;
$$;

-- e) Storage: policies do bucket 'miniverso' com private.is_admin()
drop policy "Admin pode listar arquivos do miniverso" on storage.objects;
drop policy "Admin pode enviar arquivos para o miniverso" on storage.objects;
drop policy "Admin pode atualizar arquivos do miniverso" on storage.objects;
drop policy "Admin pode excluir arquivos do miniverso" on storage.objects;

-- Leitura: admin ve tudo; anon/usuario comum ve somente midias de itens publicados
-- (uma unica policy de select evita multiplas policies permissivas)
create policy "miniverso: leitura" on storage.objects
  for select to anon, authenticated
  using (
    bucket_id = 'miniverso'
    and (
      (select private.is_admin())
      or exists (
        select 1 from public.clientes c
        where c.caminho_logo = storage.objects.name and c.status = 'published'
      )
      or exists (
        select 1 from public.conteudos m
        where m.caminho_midia = storage.objects.name and m.status = 'published'
      )
    )
  );

create policy "miniverso: admin envia" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'miniverso' and (select private.is_admin()));

create policy "miniverso: admin atualiza" on storage.objects
  for update to authenticated
  using (bucket_id = 'miniverso' and (select private.is_admin()))
  with check (bucket_id = 'miniverso' and (select private.is_admin()));

create policy "miniverso: admin exclui" on storage.objects
  for delete to authenticated
  using (bucket_id = 'miniverso' and (select private.is_admin()));

-- f) Bucket: limite de 50 MB (teto do plano gratuito) e tipos aceitos
update storage.buckets
set file_size_limit = 52428800,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'video/mp4', 'video/webm']
where id = 'miniverso';
