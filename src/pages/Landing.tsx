import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { Features } from '../components/Features';
import { SplitSection } from '../components/SplitSection';
import { Teams } from '../components/Teams';
import { CtaSection } from '../components/CtaSection';
import { Footer } from '../components/Footer';

export function Landing() {
  return (
    /* pt compensa la navbar fija */
    <div className="pt-[var(--nav-h)]">
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