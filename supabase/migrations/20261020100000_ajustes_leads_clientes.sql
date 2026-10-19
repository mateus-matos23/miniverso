-- Ajustes de leads e clientes.
-- a) leads.email: rejeita ?&=#% e espacos, que quebrariam o mailto: montado no admin
--    (ex.: "a@b.co?body=x" passaria a abrir o cliente de e-mail com corpo injetado).
-- b) clientes.ordem: quando o insert nao informa ordem, o banco calcula max(ordem) + 1.
--    Assim o app nao precisa ler o maior valor antes de inserir (essa leitura era uma corrida).

-- a) CHECK de formato de e-mail. Troca em tres passos: drop, add NOT VALID (nao varre a
--    tabela no lock forte), validate (varre sem bloquear escrita).
alter table public.leads drop constraint if exists leads_email_formato_check;

alter table public.leads
  add constraint leads_email_formato_check
  check (email ~* '^[^@\s?&=#%]+@[^@\s?&=#%]+\.[^@\s?&=#%]+$') not valid;

alter table public.leads validate constraint leads_email_formato_check;

-- b) Ordem inicial de cliente.
-- Sem default: um insert sem ordem chega como NULL ao BEFORE INSERT, que preenche o valor.
-- (Com `default 0` o banco nunca veria NULL e a trigger nao dispararia.)
alter table public.clientes alter column ordem drop default;

create or replace function private.definir_ordem_cliente()
returns trigger
language plpgsql
security invoker
set search_path = ''
as $$
begin
  if new.ordem is null then
    -- Trava contra inserts concorrentes: o segundo espera o primeiro commitar e so entao
    -- le o max(). Mesmo modo usado por reordenar_clientes.
    lock table public.clientes in share row exclusive mode;

    select coalesce(max(c.ordem), -1) + 1 into new.ordem
    from public.clientes c;
  end if;

  return new;
end;
$$;

drop trigger if exists clientes_definir_ordem on public.clientes;
create trigger clientes_definir_ordem
  before insert on public.clientes
  for each row execute function private.definir_ordem_cliente();
