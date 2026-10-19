import type { Key } from "react-aria-components";

/**
 * Move os itens `chaves` para antes ou depois do item `alvo`, mantendo a ordem
 * relativa entre eles. Função pura: não muda `itens`.
 *
 * Devolve a mesma referência quando o alvo está entre os itens movidos ou não
 * existe na lista. Em outros casos devolve um array novo, mesmo que a ordem
 * final seja igual à original; quem precisa saber se algo mudou compara os
 * elementos.
 */
export function moverItens<T>(
  itens: T[],
  chave: (item: T) => Key,
  chaves: ReadonlySet<Key>,
  alvo: Key,
  posicao: "before" | "after",
): T[] {
  if (chaves.has(alvo)) return itens;

  const movidos = itens.filter((item) => chaves.has(chave(item)));
  const restantes = itens.filter((item) => !chaves.has(chave(item)));
  const indiceAlvo = restantes.findIndex((item) => chave(item) === alvo);

  if (indiceAlvo === -1) return itens;

  const indice = posicao === "after" ? indiceAlvo + 1 : indiceAlvo;

  return [
    ...restantes.slice(0, indice),
    ...movidos,
    ...restantes.slice(indice),
  ];
}

/** Indica se a lista nova tem os mesmos elementos, na mesma ordem, da lista atual. */
export function mesmaOrdem<T>(atual: T[], proxima: T[]) {
  return (
    proxima.length === atual.length &&
    proxima.every((item, indice) => item === atual[indice])
  );
}
