import { useLocation } from 'react-router-dom';
import { Plus } from '../../components/Icons';
import { JUGADOR_NAV } from '../../data/panelNav';
import {
  JUGADOR_CLASIFICACION,
  JUGADOR_MIS_TORNEOS,
  JUGADOR_PARTIDOS,
  JUGADOR_TORNEOS_ABIERTOS,
  JUGADOR_TROFEOS,
} from '../../data/jugador';

/** Tabla de relleno para que se vea el flujo antes de conectar la API. */
function TablaRelleno({
  titulo,
  columnas,
  filas,
}: {
  titulo: string;
  columnas: string[];
  filas: (string | number)[][];
}) {
  return (
    <section className="panel-surface-flat overflow-hidden">
      <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5">
        <div>
          <h2 className="font-display text-lg font-bold">{titulo}</h2>
          <p className="text-xs text-ink-3">Datos de relleno · se conectará al backend</p>
        </div>
        <button type="button" className="panel-btn btn-sm" aria-label="Acción pendiente">
          <Plus className="size-4" />
          Acción
        </button>
      </header>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[620px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-line text-left text-[11px] tracking-[0.14em] text-ink-3 uppercase">
              {columnas.map((columna) => (
                <th key={columna} scope="col" className="px-6 py-3 font-bold">
                  {columna}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filas.map((fila, indice) => (
              <tr
                key={indice}
                className="border-b border-line-soft transition-colors duration-200 last:border-0 hover:bg-magenta/5"
              >
                {fila.map((celda, i) => (
                  <td
                    key={i}
                    className={`px-6 py-4 ${i === 0 ? 'font-semibold' : 'text-ink-2 tabular-nums'}`}
                  >
                    {celda}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/** Tabla de relleno según la sección del panel de jugador. */
function tablaDeSeccion(pathname: string) {
  switch (pathname) {
    case '/jugador/torneos':
      return {
        titulo: 'Torneos abiertos',
        columnas: ['Torneo', 'Categoría', 'Inicio', 'Cupos', 'Estado'],
        filas: JUGADOR_TORNEOS_ABIERTOS.map((t) => [
          t.nombre,
          t.categoria,
          t.fechaInicio,
          `${t.inscritos}/${t.cantidadJugadores}`,
          t.yaInscrito ? 'Inscrito' : `${t.cuposDisponibles} cupos`,
        ]),
      };
    case '/jugador/partidos':
      return {
        titulo: 'Mis partidos',
        columnas: ['Rival', 'Torneo', 'Fase', 'Fecha', 'Estado'],
        filas: JUGADOR_PARTIDOS.map((p) => [
          p.rival,
          p.torneo,
          p.fase,
          p.fecha,
          p.estado === 'FINALIZADO' ? `Finalizado ${p.resultado ?? ''}`.trim() : 'Programado',
        ]),
      };
    case '/jugador/mis-torneos':
      return {
        titulo: 'Mis torneos',
        columnas: ['Torneo', 'Categoría', 'Fase', 'Estado', 'Jugadores'],
        filas: JUGADOR_MIS_TORNEOS.map((t) => [
          t.nombre,
          t.categoria,
          t.fase,
          t.estado === 'EN_PROCESO' ? 'En proceso' : 'Terminado',
          t.jugadores,
        ]),
      };
    case '/jugador/clasificacion':
      return {
        titulo: 'Clasificación · Grupo A',
        columnas: ['Grupo', 'Jugador', 'PJ', 'G', 'E', 'P', 'Puntos'],
        filas: JUGADOR_CLASIFICACION.map((c) => [
          c.grupo,
          c.yo ? `${c.username} (tú)` : c.username,
          c.jugados,
          c.ganados,
          c.empatados,
          c.perdidos,
          c.puntos,
        ]),
      };
    case '/jugador/trofeos':
      return {
        titulo: 'Mis trofeos',
        columnas: ['Trofeo', 'Torneo', 'Fecha'],
        filas: JUGADOR_TROFEOS.map((t) => [t.nombre, t.torneo, t.fecha]),
      };
    default:
      return null;
  }
}

/**
 * Vista genérica para las secciones del panel de jugador que aún no tienen
 * lógica. Muestra la descripción del módulo y, si aplica, una tabla de relleno.
 */
export function JugadorPlaceholder() {
  const { pathname } = useLocation();
  const seccion = JUGADOR_NAV.find((item) => item.to === pathname);
  const tabla = tablaDeSeccion(pathname);

  return (
    <div className="grid gap-6">
      <section className="panel-surface-flat p-8 text-center">
        <span className="panel-badge mx-auto size-14 rounded-2xl" aria-hidden="true">
          {seccion && <seccion.Icon className="size-6" />}
        </span>
        <h2 className="mt-5 font-display text-xl font-bold">{seccion?.label ?? 'Sección'}</h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-2">{seccion?.descripcion}</p>
        <p className="panel-chip mt-5">Módulo en construcción</p>
      </section>

      {tabla ? (
        <TablaRelleno titulo={tabla.titulo} columnas={tabla.columnas} filas={tabla.filas} />
      ) : null}
    </div>
  );
}
