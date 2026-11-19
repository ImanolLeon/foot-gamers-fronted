import { Link } from 'react-router-dom';
import { Button } from '../LiveUI';

type DashboardHeroProps = {
  admin: boolean;
  username?: string;
  root: string;
  onCreate: () => void;
  onRefresh: () => void;
};

/** Cabecera del panel, con actions distintas según el rol. */
export function DashboardHero({
  admin,
  username,
  root,
  onCreate,
  onRefresh,
}: DashboardHeroProps) {
  return (
    <section className="dashboard-hero">
      <div>
        <p className="dashboard-eyebrow">
          {admin ? 'CENTRO DE COMPETICIÓN' : 'TU ZONA DE JUEGO'}
        </p>
        <h2>Hola, {username}</h2>
        <p>
          {admin
            ? 'Organiza la próxima jornada y acompaña cada torneo hasta la final.'
            : 'Encuentra tu próximo torneo y sigue cada partido de tu temporada.'}
        </p>
        <div className="live-actions">
          {admin ? (
            <Button onClick={onCreate}>Crear torneo</Button>
          ) : (
            <Link className="live-button" to={root + '/torneos'}>
              Explorar torneos
            </Link>
          )}
          <Link className="live-button" to={root + '/clasificacion'}>
            Ver clasificación
          </Link>
        </div>
      </div>
      <Button onClick={onRefresh}>Actualizar panel</Button>
    </section>
  );
}
