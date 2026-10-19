"use client";

import { ImageIcon, Trash2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { type FormEvent, useState, useTransition } from "react";
import { toast } from "sonner";
import {
  atualizarAlt,
  excluirMidia,
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
import { Input } from "@/components/ui/input";
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

export function BibliotecaMidias({ midias }: { midias: MidiaBiblioteca[] }) {
  const router = useRouter();
  const [filtro, setFiltro] = useState<Filtro>("todas");
  const [paraExcluir, setParaExcluir] = useState<MidiaBiblioteca | null>(null);
  const [erroExclusao, setErroExclusao] = useState<string>();
  const [excluindo, startExclusao] = useTransition();

  const visiveis =
    filtro === "todas" ? midias : midias.filter((m) => m.tipo === filtro);

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
      <fieldset className="flex flex-wrap gap-2 border-0 p-0">
        <legend className="sr-only">Filtrar por tipo</legend>
        {filtros.map((item) => (
          <Button
            key={item.valor}
            type="button"
            size="sm"
            variant={filtro === item.valor ? "default" : "outline"}
            aria-pressed={filtro === item.valor}
            onClick={() => setFiltro(item.valor)}
          >
            {item.rotulo}
          </Button>
        ))}
      </fieldset>

      {visiveis.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          Nenhum item deste tipo na biblioteca.
        </p>
      ) : (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visiveis.map((midia) => (
            <li key={midia.id}>
              <CartaoMidia
                midia={midia}
                onExcluir={() => setParaExcluir(midia)}
              />
            </li>
          ))}
        </ul>
      )}

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
          <label
            htmlFor={altId}
            className="text-sm font-semibold text-brand-black"
          >
            Texto alternativo
          </label>
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
              {salvando ? "Salvando…" : "Salvar"}
            </Button>
          </div>
          {erroAlt ? (
            <p
              id={`${altId}-erro`}
              className="text-sm text-destructive"
              role="alert"
            >
              {erroAlt}
            </p>
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
