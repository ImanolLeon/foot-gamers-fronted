import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { mutate, rootFor, type Page, type Row } from '../../lib/panel';
import { useMutation, useRemote } from '../../components/panel/LiveUI';
import { AdminSetupSteps } from '../../components/panel/dashboard/AdminSetupSteps';
import { AvailableTournaments } from '../../components/panel/dashboard/AvailableTournaments';
import { CreateTournamentDialog } from '../../components/panel/dashboard/CreateTournamentDialog';
import { DashboardHero } from '../../components/panel/dashboard/DashboardHero';
import { DashboardMatches } from '../../components/panel/dashboard/DashboardMatches';
import { DashboardMetrics } from '../../components/panel/dashboard/DashboardMetrics';
import { DashboardTournaments } from '../../components/panel/dashboard/DashboardTournaments';
import type { DashboardMetricItem } from '../../components/panel/dashboard/types';
import './panel.css';

/** Portada del panel: orquesta datos y compone las secciones por rol. */
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
  const metrics: DashboardMetricItem[] = admin
    ? [
        { title: 'Torneos', path: '/torneos', to: '/torneos' },
        { title: 'Partidos', path: '/partidos', to: '/partidos' },
        { title: 'Jugadores', path: '/jugadores', to: '/jugadores' },
        { title: 'Usuarios', path: '/usuarios', to: '/usuarios' },
      ]
    : [
        {
          title: 'Mis torneos',
          path: '/jugadores/mis-torneos',
          to: '/mis-torneos',
        },
        {
          title: 'Mis partidos',
          path: '/jugadores/mis-partidos',
          to: '/partidos',
        },
        {
          title: 'Mis trofeos',
          path: '/jugadores/mis-trofeos',
          to: '/trofeos',
        },
        {
          title: 'Torneos abiertos',
          path: '/torneos/disponibles',
          to: '/torneos',
        },
      ];

  async function createTournament(body: Record<string, unknown>) {
    await mutate('/torneos', 'POST', body);
    setCreating(false);
    refresh();
  }

  return (
    <div className="live-page dashboard">
      <DashboardHero
        admin={admin}
        username={session?.username}
        root={root}
        onCreate={() => setCreating(true)}
        onRefresh={refresh}
      />

      <DashboardMetrics
        metrics={metrics.map((metric) => ({ ...metric, to: root + metric.to }))}
        revision={revision}
      />
      {mutation.feedback}

      <div className="dashboard-columns">
        <DashboardTournaments remote={tournaments} admin={admin} root={root} />
        <DashboardMatches remote={matches} admin={admin} root={root} />
      </div>

      {admin ? (
        <AdminSetupSteps />
      ) : (
        <AvailableTournaments
          remote={available}
          root={root}
          busy={mutation.busy}
          onEnroll={(id) =>
            void mutation.run(
              () => mutate('/torneos/' + id + '/inscripcion', 'POST'),
              'Inscripción confirmada. Tu torneo ya aparece en Mis torneos.',
            )
          }
        />
      )}

      {creating && admin && (
        <CreateTournamentDialog
          onClose={() => setCreating(false)}
          onSave={createTournament}
        />
      )}
    </div>
  );
}
