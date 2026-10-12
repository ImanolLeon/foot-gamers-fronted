import {
  Award,
  Grid,
  LayoutDashboard,
  Settings,
  Shield,
  Star,
  Tag,
  Trophy,
  UserCog,
  Users,
  Whistle,
} from '../components/Icons';

export type IconComponent = (props: { className?: string }) => React.JSX.Element;

export type PanelNavItem = {
  label: string;
  to: string;
  Icon: IconComponent;
  descripcion: string;
};

/* ============================================================
   NAVEGACIÓN — ADMINISTRADOR
   Acceso total: creación de torneos, gestión de usuarios, etc.
   ============================================================ */

export const ADMIN_NAV: PanelNavItem[] = [
  {
    label: 'Panel',
    to: '/admin',
    Icon: LayoutDashboard,
    descripcion: 'Resumen general de la comunidad con métricas clave.',
  },
  {
    label: 'Torneos',
    to: '/admin/torneos',
    Icon: Trophy,
    descripcion: 'Crear, organizar y supervisar los torneos de la comunidad.',
  },
  {
    label: 'Partidos',
    to: '/admin/partidos',
    Icon: Whistle,
    descripcion: 'Programación de partidos, resultados y validación.',
  },
  {
    label: 'Jugadores',
    to: '/admin/jugadores',
    Icon: Users,
    descripcion: 'Altas, equipos favoritos y perfil de cada jugador.',
  },
  {
    label: 'Bandos',
    to: '/admin/bandos',
    Icon: Shield,
    descripcion: 'Equipos disponibles y sus relaciones con los torneos.',
  },
  {
    label: 'Grupos',
    to: '/admin/grupos',
    Icon: Grid,
    descripcion: 'Estructura de grupos, sorteos y asignaciones.',
  },
  {
    label: 'Categorías',
    to: '/admin/categorias',
    Icon: Tag,
    descripcion: 'Categorías de peso y reglas de cada torneo.',
  },
  {
    label: 'Trofeos',
    to: '/admin/trofeos',
    Icon: Award,
    descripcion: 'Palmarés, premios y reconocimiento a los campeones.',
  },
  {
    label: 'Usuarios',
    to: '/admin/usuarios',
    Icon: UserCog,
    descripcion: 'Gestión de cuentas, roles y permisos de acceso.',
  },
  {
    label: 'Ajustes',
    to: '/admin/ajustes',
    Icon: Settings,
    descripcion: 'Preferencias del panel y configuración general.',
  },
];

/* ============================================================
   NAVEGACIÓN — JUGADOR
   Solo lo suyo: inscripciones, sus partidos, su clasificación.
   Sin creación de torneos, usuarios, grupos ni categorías.
   ============================================================ */

export const JUGADOR_NAV: PanelNavItem[] = [
  {
    label: 'Inicio',
    to: '/jugador',
    Icon: LayoutDashboard,
    descripcion: 'Tu resumen: posición, puntos y próximos partidos.',
  },
  {
    label: 'Torneos abiertos',
    to: '/jugador/torneos',
    Icon: Trophy,
    descripcion: 'Torneos con cupos disponibles e inscripción.',
  },
  {
    label: 'Mis partidos',
    to: '/jugador/partidos',
    Icon: Whistle,
    descripcion: 'Calendario, resultados y estado de confirmación.',
  },
  {
    label: 'Mis torneos',
    to: '/jugador/mis-torneos',
    Icon: Grid,
    descripcion: 'Torneos en los que estás inscrito y su progreso.',
  },
  {
    label: 'Clasificación',
    to: '/jugador/clasificacion',
    Icon: Star,
    descripcion: 'Tabla de posiciones de tus grupos.',
  },
  {
    label: 'Mis trofeos',
    to: '/jugador/trofeos',
    Icon: Award,
    descripcion: 'Tu palmarés y reconocimientos.',
  },
  {
    label: 'Mi perfil',
    to: '/jugador/perfil',
    Icon: UserCog,
    descripcion: 'Tu cuenta, equipo favorito e imagen.',
  },
];
