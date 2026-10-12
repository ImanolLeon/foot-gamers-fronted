/**
 * Set de iconos SVG en línea (stroke/fill, sin dependencias).
 * Todos aceptan `className` para tamaño y color heredados de Tailwind.
 */

type IconProps = { className?: string };

/* ---------- Marca ---------- */

export const Crown = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12 2.6l2.3 2.2 3-.7-.9 3 2.3 2.1-2.7 1.3v6.9H7V10.4L4.3 9.1 6.6 7 5.7 4l3 .7L12 2.6z" />
  </svg>
);

/* ---------- Acciones ---------- */

export const Play = ({ className }: IconProps) => (
  <svg viewBox="0 0 16 16" fill="currentColor" className={className} aria-hidden="true">
    <path d="M4 2.2v11.6c0 .5.6.8 1 .5l9-5.8a.6.6 0 000-1l-9-5.8c-.4-.3-1 0-1 .5z" />
  </svg>
);

export const Video = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="1.6" y="4" width="12.5" height="12" rx="2.6" />
    <path d="M14.1 8.2l3.6-2.1a.5.5 0 01.7.5v6.8a.5.5 0 01-.7.5L14.1 12" />
  </svg>
);

export const Download = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.9}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M10 3v10m0 0l-3.6-3.6M10 13l3.6-3.6M4 16.2h12" />
  </svg>
);

export const Globe = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="8.6" />
    <path d="M3.6 12h16.8M12 3.4c2.2 2.4 3.3 5.4 3.3 8.6S14.2 18.2 12 20.6c-2.2-2.4-3.3-5.4-3.3-8.6S9.8 5.8 12 3.4z" />
  </svg>
);

export const ArrowRight = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M2.5 8h11M9 3.5L13.5 8 9 12.5" />
  </svg>
);

/* ---------- Comunidad ---------- */

export const Bolt = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5L13 2z" />
  </svg>
);

export const Users = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M16 20v-1.8a3.6 3.6 0 00-3.6-3.6H6.6A3.6 3.6 0 003 18.2V20" />
    <circle cx="9.5" cy="7.6" r="3.6" />
    <path d="M21 20v-1.8a3.6 3.6 0 00-2.7-3.5M15.6 4.2a3.6 3.6 0 010 6.9" />
  </svg>
);

export const Medal = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="9" r="6" />
    <path d="M8.4 14.2L7 22l5-2.6L17 22l-1.4-7.8" />
  </svg>
);

export const Star = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 3l2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9L12 3z" />
  </svg>
);

/* ---------- Varios ---------- */

export const CheckCircle = ({ className }: IconProps) => (
  <svg viewBox="0 0 20 20" className={className} aria-hidden="true">
    <circle cx="10" cy="10" r="9" fill="currentColor" />
    <path
      d="M5.8 10.3l2.6 2.6 5-5.4"
      fill="none"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const Shield = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2.6l7.4 2.8v6c0 5-3.2 8.4-7.4 10-4.2-1.6-7.4-5-7.4-10v-6L12 2.6z" />
  </svg>
);

/* ---------- Redes sociales ---------- */

export const Discord = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M19.3 5.6A16 16 0 0015.4 4.4l-.2.4a12 12 0 013.2 1.6 13.4 13.4 0 00-12.8 0 12 12 0 013.2-1.6l-.2-.4A16 16 0 004.7 5.6C2.1 9.3 1.4 13 1.7 16.7a16 16 0 004.9 2.5l1-1.7c-.6-.2-1.2-.5-1.7-.9l.4-.3a11.4 11.4 0 009.4 0l.4.3c-.5.4-1.1.7-1.7.9l1 1.7a16 16 0 004.9-2.5c.4-4.3-.7-8.1-3-11.1zM8.7 14.5c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2zm6.6 0c-1 0-1.8-.9-1.8-2s.8-2 1.8-2 1.8.9 1.8 2-.8 2-1.8 2z" />
  </svg>
);

