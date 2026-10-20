import { z } from "zod";

import { midiaRefSchema } from "@/features/media/schema";
/** Superfícies de fundo que uma seção pode assumir (ver DESIGN.md). */
export const superficies = [
  "black",
  "violet",
  "aurora",
  "white",
  "tint",
] as const;

export const superficieSchema = z.enum(superficies, {
  error: "Escolha uma superfície válida.",
});

export type Superficie = z.infer<typeof superficieSchema>;

/** Metadados de cada tipo de seção. `ancora` é a `id` da section; `null` quando não tem link no menu. */
export const tiposSecao = {
  hero: { nome: "Hero", ancora: null },
  sobre: { nome: "Sobre", ancora: "sobre" },
  pilares: { nome: "Pilares", ancora: "pilares" },
  contadores: { nome: "Números", ancora: "numeros" },
  projetos: { nome: "Projetos", ancora: "projetos" },
  processo: { nome: "Processo", ancora: "processo" },
  depoimentos: { nome: "Depoimentos", ancora: "depoimentos" },
  clientes: { nome: "Clientes", ancora: "clientes" },
  contato: { nome: "Contato", ancora: "contato" },
} as const satisfies Record<string, { nome: string; ancora: string | null }>;

export type TipoSecao = keyof typeof tiposSecao;

/** Texto obrigatório com aparas e limite. `campo` já vem com artigo, ex.: "O título". */
function texto(campo: string, max: number) {
  return z
    .string({ error: `${campo} é obrigatório.` })
    .trim()
    .min(1, `${campo} não pode ficar vazio.`)
    .max(max, `${campo} deve ter no máximo ${max} caracteres.`);
}

