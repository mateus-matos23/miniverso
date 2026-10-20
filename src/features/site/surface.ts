import type { Superficie } from "@/features/landing/schema";

/**
 * Fundo de cada superfície editável da landing. `escura` liga o variant
 * `surface-dark:` (ver globals.css), que troca as cores de texto, borda e
 * detalhe das seções sem condicionais no JSX.
 */
export const superficies: Record<
  Superficie,
  { classe: string; escura: boolean }
> = {
  black: { classe: "bg-brand-black text-brand-white", escura: true },
  violet: { classe: "bg-brand-violet text-brand-white", escura: true },
  aurora: { classe: "bg-brand-aurora text-brand-white", escura: true },
  white: { classe: "bg-brand-white", escura: false },
  tint: { classe: "bg-brand-tint", escura: false },
};
