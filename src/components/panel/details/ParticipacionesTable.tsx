import type { Row } from '../../../lib/panel';
import { Button, Notice, Table } from '../LiveUI';
import type { Remote } from './types';

type ParticipacionesTableProps = {
  remote: Remote<Row[]>;
  partidoId: number;
  admin: boolean;
  busy: boolean;
  onEdit: (row: Partial<Row>) => void;
  onConfirm: (row: Row) => void;
  onDelete: (row: Row) => void;
};

/** Participantes de un partido y sus acciones (solo administrador). */
export function ParticipacionesTable({
  remote,
  partidoId,
  admin,
  busy,
  onEdit,
  onConfirm,
  onDelete,
}: ParticipacionesTableProps) {
  return (
    <section className="live-card">
      <div className="live-heading">
        <h2>Participantes y bandos</h2>
        {admin && (
          <Button onClick={() => onEdit({ partidoId })}>
            Añadir participación
          </Button>
        )}
      </div>
      {remote.loading ? (
        <Notice>Cargando participantes…</Notice>
      ) : remote.error ? (
        <Notice error>{remote.error}</Notice>
      ) : (
        <Table
          rows={remote.data ?? []}
          columns={[
            ['usernameJugador', 'Jugador'],
            ['equipo', 'Equipo'],
            ['numeroLado', 'Lado'],
            ['bandoId', 'Bando ID'],
            ['estadoConfirmacion', 'Confirmación'],
          ]}
          actions={
            admin
              ? (p) => (
                  <>
                    <Button onClick={() => onEdit(p)}>Editar</Button>
                    <Button
                      disabled={busy || p.estadoConfirmacion === 'CONFIRMADO'}
                      onClick={() => onConfirm(p)}
                    >
                      Confirmar
                    </Button>
                    <Button onClick={() => onDelete(p)}>Quitar</Button>
                  </>
                )
              : undefined
          }
        />
      )}
    </section>
  );
}
