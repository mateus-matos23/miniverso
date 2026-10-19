import Image from "next/image";

import type { MidiaRef } from "@/lib/landing/schema";
import { cn } from "@/lib/utils";

/** Prévia de uma mídia da biblioteca. Imagens usam a URL pública direta; vídeos mostram o primeiro quadro. */
export function MiniaturaMidia({
  midia,
  className,
}: {
  midia: Pick<MidiaRef, "url" | "tipo" | "alt">;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "relative flex aspect-[4/3] w-full items-center justify-center overflow-hidden bg-muted",
        className,
      )}
    >
      {midia.tipo === "imagem" ? (
        <Image
          src={midia.url}
          alt={midia.alt}
          fill
          unoptimized
          sizes="(min-width: 1024px) 240px, 45vw"
          className="object-cover"
        />
      ) : (
        <video
          src={midia.url}
          aria-label="Prévia do vídeo"
          muted
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        />
      )}
    </div>
  );
}
