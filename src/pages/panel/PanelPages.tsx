import { Dashboard } from './Dashboard';
import { rootFor } from '../../lib/panel';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { resources, mutate, type Page, type Row } from '../../lib/panel';
import {
  useRemote,
  useMutation,
  Button,
  Dialog,
  Form,
  Notice,
  Table,
} from '../../components/panel/LiveUI';
import { PerfilModal } from '../../components/panel/PerfilModal';
import './panel.css';

export function ResourcePage({
  resource,
  personal = false,
  available = false,
  playerId,
}: {
  resource: string;
  personal?: boolean;
  available?: boolean;
  playerId?: string;
}) {
  const { session } = useAuth();
  const admin = session?.rol === 'ADMINISTRADOR';
  const root = rootFor(admin);
  const config = resources[resource];
  const canManage = admin && !personal && !available && !playerId;
  const path = playerId
    ? '/jugadores/' + playerId + '/' + resource
    : personal
      ? '/jugadores/mis-' + resource
      : available
        ? '/torneos/disponibles'
        : config.path;
  const [pagina, setPagina] = useState(0);
  const [revision, setRevision] = useState(0);
  const [editing, setEditing] = useState<Row | Partial<Row> | null>(null);
  const [deleting, setDeleting] = useState<Row | null>(null);
  const [search, setSearch] = useState('');
  const result = useRemote<Page<Row>>(
    path + '?pagina=' + pagina + '&tamano=10',
    revision,
  );
  const refresh = () => setRevision((x) => x + 1);
  const mutation = useMutation(refresh);
  const title = playerId
    ? config.title + ' del jugador'
    : personal
      ? 'Mis ' + resource
      : available
        ? 'Torneos abiertos'
        : config.title;
  const columns: [string, string][] = available
    ? [
        ['nombre', 'Torneo'],
        ['nombreCategoria', 'Categoría'],
        ['fechaInicio', 'Inicio'],
        ['inscritos', 'Inscritos'],
        ['cuposDisponibles', 'Cupos libres'],
        ['yaInscrito', 'Inscripción'],
      ]
    : config.columns;
  const rows = (result.data?.content ?? []).filter((row) =>
    columns.some(([key]) =>
      String(row[key] ?? '')
        .toLowerCase()
        .includes(search.toLowerCase()),
    ),
  );
  async function save(body: Record<string, unknown>) {
    await mutate(
      config.path + (editing?.id ? '/' + editing.id : ''),
      editing?.id ? 'PUT' : 'POST',
      body,
    );
    setEditing(null);
    refresh();
  }
  return (
    <div className="live-page">
      <section className="live-card">
        <div className="live-heading">
          <div>
            <h2>{title}</h2>
            <p className="live-muted">
              {result.data
                ? result.data.totalElements + ' registros'
                : 'Consultando datos'}
            </p>
          </div>
          <div className="live-actions">
            <Button onClick={refresh} disabled={result.loading}>
              Actualizar
            </Button>
            {canManage && (
              <Button onClick={() => setEditing({})}>
                Crear{' '}
                {resource === 'categorias'
                  ? 'categoría'
                  : resource === 'participaciones'
                    ? 'participación'
                    : resource.slice(0, -1)}
              </Button>
            )}
          </div>
        </div>
        {mutation.feedback}
        <label className="live-form">
          Filtrar en esta página
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Nombre, fecha, estado…"
          />
        </label>
        {result.loading ? (
          <Notice>Cargando…</Notice>
        ) : result.error ? (
          <Notice error>{result.error}</Notice>
        ) : (
          <Table
            rows={rows}
            columns={columns}
            actions={(row) => (
              <>
                {(resource === 'torneos' || resource === 'partidos') && (
                  <Link
                    className="live-button"
                    to={root + '/' + resource + '/' + row.id}
                  >
                    Ver detalle
                  </Link>
                )}
                {resource === 'jugadores' && admin && (
                  <Link
                    className="live-button"
                    to={root + '/jugadores/' + row.id}
                  >
                    Historial
                  </Link>
                )}
                {available && (
                  <Button
                    disabled={
                      mutation.busy ||
                      !!row.yaInscrito ||
                      Number(row.cuposDisponibles) <= 0
                    }
                    onClick={() =>
                      void mutation.run(
                        () =>
                          mutate('/torneos/' + row.id + '/inscripcion', 'POST'),
                        'Inscripción confirmada. Ya aparece en Mis torneos.',
                      )
                    }
                  >
                    {row.yaInscrito ? 'Inscrito' : 'Inscribirme'}
                  </Button>
                )}
                {canManage && (
                  <>
                    <Button onClick={() => setEditing(row)}>Editar</Button>
                    <Button onClick={() => setDeleting(row)}>Eliminar</Button>
                  </>
                )}
                {resource === 'participaciones' && canManage && (
                  <Button
                    disabled={
                      mutation.busy || row.estadoConfirmacion === 'CONFIRMADO'
                    }
                    onClick={() =>
                      void mutation.run(() =>
                        mutate(
                          '/participaciones/' + row.id + '/confirmar',
                          'PUT',
                        ),
                      )
                    }
                  >
                    Confirmar
                  </Button>
                )}
              </>
            )}
          />
        )}
        <div className="live-pager">
          <Button
            disabled={pagina === 0 || result.loading}
            onClick={() => setPagina((p) => p - 1)}
          >
            Anterior
          </Button>
          <span>
            Página {pagina + 1} de {Math.max(1, result.data?.totalPages ?? 1)}
          </span>
          <Button
            disabled={
              result.loading ||
              !result.data ||
              pagina + 1 >= result.data.totalPages
            }
            onClick={() => setPagina((p) => p + 1)}
          >
            Siguiente
          </Button>
        </div>
      </section>
      {editing && (
        <Dialog
          title={
            (editing.id ? 'Editar ' : 'Crear ') + config.title.toLowerCase()
          }
          onClose={() => setEditing(null)}
        >
          <Form
            fields={config.fields}
            initial={editing}
            onSave={save}
            onCancel={() => setEditing(null)}
          />
        </Dialog>
      )}
      {deleting && (
        <Dialog
          title="Confirmar eliminación"
          onClose={() => !mutation.busy && setDeleting(null)}
        >
          <p>
            ¿Eliminar{' '}
            {String(deleting.nombre ?? deleting.username ?? '#' + deleting.id)}?
            Esta acción no se puede deshacer.
          </p>
          {mutation.feedback}
          <div className="live-actions">
            <Button
              disabled={mutation.busy}
              onClick={() =>
                void mutation.run(async () => {
                  await mutate(config.path + '/' + deleting.id, 'DELETE');
                  setDeleting(null);
                  if (rows.length === 1 && pagina > 0) setPagina((p) => p - 1);
                })
              }
            >
              Eliminar definitivamente
            </Button>
            <Button disabled={mutation.busy} onClick={() => setDeleting(null)}>
              Cancelar
            </Button>
          </div>
        </Dialog>
      )}
    </div>
  );
}

