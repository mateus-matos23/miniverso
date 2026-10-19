import { site } from "@/lib/site";
import { BrandMark } from "./brand-mark";
import { navLinks } from "./nav-links";

export function SiteFooter() {
  return (
    <footer className="bg-brand-black text-brand-mist" data-surface="dark">
      <div className="mx-auto flex max-w-[90rem] flex-col gap-8 px-5 py-12 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
        <BrandMark href="#conteudo" />
        <nav aria-label="Rodapé">
          <ul className="flex flex-wrap gap-x-6 gap-y-2">
            {navLinks.map((link) => (
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
        <p className="text-sm">
          © {new Date().getFullYear()} {site.name} · {site.contact.city},{" "}
          {site.contact.regionCode}
        </p>
      </div>
    </footer>
  );
}
