import { request } from './api';

export type Row = {
  id: number;
  [key: string]: string | number | boolean | null;
};
export type Page<T> = {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
};

export type FieldSpec = {
  key: string;
  label: string;
  type?: string;
  source?: string;
  options?: string[];
  optional?: boolean;
  min?: number;
};

export type Resource = {
  title: string;
  path: string;
  columns: [string, string][];
  fields: FieldSpec[];
};
const text = (
  key: string,
  label: string,
  type = 'text',
  optional = false,
): FieldSpec => ({ key, label, type, optional });
const ref = (
  key: string,
  label: string,
  source: string,
  optional = false,
): FieldSpec => ({ key, label, source, optional, type: 'number' });
export const resources: Record<string, Resource> = {
  torneos: {
    title: 'Torneos',
    path: '/torneos',
    columns: [
      ['nombre', 'Torneo'],
      ['nombreCategoria', 'Categoría'],
      ['fechaInicio', 'Inicio'],
      ['fechaFin', 'Fin'],
      ['cantidadJugadores', 'Cupos'],
      ['estado', 'Estado'],
    ],
    fields: [
      text('nombre', 'Nombre'),
      ref('categoriaId', 'Categoría', '/categorias'),
      text('fechaInicio', 'Inicio', 'date'),
      text('fechaFin', 'Fin', 'date'),
      {
        ...text('cantidadJugadores', 'Cantidad de jugadores', 'number'),
        min: 2,
      },
      ref('trofeoId', 'Trofeo', '/trofeos'),
      { ...text('cantidadGrupos', 'Cantidad de grupos', 'number'), min: 1 },
    ],
  },
  partidos: {
    title: 'Partidos',
    path: '/partidos',
    columns: [
      ['id', 'Partido'],
      ['torneoId', 'Torneo'],
      ['fecha', 'Fecha'],
      ['tipoPartido', 'Tipo'],
      ['fase', 'Fase'],
      ['resultado', 'Resultado'],
      ['estado', 'Estado'],
    ],
    fields: [
      ref(
        'torneoId',
        'Torneo (obligatorio para partidos de torneo)',
        '/torneos',
        true,
      ),
      { key: 'tipoPartido', label: 'Tipo', options: ['AMISTOSO', 'TORNEO'] },
      text('fecha', 'Fecha', 'date'),
    ],
  },
  jugadores: {
    title: 'Jugadores',
    path: '/jugadores',
    columns: [
      ['username', 'Jugador'],
      ['equipoFavorito', 'Equipo favorito'],
      ['fechaRegistro', 'Registro'],
    ],
    fields: [
      ref('usuarioId', 'Usuario', '/usuarios'),
      text('equipoFavorito', 'Equipo favorito'),
    ],
  },
  categorias: {
    title: 'Categorías',
    path: '/categorias',
    columns: [
      ['nombre', 'Nombre'],
      ['formato', 'Formato'],
    ],
    fields: [text('nombre', 'Nombre'), text('formato', 'Formato')],
  },
  bandos: {
    title: 'Bandos',
    path: '/bando',
    columns: [
      ['id', 'Identificador'],
      ['numeroLado', 'Lado'],
    ],
    fields: [{ ...text('numeroLado', 'Número de lado', 'number'), min: 1 }],
  },
  trofeos: {
    title: 'Trofeos',
    path: '/trofeos',
    columns: [
      ['nombre', 'Trofeo'],
      ['username', 'Ganador'],
      ['fecha', 'Fecha'],
    ],
    fields: [
      text('nombre', 'Nombre'),
      text('fecha', 'Fecha', 'date', true),
      ref('jugadorId', 'Ganador', '/jugadores', true),
    ],
  },
  usuarios: {
    title: 'Usuarios',
    path: '/usuarios',
    columns: [
      ['username', 'Usuario'],
      ['email', 'Correo'],
      ['rol', 'Rol'],
      ['provider', 'Acceso'],
    ],
    fields: [
      text('username', 'Usuario'),
      text('email', 'Correo', 'email'),
      text(
        'contrasena',
        'Contraseña nueva (se reemplaza al guardar)',
        'password',
      ),
      { key: 'rol', label: 'Rol', options: ['JUGADOR', 'ADMINISTRADOR'] },
    ],
  },
  participaciones: {
    title: 'Participaciones',
    path: '/participaciones',
    columns: [
      ['partidoId', 'Partido'],
      ['usernameJugador', 'Jugador'],
      ['numeroLado', 'Lado'],
      ['equipo', 'Equipo'],
      ['estadoConfirmacion', 'Confirmación'],
    ],
    fields: [
      ref('partidoId', 'Partido', '/partidos'),
      ref('jugadorId', 'Jugador', '/jugadores'),
      ref('bandoId', 'Bando', '/bando'),
      text('equipo', 'Equipo'),
    ],
  },
};
export const label = (row: Row) =>
  String(
    row.nombre ??
      row.username ??
      (row.numeroLado != null
        ? 'Lado ' + row.numeroLado
        : row.fecha
          ? 'Partido ' + row.id + ' · ' + row.fecha
          : '#' + row.id),
  );
export async function page<T = Row>(
  path: string,
  pagina = 0,
  tamano = 10,
  signal?: AbortSignal,
) {
  return normalizePage(
    await request<Page<T>>(
      path +
        (path.includes('?') ? '&' : '?') +
        new URLSearchParams({ pagina: String(pagina), tamano: String(tamano) }),
      { signal },
    ),
  );
}
export async function all(path: string, signal?: AbortSignal): Promise<Row[]> {
  const result: Row[] = [];
  let index = 0;
  while (true) {
    const next = await page(path, index, 100, signal);
    result.push(...next.content);
    if (++index >= next.totalPages) return result;
  }
}
export function mutate<T = Row>(path: string, method: string, body?: unknown) {
  return request<T>(path, {
    method,
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
}
export function payload(fields: FieldSpec[], values: Record<string, string>) {
  return Object.fromEntries(
    fields.map((f) => [
      f.key,
      values[f.key] === '' || values[f.key] == null
        ? null
        : f.type === 'number'
          ? Number(values[f.key])
          : values[f.key],
    ]),
  );
}

export function rootFor(admin: boolean) {
  return admin ? '/admin' : '/jugador';
}

/** Spring Boot puede serializar Page como {content,page:{...}}. */
export function normalizePage<T>(data: T): T {
  if (
    data &&
    typeof data === 'object' &&
    'content' in data &&
    'page' in data &&
    data.page &&
    typeof data.page === 'object'
  ) {
    return { ...data, ...data.page };
  }
  return data;
}
