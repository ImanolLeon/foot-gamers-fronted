import type { Row } from '../../../lib/panel';
import { Button, Notice } from '../LiveUI';
import { GroupTable } from './GroupTable';
import type { Remote } from './types';

type TorneoGroupsProps = {
  groups: Remote<Row[]>;
  admin: boolean;
  revision: number;
  busy: boolean;
  hasInscritos: boolean;
  terminado: boolean;
  onGroupAction: (action: 'grupos' | 'manual') => void;
  onConfirm: (kind: 'partidos/grupos' | 'llaves') => void;
};

/** Grupos del torneo y generación de calendario (solo administrador). */
export function TorneoGroups({
  groups,
  admin,
  revision,
  busy,
  hasInscritos,
  terminado,
  onGroupAction,
  onConfirm,
}: TorneoGroupsProps) {
  const blocked = busy || terminado || !groups.data?.length;

  return (
    <section className="live-card">
      <div className="live-heading">
        <h2>Grupos y clasificación</h2>
        {admin && (
          <div className="live-actions">
            <Button
              disabled={!!groups.data?.length || !hasInscritos}
              onClick={() => onGroupAction('grupos')}
            >
              Distribuir grupos
            </Button>
            <Button
              disabled={!!groups.data?.length || !hasInscritos}
              onClick={() => onGroupAction('manual')}
            >
              Asignación manual
            </Button>
            <Button disabled={blocked} onClick={() => onConfirm('partidos/grupos')}>
              Generar partidos de grupos
            </Button>
            <Button disabled={blocked} onClick={() => onConfirm('llaves')}>
              Generar llaves
            </Button>
          </div>
        )}
      </div>
      {groups.loading ? (
        <Notice>Cargando grupos…</Notice>
      ) : groups.error ? (
        <Notice error>{groups.error}</Notice>
      ) : groups.data?.length ? (
        <div className="live-page">
          {groups.data.map((g) => (
            <GroupTable key={g.id} group={g} revision={revision} />
          ))}
        </div>
      ) : (
        <p className="live-muted">Todavía no se han asignado grupos.</p>
      )}
    </section>
  );
}
