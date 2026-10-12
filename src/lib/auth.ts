import { ApiError, request } from './api';
import { decodeJwtExp, saveSession, type Rol, type Session } from './token';

/**
 * Endpoints de autenticación del backend.
 *   POST /auth/login    { username, contrasena }        → { token, username, rol, expiraEnMs }
 *   POST /auth/register { username, email, contrasena } → idem (siempre crea JUGADOR)
 *   GET  /auth/me                                       → UsuarioResponseDto
 */

/* ---------- DTOs ---------- */

export type LoginRequest = {
  username: string;
  contrasena: string;
};

export type RegistroRequest = {
  username: string;
  email: string;
  contrasena: string;
};

type LoginResponse = {
  token: string;
  username: string;
  rol: Rol;
  expiraEnMs: number;
};

/** Equivale a `UsuarioResponseDto` del backend. */
export type Usuario = {
  id: number;
  username: string;
  email: string;
  rol: Rol;
  imagen: string | null;
  /** Avatar remoto (solo cuentas OAuth: Google/Discord). */
  avatarUrl: string | null;
  /** "local" | "google" | "discord". */
  provider: string;
};

/** Usuario de ejemplo que crea `DataInitializer` al arrancar el backend. */
export const USUARIO_DEV = { username: 'imanol', contrasena: '123456' };

/** Ruta de inicio según el rol: cada uno entra a su propio panel. */
export function inicioDeSesion(rol: Rol | undefined): string {
  if (rol === 'ADMINISTRADOR') return '/admin';
  if (rol === 'JUGADOR') return '/jugador';
  return '/';
}

/* ---------- Operaciones ---------- */

/** Construye y persiste la sesión a partir de la respuesta del backend. */
function construirSesion(data: LoginResponse): Session {
  // Preferimos el `exp` real del JWT; `expiraEnMs` es el plan B.
  const expiraEn = decodeJwtExp(data.token) ?? Date.now() + data.expiraEnMs;

  const session: Session = {
    token: data.token,
    username: data.username,
    rol: data.rol,
    expiraEn,
  };

  saveSession(session);
  return session;
}

export async function loginRequest(credentials: LoginRequest): Promise<Session> {
  const data = await request<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials),
  });
  return construirSesion(data);
}

/** Alta de cuenta local: el backend siempre crea un JUGADOR y devuelve el token. */
export async function registroRequest(datos: RegistroRequest): Promise<Session> {
  const data = await request<LoginResponse>('/auth/register', {
    method: 'POST',
    body: JSON.stringify(datos),
  });
  return construirSesion(data);
}

/** Perfil completo del usuario autenticado (requiere token válido). */
export function fetchCurrentUser(): Promise<Usuario> {
  return request<Usuario>('/auth/me');
}

/* ---------- Edición del propio perfil ---------- */

export type ActualizarPerfilRequest = {
  username: string;
  email: string;
};

export type CambiarContrasenaRequest = {
  /** Contraseña actual; vacía u omitida en cuentas OAuth sin contraseña. */
  actual?: string;
  nueva: string;
};

/** Edita username/email y devuelve la sesión con el token renovado. */
export async function actualizarPerfilRequest(datos: ActualizarPerfilRequest): Promise<Session> {
  const data = await request<LoginResponse>('/auth/me', {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
  return construirSesion(data);
}

/** Cambia la contraseña del propio usuario. */
export function cambiarContrasenaRequest(datos: CambiarContrasenaRequest): Promise<void> {
  return request<void>('/auth/me/contrasena', {
    method: 'PUT',
    body: JSON.stringify(datos),
  });
}

/** Sube la foto de perfil y devuelve el usuario actualizado. */
export function subirAvatarRequest(id: number, archivo: File): Promise<Usuario> {
  const form = new FormData();
  form.append('archivo', archivo);
  return request<Usuario>(`/usuarios/${id}/imagen`, { method: 'PUT', body: form });
}

/** Traduce un error del backend al mensaje que verá el usuario. */
export function mensajeDeError(error: unknown): string {
  if (error instanceof ApiError) return error.message;
  if (error instanceof Error) return error.message;
  return 'Ha ocurrido un error inesperado.';
}
