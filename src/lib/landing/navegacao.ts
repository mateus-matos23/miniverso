import {
  type LandingDocumento,
  type Secao,
  type TipoSecao,
  tiposSecao,
} from "./schema";

export type SecaoNumerada = Secao & { numero: string };

/**
 * Seções visíveis, na ordem do documento, com o número do índice ("01", "02"…).
 * O hero também conta, como no índice atual da landing.
 */
export function derivarSecoes(doc: LandingDocumento): SecaoNumerada[] {
  return doc.secoes
    .filter((secao) => secao.visivel)
    .map((secao, indice) => ({
      ...secao,
      numero: String(indice + 1).padStart(2, "0"),
    }));
}

/** Link do menu, ex.: `{ href: "/#sobre", label: "Sobre" }`. */
export type LinkNav = { href: string; label: string };

/** Links do menu: seções visíveis com âncora, exceto o hero. */
export function derivarLinksNav(doc: LandingDocumento): LinkNav[] {
  return doc.secoes.flatMap((secao) => {
    const ancora = tiposSecao[secao.tipo].ancora;
    if (!secao.visivel || secao.tipo === "hero" || ancora === null) {
      return [];
    }
    return [{ href: `/#${ancora}`, label: secao.dados.rotulo }];
  });
}

/** Props de um componente de seção da landing, ex.: `PropsSecao<"hero">`. */
export type PropsSecao<T extends TipoSecao> = {
  secao: Extract<SecaoNumerada, { tipo: T }>;
};
