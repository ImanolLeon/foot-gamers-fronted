import { getToken } from './token';

/**
 * Cliente HTTP del backend FootGamer's.
 * - Inyecta `Authorization: Bearer <token>` automáticamente.
 * - Normaliza los errores del backend (RFC 7807 ProblemDetail y `{"mensaje":...}`).
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * URL del avatar subido por el usuario. `version` (el nombre del archivo que
 * guarda el backend) cambia en cada subida, así el navegador no sirve la caché.
 */
export function urlImagenUsuario(id: number, version?: string | null): string {
  const base = `${API_BASE_URL}/usuarios/${id}/imagen`;
  return version ? `${base}?v=${encodeURIComponent(version)}` : base;
}

/** Formato de error que devuelve el backend (ProblemDetail + `mensaje` legacy). */
type ApiErrorBody = {
  title?: string;
  status?: number;
  detail?: string;
  mensaje?: string;
  errores?: Record<string, string>;
};

export class ApiError extends Error {
  /** Código HTTP. `0` significa que no hubo respuesta (servidor caído). */
  readonly status: number;
  /** Errores por campo que devuelve `MethodArgumentNotValidException`. */
  readonly errores: Record<string, string>;

  constructor(message: string, status: number, errores: Record<string, string> = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errores = errores;
  }

  get esNoAutorizado() {
    return this.status === 401;
  }
}

export async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const headers = new Headers(init.headers);
  // `FormData` fija su propio Content-Type (con el boundary): no lo pisamos.
  if (init.body && !(init.body instanceof FormData) && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const token = getToken();
  if (token) headers.set('Authorization', `Bearer ${token}`);

  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, { ...init, headers });
  } catch {
    throw new ApiError('No se pudo conectar con el servidor. ¿Está el backend encendido?', 0);
  }

  if (response.status === 204) return undefined as T;

  // El proxy de Vite devuelve 502/503/504 cuando Spring Boot no está levantado.
  if (response.status >= 502) {
    throw new ApiError(
      'El servidor no está disponible. Levanta el backend (Spring Boot) e inténtalo de nuevo.',
      response.status
    );
  }

  const body = (await response.json().catch(() => null)) as ApiErrorBody | null;

  if (!response.ok) {
    const mensaje =
      body?.detail ??
      body?.mensaje ??
      body?.title ??
      `Error ${response.status} al llamar a ${path}`;
    throw new ApiError(mensaje, response.status, body?.errores ?? {});
  }

  return body as T;
}
