import { KnockoutBracket } from '../../components/bracket/KnockoutBracket';
import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  resources,
  mutate,
  type Row,
  type Page,
  type FieldSpec,
} from '../../lib/panel';

import {
  useRemote,
  useMutation,
  Button,
  Dialog,
  Form,
  Notice,
  Table,
} from '../../components/panel/LiveUI';
import { ResourcePage } from './PanelPages';
import { rootFor } from '../../lib/panel';
import './panel.css';

const playerField: FieldSpec[] = [
  { key: 'jugadorId', label: 'Jugador', source: '/jugadores', type: 'number' },
];
const stateField: FieldSpec[] = [
  { key: 'estado', label: 'Estado', options: ['EN_PROCESO', 'TERMINADO'] },
];
const groupField: FieldSpec[] = [
  {
    key: 'tipoAsignacion',
    label: 'Distribución',
    options: ['ALEATORIO', 'EQUILIBRADO'],
  },
];
const scoreFields: FieldSpec[] = [
  { key: 'uno', label: 'Goles del lado 1', type: 'number', min: 0 },
  { key: 'dos', label: 'Goles del lado 2', type: 'number', min: 0 },
];
const groupColumns: [string, string][] = [
  ['username', 'Jugador'],
  ['partidosJugados', 'PJ'],
  ['ganados', 'G'],
  ['empatados', 'E'],
  ['perdidos', 'P'],
  ['golesAFavor', 'GF'],
  ['golesEnContra', 'GC'],
  ['puntos', 'Puntos'],
];
function Info({ row, columns }: { row: Row; columns: [string, string][] }) {
  return (
    <dl className="live-detail">
      {columns.map(([key, title]) => (
        <div key={key}>
          <dt>{title}</dt>
          <dd>{String(row[key] ?? '—').replaceAll('_', ' ')}</dd>
        </div>
      ))}
    </dl>
  );
}
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
  const [action, setAction] = useState<string | null>(null);
  const [confirm, setConfirm] = useState<string | null>(null);
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
      <section className="live-card">
        <div className="live-heading">
          <h2>{String(t.nombre)}</h2>
          <Button onClick={refresh}>Actualizar</Button>
        </div>
        <Info
          row={t}
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
        {mutation.feedback}
        <div className="live-actions">
          <Button
            disabled={
              mutation.busy ||
              !inscritos.data ||
              already ||
              t.estado === 'TERMINADO' ||
              (inscritos.data?.length ?? 0) >= Number(t.cantidadJugadores)
            }
            onClick={() =>
              void mutation.run(
                () => mutate('/torneos/' + id + '/inscripcion', 'POST'),
                'Te has inscrito al torneo.',
              )
            }
          >
            {already ? 'Ya estás inscrito' : 'Inscribirme'}
          </Button>
          {admin && (
            <>
              <Button onClick={() => setAction('editar')}>Editar torneo</Button>
              <Button onClick={() => setAction('inscribir')}>
                Inscribir jugador
              </Button>
              <Button onClick={() => setAction('estado')}>
                Cambiar estado
              </Button>
              <Button
                disabled={!inscritos.data?.length}
                onClick={() => setAction('ganador')}
              >
                Asignar campeón
              </Button>
            </>
          )}
        </div>
      </section>
      <KnockoutBracket
        torneoId={id!}
        revision={revision}
        editable={admin}
        onSaved={refresh}
        root={root}
      />
      <section className="live-card">
        <h2>
          Inscritos {inscritos.data ? '(' + inscritos.data.length + ')' : ''}
        </h2>
        {inscritos.loading ? (
          <Notice>Cargando inscritos…</Notice>
        ) : inscritos.error ? (
          <Notice error>{inscritos.error}</Notice>
        ) : (
          <Table
            rows={inscritos.data ?? []}
            columns={[
              ['id', 'ID'],
              ['username', 'Jugador'],
              ['equipoFavorito', 'Equipo'],
            ]}
          />
        )}
      </section>
      <section className="live-card">
        <div className="live-heading">
          <h2>Grupos y clasificación</h2>
          {admin && (
            <div className="live-actions">
              <Button
                disabled={!!groups.data?.length || !inscritos.data?.length}
                onClick={() => setAction('grupos')}
              >
                Distribuir grupos
              </Button>
              <Button
                disabled={!!groups.data?.length || !inscritos.data?.length}
                onClick={() => setAction('manual')}
              >
                Asignación manual
              </Button>
              <Button
                disabled={
                  mutation.busy ||
                  t.estado === 'TERMINADO' ||
                  !groups.data?.length
                }
                onClick={() => setConfirm('partidos/grupos')}
              >
                Generar partidos de grupos
              </Button>
              <Button
                disabled={
                  mutation.busy ||
                  t.estado === 'TERMINADO' ||
                  !groups.data?.length
                }
                onClick={() => setConfirm('llaves')}
              >
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
      <section className="live-card">
        <div className="live-heading">
          <h2>Partidos del torneo</h2>
          <Button onClick={() => setRoundOnly(!roundOnly)}>
            {roundOnly ? 'Mostrar todos' : 'Próxima ronda'}
          </Button>
        </div>
        {(roundOnly ? round : matches).loading ? (
          <Notice>Cargando partidos…</Notice>
        ) : (roundOnly ? round : matches).error ? (
          <Notice error>{(roundOnly ? round : matches).error}</Notice>
        ) : (
          <Table
            rows={(roundOnly ? round : matches).data ?? []}
            columns={resources.partidos.columns}
            actions={(p) => (
              <Link className="live-button" to={root + '/partidos/' + p.id}>
                Ver partido
              </Link>
            )}
          />
        )}
      </section>
      {action && action !== 'manual' && (
        <Dialog
          title={
            {
              editar: 'Editar torneo',
              inscribir: 'Inscribir jugador',
              estado: 'Cambiar estado',
              grupos: 'Distribuir grupos',
              ganador: 'Asignar campeón',
            }[action] ?? ''
          }
          onClose={() => setAction(null)}
        >
          {action === 'ganador' && (
            <Table
              rows={inscritos.data ?? []}
              columns={[
                ['id', 'ID'],
                ['username', 'Jugador'],
              ]}
            />
          )}
          <Form
            key={action}
            fields={
              action === 'editar'
                ? resources.torneos.fields
                : action === 'inscribir'
                  ? playerField
                  : action === 'estado'
                    ? stateField
                    : action === 'ganador'
                      ? winnerFields
                      : groupField
            }
            initial={action === 'editar' || action === 'estado' ? t : {}}
            onSave={perform}
            onCancel={() => setAction(null)}
          />
        </Dialog>
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
        <Dialog
          title="Generar calendario"
          onClose={() => !mutation.busy && setConfirm(null)}
        >
          <p>
            Se crearán los{' '}
            {confirm === 'llaves'
              ? 'partidos de eliminación directa'
              : 'partidos de grupos'}{' '}
            de este torneo. Comprueba que la fase previa esté completa.
          </p>
          {mutation.feedback}
          <div className="live-actions">
            <Button
              disabled={mutation.busy}
              onClick={() =>
                void mutation.run(async () => {
                  await mutate('/torneos/' + id + '/' + confirm, 'POST');
                  setConfirm(null);
                })
              }
            >
              Confirmar generación
            </Button>
            <Button disabled={mutation.busy} onClick={() => setConfirm(null)}>
              Cancelar
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  );
}
function GroupTable({ group, revision }: { group: Row; revision: number }) {
  const result = useRemote<Row[]>(
    '/grupos/' + group.id + '/clasificacion',
    revision,
  );
  return (
    <div>
      <h3 className="font-bold">{String(group.nombre)}</h3>
      {result.loading ? (
        <Notice>Cargando clasificación…</Notice>
      ) : result.error ? (
        <Notice error>{result.error}</Notice>
      ) : (
        <Table rows={result.data ?? []} columns={groupColumns} />
      )}
    </div>
  );
}
function ManualGroups({
  id,
  count,
  players,
  onClose,
  onSaved,
}: {
  id: string;
  count: number;
  players: Row[];
  onClose: () => void;
  onSaved: () => void;
}) {
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
  const [action, setAction] = useState<string | null>(null);
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
      <section className="live-card">
        <div className="live-heading">
          <h2>Partido #{id}</h2>
          <Button onClick={refresh}>Actualizar</Button>
        </div>
        <Info row={m} columns={resources.partidos.columns} />
        {m.torneoId && (
          <Link to={root + '/torneos/' + m.torneoId}>Ver torneo →</Link>
        )}
        <p className="live-muted">
          El marcador se interpreta como goles del lado 1 - goles del lado 2.
        </p>
        {mutation.feedback}
        {admin && (
          <div className="live-actions">
            <Button onClick={() => setAction('editar')}>
              Editar fecha y tipo
            </Button>
            <Button
              disabled={m.estado === 'FINALIZADO' && !!m.resultado}
              onClick={() => setAction('resultado')}
            >
              Registrar resultado
            </Button>
            <Button
              disabled={
                m.estado !== 'FINALIZADO' ||
                !participants.data?.length ||
                participants.data.some(
                  (p) => p.estadoConfirmacion !== 'CONFIRMADO',
                )
              }
              onClick={() => setAction('ganador')}
            >
              Asignar ganador
            </Button>
          </div>
        )}
      </section>
      <section className="live-card">
        <div className="live-heading">
          <h2>Participantes y bandos</h2>
          {admin && (
            <Button onClick={() => setEditing({ partidoId: Number(id) })}>
              Añadir participación
            </Button>
          )}
        </div>
        {participants.loading ? (
          <Notice>Cargando participantes…</Notice>
        ) : participants.error ? (
          <Notice error>{participants.error}</Notice>
        ) : (
          <Table
            rows={participants.data ?? []}
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
                      <Button onClick={() => setEditing(p)}>Editar</Button>
                      <Button
                        disabled={
                          mutation.busy || p.estadoConfirmacion === 'CONFIRMADO'
                        }
                        onClick={() =>
                          void mutation.run(() =>
                            mutate(
                              '/participaciones/' + p.id + '/confirmar',
                              'PUT',
                            ),
                          )
                        }
                      >
                        Confirmar
                      </Button>
                      <Button onClick={() => setDeleting(p)}>Quitar</Button>
                    </>
                  )
                : undefined
            }
          />
        )}
      </section>
      {action && (
        <Dialog
          title={
            action === 'resultado'
              ? 'Registrar resultado'
              : action === 'ganador'
                ? 'Asignar bando ganador'
                : 'Editar partido'
          }
          onClose={() => setAction(null)}
        >
          <Form
            key={action}
            fields={
              action === 'resultado'
                ? scoreFields
                : action === 'ganador'
                  ? winnerFields
                  : resources.partidos.fields
            }
            initial={action === 'editar' ? m : {}}
            onSave={saveAction}
            onCancel={() => setAction(null)}
          />
        </Dialog>
      )}
      {editing && (
        <Dialog title="Participación" onClose={() => setEditing(null)}>
          <Form
            fields={resources.participaciones.fields}
            initial={editing}
            onSave={async (body) => {
              if (body.partidoId !== Number(id))
                throw new Error(
                  'El partido debe coincidir con el detalle abierto.',
                );
              await mutate(
                '/participaciones' + (editing.id ? '/' + editing.id : ''),
                editing.id ? 'PUT' : 'POST',
                body,
              );
              setEditing(null);
              refresh();
            }}
            onCancel={() => setEditing(null)}
          />
        </Dialog>
      )}
      {deleting && (
        <Dialog title="Quitar participación" onClose={() => setDeleting(null)}>
          <p>¿Quitar a {String(deleting.usernameJugador)} de este partido?</p>
          {mutation.feedback}
          <Button
            disabled={mutation.busy}
            onClick={() =>
              void mutation.run(async () => {
                await mutate('/participaciones/' + deleting.id, 'DELETE');
                setDeleting(null);
              })
            }
          >
            Confirmar
          </Button>
          <Button disabled={mutation.busy} onClick={() => setDeleting(null)}>
            Cancelar
          </Button>
        </Dialog>
      )}
    </div>
  );
}
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
export function PlayerDetail() {
  const { id } = useParams();
  const player = useRemote<Row>('/jugadores/' + id);
  const [tab, setTab] = useState('torneos');
  return (
    <div className="live-page">
      <section className="live-card">
        <h2>{String(player.data?.username ?? 'Historial del jugador')}</h2>
        {player.error && <Notice error>{player.error}</Notice>}
        <div className="live-actions">
          {['torneos', 'partidos', 'trofeos'].map((x) => (
            <Button key={x} onClick={() => setTab(x)} disabled={tab === x}>
              {x}
            </Button>
          ))}
        </div>
      </section>
      <ResourcePage key={tab} resource={tab} playerId={id} />
    </div>
  );
}
