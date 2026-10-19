"use client";

import { useEffect, useRef } from "react";

import type { MidiaRef } from "@/lib/landing/schema";
import { useMediaQuery } from "@/lib/use-media-query";

/**
 * Vídeo do hero: toca em loop e sem som, salvo com movimento reduzido. Nesse
 * caso não toca sozinho e mostra os controles, para o visitante decidir.
 */
export function HeroVideo({ midia }: { midia: MidiaRef }) {
  // No servidor assume movimento normal; o cliente corrige logo após hidratar.
  const reduzir = useMediaQuery("(prefers-reduced-motion: reduce)");
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
