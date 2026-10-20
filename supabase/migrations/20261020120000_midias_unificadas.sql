-- Unificacao das midias: projetos (conteudos) e clientes passam a referenciar public.midias por FK.
-- Esta migration so adiciona as colunas novas (nullable) e libera a leitura publica de midias
-- publicadas. As colunas antigas (caminho_midia, tipo_midia, caminho_logo) continuam existindo.
-- O script scripts/backfill-media.ts copia os arquivos do bucket privado 'miniverso' para o
-- bucket publico 'site' e preenche midia_id/logo_id. Somente depois dele roda a migration
-- 20261020130000_remover_midia_privada.sql, que torna as colunas obrigatorias e remove o legado.

-- a) Referencias para public.midias (nullable ate o backfill terminar)
alter table public.conteudos
  add column midia_id uuid,
  add constraint conteudos_midia_id_fkey foreign key (midia_id) references public.midias (id) on delete restrict;

create index conteudos_midia_id_idx on public.conteudos (midia_id);

alter table public.clientes
  add column logo_id uuid,
  add constraint clientes_logo_id_fkey foreign key (logo_id) references public.midias (id) on delete restrict;

create index clientes_logo_id_idx on public.clientes (logo_id);

-- b) Leitura publica de midias: anon so enxerga midias usadas por itens publicados.
-- Admin continua vendo tudo. Uma unica policy de select evita multiplas policies permissivas.
grant select on public.midias to anon;

drop policy "midias: admin le" on public.midias;

create policy "midias: leitura" on public.midias
  for select to anon, authenticated
  using (
    (select private.is_admin())
    or exists (
      select 1 from public.conteudos c
      where c.midia_id = midias.id and c.status = 'published'
    )
    or exists (
      select 1 from public.clientes cl
      where cl.logo_id = midias.id and cl.status = 'published'
    )
  );
