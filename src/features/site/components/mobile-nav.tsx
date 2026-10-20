"use client";

import { MenuIcon } from "lucide-react";
import dynamic from "next/dynamic";
import { useState } from "react";
import { buttonVariants } from "@/components/ui/button-variants";
import type { LinkNav } from "@/features/landing/navigation";
import { cn } from "@/lib/utils";

type MobileNavProps = {
  links: LinkNav[];
  ctaRotulo: string;
};

// react-aria (Dialog/Modal) pesa o bastante para não entrar no JS inicial da landing.
const carregarPainel = () => import("./mobile-nav-panel");

function BotaoMenu({ onClick }: { onClick?: () => void }) {
  return (
    <button
      aria-label="Abrir menu"
      className={classeBotao}
      data-size="icon-lg"
      data-slot="button"
      data-variant="ghost"
      onClick={onClick}
      onFocus={carregarPainel}
      onPointerEnter={carregarPainel}
      onTouchStart={carregarPainel}
      type="button"
    >
      <MenuIcon />
    </button>
  );
}

const MobileNavPainel = dynamic(
  () => carregarPainel().then((mod) => mod.MobileNavPainel),
  { loading: () => <BotaoMenu />, ssr: false },
);

const classeBotao = cn(
  buttonVariants({ variant: "ghost", size: "icon-lg" }),
  "ml-auto text-brand-white hover:bg-white/10 hover:text-brand-white sm:ml-0 lg:hidden",
);

/**
 * Botão nativo até o primeiro toque (que já pré-carrega o painel); então o
 * botão do react-aria assume e o painel abre, se o toque veio antes.
 */
export function MobileNav({ links, ctaRotulo }: MobileNavProps) {
  const [pronto, setPronto] = useState(false);
  const [aberto, setAberto] = useState(false);

  if (pronto) {
    return (
      <MobileNavPainel
        aberto={aberto}
        ctaRotulo={ctaRotulo}
        links={links}
        onAbertoChange={setAberto}
      />
    );
  }

  return (
    <BotaoMenu
      onClick={() => {
        setAberto(true);
        setPronto(true);
      }}
    />
  );
}