// `/` isolado é caminho interno; `//host` e `/\host` são protocolo-relativo (saem do site).
const DESTINO_VALIDO = /^(#|\/(?![/\\])|https:\/\/|mailto:|tel:)/;

export const ctaSchema = z.object({
  rotulo: texto("O rótulo do botão", 40),
  destino: texto("O destino do botão", 300).refine(
    (destino) => DESTINO_VALIDO.test(destino),
    {
      message: "O destino deve começar com #, /, https://, mailto: ou tel:.",
    },
  ),
});

export type Cta = z.infer<typeof ctaSchema>;

export const visuaisHero = ["ilustracao", "imagem", "video"] as const;

const heroDados = z.object({
  rotulo: texto("O rótulo", 40),
  titulo: texto("O título", 90),
  subtitulo: texto("O subtítulo", 300),
  ctaPrimario: ctaSchema,
  ctaSecundario: ctaSchema,
});

const sobreDados = z.object({
  rotulo: texto("O rótulo", 40),
  titulo: texto("O título", 120),
  paragrafos: z
    .array(texto("O parágrafo", 600))
    .min(1, "Informe pelo menos um parágrafo.")
    .max(4, "Use no máximo 4 parágrafos."),
  principios: z
    .array(
      z.object({
        termo: texto("O termo", 40),
        descricao: texto("A descrição", 400),
      }),
    )
    .min(1, "Informe pelo menos um princípio.")
    .max(4, "Use no máximo 4 princípios."),
});

const pilaresDados = z.object({
  rotulo: texto("O rótulo", 40),
  titulo: texto("O título", 120),
  intro: texto("A introdução", 400),
  itens: z
    .array(
      z.object({
        titulo: texto("O título do pilar", 80),
        descricao: texto("A descrição", 400),
      }),
    )
    .min(1, "Informe pelo menos um pilar.")
    .max(8, "Use no máximo 8 pilares."),
});

const contadoresDados = z.object({
  rotulo: texto("O rótulo", 40),
  titulo: texto("O título", 120),
  itens: z
    .array(
      z.object({
        titulo: texto("O título do número", 60),
        numero: z
          .number({ error: "Informe o número." })
          .int("O número deve ser inteiro.")
          .min(0, "O número não pode ser negativo.")
          .max(999_999_999, "O número é grande demais."),
      }),
    )
    .min(1, "Informe pelo menos um número.")
    .max(4, "Use no máximo 4 números."),
});

const depoimentosDados = z.object({
  rotulo: texto("O rótulo", 40),
  titulo: texto("O título", 120),
  itens: z
    .array(
      z.object({
        nome: texto("O nome", 80),
        cargo: texto("O cargo", 120),
        fala: texto("A fala", 500),
      }),
    )
    .min(1, "Informe pelo menos um depoimento.")
    .max(6, "Use no máximo 6 depoimentos."),
});

const projetosDados = z.object({
  rotulo: texto("O rótulo", 40),
  titulo: texto("O título", 90),
  vazioTitulo: texto("O título do estado vazio", 90),
  vazioDescricao: texto("A descrição do estado vazio", 300),
  vazioCta: ctaSchema,
});

const processoDados = z.object({
  rotulo: texto("O rótulo", 40),
  titulo: texto("O título", 120),
  intro: texto("A introdução", 400),
  etapas: z
    .array(
      z.object({
        titulo: texto("O título da etapa", 80),
        descricao: texto("A descrição", 400),
      }),
    )
    .min(1, "Informe pelo menos uma etapa.")
    .max(6, "Use no máximo 6 etapas."),
});

const clientesDados = z.object({
  rotulo: texto("O rótulo", 40),
  titulo: texto("O título", 90),
});

const contatoDados = z.object({
  rotulo: texto("O rótulo", 40),
  titulo: texto("O título", 90),
  intro: texto("A introdução", 300),
});

/** Cabeçalho comum a todas as seções: visibilidade, superfície e dados próprios. */
function secao<T extends string, D extends z.ZodType>(tipo: T, dados: D) {
  return z.object({
    tipo: z.literal(tipo),
    visivel: z.boolean({ error: "Informe se a seção está visível." }),
    aparencia: z.object({ superficie: superficieSchema }),
    dados,
  });
}

const heroSecao = z.object({
  tipo: z.literal("hero"),
  visivel: z.boolean({ error: "Informe se a seção está visível." }),
  aparencia: z
    .object({
      superficie: superficieSchema,
      visual: z.enum(visuaisHero, {
        error: "Escolha um visual válido para o hero.",
      }),
      /** Obrigatória quando `visual` é "imagem" ou "video". */
      midia: midiaRefSchema.nullable().optional(),
    })
    .superRefine((aparencia, ctx) => {
      if (aparencia.visual === "ilustracao") return;

      if (!aparencia.midia || aparencia.midia.tipo !== aparencia.visual) {
        ctx.addIssue({
          code: "custom",
          path: ["midia"],
          message:
            aparencia.visual === "imagem"
              ? "Escolha uma imagem da biblioteca."
              : "Escolha um vídeo da biblioteca.",
        });
        return;
      }

      if (aparencia.visual === "imagem" && !aparencia.midia.alt) {
        ctx.addIssue({
          code: "custom",
          path: ["midia"],
          message: "A imagem precisa de texto alternativo na biblioteca.",
        });
      }
    }),
  dados: heroDados,
});

export const secaoSchema = z.discriminatedUnion("tipo", [
  heroSecao,
  secao("sobre", sobreDados),
  secao("pilares", pilaresDados),
  secao("contadores", contadoresDados),
  secao("projetos", projetosDados),
  secao("processo", processoDados),
  secao("depoimentos", depoimentosDados),
  secao("clientes", clientesDados),
  secao("contato", contatoDados),
]);

export type Secao = z.infer<typeof secaoSchema>;

/** Dados de uma seção específica, ex.: `DadosSecao<"hero">`. */
export type DadosSecao<T extends TipoSecao> = Extract<
  Secao,
  { tipo: T }
>["dados"];

const contatoSchema = z.object({
  email: z
    .string({ error: "Informe o e-mail de contato." })
    .trim()
    .pipe(z.email({ error: "Informe um e-mail válido." })),
  telefone: texto("O telefone", 30),
  instagramUrl: z
    .string({ error: "Informe o link do Instagram." })
    .trim()
    .pipe(
      z.url({
        protocol: /^https$/,
        error: "Informe uma URL https válida para o Instagram.",
      }),
    ),
  instagramHandle: texto("O @ do Instagram", 60),
  cidade: texto("A cidade", 80),
  estado: texto("O estado", 80),
  uf: z
    .string({ error: "Informe a UF." })
    .trim()
    .regex(/^[A-Z]{2}$/, "A UF deve ter duas letras maiúsculas."),
});

const seoSchema = z.object({
  titulo: texto("O título da página", 70),
  descricao: texto("A descrição da página", 170),
  /** Imagem de compartilhamento (Open Graph). Sem ela, usa a imagem gerada. */
  imagemOg: midiaRefSchema
    .refine((midia) => midia.tipo === "imagem", {
      message: "A imagem de compartilhamento precisa ser uma imagem.",
    })
    .nullable()
    .optional(),
});

/** Faixa de aviso no topo do site (ex.: inscrições abertas). */
const avisoSchema = z
  .object({
    ativo: z.boolean({ error: "Informe se o aviso está ativo." }),
    texto: z
      .string({ error: "Informe o texto do aviso." })
      .trim()
      .max(140, "O aviso deve ter no máximo 140 caracteres."),
    link: ctaSchema.nullable().optional(),
  })
  .superRefine((aviso, ctx) => {
    if (aviso.ativo && !aviso.texto) {
      ctx.addIssue({
        code: "custom",
        path: ["texto"],
        message: "Escreva o texto do aviso para ativá-lo.",
      });
    }
  });

const cabecalhoSchema = z.object({
  ctaRotulo: texto("O rótulo do botão", 40),
});

const rodapeSchema = z.object({
  servicos: z
    .array(texto("O serviço", 40))
    .min(1, "Informe pelo menos um serviço.")
    .max(10, "Use no máximo 10 serviços."),
});

export const configSchema = z.object({
  contato: contatoSchema,
  seo: seoSchema,
  cabecalho: cabecalhoSchema,
  rodape: rodapeSchema,
  aviso: avisoSchema,
});

export type ConfigLanding = z.infer<typeof configSchema>;

export const landingSchema = z
  .object({
    versao: z.literal(1, { error: "Versão do documento inválida." }),
    secoes: z.array(secaoSchema),
    config: configSchema,
  })
  .superRefine((doc, ctx) => {
    for (const tipo of Object.keys(tiposSecao) as TipoSecao[]) {
      const quantidade = doc.secoes.filter((s) => s.tipo === tipo).length;
      if (quantidade !== 1) {
        ctx.addIssue({
          code: "custom",
          path: ["secoes"],
          message: `A seção "${tiposSecao[tipo].nome}" deve aparecer exatamente uma vez.`,
        });
      }
    }
  });

export type LandingDocumento = z.infer<typeof landingSchema>;
