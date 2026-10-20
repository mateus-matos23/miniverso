import { buttonVariants } from "@/components/ui/button-variants";
import type { LinkNav } from "@/features/landing/navigation";
import type { ConfigLanding } from "@/features/landing/schema";
import { cn } from "@/lib/utils";
import { AvisoTopo } from "./announcement-bar";
import { BrandMark } from "./brand-mark";
import { MobileNav } from "./mobile-nav";
import { NavLinks } from "./nav-links";

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
        className="header-sombra sticky top-0 z-40 border-b border-white/10 bg-brand-black text-brand-white"
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
            <NavLinks links={links} />
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
