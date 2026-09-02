# Brief de superfície — Área administrativa

## Job e audiência

**Modo:** Operate.

O administrador precisa manter o conteúdo da landing page atualizado: criar, editar, excluir, ordenar, pré-visualizar e publicar itens que serão vistos pelos potenciais clientes.

A aplicação terá dois tipos de usuário: `admin` e `client`. Somente `admin` pode acessar esta área e executar operações administrativas. `client` acessa apenas a experiência pública da landing page.

## Resultado e prova

Uma tarefa deve terminar com confirmação clara do estado salvo e da visibilidade pública. Antes da publicação, o administrador deve conseguir revisar como a alteração será apresentada na landing page.

## Direção herdada

A área administrativa herda a paleta e os sinais do Mapa de Mundos, mas não transforma a operação em uma experiência lúdica. A marca aparece em detalhes precisos — azul profundo, cobalto, pequenos marcadores e linguagem de atlas — enquanto a estrutura segue padrões familiares de navegação, formulários e confirmação.

## Escopo inicial

- Navegação autenticada para conteúdo da landing page.
- Listagem com status, tipo, ordem e data de atualização.
- Formulários de criação e edição.
- Exclusão física com confirmação explícita.
- Estado de rascunho/publicado.
- Pré-visualização da alteração antes da publicação.
- Upload de imagens e vídeos.

### Modelo inicial de conteúdo

Cada item administrável terá inicialmente:

- título;
- descrição;
- imagem ou vídeo.

O modelo deve permitir ordenar os itens e controlar se estão em rascunho ou publicados.

## Acesso e persistência

- `admin`: único perfil com acesso à área administrativa e às operações de conteúdo.
- `client`: usuário da experiência pública, sem acesso às operações administrativas.
- Autenticação baseada em JWT.
- Rotas administrativas protegidas por middleware em cada requisição.
- Dados e mídias armazenados inicialmente no PostgreSQL local, executado via Docker e acessado com Prisma.
- Limite de 10 MB para imagens e 100 MB para vídeos.
- A exclusão de conteúdo será física, sem arquivamento como substituto.

## Estados e comportamento

- Carregamento com skeletons.
- Lista vazia que explica como cadastrar o primeiro conteúdo.
- Erros inline, preservando os valores digitados quando possível.
- Sucesso com confirmação textual e atualização da listagem.
- Exclusão física e irreversível somente após confirmação clara.
- Pré-visualização acontece no próprio formulário e deve deixar evidente que o conteúdo ainda não foi publicado.
- Campos obrigatórios, limites de texto, tamanho e formato de mídia inválidos devem ser informados junto ao campo.
- Navegação por teclado, foco visível e componentes sem dependência de hover.

## Layout e responsividade

Desktop prioriza navegação lateral ou superior estável e uma área de trabalho com tabela/lista. Em mobile, a navegação colapsa e cada item assume uma disposição empilhada; ações importantes permanecem alcançáveis sem exigir rolagem horizontal.

## Detalhes técnicos para a próxima etapa

- Token JWT com expiração de 15 minutos.
- Renovação válida por 7 dias.
- Claims com `name` e `email` do usuário autenticado.
- Formatos iniciais de imagem: JPEG/JPG, PNG e WebP.
- Formatos iniciais de vídeo: MP4 e WebM.
- Validar formato pelo MIME type, além do limite de tamanho do arquivo.
