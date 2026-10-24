/**
 * Trazado de campo reutilizable (héroe y próxima jornada).
 * Decorativo: hereda el color con `currentColor` y no captura eventos.
 */
export function PitchMarkings({ className = '' }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 680 420"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="xMidYMid slice"
    >
      <g stroke="currentColor" strokeWidth="1.4">
        {/* Líneas exteriores y medio campo */}
        <rect x="8" y="8" width="664" height="404" />
        <path d="M340 8v404" />
        <circle cx="340" cy="210" r="62" />
        <circle cx="340" cy="210" r="2.4" fill="currentColor" stroke="none" />

        {/* Áreas y arcos del lado izquierdo */}
        <rect x="8" y="98" width="112" height="224" />
        <rect x="8" y="150" width="46" height="120" />
        <circle cx="88" cy="210" r="2.4" fill="currentColor" stroke="none" />
        <path d="M120 174a60 60 0 0 1 0 72" />

        {/* Áreas y arcos del lado derecho */}
        <rect x="560" y="98" width="112" height="224" />
        <rect x="626" y="150" width="46" height="120" />
        <circle cx="592" cy="210" r="2.4" fill="currentColor" stroke="none" />
        <path d="M560 174a60 60 0 0 0 0 72" />

        {/* Córners */}
        <path d="M8 24a16 16 0 0 0 16-16" />
        <path d="M8 396a16 16 0 0 0 16 16" />
        <path d="M672 24a16 16 0 0 1-16-16" />
        <path d="M672 396a16 16 0 0 1-16 16" />
      </g>
    </svg>
  );
}
