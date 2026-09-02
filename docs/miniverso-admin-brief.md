# Brief de superfície — Área administrativa

## Job e audiência

**Modo:** Operate.

O administrador precisa manter o conteúdo da landing page atualizado: criar, editar, excluir, ordenar e publicar itens que serão vistos pelos potenciais clientes.

## Resultado e prova

Uma tarefa deve terminar com confirmação clara do estado salvo e da visibilidade pública. O administrador deve saber quais itens estão publicados, quais estão em rascunho e quais relações entre projeto e cliente serão exibidas na landing page.

## Direção herdada

A área administrativa herda a paleta e os sinais do Mapa de Mundos, mas não transforma a operação em uma experiência lúdica. A marca aparece em detalhes precisos — azul profundo, cobalto, pequenos marcadores e linguagem de atlas — enquanto a estrutura segue padrões familiares de navegação, formulários e confirmação.

## Escopo inicial

- Navegação autenticada para conteúdo da landing page.
- Listagem com status, tipo, ordem e data de atualização.
- Formulários de criação e edição.
- Exclusão com confirmação explícita.
- Estado de rascunho/publicado, se confirmado pelo modelo de conteúdo.
- Upload/seleção de mídia, quando o backend definir esse suporte.

## Estados e comportamento

- Carregamento com skeletons.
- Lista vazia que explica como cadastrar o primeiro conteúdo.
- Erros inline, preservando os valores digitados quando possível.
- Sucesso com confirmação textual e atualização da listagem.
- Exclusão irreversível somente após confirmação clara.
- Campos obrigatórios, limites de texto e mídia inválida devem ser informados junto ao campo.
- Navegação por teclado, foco visível e componentes sem dependência de hover.

## Layout e responsividade

Desktop prioriza navegação lateral ou superior estável e uma área de trabalho com tabela/lista. Em mobile, a navegação colapsa e cada item assume uma disposição empilhada; ações importantes permanecem alcançáveis sem exigir rolagem horizontal.

## Restrições e decisões abertas

- Definir autenticação, perfis e permissões além do administrador principal.
- Definir tipos exatos de conteúdo e o armazenamento de imagens.
- Confirmar se exclusão será física ou arquivamento.
- Definir se alterações terão pré-visualização antes da publicação.
