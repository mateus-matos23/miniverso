"use client";

import { ImagePlusIcon } from "lucide-react";
import Image from "next/image";
import {
  type ChangeEvent,
  useActionState,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { FileTrigger } from "react-aria-components";

import {
  atualizarConteudo,
  type CadastroConteudoState,
  criarConteudo,
} from "@/app/admin/projetos/actions";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { sincronizarArquivoFormulario } from "@/lib/arquivo-formulario";
import { slugify } from "@/lib/slug";

const estadoInicial: CadastroConteudoState = {};
const TITULO_MAX = 90;
const DESCRICAO_MAX = 400;
const IMAGEM_MAX = 10 * 1024 * 1024;
const VIDEO_MAX = 50 * 1024 * 1024;
const tiposImagem = ["image/jpeg", "image/png", "image/webp"];
const tiposVideo = ["video/mp4", "video/webm"];

type Midia = { url: string; tipo: "imagem" | "video"; nome: string };

/** Monta o aria-describedby ignorando ids ausentes, para não apontar para elementos que não existem. */
function descreverPor(...ids: (string | false | null | undefined)[]) {
  return ids.filter(Boolean).join(" ") || undefined;
}

function validarMidia(arquivo: File): string | null {
  if (tiposImagem.includes(arquivo.type)) {
    return arquivo.size > IMAGEM_MAX
      ? "A imagem deve ter no máximo 10 MB."
      : null;
  }
  if (tiposVideo.includes(arquivo.type)) {
    return arquivo.size > VIDEO_MAX
      ? "O vídeo deve ter no máximo 50 MB."
      : null;
  }
  return "Formato não aceito. Envie JPG, PNG, WebP, MP4 ou WebM.";
}

type ClienteOpcao = { id: string; nome: string };

/** Projeto existente, usado no modo de edição. */
export type ConteudoEditavel = {
  id: string;
  titulo: string;
  slug: string;
  categoria: string | null;
  descricao: string;
  status: string;
  ordem: number;
  clienteId: string;
  tipoMidia: "imagem" | "video";
  /** URL assinada da mídia atual, gerada no servidor. */
  midiaUrl: string | null;
};

export default function EditorProjeto({
  clientes,
  conteudo,
}: {
  clientes: ClienteOpcao[];
  conteudo?: ConteudoEditavel;
}) {
  const id = useId();
  const [estado, acaoFormulario, pendente] = useActionState(
    conteudo ? atualizarConteudo : criarConteudo,
    estadoInicial,
  );
  const [titulo, setTitulo] = useState(conteudo?.titulo ?? "");
  const [slug, setSlug] = useState(conteudo?.slug ?? "");
  const [slugEditado, setSlugEditado] = useState(Boolean(conteudo));
  const [categoria, setCategoria] = useState(conteudo?.categoria ?? "");
  const [descricao, setDescricao] = useState(conteudo?.descricao ?? "");
  const [midia, setMidia] = useState<Midia | null>(null);
  const [erroMidia, setErroMidia] = useState<string | null>(null);
  // Input escondido que leva o arquivo escolhido pelo FileTrigger para o FormData.
  const midiaInputRef = useRef<HTMLInputElement>(null);
  // Mídia já salva: aparece até o usuário escolher um arquivo novo.
  const midiaAtual: Midia | null = conteudo?.midiaUrl
    ? {
        url: conteudo.midiaUrl,
        tipo: conteudo.tipoMidia === "video" ? "video" : "imagem",
        nome: "Mídia atual",
      }
    : null;
  const midiaExibida = midia ?? midiaAtual;

  function aoMudarTitulo(event: ChangeEvent<HTMLInputElement>) {
    const valor = event.currentTarget.value;
    setTitulo(valor);
    // O slug acompanha o título até o usuário editar o campo manualmente.
    if (!slugEditado) setSlug(slugify(valor));
  }

  useEffect(() => {
    return () => {
      if (midia) URL.revokeObjectURL(midia.url);
    };
  }, [midia]);

  function aoMudarMidia(files: FileList | null) {
    const arquivo = files?.[0];
    setErroMidia(null);

    if (!arquivo) {
      sincronizarArquivoFormulario(midiaInputRef.current, null);
      setMidia(null);
      return;
    }

    const erro = validarMidia(arquivo);
    if (erro) {
      sincronizarArquivoFormulario(midiaInputRef.current, null);
      setMidia(null);
      setErroMidia(erro);
      return;
    }

    sincronizarArquivoFormulario(midiaInputRef.current, files);
    setMidia({
      url: URL.createObjectURL(arquivo),
      tipo: arquivo.type.startsWith("video/") ? "video" : "imagem",
      nome: arquivo.name,
    });
  }

  const erros = estado.erros ?? {};

  return (
    <div className="mt-8 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(20rem,0.85fr)]">
      <form
        action={acaoFormulario}
        aria-labelledby={`${id}-formulario-titulo`}
        className="rounded-lg border border-border bg-card p-6"
      >
        {conteudo ? (
          <input name="id" type="hidden" value={conteudo.id} />
        ) : null}
        <h2
          className="text-lg font-semibold text-heading"
          id={`${id}-formulario-titulo`}
        >
          Dados do projeto
        </h2>
        <FieldGroup className="mt-6 gap-6">
          <Field data-invalid={Boolean(erros.titulo) || undefined}>
            <FieldLabel htmlFor={`${id}-titulo`}>Título</FieldLabel>
            <Input
              aria-describedby={descreverPor(
                `${id}-titulo-contador`,
                erros.titulo && `${id}-titulo-erro`,
              )}
              aria-invalid={Boolean(erros.titulo) || undefined}
              id={`${id}-titulo`}
              maxLength={TITULO_MAX}
              name="titulo"
              onChange={aoMudarTitulo}
              placeholder="Ex.: Aprender também é explorar"
              required
              value={titulo}
            />
            <FieldDescription id={`${id}-titulo-contador`}>
              {titulo.length}/{TITULO_MAX} caracteres
            </FieldDescription>
            <FieldError id={`${id}-titulo-erro`}>{erros.titulo}</FieldError>
          </Field>

          <Field data-invalid={Boolean(erros.slug) || undefined}>
            <FieldLabel htmlFor={`${id}-slug`}>Endereço (slug)</FieldLabel>
            <Input
              aria-describedby={descreverPor(
                `${id}-slug-ajuda`,
                erros.slug && `${id}-slug-erro`,
              )}
              aria-invalid={Boolean(erros.slug) || undefined}
              id={`${id}-slug`}
              maxLength={120}
              name="slug"
              onChange={(event) => {
                setSlug(event.currentTarget.value);
                setSlugEditado(true);
              }}
              placeholder="aprender-tambem-e-explorar"
              required
              value={slug}
            />
            <FieldDescription id={`${id}-slug-ajuda`}>
              Página do projeto: /projetos/{slug || "slug"}
            </FieldDescription>
            <FieldError id={`${id}-slug-erro`}>{erros.slug}</FieldError>
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field data-invalid={Boolean(erros.clienteId) || undefined}>
              <FieldLabel id={`${id}-cliente-rotulo`}>Cliente</FieldLabel>
              <Select
                aria-labelledby={`${id}-cliente-rotulo`}
                className="w-full"
                defaultSelectedKey={
                  estado.values?.clienteId || conteudo?.clienteId || undefined
                }
                name="clienteId"
                placeholder="Selecione"
              >
                <SelectTrigger
                  aria-describedby={descreverPor(
                    erros.clienteId && `${id}-cliente-erro`,
                  )}
                  aria-invalid={Boolean(erros.clienteId) || undefined}
                  id={`${id}-cliente`}
                  type="button"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {clientes.map((cliente) => (
                    <SelectItem id={cliente.id} key={cliente.id}>
                      {cliente.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError id={`${id}-cliente-erro`}>
                {erros.clienteId}
              </FieldError>
            </Field>

            <Field data-invalid={Boolean(erros.categoria) || undefined}>
              <FieldLabel htmlFor={`${id}-categoria`}>
                Categoria (opcional)
              </FieldLabel>
              <Input
                aria-describedby={descreverPor(
                  erros.categoria && `${id}-categoria-erro`,
                )}
                aria-invalid={Boolean(erros.categoria) || undefined}
                defaultValue={
                  estado.values?.categoria ?? conteudo?.categoria ?? undefined
                }
                id={`${id}-categoria`}
                maxLength={60}
                name="categoria"
                onChange={(event) => setCategoria(event.currentTarget.value)}
                placeholder="Ex.: Realidade virtual"
                type="text"
              />
              <FieldError id={`${id}-categoria-erro`}>
                {erros.categoria}
              </FieldError>
            </Field>
          </div>

          <Field data-invalid={Boolean(erros.descricao) || undefined}>
            <FieldLabel htmlFor={`${id}-descricao`}>Descrição</FieldLabel>
            <Textarea
              aria-describedby={descreverPor(
                `${id}-descricao-contador`,
                erros.descricao && `${id}-descricao-erro`,
              )}
              aria-invalid={Boolean(erros.descricao) || undefined}
              className="min-h-36"
              id={`${id}-descricao`}
              maxLength={DESCRICAO_MAX}
              name="descricao"
              onChange={(event) => setDescricao(event.currentTarget.value)}
              placeholder="Conte o que acontece nesta experiência."
              required
              value={descricao}
            />
            <FieldDescription id={`${id}-descricao-contador`}>
              {descricao.length}/{DESCRICAO_MAX} caracteres
            </FieldDescription>
            <FieldError id={`${id}-descricao-erro`}>
              {erros.descricao}
            </FieldError>
          </Field>

          <Field data-invalid={erroMidia || erros.midia ? true : undefined}>
            <FieldLabel id={`${id}-midia-rotulo`}>Imagem ou vídeo</FieldLabel>
            <FileTrigger
              acceptedFileTypes={[...tiposImagem, ...tiposVideo]}
              onSelect={aoMudarMidia}
            >
              <Button
                aria-describedby={descreverPor(
                  `${id}-midia-texto`,
                  (erroMidia || erros.midia) && `${id}-midia-erro`,
                )}
                aria-labelledby={`${id}-midia-rotulo`}
                className="h-auto w-full justify-start gap-4 rounded-md border-dashed border-input bg-muted/40 p-4 text-left font-normal whitespace-normal hover:border-primary"
                variant="outline"
              >
                <ImagePlusIcon
                  aria-hidden="true"
                  className="size-5 text-primary"
                />
                <span
                  id={`${id}-midia-texto`}
                  className="min-w-0 flex-1 text-sm"
                >
                  <span className="block truncate font-semibold text-heading">
                    {midia
                      ? midia.nome
                      : conteudo
                        ? "Trocar mídia (opcional)"
                        : "Selecionar arquivo"}
                  </span>
                  <span className="text-muted-foreground">
                    {conteudo && !midia
                      ? "Sem novo arquivo, a mídia atual é mantida. "
                      : null}
                    Imagens JPG, PNG ou WebP até 10 MB. Vídeos MP4 ou WebM até
                    50 MB.
                  </span>
                </span>
              </Button>
            </FileTrigger>
            {/* Recebe o arquivo do FileTrigger para o FormData; a validação real é no servidor. */}
            <input
              ref={midiaInputRef}
              accept={[...tiposImagem, ...tiposVideo].join(",")}
              hidden
              name="midia"
              type="file"
            />
            <FieldError id={`${id}-midia-erro`}>
              {erroMidia ?? erros.midia}
            </FieldError>
          </Field>

          <div className="grid gap-6 sm:grid-cols-2">
            <Field data-invalid={Boolean(erros.status) || undefined}>
              <FieldLabel id={`${id}-status-rotulo`}>Status</FieldLabel>
              <Select
                aria-labelledby={`${id}-status-rotulo`}
                className="w-full"
                defaultSelectedKey={
                  estado.values?.status || conteudo?.status || "draft"
                }
                name="status"
              >
                <SelectTrigger
                  aria-describedby={descreverPor(
                    erros.status && `${id}-status-erro`,
                  )}
                  aria-invalid={Boolean(erros.status) || undefined}
                  id={`${id}-status`}
                  type="button"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem id="draft">Rascunho</SelectItem>
                  <SelectItem id="published">Publicado</SelectItem>
                </SelectContent>
              </Select>
              <FieldError id={`${id}-status-erro`}>{erros.status}</FieldError>
            </Field>

            <Field data-invalid={Boolean(erros.ordem) || undefined}>
              <FieldLabel htmlFor={`${id}-ordem`}>Ordem de exibição</FieldLabel>
              <Input
                aria-describedby={descreverPor(
                  erros.ordem && `${id}-ordem-erro`,
                )}
                aria-invalid={Boolean(erros.ordem) || undefined}
                defaultValue={estado.values?.ordem ?? conteudo?.ordem ?? 0}
                id={`${id}-ordem`}
                min="0"
                name="ordem"
                required
                step="1"
                type="number"
              />
              <FieldError id={`${id}-ordem-erro`}>{erros.ordem}</FieldError>
            </Field>
          </div>
        </FieldGroup>

        <div className="mt-8 flex flex-col gap-4 border-t border-border pt-6">
          {estado.erro ? (
            <Alert variant="destructive">{estado.erro}</Alert>
          ) : null}
          <div className="flex justify-end">
            <Button isDisabled={pendente} type="submit">
              {pendente ? <Spinner data-icon="inline-start" /> : null}
              {conteudo
                ? pendente
                  ? "Salvando…"
                  : "Salvar alterações"
                : pendente
                  ? "Cadastrando…"
                  : "Cadastrar projeto"}
            </Button>
          </div>
        </div>
      </form>

      <section
        aria-labelledby={`${id}-previa-titulo`}
        className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start"
      >
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2
            className="text-lg font-semibold text-heading"
            id={`${id}-previa-titulo`}
          >
            Pré-visualização
          </h2>
          <Badge className="h-6 px-2 font-semibold" variant="secondary">
            Rascunho, ainda não publicado
          </Badge>
        </div>
        <article className="overflow-hidden rounded-lg border border-border bg-brand-white">
          <div className="grid aspect-video place-items-center overflow-hidden bg-brand-aurora text-sm text-brand-mist">
            {midiaExibida?.tipo === "imagem" ? (
              <Image
                alt=""
                className="size-full object-cover"
                height={500}
                // blob: é a prévia local do upload recém-escolhido; a URL assinada do arquivo salvo passa pelo otimizador
                src={midiaExibida.url}
                unoptimized={midiaExibida.url.startsWith("blob:")}
                width={900}
              />
            ) : null}
            {midiaExibida?.tipo === "video" ? (
              // biome-ignore lint/a11y/useMediaCaption: prévia do arquivo do projeto
              <video
                className="size-full object-cover"
                controls
                src={midiaExibida.url}
              />
            ) : null}
            {!midiaExibida ? "A mídia aparece aqui" : null}
          </div>
          <div className="p-6">
            {categoria ? (
              <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-primary">
                {categoria}
              </p>
            ) : null}
            <h3 className="font-display text-4xl font-bold leading-none text-heading">
              {titulo || "Título do conteúdo"}
            </h3>
            <p className="mt-3 text-body">
              {descricao || "A descrição aparece aqui, como na landing page."}
            </p>
          </div>
        </article>
      </section>
    </div>
  );
}
