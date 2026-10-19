import { SectionIndex } from "./section-index";

const principles = [
  {
    term: "Missão",
    description:
      "Oferecer soluções inovadoras de ensino através da realidade virtual, proporcionando uma experiência de aprendizado envolvente e memorável para os alunos.",
  },
  {
    term: "Visão",
    description:
      "Ser reconhecida como líder em tecnologia educacional, transformando a forma como a educação é entregue e tornando o aprendizado mais efetivo e emocionante.",
  },
  {
    term: "Valores",
    description:
      "Inovação, engajamento, colaboração, diversidade e responsabilidade social.",
  },
] as const;

export function AboutSection() {
  return (
    <section
      aria-labelledby="sobre-title"
      className="bg-brand-white"
      id="sobre"
    >
      <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <SectionIndex number="02">Sobre</SectionIndex>
        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
          <h2
            className="max-w-[14ch] font-display text-display-lg font-bold text-brand-violet"
            id="sobre-title"
          >
            A tecnologia é o meio. A aprendizagem é o destino.
          </h2>
          <div className="flex max-w-[36rem] flex-col gap-5 self-end text-lg text-brand-ink">
            <p>
              A Miniverso nasceu para criar ambientes em realidade virtual
              voltados para a educação. Hoje também trabalha com realidade
              aumentada, realidade mista e vídeos 360.
            </p>
            <p>
              Apoiamos escolas que querem inovar em suas metodologias, alunos
              que buscam incorporar tecnologia aos estudos e professores que
              desejam aulas mais interessantes, cativantes e capazes de manter a
              atenção da turma.
            </p>
          </div>
        </div>

        {/* Missão, visão e valores: os três anéis sobrepostos do manual */}
        <dl className="mt-20 grid border-t border-brand-line lg:mt-28 lg:grid-cols-3 lg:border-t-0">
          {principles.map((item, index) => (
            <div
              className="relative grid gap-3 border-b border-brand-line py-8 lg:aspect-square lg:place-content-center lg:rounded-full lg:border lg:border-brand-blue/40 lg:px-[14%] lg:py-0 lg:text-center lg:not-first:-ml-[4%]"
              key={item.term}
              style={{ zIndex: principles.length - index }}
            >
              <dt className="font-display text-display-md font-bold text-brand-blue">
                {item.term}
              </dt>
              <dd className="max-w-[32ch] text-base text-brand-ink lg:mx-auto">
                {item.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
