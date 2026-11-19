import { Link } from 'react-router-dom';
import { Notice, Table } from '../LiveUI';
import type { RemotePage } from './types';

type DashboardMatchesProps = {
  remote: RemotePage;
  admin: boolean;
  root: string;
};

/** Últimos partidos, con acceso al detalle de cada uno. */
export function DashboardMatches({ remote, admin, root }: DashboardMatchesProps) {
  return (
    <section className="live-card">
      <div className="live-heading">
        <div>
          <p className="dashboard-eyebrow">JORNADA</p>
          <h2>
            {admin
              ? 'Últimos partidos registrados'
              : 'Mis últimos partidos'}
          </h2>
        </div>
        <Link to={root + '/partidos'}>Ver todos →</Link>
      </div>
      <p className="live-muted">
        Consulta el calendario completo, los resultados y las confirmaciones
        desde el detalle.
      </p>
      {remote.loading ? (
        <Notice>Cargando partidos…</Notice>
      ) : remote.error ? (
        <Notice error>{remote.error}</Notice>
      ) : (
        <Table
          rows={remote.data?.content ?? []}
          columns={[
            ['fecha', 'Fecha'],
            ['fase', 'Fase'],
            ['resultado', 'Resultado'],
            ['estado', 'Estado'],
          ]}
          actions={(match) => (
            <Link to={root + '/partidos/' + match.id}>
              Ver partido #{match.id}
            </Link>
          )}
        />
      )}
    </section>
  );
}
