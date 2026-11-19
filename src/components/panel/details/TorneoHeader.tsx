import type { ReactNode } from 'react';
import type { Row } from '../../../lib/panel';
import { Button } from '../LiveUI';
import { Info } from './Info';

type TorneoHeaderProps = {
  torneo: Row;
  admin: boolean;
  inscritos?: Row[];
  already: boolean;
  busy: boolean;
  feedback: ReactNode;
  onRefresh: () => void;
  onEnroll: () => void;
  onAction: (action: 'editar' | 'inscribir' | 'estado' | 'ganador') => void;
};

/** Cabecera del torneo: datos, inscripción y acciones de administrador. */
export function TorneoHeader({
  torneo,
  admin,
  inscritos,
  already,
  busy,
  feedback,
  onRefresh,
  onEnroll,
  onAction,
}: TorneoHeaderProps) {
  return (
    <section className="live-card">
      <div className="live-heading">
        <h2>{String(torneo.nombre)}</h2>
        <Button onClick={onRefresh}>Actualizar</Button>
      </div>
      <Info
        row={torneo}
        columns={[
          ['nombreCategoria', 'Categoría'],
          ['fechaInicio', 'Inicio'],
          ['fechaFin', 'Fin'],
          ['estado', 'Estado'],
          ['faseActual', 'Fase'],
          ['usernameGanador', 'Ganador'],
          ['cantidadJugadores', 'Cupos'],
          ['cantidadGrupos', 'Grupos'],
        ]}
      />
      {feedback}
      <div className="live-actions">
        <Button
          disabled={
            busy ||
            !inscritos ||
            already ||
            torneo.estado === 'TERMINADO' ||
            (inscritos?.length ?? 0) >= Number(torneo.cantidadJugadores)
          }
          onClick={onEnroll}
        >
          {already ? 'Ya estás inscrito' : 'Inscribirme'}
        </Button>
        {admin && (
          <>
            <Button onClick={() => onAction('editar')}>Editar torneo</Button>
            <Button onClick={() => onAction('inscribir')}>
              Inscribir jugador
            </Button>
            <Button onClick={() => onAction('estado')}>Cambiar estado</Button>
            <Button
              disabled={!inscritos?.length}
              onClick={() => onAction('ganador')}
            >
              Asignar campeón
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
