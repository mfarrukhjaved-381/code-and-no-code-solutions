import { services } from '../content/services';
import { useRevealOnScroll } from '../hooks/useRevealOnScroll';
import { Contact } from '../sections/Contact';
import { Hero } from '../sections/Hero';
import { Services } from '../sections/Services';
import { Team } from '../sections/Team';
import { Work } from '../sections/Work';
import { CursorRing } from '../ui/CursorRing';
import { Header } from '../ui/Header';
import { Marquee } from '../ui/Marquee';
import { SectionNav } from '../ui/SectionNav';
import { Footer } from './Footer';
import { GalaxyLayer } from './GalaxyLayer';

const marqueeItems = services.map((service) => service.name);

/**
 * Application root, shared by the browser entry and the build-time prerender.
 *
 * It must render identically in both: anything that depends on the browser (WebGL support,
 * reduced motion, pointer type) has to be read after hydration, never during this first render,
 * or the prerendered HTML will not match and React will discard it. `GalaxyLayer`, `CursorRing`
 * and the reveal hook all follow that rule by acting only inside effects.
 */
export function App() {
  useRevealOnScroll();

  return (
    <>
      <a
        href="#main"
        className="sr-only bg-ink px-4 py-2 font-medium text-space focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50"
      >
        Skip to content
      </a>
      <div aria-hidden="true" className="space-backdrop pointer-events-none fixed inset-0 -z-20" />
      <div
        aria-hidden="true"
        className="scroll-progress fixed inset-x-0 top-0 z-40 h-px bg-linear-to-r from-accent-cool to-accent"
      />
      <GalaxyLayer />
      <Header />
      <main id="main">
        <Hero />
        <Team />
        <Marquee items={marqueeItems} />
        <Services />
        <Work />
        <Contact />
      </main>
      <Footer />
      <SectionNav />
      <CursorRing />
    </>
  );
}
