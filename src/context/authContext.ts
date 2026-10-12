import { createContext } from 'react';
import type {
  ActualizarPerfilRequest,
  CambiarContrasenaRequest,
  LoginRequest,
  RegistroRequest,
  Usuario,
} from '../lib/auth';
import type { Session } from '../lib/token';

/**
 * Estado global de sesión.
 *
 * El token lo emite el backend; aquí solo se guarda, se hidrata con
 * `GET /auth/me` y se descarta cuando caduca o el backend responde 401.
 */
export type AuthState = {
  /** Datos del token (null si no hay sesión). */
  session: Session | null;
  /** Perfil completo, disponible tras hidratar con `/auth/me`. */
  usuario: Usuario | null;
  /** `true` mientras hay un inicio de sesión o un registro en vuelo. */
  pending: boolean;
  /** `true` mientras se consulta `/auth/me` al arrancar. */
  hidratando: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginRequest) => Promise<Session>;
  /** Auto-registro: crea la cuenta como JUGADOR y guarda la sesión. */
  registrar: (datos: RegistroRequest) => Promise<Session>;
  /** Edita username/email del propio perfil y renueva el token. */
  actualizarPerfil: (datos: ActualizarPerfilRequest) => Promise<void>;
  /** Sube la foto de perfil. */
  subirAvatar: (archivo: File) => Promise<void>;
  /** Cambia la contraseña del propio usuario. */
  cambiarContrasena: (datos: CambiarContrasenaRequest) => Promise<void>;
  logout: () => void;
};

export const AuthContext = createContext<AuthState | null>(null);
