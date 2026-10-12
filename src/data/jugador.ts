import { Award, Bolt, TrendUp, Whistle } from '../components/Icons';
import type { IconComponent } from './panelNav';

/* ============================================================
   MÉTRICAS PERSONALES (relleno estático)
   ============================================================ */

export type JugadorStat = {
  label: string;
  valor: string;
  delta: string;
  Icon: IconComponent;
};

export const JUGADOR_STATS: JugadorStat[] = [
  { label: 'Puntos de liga', valor: '1.840', delta: '+45', Icon: TrendUp },
  { label: 'Partidos jugados', valor: '38', delta: '+4', Icon: Whistle },
  { label: 'Victorias', valor: '23', delta: '+3', Icon: Bolt },
  { label: 'Trofeos', valor: '7', delta: '+1', Icon: Award },
];

/* ============================================================
   PRÓXIMOS PARTIDOS
   Espeja `PartidoResponseDto`, con el rival y el torneo ya
   resueltos para mostrarlos (en la API vendrían por relación).
   ============================================================ */

export type JugadorPartido = {
  id: number;
  rival: string;
  torneo: string;
  fase: 'GRUPOS' | 'OCTAVOS' | 'CUARTOS' | 'SEMIFINALES' | 'FINAL';
  fecha: string;
  hora: string;
  estado: 'PROGRAMADO' | 'FINALIZADO';
  resultado?: string;
};

export const JUGADOR_PARTIDOS: JugadorPartido[] = [
  {
    id: 1,
    rival: 'goleador_94',
    torneo: 'Copa Continental 2026',
    fase: 'SEMIFINALES',
    fecha: '2026-10-18',
    hora: '20:00',
    estado: 'PROGRAMADO',
  },
  {
    id: 2,
    rival: 'defensa_cero',
    torneo: 'Copa Continental 2026',
    fase: 'SEMIFINALES',
    fecha: '2026-10-18',
    hora: '21:30',
    estado: 'PROGRAMADO',
  },
  {
    id: 3,
    rival: 'mufa_hard',
    torneo: 'Liga Sabanalera',
    fase: 'GRUPOS',
    fecha: '2026-11-02',
    hora: '18:30',
    estado: 'PROGRAMADO',
  },
  {
    id: 4,
    rival: 'tiro_libres',
    torneo: 'Duelo de Afters',
    fase: 'FINAL',
    fecha: '2026-09-30',
    hora: '21:00',
    estado: 'FINALIZADO',
    resultado: '3 - 2',
  },
];

/* ============================================================
   TORNEOS ABIERTOS
   Espeja `TorneoInscripcionResponseDto` (endpoint /torneos/disponibles).
   ============================================================ */

export type JugadorTorneoAbierto = {
  id: number;
  nombre: string;
  categoria: string;
  fechaInicio: string;
  cantidadJugadores: number;
  inscritos: number;
  cuposDisponibles: number;
  yaInscrito: boolean;
};

export const JUGADOR_TORNEOS_ABIERTOS: JugadorTorneoAbierto[] = [
  {
    id: 1,
    nombre: 'Copa Continental 2026',
    categoria: 'Premium',
    fechaInicio: '2026-10-18',
    cantidadJugadores: 16,
    inscritos: 14,
    cuposDisponibles: 2,
    yaInscrito: true,
  },
  {
    id: 2,
    nombre: 'Relámpago Nocturno',
    categoria: 'Amistoso',
    fechaInicio: '2026-10-25',
    cantidadJugadores: 8,
    inscritos: 5,
    cuposDisponibles: 3,
    yaInscrito: false,
  },
  {
    id: 3,
    nombre: 'Torneo de Barrio',
    categoria: 'Open',
    fechaInicio: '2026-11-15',
    cantidadJugadores: 8,
    inscritos: 2,
    cuposDisponibles: 6,
    yaInscrito: false,
  },
];

