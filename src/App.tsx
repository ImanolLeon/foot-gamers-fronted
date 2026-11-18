import { PanelSection } from './pages/panel/PanelPages';
import {
  TorneoDetail,
  PartidoDetail,
  ClassificationPage,
  PlayerDetail,
} from './pages/panel/DetailPages';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { AuthCallback } from './pages/AuthCallback';
import { NotFound } from './pages/NotFound';
import { AdminLayout } from './components/admin/AdminLayout';
import { JugadorLayout } from './components/jugador/JugadorLayout';
import { RequireAuth, RequireRole } from './components/RouteGuards';
import { inicioDeSesion } from './lib/auth';
import { useAuth } from './hooks/useAuth';

/** Si ya hay token válido, no deja volver al login. */
function LoginRoute() {
  const { isAuthenticated, session, hidratando } = useAuth();

  if (hidratando) return null;
  if (!isAuthenticated) return <Login />;

  return <Navigate to={inicioDeSesion(session?.rol)} replace />;
}

function App() {
  return (
    <>
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-200 focus:rounded-lg focus:bg-magenta focus:px-4 focus:py-2 focus:font-bold"
      >
        Saltar al contenido
      </a>

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<LoginRoute />} />

        {/* Retorno del login OAuth2 del backend: guarda el token y entra al panel. */}
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* ============================================================
            Zona privada: cada rol entra a su propio panel.
            ADMINISTRADOR → /admin (acceso total)
            JUGADOR       → /jugador (solo sus datos)
        ============================================================ */}
        <Route element={<RequireAuth />}>
          <Route element={<RequireRole rol="ADMINISTRADOR" />}>
            <Route path="/admin" element={<AdminLayout />}>
              <Route path="disponibles" element={<PanelSection />} />
              <Route path="mis-torneos" element={<PanelSection />} />
              <Route path="mis-partidos" element={<PanelSection />} />
              <Route path="mis-trofeos" element={<PanelSection />} />
              <Route path="participaciones" element={<PanelSection />} />
              <Route path="clasificacion" element={<ClassificationPage />} />
              <Route path="jugadores/:id" element={<PlayerDetail />} />
              <Route path="torneos/:id" element={<TorneoDetail />} />
              <Route path="partidos/:id" element={<PartidoDetail />} />
              <Route index element={<PanelSection />} />
              <Route path="torneos" element={<PanelSection />} />
              <Route path="partidos" element={<PanelSection />} />
              <Route path="jugadores" element={<PanelSection />} />
              <Route path="bandos" element={<PanelSection />} />
              <Route path="grupos" element={<ClassificationPage />} />
              <Route path="categorias" element={<PanelSection />} />
              <Route path="trofeos" element={<PanelSection />} />
              <Route path="usuarios" element={<PanelSection />} />
              <Route path="ajustes" element={<PanelSection />} />
            </Route>
          </Route>

          <Route element={<RequireRole rol="JUGADOR" />}>
            <Route path="/jugador" element={<JugadorLayout />}>
              <Route path="torneos/:id" element={<TorneoDetail />} />
              <Route path="partidos/:id" element={<PartidoDetail />} />
              <Route index element={<PanelSection />} />
              <Route path="torneos" element={<PanelSection />} />
              <Route path="partidos" element={<PanelSection />} />
              <Route path="mis-torneos" element={<PanelSection />} />
              <Route path="clasificacion" element={<ClassificationPage />} />
              <Route path="trofeos" element={<PanelSection />} />
              <Route path="perfil" element={<PanelSection />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
