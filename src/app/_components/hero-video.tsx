"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

import type { MidiaRef } from "@/lib/landing/schema";

const CONSULTA_MOVIMENTO = "(prefers-reduced-motion: reduce)";

function assinarMovimento(aoMudar: () => void) {
  const consulta = window.matchMedia(CONSULTA_MOVIMENTO);
  consulta.addEventListener("change", aoMudar);
  return () => consulta.removeEventListener("change", aoMudar);
}

function movimentoReduzido() {
  return window.matchMedia(CONSULTA_MOVIMENTO).matches;
}

/**
 * Vídeo do hero: toca em loop e sem som, salvo com movimento reduzido. Nesse
 * caso não toca sozinho e mostra os controles, para o visitante decidir.
 */
export function HeroVideo({ midia }: { midia: MidiaRef }) {
  // No servidor assume movimento normal; o cliente corrige logo após hidratar.
  const reduzir = useSyncExternalStore(
    assinarMovimento,
    movimentoReduzido,
    () => false,
  );
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (reduzir) video.current?.pause();
  }, [reduzir]);

  return (
    <video
      ref={video}
      aria-label={midia.alt || undefined}
      autoPlay={!reduzir}
      className="absolute inset-0 size-full object-cover"
      controls={reduzir}
      loop
      muted
      playsInline
      preload="metadata"
      src={midia.url}
    />
  );
}
