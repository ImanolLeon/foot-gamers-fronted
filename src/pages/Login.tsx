import { useEffect, useId, useState, type FormEvent } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Field } from '../components/Field';
import { PitchMarkings } from '../components/PitchMarkings';
import { RegistroModal } from '../components/RegistroModal';
import {
  AlertCircle,
  ArrowLeft,
  Discord,
  Eye,
  EyeOff,
  Gamepad,
  Google,
  Lock,
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
    <div className="landing grid min-h-screen bg-paper lg:grid-cols-2">
      {/* ============================================================
          PANEL DE MARCA
      ============================================================ */}
      <aside className="relative hidden overflow-hidden bg-pitch-deep p-12 text-chalk lg:flex lg:flex-col lg:justify-between xl:p-16">
        
        <div className="absolute inset-x-0 top-0 h-1" aria-hidden="true" />

        <Link
          to="/"
          className="relative inline-flex items-center gap-3 self-start transition-colors duration-200 hover:text-magenta"
          aria-label="FOOT GAMER'S, volver al inicio"
        >
          <span
            className="grid size-9 place-items-center rounded-[2px] bg-magenta font-poster text-base font-extrabold text-chalk"
            aria-hidden="true"
          >
            FG
          </span>
          <span className="font-poster text-[26px] leading-none font-extrabold text-chalk uppercase">
            Foot Gamer&apos;s
          </span>
        </Link>

        <div className="relative max-w-md">
         
          <h2 className="font-poster text-[clamp(46px,5vw,74px)] leading-[0.86] font-extrabold uppercase">
            Tu equipo
            <br />
            te está esperando
          </h2>
          <p className="mt-6 max-w-[42ch] text-base leading-[1.7] text-chalk/65">
            Entra para disputar la próxima jornada, seguir tu ranking y defender tu puesto en la
            tabla de campeones.
          </p>

          <dl className="mt-9 flex gap-6  pt-6">
            {[
              { value: '16', label: 'Equipos' },
              { value: '21:00', label: 'Sábados' },
              { value: '+200', label: 'Escudos' },
            ].map((stat, i) => (
              <div key={stat.label} className={i > 0 ? 'pl-6' : ''}>
                <dd className="font-poster text-[32px] leading-none font-extrabold text-magenta">
                  {stat.value}
                </dd>
                <dt className="mt-1.5 text-[10px] font-semibold tracking-[0.2em] text-chalk/45 uppercase">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>

          
        </div>

      </aside>

      {/* ============================================================
          FORMULARIO
      ============================================================ */}
      <main id="contenido" className="flex items-center justify-center px-5 py-12 sm:px-8 lg:py-16">
        <div className="w-full max-w-[440px]">
          {/* Marca en móvil */}
          <Link
            to="/"
            className="mb-10 inline-flex items-center gap-3 lg:hidden"
            aria-label="FOOT GAMER'S, volver al inicio"
          >
            <span
              className="grid size-8 place-items-center rounded-[2px] bg-magenta font-poster text-[15px] font-extrabold text-chalk"
              aria-hidden="true"
            >
              FG
            </span>
            <span className="font-poster text-[25px] leading-none font-extrabold text-pitch uppercase">
              Foot Gamer&apos;s
            </span>
          </Link>

          <Link
            to="/"
            className="mb-8 inline-flex items-center gap-2 text-sm font-semibold text-pitch/70 transition-colors duration-200 hover:text-magenta"
          >
            <ArrowLeft className="size-4" />
            Volver al inicio
          </Link>

          
          <h1 className="font-poster text-[clamp(42px,6vw,58px)] leading-[0.88] font-extrabold text-pitch uppercase">
            Iniciar sesión
          </h1>
          

          {/* Login social */}
          <div className="mt-8 grid gap-2.5">
            <button
              type="button"
              onClick={() => iniciarOAuth('discord')}
              className="l-btn l-btn-outline w-full"
            >
              <Discord className="size-[18px]" />
              Continuar con Discord
            </button>
            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                onClick={() => iniciarOAuth('google')}
                className="l-btn l-btn-outline px-3"
              >
                <Google className="size-[18px]" />
                Google
              </button>
              <button
                type="button"
                onClick={() => setNotice('El acceso con Steam llegará muy pronto.')}
                className="l-btn l-btn-outline px-3"
              >
                <Gamepad className="size-[18px]" />
                Steam
              </button>
            </div>
          </div>

          {/* Separador */}
          <div className="my-7 flex items-center gap-4">
           
          </div>

          {notice ? (
            <p
              role="status"
              className="mb-5 flex items-start gap-2.5 border-l-2 border-magenta bg-magenta/5 px-4 py-3 text-sm text-magenta"
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
                className="flex items-start gap-2.5 border-l-2 border-red-700 bg-red-700/5 px-4 py-3 text-sm text-red-800"
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
              tone="light"
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
              tone="light"
              addon={
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-pressed={showPassword}
                  aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  className="grid size-10 place-items-center rounded-[2px] text-pitch/45 transition-colors duration-200 hover:text-magenta"
                >
                  {showPassword ? <EyeOff className="size-[19px]" /> : <Eye className="size-[19px]" />}
                </button>
              }
            />

            {/* Opciones */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <label className="flex cursor-pointer items-center gap-2.5 text-sm text-pitch/75 select-none">
                <input
                  type="checkbox"
                  checked={values.remember}
                  onChange={(e) => update('remember', e.target.checked)}
                  disabled={pending}
                  className="size-[18px] cursor-pointer accent-magenta"
                />
                Recordarme
              </label>

              <button
                type="button"
                onClick={() => setNotice('El enlace de recuperación se enviará por correo.')}
                className="text-sm font-semibold text-magenta underline decoration-magenta/30 decoration-2 underline-offset-[5px] transition-colors duration-200 hover:text-pitch hover:decoration-pitch"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              disabled={pending}
              className="l-btn l-btn-primary mt-1 h-[52px] w-full text-base"
            >
              {pending ? (
                <>
                  <Spinner className="size-4.5 animate-spin" />
                  Iniciando sesión…
                </>
              ) : (
                'Iniciar sesión'
              )}
            </button>
          </form>

          <div className="mt-7  pt-6 text-center">
            <p className="text-sm text-pitch/70">
              ¿No tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => setRegistroAbierto(true)}
                className="font-bold text-magenta underline decoration-magenta/30 decoration-2 underline-offset-[5px] transition-colors duration-200 hover:text-pitch hover:decoration-pitch"
              >
                Crea la tuya gratis
              </button>
            </p>

            <p className="mt-4 text-xs leading-relaxed text-pitch/45">
              Al continuar aceptas nuestros{' '}
              <Link
                to="/"
                className="underline underline-offset-2 transition-colors hover:text-magenta"
              >
                Términos
              </Link>{' '}
              y{' '}
              <Link
                to="/"
                className="underline underline-offset-2 transition-colors hover:text-magenta"
              >
                Política de Privacidad
              </Link>
              .
            </p>
          </div>
        </div>
      </main>

      <RegistroModal open={registroAbierto} onClose={() => setRegistroAbierto(false)} />
    </div>
  );
}