---
name: Miniverso Design System
description: Direção visual Collider de Aprendizagem, baseada no manual de marca do cliente. Tokens em src/app/globals.css.
---

<!-- impeccable:design-system -->

# Design System: Miniverso

## Creative North Star

**Collider de Aprendizagem.** A Miniverso transforma curiosidade em experiência: a página funciona como um visor técnico que registra sinais de realidade virtual, gamificação e desenvolvimento socioemocional. A precisão dos círculos, eixos e leituras cria confiança; o ciano e o gradiente da marca dão energia e deixam claro que a tecnologia é o meio, não o produto final.

O sistema deve parecer moderno, tecnológico e divertido, como pede o manual de marca. Ele não usa ficção científica para esconder a falta de prova: projetos, clientes e resultados só aparecem quando forem publicados pelo administrador.

## Brand source of truth

O manual `docs/manual_de_marca.pdf` define a paleta, as famílias tipográficas, as variações de logo e os usos incorretos. Logos otimizados ficam em `public/brand/` (gerados a partir de `docs/logos/`); fontes em `src/app/fonts/` (carregadas por `next/font/local`). O site `https://melted.studio/` é inspiração para o cliente, não modelo de composição.

## Colors

### Official palette (manual, página 13)

- **Violeta Miniverso** `#1E1645` (`brand-violet`): seções institucionais e títulos sobre fundo claro.
- **Azul Miniverso** `#1E4488` (`brand-blue`): ação primária e links sobre fundo claro, foco em fundo claro.
- **Ciano Elétrico** `#00B7E3` (`brand-cyan`): ação primária e foco **somente sobre fundo escuro**, sinal ativo.
- **Preto Marca** `#0C0407` (`brand-black`): hero, header, rodapé e texto de máxima densidade.

### Supporting tokens

- **Branco de leitura** `#FBFCFF` (`brand-white`): superfícies claras e texto em fundos escuros.
- **Azul névoa** `#AFBDD8` (`brand-mist`): texto secundário **apenas** sobre fundos escuros.
- **Tinta** `#28395C` (`brand-ink`): corpo de texto sobre fundo claro.
- **Linha** `#C9D2E3` (`brand-line`) e **Tint** `#EEF2F9` (`brand-tint`): divisórias e faixa clara alternativa.
- Não há amarelo nem outras cores fora do manual.

### Brand gradient

Utilitário `bg-brand-aurora`: brilho branco/ciano no canto superior esquerdo, depois azul, violeta e preto, como nas aberturas de capítulo do manual. **No máximo dois momentos por página** (na landing: faixa de contato; no login: painel lateral). Nunca em texto, botões ou cards.

### Named rules

**The Signal Rarity Rule.** Ciano e azul são sinais funcionais: foco, ação, conexão ou estado. Não são preenchimentos decorativos.

**The Contrast Gate.** Corpo normal mantém pelo menos 4,5:1 e títulos grandes pelo menos 3:1. Ciano nunca é texto sobre fundo claro (≈2,3:1).

**The Surface Rule.** Toda superfície escura recebe `data-surface="dark"`. Isso troca `--ring` para ciano, `--muted-foreground` para névoa e habilita a variante `surface-dark:`. Em fundo claro o foco é azul.

## Typography

- **Display:** `Thunder BoldLC` (500 MediumLC disponível). Sentence case, como no manual. Escala: `text-display-xl` / `text-display-lg` / `text-display-md` (fluidas com `clamp`, leading 0,86–0,95).
- **Body:** `Random Grotesk Standard` (Book 400, Medium 500, Semibold 600, Bold 700). Base 17 px, line-height 1,6, medida de até ~68ch.
- **Label:** `text-label` (12 px, tracking 0,12em, caixa alta) apenas para índices de seção, rótulos do detector e legendas de contato. Nada abaixo de 12 px.

Não usar gradiente em texto, nem destacar uma palavra isolada do título com outra cor.

## Layout

