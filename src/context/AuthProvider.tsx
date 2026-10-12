import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  actualizarPerfilRequest,
  cambiarContrasenaRequest,
  fetchCurrentUser,
  loginRequest,
  registroRequest,
  subirAvatarRequest,
  type ActualizarPerfilRequest,
  type CambiarContrasenaRequest,
  type LoginRequest,
  type RegistroRequest,
  type Usuario,
} from '../lib/auth';
import { ApiError } from '../lib/api';
import { clearSession, isExpired, msRestantes, readSession, type Session } from '../lib/token';
import { AuthContext } from './authContext';

/**
 * Proveedor de sesión.
 *
 * Ciclo de vida:
 *  1. Lee el token guardado al arrancar (y lo descarta si ya expiró).
 *  2. Hidrata el perfil con `GET /auth/me`.
 *  3. Cierra la sesión sola cuando vence `exp` del JWT.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  // Un token caducado no debe sobrevivir al arranque.
  const [sessionInicial] = useState<Session | null>(() => {
    const guardada = readSession();
    if (guardada && isExpired(guardada)) {
      clearSession();
      return null;
    }
    return guardada;
  });

  const [session, setSession] = useState<Session | null>(sessionInicial);
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [pending, setPending] = useState(false);
  const [hidratando, setHidratando] = useState(sessionInicial !== null);

  /* ---------- Hidratar el perfil ---------- */
  useEffect(() => {
    if (!session) return;

    let cancelado = false;

    fetchCurrentUser()
      .then((perfil) => {
        if (!cancelado) setUsuario(perfil);
      })
      .catch((error: unknown) => {
        if (cancelado) return;
        // Token rechazado (caducado, revocado o secreto rotado) → cerrar sesión.
        if (error instanceof ApiError && error.esNoAutorizado) {
          clearSession();
          setSession(null);
          setUsuario(null);
        }
      })
      .finally(() => {
        if (!cancelado) setHidratando(false);
      });

    return () => {
      cancelado = true;
    };
  }, [session]);

  /* ---------- Cierre automático al expirar ---------- */
  useEffect(() => {
    if (!session) return;

    const timer = setTimeout(() => {
      clearSession();
      setSession(null);
      setUsuario(null);
    }, msRestantes(session));

    return () => clearTimeout(timer);
  }, [session]);

  /* ---------- Acciones ---------- */
  const login = useCallback(async (credentials: LoginRequest) => {
    setPending(true);
    try {
      const nueva = await loginRequest(credentials);
      setSession(nueva);
      return nueva;
    } finally {
      setPending(false);
    }
  }, []);

  const registrar = useCallback(async (datos: RegistroRequest) => {
    setPending(true);
    try {
      const nueva = await registroRequest(datos);
      setSession(nueva);
      return nueva;
    } finally {
      setPending(false);
    }
  }, []);

  const actualizarPerfil = useCallback(async (datos: ActualizarPerfilRequest) => {
    const nueva = await actualizarPerfilRequest(datos);
    setSession(nueva);
    setUsuario(await fetchCurrentUser());
  }, []);

  const subirAvatar = useCallback(
    async (archivo: File) => {
      if (!usuario) throw new Error('No hay sesión activa.');
      setUsuario(await subirAvatarRequest(usuario.id, archivo));
    },
    [usuario]
  );

  const cambiarContrasena = useCallback(async (datos: CambiarContrasenaRequest) => {
    await cambiarContrasenaRequest(datos);
  }, []);

  const logout = useCallback(() => {
    clearSession();
    setSession(null);
    setUsuario(null);
  }, []);

  const value = useMemo(
    () => ({
      session,
      usuario,
      pending,
      hidratando,
      isAuthenticated: session !== null,
      login,
      registrar,
      actualizarPerfil,
      subirAvatar,
      cambiarContrasena,
      logout,
    }),
    [
      session,
      usuario,
      pending,
      hidratando,
      login,
      registrar,
      actualizarPerfil,
      subirAvatar,
      cambiarContrasena,
      logout,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
