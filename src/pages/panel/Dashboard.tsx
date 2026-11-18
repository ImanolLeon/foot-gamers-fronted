import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  mutate,
  resources,
  rootFor,
  type Page,
  type Row,
} from '../../lib/panel';
import {
  Button,
  Dialog,
  Form,
  Notice,
  Table,
  useMutation,
  useRemote,
} from '../../components/panel/LiveUI';
import './panel.css';

export function Dashboard() {
  const { session } = useAuth();
  const admin = session?.rol === 'ADMINISTRADOR';
  const root = rootFor(admin);
  const [revision, setRevision] = useState(0);
  const [creating, setCreating] = useState(false);
  const refresh = () => setRevision((value) => value + 1);
  const mutation = useMutation(refresh);
  const tournaments = useRemote<Page<Row>>(
    (admin ? '/torneos' : '/jugadores/mis-torneos') + '?pagina=0&tamano=5',
    revision,
  );
  const matches = useRemote<Page<Row>>(
    (admin ? '/partidos' : '/jugadores/mis-partidos') + '?pagina=0&tamano=5',
    revision,
  );
  const available = useRemote<Page<Row>>(
    admin ? null : '/torneos/disponibles?pagina=0&tamano=4',
    revision,
  );
  const metrics = admin
    ? [
        ['Torneos', '/torneos', '/torneos'],
        ['Partidos', '/partidos', '/partidos'],
        ['Jugadores', '/jugadores', '/jugadores'],
        ['Usuarios', '/usuarios', '/usuarios'],
      ]
    : [
        ['Mis torneos', '/jugadores/mis-torneos', '/mis-torneos'],
        ['Mis partidos', '/jugadores/mis-partidos', '/partidos'],
        ['Mis trofeos', '/jugadores/mis-trofeos', '/trofeos'],
        ['Torneos abiertos', '/torneos/disponibles', '/torneos'],
      ];

  async function createTournament(body: Record<string, unknown>) {
    await mutate('/torneos', 'POST', body);
    setCreating(false);
    refresh();
  }

  return (
    <div className="live-page dashboard">
      <section className="dashboard-hero">
        <div>
          <p className="dashboard-eyebrow">
            {admin ? 'CENTRO DE COMPETICIÓN' : 'TU ZONA DE JUEGO'}
          </p>
          <h2>Hola, {session?.username}</h2>
          <p>
            {admin
              ? 'Organiza la próxima jornada y acompaña cada torneo hasta la final.'
              : 'Encuentra tu próximo torneo y sigue cada partido de tu temporada.'}
          </p>
          <div className="live-actions">
            {admin ? (
              <Button onClick={() => setCreating(true)}>Crear torneo</Button>
            ) : (
              <Link className="live-button" to={root + '/torneos'}>
                Explorar torneos
              </Link>
            )}
            <Link className="live-button" to={root + '/clasificacion'}>
              Ver clasificación
            </Link>
          </div>
        </div>
        <Button onClick={refresh}>Actualizar panel</Button>
      </section>

      <div className="live-grid dashboard-metrics">
        {metrics.map(([title, path, to], index) => (
          <Metric
            key={path}
            title={title}
            path={path}
            to={root + to}
            revision={revision}
            index={index}
          />
        ))}
      </div>
      {mutation.feedback}

      <div className="dashboard-columns">
        <section className="live-card">
          <div className="live-heading">
            <div>
              <p className="dashboard-eyebrow">COMPETICIONES</p>
              <h2>{admin ? 'Agenda de torneos' : 'Mis torneos recientes'}</h2>
            </div>
            <Link to={root + (admin ? '/torneos' : '/mis-torneos')}>
              Ver todos →
            </Link>
          </div>
          {tournaments.loading ? (
            <Notice>Cargando torneos…</Notice>
          ) : tournaments.error ? (
            <Notice error>{tournaments.error}</Notice>
          ) : !tournaments.data?.content.length ? (
            <div className="dashboard-empty">
              <h3>
                {admin
                  ? 'Tu próxima competición empieza aquí'
                  : 'Todavía no te has inscrito'}
              </h3>
              <p>
                {admin
                  ? 'Crea una categoría y un trofeo, y después abre tu torneo para que los jugadores se inscriban.'
                  : 'Consulta los torneos abiertos y elige uno con plazas disponibles.'}
              </p>
              <Link to={root + (admin ? '/categorias' : '/torneos')}>
                {admin ? 'Gestionar categorías' : 'Buscar torneo'} →
              </Link>
            </div>
          ) : (
            <div className="dashboard-tournaments">
              {tournaments.data.content.map((t) => (
                <article className="dashboard-tournament" key={t.id}>
                  <div className="live-heading">
                    <span className="dashboard-badge">
                      {String(t.estado ?? 'Sin estado').replaceAll('_', ' ')}
                    </span>
                    <span className="live-muted">
                      {String(t.nombreCategoria ?? 'Sin categoría')}
                    </span>
                  </div>
                  <h3>{String(t.nombre)}</h3>
                  <p className="live-muted">
                    {String(t.fechaInicio ?? 'Sin fecha')} ·{' '}
                    {String(t.cantidadJugadores)} plazas
                  </p>
                  <div className="live-actions">
                    <Link to={root + '/torneos/' + t.id}>
                      {admin ? 'Gestionar torneo' : 'Ver mi torneo'} →
                    </Link>
                    {t.usernameGanador && (
                      <span className="live-muted">
                        Campeón: {String(t.usernameGanador)}
                      </span>
                    )}
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
        <section className="live-card">
          <div className="live-heading">
            <div>
              <p className="dashboard-eyebrow">JORNADA</p>
              <h2>
                {admin
                  ? 'Últimos partidos registrados'
                  : 'Mis últimos partidos'}
              </h2>
            </div>
            <Link to={root + '/partidos'}>Ver todos →</Link>
          </div>
          <p className="live-muted">
            Consulta el calendario completo, los resultados y las confirmaciones
            desde el detalle.
          </p>
          {matches.loading ? (
            <Notice>Cargando partidos…</Notice>
          ) : matches.error ? (
            <Notice error>{matches.error}</Notice>
          ) : (
            <Table
              rows={matches.data?.content ?? []}
              columns={[
                ['fecha', 'Fecha'],
                ['fase', 'Fase'],
                ['resultado', 'Resultado'],
                ['estado', 'Estado'],
              ]}
              actions={(match) => (
                <Link to={root + '/partidos/' + match.id}>
                  Ver partido #{match.id}
                </Link>
              )}
            />
          )}
        </section>
      </div>

      {admin ? (
        <section className="live-card">
          <div className="live-heading">
            <h2>Prepara tu torneo</h2>
          </div>
          <div className="dashboard-steps">
            <Link to="/admin/categorias">
              <strong>01 · Configura</strong>
              <span>Categorías y formatos de competición</span>
            </Link>
            <Link to="/admin/trofeos">
              <strong>02 · Elige el premio</strong>
              <span>Trofeos que recibirán los campeones</span>
            </Link>
            <Link to="/admin/torneos">
              <strong>03 · Organiza</strong>
              <span>Inscritos, grupos, llaves y resultados</span>
            </Link>
            <Link to="/admin/participaciones">
              <strong>04 · Confirma</strong>
              <span>Participaciones y bandos de cada partido</span>
            </Link>
          </div>
        </section>
      ) : (
        <section className="live-card">
          <div className="live-heading">
            <div>
              <p className="dashboard-eyebrow">ÚNETE A LA COMPETICIÓN</p>
              <h2>Torneos abiertos</h2>
            </div>
            <Link to={root + '/torneos'}>Ver todos →</Link>
          </div>
          {available.loading ? (
            <Notice>Buscando torneos…</Notice>
          ) : available.error ? (
            <Notice error>{available.error}</Notice>
          ) : !available.data?.content.length ? (
            <Notice>
              No hay torneos con inscripciones abiertas en este momento.
            </Notice>
          ) : (
            <div className="live-grid">
              {available.data.content.map((t) => (
                <article className="dashboard-tournament" key={t.id}>
                  <h3>{String(t.nombre)}</h3>
                  <p className="live-muted">
                    {String(t.nombreCategoria ?? '')} · {String(t.fechaInicio)}
                  </p>
                  <p>
                    <strong>{String(t.cuposDisponibles)}</strong> plazas libres
                    de {String(t.cantidadJugadores)}
                  </p>
                  <div className="live-actions">
                    <Button
                      disabled={
                        mutation.busy ||
                        !!t.yaInscrito ||
                        Number(t.cuposDisponibles) < 1
                      }
                      onClick={() =>
                        void mutation.run(
                          () =>
                            mutate('/torneos/' + t.id + '/inscripcion', 'POST'),
                          'Inscripción confirmada. Tu torneo ya aparece en Mis torneos.',
                        )
                      }
                    >
                      {t.yaInscrito ? 'Ya estás inscrito' : 'Inscribirme'}
                    </Button>
                    <Link to={root + '/torneos/' + t.id}>Detalles</Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      )}
      {creating && admin && (
        <Dialog title="Crear torneo" onClose={() => setCreating(false)}>
          <Form
            fields={resources.torneos.fields}
            onSave={createTournament}
            onCancel={() => setCreating(false)}
          />
        </Dialog>
      )}
    </div>
  );
}

function Metric({
  title,
  path,
  to,
  revision,
  index,
}: {
  title: string;
  path: string;
  to: string;
  revision: number;
  index: number;
}) {
  const result = useRemote<Page<Row>>(path + '?pagina=0&tamano=1', revision);
  return (
    <article className={'live-card dashboard-metric dashboard-accent-' + index}>
      <p className="live-muted">{title}</p>
      <div className="live-stat">
        {result.loading ? '…' : (result.data?.totalElements ?? '—')}
      </div>
      {result.error && <Notice error>{result.error}</Notice>}
      <Link to={to}>Consultar →</Link>
    </article>
  );
}
