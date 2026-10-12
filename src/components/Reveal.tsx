import { useEffect, useRef, useState, type ReactNode } from 'react';

type RevealProps = {
  children: ReactNode;
  /** Retardo en ms para escalonar la entrada de hermanos. */
  delay?: number;
  className?: string;
};

/** Sin animación: preferencia de movimiento reducido o sin IntersectionObserver. */
function shouldSkipAnimation() {
  return (
    !('IntersectionObserver' in window) ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  );
}

/**
 * Envuelve contenido y lo anima (fade-up) cuando entra en el viewport.
 * Respeta `prefers-reduced-motion` mostrando el contenido sin animación.
 */
export function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(shouldSkipAnimation);

  useEffect(() => {
    if (visible) return;
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return;
        setVisible(true);
        io.disconnect();
      },
      { threshold: 0.15, rootMargin: '0px 0px -60px 0px' }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [visible]);

  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`reveal ${visible ? 'reveal-visible' : ''} ${className}`.trim()}
    >
      {children}
    </div>
  );
}