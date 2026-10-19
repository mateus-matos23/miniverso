import type { ReactNode } from "react";

export function AdminPage({ children }: { children: ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-[72rem] px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
      {children}
    </div>
  );
}

export function PageHeader({
  title,
  description,
  actions,
  eyebrow,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
  eyebrow?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-6 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {eyebrow}
        <h1 className="font-display text-display-md font-bold text-brand-violet">
          {title}
        </h1>
        {description ? (
          <p className="mt-3 max-w-[40rem] text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? <div className="flex shrink-0 gap-2">{actions}</div> : null}
    </div>
  );
}
