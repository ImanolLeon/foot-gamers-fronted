import type { FieldSpec } from '../../../lib/panel';

export const playerField: FieldSpec[] = [
  { key: 'jugadorId', label: 'Jugador', source: '/jugadores', type: 'number' },
];

export const stateField: FieldSpec[] = [
  { key: 'estado', label: 'Estado', options: ['EN_PROCESO', 'TERMINADO'] },
];

export const groupField: FieldSpec[] = [
  {
    key: 'tipoAsignacion',
    label: 'Distribución',
    options: ['ALEATORIO', 'EQUILIBRADO'],
  },
];

export const scoreFields: FieldSpec[] = [
  { key: 'uno', label: 'Goles del lado 1', type: 'number', min: 0 },
  { key: 'dos', label: 'Goles del lado 2', type: 'number', min: 0 },
];
