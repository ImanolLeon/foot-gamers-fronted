import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { inicioDeSesion } from '../lib/auth';
import type { Rol } from '../lib/token';
import { Spinner } from './Icons';

/** Pantalla de carga mientras se hidrata la sesión. */
function Cargando() {
  return (
    <div className="grid min-h-screen place-items-center bg-bg">
      <Spinner className="size-8 animate-spin text-magenta" />
      <span className="sr-only">Cargando sesión</span>
    </div>
  );
}

/** Bloquea el área privada si no hay token válido. */
export function RequireAuth() {
  const { isAuthenticated, hidratando } = useAuth();
  const location = useLocation();

  if (hidratando) return <Cargando />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return <Outlet />;
}

/** Restringe una ruta a un rol concreto. */
export function RequireRole({ rol }: { rol: Rol }) {
  const { session } = useAuth();

  if (session && session.rol !== rol) {
    // Manda al panel que sí le corresponde, no a la landing.
    return <Navigate to={inicioDeSesion(session.rol)} replace />;
  }

  return <Outlet />;
}