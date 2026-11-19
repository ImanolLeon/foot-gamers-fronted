import { Link } from 'react-router-dom';
import type { Page, Row } from '../../../lib/panel';
import { Notice, useRemote } from '../LiveUI';
import type { DashboardMetricItem } from './types';

type DashboardMetricProps = {
  metric: DashboardMetricItem;
  revision: number;
  index: number;
};

/** Tarjeta con el total real de un recurso, leído desde la API. */
export function DashboardMetric({ metric, revision, index }: DashboardMetricProps) {
  const result = useRemote<Page<Row>>(metric.path + '?pagina=0&tamano=1', revision);

  return (
    <article className={'live-card dashboard-metric dashboard-accent-' + index}>
      <p className="live-muted">{metric.title}</p>
      <div className="live-stat">
        {result.loading ? '…' : (result.data?.totalElements ?? '—')}
      </div>
      {result.error && <Notice error>{result.error}</Notice>}
      <Link to={metric.to}>Consultar →</Link>
    </article>
  );
}
