# Miniverso

Aplicação web da Miniverso para apresentar sua proposta de educação imersiva e administrar conteúdos, clientes e experiências. O projeto possui uma landing page pública e uma área administrativa protegida por autenticação do Supabase.

## Stack

- Next.js 16 com App Router e React 19
- TypeScript
- Supabase para autenticação e persistência
- Tailwind CSS 4
- React Aria Components para os componentes acessíveis da interface
- Biome para lint e formatação
- pnpm como gerenciador de pacotes

## Pré-requisitos

- Node.js 24.18.0
- pnpm 11.6.0
- Um projeto Supabase configurado

## Configuração local

1. Instale as dependências:

   ```bash
   pnpm install
   ```

2. Crie o arquivo `.env` na raiz do projeto:

   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua-chave-publicavel
   ```

   Essas variáveis são validadas ao iniciar a aplicação. O arquivo `.env*` não deve ser versionado.

3. Inicie o servidor de desenvolvimento:

   ```bash
   pnpm dev
   ```

4. Acesse [http://localhost:3000](http://localhost:3000).

## Rotas principais

- `/` — landing page pública.
- `/login` — autenticação do administrador.
- `/admin` — painel administrativo protegido.
- `/admin/clientes` — gerenciamento de clientes.
- `/admin/conteudos/novo` — criação de conteúdo.

O acesso administrativo exige um usuário autenticado no Supabase com `app_metadata.role` igual a `admin`.

## Comandos

```bash
pnpm dev      # inicia o desenvolvimento
pnpm build    # gera o build de produção
pnpm start    # executa o build de produção
pnpm lint     # verifica o código com Biome
pnpm format   # formata os arquivos com Biome
```

Para validar uma versão de produção localmente:

```bash
pnpm build
pnpm start
```

## Estrutura do projeto

```text
src/
├── app/                        # rotas (URLs) e layouts; sem lógica de negócio
│   ├── (site)/                 # site público: `/`, `/previa`, `/projetos/[slug]`
│   ├── (admin)/                # área administrativa: `/admin/*` e `/login`
│   ├── api/eventos/            # endpoint de eventos de telemetria
│   └── layout.tsx, providers.tsx, globals.css, metadados e ícones da raiz
├── features/<domínio>/         # regras por domínio: auth, clients, leads, media, projects, landing, dashboard, telemetry, site
│   ├── schema.ts               # validação zod e tipos (client-safe)
│   ├── data.ts                 # acesso ao Supabase
│   ├── actions.ts              # server actions
│   ├── components/             # componentes do domínio
│   └── site/                   # site público: components/ (landing, header, footer) e sections/ (seções da landing)
├── components/
│   ├── admin/                  # shell do admin: navegação, painel, cabeçalho, diálogos
│   ├── motion/                 # wrappers de animação reutilizáveis
│   └── ui/                     # componentes shadcn (gerados, não editar à mão)
├── config/                     # validação de configuração e ambiente
├── hooks/                      # hooks React compartilhados
└── lib/                        # utilitários e clientes Supabase (lib/supabase/)
```

## Regras de dependência

- Fluxo permitido: `app/` → `features/` → `lib/`, `components/`, `hooks/`.
- `src/features/**`, `src/components/**`, `src/lib/**` e `src/hooks/**` não importam de `@/app/*`.
- `src/components/**`, `src/lib/**` e `src/hooks/**` não importam de `@/features/*`. Esta regra é imposta pelo Biome (`overrides` em `biome.json`).
- Acesso ao Supabase só em `features/*/data.ts` (e nos clientes em `lib/supabase/`).
- `schema.ts` deve ser client-safe. `constants.ts` deve ficar sem zod em componentes públicos.
- Sem barrels (`index.ts` reexportando módulos).

## Documentação do produto

- [Product](./PRODUCT.md) — propósito, público, capacidades e restrições.
- [Design System](./DESIGN.md) — direção visual, cores, tipografia e interação.
- [Brief da landing page](./docs/miniverso-landing-brief.md) — escopo e comportamento da superfície pública.
- [Brief da área administrativa](./docs/miniverso-admin-brief.md) — escopo e comportamento do painel.

## Desenvolvimento

Antes de enviar uma alteração, execute pelo menos:

```bash
pnpm lint
pnpm build
```

Ao alterar comportamento ou componentes da interface, mantenha a acessibilidade e reutilize os componentes existentes em `src/components/ui`.
