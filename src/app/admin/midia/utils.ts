export type TipoMidia = "imagem" | "video";

/** Formatos aceitos por tipo, com a extensão usada no caminho do arquivo. */
export const formatosPorTipo: Record<TipoMidia, Record<string, string>> = {
  imagem: {
    "image/jpeg": "jpg",
    "image/png": "png",
    "image/webp": "webp",
    "image/avif": "avif",
  },
  video: {
    "video/mp4": "mp4",
    "video/webm": "webm",
  },
};

/** Limite por tipo no browser. O teto absoluto do bucket é 50 MB. */
export const limiteBytesPorTipo: Record<TipoMidia, number> = {
  imagem: 10 * 1024 * 1024,
  video: 50 * 1024 * 1024,
};

export const rotuloTipoMidia: Record<TipoMidia, string> = {
  imagem: "Imagem",
  video: "Vídeo",
};

/** Texto de ajuda com os formatos e limites do tipo, usado em campos e estados vazios. */
export function descricaoFormatos(tipo: TipoMidia) {
  return tipo === "imagem"
    ? "JPG, PNG, WebP ou AVIF, até 10 MB."
    : "MP4 ou WebM, até 50 MB.";
}

/** Tipo e extensão de um arquivo, ou `null` quando o formato não é aceito. */
export function classificarArquivo(
  arquivo: File,
  tipoEsperado?: TipoMidia,
): { tipo: TipoMidia; extensao: string } | null {
  for (const tipo of ["imagem", "video"] as const) {
    if (tipoEsperado && tipo !== tipoEsperado) continue;

    const extensao = formatosPorTipo[tipo][arquivo.type];
    if (extensao) return { tipo, extensao };
  }

  return null;
}

const formatadorNumero = new Intl.NumberFormat("pt-BR", {
  maximumFractionDigits: 1,
});

/** Tamanho legível em pt-BR, ex.: "2,4 MB". */
export function formatarTamanho(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${formatadorNumero.format(bytes / 1024)} KB`;
  return `${formatadorNumero.format(bytes / (1024 * 1024))} MB`;
}

/** Lê largura e altura de uma imagem ou vídeo no browser. `null` se o arquivo não carregar. */
export function lerDimensoes(
  arquivo: File,
  tipo: TipoMidia,
): Promise<{ largura: number; altura: number } | null> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(arquivo);

    const finalizar = (
      resultado: { largura: number; altura: number } | null,
    ) => {
      URL.revokeObjectURL(url);
      resolve(resultado);
    };

    if (tipo === "imagem") {
      const imagem = new Image();
      imagem.onload = () =>
        finalizar({
          largura: imagem.naturalWidth,
          altura: imagem.naturalHeight,
        });
      imagem.onerror = () => finalizar(null);
      imagem.src = url;
      return;
    }

    const video = document.createElement("video");
    video.preload = "metadata";
    video.onloadedmetadata = () =>
      finalizar({ largura: video.videoWidth, altura: video.videoHeight });
    video.onerror = () => finalizar(null);
    video.src = url;
  });
}