- Container `max-w-[90rem]` com `px-5 / sm:px-8 / lg:px-12`; seções com `py-24 / lg:py-32`.
- Header sticky (`--header-height: 4.5rem`), âncoras com `scroll-margin-top` automático.
- Sequência da landing: Hero (preto) → Sobre (branco) → Pilares (violeta) → Números (tint, opcional) → Projetos (branco) → Processo (violeta) → Depoimentos (branco, opcional) → Clientes (tint) → Contato (gradiente) → Rodapé (preto). Números e Depoimentos vêm ocultos por padrão e são editados e ativados no admin; a ordem e a superfície também são editáveis lá.
- Índices `/ 01 …` (só das seções visíveis) porque as seções seguem o percurso do visitante do brief.
- Mobile empilha tudo (verificado em 390 px, sem overflow horizontal), reduz o detector e troca os anéis de missão/visão/valores por linhas.

## Components and interaction

- **BrandMark:** logo horizontal oficial (`white` em fundo escuro, `color` em fundo claro). Nunca distorcer, inclinar, rotacionar, refletir ou mudar opacidade (manual, página 17).
- **Delineado:** o contorno do isotipo (`mask-delineado`, recolorido por `background-color`) é a assinatura gráfica. Aparece grande no hero e no painel do login, sempre atrás do conteúdo.
- **DetectorEvent:** SVG editorial de um headset de realidade virtual em traço, com anéis nas lentes e três trilhas (Realidade virtual, Gamificação, Socioemocional) saindo dele, sobre um brilho ciano difuso (não é mais o disco `bg-brand-aurora`). É ilustração da proposta, `aria-hidden`, não dado real.
- **PrincipiosAneis:** missão, visão e valores como três anéis sobrepostos no desktop (contorno em degradê que se desenha, anel pontilhado girando, ponto em órbita, halo no hover); lista simples no mobile.
- **Cabeçalho:** `NavLinks` destaca a seção visível (`aria-current="location"`); sombra e filete ciano surgem com a rolagem via `animation-timeline: scroll()` (utilitário `header-sombra`, sem JS).
- **Formulário de contato:** rótulos flutuantes (`peer` + `placeholder=" "`; o select usa `flutuante`), botão com preenchimento (`fill-sweep`) e check de sucesso desenhado.
- **Números (`CountersSection`):** de 1 a 4 pares título + número inteiro, em tipografia display grande; `Contador` sobe de 0 ao valor uma vez ao entrar na tela (valor final sem JS ou com movimento reduzido; leitor de tela lê só o valor final). Não invente números: só publique dados reais.
- **Depoimentos (`TestimonialsSection`):** de 1 a 6 cartões com fala, nome e cargo, em `figure`/`blockquote`, com iniciais do nome no avatar. Sem foto de propósito.
- **Pilares:** `details/summary` nativos; o ícone `+` gira para `×` como reforço visual.
- **EmptyState:** componente `Empty` do shadcn, com texto honesto e próximo passo.
- **Buttons:** `Button` shadcn (react-aria) com raio 4 px, alturas 40/48 px. Na landing, CTA primário ciano sobre escuro e azul sobre claro; secundário em contorno.
- **Campos:** `Field` + `FieldLabel` + `FieldError`, borda visível (`border-input`), 44 px de altura, `data-invalid` no `Field` e `aria-invalid` no controle. Valores digitados são preservados em erro.

## Admin

- Shell: `Sidebar` do shadcn na variante `inset`, colapsável para ícones (Ctrl/⌘+B, estado no cookie `sidebar_state`), preta (`--sidebar*` em `globals.css`), com grupos Geral / Conteúdo / Contatos, conta no rodapé e `data-surface="dark"`. No mobile abre como `Sheet`. `aria-current="page"` no item ativo, skip link e um único `<main id="conteudo">` (`SidebarInset`).
- Topbar do inset: `SidebarTrigger` + breadcrumb ("Painel / Seção / Página").
- Área de trabalho clara (`#F5F7FB`), cantos um pouco maiores que os da landing (`[data-admin]` define `--radius: 0.375rem`). Títulos de página em Thunder contido (`text-4xl`/`text-5xl`), sem divisória; seções em Random Grotesk semibold. Acento azul; ciano só no indicador do item ativo e no contador de leads da sidebar.
- Superfície padrão: `Painel` (`src/components/admin/panel.tsx`), cartão com cabeçalho opcional. Para `<li>`/`<article>`, use a constante `superficie`. Estados vazios usam `Empty` com borda tracejada.
- Listas: tabela no desktop, lista empilhada no mobile, sem rolagem horizontal. Status com `StatusBadge` (Rascunho/Publicado).
- Exclusão física sempre por `Dialog` `role="alertdialog"`, foco inicial em “Cancelar”.
- Sucesso: mensagem textual (`?feedback=` após o redirect) com estado de visibilidade na landing.
- `/admin` e `/login` têm `noindex` e estão bloqueados no `robots.txt`.

