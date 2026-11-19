import { Link } from 'react-router-dom';
import { Notice } from '../LiveUI';
import type { RemotePage } from './types';

type DashboardTournamentsProps = {
  remote: RemotePage;
  admin: boolean;
  root: string;
};

/** agenda de torneos (admin) o torneos recientes del jugador. */
export function DashboardTournaments({
  remote,
  admin,
  root,
}: DashboardTournamentsProps) {
  return (
    <section className="live-card">
      <div className="live-heading">
        <div>
          <p className="dashboard-eyebrow">COMPETICIONES</p>
          <h2>{admin ? 'Agenda de torneos' : 'Mis torneos recientes'}</h2>
        </div>
        <Link to={root + (admin ? '/torneos' : '/mis-torneos')}>
          Ver todos →
        </Link>
      </div>
      {remote.loading ? (
        <Notice>Cargando torneos…</Notice>
      ) : remote.error ? (
        <Notice error>{remote.error}</Notice>
      ) : !remote.data?.content.length ? (
        <div className="dashboard-empty">
          <h3>
            {admin
              ? 'Tu próxima competición empieza aquí'
              : 'Todavía no te has inscrito'}
          </h3>
          <p>
            {admin
              ? 'Crea una categoría y un trofeo, y después abre tu torneo para que los jugadores se inscriban.'
              : 'Consulta los torneos abiertos y elige uno con plazas disponibles.'}
          </p>
          <Link to={root + (admin ? '/categorias' : '/torneos')}>
            {admin ? 'Gestionar categorías' : 'Buscar torneo'} →
          </Link>
        </div>
      ) : (
        <div className="dashboard-tournaments">
          {remote.data.content.map((t) => (
            <article className="dashboard-tournament" key={t.id}>
              <div className="live-heading">
                <span className="dashboard-badge">
                  {String(t.estado ?? 'Sin estado').replaceAll('_', ' ')}
                </span>
                <span className="live-muted">
                  {String(t.nombreCategoria ?? 'Sin categoría')}
                </span>
              </div>
              <h3>{String(t.nombre)}</h3>
              <p className="live-muted">
                {String(t.fechaInicio ?? 'Sin fecha')} ·{' '}
                {String(t.cantidadJugadores)} plazas
              </p>
              <div className="live-actions">
                <Link to={root + '/torneos/' + t.id}>
                  {admin ? 'Gestionar torneo' : 'Ver mi torneo'} →
                </Link>
                {t.usernameGanador && (
                  <span className="live-muted">
                    Campeón: {String(t.usernameGanador)}
                  </span>
                )}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