export const WhatsApp = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M12.04 2A9.9 9.9 0 002.1 11.9c0 1.75.46 3.46 1.34 4.96L2 22l5.28-1.38a9.9 9.9 0 004.76 1.21h.01a9.9 9.9 0 009.94-9.9A9.9 9.9 0 0012.05 2zm0 18.02h-.01a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.05-.2-.31a8.2 8.2 0 01-1.26-4.36 8.24 8.24 0 018.25-8.23 8.2 8.2 0 018.24 8.24 8.24 8.24 0 01-8.24 8.22zm4.5-6.17c-.25-.13-1.46-.72-1.68-.8-.23-.08-.4-.12-.56.13-.16.24-.64.8-.79.96-.14.17-.29.19-.54.07-.25-.13-1.04-.39-1.98-1.23-.73-.65-1.22-1.46-1.37-1.71-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.44.13-.15.17-.25.25-.41.09-.17.04-.31-.02-.44-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.42-.56-.43h-.47c-.16 0-.43.06-.65.31-.22.25-.85.84-.85 2.03s.87 2.36.99 2.52c.12.17 1.72 2.62 4.16 3.67.58.25 1.03.4 1.39.51.58.19 1.11.16 1.53.1.47-.07 1.46-.6 1.66-1.17.2-.58.2-1.07.14-1.17-.06-.11-.22-.17-.47-.29z" />
  </svg>
);

export const Facebook = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M13.5 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.25-1.5 1.54-1.5h1.66V3.6c-.29-.04-1.27-.12-2.4-.12-2.38 0-4 1.45-4 4.11v2.28H7.6V13h2.7v8h3.2z" />
  </svg>
);

export const Twitter = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.2 2.3h3.3l-7.2 8.3L22.8 21.7h-6.6l-5.2-6.8-5.9 6.8H1.8l7.7-8.8L1.4 2.3h6.8l4.7 6.2 5.3-6.2zm-1.2 17.5h1.9L7 4.1H5l12 15.7z" />
  </svg>
);

export const Instagram = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.9}
    className={className}
    aria-hidden="true"
  >
    <rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" />
    <circle cx="12" cy="12" r="4.1" />
    <circle cx="17.1" cy="6.9" r="1.2" fill="currentColor" stroke="none" />
  </svg>
);

export const Youtube = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M22.5 7.2a2.8 2.8 0 00-1.95-1.97C18.85 4.8 12 4.8 12 4.8s-6.85 0-8.55.43A2.8 2.8 0 001.5 7.2C1.06 8.9 1.06 12 1.06 12s0 3.1.44 4.8a2.8 2.8 0 001.95 1.97c1.7.43 8.55.43 8.55.43s6.85 0 8.55-.43a2.8 2.8 0 001.95-1.97c.44-1.7.44-4.8.44-4.8s0-3.1-.44-4.8zM9.9 15.3V8.7l5.7 3.3-5.7 3.3z" />
  </svg>
);

/* ---------- Login / formulario ---------- */

export const Google = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path
      fill="#4285F4"
      d="M23.5 12.27c0-.86-.08-1.5-.24-2.18H12v4.13h6.6c-.13 1.1-.85 2.75-2.44 3.86l-.02.15 3.55 2.75.25.02c2.27-2.09 3.56-5.17 3.56-8.73z"
    />
    <path
      fill="#34A853"
      d="M12 24c3.24 0 5.96-1.08 7.94-2.92l-3.78-2.93c-1.03.7-2.4 1.19-4.16 1.19a7.2 7.2 0 01-6.83-4.99l-.15.01-3.68 2.85-.05.14A12 12 0 0012 24z"
    />
    <path
      fill="#FBBC05"
      d="M5.17 14.35a7.2 7.2 0 010-4.7V9.5L1.5 6.65l-.15.07a12 12 0 000 10.56l3.82-2.93z"
    />
    <path
      fill="#EA4335"
      d="M12 4.75c2.34 0 3.91.98 4.82 1.8l3.52-3.44C17.95 1.19 15.24 0 12 0A12 12 0 001.35 7.22l3.82 2.93A7.2 7.2 0 0112 4.75z"
    />
  </svg>
);

