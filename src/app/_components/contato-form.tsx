"use client";

import { CheckCircle2Icon } from "lucide-react";
import { useActionState, useEffect, useRef, useState } from "react";
import { type EstadoContato, enviarContato } from "@/app/actions/contato";
import { INTERESSES, ROTULOS_INTERESSE } from "@/lib/leads";
import { cn } from "@/lib/utils";

const TAMANHO_MAXIMO_MENSAGEM = 2000;

const estadoInicial: EstadoContato = {};

const estiloCampo =
  "w-full rounded-md border border-input bg-brand-white px-4 py-3 text-base text-brand-violet placeholder:text-brand-ink/60 transition-colors focus-visible:border-brand-cyan focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan aria-[invalid=true]:border-destructive";

const opcoesInteresse = INTERESSES.map((valor) => ({
  valor,
  rotulo: ROTULOS_INTERESSE[valor].formulario,
}));

type Contexto = {
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  pagina: string;
};

function Campo({
  id,
  rotulo,
  erro,
  opcional = false,
  children,
  contador,
}: {
  id: string;
  rotulo: string;
  erro?: string;
  opcional?: boolean;
  children: React.ReactNode;
  contador?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="flex items-baseline gap-2 text-sm font-semibold text-brand-ink surface-dark:text-brand-mist"
        htmlFor={id}
      >
        {rotulo}
        {opcional ? (
          <span className="normal-case font-normal tracking-normal text-brand-ink/70 surface-dark:text-brand-mist/80">
            (opcional)
          </span>
        ) : null}
      </label>
      {children}
      <div className="flex items-start justify-between gap-4">
        {erro ? (
          <p
            className="text-sm font-medium text-destructive surface-dark:text-destructive-on-dark"
            id={`${id}-erro`}
          >
            {erro}
          </p>
        ) : (
          <span />
        )}
        {contador}
      </div>
    </div>
  );
}

