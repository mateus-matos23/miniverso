"use client";

import { useRouter } from "next/navigation";
import { useEffect, useRef, useState, useTransition } from "react";
import type { Key } from "react-aria-components";
import { toast } from "sonner";
import { superficie } from "@/components/admin/panel";
import { buttonVariants } from "@/components/ui/button-variants";
import {
  descartarRascunho,
  publicar,
  salvarRascunho,
} from "@/features/landing/actions";
import {
  BarraAcoes,
  type StatusSalvamento,
} from "@/features/landing/editor/action-bar";
import type { AncoraOpcao } from "@/features/landing/editor/fields/cta-field";
import { FormConfig } from "@/features/landing/editor/forms/config/config-form";
import { FormSecao } from "@/features/landing/editor/forms/section-form";
import type { Erros } from "@/features/landing/editor/forms/types";
import {
  ListaConfiguracoes,
  ListaSecoes,
} from "@/features/landing/editor/section-list";
import {
  type GrupoConfig,
  gruposConfig,
  type Selecao,
} from "@/features/landing/editor/selection";
import {
  type ConfigLanding,
  configSchema,
  type LandingDocumento,
  landingSchema,
  type Secao,
  secaoSchema,
  tiposSecao,
} from "@/features/landing/schema";
import { useMediaQuery } from "@/hooks/use-media-query";
import { mesmaOrdem, moverItens } from "@/lib/reorder";
import { cn } from "@/lib/utils";

const ATRASO_SALVAMENTO_MS = 1500;

/**
 * "pagina": lista as seções da landing. "configuracoes": lista os grupos de configuração.
 * O documento e as ações são os mesmos nos dois modos.
 */
export type ModoEditor = "pagina" | "configuracoes";

type EditorLandingProps = {
  modo: ModoEditor;
  inicial: LandingDocumento;
  /** Grupo de configuração aberto de início (vem de `?painel=`, só no modo "configuracoes"). */
  grupoInicial?: GrupoConfig;
  temRascunho: boolean;
  publicadoEm: string | null;
};

type ErroZod = { path: PropertyKey[]; message: string };

/**
 * Converte os caminhos do Zod em chaves de campo, ex.: "aparencia.midia".
 * Se `prefixo` for dado, é removido do caminho, ex.: "dados.titulo" vira "titulo".
 */
function errosDe(issues: readonly ErroZod[], prefixo?: string): Erros {
  const erros: Erros = {};
  for (const issue of issues) {
    const caminho =
      prefixo !== undefined && issue.path[0] === prefixo
        ? issue.path.slice(1)
        : issue.path;
    const chave = caminho.map(String).join(".");
    erros[chave] ??= issue.message;
  }
  return erros;
}

function errosDaSecao(secao: Secao): Erros {
  const resultado = secaoSchema.safeParse(secao);
  return resultado.success ? {} : errosDe(resultado.error.issues, "dados");
}

function errosDoGrupo(grupo: GrupoConfig, valor: unknown): Erros {
  const resultado = configSchema.shape[grupo].safeParse(valor);
  return resultado.success ? {} : errosDe(resultado.error.issues);
}

function ancorasDoDocumento(doc: LandingDocumento): AncoraOpcao[] {
  return doc.secoes.flatMap((secao) => {
    const ancora = tiposSecao[secao.tipo].ancora;
    return ancora === null
      ? []
      : [{ valor: `#${ancora}`, rotulo: tiposSecao[secao.tipo].nome }];
  });
}

