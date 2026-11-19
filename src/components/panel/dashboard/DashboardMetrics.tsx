import { DashboardMetric } from './DashboardMetric';
import type { DashboardMetricItem } from './types';

type DashboardMetricsProps = {
  metrics: readonly DashboardMetricItem[];
  revision: number;
};

/** Grid de métricas del panel. */
export function DashboardMetrics({ metrics, revision }: DashboardMetricsProps) {
  return (
    <div className="live-grid dashboard-metrics">
      {metrics.map((metric, index) => (
        <DashboardMetric
          key={metric.path}
          metric={metric}
          revision={revision}
          index={index}
        />
      ))}
    </div>
  );
}
