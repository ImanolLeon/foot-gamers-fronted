import { Link } from 'react-router-dom';
import { Dots, Plus, TrendUp } from '../../components/Icons';
import {
  ADMIN_ACTIVIDAD,
  ADMIN_GRAFICO,
  ADMIN_STATS,
  ADMIN_TORNEOS,
  type AdminTorneo,
} from '../../data/admin';

/* ============================================================
   ESTADO DE TORNEO → BADGE
   ============================================================ */

function EstadoBadge({ estado }: { estado: AdminTorneo['estado'] }) {
  const enProceso = estado === 'EN_PROCESO';
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase ${
        enProceso ? 'bg-magenta/10 text-magenta' : 'bg-ink/5 text-ink-3'
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${enProceso ? 'bg-magenta' : 'bg-ink-3'}`}
        aria-hidden="true"
      />
      {enProceso ? 'En proceso' : 'Terminado'}
    </span>
  );
}

/* ============================================================
   DASHBOARD
   ============================================================ */

export function AdminDashboard() {
  return (
    <div className="grid gap-6">
      {/* ---------- Métricas ---------- */}
      <section aria-labelledby="metricas">
        <h2 id="metricas" className="sr-only">
          Métricas generales
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {ADMIN_STATS.map((stat) => (
            <article
              key={stat.label}
              className="panel-surface p-5 hover:-translate-y-0.5"
            >
              <div className="flex items-start justify-between gap-3">
                <span className="panel-badge size-11 rounded-xl" aria-hidden="true">
                  <stat.Icon className="size-5" />
                </span>
                <span className="panel-chip">
                  <TrendUp className="size-3" />
                  {stat.delta}
                </span>
              </div>

              <p className="mt-5 font-display text-[32px] leading-none font-black">{stat.valor}</p>
              <p className="mt-1.5 text-sm text-ink-2">{stat.label}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Gráfico + actividad ---------- */}
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* Gráfico de barras decorativo */}
        <section aria-labelledby="grafico" className="panel-surface-flat p-6">
          <header className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="grafico" className="font-display text-lg font-bold">
                Partidos por mes
              </h2>
              <p className="text-xs text-ink-3">Datos de relleno · últimos 7 meses</p>
            </div>
            <span className="panel-chip">Total 1.284</span>
          </header>

          <div className="flex h-[180px] items-end gap-2.5 sm:gap-4">
            {ADMIN_GRAFICO.map((barra) => (
              <div key={barra.mes} className="group flex flex-1 flex-col items-center gap-2">
                <div className="relative flex w-full flex-1 items-end">
                  <div
                    className="w-full rounded-t-md bg-gradient-to-t from-magenta/25 to-magenta/60 transition duration-300 ease-out group-hover:from-magenta/40 group-hover:to-magenta"
                    style={{ height: `${barra.valor}%` }}
                  />
                  <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 rounded bg-ink px-1.5 py-0.5 text-[10px] font-bold text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {barra.valor}
                  </span>
                </div>
                <span className="text-[11px] font-semibold text-ink-3">{barra.mes}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Actividad reciente */}
        <section aria-labelledby="actividad" className="panel-surface-flat p-6">
          <h2 id="actividad" className="font-display text-lg font-bold">
            Actividad reciente
          </h2>
          <p className="mb-6 text-xs text-ink-3">Datos de relleno</p>

          <ul className="grid gap-4">
            {ADMIN_ACTIVIDAD.map((item) => (
              <li key={item.id} className="flex gap-3">
                <span className="panel-badge size-9 flex-none rounded-lg" aria-hidden="true">
                  <item.Icon className="size-4" />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm">
                    <strong className="font-bold">{item.actor}</strong>{' '}
                    <span className="text-ink-2">{item.accion}</span>{' '}
                    <span className="font-semibold">{item.detalle}</span>
                  </span>
                  <span className="block text-xs text-ink-3">{item.hace}</span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ---------- Tabla de torneos ---------- */}
      <section
        aria-labelledby="tabla-torneos"
        className="panel-surface-flat overflow-hidden"
      >
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5">
          <div>
            <h2 id="tabla-torneos" className="font-display text-lg font-bold">
              Torneos recientes
            </h2>
            <p className="text-xs text-ink-3">Datos de relleno</p>
          </div>

          <div className="flex gap-2.5">
            <button
              type="button"
              className="panel-btn btn-sm opacity-70"
              aria-label="Nuevo torneo (función pendiente)"
            >
              <Plus className="size-4" />
              Nuevo torneo
            </button>
            <Link to="/admin/torneos" className="panel-btn btn-sm">
              Ver todos
            </Link>
          </div>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <caption className="sr-only">Listado de torneos recientes</caption>
            <thead>
              <tr className="border-b border-line text-left text-[11px] tracking-[0.14em] text-ink-3 uppercase">
                <th scope="col" className="px-6 py-3 font-bold">
                  Torneo
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Categoría
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Fase
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Estado
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Equipos
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Fecha
                </th>
                <th scope="col" className="px-6 py-3 text-right font-bold">
                  <span className="sr-only">Acciones</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {ADMIN_TORNEOS.map((torneo) => (
                <tr
                  key={torneo.id}
                  className="border-b border-line-soft transition-colors duration-200 last:border-0 hover:bg-magenta/5"
                >
                  <th scope="row" className="px-6 py-4 text-left font-semibold">
                    {torneo.nombre}
                  </th>
                  <td className="px-4 py-4 text-ink-2">{torneo.categoria}</td>
                  <td className="px-4 py-4 text-ink-2">{torneo.fase}</td>
                  <td className="px-4 py-4">
                    <EstadoBadge estado={torneo.estado} />
                  </td>
                  <td className="px-4 py-4 text-ink-2">{torneo.equipos}</td>
                  <td className="px-4 py-4 text-ink-2 tabular-nums">{torneo.fecha}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      aria-label={`Acciones para ${torneo.nombre} (función pendiente)`}
                      className="grid size-8 place-items-center rounded-lg text-ink-3 transition duration-300 ease-out hover:bg-magenta/10 hover:text-magenta"
                    >
                      <Dots className="size-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}