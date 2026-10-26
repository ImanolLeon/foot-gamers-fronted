import type { InputHTMLAttributes, ReactNode } from 'react';

type FieldProps = {
  id: string;
  label: string;
  icon: ReactNode;
  error?: string;
  hint?: string;
  /** Elemento a la derecha del input (toggle de contraseña, etc.). */
  addon?: ReactNode;
  /**
   * Paleta del campo: `dark` para los paneles de la app y `light` para las
   * superficies de papel de la landing (login y registro).
   */
  tone?: 'dark' | 'light';
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'id' | 'aria-describedby'>;

/**
 * Campo de formulario con etiqueta, icono, mensaje de error y soporte
 * para `aria-invalid` / `aria-describedby`.
 */
export function Field({
  id,
  label,
  icon,
  error,
  hint,
  addon,
  tone = 'dark',
  className = '',
  ...inputProps
}: FieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;
  const light = tone === 'light';

  return (
    <div>
      <label
        htmlFor={id}
        className={
          light
            ? 'mb-2 block text-[11px] font-semibold tracking-[0.18em] text-pitch/60 uppercase'
            : 'mb-2 block text-sm font-semibold text-white/85'
        }
      >
        {label}
      </label>

      <div className="relative">
        <span
          className={`pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 transition-colors ${
            light
              ? 'text-pitch/40 duration-200 peer-focus:text-magenta'
              : 'text-ink-3 duration-300 peer-focus:text-pink'
          }`}
          aria-hidden="true"
        >
          {icon}
        </span>

        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`peer h-[54px] w-full border pr-14 pl-12 text-[15px] transition ease-out focus:outline-none ${
            light
              ? `rounded-[2px] bg-chalk text-pitch duration-200 placeholder:text-pitch/35 ${
                  error
                    ? 'border-red-700/60 focus:border-red-700 focus:ring-2 focus:ring-red-700/15'
                    : 'border-pitch/25 focus:border-magenta focus:ring-2 focus:ring-magenta/15'
                }`
              : `rounded-xl bg-surface text-white duration-300 placeholder:text-ink-3 ${
                  error
                    ? 'border-red-400/70 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.18)]'
                    : 'border-line focus:border-magenta focus:shadow-[0_0_0_3px_rgba(194,16,160,0.22)]'
                }`
          } ${className}`.trim()}
          {...inputProps}
        />

        {addon ? <span className="absolute top-1/2 right-2 -translate-y-1/2">{addon}</span> : null}
      </div>

      {error ? (
        <p id={errorId} className={`mt-2 text-xs ${light ? 'text-red-700' : 'text-red-300'}`}>
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className={`mt-2 text-xs ${light ? 'text-pitch/50' : 'text-ink-3'}`}>
          {hint}
        </p>
      ) : null}
    </div>
  );
}