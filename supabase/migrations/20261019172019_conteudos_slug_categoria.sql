-- Slug e categoria para os conteudos (projetos publicados na landing).

-- a) Colunas novas. slug entra como nullable para o backfill abaixo.
alter table public.conteudos
  add column if not exists slug text,
  add column if not exists categoria text;

-- b) Backfill dos slugs existentes a partir do titulo.
-- Remove acentos, normaliza para [a-z0-9-] e resolve colisoes com sufixo -2, -3...
do $$
declare
  registro record;
  base text;
  candidato text;
  sufixo integer;
begin
  for registro in
    select id, titulo from public.conteudos order by criado_em, id
  loop
    base := coalesce(
      nullif(
        trim(both '-' from regexp_replace(
          lower(translate(
            registro.titulo,
            'áàâãäéèêëíìîïóòôõöúùûüçñÁÀÂÃÄÉÈÊËÍÌÎÏÓÒÔÕÖÚÙÛÜÇÑ',
            'aaaaaeeeeiiiiooooouuuucnAAAAAEEEEIIIIOOOOOUUUUCN'
          )),
          '[^a-z0-9]+', '-', 'g'
        )),
        ''
      ),
      'conteudo'
    );

    candidato := base;
    sufixo := 1;
    while exists (select 1 from public.conteudos where slug = candidato) loop
      sufixo := sufixo + 1;
      candidato := base || '-' || sufixo;
    end loop;

    update public.conteudos set slug = candidato where id = registro.id;
  end loop;
end $$;

-- c) Restricoes. Depois do backfill nao ha linhas com slug nulo.
alter table public.conteudos
  alter column slug set not null;

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'conteudos_slug_key'
      and conrelid = 'public.conteudos'::regclass
  ) then
    alter table public.conteudos
      add constraint conteudos_slug_key unique (slug);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'conteudos_slug_formato'
      and conrelid = 'public.conteudos'::regclass
  ) then
    alter table public.conteudos
      add constraint conteudos_slug_formato
      check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 1 and 120);
  end if;

  if not exists (
    select 1 from pg_constraint
    where conname = 'conteudos_categoria_tamanho'
      and conrelid = 'public.conteudos'::regclass
  ) then
    alter table public.conteudos
      add constraint conteudos_categoria_tamanho
      check (categoria is null or char_length(categoria) between 1 and 60);
  end if;
end $$;
