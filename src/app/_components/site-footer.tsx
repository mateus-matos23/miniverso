import { ArrowUpIcon } from "lucide-react";
import { LinhaSecao } from "@/components/motion/linha-secao";
import type { LinkNav } from "@/lib/landing/navegacao";
import type { ConfigLanding } from "@/lib/landing/schema";
import { site } from "@/lib/site";
import { BrandMark } from "./brand-mark";

/** Faixa contínua com os serviços; duas cópias para o loop não ter emenda. */
function ServicesMarquee({ services }: { services: string[] }) {
  return (
    <div className="group/marquee overflow-hidden border-b border-white/10 py-6">
      <div className="flex w-max animate-marquee group-focus-within/marquee:[animation-play-state:paused] group-hover/marquee:[animation-play-state:paused] motion-reduce:animate-none">
        {/* Só a primeira cópia é lida; a duplicata existe para o loop sem emenda. */}
        {[0, 1].map((copy) => (
          <ul
            aria-hidden={copy > 0 || undefined}
            aria-label={copy === 0 ? "Serviços" : undefined}
            className="flex shrink-0"
            key={copy}
          >
            {services.map((service) => (
              <li
                className="flex items-center gap-8 pr-8 font-display text-display-md font-bold whitespace-nowrap text-brand-white/90"
                key={service}
              >
                {service}
                <span className="size-2 rounded-full bg-brand-cyan" />
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

type SiteFooterProps = {
  links: LinkNav[];
  config: ConfigLanding;
};

export function SiteFooter({ links, config }: SiteFooterProps) {
  return (
    <footer
      className="relative bg-brand-black text-brand-mist"
      data-surface="dark"
    >
      <LinhaSecao />
      <ServicesMarquee services={config.rodape.servicos} />
      <div className="mx-auto flex max-w-page flex-col gap-8 px-5 py-12 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <BrandMark href="#conteudo" />
        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {links.map((link) => (
              <li key={link.href}>
                <a
                  className="inline-flex h-10 items-center transition-colors hover:text-brand-white"
                  href={link.href}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <a
          className="group/topo inline-flex h-10 items-center gap-2 text-sm font-semibold text-brand-cyan transition-colors hover:text-brand-white"
          href="#conteudo"
        >
          Voltar ao topo
          <ArrowUpIcon
            aria-hidden="true"
            className="size-4 transition-transform duration-300 group-hover/topo:-translate-y-1"
          />
        </a>
        <p className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
          <span>
            © {new Date().getFullYear()} {site.name}
          </span>
          <span>
            {config.contato.cidade}, {config.contato.uf}
          </span>
        </p>
      </div>
    </footer>
  );
}