export function ProfilePage() {
  const { usuario } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <div className="live-page">
      <section className="live-card">
        <h2>Mi cuenta</h2>
        <dl className="live-detail">
          <div>
            <dt>Usuario</dt>
            <dd>{usuario?.username}</dd>
          </div>
          <div>
            <dt>Correo</dt>
            <dd>{usuario?.email ?? 'Sin correo'}</dd>
          </div>
          <div>
            <dt>Rol</dt>
            <dd>{usuario?.rol}</dd>
          </div>
        </dl>
        <Button onClick={() => setOpen(true)}>
          Editar datos, imagen y contraseña
        </Button>
      </section>
      <PerfilModal open={open} onClose={() => setOpen(false)} />
    </div>
  );
}
export function PanelSection() {
  const { pathname } = useLocation();
  const admin = pathname.startsWith('/admin');
  const section = pathname.split('/')[2];
  if (!section) return <Dashboard />;
  if (section === 'perfil' || section === 'ajustes') return <ProfilePage />;
  const personal =
    section.startsWith('mis-') ||
    (!admin && (section === 'partidos' || section === 'trofeos'));
  const resource = section.replace('mis-', '');
  return (
    <ResourcePage
      key={pathname}
      resource={resource === 'disponibles' ? 'torneos' : resource}
      personal={personal}
      available={section === 'disponibles' || (!admin && section === 'torneos')}
    />
  );
}
