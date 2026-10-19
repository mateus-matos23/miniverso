"use client";

import { ArrowUpIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const SCROLL_THRESHOLD = 640;

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > SCROLL_THRESHOLD);

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  function handleClick() {
    const reduce = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    window.scrollTo({ behavior: reduce ? "auto" : "smooth", top: 0 });
    document.getElementById("conteudo")?.focus({ preventScroll: true });
  }

  return (
    <button
      aria-hidden={!isVisible}
      aria-label="Voltar ao topo"
      className={cn(
        "fixed right-5 bottom-5 z-30 inline-flex size-12 items-center justify-center rounded-md border border-brand-cyan bg-brand-black text-brand-cyan transition duration-200 [--ring:var(--color-brand-cyan)] hover:bg-brand-cyan hover:text-brand-black sm:right-8 sm:bottom-8",
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
      onClick={handleClick}
      tabIndex={isVisible ? 0 : -1}
      type="button"
    >
      <ArrowUpIcon aria-hidden="true" className="size-5" />
    </button>
  );
}
