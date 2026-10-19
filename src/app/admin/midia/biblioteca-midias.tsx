"use client";

import { ImageIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useRef, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  atualizarAlt,
  type CursorMidias,
  excluirMidia,
  listarMidias,
  type MidiaBiblioteca,
} from "@/app/admin/midia/actions";
import { MiniaturaMidia } from "@/app/admin/midia/miniatura-midia";
import {
  formatarTamanho,
  rotuloTipoMidia,
  type TipoMidia,
} from "@/app/admin/midia/utils";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import {
  FieldError,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { FUSO } from "@/lib/formatar";
import { cn } from "@/lib/utils";

import { ConfirmarExclusaoDialog } from "../_componentes/confirmar-exclusao-dialog";

type Filtro = "todas" | TipoMidia;

const filtros: { valor: Filtro; rotulo: string }[] = [
  { valor: "todas", rotulo: "Todas" },
  { valor: "imagem", rotulo: "Imagens" },
  { valor: "video", rotulo: "Vídeos" },
];

const formatadorData = new Intl.DateTimeFormat("pt-BR", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: FUSO,
});

type Lista = {
  tipo: Filtro;
  itens: MidiaBiblioteca[];
  proximoCursor: CursorMidias | null;
  /** Primeira página recebida do servidor que originou esta lista. */
  origem: MidiaBiblioteca[];
};

