-- Conclui a troca para public.midias. Aplicar SOMENTE depois de scripts/backfill-media.ts
-- rodar sem falhas: todo conteudo tem midia_id e todo cliente tem logo_id.
-- Remove o legado (caminho_midia, tipo_midia, caminho_logo) e as policies do bucket privado 'miniverso'.

-- a) Guarda: aborta se o backfill nao preencheu todas as linhas
do $$
declare
  v_pendentes integer;
begin
  select count(*) into v_pendentes
  from public.conteudos
  where midia_id is null;

  if v_pendentes > 0 then
    raise exception 'backfill incompleto: % conteudos sem midia_id', v_pendentes;
  end if;

  select count(*) into v_pendentes
  from public.clientes
  where logo_id is null;

  if v_pendentes > 0 then
    raise exception 'backfill incompleto: % clientes sem logo_id', v_pendentes;
  end if;
end;
$$;

-- b) Colunas obrigatorias
alter table public.conteudos alter column midia_id set not null;
alter table public.clientes alter column logo_id set not null;

-- c) Storage: nenhuma policy do bucket 'miniverso' e mais necessaria.
-- A policy de leitura referencia as colunas que serao removidas; as de escrita nao sao mais usadas.
-- O bucket e os objetos sao mantidos para limpeza manual.
drop policy if exists "miniverso: leitura" on storage.objects;
drop policy if exists "miniverso: admin envia" on storage.objects;
drop policy if exists "miniverso: admin atualiza" on storage.objects;
drop policy if exists "miniverso: admin exclui" on storage.objects;

-- d) Remove o legado. A unicidade de caminho_midia/caminho_logo sai junto com as colunas;
-- as constraints sao removidas explicitamente para deixar a intencao clara.
alter table public.conteudos
  drop constraint if exists conteudos_caminho_midia_key,
  drop constraint if exists conteudos_tipo_midia_check;

alter table public.clientes
  drop constraint if exists clientes_caminho_logo_key;

alter table public.conteudos
  drop column if exists caminho_midia,
  drop column if exists tipo_midia;

alter table public.clientes
  drop column if exists caminho_logo;
