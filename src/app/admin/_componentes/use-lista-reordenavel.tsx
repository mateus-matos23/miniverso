import { useOptimistic, useState, useTransition } from "react";
import { DropIndicator, useDragAndDrop } from "react-aria-components";

import { moverItens } from "@/lib/reordenar";

type ResultadoAcao = { erro?: string };

/**
 * Tabela reordenável por arraste: a ordem muda na hora e é salva pela action
 * `reordenar`. Também guarda o erro e o estado pendente das ações da linha.
 */
export function useListaReordenavel<T extends { id: string }>({
  itens,
  rotulo,
  reordenar,
}: {
  itens: T[];
  /** Texto enviado junto com a linha arrastada (text/plain). */
  rotulo: (item: T) => string;
  /** Salva a nova ordem, recebendo os ids na ordem exibida. */
  reordenar: (ids: string[]) => Promise<ResultadoAcao>;
}) {
  const [erro, setErro] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  // A ordem exibida muda na hora ao soltar o item. Se a action falhar, a ordem
  // volta sozinha para a que veio do servidor, porque as props não mudaram.
  const [ordemExibida, definirOrdemExibida] = useOptimistic(
    itens,
    (_atual, proxima: T[]) => proxima,
  );
  const posicoes = new Map(
    ordemExibida.map((item, indice) => [item.id, indice + 1]),
  );

  const { dragAndDropHooks } = useDragAndDrop<T>({
    // Sem isDisabled ligado ao isPending: a transição começa no drop, antes do
    // dragend, e desligar o DnD nesse meio deixava a linha presa em data-dragging.
    getItems: (_chaves, arrastados) =>
      arrastados.map((item) => ({ "text/plain": rotulo(item) })),
    renderDropIndicator: (target) => (
      <DropIndicator
        className="bg-transparent data-drop-target:bg-brand-cyan [&>td]:h-0.5 [&>td]:p-0"
        target={target}
      />
    ),
    onReorder(e) {
      if (e.target.dropPosition === "on") return;

      const proxima = moverItens(
        ordemExibida,
        (item) => item.id,
        e.keys,
        e.target.key,
        e.target.dropPosition,
      );

      if (proxima === ordemExibida) return;

      setErro(null);
      startTransition(async () => {
        definirOrdemExibida(proxima);
        const resultado = await reordenar(proxima.map((item) => item.id));
        if (resultado.erro) setErro(resultado.erro);
      });
    },
  });

  /** Roda uma ação de linha (ex.: publicar) e mostra o erro dela, se houver. */
  function executar(acao: () => Promise<ResultadoAcao>) {
    setErro(null);
    startTransition(async () => {
      const resultado = await acao();
      if (resultado.erro) setErro(resultado.erro);
    });
  }

  return {
    ordemExibida,
    posicoes,
    dragAndDropHooks,
    erro,
    isPending,
    executar,
  };
}
