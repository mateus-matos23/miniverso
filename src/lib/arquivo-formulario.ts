/**
 * Leva o arquivo escolhido pelo `FileTrigger` para um `input[type=file]` escondido
 * com `name`, que é quem entra no FormData do `<form action>`.
 *
 * O `FileTrigger` do React Aria renderiza o próprio input sem `name` e não expõe
 * a referência dele, então copiamos a seleção para o nosso input via `DataTransfer`.
 * Passar `null` limpa o input (cancelamento ou arquivo recusado).
 */
export function sincronizarArquivoFormulario(
  input: HTMLInputElement | null,
  files: FileList | null,
) {
  if (!input) return;

  const transferencia = new DataTransfer();
  for (const arquivo of Array.from(files ?? [])) {
    transferencia.items.add(arquivo);
  }
  input.files = transferencia.files;
}
