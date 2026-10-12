import { LayoutDashboard } from '../Icons';
import { ADMIN_NAV } from '../../data/panelNav';
import { PanelLayout } from '../panel/PanelLayout';

/** Panel del administrador: acceso total al sistema. */
export function AdminLayout() {
  return (
    <PanelLayout
      nav={ADMIN_NAV}
      raiz="/admin"
      subtitulo="Panel admin"
      etiquetaGrupo="Gestión"
      IconoVerSitio={LayoutDashboard}
      placeholderBusqueda="Buscar jugador, torneo…"
      rolFallback="Administrador"
      notificaciones={3}
    />
  );
}
