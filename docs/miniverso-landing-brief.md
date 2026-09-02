# Brief de superfície — Landing page

## Job e audiência

**Modo:** Persuade.

Potenciais clientes chegam para entender quem é a Miniverso, o que ela faz, como usa realidade virtual na educação e quais trabalhos e clientes podem ser apresentados. A página deve permitir uma leitura rápida e também uma exploração mais profunda.

## Resultado e prova

Ao final da visita, a pessoa deve conseguir responder: quem é a Miniverso, qual é sua proposta de educação imersiva, que trabalhos já foram cadastrados e quais clientes podem ser associados a eles. Projetos, logos, imagens, depoimentos e métricas só entram quando fornecidos pelo administrador; estados vazios devem ser honestos.

## Direção selecionada

**Collider de Aprendizagem.** A página funciona como um visor técnico-editorial: círculos, eixos e trilhas registram os sinais de realidade virtual, gamificação e aprendizagem socioemocional. A primeira dobra explica a proposta imediatamente, enquanto a precisão visual dá energia sem inventar prova comercial.

### Percurso do visitante

1. Identificar Miniverso e sua proposta de educação através da realidade virtual.
2. Entender os pilares: aprendizagem segura, criatividade, gamificação e capacidades socioemocionais.
3. Explorar trabalhos/projetos publicados.
4. Reconhecer clientes publicados e sua relação com os projetos.
5. Encontrar Instagram, e-mail, telefone e localização para continuar a conversa.

### Assinatura de interação

Um pulso discreto no detector cria a assinatura de movimento. Os pilares usam linhas expansíveis nativas, e a navegação ancora diretamente nas seções. A interação é complementar: títulos, conteúdo e navegação normal continuam funcionando sem movimento ou efeitos avançados.

## Escopo e limites

- Superfície pública responsiva, inicialmente na rota `/`.
- Módulos propostos: apresentação, atuação/pilares, projetos, clientes e contato.
- Conteúdo deve vir da área administrativa; não criar cópia comercial definitiva antes dos dados existirem.
- O detector é uma estrutura narrativa, não uma visualização de dados reais.
- A identidade segue o manual do cliente e não copia a composição do site de referência.

## Estados e faixas de conteúdo

- Carregamento: preservar a estrutura da página e usar placeholders de baixa distração.
- Sem projetos/clientes: explicar que o conteúdo ainda não foi publicado, sem inventar exemplos.
- Erro de conteúdo: informar o problema e manter disponíveis os contatos e o restante da página.
- Quantidade: suportar poucos itens sem deixar buracos e muitos itens sem transformar a página em uma grade interminável.
- Motion reduzido: remover trilhas animadas, parallax e transições não essenciais.

## Layout e responsividade

Desktop usa uma composição editorial ampla, com a declaração de valor à esquerda e o detector de evento à direita. Mobile vira uma sequência vertical de capítulos, com anéis, trilhas e linhas simplificados. Nenhum conteúdo depende de hover, arrasto ou largura fixa.

## Restrições e decisões abertas

- Famílias tipográficas e paleta seguem o manual em `docs/manual_de_marca_miniverso.pdf`; os tokens de espaçamento e breakpoint são definidos no CSS da superfície.
- Confirmar o modelo de conteúdo administrável: tipos de projeto, cliente, imagem, ordem, publicação e relação entre itens.
- CTA e contatos confirmados: Instagram, e-mail, telefone e localização de São Luís, Maranhão.
