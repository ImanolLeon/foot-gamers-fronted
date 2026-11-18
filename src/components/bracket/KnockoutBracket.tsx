import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { mutate } from '../../lib/panel';
import { useRemote, Notice } from '../panel/LiveUI';
import './bracket.css';

type Team = {
  jugadorId: number;
  bandoId: number;
  lado: number;
  nombre: string | null;
  username: string;
};

type Match = {
  id: number;
  fase: string;
  fuenteUnoId: number | null;
  fuenteDosId: number | null;
  ganadorId: number | null;
  resultado: string | null;
  equipos: Team[];
};
type Positioned = { match: Match; x: number; y: number };

export function KnockoutBracket({
  torneoId,
  revision,
  editable,
  onSaved,
  root,
}: {
  torneoId: string;
  revision: number;
  editable: boolean;
  onSaved: () => void;
  root: string;
}) {
  const data = useRemote<Match[]>(
    '/torneos/' + torneoId + '/bracket',
    revision,
  );
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const lock = useRef(false);
  async function choose(match: Match, team: Team) {
    if (lock.current || !editable || match.ganadorId === team.bandoId) return;
    lock.current = true;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await mutate('/partidos/' + match.id + '/ganador/' + team.bandoId, 'PUT');
      setMessage((team.nombre || team.username) + ' avanza.');
      onSaved();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : 'No se pudo guardar el ganador.',
      );
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  const matches = data.data ?? [];
  const finals = matches.filter((m) => m.fase === 'FINAL');
  const nodes: Positioned[] = [];
  const visited = new Set<number>();
  function place(
    id: number | null,
    side: number,
    depth: number,
    low: number,
    high: number,
  ) {
    const match = matches.find((m) => m.id === id);
    if (!match || depth > 3 || visited.has(match.id)) return;
    visited.add(match.id);
    const y = (low + high) / 2;
    nodes.push({ match, x: 650 + side * depth * 210, y });
    if (depth < 3) {
      place(match.fuenteUnoId, side, depth + 1, low, y);
      place(match.fuenteDosId, side, depth + 1, y, high);
    }
  }
  const final = finals.length === 1 ? finals[0] : undefined;
  if (final) {
    nodes.push({ match: final, x: 650, y: 410 });
    visited.add(final.id);
    place(final.fuenteUnoId, -1, 1, 50, 770);
    place(final.fuenteDosId, 1, 1, 50, 770);
  }
  const champion = final?.equipos.find((t) => t.bandoId === final.ganadorId);
  return (
    <section className="knockout" aria-label="Llaves de eliminación directa">
      <header>
        <p>ELIMINACIÓN DIRECTA</p>
        <h2>LLAVES DEL TORNEO</h2>
        <p>
          {editable
            ? 'Selecciona un equipo para avanzar. Cambiar un ganador borra los resultados de las rondas que dependían de él.'
            : 'Sigue el camino de cada equipo hasta la final.'}
        </p>
      </header>
      {error && <Notice error>{error}</Notice>}
      {message && (
        <p role="status" className="knockout-message">
          {message}
        </p>
      )}
      {data.loading && !data.data ? (
        <p role="status">Cargando llaves…</p>
      ) : data.error ? (
        <Notice error>{data.error}</Notice>
      ) : !matches.length ? (
        <p className="knockout-empty">
          Todavía no hay llaves. El administrador debe generar las eliminatorias
          desde los grupos del torneo.
        </p>
      ) : !final || nodes.length !== matches.length ? (
        <Notice error>
          Las llaves no forman un cuadro único de hasta 16 equipos. Revisa los
          partidos y sus relaciones de origen.
        </Notice>
      ) : (
        <>
          <p className="knockout-scroll-hint">
            Desliza horizontalmente para recorrer todas las rondas.
          </p>
          <div
            className="knockout-scroll"
            tabIndex={0}
            aria-label="Cuadro del torneo, desplazamiento horizontal"
          >
            <div className="knockout-board">
              {[
                'OCTAVOS',
                'CUARTOS',
                'SEMIFINAL',
                'FINAL',
                'SEMIFINAL',
                'CUARTOS',
                'OCTAVOS',
              ].map((label, i) => (
                <div
                  key={i}
                  className="knockout-round"
                  style={{ left: 20 + i * 210 }}
                >
                  {label}
                </div>
              ))}
              <svg
                className="knockout-lines"
                width="1480"
                height="850"
                aria-hidden="true"
              >
                {nodes.flatMap((target) =>
                  [target.match.fuenteUnoId, target.match.fuenteDosId].map(
                    (id) => {
                      const source = nodes.find((n) => n.match.id === id);
                      if (!source) return null;
                      const right = source.x < target.x;
                      const from = source.x + (right ? 180 : 0);
                      const to = target.x + (right ? 0 : 180);
                      const middle = (from + to) / 2;
                      return (
                        <path
                          key={id}
                          d={`M ${from} ${source.y} H ${middle} V ${target.y} H ${to}`}
                        />
                      );
                    },
                  ),
                )}
              </svg>
              <div className="knockout-trophy" aria-hidden="true">
                🏆
              </div>
              {nodes.map(({ match, x, y }) => (
                <article
                  key={match.id}
                  className="knockout-match"
                  style={{ left: x, top: y - 44 }}
                  aria-label={match.fase + ' partido ' + match.id}
                >
                  {[1, 2].map((side) => {
                    const team = match.equipos.find((t) => t.lado === side);
                    const selected = !!team && match.ganadorId === team.bandoId;
                    return (
                      <button
                        key={side}
                        type="button"
                        aria-pressed={selected}
                        disabled={
                          !editable ||
                          busy ||
                          data.loading ||
                          !team ||
                          match.equipos.length !== 2
                        }
                        onClick={() => team && void choose(match, team)}
                        className={selected ? 'is-winner' : ''}
                        title={
                          team
                            ? (team.nombre || team.username) +
                              ' · ' +
                              team.username
                            : 'Esperando al ganador de la ronda anterior'
                        }
                      >
                        <span className="knockout-avatar">
                          {team
                            ? (team.nombre || team.username)
                                .slice(0, 1)
                                .toUpperCase()
                            : '·'}
                        </span>
                        <span className="knockout-name">
                          {team ? team.nombre || team.username : 'Por definir'}
                        </span>
                        {selected && <span aria-label="Ganador">✓</span>}
                      </button>
                    );
                  })}
                  <Link
                    className="knockout-match-link"
                    to={root + '/partidos/' + match.id}
                  >
                    Partido #{match.id}
                    {match.resultado ? ' · ' + match.resultado : ''}
                  </Link>
                </article>
              ))}
              <div className="knockout-champion">
                <span>CAMPEÓN</span>
                <strong>
                  {champion
                    ? champion.nombre || champion.username
                    : 'Por definir'}
                </strong>
              </div>
            </div>
          </div>
        </>
      )}
    </section>
  );
}
