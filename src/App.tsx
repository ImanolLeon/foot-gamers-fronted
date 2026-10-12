import { Navigate, Route, Routes } from 'react-router-dom';
import { Landing } from './pages/Landing';
import { Login } from './pages/Login';
import { AuthCallback } from './pages/AuthCallback';
import { NotFound } from './pages/NotFound';
import { AdminLayout } from './components/admin/AdminLayout';
import { JugadorLayout } from './components/jugador/JugadorLayout';
import { AdminDashboard } from './pages/admin/AdminDashboard';
import { AdminPlaceholder } from './pages/admin/AdminPlaceholder';
import { JugadorDashboard } from './pages/jugador/JugadorDashboard';
import { JugadorPlaceholder } from './pages/jugador/JugadorPlaceholder';
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
              <Route index element={<AdminDashboard />} />
              <Route path="torneos" element={<AdminPlaceholder />} />
              <Route path="partidos" element={<AdminPlaceholder />} />
              <Route path="jugadores" element={<AdminPlaceholder />} />
              <Route path="bandos" element={<AdminPlaceholder />} />
              <Route path="grupos" element={<AdminPlaceholder />} />
              <Route path="categorias" element={<AdminPlaceholder />} />
              <Route path="trofeos" element={<AdminPlaceholder />} />
              <Route path="usuarios" element={<AdminPlaceholder />} />
              <Route path="ajustes" element={<AdminPlaceholder />} />
            </Route>
          </Route>

          <Route element={<RequireRole rol="JUGADOR" />}>
            <Route path="/jugador" element={<JugadorLayout />}>
              <Route index element={<JugadorDashboard />} />
              <Route path="torneos" element={<JugadorPlaceholder />} />
              <Route path="partidos" element={<JugadorPlaceholder />} />
              <Route path="mis-torneos" element={<JugadorPlaceholder />} />
              <Route path="clasificacion" element={<JugadorPlaceholder />} />
              <Route path="trofeos" element={<JugadorPlaceholder />} />
              <Route path="perfil" element={<JugadorPlaceholder />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;