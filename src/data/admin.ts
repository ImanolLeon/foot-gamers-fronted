import { Award, Grid, Shield, Trophy, Users, Whistle } from '../components/Icons';
import type { IconComponent } from './panelNav';

/* ============================================================
   MÉTRICAS (relleno estático)
   ============================================================ */

export type AdminStat = {
  label: string;
  valor: string;
  delta: string;
  Icon: IconComponent;
};

export const ADMIN_STATS: AdminStat[] = [
  {
    label: 'Torneos en proceso',
    valor: '12',
    delta: '+3',
    Icon: Trophy,
  },
  {
    label: 'Partidos finalizados',
    valor: '1.284',
    delta: '+18%',
    Icon: Whistle,
  },
  {
    label: 'Jugadores registrados',
    valor: '3.417',
    delta: '+126',
    Icon: Users,
  },
  {
    label: 'Trofeos entregados',
    valor: '86',
    delta: '+9',
    Icon: Award,
  },
];

/* ============================================================
   TORNEOS (relleno estático)
   ============================================================ */

export type AdminTorneo = {
  id: number;
  nombre: string;
  categoria: string;
  fase: 'GRUPOS' | 'OCTAVOS' | 'CUARTOS' | 'SEMIFINALES' | 'FINAL';
  estado: 'EN_PROCESO' | 'TERMINADO';
  equipos: number;
  fecha: string;
};

export const ADMIN_TORNEOS: AdminTorneo[] = [
  {
    id: 1,
    nombre: 'Copa Continental 2026',
    categoria: 'Premium',
    fase: 'SEMIFINALES',
    estado: 'EN_PROCESO',
    equipos: 16,
    fecha: '2026-10-18',
  },
  {
    id: 2,
    nombre: 'Liga Sabanalera',
    categoria: 'Open',
    fase: 'GRUPOS',
    estado: 'EN_PROCESO',
    equipos: 8,
    fecha: '2026-11-02',
  },
  {
    id: 3,
    nombre: 'Duelo de Afters',
    categoria: 'Amistoso',
    fase: 'FINAL',
    estado: 'EN_PROCESO',
    equipos: 4,
    fecha: '2026-09-30',
  },
  {
    id: 4,
    nombre: 'Mundialito de Clubes',
    categoria: 'Premium',
    fase: 'CUARTOS',
    estado: 'TERMINADO',
    equipos: 16,
    fecha: '2026-09-12',
  },
  {
    id: 5,
    nombre: 'Torneo Relámpago',
    categoria: 'Open',
    fase: 'GRUPOS',
    estado: 'TERMINADO',
    equipos: 8,
    fecha: '2026-08-25',
  },
];

/* ============================================================
   ACTIVIDAD RECIENTE (relleno estático)
   ============================================================ */

export type AdminActividad = {
  id: number;
  actor: string;
  accion: string;
  detalle: string;
  hace: string;
  Icon: IconComponent;
};

export const ADMIN_ACTIVIDAD: AdminActividad[] = [
  {
    id: 1,
    actor: 'imanol',
    accion: 'abrió las inscripciones de',
    detalle: 'Liga Sabanalera',
    hace: 'Hace 12 min',
    Icon: Trophy,
  },
  {
    id: 2,
    actor: 'system',
    accion: 'cerró el torneo',
    detalle: 'Mundialito de Clubes',
    hace: 'Hace 2 h',
    Icon: Grid,
  },
  {
    id: 3,
    actor: 'imanol',
    accion: 'asignó 4 bandos al grupo B de',
    detalle: 'Copa Continental 2026',
    hace: 'Hace 5 h',
    Icon: Shield,
  },
  {
    id: 4,
    actor: 'system',
    accion: 'entregó el trofeo a',
    detalle: 'Duelo de Afters',
    hace: 'Ayer',
    Icon: Award,
  },
];

/* ============================================================
   RELLENO DE TABLAS SECUNDARIAS
   ============================================================ */

export const ADMIN_JUGADORES_RELLENO = [
  { id: 1, username: 'imanol', email: 'imanol@footgamers.com', equipo: 'San Lorenzo', trofeos: 7 },
  { id: 2, username: 'goleador_94', email: 'goleador@footgamers.com', equipo: 'Bayern München', trofeos: 5 },
  { id: 3, username: 'mufa_hard', email: 'mufa@footgamers.com', equipo: 'FC Barcelona', trofeos: 4 },
  { id: 4, username: 'tiro_libres', email: 'tiro@footgamers.com', equipo: 'Real Madrid', trofeos: 3 },
  { id: 5, username: 'defensa_cero', email: 'defensa@footgamers.com', equipo: 'PSG', trofeos: 2 },
];

export const ADMIN_PARTICIPANTES_RELLENO = [
  { id: 1, jugador: 'goleador_94', torneo: 'Copa Continental 2026', participaciones: 9, elo: 1840 },
  { id: 2, jugador: 'mufa_hard', torneo: 'Liga Sabanalera', participaciones: 7, elo: 1725 },
  { id: 3, jugador: 'tiro_libres', torneo: 'Duelo de Afters', participaciones: 6, elo: 1690 },
  { id: 4, jugador: 'defensa_cero', torneo: 'Copa Continental 2026', participaciones: 5, elo: 1580 },
];

/** Barras del gráfico de barras (relleno). */
export const ADMIN_GRAFICO = [
  { mes: 'Abr', valor: 48 },
  { mes: 'May', valor: 72 },
  { mes: 'Jun', valor: 55 },
  { mes: 'Jul', valor: 90 },
  { mes: 'Ago', valor: 64 },
  { mes: 'Sep', valor: 100 },
  { mes: 'Oct', valor: 78 },
];