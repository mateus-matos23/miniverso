import { ScanLineIcon } from "lucide-react";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { SectionIndex } from "./section-index";

/**
 * Projetos ainda não têm modelo de dados publicado; o estado vazio é honesto
 * e aponta para o contato em vez de inventar portfólio.
 */
export function ProjectsSection() {
  return (
    <section
      aria-labelledby="projetos-title"
      className="bg-brand-white"
      id="projetos"
    >
      <div className="mx-auto max-w-[90rem] px-5 py-24 sm:px-8 lg:px-12 lg:py-32">
        <SectionIndex number="04">Projetos</SectionIndex>
        <div className="mt-10 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-20">
          <h2
            className="max-w-[13ch] font-display text-display-lg font-bold text-brand-violet"
            id="projetos-title"
          >
            Mundos criados pela Miniverso
          </h2>
          <Empty className="border border-brand-line bg-brand-tint/60 p-10 lg:p-14">
            <EmptyHeader>
              <EmptyMedia
                className="bg-brand-blue text-brand-white"
                variant="icon"
              >
                <ScanLineIcon />
              </EmptyMedia>
              <EmptyTitle className="font-display text-3xl font-bold text-brand-violet">
                Os projetos ainda não foram publicados
              </EmptyTitle>
              <EmptyDescription className="text-base text-brand-ink">
                Assim que a equipe publicar os primeiros trabalhos, eles
                aparecem aqui. Enquanto isso, conte o que você quer criar.
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent>
              <a
                className="inline-flex h-11 items-center justify-center rounded-md bg-brand-blue px-5 font-semibold text-brand-white transition-colors hover:bg-brand-violet"
                href="#contato"
              >
                Falar sobre um projeto
              </a>
            </EmptyContent>
          </Empty>
        </div>
      </div>
    </section>
  );
}