export function EditorLanding({
  modo,
  inicial,
  grupoInicial,
  temRascunho: rascunhoInicial,
  publicadoEm,
}: EditorLandingProps) {
  const router = useRouter();
  // xl do Tailwind: o preview em iframe só existe no desktop.
  const desktop = useMediaQuery("(min-width: 80rem)");
  const [doc, setDoc] = useState(inicial);
  const [versao, setVersao] = useState(0);
  const [selecao, setSelecao] = useState<Selecao>(() =>
    modo === "configuracoes"
      ? { tipo: "config", grupo: grupoInicial ?? "contato" }
      : { tipo: "secao", secao: "hero" },
  );
  const [temRascunho, setTemRascunho] = useState(rascunhoInicial);
  const [status, setStatus] = useState<StatusSalvamento>({
    tipo: "salvo",
    salvoEm: null,
  });
  const [previewKey, setPreviewKey] = useState(0);
  const [emAcao, iniciarAcao] = useTransition();
  // Documento mais recente: respostas de salvamentos antigos são descartadas.
  const ultimoDoc = useRef<LandingDocumento | null>(doc);

  // Autosave: depois de um período sem mudanças, salva se o documento inteiro for válido.
  useEffect(() => {
    if (versao === 0) return;

    const timer = setTimeout(async () => {
      if (ultimoDoc.current !== doc) return;
      if (!landingSchema.safeParse(doc).success) {
        setStatus({ tipo: "invalido" });
        return;
      }

      setStatus({ tipo: "salvando" });
      const resultado = await salvarRascunho(doc);

      if (ultimoDoc.current !== doc) return;

      if (resultado.ok) {
        setTemRascunho(true);
        setPreviewKey((chave) => chave + 1);
        setStatus({ tipo: "salvo", salvoEm: resultado.salvoEm });
        return;
      }

      setStatus(
        resultado.issues.length > 0
          ? { tipo: "invalido" }
          : { tipo: "erro", mensagem: resultado.erro },
      );
    }, ATRASO_SALVAMENTO_MS);

    return () => clearTimeout(timer);
  }, [versao, doc]);

  function alterar(proximo: LandingDocumento) {
    ultimoDoc.current = proximo;
    setDoc(proximo);
    setVersao((atual) => atual + 1);
    setStatus(
      landingSchema.safeParse(proximo).success
        ? { tipo: "pendente" }
        : { tipo: "invalido" },
    );
  }

  const secaoAtual =
    selecao.tipo === "secao"
      ? doc.secoes.find((secao) => secao.tipo === selecao.secao)
      : undefined;
  const erros: Erros =
    selecao.tipo === "secao"
      ? secaoAtual
        ? errosDaSecao(secaoAtual)
        : {}
      : errosDoGrupo(selecao.grupo, doc.config[selecao.grupo]);
  const tiposComErro = new Set(
    doc.secoes
      .filter((secao) => !secaoSchema.safeParse(secao).success)
      .map((secao) => secao.tipo),
  );
  const gruposComErro = new Set(
    (Object.keys(gruposConfig) as GrupoConfig[]).filter(
      (grupo) =>
        !configSchema.shape[grupo].safeParse(doc.config[grupo]).success,
    ),
  );
  const ancoras = ancorasDoDocumento(doc);

  function alterarSecao(proxima: Secao) {
    alterar({
      ...doc,
      secoes: doc.secoes.map((secao) =>
        secao.tipo === proxima.tipo ? proxima : secao,
      ),
    });
  }

  function alterarConfig(config: ConfigLanding) {
    alterar({ ...doc, config });
  }

  function alternarVisivel(tipo: Secao["tipo"]) {
    alterar({
      ...doc,
      secoes: doc.secoes.map((secao) =>
        secao.tipo === tipo ? { ...secao, visivel: !secao.visivel } : secao,
      ),
    });
  }

  /** Move as seções `chaves` para antes ou depois de `alvo`, mantendo a ordem entre elas. */
  function reordenar(
    chaves: Iterable<Key>,
    alvo: Key,
    posicao: "before" | "after",
  ) {
    const secoes = moverItens(
      doc.secoes,
      (secao) => secao.tipo,
      new Set(chaves),
      alvo,
      posicao,
    );
    // Soltar no mesmo lugar não muda nada: não dispara o salvamento.
    if (mesmaOrdem(doc.secoes, secoes)) return;

    alterar({ ...doc, secoes });
  }

  function publicarVersao(nota: string) {
    iniciarAcao(async () => {
      const resultado = await publicar(nota || undefined);

      if (!resultado.ok) {
        toast.error(resultado.erro);
        return;
      }

      toast.success("Página publicada.");
      setTemRascunho(false);
      router.refresh();
    });
  }

  function descartar() {
    // Cancela qualquer salvamento pendente, para não recriar o rascunho descartado.
    ultimoDoc.current = null;
    iniciarAcao(async () => {
      const resultado = await descartarRascunho();

      if (!resultado.ok) {
        toast.error(resultado.erro);
        return;
      }

      toast.success("Rascunho descartado.");
      setTemRascunho(false);
      router.refresh();
    });
  }

  const idSecao =
    selecao.tipo === "secao"
      ? `secao-${selecao.secao}`
      : `config-${selecao.grupo}`;
  const preview = (
    <iframe
      key={previewKey}
      src="/previa"
      title="Pré-visualização da landing"
      className="block h-[calc(100svh-6.5rem)] w-full border-0 bg-card"
    />
  );

  return (
    <div className="flex flex-col gap-6">
      <BarraAcoes
        status={status}
        temRascunho={temRascunho}
        publicadoEm={publicadoEm}
        emAcao={emAcao}
        onPublicar={publicarVersao}
        onDescartar={descartar}
      />

      <div className="grid gap-6 grid-editor">
        <section
          aria-labelledby="titulo-lista"
          className={cn(superficie, "flex min-w-0 flex-col gap-2 p-3")}
        >
          <h2
            id="titulo-lista"
            className="px-2 pt-1 text-sm font-semibold text-heading"
          >
            {modo === "configuracoes" ? "Configurações" : "Seções"}
          </h2>
          {modo === "configuracoes" ? (
            <ListaConfiguracoes
              selecao={selecao}
              gruposComErro={gruposComErro}
              onSelecionar={setSelecao}
            />
          ) : (
            <ListaSecoes
              secoes={doc.secoes}
              selecao={selecao}
              tiposComErro={tiposComErro}
              onSelecionar={setSelecao}
              onAlternarVisivel={alternarVisivel}
              onReordenar={reordenar}
            />
          )}
        </section>

        <section
          aria-labelledby={`${idSecao}-cabecalho`}
          className={cn(superficie, "flex min-w-0 flex-col gap-6 p-5 sm:p-6")}
        >
          {selecao.tipo === "config" ? (
            <>
              <h2
                id={`${idSecao}-cabecalho`}
                className="text-lg font-semibold text-heading"
              >
                {gruposConfig[selecao.grupo].nome}
              </h2>
              <FormConfig
                id={idSecao}
                grupo={selecao.grupo}
                config={doc.config}
                erros={erros}
                ancoras={ancoras}
                onChange={alterarConfig}
              />
            </>
          ) : secaoAtual ? (
            <>
              <h2
                id={`${idSecao}-cabecalho`}
                className="text-lg font-semibold text-heading"
              >
                {tiposSecao[secaoAtual.tipo].nome}
              </h2>
              <FormSecao
                id={idSecao}
                secao={secaoAtual}
                erros={erros}
                ancoras={ancoras}
                onChange={alterarSecao}
              />
            </>
          ) : null}
        </section>

        <section
          aria-label="Pré-visualização"
          // Acompanha a rolagem do formulário (abaixo da barra de 3.5rem), sem sobrar vazio embaixo.
          className={cn(
            superficie,
            "flex min-w-0 flex-col overflow-hidden xl:sticky xl:top-20 xl:self-start",
          )}
        >
          {desktop ? (
            preview
          ) : (
            <div className="p-5 sm:p-6">
              <a
                className={buttonVariants({ variant: "outline" })}
                href="/previa"
                rel="noreferrer"
                target="_blank"
              >
                Pré-visualizar
                <span className="sr-only">(abre em nova aba)</span>
              </a>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