/* ============================================================
   MIS TORNEOS
   Espeja `TorneoResponseDto` (endpoint /jugadores/mis-torneos).
   ============================================================ */

export type JugadorTorneo = {
  id: number;
  nombre: string;
  categoria: string;
  fase: 'GRUPOS' | 'OCTAVOS' | 'CUARTOS' | 'SEMIFINALES' | 'FINAL';
  estado: 'EN_PROCESO' | 'TERMINADO';
  jugadores: number;
  fecha: string;
};

export const JUGADOR_MIS_TORNEOS: JugadorTorneo[] = [
  {
    id: 1,
    nombre: 'Copa Continental 2026',
    categoria: 'Premium',
    fase: 'SEMIFINALES',
    estado: 'EN_PROCESO',
    jugadores: 16,
    fecha: '2026-10-18',
  },
  {
    id: 2,
    nombre: 'Liga Sabanalera',
    categoria: 'Open',
    fase: 'GRUPOS',
    estado: 'EN_PROCESO',
    jugadores: 8,
    fecha: '2026-11-02',
  },
  {
    id: 3,
    nombre: 'Mundialito de Clubes',
    categoria: 'Premium',
    fase: 'FINAL',
    estado: 'TERMINADO',
    jugadores: 16,
    fecha: '2026-09-12',
  },
];

/* ============================================================
   CLASIFICACIÓN
   Espeja `ClasificacionResponseDto`. `yo` marca la fila propia.
   ============================================================ */

export type JugadorClasificacion = {
  grupo: string;
  username: string;
  jugados: number;
  ganados: number;
  empatados: number;
  perdidos: number;
  puntos: number;
  yo: boolean;
};

export const JUGADOR_CLASIFICACION: JugadorClasificacion[] = [
  { grupo: 'A', username: 'goleador_94', jugados: 9, ganados: 7, empatados: 1, perdidos: 1, puntos: 22, yo: false },
  { grupo: 'A', username: 'imanol', jugados: 9, ganados: 6, empatados: 2, perdidos: 1, puntos: 20, yo: true },
  { grupo: 'A', username: 'mufa_hard', jugados: 9, ganados: 5, empatados: 1, perdidos: 3, puntos: 16, yo: false },
  { grupo: 'A', username: 'tiro_libres', jugados: 9, ganados: 3, empatados: 2, perdidos: 4, puntos: 11, yo: false },
  { grupo: 'A', username: 'defensa_cero', jugados: 9, ganados: 1, empatados: 2, perdidos: 6, puntos: 5, yo: false },
];

/* ============================================================
   TROFEOS
   Espeja `TrofeoResponseDto` (endpoint /jugadores/mis-trofeos).
   ============================================================ */

export type JugadorTrofeo = {
  id: number;
  nombre: string;
  torneo: string;
  fecha: string;
};

export const JUGADOR_TROFEOS: JugadorTrofeo[] = [
  { id: 1, nombre: 'Campeón', torneo: 'Mundialito de Clubes', fecha: '2026-09-12' },
  { id: 2, nombre: 'Campeón', torneo: 'Duelo de Afters', fecha: '2026-03-20' },
  { id: 3, nombre: 'Subcampeón', torneo: 'Copa Continental 2025', fecha: '2025-12-01' },
  { id: 4, nombre: 'Campeón', torneo: 'Torneo Relámpago', fecha: '2025-08-25' },
];

/* ============================================================
   RENDIMIENTO MENSUAL (gráfico de barras)
   ============================================================ */

export const JUGADOR_GRAFICO = [
  { mes: 'Abr', valor: 55 },
  { mes: 'May', valor: 70 },
  { mes: 'Jun', valor: 40 },
  { mes: 'Jul', valor: 85 },
  { mes: 'Ago', valor: 60 },
  { mes: 'Sep', valor: 95 },
  { mes: 'Oct', valor: 75 },
];
