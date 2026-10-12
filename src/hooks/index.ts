import { useEffect, useState } from 'react';

/** Devuelve `true` cuando la ventana ha pasado el umbral de scroll. */
export function useScrolled(threshold = 12) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [threshold]);

  return scrolled;
}

/** Id de la sección que ocupa el centro de la ventana (scrollspy). */
export function useActiveSection(ids: readonly string[]) {
  const [active, setActive] = useState<string>(ids[0] ?? '');

  useEffect(() => {
    if (!('IntersectionObserver' in window)) return;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: '-45% 0px -50% 0px' }
    );

    const nodes = ids
      .map((id) => document.getElementById(id))
      .filter((node): node is HTMLElement => node !== null);

    nodes.forEach((node) => io.observe(node));
    return () => io.disconnect();
  }, [ids]);

  return active;
}