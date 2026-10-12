import { useLocation } from 'react-router-dom';
import { Plus } from '../../components/Icons';
import { ADMIN_NAV } from '../../data/panelNav';
import { ADMIN_JUGADORES_RELLENO, ADMIN_PARTICIPANTES_RELLENO } from '../../data/admin';

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
          Crear
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

/**
 * Vista genérica para las secciones del panel que aún no tienen lógica.
 * Muestra la descripción del módulo y, si aplica, una tabla de relleno.
 */
export function AdminPlaceholder() {
  const { pathname } = useLocation();
  const seccion = ADMIN_NAV.find((item) => item.to === pathname);

  const esJugadores = pathname === '/admin/jugadores';

  return (
    <div className="grid gap-6">
      <section className="panel-surface-flat p-8 text-center">
        <span className="panel-badge mx-auto size-14 rounded-2xl" aria-hidden="true">
          {seccion && <seccion.Icon className="size-6" />}
        </span>
        <h2 className="mt-5 font-display text-xl font-bold">
          {seccion?.label ?? 'Sección'}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-sm text-ink-2">
          {seccion?.descripcion}
        </p>
        <p className="panel-chip mt-5">Módulo en construcción</p>
      </section>

      {esJugadores ? (
        <TablaRelleno
          titulo="Jugadores"
          columnas={['Usuario', 'Email', 'Equipo favorito', 'Trofeos']}
          filas={ADMIN_JUGADORES_RELLENO.map((j) => [
            j.username,
            j.email,
            j.equipo,
            j.trofeos,
          ])}
        />
      ) : (
        <TablaRelleno
          titulo="Participaciones"
          columnas={['Jugador', 'Torneo', 'Partidos', 'Elo']}
          filas={ADMIN_PARTICIPANTES_RELLENO.map((p) => [
            p.jugador,
            p.torneo,
            p.participaciones,
            p.elo,
          ])}
        />
      )}
    </div>
  );
}