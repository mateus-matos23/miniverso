import { BrandMark } from "./brand-mark";
import { MobileNav } from "./mobile-nav";
import { navLinks } from "./nav-links";

export function SiteHeader() {
  return (
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
      <div className="mx-auto flex h-(--header-height) max-w-[90rem] items-center gap-6 px-5 sm:px-8 lg:px-12">
        <BrandMark priority />
        <nav aria-label="Principal" className="ml-auto hidden lg:block">
          <ul className="flex items-center gap-1">
            {navLinks.map((link) => (
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
          className="hidden h-10 items-center rounded-md bg-brand-cyan px-4 text-[0.95rem] font-semibold text-brand-black transition-colors hover:bg-brand-white sm:inline-flex max-lg:ml-auto"
          href="#contato"
        >
          Fale com a gente
        </a>
        <MobileNav />
      </div>
    </header>
  );
}
