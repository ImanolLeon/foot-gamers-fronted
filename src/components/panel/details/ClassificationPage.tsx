import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { rootFor, type Page, type Row } from '../../../lib/panel';
import { Button, Notice, useRemote } from '../LiveUI';
import { GroupTable } from './GroupTable';

/** Clasificación de los grupos de cada torneo, con paginación. */
export function ClassificationPage() {
  const { session } = useAuth();
  const admin = session?.rol === 'ADMINISTRADOR';
  const root = rootFor(admin);
  const [pagina, setPagina] = useState(0);
  const [selected, setSelected] = useState('');
  const [revision, setRevision] = useState(0);
  const tournaments = useRemote<Page<Row>>(
    (admin ? '/torneos' : '/jugadores/mis-torneos') +
      '?pagina=' +
      pagina +
      '&tamano=20',
    revision,
  );
  const groups = useRemote<Row[]>(
    selected ? '/torneos/' + selected + '/grupos' : null,
    revision,
  );

  return (
    <div className="live-page">
      <section className="live-card">
        <div className="live-heading">
          <h2>Grupos y clasificación</h2>
          <Button onClick={() => setRevision((x) => x + 1)}>Actualizar</Button>
        </div>
        {tournaments.error && <Notice error>{tournaments.error}</Notice>}
        <label className="live-form">
          Torneo
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
          >
            <option value="">Seleccionar torneo…</option>
            {tournaments.data?.content.map((t) => (
              <option key={t.id} value={t.id}>
                {String(t.nombre)}
              </option>
            ))}
          </select>
        </label>
        <div className="live-pager">
          <Button
            disabled={pagina === 0}
            onClick={() => {
              setPagina((x) => x - 1);
              setSelected('');
            }}
          >
            Anterior
          </Button>
          <span>Página {pagina + 1}</span>
          <Button
            disabled={
              !tournaments.data || pagina + 1 >= tournaments.data.totalPages
            }
            onClick={() => {
              setPagina((x) => x + 1);
              setSelected('');
            }}
          >
            Siguiente
          </Button>
        </div>
        {!tournaments.loading && tournaments.data?.totalElements === 0 && (
          <Notice>No hay torneos para consultar todavía.</Notice>
        )}
        {selected && (
          <Link to={root + '/torneos/' + selected}>
            Abrir torneo y calendario →
          </Link>
        )}
      </section>
      {groups.loading ? (
        <Notice>Cargando grupos…</Notice>
      ) : groups.error ? (
        <Notice error>{groups.error}</Notice>
      ) : selected && groups.data?.length === 0 ? (
        <Notice>El torneo todavía no tiene grupos.</Notice>
      ) : (
        groups.data?.map((g) => (
          <section className="live-card" key={g.id}>
            <GroupTable group={g} revision={revision} />
          </section>
        ))
      )}
    </div>
  );
}
