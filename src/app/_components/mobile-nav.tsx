"use client";

import { MenuIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { LinkNav } from "@/lib/landing/navegacao";

type MobileNavProps = {
  links: LinkNav[];
  ctaRotulo: string;
};

export function MobileNav({ links, ctaRotulo }: MobileNavProps) {
  const [isOpen, setOpen] = useState(false);

  return (
    <DialogTrigger isOpen={isOpen} onOpenChange={setOpen}>
      <Button
        aria-label="Abrir menu"
        className="ml-auto text-brand-white hover:bg-white/10 hover:text-brand-white sm:ml-0 lg:hidden"
        size="icon-lg"
        variant="ghost"
      >
        <MenuIcon />
      </Button>
      <Dialog
        className="top-0 right-0 left-auto h-dvh max-w-[min(22rem,100%)] translate-x-0 translate-y-0 content-start rounded-none bg-brand-black p-6 pt-5 text-brand-white ring-0 sm:max-w-[22rem] data-entering:slide-in-from-right data-entering:zoom-in-100 data-exiting:slide-out-to-right data-exiting:zoom-out-100 [&_[data-slot=dialog-close]]:bg-white/10 [&_[data-slot=dialog-close]]:text-brand-white"
        data-surface="dark"
      >
        <DialogTitle className="flex h-9 items-center text-label font-semibold uppercase text-brand-mist">
          Menu
        </DialogTitle>
        <nav aria-label="Principal">
          <ul className="flex flex-col border-t border-white/15">
            {links.map((link) => (
              <li className="border-b border-white/15" key={link.href}>
                <a
                  className="flex min-h-14 items-center font-display text-4xl font-bold leading-none text-brand-white transition-colors hover:text-brand-cyan"
                  href={link.href}
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        {/* biome-ignore lint/a11y/useValidAnchor: link real de âncora; onClick só fecha o menu */}
        <a
          className="inline-flex h-12 items-center justify-center rounded-md bg-brand-cyan px-5 font-semibold text-brand-black"
          href="/#contato"
          onClick={() => setOpen(false)}
        >
          {ctaRotulo}
        </a>
      </Dialog>
    </DialogTrigger>
  );
}