export function ContatoForm() {
  const [state, formAction, pendente] = useActionState(
    enviarContato,
    estadoInicial,
  );
  const [contexto, setContexto] = useState<Contexto>({
    utm_source: "",
    utm_medium: "",
    utm_campaign: "",
    pagina: "",
  });
  const [estadoAnterior, setEstadoAnterior] = useState(state);
  const [tamanhoMensagem, setTamanhoMensagem] = useState(
    state.values?.mensagem?.length ?? 0,
  );
  const formRef = useRef<HTMLFormElement>(null);

  // UTMs e página vêm da URL atual, então só existem no client.
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    setContexto({
      utm_source: params.get("utm_source") ?? "",
      utm_medium: params.get("utm_medium") ?? "",
      utm_campaign: params.get("utm_campaign") ?? "",
      pagina: location.pathname,
    });
  }, []);

  // O form é resetado após cada envio; o contador segue o valor restaurado.
  // Ajuste durante o render (sem effect): ao chegar um novo estado, recalcula.
  if (state !== estadoAnterior) {
    setEstadoAnterior(state);
    setTamanhoMensagem(state.values?.mensagem?.length ?? 0);
  }

  // Após erros de validação, leva o foco ao primeiro campo inválido.
  useEffect(() => {
    if (!state.erros) return;
    const primeiroInvalido = formRef.current?.querySelector<HTMLElement>(
      '[aria-invalid="true"]',
    );
    primeiroInvalido?.focus();
  }, [state]);

  if (state.ok) {
    return (
      <div
        className="flex items-start gap-4 rounded-md border border-brand-cyan bg-brand-white p-6 text-brand-violet"
        role="status"
      >
        <CheckCircle2Icon
          aria-hidden="true"
          className="mt-0.5 size-6 shrink-0 text-brand-blue"
        />
        <p className="text-lg font-medium">
          Recebemos sua mensagem. A equipe da Miniverso vai responder pelo
          e-mail informado.
        </p>
      </div>
    );
  }

  const erros = state.erros ?? {};
  const valores = state.values ?? {};

  return (
    <form
      action={formAction}
      className="flex flex-col gap-6"
      noValidate
      ref={formRef}
    >
      {state.erro ? (
        <p
          className="rounded-md border border-destructive bg-brand-white p-4 text-sm font-medium text-destructive"
          role="alert"
        >
          {state.erro}
        </p>
      ) : null}

      <div className="grid gap-6 sm:grid-cols-2">
        <Campo erro={erros.nome} id="contato-nome" rotulo="Nome">
          <input
            aria-describedby={erros.nome ? "contato-nome-erro" : undefined}
            aria-invalid={Boolean(erros.nome)}
            autoComplete="name"
            className={estiloCampo}
            defaultValue={valores.nome}
            id="contato-nome"
            name="nome"
            required
            type="text"
          />
        </Campo>

        <Campo erro={erros.email} id="contato-email" rotulo="E-mail">
          <input
            aria-describedby={erros.email ? "contato-email-erro" : undefined}
            aria-invalid={Boolean(erros.email)}
            autoComplete="email"
            className={estiloCampo}
            defaultValue={valores.email}
            id="contato-email"
            name="email"
            required
            type="email"
          />
        </Campo>

        <Campo erro={erros.escola} id="contato-escola" opcional rotulo="Escola">
          <input
            aria-describedby={erros.escola ? "contato-escola-erro" : undefined}
            aria-invalid={Boolean(erros.escola)}
            autoComplete="organization"
            className={estiloCampo}
            defaultValue={valores.escola}
            id="contato-escola"
            name="escola"
            type="text"
          />
        </Campo>

        <Campo erro={erros.cargo} id="contato-cargo" opcional rotulo="Cargo">
          <input
            aria-describedby={erros.cargo ? "contato-cargo-erro" : undefined}
            aria-invalid={Boolean(erros.cargo)}
            autoComplete="organization-title"
            className={estiloCampo}
            defaultValue={valores.cargo}
            id="contato-cargo"
            name="cargo"
            type="text"
          />
        </Campo>
      </div>

      <Campo erro={erros.interesse} id="contato-interesse" rotulo="Interesse">
        <select
          aria-describedby={
            erros.interesse ? "contato-interesse-erro" : undefined
          }
          aria-invalid={Boolean(erros.interesse)}
          className={estiloCampo}
          defaultValue={valores.interesse ?? ""}
          id="contato-interesse"
          name="interesse"
          required
        >
          <option disabled value="">
            Selecione uma opção
          </option>
          {opcoesInteresse.map((opcao) => (
            <option key={opcao.valor} value={opcao.valor}>
              {opcao.rotulo}
            </option>
          ))}
        </select>
      </Campo>

      <Campo
        contador={
          <span
            className={cn(
              "text-label tabular-nums text-brand-ink surface-dark:text-brand-mist",
              tamanhoMensagem > TAMANHO_MAXIMO_MENSAGEM - 100 &&
                "text-brand-violet surface-dark:text-brand-white",
            )}
            id="contato-mensagem-contador"
          >
            {tamanhoMensagem}/{TAMANHO_MAXIMO_MENSAGEM}
          </span>
        }
        erro={erros.mensagem}
        id="contato-mensagem"
        rotulo="Mensagem"
      >
        <textarea
          aria-describedby={[
            "contato-mensagem-contador",
            erros.mensagem ? "contato-mensagem-erro" : undefined,
          ]
            .filter(Boolean)
            .join(" ")}
          aria-invalid={Boolean(erros.mensagem)}
          className={cn(estiloCampo, "min-h-36 resize-y")}
          defaultValue={valores.mensagem}
          id="contato-mensagem"
          maxLength={TAMANHO_MAXIMO_MENSAGEM}
          name="mensagem"
          onChange={(event) =>
            setTamanhoMensagem(event.currentTarget.value.length)
          }
          required
          rows={5}
        />
      </Campo>

      {/* Honeypot: fora da tela e fora da árvore de acessibilidade. Pessoas não preenchem. */}
      <div
        aria-hidden="true"
        className="absolute -left-[10000px] h-px w-px overflow-hidden"
      >
        <label htmlFor="contato-site">Site</label>
        <input
          autoComplete="off"
          id="contato-site"
          name="site"
          tabIndex={-1}
          type="text"
        />
      </div>

      <input
        name="utm_source"
        type="hidden"
        defaultValue={contexto.utm_source}
      />
      <input
        name="utm_medium"
        type="hidden"
        defaultValue={contexto.utm_medium}
      />
      <input
        name="utm_campaign"
        type="hidden"
        defaultValue={contexto.utm_campaign}
      />
      <input name="pagina" type="hidden" defaultValue={contexto.pagina} />

      <div>
        <button
          aria-busy={pendente || undefined}
          className="inline-flex h-12 items-center justify-center rounded-md bg-brand-cyan px-6 font-semibold text-brand-black transition-colors hover:bg-brand-violet hover:text-brand-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-cyan disabled:cursor-progress disabled:opacity-70 surface-dark:hover:bg-brand-white surface-dark:hover:text-brand-black"
          data-cta="contato-enviar"
          disabled={pendente}
          type="submit"
        >
          {pendente ? "Enviando…" : "Enviar mensagem"}
        </button>
      </div>
    </form>
  );
}
