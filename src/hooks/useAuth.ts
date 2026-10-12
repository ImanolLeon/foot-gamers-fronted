import { use } from 'react';
import { AuthContext, type AuthState } from '../context/authContext';

/** Acceso al estado de sesión. Lanza si se usa fuera de `<AuthProvider>`. */
export function useAuth(): AuthState {
  const context = use(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de <AuthProvider>.');
  }
  return context;
}