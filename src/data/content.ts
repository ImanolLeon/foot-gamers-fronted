import { Bolt, Discord, Facebook, TrendUp, Trophy, Users, WhatsApp } from '../components/Icons';

/* ---------- Navegación ---------- */

export const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Cómo funciona', href: '#juego' },
  { label: 'Comunidad', href: '#comunidad' },
  { label: 'Equipos', href: '#equipos' },
  { label: 'Torneos', href: '#torneos' },
] as const;

/* ---------- Hero ---------- */

export const HERO_FACTS = [
  { label: 'Formato', value: 'Eliminación directa' },
  { label: 'Día', value: 'Sábados, 21:00' },
  { label: 'Cupos', value: '16 equipos' },
] as const;

export const NEXT_MATCH = {
  competition: 'Copa Apertura',
  matchday: '12',
  date: 'Sábado, 21:00',
  slots: '16 equipos',
  left: 'Quedan 3 cupos',
  note: 'Inscripción gratis con tu cuenta',
} as const;

/* ---------- Qué pasa cuando entras ---------- */

export const FEATURES = [
  {
    icon: Bolt,
    title: 'Torneos cada semana',
    desc: 'Inscripción abierta de lunes a viernes. El sábado se juega y el domingo ya hay campeón.',
  },
  {
    icon: TrendUp,
    title: 'Un ranking que no miente',
    desc: 'Cada partido suma. Sube puestos, defiende el tuyo y mira quién aguanta toda la temporada.',
  },
  {
    icon: Trophy,
    title: 'Premios que se notan',
    desc: 'Trofeos, insignias y tu nombre en la tabla de campeones. Nada de premios que solo viven en un chat.',
  },
  {
    icon: Users,
    title: 'Arma tu propia liga',
    desc: 'Reúne a tus amigos, elige el formato y organiza tu torneo con las mismas reglas de la casa.',
  },
] as const;

/* ---------- Comunidad ---------- */

export const SPLIT_IMAGE =
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1400&q=80';

export const SPLIT_CHECKS = [
  'Rivales de tu nivel, no de tu paciencia.',
  'Horarios que respetan tu semana.',
  'Reglas claras antes del primer silbato.',
] as const;

/* ---------- Equipos ---------- */

export const TEAMS = [
  'FC Barcelona',
  'Bayern München',
  'Manchester City',
  'Juventus',
  'PSG',
  'Real Madrid',
] as const;

/* ---------- Próxima jornada ---------- */

export const CTA_DETAILS = [
  { label: 'Cuándo', value: 'Sábados, 21:00' },
  { label: 'Dónde', value: 'Discord de la comunidad' },
  { label: 'Formato', value: 'Eliminación directa' },
  { label: 'Inscripción', value: 'Gratis hasta el viernes' },
] as const;

export const CTA_SOCIALS = [
  { label: 'Discord', Icon: Discord },
  { label: 'WhatsApp', Icon: WhatsApp },
  { label: 'Facebook', Icon: Facebook },
] as const;

/* ---------- Footer ---------- */

export const FOOTER_COLUMNS = [
  {
    title: 'La comunidad',
    links: [
      { label: 'Cómo funciona', href: '#juego' },
      { label: 'Equipos', href: '#equipos' },
      { label: 'Próxima jornada', href: '#torneos' },
      { label: 'Reglas de la casa', href: '#comunidad' },
    ],
  },
  {
    title: 'Torneos',
    links: [
      { label: 'Calendario', href: '#torneos' },
      { label: 'Ranking', href: '#torneos' },
      { label: 'Resultados', href: '#torneos' },
      { label: 'Palmarés', href: '#torneos' },
    ],
  },
  {
    title: 'Soporte',
    links: [
      { label: 'Ayuda', href: '#comunidad' },
      { label: 'Discord', href: '#comunidad' },
      { label: 'Privacidad', href: '#comunidad' },
      { label: 'Contacto', href: '#comunidad' },
    ],
  },
] as const;
