import { Link } from 'react-router-dom';
import { Button, Notice } from '../LiveUI';
import type { RemotePage } from './types';

type AvailableTournamentsProps = {
  remote: RemotePage;
  root: string;
  busy: boolean;
  onEnroll: (torneoId: number) => void;
};

/** Torneos abiertos para el jugador, con inscripción real. */
export function AvailableTournaments({
  remote,
  root,
  busy,
  onEnroll,
}: AvailableTournamentsProps) {
  return (
    <section className="live-card">
      <div className="live-heading">
        <div>
          <p className="dashboard-eyebrow">ÚNETE A LA COMPETICIÓN</p>
          <h2>Torneos abiertos</h2>
        </div>
        <Link to={root + '/torneos'}>Ver todos →</Link>
      </div>
      {remote.loading ? (
        <Notice>Buscando torneos…</Notice>
      ) : remote.error ? (
        <Notice error>{remote.error}</Notice>
      ) : !remote.data?.content.length ? (
        <Notice>
          No hay torneos con inscripciones abiertas en este momento.
        </Notice>
      ) : (
        <div className="live-grid">
          {remote.data.content.map((t) => (
            <article className="dashboard-tournament" key={t.id}>
              <h3>{String(t.nombre)}</h3>
              <p className="live-muted">
                {String(t.nombreCategoria ?? '')} · {String(t.fechaInicio)}
              </p>
              <p>
                <strong>{String(t.cuposDisponibles)}</strong> plazas libres de{' '}
                {String(t.cantidadJugadores)}
              </p>
              <div className="live-actions">
                <Button
                  disabled={
                    busy ||
                    !!t.yaInscrito ||
                    Number(t.cuposDisponibles) < 1
                  }
                  onClick={() => onEnroll(Number(t.id))}
                >
                  {t.yaInscrito ? 'Ya estás inscrito' : 'Inscribirme'}
                </Button>
                <Link to={root + '/torneos/' + t.id}>Detalles</Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
