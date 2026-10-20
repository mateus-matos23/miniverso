"use client";

import { MenuIcon } from "lucide-react";
import { I18nProvider } from "react-aria-components";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button-variants";
import { SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { LinkNav } from "@/lib/landing/navegacao";

type MobileNavPainelProps = {
  links: LinkNav[];
  ctaRotulo: string;
  aberto: boolean;
  onAbertoChange: (aberto: boolean) => void;
};

export function MobileNavPainel({
  links,
  ctaRotulo,
  aberto,
  onAbertoChange,
}: MobileNavPainelProps) {
  return (
    <I18nProvider locale="pt-BR">
      <SheetTrigger isOpen={aberto} onOpenChange={onAbertoChange}>
        <Button
          aria-label="Abrir menu"
          className="ml-auto text-brand-white hover:bg-white/10 hover:text-brand-white sm:ml-0 lg:hidden"
          size="icon-lg"
          variant="ghost"
        >
          <MenuIcon />
        </Button>
        <SheetContent
          className="bg-brand-black pt-5 text-brand-white [&_[data-slot=sheet-close]]:bg-white/10 [&_[data-slot=sheet-close]]:text-brand-white"
          data-surface="dark"
          side="right"
        >
          <SheetTitle className="flex h-9 items-center text-label font-semibold uppercase text-brand-mist">
            Menu
          </SheetTitle>
          <nav aria-label="Principal">
            <ul className="flex flex-col border-t border-white/15">
              {links.map((link) => (
                <li className="border-b border-white/15" key={link.href}>
                  <a
                    className="flex min-h-14 items-center font-display text-4xl font-bold leading-none text-brand-white transition-colors hover:text-brand-cyan"
                    href={link.href}
                    onClick={() => onAbertoChange(false)}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          {/* biome-ignore lint/a11y/useValidAnchor: link real de âncora; onClick só fecha o menu */}
          <a
            className={buttonVariants({ variant: "signal", size: "lg" })}
            href="/#contato"
            onClick={() => onAbertoChange(false)}
          >
            {ctaRotulo}
          </a>
        </SheetContent>
      </SheetTrigger>
    </I18nProvider>
  );
}
