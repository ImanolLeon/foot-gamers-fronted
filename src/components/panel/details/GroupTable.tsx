import type { Row } from '../../../lib/panel';
import { Notice, Table, useRemote } from '../LiveUI';

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

/** Clasificación de un grupo, cargada desde la API. */
export function GroupTable({ group, revision }: { group: Row; revision: number }) {
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
