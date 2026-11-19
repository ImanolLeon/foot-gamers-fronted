import { Navbar } from '../../components/landing/Navbar';
import { Hero } from '../../components/landing/Hero';
import { Features } from '../../components/landing/Features';
import { SplitSection } from '../../components/landing/SplitSection';
import { Teams } from '../../components/landing/Teams';
import { CtaSection } from '../../components/landing/CtaSection';
import { Footer } from '../../components/landing/Footer';

export function Landing() {
  return (
    /* pt compensa la navbar fija */
    <div className="landing pt-[var(--nav-h)]">
      <Navbar />

      <main id="contenido">
        <Hero />
        <Features />
        <SplitSection />
        <Teams />
        <CtaSection />
      </main>

      <Footer />
    </div>
  );
}
