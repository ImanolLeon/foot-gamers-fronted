import { useState } from 'react';
import { useParams } from 'react-router-dom';
import type { Row } from '../../../lib/panel';
import { ResourcePage } from '../../../pages/panel/PanelPages';
import { Button, Notice, useRemote } from '../LiveUI';

/** Historial de un jugador: torneos, partidos y trofeos por pestañas. */
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
