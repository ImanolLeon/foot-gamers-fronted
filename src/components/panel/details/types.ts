/** Estado devuelto por `useRemote`, usado por las secciones de detalle. */
export type Remote<T> = {
  data?: T;
  error?: string;
  loading: boolean;
};
