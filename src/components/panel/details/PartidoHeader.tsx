import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { resources, type Row } from '../../../lib/panel';
import { Button } from '../LiveUI';
import { Info } from './Info';

type PartidoAction = 'editar' | 'resultado' | 'ganador';

type PartidoHeaderProps = {
  id: string | undefined;
  partido: Row;
  admin: boolean;
  root: string;
  participants?: Row[];
  feedback: ReactNode;
  onRefresh: () => void;
  onAction: (action: PartidoAction) => void;
};

/** Cabecera del partido con resultado, torneo y acciones de administrador. */
export function PartidoHeader({
  id,
  partido,
  admin,
  root,
  participants,
  feedback,
  onRefresh,
  onAction,
}: PartidoHeaderProps) {
  return (
    <section className="live-card">
      <div className="live-heading">
        <h2>Partido #{id}</h2>
        <Button onClick={onRefresh}>Actualizar</Button>
      </div>
      <Info row={partido} columns={resources.partidos.columns} />
      {partido.torneoId && (
        <Link to={root + '/torneos/' + partido.torneoId}>Ver torneo →</Link>
      )}
      <p className="live-muted">
        El marcador se interpreta como goles del lado 1 - goles del lado 2.
      </p>
      {feedback}
      {admin && (
        <div className="live-actions">
          <Button onClick={() => onAction('editar')}>
            Editar fecha y tipo
          </Button>
          <Button
            disabled={partido.estado === 'FINALIZADO' && !!partido.resultado}
            onClick={() => onAction('resultado')}
          >
            Registrar resultado
          </Button>
          <Button
            disabled={
              partido.estado !== 'FINALIZADO' ||
              !participants?.length ||
              participants.some(
                (p) => p.estadoConfirmacion !== 'CONFIRMADO',
              )
            }
            onClick={() => onAction('ganador')}
          >
            Asignar ganador
          </Button>
        </div>
      )}
    </section>
  );
}
