import type { LandingDocumento } from "./schema";

/**
 * Conteúdo atual da landing, usado quando o admin ainda não publicou um
 * documento ou quando um trecho salvo está inválido (ver `parseLanding`).
 * Sem imports de `@/lib/site`/env: este módulo também roda no client (editor).
 */
export const landingPadrao: LandingDocumento = {
  versao: 1,
  secoes: [
    {
      tipo: "hero",
      visivel: true,
      aparencia: { superficie: "black", visual: "ilustracao" },
      dados: {
        rotulo: "Miniverso",
        titulo: "Educação que acontece dentro da realidade virtual",
        subtitulo:
          "Criamos ambientes em realidade virtual e experiências gamificadas para escolas, professores e alunos, com aprendizado seguro, criativo e voltado ao desenvolvimento socioemocional.",
        ctaPrimario: {
          rotulo: "Falar com a Miniverso",
          destino: "#contato",
        },
        ctaSecundario: {
          rotulo: "Ver como funciona",
          destino: "#pilares",
        },
      },
    },
    {
      tipo: "sobre",
      visivel: true,
      aparencia: { superficie: "white" },
      dados: {
        rotulo: "Sobre",
        titulo: "A tecnologia é o meio. A aprendizagem é o destino.",
        paragrafos: [
          "A Miniverso nasceu para criar ambientes em realidade virtual voltados para a educação. Hoje também trabalha com realidade aumentada, realidade mista e vídeos 360.",
          "Apoiamos escolas que querem inovar em suas metodologias, alunos que buscam incorporar tecnologia aos estudos e professores que desejam aulas mais interessantes, cativantes e capazes de manter a atenção da turma.",
        ],
        principios: [
          {
            termo: "Missão",
            descricao:
              "Oferecer soluções inovadoras de ensino através da realidade virtual, proporcionando uma experiência de aprendizado envolvente e memorável para os alunos.",
          },
          {
            termo: "Visão",
            descricao:
              "Ser reconhecida como líder em tecnologia educacional, transformando a forma como a educação é entregue e tornando o aprendizado mais efetivo e emocionante.",
          },
          {
            termo: "Valores",
            descricao:
              "Inovação, engajamento, colaboração, diversidade e responsabilidade social.",
          },
        ],
      },
    },
    {
      tipo: "pilares",
      visivel: true,
      aparencia: { superficie: "violet" },
      dados: {
        rotulo: "Pilares",
        titulo: "O que acontece quando aprender vira experiência",
        intro:
          "A realidade virtual é o caminho. Estes são os quatro sinais que orientam cada experiência criada pela Miniverso.",
        itens: [
          {
            titulo: "Aprendizagem segura",
            descricao:
              "No ambiente virtual, o aluno pode experimentar, errar e tentar de novo sem riscos. O erro passa a fazer parte do processo.",
          },
          {
            titulo: "Criatividade",
            descricao:
              "Mundos imersivos convidam a explorar, levantar hipóteses e construir soluções próprias, em vez de apenas receber conteúdo.",
          },
          {
            titulo: "Gamificação",
            descricao:
              "Desafios, progressão e recompensas trazidos dos jogos mantêm a atenção e tornam a aula mais participativa.",
          },
          {
            titulo: "Capacidades socioemocionais",
            descricao:
              "Experiências pensadas para praticar colaboração, empatia e confiança, dentro e fora do mundo virtual.",
          },
        ],
      },
    },
    {
      // Oculta por padrão: os números abaixo são só um modelo para o admin preencher.
      tipo: "contadores",
      visivel: false,
      aparencia: { superficie: "tint" },
      dados: {
        rotulo: "Números",
        titulo: "A Miniverso em números",
        itens: [
          { titulo: "Escolas atendidas", numero: 0 },
          { titulo: "Alunos impactados", numero: 0 },
          { titulo: "Projetos entregues", numero: 0 },
        ],
      },
    },
    {
      tipo: "projetos",
      visivel: true,
      aparencia: { superficie: "white" },
      dados: {
        rotulo: "Projetos",
        titulo: "Mundos criados pela Miniverso",
        vazioTitulo: "Os projetos ainda não foram publicados",
        vazioDescricao:
          "Assim que a equipe publicar os primeiros trabalhos, eles aparecem aqui. Enquanto isso, conte o que você quer criar.",
        vazioCta: {
          rotulo: "Falar sobre um projeto",
          destino: "#contato",
        },
      },
    },
    {
      tipo: "processo",
      visivel: true,
      aparencia: { superficie: "violet" },
      dados: {
        rotulo: "Processo",
        titulo: "Do primeiro encontro à aplicação com o público",
        intro:
          "Três etapas, com a sua aprovação antes de cada avanço. Nada entra em produção sem alinhamento sobre o que será entregue.",
        etapas: [
          {
            titulo: "Ideação e planejamento",
            descricao:
              "Você recebe uma proposta com o caminho pedagógico e o escopo antes de qualquer compromisso. Participa contando o público, o contexto e os objetivos de aprendizagem.",
          },
          {
            titulo: "Criação e desenvolvimento",
            descricao:
              "Você acompanha a experiência sendo construída, com validações periódicas. Participa aprovando cada etapa antes de a próxima começar.",
          },
          {
            titulo: "Lançamento e suporte",
            descricao:
              "Você recebe a implantação da experiência e o acompanhamento da aplicação com o público. Participa levando dúvidas ao suporte, que continua depois da entrega.",
          },
        ],
      },
    },
    {
      // Oculta por padrão: o texto abaixo é só um modelo para o admin preencher.
      tipo: "depoimentos",
      visivel: false,
      aparencia: { superficie: "white" },
      dados: {
        rotulo: "Depoimentos",
        titulo: "Quem já viveu a experiência",
        itens: [
          {
            nome: "Nome da pessoa",
            cargo: "Cargo, escola ou instituição",
            fala: "Escreva aqui o depoimento.",
          },
        ],
      },
    },
    {
      tipo: "clientes",
      visivel: true,
      aparencia: { superficie: "tint" },
      dados: {
        rotulo: "Clientes",
        titulo: "Clientes e parceiros",
      },
    },
    {
      tipo: "contato",
      visivel: true,
      aparencia: { superficie: "aurora" },
      dados: {
        rotulo: "Contato",
        titulo: "Vamos criar esse mundo juntos?",
        intro:
          "Conte o que a sua escola ou turma quer tornar possível. A próxima experiência pode começar em uma conversa.",
      },
    },
  ],
  config: {
    contato: {
      email: "miniversoedtech@gmail.com",
      telefone: "+55 98 98811-8091",
      instagramUrl: "https://www.instagram.com/meuminiverso/",
      instagramHandle: "@meuminiverso",
      cidade: "São Luís",
      estado: "Maranhão",
      uf: "MA",
    },
    seo: {
      titulo: "Miniverso — educação através da realidade virtual",
      descricao:
        "A Miniverso cria experiências de aprendizagem em realidade virtual e gamificação para escolas, professores e alunos: aprendizado seguro, criativo e socioemocional.",
    },
    cabecalho: {
      ctaRotulo: "Fale com a gente",
    },
    aviso: {
      ativo: false,
      texto: "",
      link: null,
    },
    rodape: {
      servicos: [
        "Realidade virtual",
        "Realidade aumentada",
        "Realidade mista",
        "Vídeos 360",
        "Gamificação",
      ],
    },
  },
};
