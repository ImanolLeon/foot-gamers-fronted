import { Link } from 'react-router-dom';
import { resources, type Row } from '../../../lib/panel';
import { Button, Notice, Table } from '../LiveUI';
import type { Remote } from './types';

type TorneoMatchesProps = {
  all: Remote<Row[]>;
  round: Remote<Row[]>;
  roundOnly: boolean;
  root: string;
  onToggle: () => void;
};

/** Partidos del torneo, con la opción de ver solo la próxima ronda. */
export function TorneoMatches({
  all,
  round,
  roundOnly,
  root,
  onToggle,
}: TorneoMatchesProps) {
  const remote = roundOnly ? round : all;

  return (
    <section className="live-card">
      <div className="live-heading">
        <h2>Partidos del torneo</h2>
        <Button onClick={onToggle}>
          {roundOnly ? 'Mostrar todos' : 'Próxima ronda'}
        </Button>
      </div>
      {remote.loading ? (
        <Notice>Cargando partidos…</Notice>
      ) : remote.error ? (
        <Notice error>{remote.error}</Notice>
      ) : (
        <Table
          rows={remote.data ?? []}
          columns={resources.partidos.columns}
          actions={(p) => (
            <Link className="live-button" to={root + '/partidos/' + p.id}>
              Ver partido
            </Link>
          )}
        />
      )}
    </section>
  );
}
