import { Skeleton } from "@/components/ui/skeleton";
import { AdminPage } from "./page-header";

export default function AdminLoading() {
  return (
    <AdminPage>
      <div aria-busy="true" aria-live="polite" className="flex flex-col gap-8">
        <span className="sr-only">Carregando…</span>
        <div className="flex flex-col gap-3 border-b border-border pb-8">
          <Skeleton className="h-12 w-64" />
          <Skeleton className="h-5 w-96 max-w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
        <Skeleton className="h-64" />
      </div>
    </AdminPage>
  );
}
