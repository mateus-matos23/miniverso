/**
 * Gera um slug a partir de um texto livre: sem acentos, minúsculo, só letras,
 * números e hifens. Usado para sugerir o slug do conteúdo a partir do título.
 */
export function slugify(texto: string): string {
  return texto
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 120)
    .replace(/-+$/, "");
}
