-- Biblioteca de midias do admin: bucket publico 'site' e tabela public.midias.
-- Arquivos ficam em 'biblioteca/<uuid>.<ext>' e sao servidos pela URL publica do bucket.

-- a) Bucket publico. SVG fica de fora (risco de XSS ao servir o arquivo na mesma origem).
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'site',
  'site',
  true,
  52428800,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm']
)
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

-- b) Storage: somente admin escreve e lista/remove. A leitura publica pela URL nao depende de policy.
create policy "site: admin lista" on storage.objects
  for select to authenticated
  using (bucket_id = 'site' and (select private.is_admin()));

create policy "site: admin envia" on storage.objects
  for insert to authenticated
  with check (bucket_id = 'site' and (select private.is_admin()));

create policy "site: admin atualiza" on storage.objects
  for update to authenticated
  using (bucket_id = 'site' and (select private.is_admin()))
  with check (bucket_id = 'site' and (select private.is_admin()));

create policy "site: admin exclui" on storage.objects
  for delete to authenticated
  using (bucket_id = 'site' and (select private.is_admin()));

-- c) Tabela de midias
create table public.midias (
  id uuid primary key default gen_random_uuid(),
  caminho text not null,
  tipo text not null,
  mime text not null,
  alt text not null default '',
  largura integer null,
  altura integer null,
  tamanho bigint not null,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),
  constraint midias_caminho_key unique (caminho),
  constraint midias_caminho_formato_check check (caminho ~ '^biblioteca/[0-9a-f-]{36}\.(jpg|png|webp|avif|mp4|webm)$'),
  constraint midias_tipo_check check (tipo in ('imagem', 'video')),
  constraint midias_mime_check check (mime in ('image/jpeg', 'image/png', 'image/webp', 'image/avif', 'video/mp4', 'video/webm')),
  constraint midias_alt_tamanho_check check (char_length(alt) <= 200),
  constraint midias_largura_check check (largura is null or largura > 0),
  constraint midias_altura_check check (altura is null or altura > 0),
  constraint midias_tamanho_check check (tamanho > 0)
);

-- Indices
create index midias_criado_em_idx on public.midias (criado_em desc);

-- Trigger: atualizado_em em cada UPDATE (funcao criada na baseline)
create trigger midias_definir_atualizado_em
  before update on public.midias
  for each row execute function public.definir_atualizado_em();

-- RLS habilitada
alter table public.midias enable row level security;

-- Grants: revoga tudo e concede somente o necessario. Anon nao le a tabela:
-- a landing usa a URL guardada no proprio documento.
revoke all on public.midias from anon, authenticated;
grant select, insert, update, delete on public.midias to authenticated;

-- Policies de public.midias: somente admin
create policy "midias: admin le" on public.midias
  for select to authenticated
  using ((select private.is_admin()));

create policy "midias: admin cria" on public.midias
  for insert to authenticated
  with check ((select private.is_admin()));

create policy "midias: admin edita" on public.midias
  for update to authenticated
  using ((select private.is_admin()))
  with check ((select private.is_admin()));

create policy "midias: admin exclui" on public.midias
  for delete to authenticated
  using ((select private.is_admin()));
