import { buttonVariants } from "@/components/ui/button-variants";
import type { LinkNav } from "@/lib/landing/navegacao";
import type { ConfigLanding } from "@/lib/landing/schema";
import { cn } from "@/lib/utils";
import { AvisoTopo } from "./aviso-topo";
import { BrandMark } from "./brand-mark";
import { MobileNav } from "./mobile-nav";

type SiteHeaderProps = {
  links: LinkNav[];
  ctaRotulo: string;
  aviso?: ConfigLanding["aviso"];
};

export function SiteHeader({ links, ctaRotulo, aviso }: SiteHeaderProps) {
  return (
    <>
      {aviso ? <AvisoTopo aviso={aviso} /> : null}
      <header
        className="sticky top-0 z-40 border-b border-white/10 bg-brand-black text-brand-white"
        data-surface="dark"
      >
        <a
          className="sr-only z-50 bg-brand-cyan px-4 py-3 font-semibold text-brand-black focus:not-sr-only focus:absolute focus:left-4 focus:top-3"
          href="#conteudo"
        >
          Pular para o conteúdo
        </a>
        <div className="mx-auto flex h-(--header-height) max-w-page items-center gap-6 px-5 sm:px-8 lg:px-12">
          <BrandMark preload />
          <nav aria-label="Principal" className="ml-auto hidden lg:block">
            <ul className="flex items-center gap-1">
              {links.map((link) => (
                <li key={link.href}>
                  <a
                    className="inline-flex h-10 items-center px-3 text-[0.95rem] font-medium text-brand-mist transition-colors hover:text-brand-white"
                    href={link.href}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <a
            className={cn(
              buttonVariants({ variant: "signal" }),
              "hidden text-[0.95rem] sm:inline-flex ml-auto lg:ml-0",
            )}
            href="/#contato"
          >
            {ctaRotulo}
          </a>
          <MobileNav ctaRotulo={ctaRotulo} links={links} />
        </div>
      </header>
    </>
  );
}
