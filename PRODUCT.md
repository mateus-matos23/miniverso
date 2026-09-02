# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Stack

Next.js 16, React 19, TypeScript, Tailwind CSS 4 e componentes React Aria já presentes no repositório.

## Users

O público principal é formado por potenciais clientes da Miniverso (`client`). Eles chegam para entender quem é a empresa, conhecer seu trabalho e avaliar os clientes e projetos apresentados. A área administrativa será usada pelo administrador do sistema (`admin`) para criar, editar, ordenar, pré-visualizar, publicar e excluir fisicamente o conteúdo. Somente `admin` terá acesso à área administrativa e às operações.

## Product Purpose

A Miniverso promove educação através da realidade virtual, usando gamificação para proporcionar um aprendizado seguro, criativo e voltado ao desenvolvimento de capacidades socioemocionais. A landing page deve apresentar a empresa, seu trabalho, seus projetos e seus clientes. Sucesso significa que um potencial cliente consegue formar uma visão clara da Miniverso a partir do conteúdo publicado.

## Positioning

Uma edtech que combina realidade virtual e gamificação para transformar o aprendizado em experiências seguras, criativas e orientadas ao desenvolvimento socioemocional.

## Operating Context

A landing page é uma vitrine pública e responsiva. Seu conteúdo será gerenciado pelo administrador em uma área administrativa, que deverá refletir no site os itens criados, editados, publicados ou deletados. O backend utilizará Prisma e PostgreSQL 18 via Docker, com armazenamento inicial local no PostgreSQL.

## Capabilities and Constraints

- A landing page deve exibir conteúdo cadastrado pela área administrativa.
- O administrador poderá criar, editar, ordenar, pré-visualizar antes da publicação, publicar e excluir fisicamente o conteúdo da landing page.
- O tipo inicial de conteúdo terá título, descrição e imagem ou vídeo.
- A autenticação utilizará JWT, com middleware protegendo as rotas administrativas a cada requisição.
- O JWT expirará em 15 minutos, terá renovação válida por 7 dias e incluirá as claims `name` e `email`.
- Uploads terão limite de 10 MB para imagens e 100 MB para vídeos.
- Os formatos iniciais aceitos serão JPEG/JPG, PNG e WebP para imagens; MP4 e WebM para vídeos.
- A experiência deve funcionar em desktop e dispositivos móveis.

## Brand Commitments

- Nome: Miniverso.
- Instagram: https://www.instagram.com/meuminiverso/
- E-mail: miniversoedtech@gmail.com
- Telefone: +55 98 98811-8091
- Localização: São Luís, Maranhão
- A imagem de perfil fornecida em `docs/miniverso.png` é um ativo de marca confirmado.
- O manual `docs/manual_de_marca_miniverso.pdf` é a fonte oficial da identidade visual.
- O site https://miniversotech.base44.app/#home é referência de aplicação pública da marca, não uma instrução para copiar sua composição ou conteúdo.

## Evidence on Hand

- Logo/imagem de perfil: `docs/miniverso.png`.
- Manual de marca: `docs/manual_de_marca_miniverso.pdf`.
- Paleta oficial: `#1E1645`, `#1E4488`, `#0C0407` e `#00B7E3`; fontes de marca: Thunder Bold LC e Random Grotesque Standard.
- Canal social: https://www.instagram.com/meuminiverso/
- Contato: miniversoedtech@gmail.com
- Telefone: +55 98 98811-8091
- Localização: São Luís, Maranhão
- Ainda não há portfólio, clientes, depoimentos, métricas, preços ou outros conteúdos comerciais confirmados no repositório. Não inventar esses dados.

## Product Principles

- Tornar a proposta da Miniverso compreensível rapidamente.
- Mostrar o trabalho e as evidências cadastradas, em vez de depender de promessas genéricas.
- Tratar a realidade virtual como meio de aprendizagem, não como efeito decorativo.
- Permitir que o administrador mantenha a vitrine atualizada sem depender de alteração de código.

## Accessibility & Inclusion

A necessidade de uma experiência responsiva foi confirmada. Requisitos adicionais de acessibilidade ainda não foram definidos; a implementação deve manter navegação por teclado, foco visível, contraste adequado, textos alternativos e respeito a `prefers-reduced-motion`.
