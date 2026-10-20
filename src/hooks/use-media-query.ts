import { useSyncExternalStore } from "react";

/**
 * Lê uma media query e acompanha as mudanças (ex.: redimensionar a janela).
 * No servidor e na hidratação usa `valorServidor`, para o HTML bater com o cliente.
 */
export function useMediaQuery(
  consulta: string,
  valorServidor = false,
): boolean {
  return useSyncExternalStore(
    (aoMudar) => {
      const mq = window.matchMedia(consulta);
      mq.addEventListener("change", aoMudar);
      return () => mq.removeEventListener("change", aoMudar);
    },
    () => window.matchMedia(consulta).matches,
    () => valorServidor,
  );
}
