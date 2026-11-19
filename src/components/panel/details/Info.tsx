import type { Row } from '../../../lib/panel';

/** Lista de campos de una fila, con el formato de detalle del panel. */
export function Info({ row, columns }: { row: Row; columns: [string, string][] }) {
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
