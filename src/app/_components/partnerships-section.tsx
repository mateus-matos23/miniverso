export function PartnershipsSection() {
  return (
    <section
      className="grid grid-cols-[minmax(0,1fr)_minmax(16rem,0.65fr)] gap-[clamp(3rem,8vw,11rem)] px-[clamp(1.25rem,9vw,9rem)] py-[clamp(5rem,10vw,10rem)] max-[900px]:grid-cols-1"
      aria-labelledby="partners-title"
    >
      <div>
        <span className="text-[0.65rem] font-bold uppercase tracking-[0.13em] text-brand-blue before:mr-[0.6rem] before:content-['/']">
          03 / PARCERIAS
        </span>
        <h2
          className="mt-12 max-w-[8ch] break-words font-display text-[clamp(3rem,15vw,7rem)] font-bold uppercase leading-[0.84] tracking-[-0.02em] text-brand-violet min-[621px]:text-[clamp(3.3rem,7vw,7rem)] max-[620px]:max-w-full"
          id="partners-title"
        >
          Toda parceria
          <br />
          <span className="text-brand-cyan">abre um caminho.</span>
        </h2>
      </div>
      <div className="self-end border-t border-[#a9b7d0] pt-5">
        <p className="text-[1.08rem] leading-[1.55] text-[#28395c]">
          Clientes e parceiros aparecerão aqui conforme novos conteúdos forem
          publicados pela equipe.
        </p>
        <span className="mt-9 block text-[0.65rem] font-bold uppercase tracking-[0.13em] text-brand-blue">
          SEM REGISTROS PUBLICADOS
        </span>
      </div>
    </section>
  );
}
