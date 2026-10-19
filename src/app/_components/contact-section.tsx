import {
  ArrowUpRightIcon,
  AtSignIcon,
  type LucideIcon,
  MailIcon,
  MapPinIcon,
  PhoneIcon,
} from "lucide-react";
import { site } from "@/lib/site";
import { SectionIndex } from "./section-index";

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
        className="group flex min-h-16 items-center gap-4 border-b border-white/20 py-4 transition-colors hover:border-brand-cyan"
        href={href}
        rel={external ? "noreferrer noopener" : undefined}
        target={external ? "_blank" : undefined}
      >
        <Icon aria-hidden="true" className="size-5 shrink-0 text-brand-cyan" />
        <span className="flex min-w-0 flex-1 flex-col">
          <span className="text-label font-semibold uppercase text-brand-mist">
            {label}
          </span>
          <span className="break-words text-lg font-medium text-brand-white group-hover:text-brand-cyan">
            {children}
          </span>
        </span>
        <ArrowUpRightIcon
          aria-hidden="true"
          className="size-5 shrink-0 text-brand-mist transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-cyan"
        />
        {external ? <span className="sr-only">(abre em nova aba)</span> : null}
      </a>
    </li>
  );
}

export function ContactSection() {
  const { contact } = site;

  return (
    <section
      aria-labelledby="contato-title"
      className="relative isolate overflow-hidden bg-brand-aurora text-brand-white"
      data-surface="dark"
      id="contato"
    >
      <div className="mx-auto grid max-w-[90rem] gap-14 px-5 py-24 sm:px-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20 lg:px-12 lg:py-32">
        <div>
          <SectionIndex
            className="text-brand-white [&>span:first-child]:text-brand-white"
            number="06"
          >
            Contato
          </SectionIndex>
          <h2
            className="mt-10 max-w-[12ch] font-display text-display-xl font-bold"
            id="contato-title"
          >
            Vamos criar esse mundo juntos?
          </h2>
          <p className="mt-8 max-w-[34rem] text-lg text-brand-white/85">
            Conte o que a sua escola ou turma quer tornar possível. A próxima
            experiência pode começar em uma conversa.
          </p>
        </div>
        <div className="self-end">
          <ul className="border-t border-white/20">
            <ContactLink
              href={`mailto:${contact.email}`}
              icon={MailIcon}
              label="E-mail"
            >
              {contact.email}
            </ContactLink>
            <ContactLink
              href={contact.phoneHref}
              icon={PhoneIcon}
              label="Telefone"
            >
              {contact.phone}
            </ContactLink>
            <ContactLink
              external
              href={contact.instagram}
              icon={AtSignIcon}
              label="Instagram"
            >
              {contact.instagramHandle}
            </ContactLink>
          </ul>
          <address className="flex items-center gap-4 py-5 not-italic">
            <MapPinIcon
              aria-hidden="true"
              className="size-5 shrink-0 text-brand-cyan"
            />
            <span className="flex flex-col">
              <span className="text-label font-semibold uppercase text-brand-mist">
                Localização
              </span>
              <span className="text-lg font-medium">
                {contact.city}, {contact.region}
              </span>
            </span>
          </address>
        </div>
      </div>
    </section>
  );
}
