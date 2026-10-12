/**
 * Ondas concéntricas reutilizables (efecto estadio del hero).
 * Puramente decorativas: `aria-hidden` y sin eventos de puntero.
 */
export function BrandWaves({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 900 900"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <g fill="none" stroke="#e070d0" strokeOpacity=".18" strokeWidth="1">
        <circle cx="620" cy="300" r="140" />
        <circle cx="620" cy="300" r="220" />
        <circle cx="620" cy="300" r="310" />
        <circle cx="620" cy="300" r="410" />
        <circle cx="620" cy="300" r="520" />
        <circle cx="620" cy="300" r="640" />
        <circle cx="620" cy="300" r="780" />
      </g>
      <g fill="none" stroke="#c210a0" strokeOpacity=".3" strokeWidth="1">
        <circle cx="620" cy="300" r="180" />
        <circle cx="620" cy="300" r="360" />
        <circle cx="620" cy="300" r="470" />
      </g>
    </svg>
  );
}