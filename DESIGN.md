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

Utilitário `bg-brand-aurora`: brilho branco/ciano no canto superior esquerdo, depois azul, violeta e preto, como nas aberturas de capítulo do manual. **No máximo dois momentos por página** (na landing: disco atrás do detector e faixa de contato; no login: painel lateral). Nunca em texto, botões ou cards.

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
- Sequência da landing: Hero (preto) → Sobre (branco) → Pilares (violeta) → Projetos (branco) → Clientes (tint) → Contato (gradiente) → Rodapé (preto).
- Índices `/ 01 … / 06` porque as seções seguem o percurso do visitante do brief.
- Mobile empilha tudo, reduz o detector e troca os anéis de missão/visão/valores por linhas.

## Components and interaction

- **BrandMark:** logo horizontal oficial (`white` em fundo escuro, `color` em fundo claro). Nunca distorcer, inclinar, rotacionar, refletir ou mudar opacidade (manual, página 17).
- **Delineado:** o contorno do isotipo (`mask-delineado`, recolorido por `background-color`) é a assinatura gráfica. Aparece grande no hero e no painel do login, sempre atrás do conteúdo.
- **DetectorEvent:** SVG editorial (anéis, eixos, três trilhas e o visor do isotipo). É ilustração da proposta, `aria-hidden`, não dado real.
- **Pilares:** `details/summary` nativos; o ícone `+` gira para `×` como reforço visual.
- **EmptyState:** componente `Empty` do shadcn, com texto honesto e próximo passo.
- **Buttons:** `Button` shadcn (react-aria) com raio 4 px, alturas 40/48 px. Na landing, CTA primário ciano sobre escuro e azul sobre claro; secundário em contorno.
- **Campos:** `Field` + `FieldLabel` + `FieldError`, borda visível (`border-input`), 44 px de altura, `data-invalid` no `Field` e `aria-invalid` no controle. Valores digitados são preservados em erro.

## Admin

- Shell: sidebar preta fixa no desktop, topbar com menu em `Dialog` no mobile, `aria-current="page"` no item ativo, skip link e um único `<main id="conteudo">`.
- Área de trabalho clara (`#F5F7FB`), títulos em Thunder, acento azul; ciano só no indicador do item ativo.
- Listas: tabela no desktop, lista empilhada no mobile, sem rolagem horizontal. Status com `StatusBadge` (Rascunho/Publicado).
- Exclusão física sempre por `Dialog` `role="alertdialog"`, foco inicial em “Cancelar”.
- Sucesso: mensagem textual (`?feedback=` após o redirect) com estado de visibilidade na landing.
- `/admin` e `/login` têm `noindex` e estão bloqueados no `robots.txt`.

## Motion and states

Uma única animação autoral: o pulso do detector, lento e removido em `prefers-reduced-motion` (o scroll suave também). Hover muda cor; nada depende de hover. Todo fluxo novo define loading (`Skeleton`), erro, vazio e desabilitado antes de ser publicado.

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
