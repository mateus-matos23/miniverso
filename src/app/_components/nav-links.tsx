"use client";

import { useEffect, useState } from "react";
import type { LinkNav } from "@/lib/landing/navegacao";
import { cn } from "@/lib/utils";

const ancora = (href: string) => href.slice(href.indexOf("#") + 1);

/** Menu principal que destaca o link da seção visível no momento. */
export function NavLinks({ links }: { links: LinkNav[] }) {
  const [ativa, setAtiva] = useState<string | null>(null);

  useEffect(() => {
    const elementos = links
      .map((link) => document.getElementById(ancora(link.href)))
      .filter((el): el is HTMLElement => el !== null);
    if (elementos.length === 0) return;

    const observador = new IntersectionObserver(
      (entradas) => {
        for (const entrada of entradas) {
          if (entrada.isIntersecting) setAtiva(entrada.target.id);
        }
      },
      // faixa fina no terço superior da tela: só uma seção por vez
      { rootMargin: "-30% 0px -65% 0px" },
    );
    for (const el of elementos) observador.observe(el);

    return () => observador.disconnect();
  }, [links]);

  return (
    <ul className="flex items-center gap-1">
      {links.map((link) => {
        const atual = ativa === ancora(link.href);

        return (
          <li key={link.href}>
            <a
              aria-current={atual ? "location" : undefined}
              className={cn(
                "relative inline-flex h-10 items-center px-3 text-[0.95rem] font-medium text-brand-mist transition-colors after:absolute after:inset-x-3 after:bottom-1.5 after:h-px after:origin-left after:scale-x-0 after:bg-brand-cyan after:transition-transform after:duration-300 hover:text-brand-white",
                atual && "text-brand-white after:scale-x-100",
              )}
              href={link.href}
            >
              {link.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}
