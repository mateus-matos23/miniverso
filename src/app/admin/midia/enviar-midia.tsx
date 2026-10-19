"use client";

import { Trash2Icon, TriangleAlertIcon, UploadIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useEffect, useId, useState } from "react";
import { DropZone, FileTrigger } from "react-aria-components";
import { toast } from "sonner";
import { registrarMidia } from "@/app/admin/midia/actions";
import {
  classificarArquivo,
  descricaoFormatos,
  formatarTamanho,
  formatosPorTipo,
  lerDimensoes,
  limiteBytesPorTipo,
  rotuloTipoMidia,
  type TipoMidia,
} from "@/app/admin/midia/utils";
import { Alert } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import type { MidiaRef } from "@/lib/landing/schema";
import { BUCKET_SITE } from "@/lib/storage";
import { createClient } from "@/utils/supabase/client";

type Etapa = "idle" | "lendo" | "enviando" | "registrando";

// Avisos de peso: não impedem o envio, só alertam sobre a velocidade do topo da página.
const LIMITE_BYTES_AVISO_IMAGEM = 1024 * 1024;
const LIMITE_LARGURA_AVISO_IMAGEM = 2560;
const LIMITE_BYTES_AVISO_VIDEO = 15 * 1024 * 1024;

const avisoPesoImagem =
  "Arquivo pesado: pode deixar a página lenta, principalmente no celular. Para o topo da página, prefira imagens de até 2560 px e 1 MB.";
const avisoPesoVideo =
  "Arquivo pesado: pode deixar a página lenta, principalmente no celular. Para o topo da página, prefira vídeos de até 15 MB.";

const rotuloEtapa: Record<Exclude<Etapa, "idle">, string> = {
  lendo: "Lendo o arquivo…",
  enviando: "Enviando para a biblioteca…",
  registrando: "Registrando a mídia…",
};

