import {
  ArrowUpRight,
  Camera,
  type LucideIcon,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import { BrandMark } from "./brand-mark";

function ContactLink({
  children,
  href,
  icon: Icon,
  breakAll = false,
  external = false,
}: {
  children: string;
  href: string;
  icon: LucideIcon;
  breakAll?: boolean;
  external?: boolean;
}) {
  return (
    <a
      className="flex min-w-0 items-center gap-[0.7rem] border-b border-[#324e82] py-[0.85rem] text-left text-[0.9rem] transition-colors duration-200 hover:border-brand-cyan hover:text-brand-cyan"
      href={href}
      rel={external ? "noreferrer" : undefined}
      target={external ? "_blank" : undefined}
    >
      <Icon aria-hidden="true" className="shrink-0" size={19} />
      <span
        className={`min-w-0 flex-1 text-left ${breakAll ? "break-all" : "wrap-break-word"}`}
      >
        {children}
      </span>
      <ArrowUpRight aria-hidden="true" className="shrink-0" size={16} />
    </a>
  );
}

export function ContactSection() {
  return (
    <section
      className="relative overflow-hidden bg-brand-black px-[clamp(1.25rem,9vw,9rem)] pb-6 pt-[clamp(5rem,10vw,10rem)] text-brand-white"
      id="contato"
      aria-labelledby="contact-title"
    >
      <div
        className="pointer-events-none absolute -right-32 top-4 size-[min(45vw,38rem)] opacity-60 max-[620px]:-right-32 max-[620px]:top-12 max-[620px]:size-88"
        aria-hidden="true"
      >
        <div className="absolute left-1/2 top-1/2 h-px w-full bg-brand-cyan" />
        <div className="absolute left-1/2 top-1/2 h-px w-full -rotate-90 bg-brand-cyan" />
        <div className="absolute inset-0 rounded-full border border-brand-blue" />
        <div className="absolute inset-1/5 rounded-full border border-brand-cyan" />
      </div>
      <span className="relative z-1 text-[0.65rem] font-bold uppercase tracking-[0.13em] text-brand-cyan before:mr-[0.6rem] before:content-['/']">
        04 / PRÓXIMO PASSO
      </span>
      <h2
        className="relative z-1 mt-12 max-w-[8ch] wrap-break-word font-display text-[clamp(3rem,15vw,7.2rem)] font-bold uppercase leading-[0.84] tracking-[-0.02em] text-brand-white min-[621px]:text-[clamp(3.3rem,7vw,7.2rem)] max-[620px]:max-w-full"
        id="contact-title"
      >
        Vamos criar
        <br />
        <span className="text-brand-cyan">esse mundo?</span>
      </h2>
      <p className="relative z-1 mb-8 mt-12 max-w-[38ch] text-[1.08rem] leading-[1.55] text-[#d3def4]">
        Conte o que você quer tornar possível. A próxima experiência pode
        começar em uma conversa.
      </p>
      <div className="relative z-1 grid max-w-136 gap-[0.8rem]">
        <ContactLink
          breakAll
          href="mailto:miniversoedtech@gmail.com"
          icon={Mail}
        >
          miniversoedtech@gmail.com
        </ContactLink>
        <ContactLink href="tel:+5598988118091" icon={Phone}>
          +55 98 98811-8091
        </ContactLink>
        <ContactLink
          href="https://www.instagram.com/meuminiverso/"
          icon={Camera}
          external
        >
          @meuminiverso
        </ContactLink>
        <address className="flex items-center gap-[0.7rem] border-b border-[#324e82] py-[0.85rem] text-left text-[0.9rem] not-italic text-brand-muted">
          <MapPin aria-hidden="true" className="shrink-0" size={19} />
          <span>São Luís, Maranhão</span>
        </address>
      </div>
      <footer className="relative z-1 mt-[clamp(6rem,13vw,13rem)] flex items-center justify-between gap-8 border-t border-[#263a62] pt-4 text-[0.62rem] uppercase tracking-[0.12em] text-brand-muted max-[620px]:flex-col max-[620px]:items-start max-[620px]:gap-[0.8rem] max-[620px]:text-left">
        <BrandMark compact />
        <span>educação que ganha espaço</span>
        <span>© 2026 miniverso</span>
      </footer>
    </section>
  );
}
