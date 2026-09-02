---
name: Miniverso Design System
description: Direção visual Collider de Aprendizagem, baseada no manual de marca do cliente e na direção escolhida com Impeccable.
---

<!-- impeccable:design-system -->

# Design System: Miniverso

## Creative North Star

**Collider de Aprendizagem.** A Miniverso transforma curiosidade em experiência: a página funciona como um visor técnico que registra sinais de realidade virtual, gamificação e desenvolvimento socioemocional. A precisão dos círculos, eixos e leituras cria confiança; os traços ciano, azul e amarelo dão energia e deixam claro que a tecnologia é o meio, não o produto final.

O sistema deve parecer moderno, tecnológico e divertido, como pede o manual de marca. Ele não usa ficção científica para esconder a falta de prova: projetos, clientes e resultados só aparecem quando forem publicados pelo administrador.

## Brand source of truth

O manual `docs/manual_de_marca_miniverso.pdf` define a paleta e as famílias tipográficas. O site público do cliente (`https://miniversotech.base44.app/#home`) confirma o uso expressivo dessas mesmas fontes. `docs/miniverso.png` é o ativo de marca disponível no repositório.

## Colors

### Official palette

- **Violeta Miniverso** `#1E1645`: fundos institucionais, superfícies profundas e destaque de marca.
- **Azul Miniverso** `#1E4488`: faixas de conteúdo, links secundários e contraste cromático.
- **Ciano Elétrico** `#00B7E3`: foco, linhas de leitura, sinal ativo e detalhes de realidade virtual.
- **Preto Marca** `#0C0407`: hero, navegação e texto de máxima densidade.

### Supporting tokens

- **Branco de leitura** `#FBFCFF`: superfícies claras e texto em fundos escuros.
- **Azul névoa** `#AFBDD8`: metadados e texto secundário sobre fundos escuros; nunca para corpo pequeno em fundo claro.
- **Amarelo de evento** `#F1C84B`: ação principal e momentos de maior energia.

### Named rules

**The Signal Rarity Rule.** Ciano, amarelo e azul são sinais funcionais. Cada aparição deve indicar foco, ação, conexão ou estado; não são preenchimentos decorativos em toda a interface.

**The Contrast Gate.** Corpo normal mantém pelo menos 4,5:1 e títulos grandes pelo menos 3:1. Foco visível usa ciano com contorno externo; texto secundário nunca substitui o conteúdo principal.

## Typography

- **Display:** `Thunder Bold LC`, usado em títulos curtos, grandes e em caixa alta.
- **Body:** `Random Grotesque Standard`, com `Space Grotesk` como fallback de rede.
- **Label:** o corpo em peso forte, caixa alta e espaçamento amplo para índices, leituras e metadados.

Títulos podem ser condensados e incisivos, mas precisam continuar legíveis sem depender da imagem. Texto longo usa medida confortável, altura de linha generosa e peso regular. Não usar gradiente no texto, fonte de sistema como display ou tracking apertado em parágrafos.

## Layout

O primeiro viewport é dividido entre uma declaração clara à esquerda e um **detector de evento** à direita. A navegação é curta e ancorada; os índices `/ 01`, `/ 02` e `/ 03` ajudam a escanear a página sem transformar cada seção em um card.

As seções alternam entre preto, violeta, branco e azul. Linhas horizontais, eixos e anéis criam continuidade entre elas. O conteúdo sempre permanece em fluxo vertical normal: mobile empilha a declaração e o detector, reduz a ornamentação e nunca exige arrasto, hover ou largura fixa.

## Components and interaction

- **BrandMark:** logo existente com respiro; o texto de apoio identifica “educação imersiva”.
- **DetectorEvent:** SVG editorial feito de anéis, trilhas e rótulos funcionais; é uma visualização da proposta, não um dado real.
- **SignalRow:** `details/summary` nativo para revelar a explicação de cada pilar sem JavaScript adicional.
- **EmptyState:** experiências e parcerias exibem estado honesto até que o administrador publique conteúdo.
- **Buttons:** amarelo para a ação primária e contorno para a ação secundária; ambos têm foco e hover visíveis.

## Motion and states

Há uma única animação autoral: o pulso do detector. Ela é lenta, discreta e desligada em `prefers-reduced-motion`. Estados de foco usam ciano; links e botões mudam de cor no hover; seleção de texto é ciano. Novos fluxos devem definir loading, erro, vazio e desabilitado antes de serem publicados.

## Do's and don'ts

### Do

- Mostrar a realidade virtual como meio para uma aprendizagem segura, criativa e socioemocional.
- Usar dados, projetos, clientes, imagens e depoimentos somente quando vierem do administrador.
- Preservar o logo e as cores oficiais do manual em todos os pontos de contato.
- Manter HTML semântico, contraste, `alt`, foco visível e ordem de leitura em telas pequenas.

### Don't

- Inventar portfólio, clientes, métricas, depoimentos ou resultados.
- Copiar a composição ou a identidade do site de referência do cliente.
- Usar partículas, WebGL, gradientes ou efeitos como substitutos para conteúdo real.
- Converter cada informação em um card arredondado ou esconder conteúdo atrás de hover.

## Reference artifact

- Direção escolhida: `.impeccable/mocks/decision/assigned.png`.
- Prompt embutido no artefato: `.impeccable/mocks/decision/assigned.prompt.txt`.
