import { useEffect, useId, useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Field } from './Field';
import {
  AlertCircle,
  Close,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Spinner,
  User,
} from './Icons';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../lib/api';

/* ============================================================
   VALIDACIÓN (misma que el login + email y confirmación)
   ============================================================ */

type FormValues = {
  username: string;
  email: string;
  contrasena: string;
  confirmar: string;
};

type Campo = keyof FormValues;
type FieldErrors = Partial<Record<Campo, string>>;

const ORDEN_CAMPOS: Campo[] = ['username', 'email', 'contrasena', 'confirmar'];

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.username.trim()) {
    errors.username = 'El usuario es obligatorio.';
  } else if (!/^[a-zA-Z0-9._-]{3,}$/.test(values.username.trim())) {
    errors.username = 'Solo letras, números, punto, guion y guion bajo (mínimo 3).';
  }

  if (!values.email.trim()) {
    errors.email = 'El correo es obligatorio.';
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email.trim())) {
    errors.email = 'Escribe un correo válido.';
  }

  if (!values.contrasena) {
    errors.contrasena = 'La contraseña es obligatoria.';
  } else if (values.contrasena.length < 6) {
    errors.contrasena = 'La contraseña debe tener al menos 6 caracteres.';
  }

  if (values.confirmar !== values.contrasena) {
    errors.confirmar = 'Las contraseñas no coinciden.';
  }

  return errors;
}

/* ============================================================
   MODAL
   ============================================================ */

const VALORES_INICIALES: FormValues = {
  username: '',
  email: '',
  contrasena: '',
  confirmar: '',
};

/**
 * El modal solo renderiza su contenido cuando está abierto. Así el formulario
 * se monta limpio en cada apertura (sin resetear estado desde un efecto).
 */
export function RegistroModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return <ContenidoModal onClose={onClose} />;
}

function ContenidoModal({ onClose }: { onClose: () => void }) {
  const uid = useId();
  const navigate = useNavigate();
  const { registrar, pending } = useAuth();

  const [values, setValues] = useState<FormValues>(VALORES_INICIALES);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  // Enfoca el primer campo al montar el modal.
  useEffect(() => {
    const timer = setTimeout(() => document.getElementById(`${uid}-username`)?.focus(), 30);
    return () => clearTimeout(timer);
  }, [uid]);

  // Escape para cerrar + bloqueo del scroll de fondo mientras está abierto.
  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    const overflowPrevio = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflowPrevio;
    };
  }, [onClose]);

  const update = <K extends Campo>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: undefined }));
    setFormError(null);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const found = validate(values);
    setErrors(found);
    const primerError = ORDEN_CAMPOS.find((campo) => found[campo]);
    if (primerError) {
      document.getElementById(`${uid}-${primerError}`)?.focus();
      return;
    }

    try {
      // El backend crea el usuario como JUGADOR y devuelve el token.
      await registrar({
        username: values.username.trim(),
        email: values.email.trim(),
        contrasena: values.contrasena,
      });
      onClose();
      navigate('/jugador', { replace: true });
    } catch (error) {
      if (error instanceof ApiError) {
        setFormError(error.message);
        if (Object.keys(error.errores).length > 0) setErrors({ ...error.errores });
      } else {
        setFormError('No se pudo crear la cuenta.');
      }
    }
  };

  const togglePassword = (
    <button
      type="button"
      onClick={() => setShowPassword((v) => !v)}
      aria-pressed={showPassword}
      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      className="grid size-10 place-items-center rounded-[2px] text-pitch/45 transition-colors duration-200 hover:text-magenta"
    >
      {showPassword ? <EyeOff className="size-[19px]" /> : <Eye className="size-[19px]" />}
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-200 grid place-items-center overflow-y-auto bg-pitch-deep/80 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-titulo`}
        className="relative max-h-[92vh] w-full max-w-[460px] overflow-y-auto rounded-[3px] border border-pitch/25 bg-paper p-6 text-pitch shadow-[0_24px_70px_-24px_rgba(5,32,24,0.6)] sm:p-8"
      >
        <span className="absolute inset-x-0 top-0 h-1 bg-magenta" aria-hidden="true" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-5 right-4 grid size-9 place-items-center rounded-[2px] border border-pitch/20 text-pitch/50 transition-colors duration-200 hover:border-magenta hover:text-magenta"
        >
          <Close className="size-5" />
        </button>

        <p className="eyebrow">Únete a la liga</p>
        <h2
          id={`${uid}-titulo`}
          className="font-poster text-[clamp(38px,6vw,46px)] leading-[0.88] font-extrabold text-pitch uppercase"
        >
          Crear cuenta
        </h2>
        <p className="mt-3 text-sm leading-[1.6] text-pitch/70">
          Crea tu perfil de jugador y empieza a competir en los torneos.
        </p>

        <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4">
          {formError ? (
            <div
              role="alert"
              className="flex items-start gap-2.5 border-l-2 border-red-700 bg-red-700/5 px-4 py-3 text-sm text-red-800"
            >
              <AlertCircle className="mt-0.5 size-4 flex-none" />
              {formError}
            </div>
          ) : null}

          <Field
            id={`${uid}-username`}
            label="Usuario"
            type="text"
            autoComplete="username"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="tu_usuario"
            icon={<User className="size-[19px]" />}
            value={values.username}
            onChange={(e) => update('username', e.target.value)}
            error={errors.username}
            disabled={pending}
            tone="light"
          />

          <Field
            id={`${uid}-email`}
            label="Correo electrónico"
            type="email"
            autoComplete="email"
            autoCapitalize="none"
            spellCheck={false}
            placeholder="tucorreo@ejemplo.com"
            icon={<Mail className="size-[19px]" />}
            value={values.email}
            onChange={(e) => update('email', e.target.value)}
            error={errors.email}
            disabled={pending}
            tone="light"
          />

          <Field
            id={`${uid}-contrasena`}
            label="Contraseña"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="Mínimo 6 caracteres"
            icon={<Lock className="size-[19px]" />}
            value={values.contrasena}
            onChange={(e) => update('contrasena', e.target.value)}
            error={errors.contrasena}
            disabled={pending}
            tone="light"
            addon={togglePassword}
          />

          <Field
            id={`${uid}-confirmar`}
            label="Repite la contraseña"
            type={showPassword ? 'text' : 'password'}
            autoComplete="new-password"
            placeholder="••••••••"
            icon={<Lock className="size-[19px]" />}
            value={values.confirmar}
            onChange={(e) => update('confirmar', e.target.value)}
            error={errors.confirmar}
            disabled={pending}
            tone="light"
          />

          <div className="mt-1 border-t border-dashed border-pitch/20" aria-hidden="true" />

          <button
            type="submit"
            disabled={pending}
            className="l-btn l-btn-primary h-[52px] w-full text-base"
          >
            {pending ? (
              <>
                <Spinner className="size-4.5 animate-spin" />
                Creando cuenta…
              </>
            ) : (
              'Crear cuenta'
            )}
          </button>
        </form>

        <div className="mt-5 border-t border-pitch/15 pt-5 text-center">
          <p className="text-sm text-pitch/70">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              onClick={onClose}
              className="font-bold text-magenta underline decoration-magenta/30 decoration-2 underline-offset-[5px] transition-colors duration-200 hover:text-pitch hover:decoration-pitch"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
