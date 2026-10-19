import { MotionProvider } from "@/components/motion/motion-provider";
import {
  derivarLinksNav,
  derivarSecoes,
  type SecaoNumerada,
} from "@/lib/landing/navegacao";
import type { ConfigLanding, LandingDocumento } from "@/lib/landing/schema";
import { site } from "@/lib/site";
import { AboutSection } from "./about-section";
import { ClientsSection } from "./clients-section";
import { ContactSection } from "./contact-section";
import { HeroSection } from "./hero-section";
import { PillarsSection } from "./pillars-section";
import { PreviewBanner } from "./preview-banner";
import { ProcessSection } from "./process-section";
import { ProjectsSection } from "./projects-section";
import { ScrollToTop } from "./scroll-to-top";
import { SiteFooter } from "./site-footer";
import { SiteHeader } from "./site-header";
import { Telemetria } from "./telemetria";

function jsonLdOrganizacao(doc: LandingDocumento) {
  const { contato, seo } = doc.config;

  return {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    name: site.name,
    description: seo.descricao,
    url: site.url,
    logo: `${site.url}/brand/logo-vertical-color.png`,
    email: contato.email,
    telephone: contato.telefone.replace(/[^\d+]/g, ""),
    sameAs: [contato.instagramUrl],
    address: {
      "@type": "PostalAddress",
      addressLocality: contato.cidade,
      addressRegion: contato.uf,
      addressCountry: "BR",
    },
    areaServed: "BR",
    knowsAbout: [
      "Realidade virtual na educação",
      "Gamificação",
      "Aprendizagem socioemocional",
    ],
  };
}

function renderizarSecao(
  secao: SecaoNumerada,
  contato: ConfigLanding["contato"],
) {
  switch (secao.tipo) {
    case "hero":
      return <HeroSection key={secao.tipo} secao={secao} />;
    case "sobre":
      return <AboutSection key={secao.tipo} secao={secao} />;
    case "pilares":
      return <PillarsSection key={secao.tipo} secao={secao} />;
    case "projetos":
      return <ProjectsSection key={secao.tipo} secao={secao} />;
    case "processo":
      return <ProcessSection key={secao.tipo} secao={secao} />;
    case "clientes":
      return <ClientsSection key={secao.tipo} secao={secao} />;
    case "contato":
      return (
        <ContactSection contato={contato} key={secao.tipo} secao={secao} />
      );
  }
}

type LandingProps = {
  doc: LandingDocumento;
  /** Id da versão publicada, usado pela telemetria. Ignorado na pré-visualização. */
  versaoId?: string | null;
  /** Pré-visualização do rascunho: mostra o aviso e não envia telemetria. */
  preview?: boolean;
};

/** Landing completa: cabeçalho, seções, rodapé e JSON-LD, a partir de um documento. */
export function Landing({
  doc,
  versaoId = null,
  preview = false,
}: LandingProps) {
  const links = derivarLinksNav(doc);

  return (
    <MotionProvider>
      <SiteHeader
        aviso={doc.config.aviso}
        ctaRotulo={doc.config.cabecalho.ctaRotulo}
        links={links}
      />
      <main
        className="overflow-x-clip outline-none"
        id="conteudo"
        tabIndex={-1}
      >
        {derivarSecoes(doc).map((secao) =>
          renderizarSecao(secao, doc.config.contato),
        )}
      </main>
      <SiteFooter config={doc.config} links={links} />
      <ScrollToTop />
      {preview ? <PreviewBanner /> : null}
      {preview ? null : <Telemetria versaoId={versaoId} />}
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD montado a partir do documento da landing, sem HTML livre
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(jsonLdOrganizacao(doc)).replace(
            /</g,
            "\\u003c",
          ),
        }}
        type="application/ld+json"
      />
    </MotionProvider>
  );
}
