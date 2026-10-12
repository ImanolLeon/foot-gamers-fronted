import { Link } from 'react-router-dom';
import { Bolt, CheckCircle, Plus, TrendUp } from '../../components/Icons';
import { useAuth } from '../../hooks/useAuth';
import {
  JUGADOR_GRAFICO,
  JUGADOR_PARTIDOS,
  JUGADOR_STATS,
  JUGADOR_TORNEOS_ABIERTOS,
  type JugadorPartido,
} from '../../data/jugador';

/* ============================================================
   ESTADO DE PARTIDO → BADGE
   ============================================================ */

function EstadoPartidoBadge({ partido }: { partido: JugadorPartido }) {
  const programado = partido.estado === 'PROGRAMADO';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase ${
        programado ? 'bg-magenta/10 text-magenta' : 'bg-ink/5 text-ink-3'
      }`}
    >
      <span
        className={`size-1.5 rounded-full ${programado ? 'bg-magenta' : 'bg-ink-3'}`}
        aria-hidden="true"
      />
      {programado ? 'Programado' : 'Finalizado'}
    </span>
  );
}

/* ============================================================
   DASHBOARD DEL JUGADOR
   ============================================================ */

export function JugadorDashboard() {
  const { session } = useAuth();

  return (
    <div className="grid gap-6">
      {/* ---------- Bienvenida ---------- */}
      <section className="panel-surface overflow-hidden p-6">
        <div className="flex flex-wrap items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <span className="panel-badge size-14 flex-none rounded-2xl" aria-hidden="true">
              <Bolt className="size-7" />
            </span>
            <div>
              <h2 className="font-display text-xl font-extrabold">
                Hola, {session?.username}
              </h2>
              <p className="text-sm text-ink-2">
                Vas <strong className="font-bold text-magenta">2.º</strong> en la Liga
                Sabanalera con 20 puntos.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <span className="panel-chip">Rol: Jugador</span>
            <span className="panel-chip">Equipo favorito: San Lorenzo</span>
          </div>
        </div>
      </section>

      {/* ---------- Métricas personales ---------- */}
      <section aria-labelledby="metricas">
        <h2 id="metricas" className="sr-only">
          Tus métricas
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {JUGADOR_STATS.map((stat) => (
            <article key={stat.label} className="panel-surface p-5 hover:-translate-y-0.5">
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

      {/* ---------- Rendimiento + próximos partidos ---------- */}
      <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        {/* Gráfico de barras decorativo */}
        <section aria-labelledby="rendimiento" className="panel-surface-flat p-6">
          <header className="mb-7 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 id="rendimiento" className="font-display text-lg font-bold">
                Mis victorias por mes
              </h2>
              <p className="text-xs text-ink-3">Datos de relleno · últimos 7 meses</p>
            </div>
            <span className="panel-chip">23 victorias</span>
          </header>

          <div className="flex h-[180px] items-end gap-2.5 sm:gap-4">
            {JUGADOR_GRAFICO.map((barra) => (
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

        {/* Próximos partidos */}
        <section aria-labelledby="partidos" className="panel-surface-flat p-6">
          <div className="flex items-center justify-between gap-3">
            <h2 id="partidos" className="font-display text-lg font-bold">
              Próximos partidos
            </h2>
            <Link
              to="/jugador/partidos"
              className="text-xs font-bold text-magenta transition hover:text-magenta/70"
            >
              Ver todos
            </Link>
          </div>
          <p className="mb-5 text-xs text-ink-3">Datos de relleno</p>

          <ul className="grid gap-4">
            {JUGADOR_PARTIDOS.map((partido) => (
              <li key={partido.id} className="flex items-start gap-3">
                <span className="panel-badge size-9 flex-none rounded-lg" aria-hidden="true">
                  <span className="text-[11px] font-black">{partido.fase.charAt(0)}</span>
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-bold">
                    vs {partido.rival}
                  </span>
                  <span className="block truncate text-xs text-ink-3">
                    {partido.torneo} · {partido.fase}
                  </span>
                </span>
                <span className="flex-none text-right">
                  <EstadoPartidoBadge partido={partido} />
                  <span className="mt-1 block text-[11px] text-ink-3 tabular-nums">
                    {partido.fecha}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* ---------- Torneos abiertos ---------- */}
      <section aria-labelledby="torneos-abiertos" className="panel-surface-flat overflow-hidden">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-5">
          <div>
            <h2 id="torneos-abiertos" className="font-display text-lg font-bold">
              Torneos abiertos
            </h2>
            <p className="text-xs text-ink-3">Inscripciones disponibles · datos de relleno</p>
          </div>
          <Link to="/jugador/torneos" className="panel-btn btn-sm">
            Ver todos
          </Link>
        </header>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-sm">
            <caption className="sr-only">Torneos con inscripción abierta</caption>
            <thead>
              <tr className="border-b border-line text-left text-[11px] tracking-[0.14em] text-ink-3 uppercase">
                <th scope="col" className="px-6 py-3 font-bold">
                  Torneo
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Categoría
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Inicio
                </th>
                <th scope="col" className="px-4 py-3 font-bold">
                  Cupos
                </th>
                <th scope="col" className="px-6 py-3 text-right font-bold">
                  Acción
                </th>
              </tr>
            </thead>
            <tbody>
              {JUGADOR_TORNEOS_ABIERTOS.map((torneo) => (
                <tr
                  key={torneo.id}
                  className="border-b border-line-soft transition-colors duration-200 last:border-0 hover:bg-magenta/5"
                >
                  <th scope="row" className="px-6 py-4 text-left font-semibold">
                    {torneo.nombre}
                  </th>
                  <td className="px-4 py-4 text-ink-2">{torneo.categoria}</td>
                  <td className="px-4 py-4 text-ink-2 tabular-nums">{torneo.fechaInicio}</td>
                  <td className="px-4 py-4 text-ink-2">
                    {torneo.inscritos}/{torneo.cantidadJugadores}
                  </td>
                  <td className="px-6 py-4 text-right">
                    {torneo.yaInscrito ? (
                      <span className="panel-chip">
                        <CheckCircle className="size-3" />
                        Inscrito
                      </span>
                    ) : (
                      <button
                        type="button"
                        className="panel-btn btn-sm"
                        aria-label={`Inscribirme en ${torneo.nombre} (función pendiente)`}
                      >
                        <Plus className="size-4" />
                        Inscribirme
                      </button>
                    )}
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
