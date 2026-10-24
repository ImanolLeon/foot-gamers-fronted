import { useEffect, useId, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Field } from '../components/Field';
import { BrandWaves } from '../components/BrandWaves';
import { RegistroModal } from '../components/RegistroModal';
import {
  AlertCircle,
  ArrowLeft,
  Crown,
  Discord,
  Eye,
  EyeOff,
  Gamepad,
  Google,
  Lock,
  ShieldCheck,
  Spinner,
  User,
} from '../components/Icons';
import { useAuth } from '../hooks/useAuth';
import { ApiError } from '../lib/api';
import {  inicioDeSesion } from '../lib/auth';

/* ============================================================
   VALIDACIÓN
   ============================================================ */

type FormValues = {
  username: string;
  contrasena: string;
  remember: boolean;
};

type FieldErrors = Partial<Record<'username' | 'contrasena', string>>;

function validate(values: FormValues): FieldErrors {
  const errors: FieldErrors = {};

  if (!values.username.trim()) {
    errors.username = 'El usuario es obligatorio.';
  } else if (!/^[a-zA-Z0-9._-]{3,}$/.test(values.username.trim())) {
    errors.username = 'El usuario solo admite letras, números, punto, guion y guion bajo.';
  }

  if (!values.contrasena) {
    errors.contrasena = 'La contraseña es obligatoria.';
  } else if (values.contrasena.length < 6) {
    errors.contrasena = 'La contraseña debe tener al menos 6 caracteres.';
  }

  return errors;
}

/* ============================================================
   PÁGINA
   ============================================================ */