export const Gamepad = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.7}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M6.6 7.5h10.8a4.6 4.6 0 014.5 5.6l-.85 4.2A3 3 0 0118 19.6a3 3 0 01-2.35-1.12L13.9 16.6H10.1l-1.75 1.88A3 3 0 016 19.6a3 3 0 01-3.05-2.3l-.85-4.2a4.6 4.6 0 014.5-5.6z" />
    <path d="M6.6 11.2v2.6M5.3 12.5h2.6M15.8 11.9h.01M18 14.3h.01" />
  </svg>
);

export const Mail = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="2.5" y="4.5" width="19" height="15" rx="2.6" />
    <path d="M3.4 6.6l7.5 5.5a2 2 0 002.2 0l7.5-5.5" />
  </svg>
);

export const User = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="8.2" r="4" />
    <path d="M4.5 20.5a7.5 7.5 0 0115 0" />
  </svg>
);

export const LogOut = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M14.5 4.5h3.4a2 2 0 012 2v11a2 2 0 01-2 2h-3.4" />
    <path d="M10 8.2L6.2 12 10 15.8M6.5 12h8.2" />
  </svg>
);

export const ShieldCheck = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 2.6l7.4 2.8v6c0 5-3.2 8.4-7.4 10-4.2-1.6-7.4-5-7.4-10v-6L12 2.6z" />
    <path d="M8.9 12.1l2.2 2.2 4-4.4" />
  </svg>
);

export const Lock = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="4" y="10" width="16" height="10.5" rx="2.4" />
    <path d="M7.8 10V7.6a4.2 4.2 0 018.4 0V10" />
  </svg>
);

export const Eye = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M2.2 12S5.8 5.5 12 5.5 21.8 12 21.8 12 18.2 18.5 12 18.5 2.2 12 2.2 12z" />
    <circle cx="12" cy="12" r="3.2" />
  </svg>
);

export const EyeOff = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M9.7 5.8A9.6 9.6 0 0112 5.5c6.2 0 9.8 6.5 9.8 6.5a17 17 0 01-2.9 3.6M6.3 7.9A17.6 17.6 0 002.2 12S5.8 18.5 12 18.5c1 0 1.9-.15 2.7-.4" />
    <path d="M10.1 10.2a3.2 3.2 0 004.3 4.3M3.5 3.5l17 17" />
  </svg>
);

export const AlertCircle = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.9}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="9.2" />
    <path d="M12 7.6v5M12 16.2h.01" />
  </svg>
);

export const Spinner = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
    <circle cx="12" cy="12" r="9.2" stroke="currentColor" strokeOpacity=".3" strokeWidth="2.6" />
    <path
      d="M21.2 12a9.2 9.2 0 00-9.2-9.2"
      stroke="currentColor"
      strokeWidth="2.6"
      strokeLinecap="round"
    />
  </svg>
);

export const ArrowLeft = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.9}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M20 12H4.5M10 5.5L3.5 12 10 18.5" />
  </svg>
);

/* ---------- Panel de administración ---------- */

export const LayoutDashboard = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="3" y="3" width="7.5" height="8.5" rx="2" />
    <rect x="13.5" y="3" width="7.5" height="5.5" rx="2" />
    <rect x="3" y="15" width="7.5" height="6" rx="2" />
    <rect x="13.5" y="12" width="7.5" height="9" rx="2" />
  </svg>
);

export const Whistle = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M14 8.5H6.5a4.5 4.5 0 100 9h1a4.5 4.5 0 004-2.5" />
    <path d="M14 8.5l4.6-2.8a.6.6 0 01.9.5v3.3" />
    <circle cx="7" cy="13" r="1.8" />
  </svg>
);

export const UserCog = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="10" cy="8" r="3.8" />
    <path d="M3.8 20.2a6.2 6.2 0 0112.4 0" />
    <path d="M17.8 15.6h.01M19.4 17.8h.01M17.8 20h.01" />
  </svg>
);

