import { useState } from 'react';
import { mutate, type Row } from '../../../lib/panel';
import { Button, Dialog, useMutation } from '../LiveUI';

type ManualGroupsProps = {
  id: string;
  count: number;
  players: Row[];
  onClose: () => void;
  onSaved: () => void;
};

/** Asignación manual de inscritos a grupos con letras (A, B, C…). */
export function ManualGroups({
  id,
  count,
  players,
  onClose,
  onSaved,
}: ManualGroupsProps) {
  const [assignment, setAssignment] = useState<Record<string, string>>({});
  const mutation = useMutation(onSaved);

  return (
    <Dialog title="Asignación manual" onClose={onClose}>
      <p className="live-muted">
        Asigna cada inscrito a uno de los {count} grupos.
      </p>
      <div className="live-form">
        {players.map((p) => (
          <label key={p.id}>
            {String(p.username)}
            <select
              value={assignment[p.id] ?? ''}
              onChange={(e) =>
                setAssignment({ ...assignment, [p.id]: e.target.value })
              }
            >
              <option value="">Seleccionar grupo…</option>
              {Array.from({ length: count }, (_, i) => (
                <option
                  key={i}
                  value={i < 26 ? String.fromCharCode(65 + i) : 'G' + (i - 25)}
                >
                  {'Grupo ' +
                    (i < 26 ? String.fromCharCode(65 + i) : 'G' + (i - 25))}
                </option>
              ))}
            </select>
          </label>
        ))}
        {mutation.feedback}
        <div className="live-actions">
          <Button
            disabled={mutation.busy || players.some((p) => !assignment[p.id])}
            onClick={() =>
              void mutation.run(() =>
                mutate('/torneos/' + id + '/grupos', 'POST', {
                  tipoAsignacion: 'MANUAL',
                  asignaciones: players.map((p) => ({
                    jugadorId: p.id,
                    nombreGrupo: assignment[p.id],
                  })),
                }),
              )
            }
          >
            Guardar asignación
          </Button>
          <Button disabled={mutation.busy} onClick={onClose}>
            Cancelar
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
