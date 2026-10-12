import { Bolt, Discord, Facebook, Medal, Star, Users, WhatsApp } from '../components/Icons';

/* ---------- Navegación ---------- */

export const NAV_LINKS = [
  { label: 'Inicio', href: '#inicio' },
  { label: 'Juego', href: '#juego' },
  { label: 'Equipos', href: '#equipos' },
  { label: 'Torneos', href: '#torneos' },
  { label: 'Comunidad', href: '#comunidad' },
] as const;

/* ---------- Hero ---------- */

export const HERO_STATS = [
  { value: '50M+', label: 'Jugadores' },
  { value: '200+', label: 'Equipos' },
  { value: '4K', label: 'Resolución' },
] as const;

export const HERO_IMAGE =
  'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?auto=format&fit=crop&w=1100&q=80';

/* ---------- Tarjetas de comunidad ---------- */

export const FEATURES = [
  {
    icon: Bolt,
    title: 'Torneos semanales',
    desc: 'Compite cada semana contra otros jugadores de la comunidad. Sube en el ranking y gánate tu lugar entre los mejores.',
    highlighted: false,
  },
  {
    icon: Users,
    title: 'Comunidad activa',
    desc: 'Encuentra rivales, arma tu equipo y comparte la pasión por PES con cientos de jugadores como tú.',
    highlighted: true,
  },
  {
    icon: Medal,
    title: 'Premios y reconocimiento',
    desc: 'Los mejores de cada torneo se llevan premios, insignias y un lugar en la tabla de campeones.',
    highlighted: false,
  },
  {
    icon: Star,
    title: 'Tu propia liga',
    desc: 'Crea tu torneo, invita a tus amigos y arma la competencia que siempre quisiste tener.',
    highlighted: false,
  },
] as const;

/* ---------- Split ---------- */

export const SPLIT_IMAGE =
  'https://images.unsplash.com/photo-1522778119026-d647f0596c20?auto=format&fit=crop&w=1400&q=80';

export const SPLIT_CHECKS = [
  'Torneos organizados cada semana',
  'Rivales de tu nivel, siempre listos para jugar',
  'Un ranking donde tu nombre puede quedar en la cima',
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

/* ---------- CTA ---------- */

export const CTA_SOCIALS = [
  { label: 'Discord', Icon: Discord },
  { label: 'WhatsApp', Icon: WhatsApp },
  { label: 'Facebook', Icon: Facebook },
] as const;

/* ---------- Footer ---------- */

export const FOOTER_COLUMNS = [
  {
    title: 'Comunidad',
    links: [
      { label: 'Sobre nosotros', href: '#comunidad' },
      { label: 'Cómo participar', href: '#comunidad' },
      { label: 'Torneos', href: '#torneos' },
      { label: 'Reglamento', href: '#comunidad' },
    ],
  },
  {
    title: 'Torneos',
    links: [
      { label: 'Torneos activos', href: '#torneos' },
      { label: 'Ranking global', href: '#torneos' },
      { label: 'Resultados', href: '#torneos' },
      { label: 'Calendario', href: '#torneos' },
    ],
  },
  {
    title: 'Soporte',
    links: [
      { label: 'Ayuda', href: '#comunidad' },
      { label: 'Privacidad', href: '#comunidad' },
      { label: 'Términos', href: '#comunidad' },
      { label: 'Contacto', href: '#comunidad' },
    ],
  },
] as const;