export const Settings = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="3.2" />
    <path d="M19.6 14.5a1.7 1.7 0 00.34 1.87l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.7 1.7 0 00-1.87-.34 1.7 1.7 0 00-1 1.56V21a2 2 0 11-4 0v-.1a1.7 1.7 0 00-1.11-1.56 1.7 1.7 0 00-1.87.34l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.7 1.7 0 00.34-1.87 1.7 1.7 0 00-1.56-1H3a2 2 0 110-4h.1a1.7 1.7 0 001.56-1.11 1.7 1.7 0 00-.34-1.87l-.06-.06a2 2 0 112.83-2.83l.06.06a1.7 1.7 0 001.87.34H9a1.7 1.7 0 001-1.56V3a2 2 0 114 0v.1a1.7 1.7 0 001 1.56 1.7 1.7 0 001.87-.34l.06-.06a2 2 0 112.83 2.83l-.06.06a1.7 1.7 0 00-.34 1.87V9a1.7 1.7 0 001.56 1H21a2 2 0 110 4h-.1a1.7 1.7 0 00-1.56 1z" />
  </svg>
);

export const Menu = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.9}
    strokeLinecap="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M4 7h16M4 12h16M4 17h16" />
  </svg>
);

export const Search = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="11" cy="11" r="6.5" />
    <path d="M15.8 15.8l4 4" />
  </svg>
);

export const Bell = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M18 8.8a6 6 0 10-12 0c0 5.4-2 6.8-2 6.8h16s-2-1.4-2-6.8" />
    <path d="M13.7 19.5a2 2 0 01-3.4 0" />
  </svg>
);

export const TrendUp = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M3.5 16.5l6-6 4 4 7-7" />
    <path d="M14.5 7.5h6v6" />
  </svg>
);

export const Plus = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={2}
    strokeLinecap="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Dots = ({ className }: IconProps) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <circle cx="5.5" cy="12" r="1.7" />
    <circle cx="12" cy="12" r="1.7" />
    <circle cx="18.5" cy="12" r="1.7" />
  </svg>
);

export const Trophy = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M7.5 3.5h9v5.2a4.5 4.5 0 01-9 0V3.5z" />
    <path d="M7.5 5.2H4.8a2.8 2.8 0 002.9 3.1M16.5 5.2h2.7a2.8 2.8 0 01-2.9 3.1" />
    <path d="M12 13.2v3.4M9 20.5h6M9.8 16.6h4.4l.6 3.9H9.2l.6-3.9z" />
  </svg>
);

export const Award = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <circle cx="12" cy="8.8" r="5.3" />
    <path d="M8.4 13.2L6.8 21l5.2-2.6L17.2 21l-1.6-7.8" />
  </svg>
);

export const Grid = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <rect x="3.2" y="3.2" width="7.6" height="7.6" rx="2" />
    <rect x="13.2" y="3.2" width="7.6" height="7.6" rx="2" />
    <rect x="3.2" y="13.2" width="7.6" height="7.6" rx="2" />
    <rect x="13.2" y="13.2" width="7.6" height="7.6" rx="2" />
  </svg>
);

export const Tag = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M20.4 12.9l-7.5 7.5a2 2 0 01-2.8 0l-6.5-6.5a2 2 0 01-.6-1.4V4.9a1.4 1.4 0 011.4-1.4h7.6a2 2 0 011.4.6l6.9 6.9a2 2 0 010 2.9z" />
    <circle cx="8" cy="8" r="1.4" />
  </svg>
);

export const Close = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.9}
    strokeLinecap="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
);

export const Camera = ({ className }: IconProps) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    <path d="M4 8.4A2.4 2.4 0 0 1 6.4 6h1.2l1.1-1.7a1.6 1.6 0 0 1 1.3-.7h4a1.6 1.6 0 0 1 1.3.7L16.4 6h1.2A2.4 2.4 0 0 1 20 8.4v8.2A2.4 2.4 0 0 1 17.6 19H6.4A2.4 2.4 0 0 1 4 16.6z" />
    <circle cx="12" cy="12.4" r="3.2" />
  </svg>
);