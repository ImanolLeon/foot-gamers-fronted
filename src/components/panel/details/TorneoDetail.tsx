import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../../hooks/useAuth';
import { mutate, resources, rootFor, type FieldSpec, type Row } from '../../../lib/panel';
import { KnockoutBracket } from '../../bracket/KnockoutBracket';
import { Notice, useMutation, useRemote } from '../LiveUI';
import {
  groupField,
  playerField,
  stateField,
} from './detailFields';
import { GenerateCalendarDialog } from './GenerateCalendarDialog';
import { ManualGroups } from './ManualGroups';
import { TorneoActionDialog } from './TorneoActionDialog';
import { TorneoGroups } from './TorneoGroups';
import { TorneoHeader } from './TorneoHeader';
import { TorneoInscritos } from './TorneoInscritos';
import { TorneoMatches } from './TorneoMatches';

type TorneoAction =
  | 'editar'
  | 'inscribir'
  | 'estado'
  | 'grupos'
  | 'ganador'
  | 'manual';

/** Detalle de un torneo: orquesta datos y compone cada sección. */
export function TorneoDetail() {
  const { id } = useParams();
  const { session, usuario } = useAuth();
  const admin = session?.rol === 'ADMINISTRADOR';
  const root = rootFor(admin);
  const [revision, setRevision] = useState(0);
  const refresh = () => setRevision((x) => x + 1);
  const torneo = useRemote<Row>('/torneos/' + id, revision);
  const inscritos = useRemote<Row[]>(
    '/torneos/' + id + '/participantes',
    revision,
  );
  const groups = useRemote<Row[]>('/torneos/' + id + '/grupos', revision);
  const matches = useRemote<Row[]>('/partidos/torneo/' + id, revision);
  const [action, setAction] = useState<TorneoAction | null>(null);
  const [confirm, setConfirm] = useState<'partidos/grupos' | 'llaves' | null>(
    null,
  );
  const mutation = useMutation(refresh);
  const [roundOnly, setRoundOnly] = useState(false);
  const round = useRemote<Row[]>(
    roundOnly ? '/torneos/' + id + '/proximaRonda' : null,
    revision,
  );
  const already = inscritos.data?.some((p) => p.usuarioId === usuario?.id);
  const winnerFields = useMemo<FieldSpec[]>(
    () => [
      {
        key: 'jugadorId',
        label: 'Jugador ganador',
        options: inscritos.data?.map((p) => String(p.id)) ?? [],
      },
    ],
    [inscritos.data],
  );

  if (torneo.loading && !torneo.data) return <Notice>Cargando torneo…</Notice>;
  if (torneo.error || !torneo.data)
    return <Notice error>{torneo.error ?? 'Torneo no disponible'}</Notice>;

  const t = torneo.data;
  const actionFields: FieldSpec[] =
    action === 'editar'
      ? resources.torneos.fields
      : action === 'inscribir'
        ? playerField
        : action === 'estado'
          ? stateField
          : action === 'ganador'
            ? winnerFields
            : groupField;

  async function perform(body: Record<string, unknown>) {
    if (action === 'editar') await mutate('/torneos/' + id, 'PUT', body);
    if (action === 'inscribir')
      await mutate('/torneos/' + id + '/jugadores/' + body.jugadorId, 'POST');
    if (action === 'estado')
      await mutate('/torneos/' + id + '/estado', 'PUT', body);
    if (action === 'grupos')
      await mutate('/torneos/' + id + '/grupos', 'POST', body);
    if (action === 'ganador')
      await mutate('/torneos/' + id + '/ganador/' + body.jugadorId, 'PUT');
    setAction(null);
    refresh();
  }

  return (
    <div className="live-page">
      <Link to={root + '/torneos'}>← Torneos</Link>
      <TorneoHeader
        torneo={t}
        admin={admin}
        inscritos={inscritos.data}
        already={!!already}
        busy={mutation.busy}
        feedback={mutation.feedback}
        onRefresh={refresh}
        onEnroll={() =>
          void mutation.run(
            () => mutate('/torneos/' + id + '/inscripcion', 'POST'),
            'Te has inscrito al torneo.',
          )
        }
        onAction={setAction}
      />
      <KnockoutBracket
        torneoId={id!}
        revision={revision}
        editable={admin}
        onSaved={refresh}
        root={root}
      />
      <TorneoInscritos remote={inscritos} />
      <TorneoGroups
        groups={groups}
        admin={admin}
        revision={revision}
        busy={mutation.busy}
        hasInscritos={!!inscritos.data?.length}
        terminado={t.estado === 'TERMINADO'}
        onGroupAction={setAction}
        onConfirm={setConfirm}
      />
      <TorneoMatches
        all={matches}
        round={round}
        roundOnly={roundOnly}
        root={root}
        onToggle={() => setRoundOnly(!roundOnly)}
      />
      {action && action !== 'manual' && (
        <TorneoActionDialog
          action={action}
          torneo={t}
          inscritos={inscritos.data ?? []}
          fields={actionFields}
          onSave={perform}
          onClose={() => setAction(null)}
        />
      )}
      {action === 'manual' && (
        <ManualGroups
          id={id!}
          count={Number(t.cantidadGrupos)}
          players={inscritos.data ?? []}
          onClose={() => setAction(null)}
          onSaved={() => {
            setAction(null);
            refresh();
          }}
        />
      )}
      {confirm && (
        <GenerateCalendarDialog
          confirm={confirm}
          busy={mutation.busy}
          feedback={mutation.feedback}
          onConfirm={() =>
            void mutation.run(async () => {
              await mutate('/torneos/' + id + '/' + confirm, 'POST');
              setConfirm(null);
            })
          }
          onCancel={() => setConfirm(null)}
        />
      )}
    </div>
  );
}