export function EnviarMidia({
  tipo,
  onEnviada,
}: {
  /** Restringe os formatos aceitos a um tipo (ex.: o seletor de imagens). */
  tipo?: TipoMidia;
  onEnviada?: (midia: MidiaRef) => void;
}) {
  const uid = useId();
  const router = useRouter();
  const [arquivo, setArquivo] = useState<File | null>(null);
  const [erroArquivo, setErroArquivo] = useState<string>();
  const [alt, setAlt] = useState("");
  const [erroAlt, setErroAlt] = useState<string>();
  const [etapa, setEtapa] = useState<Etapa>("idle");

  const ocupado = etapa !== "idle";
  const textoEtapa = etapa === "idle" ? null : rotuloEtapa[etapa];
  const [pesoLido, setPesoLido] = useState<{
    arquivo: File;
    pesada: boolean;
  }>();
  const tipoDoArquivo = arquivo ? classificarArquivo(arquivo, tipo) : null;
  const tipoSelecionado = tipoDoArquivo?.tipo;

  // Imagem: a largura só se descobre lendo o arquivo, então a checagem é assíncrona.
  useEffect(() => {
    if (!arquivo || tipoSelecionado !== "imagem") return;

    let cancelado = false;
    lerDimensoes(arquivo, "imagem").then((dimensoes) => {
      if (cancelado) return;
      setPesoLido({
        arquivo,
        pesada:
          arquivo.size > LIMITE_BYTES_AVISO_IMAGEM ||
          (dimensoes?.largura ?? 0) > LIMITE_LARGURA_AVISO_IMAGEM,
      });
    });

    return () => {
      cancelado = true;
    };
  }, [arquivo, tipoSelecionado]);

  const avisoPeso =
    arquivo &&
    tipoSelecionado === "video" &&
    arquivo.size > LIMITE_BYTES_AVISO_VIDEO
      ? avisoPesoVideo
      : pesoLido?.arquivo === arquivo && pesoLido.pesada
        ? avisoPesoImagem
        : null;
  const aceitos = Object.keys(
    tipo
      ? formatosPorTipo[tipo]
      : { ...formatosPorTipo.imagem, ...formatosPorTipo.video },
  );

  function limpar() {
    setArquivo(null);
    setAlt("");
    setErroAlt(undefined);
  }

  function escolherArquivo(file: File | undefined) {
    setErroArquivo(undefined);
    setErroAlt(undefined);

    if (!file) {
      setArquivo(null);
      return;
    }

    const classificado = classificarArquivo(file, tipo);

    if (!classificado) {
      setArquivo(null);
      setErroArquivo(
        tipo
          ? `Escolha um arquivo de ${rotuloTipoMidia[tipo].toLowerCase()} válido.`
          : "Formato não suportado. Use JPG, PNG, WebP, AVIF, MP4 ou WebM.",
      );
      return;
    }

    if (file.size > limiteBytesPorTipo[classificado.tipo]) {
      setArquivo(null);
      setErroArquivo(
        `${rotuloTipoMidia[classificado.tipo]} deve ter no máximo ${formatarTamanho(limiteBytesPorTipo[classificado.tipo])}.`,
      );
      return;
    }

    setArquivo(file);
  }

  async function enviar(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!arquivo || !tipoDoArquivo) return;

    const textoAlt = alt.trim();

    if (tipoDoArquivo.tipo === "imagem" && !textoAlt) {
      setErroAlt("Informe o texto alternativo da imagem.");
      return;
    }

    setErroAlt(undefined);
    setEtapa("lendo");

    const { tipo: tipoFinal, extensao } = tipoDoArquivo;
    const dimensoes = await lerDimensoes(arquivo, tipoFinal);
    const caminho = `biblioteca/${crypto.randomUUID()}.${extensao}`;

    setEtapa("enviando");
    const supabase = createClient();
    const { error: uploadError } = await supabase.storage
      .from(BUCKET_SITE)
      .upload(caminho, arquivo, {
        contentType: arquivo.type,
        cacheControl: "31536000",
        upsert: false,
      });

    if (uploadError) {
      setEtapa("idle");
      toast.error("Não foi possível enviar o arquivo. Tente novamente.");
      return;
    }

    setEtapa("registrando");
    const resultado = await registrarMidia({
      caminho,
      tipo: tipoFinal,
      mime: arquivo.type,
      tamanho: arquivo.size,
      largura: dimensoes?.largura ?? null,
      altura: dimensoes?.altura ?? null,
      alt: tipoFinal === "imagem" ? textoAlt : "",
    });

    if (!resultado.ok) {
      // Sem registro, o arquivo não aparece na biblioteca: removemos para não deixar lixo.
      await supabase.storage.from(BUCKET_SITE).remove([caminho]);
      setEtapa("idle");
      toast.error(resultado.erro);
      return;
    }

    setEtapa("idle");
    limpar();
    toast.success(`${rotuloTipoMidia[tipoFinal]} enviada à biblioteca.`);
    onEnviada?.(resultado.midia);
    // Atualiza a lista da página (server component) com o item recém-registrado.
    router.refresh();
  }

  const fieldId = `${uid}-enviar`;

  return (
    <form className="flex flex-col gap-4" onSubmit={enviar} noValidate>
      <DropZone
        aria-label="Área para soltar o arquivo"
        className="flex flex-col items-center gap-3 rounded-xl border-2 border-dashed border-border bg-muted/40 px-6 py-8 text-center transition-colors hover:border-primary/50 data-[drop-target]:border-primary/60 data-[drop-target]:bg-accent"
        getDropOperation={() => (ocupado ? "cancel" : "copy")}
        isDisabled={ocupado}
        onDrop={async (event) => {
          const item = event.items.find((item) => item.kind === "file");
          if (item?.kind === "file") escolherArquivo(await item.getFile());
        }}
      >
        <span
          aria-hidden="true"
          className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-accent text-primary"
        >
          <UploadIcon className="size-5" />
        </span>
        <FileTrigger
          acceptedFileTypes={aceitos}
          onSelect={(files) => escolherArquivo(files?.[0])}
        >
          <Button
            type="button"
            variant="outline"
            isDisabled={ocupado}
            aria-describedby={
              erroArquivo ? `${fieldId}-arquivo-erro` : undefined
            }
          >
            {tipo
              ? `Escolher ${rotuloTipoMidia[tipo].toLowerCase()}`
              : "Escolher arquivo"}
          </Button>
        </FileTrigger>
        <p className="min-w-0 text-sm text-muted-foreground">
          {arquivo ? (
            <span className="flex min-w-0 flex-wrap items-center justify-center gap-x-3 gap-y-0.5">
              <span className="min-w-0 truncate font-medium text-foreground">
                {arquivo.name}
              </span>
              <span className="shrink-0">{formatarTamanho(arquivo.size)}</span>
            </span>
          ) : tipo ? (
            descricaoFormatos(tipo)
          ) : (
            "Imagens: JPG, PNG, WebP ou AVIF, até 10 MB. Vídeos: MP4 ou WebM, até 50 MB."
          )}
        </p>
      </DropZone>

      {erroArquivo ? (
        <p
          id={`${fieldId}-arquivo-erro`}
          className="text-sm text-destructive"
          role="alert"
        >
          {erroArquivo}
        </p>
      ) : null}

      {avisoPeso ? (
        <Alert role="status" variant="warning">
          <TriangleAlertIcon
            aria-hidden="true"
            className="mt-0.5 size-4 shrink-0"
          />
          {avisoPeso}
        </Alert>
      ) : null}

      {tipoDoArquivo?.tipo === "imagem" ? (
        <Field data-invalid={Boolean(erroAlt) || undefined}>
          <FieldLabel htmlFor={`${fieldId}-alt`}>Texto alternativo</FieldLabel>
          <Input
            id={`${fieldId}-alt`}
            name="alt"
            type="text"
            maxLength={200}
            value={alt}
            disabled={ocupado}
            placeholder="Descreva o que aparece na imagem"
            aria-invalid={Boolean(erroAlt) || undefined}
            aria-describedby={`${fieldId}-alt-ajuda${erroAlt ? ` ${fieldId}-alt-erro` : ""}`}
            onChange={(event) => setAlt(event.currentTarget.value)}
          />
          <p
            id={`${fieldId}-alt-ajuda`}
            className="text-xs text-muted-foreground"
          >
            Usado por leitores de tela. Obrigatório para imagens.
          </p>
          <FieldError id={`${fieldId}-alt-erro`}>{erroAlt}</FieldError>
        </Field>
      ) : null}

      {arquivo ? (
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" isDisabled={ocupado}>
            {ocupado ? <Spinner /> : null}
            {textoEtapa ?? "Enviar à biblioteca"}
          </Button>
          {!ocupado ? (
            <Button type="button" variant="ghost" onPress={limpar}>
              <Trash2Icon aria-hidden="true" data-icon="inline-start" />
              Remover seleção
            </Button>
          ) : null}
        </div>
      ) : null}

      <p className="sr-only" role="status" aria-live="polite">
        {textoEtapa ?? ""}
      </p>
    </form>
  );
}
