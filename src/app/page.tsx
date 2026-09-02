import { ContactSection } from "./_components/contact-section";
import { ExperiencesSection } from "./_components/experiences-section";
import { HeroSection } from "./_components/hero-section";
import { PartnershipsSection } from "./_components/partnerships-section";
import { SignalsSection } from "./_components/signals-section";
import { SiteHeader } from "./_components/site-header";
import { StatementSection } from "./_components/statement-section";

export default function Home() {
  return (
    <main className="overflow-x-clip" id="top">
      <SiteHeader />
      <HeroSection />
      <StatementSection />
      <SignalsSection />
      <ExperiencesSection />
      <PartnershipsSection />
      <ContactSection />
    </main>
  );
}
