import type { Row } from '../../../lib/panel';
import { Notice, Table } from '../LiveUI';
import type { Remote } from './types';

/** Listado de jugadores inscritos en el torneo. */
export function TorneoInscritos({ remote }: { remote: Remote<Row[]> }) {
  return (
    <section className="live-card">
      <h2>
        Inscritos {remote.data ? '(' + remote.data.length + ')' : ''}
      </h2>
      {remote.loading ? (
        <Notice>Cargando inscritos…</Notice>
      ) : remote.error ? (
        <Notice error>{remote.error}</Notice>
      ) : (
        <Table
          rows={remote.data ?? []}
          columns={[
            ['id', 'ID'],
            ['username', 'Jugador'],
            ['equipoFavorito', 'Equipo'],
          ]}
        />
      )}
    </section>
  );
}
