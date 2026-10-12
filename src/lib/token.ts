/**
 * Almacenamiento y decodificación del token JWT.
 *
 * El token lo firma el backend (`JwtService`) con los claims:
 *   sub = username, rol = ADMINISTRADOR | JUGADOR, iat, exp
 * Aquí solo se LEE el payload para conocer la expiración;
 * la verificación criptográfica la hace Spring Security.
 */

export type Rol = 'ADMINISTRADOR' | 'JUGADOR';

export type Session = {
  token: string;
  username: string;
  rol: Rol;
  /** Epoch (ms) en el que expira el token. */
  expiraEn: number;
};

const STORAGE_KEY = 'fg:session';

/* ============================================================
   PERSISTENCIA
   ============================================================ */

export function readSession(): Session | null {
  const raw = localStorage.getItem(STORAGE_KEY) ?? sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Session;
  } catch {
    return null;
  }
}

export function saveSession(session: Session) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
}

export function clearSession() {
  localStorage.removeItem(STORAGE_KEY);
  sessionStorage.removeItem(STORAGE_KEY);
}

export function getToken(): string | null {
  return readSession()?.token ?? null;
}

/* ============================================================
   JWT
   ============================================================ */

/** Lee el claim `exp` del payload (epoch en segundos → ms). */
export function decodeJwtExp(token: string): number | null {
  const payload = decodeJwtPayload(token);
  return typeof payload?.exp === 'number' ? payload.exp * 1000 : null;
}

/** Payload útil del JWT (se lee sin verificar la firma, que valida el backend). */
export type JwtPayload = {
  sub?: string;
  rol?: Rol;
  exp?: number;
};

/** Decodifica el payload del JWT. Devuelve `null` si el token está mal formado. */
export function decodeJwtPayload(token: string): JwtPayload | null {
  try {
    const segment = token.split('.')[1];
    if (!segment) return null;

    const base64 = segment.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, '=');
    return JSON.parse(atob(padded)) as JwtPayload;
  } catch {
    return null;
  }
}

/** Margen de seguridad para no usar un token a punto de caducar. */
export function isExpired(session: Session, margenMs = 5000): boolean {
  return Date.now() >= session.expiraEn - margenMs;
}

export function msRestantes(session: Session): number {
  return Math.max(session.expiraEn - Date.now(), 0);
}