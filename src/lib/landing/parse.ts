import type { z } from "zod";
import { landingPadrao } from "./defaults";
import {
  type ConfigLanding,
  configSchema,
  type LandingDocumento,
  landingSchema,
  type Secao,
  secaoSchema,
  type TipoSecao,
} from "./schema";

function ehRegistro(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === "object" && valor !== null && !Array.isArray(valor);
}

/**
 * Lê um documento salvo sem nunca lançar erro. Se o documento inteiro for
 * válido, é devolvido como está. Senão, aproveita cada seção válida (na ordem
 * original, sem duplicatas de tipo), troca as inválidas pelo padrão na mesma
 * posição, completa no fim os tipos que faltam
 * e troca por padrão apenas os subgrupos de `config` que estiverem inválidos.
 */
export function parseLanding(input: unknown): LandingDocumento {
  const completo = landingSchema.safeParse(input);
  if (completo.success) {
    return completo.data;
  }

  const bruto = ehRegistro(input) ? input : {};

  const secoes: Secao[] = [];
  const tiposUsados = new Set<TipoSecao>();

  const brutas = Array.isArray(bruto.secoes) ? bruto.secoes : [];
  for (const item of brutas) {
    const resultado = secaoSchema.safeParse(item);
    // Seção inválida mas de tipo conhecido cai no padrão na mesma posição.
    const secao = resultado.success
      ? resultado.data
      : ehRegistro(item)
        ? landingPadrao.secoes.find((padrao) => padrao.tipo === item.tipo)
        : undefined;

    if (secao && !tiposUsados.has(secao.tipo)) {
      tiposUsados.add(secao.tipo);
      secoes.push(secao);
    }
  }

  // Tipo que falta (ex.: seção criada depois da última publicação) entra logo
  // após o tipo que o antecede no padrão, em vez de cair no fim da página.
  for (const [posicao, padrao] of landingPadrao.secoes.entries()) {
    if (tiposUsados.has(padrao.tipo)) continue;

    const anterior = landingPadrao.secoes
      .slice(0, posicao)
      .reverse()
      .map((outra) => secoes.findIndex((secao) => secao.tipo === outra.tipo))
      .find((indice) => indice !== -1);
    secoes.splice(anterior === undefined ? 0 : anterior + 1, 0, padrao);
  }

  const configBruta = ehRegistro(bruto.config) ? bruto.config : {};
  const { contato, seo, cabecalho, rodape, aviso } = landingPadrao.config;
  const config: ConfigLanding = {
    contato: subgrupo(configSchema.shape.contato, configBruta.contato, contato),
    seo: subgrupo(configSchema.shape.seo, configBruta.seo, seo),
    cabecalho: subgrupo(
      configSchema.shape.cabecalho,
      configBruta.cabecalho,
      cabecalho,
    ),
    rodape: subgrupo(configSchema.shape.rodape, configBruta.rodape, rodape),
    aviso: subgrupo(configSchema.shape.aviso, configBruta.aviso, aviso),
  };

  return { versao: 1, secoes, config };
}

/** Valida um subgrupo de `config` e cai no padrão só dele, se estiver inválido. */
function subgrupo<S extends z.ZodType>(
  schema: S,
  valor: unknown,
  padrao: z.output<S>,
): z.output<S> {
  const resultado = schema.safeParse(valor);
  return resultado.success ? resultado.data : padrao;
}

/** Converte o telefone de exibição em href, ex.: "+55 98 98811-8091" → "tel:+5598988118091". */
export function telefoneHref(telefone: string): string {
  return `tel:+${telefone.replace(/\D/g, "")}`;
}
