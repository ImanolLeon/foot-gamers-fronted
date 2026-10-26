import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { inicioDeSesion } from '../lib/auth';
import { decodeJwtPayload, saveSession, type Rol, type Session } from '../lib/token';

/**
 * Retorno del login OAuth2 del backend: `{FRONTEND_URL}/auth/callback?token=<jwt>`.
 *
 * Guarda el token exactamente donde lo guarda el login normal, lo limpia de la
 * URL (con una redirección que reemplaza la entrada del historial) y entra al
 * panel que corresponde al rol.
 */
export function AuthCallback() {
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const payload = token ? decodeJwtPayload(token) : null;

    const rol: Rol | null =
      payload?.rol === 'ADMINISTRADOR' || payload?.rol === 'JUGADOR' ? payload.rol : null;

    if (!token || !payload?.sub || !rol) {
      window.location.replace('/login');
      return;
    }

    const session: Session = {
      token,
      username: payload.sub,
      rol,
      expiraEn: typeof payload.exp === 'number' ? payload.exp * 1000 : Date.now() + 3_600_000,
    };
    saveSession(session);

    // Recarga completa para que el AuthProvider relea la sesión desde storage.
    window.location.replace(inicioDeSesion(rol));
  }, [searchParams]);

  return (
    <div className="landing grid min-h-screen place-items-center bg-paper px-6 text-center">
      <div>
        <span
          className="mx-auto mb-6 grid size-9 place-items-center rounded-[2px] bg-magenta font-poster text-base font-extrabold text-chalk"
          aria-hidden="true"
        >
          FG
        </span>
        <p className="font-poster text-[clamp(38px,6vw,52px)] leading-[0.9] font-extrabold text-pitch uppercase">
          Iniciando sesión…
        </p>
        <p className="mt-3 text-sm text-pitch/70">
          Si no te redirige automáticamente,{' '}
          <Link
            to="/login"
            className="font-bold text-magenta underline decoration-magenta/30 decoration-2 underline-offset-[5px] hover:text-pitch"
          >
            vuelve al login
          </Link>
          .
        </p>
      </div>
    </div>
  );
}