## Motion and states

O movimento conta a metáfora do collider: sinais são detectados e aparecem. Biblioteca: Motion (`motion/react`, via `LazyMotion` + `m`), com wrappers em `src/components/motion/` (`Reveal`, `RevealTitulo`, `Stagger`/`StaggerItem`, `IndexLine`, `LinhaSecao`, `Parallax`, `ScrollProgress`) e easing `signalEase` igual ao do pulso.

- **Assinatura:** sequência de entrada do detector (anéis → três trilhas desenhadas uma a uma → nós → rótulos) e o pulso contínuo.
- **Reveals:** fade + subida de 16 px, 0,6 s, uma única vez (`once`) ao entrar na tela; listas em stagger. O traço do `SectionIndex` cresce da esquerda.
- **Loops:** o pulso e a rotação dos anéis (detector e `PrincipiosAneis`), a flutuação do headset e do delineado, o ponto pulsante do processo, a faixa de serviços do rodapé e as faixas de logos de clientes (CSS). As de clientes seguem a referência da Melted: uma faixa até 7 logos, duas em sentidos opostos a partir de 8, fade nas bordas, pausa no hover e os demais logos esmaecem; com movimento reduzido viram lista estática.
- **Títulos:** `RevealTitulo` sobe os `h2` palavra por palavra de dentro de uma máscara. O `h1` do hero fica fora (é o LCP).
- **Fio de seção:** `LinhaSecao` desenha um filete ciano no topo de cada seção (e do rodapé) ao entrar na tela.
- **Progresso e profundidade:** `ScrollProgress` (barra no topo) e `Parallax` leve no hero (delineado sobe, headset desce; o delineado também entra com fade).
- **Microinterações:** seta que desliza nos `CtaLink`, preenchimento `fill-sweep` nos CTAs do hero e do formulário, zoom e sombra nos cards de projeto, ponto pulsante nas etapas do processo.
- **View Transition:** a mídia do card de projeto faz morph até a página do projeto (`ViewTransition` do React, `name="projeto-<slug>"`, `share="morph"`; CSS em `::view-transition-group(.morph)`). Sem suporte do navegador, navega normalmente.
- **Pilares:** abertura do `<details>` em CSS (`details-smooth`), número ao lado do título e barra ciano lateral no item aberto.
- Somente `opacity`/`transform`/`pathLength` (e `clip` por máscara nos títulos); nada de cursor custom, scroll-jacking, tilt 3D, partículas ou animação letra a letra. O parallax é restrito ao hero. Admin e login não animam.
- `prefers-reduced-motion`: `useSignalTransition` zera as durações e o CSS desliga pulso, faixa e scroll suave.

Hover muda cor; nada depende de hover. Todo fluxo novo define loading (`Skeleton`), erro, vazio e desabilitado antes de ser publicado.

## SEO

Metadata central em `src/lib/site.ts` + `src/app/layout.tsx` (`metadataBase` via `NEXT_PUBLIC_SITE_URL`), `opengraph-image.tsx` com as fontes da marca, `robots.ts`, `sitemap.ts`, `manifest.ts`, ícones gerados do isotipo e JSON-LD `EducationalOrganization` na landing.

## Do's and don'ts

### Do

- Mostrar a realidade virtual como meio para uma aprendizagem segura, criativa e socioemocional.
- Usar dados, projetos, clientes, imagens e depoimentos somente quando vierem do administrador.
- Preservar o logo e as cores oficiais do manual em todos os pontos de contato.
- Manter HTML semântico, contraste, `alt`, foco visível e ordem de leitura em telas pequenas.

### Don't

- Inventar portfólio, clientes, métricas, depoimentos ou resultados.
- Introduzir cores fora do manual (inclusive amarelo) ou usar o gradiente em mais de dois momentos.
- Usar partículas, WebGL ou efeitos como substitutos para conteúdo real.
- Converter cada informação em um card arredondado ou esconder conteúdo atrás de hover.
