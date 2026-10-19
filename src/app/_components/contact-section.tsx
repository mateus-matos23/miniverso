import {
  ArrowUpRightIcon,
  AtSignIcon,
  type LucideIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import type { PropsSecao } from "@/lib/landing/navegacao";
import { telefoneHref } from "@/lib/landing/parse";
import type { ConfigLanding } from "@/lib/landing/schema";
import { cn } from "@/lib/utils";
import { ContatoForm } from "./contato-form";
import { SectionIndex } from "./section-index";
import { superficies } from "./superficie";

function ContactLink({
  children,
  href,
  icon: Icon,
  label,
  external = false,
}: {
  children: string;
  href: string;
  icon: LucideIcon;
  label: string;
  external?: boolean;
}) {
  return (
    <li>
      <a
        className="group flex min-h-16 items-center gap-4 border-b border-brand-line py-4 transition-colors hover:border-brand-blue surface-dark:border-white/20 surface-dark:hover:border-brand-cyan"
        href={href}
        rel={external ? "noreferrer noopener" : undefined}
        target={external ? "_blank" : undefined}
      >
        <Icon
          aria-hidden="true"
          className="size-5 shrink-0 text-brand-blue surface-dark:text-brand-cyan"
        />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-label font-semibold uppercase text-brand-ink surface-dark:text-brand-mist">
            {label}
          </span>
          <span className="break-words text-lg font-medium text-brand-violet group-hover:text-brand-blue surface-dark:text-brand-white surface-dark:group-hover:text-brand-cyan">
            {children}
          </span>
        </span>
        <ArrowUpRightIcon
          aria-hidden="true"
          className="size-5 shrink-0 text-brand-ink transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-blue surface-dark:text-brand-mist surface-dark:group-hover:text-brand-cyan"
        />
        {external ? <span className="sr-only">(abre em nova aba)</span> : null}
      </a>
    </li>
  );
}

export function ContactSection({
  secao,
  contato,
}: PropsSecao<"contato"> & { contato: ConfigLanding["contato"] }) {
  const { dados, aparencia } = secao;
  const { escura, classe } = superficies[aparencia.superficie];

  return (
    <section
      aria-labelledby="contato-title"
      className={cn("relative isolate overflow-hidden", classe)}
      data-surface={escura ? "dark" : undefined}
      id="contato"
    >
      <div className="mx-auto grid max-w-page gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20 lg:px-12 lg:py-32">
        <div>
          <SectionIndex
            className="surface-dark:text-brand-white surface-dark:[&>span:first-child]:text-brand-white"
            number={secao.numero}
          >
            {dados.rotulo}
          </SectionIndex>
          <Reveal>
            <h2
              className="mt-10 max-w-[12ch] font-display text-display-xl font-bold text-brand-violet surface-dark:text-brand-white"
              id="contato-title"
            >
              {dados.titulo}
            </h2>
            <p className="mt-8 max-w-[34rem] text-lg text-brand-ink surface-dark:text-brand-white/85">
              {dados.intro}
            </p>
          </Reveal>
          <div className="mt-12 max-w-[40rem]">
            <ContatoForm />
          </div>
        </div>
        <div className="self-end">
          <ul className="border-t border-brand-line surface-dark:border-white/20">
            <ContactLink
              href={`mailto:${contato.email}`}
              icon={MailIcon}
              label="E-mail"
            >
              {contato.email}
            </ContactLink>
            <ContactLink
              href={telefoneHref(contato.telefone)}
              icon={PhoneIcon}
              label="Telefone"
            >
              {contato.telefone}
            </ContactLink>
            <ContactLink
              external
              href={contato.instagramUrl}
              icon={AtSignIcon}
              label="Instagram"
            >
              {contato.instagramHandle}
            </ContactLink>
          </ul>
          <address className="flex items-center gap-4 py-5 not-italic">
            <MapPinIcon
              aria-hidden="true"
              className="size-5 shrink-0 text-brand-blue surface-dark:text-brand-cyan"
            />
            <span className="flex flex-col">
              <span className="text-label font-semibold uppercase text-brand-ink surface-dark:text-brand-mist">
                Localização
              </span>
              <span className="text-lg font-medium text-brand-violet surface-dark:text-brand-white">
                {contato.cidade}, {contato.estado}
              </span>
            </span>
          </address>
        </div>
      </div>
    </section>
  );
}