export function Login() {
  const uid = useId();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { login, pending } = useAuth();

  const apiUrl = import.meta.env.VITE_API_URL || '/api';

  const [values, setValues] = useState<FormValues>({
    username: '',
    contrasena: '',
    remember: true,
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [registroAbierto, setRegistroAbierto] = useState(false);

  // El backend redirige aquí con ?error=oauth cuando el proveedor falla.
  const oauthError = searchParams.get('error') === 'oauth';

  // Título de la pestaña + guarda contra doble envío
  useEffect(() => {
    document.title = 'Iniciar Sesión — FOOT GAMER’S';
    return () => {
      document.title = 'FOOT GAMER’S — Comunidad de jugadores de PES';
    };
  }, []);

  const iniciarOAuth = (proveedor: 'google' | 'discord') => {
    setNotice(null);
    setFormError(null);
    window.location.href = `${apiUrl}/oauth2/authorization/${proveedor}`;
  };

  const update = <K extends keyof FormValues>(key: K, value: FormValues[K]) => {
    setValues((prev) => ({ ...prev, [key]: value }));
    if (key === 'username') setErrors((p) => ({ ...p, username: undefined }));
    if (key === 'contrasena') setErrors((p) => ({ ...p, contrasena: undefined }));
    setFormError(null);
    if (oauthError) setSearchParams({}, { replace: true });
  };

  const formErrorAMostrar =
    formError ??
    (oauthError
      ? 'No pudimos completar el inicio de sesión con el proveedor. Inténtalo de nuevo.'
      : null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setNotice(null);

    const found = validate(values);
    setErrors(found);
    if (found.username || found.contrasena) {
      document.getElementById(found.username ? `${uid}-username` : `${uid}-contrasena`)?.focus();
      return;
    }

    try {
      const sesion = await login({
        username: values.username.trim(),
        contrasena: values.contrasena,
      });
      // Los administradores entran directo a su panel.
      navigate(inicioDeSesion(sesion.rol), { replace: true });
    } catch (error) {
      // El backend responde ProblemDetail (RFC 7807) en 401/400.
      if (error instanceof ApiError) {
        setFormError(error.message);
        if (Object.keys(error.errores).length > 0) setErrors({ ...error.errores });
      } else {
        setFormError('No se pudo iniciar sesión.');
      }
    }
  };

  

  return (
    <div className="grid min-h-screen bg-bg lg:grid-cols-2">
      {/* ============================================================
          PANEL DE MARCA
      ============================================================ */}
      <aside className="relative hidden overflow-hidden bg-gradient-to-br from-[#1a0526] via-[#2e0a46] to-[#5a1180] p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
        <BrandWaves className="absolute -top-[280px] -right-[220px] size-[900px] opacity-85" />
        <div
          className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg/60 to-transparent"
          aria-hidden="true"
        />

        <Link
          to="/"
          className="relative inline-flex items-center gap-2.5 self-start transition duration-300 ease-out hover:opacity-80"
          aria-label="FOOT GAMER'S, volver al inicio"
        >
          <span
            className="grid size-9 place-items-center rounded-[10px] bg-gradient-to-br from-pink via-magenta to-purple shadow-[0_0_18px_rgba(194,16,160,0.55)]"
            aria-hidden="true"
          >
            <Crown className="size-5 text-white" />
          </span>
          <span className="font-display text-lg font-black tracking-[0.1em] uppercase">
            Foot Gamer&apos;s
          </span>
        </Link>

        <div className="relative max-w-md">
          <p className="eyebrow">Vuelve al campo</p>
          <h2 className="font-display text-[clamp(34px,4vw,52px)] leading-[1.02] font-black">
            <span className="text-gradient-title block">Tu equipo</span>
            <span className="text-gradient-title block">te está esperando</span>
          </h2>
          <p className="mt-6 text-base leading-relaxed text-white/70">
            Entra para disputar la próxima jornada, seguir tu ranking y defender tu puesto en la
            tabla de campeones.
          </p>

          <dl className="mt-10 flex gap-8">
            {[
              { value: '50M+', label: 'Jugadores' },
              { value: '200+', label: 'Equipos' },
              { value: '4K', label: 'Resolución' },
            ].map((stat, i) => (
              <div key={stat.label} className={i > 0 ? 'border-l border-white/16 pl-8' : ''}>
                <dd className="font-display text-[28px] leading-tight font-extrabold text-pink drop-shadow-[0_0_18px_rgba(224,112,208,0.5)]">
                  {stat.value}
                </dd>
                <dt className="mt-1 text-[11px] font-semibold tracking-[0.18em] text-ink-3 uppercase">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <p className="relative flex items-center gap-2 text-xs text-ink-3">
          <ShieldCheck className="size-3.5" />
          Sesión protegida con token JWT
        </p>
      </aside>

      {/* ============================================================
          FORMULARIO
      ============================================================ */}
      <main className="flex items-center justify-center px-5 py-14 sm:px-8">
        <div className="w-full max-w-[440px]">
          {/* Marca en móvil */}
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-2.5 lg:hidden"
            aria-label="FOOT GAMER'S, volver al inicio"
          >
            <span
              className="grid size-9 place-items-center rounded-[10px] bg-gradient-to-br from-pink via-magenta to-purple shadow-[0_0_18px_rgba(194,16,160,0.55)]"
              aria-hidden="true"
            >
              <Crown className="size-5 text-white" />
            </span>
            <span className="font-display text-lg font-black tracking-[0.1em] uppercase">
              Foot Gamer&apos;s
            </span>
          </Link>

          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-ink-2 transition duration-300 ease-out hover:text-pink"
          >
            <ArrowLeft className="size-4" />
            Volver al inicio
          </Link>

          <h1 className="font-display text-[clamp(30px,5vw,38px)] leading-[1.08] font-black">
            Iniciar Sesión
          </h1>
          <p className="mt-2.5 text-[15px] text-ink-2">
            Accede a tu perfil para jugar, competir y subir de rango.
          </p>

          {/* Login social */}
          <div className="mt-8 grid gap-2.5">
            <button
              type="button"
              onClick={() => iniciarOAuth('discord')}
              className="btn btn-ghost w-full"
            >
              <Discord className="size-[18px]" />
              Continuar con Discord
            </button>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => iniciarOAuth('google')}
                className="btn btn-ghost px-3"
              >
                <Google className="size-[18px]" />
                Google
              </button>
              <button
                type="button"
                onClick={() => setNotice('El acceso con Steam llegará muy pronto.')}
                className="btn btn-ghost px-3"
              >
                <Gamepad className="size-[18px]" />
                Steam
              </button>
            </div>
          </div>

          {/* Separador */}
          <div className="my-7 flex items-center gap-4">
            <span className="h-px flex-1 bg-white/10" />
            <span className="text-xs tracking-[0.16em] text-ink-3 uppercase">o con tu cuenta</span>
            <span className="h-px flex-1 bg-white/10" />
          </div>

          {notice ? (
            <p
              role="status"
              className="mb-5 flex items-start gap-2.5 rounded-xl border border-line bg-magenta/8 px-4 py-3 text-sm text-pink"
            >
              <AlertCircle className="mt-0.5 size-4 flex-none" />
              {notice}
            </p>
          ) : null}

          {/* Formulario */}
          <form onSubmit={handleSubmit} noValidate className="grid gap-5">
            {formErrorAMostrar ? (
              <div
                role="alert"
                className="flex items-start gap-2.5 rounded-xl border border-red-400/35 bg-red-500/10 px-4 py-3 text-sm text-red-200"
              >
                <AlertCircle className="mt-0.5 size-4 flex-none" />
                {formErrorAMostrar}
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
            />

            <Field
              id={`${uid}-contrasena`}
              label="Contraseña"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              placeholder="••••••••"
              icon={<Lock className="size-[19px]" />}
              value={values.contrasena}
              onChange={(e) => update('contrasena', e.target.value)}
              error={errors.contrasena}
              disabled={pending}
              addon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="grid size-10 place-items-center rounded-lg text-ink-3 transition duration-300 ease-out hover:text-pink"
                >
                  {showPassword ? <EyeOff className="size-[19px]" /> : <Eye className="size-[19px]" />}
                </button>
              }
            />

            {/* Opciones */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-ink-2 select-none">
                <input
                  type="checkbox"
                  checked={values.remember}
                  onChange={(e) => update('remember', e.target.checked)}
                  disabled={pending}
                  className="size-[18px] cursor-pointer appearance-none rounded-md border border-line bg-surface transition duration-300 ease-out checked:border-magenta checked:bg-magenta hover:border-magenta"
                />
                Recordarme
              </label>

              <button
                type="button"
                onClick={() => setNotice('El enlace de recuperación se enviará por correo.')}
                className="text-sm font-semibold text-pink transition duration-300 ease-out hover:text-magenta"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button type="submit" disabled={pending} className="btn btn-primary btn-lg mt-1 w-full">
              {pending ? (
                <>
                  <Spinner className="size-4.5 animate-spin" />
                  Iniciando sesión…
                </>
              ) : (
                'Iniciar Sesión'
              )}
            </button>
          </form>

          {/* Credenciales del usuario semilla del backend */}
          

          <p className="mt-7 text-center text-sm text-ink-2">
            ¿No tienes cuenta?{' '}
            <button
              type="button"
              onClick={() => setRegistroAbierto(true)}
              className="font-bold text-pink transition duration-300 ease-out hover:text-magenta"
            >
              Crea la tuya gratis
            </button>
          </p>

          <p className="mt-6 text-center text-xs leading-relaxed text-ink-3">
            Al continuar aceptas nuestros{' '}
            <Link to="/" className="underline underline-offset-2 transition hover:text-pink">
              Términos
            </Link>{' '}
            y{' '}
            <Link to="/" className="underline underline-offset-2 transition hover:text-pink">
              Política de Privacidad
            </Link>
            .
          </p>
        </div>
      </main>

      <RegistroModal open={registroAbierto} onClose={() => setRegistroAbierto(false)} />
    </div>
  );
}