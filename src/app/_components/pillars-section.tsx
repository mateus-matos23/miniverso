import { PlusIcon } from "lucide-react";
import { SectionIndex } from "./section-index";

const pillars = [
  {
    title: "Aprendizagem segura",
    description:
      "No ambiente virtual, o aluno pode experimentar, errar e tentar de novo sem riscos. O erro passa a fazer parte do processo.",
  },
  {
    title: "Criatividade",
    description:
      "Mundos imersivos convidam a explorar, levantar hipóteses e construir soluções próprias, em vez de apenas receber conteúdo.",
  },
  {
    title: "Gamificação",
    description:
      "Desafios, progressão e recompensas trazidos dos jogos mantêm a atenção e tornam a aula mais participativa.",
  },
  {
    title: "Capacidades socioemocionais",
    description:
      "Experiências pensadas para praticar colaboração, empatia e confiança, dentro e fora do mundo virtual.",
  },
] as const;

export function PillarsSection() {
  return (
    <section
      aria-labelledby="pilares-title"
      className="relative overflow-hidden bg-brand-violet text-brand-white"
      data-surface="dark"
      id="pilares"
    >
      <div
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-brand-cyan/50"
      />
      <div className="mx-auto grid max-w-[90rem] gap-12 px-5 py-24 sm:px-8 lg:grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] lg:gap-20 lg:px-12 lg:py-32">
        <div>
          <SectionIndex number="03">Pilares</SectionIndex>
          <h2
            className="mt-10 max-w-[12ch] font-display text-display-lg font-bold"
            id="pilares-title"
          >
            O que acontece quando aprender vira experiência
          </h2>
          <p className="mt-8 max-w-[34rem] text-lg text-brand-mist">
            A realidade virtual é o caminho. Estes são os quatro sinais que
            orientam cada experiência criada pela Miniverso.
          </p>
        </div>
        <ul className="border-t border-white/15 lg:mt-24">
          {pillars.map((pillar, index) => (
            <li className="border-b border-white/15" key={pillar.title}>
              <details className="group">
                <summary className="flex min-h-20 cursor-pointer list-none items-center gap-5 py-5 [&::-webkit-details-marker]:hidden">
                  <span className="w-8 shrink-0 text-label font-semibold text-brand-cyan">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="flex-1 font-display text-display-md font-bold transition-colors group-hover:text-brand-cyan">
                    {pillar.title}
                  </span>
                  <PlusIcon
                    aria-hidden="true"
                    className="size-6 shrink-0 text-brand-mist transition-transform duration-200 group-open:rotate-45 group-open:text-brand-cyan"
                    strokeWidth={1.5}
                  />
                </summary>
                <p className="max-w-[46ch] pb-7 pl-13 text-lg text-brand-mist">
                  {pillar.description}
                </p>
              </details>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
