/**
 * Desloca o conteúdo na vertical conforme a rolagem; `fator` negativo sobe.
 * Usa scroll-driven animation do CSS (ver `.parallax-rolagem`): sem JS na
 * thread principal, e sem efeito onde o navegador não suporta.
 */
export function Parallax({
  children,
  className,
  fator,
}: {
  children: React.ReactNode;
  className?: string;
  fator: number;
}) {
  return (
    <div
      className={
        className ? `parallax-rolagem ${className}` : "parallax-rolagem"
      }
      style={{ "--parallax-fator": fator } as React.CSSProperties}
    >
      {children}
    </div>
  );
}
