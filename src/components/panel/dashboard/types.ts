import type { Page, Row } from '../../../lib/panel';

/** Estado devuelto por `useRemote` para una página de resultados. */
export type RemotePage = {
  data?: Page<Row>;
  error?: string;
  loading: boolean;
};

/** Configuración de una tarjeta de métrica del panel. */
export type DashboardMetricItem = {
  title: string;
  path: string;
  to: string;
};
