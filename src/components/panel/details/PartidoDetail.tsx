import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import {
  mutate,
  resources,
  rootFor,
  type FieldSpec,
  type Row,
} from '../../../lib/panel';
import { Notice, useMutation, useRemote } from '../LiveUI';
import { scoreFields } from './detailFields';
import { DeleteParticipacionDialog } from './DeleteParticipacionDialog';
import { ParticipacionFormDialog } from './ParticipacionFormDialog';
import { ParticipacionesTable } from './ParticipacionesTable';
import { PartidoActionDialog } from './PartidoActionDialog';
import { PartidoHeader } from './PartidoHeader';

type PartidoAction = 'editar' | 'resultado' | 'ganador';

/** Detalle de un partido: orquesta datos y compone cada sección. */
export function PartidoDetail() {
  const { id } = useParams();
  const { session } = useAuth();
  const admin = session?.rol === 'ADMINISTRADOR';
  const root = rootFor(admin);
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((x) => x + 1);
  const match = useRemote<Row>('/partidos/' + id, revision);
  const participants = useRemote<Row[]>(
    '/partidos/' + id + '/participaciones',
    revision,
  );
  const [editing, setEditing] = useState<Row | Partial<Row> | null>(null);
  const [action, setAction] = useState<PartidoAction | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const mutation = useMutation(refresh);
  const winnerFields = useMemo<FieldSpec[]>(
    () => [
      {
        key: 'bandoId',
        label: 'Bando ganador (ver lados de la tabla)',
        options: [
          ...new Set(participants.data?.map((p) => String(p.bandoId)) ?? []),
        ],
      },
    ],
    [participants.data],
  );

  if (match.loading) return <Notice>Cargando partido…</Notice>;
  if (match.error || !match.data)
    return <Notice error>{match.error ?? 'Partido no disponible'}</Notice>;

  const m = match.data;
  const actionFields: FieldSpec[] =
    action === 'resultado'
      ? scoreFields
      : action === 'ganador'
        ? winnerFields
        : resources.partidos.fields;

  async function saveAction(body: Record<string, unknown>) {
    if (action === 'editar') await mutate('/partidos/' + id, 'PUT', body);
    if (action === 'resultado')
      await mutate(
        '/partidos/' +
          id +
          '/confirmar?resultado=' +
          encodeURIComponent(body.uno + '-' + body.dos),
        'PUT',
      );
    if (action === 'ganador')
      await mutate('/partidos/' + id + '/ganador/' + body.bandoId, 'PUT');
    setAction(null);
    refresh();
  }

  return (
    <div className="live-page">
      <Link to={root + (admin ? '/partidos' : '/partidos')}>← Partidos</Link>
      <PartidoHeader
        id={id}
        partido={m}
        admin={admin}
        root={root}
        participants={participants.data}
        feedback={mutation.feedback}
        onRefresh={refresh}
        onAction={setAction}
      />
      <ParticipacionesTable
        remote={participants}
        partidoId={Number(id)}
        admin={admin}
        busy={mutation.busy}
        onEdit={setEditing}
        onConfirm={(p) =>
          void mutation.run(() =>
            mutate('/participaciones/' + p.id + '/confirmar', 'PUT'),
          )
        }
        onDelete={setDeleting}
      />
      {action && (
        <PartidoActionDialog
          action={action}
          partido={m}
          fields={actionFields}
          onSave={saveAction}
          onClose={() => setAction(null)}
        />
      )}
      {editing && (
        <ParticipacionFormDialog
          editing={editing}
          partidoId={Number(id)}
          onClose={() => setEditing(null)}
          onSaved={refresh}
        />
      )}
      {deleting && (
        <DeleteParticipacionDialog
          row={deleting}
          busy={mutation.busy}
          feedback={mutation.feedback}
          onConfirm={() =>
            void mutation.run(async () => {
              await mutate('/participaciones/' + deleting.id, 'DELETE');
              setDeleting(null);
            })
          }
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  );
}