export function BibliotecaMidias({
  midias,
  proximoCursor,
}: {
  midias: MidiaBiblioteca[];
  proximoCursor: CursorMidias | null;
}) {
  const router = useRouter();
  const [lista, setLista] = useState<Lista>({
    tipo: "todas",
    itens: midias,
    proximoCursor,
    origem: midias,
  });
  const [carregandoPagina, startPagina] = useTransition();
  const pedidoAtual = useRef(0);
  const [paraExcluir, setParaExcluir] = useState<MidiaBiblioteca | null>(null);
  const [erroExclusao, setErroExclusao] = useState<string>();
  const [excluindo, startExclusao] = useTransition();

  // Depois de um router.refresh (envio, exclusão ou edição) chega uma primeira página nova:
  // a lista volta para ela, descartando as páginas extras carregadas antes.
  if (lista.origem !== midias) {
    setLista({
      tipo: "todas",
      itens: midias,
      proximoCursor,
      origem: midias,
    });
  }

  function trocarFiltro(novo: Filtro) {
    if (novo === lista.tipo) return;

    const pedido = ++pedidoAtual.current;

    if (novo === "todas") {
      setLista({ tipo: "todas", itens: midias, proximoCursor, origem: midias });
      return;
    }

    startPagina(async () => {
      try {
        const pagina = await listarMidias({ tipo: novo });
        if (pedido !== pedidoAtual.current) return;
        setLista({
          tipo: novo,
          itens: pagina.itens,
          proximoCursor: pagina.proximoCursor,
          origem: midias,
        });
      } catch {
        if (pedido === pedidoAtual.current) {
          toast.error(
            "Não foi possível carregar a biblioteca. Tente novamente.",
          );
        }
      }
    });
  }

  function carregarMais() {
    const { tipo, proximoCursor: cursor } = lista;
    if (!cursor) return;

    startPagina(async () => {
      try {
        const pagina = await listarMidias({
          tipo: tipo === "todas" ? undefined : tipo,
          cursor,
        });
        // Ignora a resposta se o filtro mudou enquanto a página chegava.
        setLista((anterior) =>
          anterior.tipo === tipo && anterior.proximoCursor === cursor
            ? {
                ...anterior,
                itens: [...anterior.itens, ...pagina.itens],
                proximoCursor: pagina.proximoCursor,
              }
            : anterior,
        );
      } catch {
        toast.error("Não foi possível carregar mais mídias. Tente novamente.");
      }
    });
  }

  function fecharExclusao() {
    setParaExcluir(null);
    setErroExclusao(undefined);
  }

  function confirmarExclusao() {
    if (!paraExcluir) return;
    const id = paraExcluir.id;

    startExclusao(async () => {
      const resultado = await excluirMidia(id);

      if (!resultado.ok) {
        setErroExclusao(resultado.erro);
        return;
      }

      toast.success("Mídia excluída.");
      fecharExclusao();
      router.refresh();
    });
  }

  if (midias.length === 0) {
    return (
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <ImageIcon aria-hidden="true" />
          </EmptyMedia>
          <EmptyTitle>A biblioteca está vazia</EmptyTitle>
          <EmptyDescription>
            Envie imagens e vídeos acima. Eles ficam disponíveis para escolher
            na página inicial e nos projetos.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <FieldSet>
        <FieldLegend id="filtro-tipo-rotulo" className="sr-only">
          Filtrar por tipo
        </FieldLegend>
        <ToggleGroup
          aria-labelledby="filtro-tipo-rotulo"
          selectionMode="single"
          disallowEmptySelection
          selectedKeys={[lista.tipo]}
          onSelectionChange={(chaves) => {
            const [chave] = chaves;
            if (chave) trocarFiltro(String(chave) as Filtro);
          }}
          variant="outline"
          size="sm"
        >
          {filtros.map((item) => (
            <ToggleGroupItem key={item.valor} id={item.valor}>
              {item.rotulo}
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
      </FieldSet>

      {lista.itens.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum item deste tipo na biblioteca.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {lista.itens.map((midia) => (
            <li key={midia.id}>
              <CartaoMidia
                midia={midia}
                onExcluir={() => setParaExcluir(midia)}
              />
            </li>
          ))}
        </ul>
      )}

      {lista.proximoCursor ? (
        <div className="flex justify-center">
          <Button
            type="button"
            variant="outline"
            isDisabled={carregandoPagina}
            onPress={carregarMais}
          >
            {carregandoPagina ? "Carregando…" : "Carregar mais"}
          </Button>
        </div>
      ) : null}

      <ConfirmarExclusaoDialog
        acao={confirmarExclusao}
        aberto={paraExcluir !== null}
        descricao="O arquivo será removido da biblioteca e não poderá ser recuperado."
        erro={erroExclusao}
        onAbertoChange={fecharExclusao}
        pendente={excluindo}
        rotuloConfirmacao="Excluir mídia"
        titulo="Excluir esta mídia?"
      />
    </div>
  );
}

function CartaoMidia({
  midia,
  onExcluir,
}: {
  midia: MidiaBiblioteca;
  onExcluir: () => void;
}) {
  const router = useRouter();
  const [alt, setAlt] = useState(midia.alt);
  const [erroAlt, setErroAlt] = useState<string>();
  const [salvando, startSalvar] = useTransition();
  const semAlt = midia.tipo === "imagem" && alt.trim() === "";
  const alterado = alt !== midia.alt;
  const altId = `midia-${midia.id}-alt`;
  const dimensoes =
    midia.largura && midia.altura ? `${midia.largura} × ${midia.altura}` : null;

  function salvarAlt(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErroAlt(undefined);

    startSalvar(async () => {
      const resultado = await atualizarAlt(midia.id, alt.trim());

      if (!resultado.ok) {
        setErroAlt(resultado.erro);
        return;
      }

      toast.success("Texto alternativo salvo.");
      router.refresh();
    });
  }

  return (
    <article
      className={cn(
        "flex h-full flex-col overflow-hidden rounded-lg border bg-card",
        semAlt ? "border-destructive/40" : "border-border",
      )}
    >
      <MiniaturaMidia midia={midia} className="rounded-none" />

      <div className="flex flex-1 flex-col gap-4 p-4">
        <dl className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
          <div className="flex gap-1">
            <dt className="sr-only">Tipo</dt>
            <dd className="font-semibold text-brand-black">
              {rotuloTipoMidia[midia.tipo]}
            </dd>
          </div>
          {dimensoes ? (
            <div className="flex gap-1">
              <dt className="sr-only">Dimensões</dt>
              <dd>{dimensoes} px</dd>
            </div>
          ) : null}
          <div className="flex gap-1">
            <dt className="sr-only">Tamanho</dt>
            <dd>{formatarTamanho(midia.tamanho)}</dd>
          </div>
          <div className="flex gap-1">
            <dt className="sr-only">Enviada em</dt>
            <dd>{formatadorData.format(new Date(midia.criadoEm))}</dd>
          </div>
        </dl>

        {semAlt ? (
          <p className="text-sm font-medium text-destructive">
            Sem texto alternativo
          </p>
        ) : null}

        <form className="flex flex-col gap-2" onSubmit={salvarAlt}>
          <FieldLabel
            htmlFor={altId}
            className="font-semibold text-brand-black"
          >
            Texto alternativo
          </FieldLabel>
          <div className="flex gap-2">
            <Input
              id={altId}
              type="text"
              maxLength={200}
              value={alt}
              disabled={salvando}
              aria-invalid={Boolean(erroAlt) || undefined}
              aria-describedby={erroAlt ? `${altId}-erro` : undefined}
              onChange={(event) => setAlt(event.currentTarget.value)}
            />
            <Button
              type="submit"
              variant="outline"
              isDisabled={!alterado || salvando}
            >
              {salvando ? "Salvando…" : "Salvar texto alternativo"}
            </Button>
          </div>
          {erroAlt ? (
            <FieldError id={`${altId}-erro`}>{erroAlt}</FieldError>
          ) : null}
        </form>

        <div className="mt-auto flex justify-end">
          <Button type="button" variant="ghost" size="sm" onClick={onExcluir}>
            <Trash2Icon aria-hidden="true" />
            Excluir
          </Button>
        </div>
      </div>
    </article>
  );
}
