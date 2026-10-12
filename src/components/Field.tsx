import type { InputHTMLAttributes, ReactNode } from 'react';

type FieldProps = {
  id: string;
  label: string;
  icon: ReactNode;
  error?: string;
  hint?: string;
  /** Elemento a la derecha del input (toggle de contraseña, etc.). */
  addon?: ReactNode;
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
  className = '',
  ...inputProps
}: FieldProps) {
  const errorId = `${id}-error`;
  const hintId = `${id}-hint`;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold text-white/85">
        {label}
      </label>

      <div className="relative">
        <span
          className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-ink-3 transition-colors duration-300 peer-focus:text-pink"
          aria-hidden="true"
        >
          {icon}
        </span>

        <input
          id={id}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : hint ? hintId : undefined}
          className={`peer h-[54px] w-full rounded-xl border bg-surface pr-14 pl-12 text-[15px] text-white
            transition duration-300 ease-out placeholder:text-ink-3
            focus:outline-none ${
              error
                ? 'border-red-400/70 focus:border-red-400 focus:shadow-[0_0_0_3px_rgba(248,113,113,0.18)]'
                : 'border-line focus:border-magenta focus:shadow-[0_0_0_3px_rgba(194,16,160,0.22)]'
            } ${className}`.trim()}
          {...inputProps}
        />

        {addon ? <span className="absolute top-1/2 right-2 -translate-y-1/2">{addon}</span> : null}
      </div>

      {error ? (
        <p id={errorId} className="mt-2 text-xs text-red-300">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="mt-2 text-xs text-ink-3">
          {hint}
        </p>
      ) : null}
    </div>
  );
}