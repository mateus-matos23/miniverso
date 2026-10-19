import { type ClassValue, clsx } from "cn";
import { extendTailwindMerge } from "cn/config";

// Tamanhos de texto definidos no @theme de globals.css. Sem isso o tailwind-merge
// trata `text-label`/`text-display-*` como cor e descarta o tamanho quando há
// uma cor `text-*` na mesma lista.
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["label", "display-xl", "display-lg", "display-md"] },
      ],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
