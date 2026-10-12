import { Globe } from '../Icons';
import { JUGADOR_NAV } from '../../data/panelNav';
import { PanelLayout } from '../panel/PanelLayout';

/** Panel del jugador: mismas vistas, solo lo que le corresponde. */
export function JugadorLayout() {
  return (
    <PanelLayout
      nav={JUGADOR_NAV}
      raiz="/jugador"
      subtitulo="Panel jugador"
      etiquetaGrupo="Mi cuenta"
      IconoVerSitio={Globe}
      placeholderBusqueda="Buscar torneo…"
      rolFallback="Jugador"
      notificaciones={2}
    />
  );
}
