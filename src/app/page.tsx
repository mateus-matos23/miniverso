import { site } from "@/lib/site";
import { AboutSection } from "./_components/about-section";
import { ClientsSection } from "./_components/clients-section";
import { ContactSection } from "./_components/contact-section";
import { HeroSection } from "./_components/hero-section";
import { PillarsSection } from "./_components/pillars-section";
import { ProjectsSection } from "./_components/projects-section";
import { ScrollToTop } from "./_components/scroll-to-top";
import { SiteFooter } from "./_components/site-footer";
import { SiteHeader } from "./_components/site-header";

// Clientes publicados no admin entram na landing em até 5 minutos
// (ou imediatamente, via revalidatePath nas actions do admin).
export const revalidate = 300;

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "EducationalOrganization",
  name: site.name,
  description: site.description,
  url: site.url,
  logo: `${site.url}/brand/logo-vertical-color.png`,
  email: site.contact.email,
  telephone: site.contact.phone.replace(/[^\d+]/g, ""),
  sameAs: [site.contact.instagram],
  address: {
    "@type": "PostalAddress",
    addressLocality: site.contact.city,
    addressRegion: site.contact.regionCode,
    addressCountry: site.contact.country,
  },
  areaServed: "BR",
  knowsAbout: [
    "Realidade virtual na educação",
    "Gamificação",
    "Aprendizagem socioemocional",
  ],
};

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main
        className="overflow-x-clip outline-none"
        id="conteudo"
        tabIndex={-1}
      >
        <HeroSection />
        <AboutSection />
        <PillarsSection />
        <ProjectsSection />
        <ClientsSection />
        <ContactSection />
      </main>
      <SiteFooter />
      <ScrollToTop />
      <script
        // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD estático, sem entrada do usuário
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
    </>
  );
}
