"use client";

import { useRouter } from "next/navigation";
import type { ReactNode } from "react";
import { I18nProvider, RouterProvider } from "react-aria-components";

// Faz os links do react-aria (incluindo LinkButton) navegarem pelo router do Next.js,
// sem recarregar a página. Os routerOptions aceitos são os do `router.push`.
declare module "react-aria-components" {
  interface RouterConfig {
    routerOptions: NonNullable<
      Parameters<ReturnType<typeof useRouter>["push"]>[1]
    >;
  }
}

export function Providers({ children }: { children: ReactNode }) {
  const router = useRouter();

  return (
    <I18nProvider locale="pt-BR">
      <RouterProvider navigate={router.push}>{children}</RouterProvider>
    </I18nProvider>
  );
}
