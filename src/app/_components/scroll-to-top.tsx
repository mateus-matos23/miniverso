"use client";

import { ArrowUp } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

const SCROLL_THRESHOLD = 480;

export function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsVisible(window.scrollY > SCROLL_THRESHOLD);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const handleClick = useCallback(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    window.scrollTo({
      behavior: prefersReducedMotion ? "auto" : "smooth",
      top: 0,
    });
  }, []);

  return (
    <button
      aria-hidden={!isVisible}
      aria-label="Voltar ao topo da página"
      className={`fixed bottom-[clamp(1.25rem,4vw,2.5rem)] right-[clamp(1.25rem,4vw,2.5rem)] z-50 inline-flex h-12 w-12 items-center justify-center border border-brand-cyan bg-brand-black text-brand-cyan shadow-lg transition duration-200 hover:-translate-y-0.5 hover:bg-brand-cyan hover:text-brand-black max-[620px]:h-11 max-[620px]:w-11 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0"
      }`}
      onClick={handleClick}
      tabIndex={isVisible ? 0 : -1}
      type="button"
    >
      <ArrowUp aria-hidden="true" size={20} />
    </button>
  );
}
