import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type FormEvent,
} from 'react';
import { ApiError, request } from '../../lib/api';
import {
  all,
  label,
  payload,
  normalizePage,
  type FieldSpec,
  type Row,
} from '../../lib/panel';

export function useRemote<T>(path: string | null, revision = 0) {
  const [state, setState] = useState<{
    path: string | null;
    revision: number;
    data?: T;
    error?: string;
  }>({ path: null, revision: -1 });
  useEffect(() => {
    if (!path) return;
    const controller = new AbortController();
    request<T>(path, { signal: controller.signal })
      .then((data) => {
        if (!controller.signal.aborted)
          setState({ path, revision, data: normalizePage(data) });
      })
      .catch((e) => {
        if (!controller.signal.aborted)
          setState({ path, revision, error: explain(e) });
      });
    return () => controller.abort();
  }, [path, revision]);
  const current = state.path === path && state.revision === revision;
  return {
    data: state.path === path ? state.data : undefined,
    error: current ? state.error : undefined,
    loading: !!path && (!current || (!state.data && !state.error)),
  };
}
export function explain(e: unknown) {
  if (e instanceof ApiError)
    return (
      e.message +
      (Object.keys(e.errores).length
        ? ' · ' + Object.values(e.errores).join(' · ')
        : '')
    );
  return e instanceof Error ? e.message : 'No se pudo completar la operación.';
}
export function Notice({
  error,
  children,
}: {
  error?: boolean;
  children: ReactNode;
}) {
  return (
    <div
      role={error ? 'alert' : 'status'}
      className={'live-notice ' + (error ? 'live-error' : '')}
    >
      {children}
    </div>
  );
}
export function Button({
  children,
  onClick,
  disabled = false,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className="live-button"
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
export function Table({
  rows,
  columns,
  actions,
}: {
  rows: Row[];
  columns: [string, string][];
  actions?: (row: Row) => ReactNode;
}) {
  return (
    <div className="live-table-wrap">
      <table className="live-table">
        <thead>
          <tr>
            {columns.map(([k, l]) => (
              <th key={k}>{l}</th>
            ))}
            {actions && <th>Acciones</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={r.id ?? r.jugadorId ?? i}>
              {columns.map(([k]) => (
                <td key={k}>
                  {r[k] == null || r[k] === ''
                    ? '—'
                    : typeof r[k] === 'boolean'
                      ? r[k]
                        ? 'Sí'
                        : 'No'
                      : String(r[k]).replaceAll('_', ' ')}
                </td>
              ))}
              {actions && (
                <td>
                  <div className="live-actions">{actions(r)}</div>
                </td>
              )}
            </tr>
          ))}
          {!rows.length && (
            <tr>
              <td colSpan={columns.length + (actions ? 1 : 0)}>
                No hay registros para mostrar.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
export function Form({
  fields,
  initial = {},
  onSave,
  onCancel,
  submit = 'Guardar',
}: {
  fields: FieldSpec[];
  initial?: Partial<Row>;
  onSave: (body: Record<string, unknown>) => Promise<void>;
  onCancel?: () => void;
  submit?: string;
}) {
  const [values, setValues] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      fields.map((f) => [
        f.key,
        initial[f.key] == null ? '' : String(initial[f.key]),
      ]),
    ),
  );
  const [options, setOptions] = useState<Record<string, Row[]>>({});
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(fields.some((f) => f.source));
  const [optionError, setOptionError] = useState('');
  const lock = useRef(false);
  useEffect(() => {
    const abort = new AbortController();
    const sources = [
      ...new Set(fields.flatMap((f) => (f.source ? [f.source] : []))),
    ];
    Promise.all(
      sources.map(
        async (source) => [source, await all(source, abort.signal)] as const,
      ),
    )
      .then((entries) => {
        if (!abort.signal.aborted) {
          setOptions(Object.fromEntries(entries));
          setLoading(false);
        }
      })
      .catch((e) => {
        if (!abort.signal.aborted) {
          setOptionError(explain(e));
          setLoading(false);
        }
      });
    return () => abort.abort();
  }, [fields]);
  async function save(e: FormEvent) {
    e.preventDefault();
    if (lock.current) return;
    const body = payload(fields, values);
    if (
      body.fechaInicio &&
      body.fechaFin &&
      String(body.fechaFin) < String(body.fechaInicio)
    ) {
      setError('La fecha final no puede ser anterior al inicio.');
      return;
    }

    if (body.tipoPartido === 'TORNEO' && !body.torneoId) {
      setError('Selecciona un torneo.');
      return;
    }

    lock.current = true;
    setBusy(true);
    setError('');

    try {
      await onSave(body);
    } catch (e) {
      setError(explain(e));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return (
    <form className="live-form" onSubmit={save}>
      {loading && <Notice>Cargando opciones…</Notice>}
      {optionError && (
        <Notice error>
          {optionError} Cierra y vuelve a abrir el formulario para reintentar.
        </Notice>
      )}
      {fields.map((f) => (
        <label key={f.key}>
          {f.label}
          {!f.optional && ' *'}
          {f.source || f.options ? (
            <select
              required={!f.optional}
              value={values[f.key]}
              disabled={busy || loading}
              onChange={(e) =>
                setValues({ ...values, [f.key]: e.target.value })
              }
            >
              <option value="">
                {f.optional ? 'Sin asignar' : 'Seleccionar…'}
              </option>
              {f.options?.map((o) => (
                <option key={o} value={o}>
                  {o.replaceAll('_', ' ')}
                </option>
              ))}
              {f.source &&
                options[f.source]?.map((o) => (
                  <option key={o.id} value={o.id}>
                    {label(o)} · #{o.id}
                  </option>
                ))}
            </select>
          ) : (
            <input
              required={!f.optional}
              type={f.type ?? 'text'}
              min={f.min ?? (f.type === 'number' ? 1 : undefined)}
              step={f.type === 'number' ? 1 : undefined}
              maxLength={f.key === 'nombre' ? 120 : undefined}
              autoComplete={f.type === 'password' ? 'new-password' : undefined}
              value={values[f.key]}
              disabled={busy}
              onChange={(e) =>
                setValues({ ...values, [f.key]: e.target.value })
              }
            />
          )}
        </label>
      ))}
      {error && <Notice error>{error}</Notice>}
      <div className="live-actions">
        <button
          className="live-button live-primary"
          disabled={busy || loading || !!optionError}
        >
          {busy ? 'Guardando…' : submit}
        </button>
        {onCancel && (
          <Button disabled={busy} onClick={onCancel}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
}
export function Dialog({
  title,
  children,
  onClose,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    dialog?.showModal();
    return () => dialog?.close();
  }, []);
  return (
    <dialog
      ref={ref}
      className="live-dialog"
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
    >
      <div className="live-heading">
        <h2>{title}</h2>
      </div>
      {children}
    </dialog>
  );
}
export function useMutation(refresh: () => void) {
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const lock = useRef(false);
  async function run(
    action: () => Promise<unknown>,
    success = 'Cambios guardados.',
  ) {
    if (lock.current) return;
    lock.current = true;
    setBusy(true);
    setError('');
    setMessage('');
    try {
      await action();
      setMessage(success);
      refresh();
    } catch (e) {
      setError(explain(e));
    } finally {
      lock.current = false;
      setBusy(false);
    }
  }
  return {
    busy,
    run,
    feedback: (
      <>
        {error && <Notice error>{error}</Notice>}
        {message && <Notice>{message}</Notice>}
      </>
    ),
  };
}
