/** Barra fina no topo que acompanha o progresso de leitura da página (CSS puro). */
export function ScrollProgress() {
  return (
    <div
      aria-hidden="true"
      className="progresso-rolagem fixed inset-x-0 top-0 z-60 h-0.5 origin-left bg-linear-to-r from-brand-cyan to-brand-blue"
    />
  );
}
