import {
  useEffect,
  useId,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from 'react';
import { Field } from '../Field';
import {
  AlertCircle,
  Camera,
  CheckCircle,
  Close,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Spinner,
  User,
} from '../Icons';
import { useAuth } from '../../hooks/useAuth';
import { ApiError, urlImagenUsuario } from '../../lib/api';

type Tab = 'datos' | 'foto' | 'seguridad';

const TABS: { id: Tab; label: string }[] = [
  { id: 'datos', label: 'Datos' },
  { id: 'foto', label: 'Foto' },
  { id: 'seguridad', label: 'Contraseña' },
];

/**
 * El modal solo monta su contenido cuando está abierto: así el formulario
 * arranca con los datos actuales del usuario sin resetear estado en un efecto.
 */
export function PerfilModal({ open, onClose }: { open: boolean; onClose: () => void }) {
  if (!open) return null;
  return <ContenidoPerfil onClose={onClose} />;
}

function Banner({ tipo, children }: { tipo: 'error' | 'ok'; children: ReactNode }) {
  const esOk = tipo === 'ok';
  return (
    <div
      role="alert"
      className={`flex items-start gap-2.5 rounded-xl border px-4 py-3 text-sm ${
        esOk
          ? 'border-emerald-400/35 bg-emerald-500/10 text-emerald-200'
          : 'border-red-400/35 bg-red-500/10 text-red-200'
      }`}
    >
      {esOk ? (
        <CheckCircle className="mt-0.5 size-4 flex-none" />
      ) : (
        <AlertCircle className="mt-0.5 size-4 flex-none" />
      )}
      {children}
    </div>
  );
}

function ContenidoPerfil({ onClose }: { onClose: () => void }) {
  const uid = useId();
  const { usuario, actualizarPerfil, subirAvatar, cambiarContrasena } = useAuth();

  const [tab, setTab] = useState<Tab>('datos');

  /* ---------- Datos ---------- */
  const [username, setUsername] = useState(usuario?.username ?? '');
  const [email, setEmail] = useState(usuario?.email ?? '');
  const [datosErrores, setDatosErrores] = useState<{ username?: string; email?: string }>({});
  const [datosError, setDatosError] = useState<string | null>(null);
  const [datosOk, setDatosOk] = useState(false);
  const [guardandoDatos, setGuardandoDatos] = useState(false);

  /* ---------- Foto ---------- */
  const [archivo, setArchivo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const inputArchivo = useRef<HTMLInputElement | null>(null);
  const [fotoError, setFotoError] = useState<string | null>(null);
  const [fotoOk, setFotoOk] = useState(false);
  const [guardandoFoto, setGuardandoFoto] = useState(false);

  /* ---------- Contraseña ---------- */
  const [actual, setActual] = useState('');
  const [nueva, setNueva] = useState('');
  const [confirmar, setConfirmar] = useState('');
  const [passErrores, setPassErrores] = useState<{ nueva?: string; confirmar?: string }>({});
  const [passError, setPassError] = useState<string | null>(null);
  const [passOk, setPassOk] = useState(false);
  const [guardandoPass, setGuardandoPass] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Escape para cerrar + bloqueo del scroll de fondo.
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

  // Libera el object URL de la vista previa al cambiarla o desmontar.
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  const fotoActual = usuario
    ? usuario.imagen
      ? urlImagenUsuario(usuario.id, usuario.imagen)
      : usuario.avatarUrl
    : null;

  const onElegirArchivo = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setArchivo(file);
    setFotoOk(false);
    setFotoError(null);
    setPreview(file ? URL.createObjectURL(file) : null);
  };

  const guardarDatos = async (event: FormEvent) => {
    event.preventDefault();
    const errores: typeof datosErrores = {};
    const u = username.trim();
    const e = email.trim();

    if (!u) errores.username = 'El usuario es obligatorio.';
    else if (!/^[a-zA-Z0-9._-]{3,}$/.test(u))
      errores.username = 'Solo letras, números, punto, guion y guion bajo (mínimo 3).';

    if (!e) errores.email = 'El correo es obligatorio.';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)) errores.email = 'Escribe un correo válido.';

    setDatosErrores(errores);
    setDatosError(null);
    setDatosOk(false);
    if (Object.keys(errores).length > 0) return;

    setGuardandoDatos(true);
    try {
      await actualizarPerfil({ username: u, email: e });
      setDatosOk(true);
    } catch (error) {
      if (error instanceof ApiError) {
        setDatosError(error.message);
        if (Object.keys(error.errores).length > 0) setDatosErrores({ ...error.errores });
      } else {
        setDatosError('No se pudieron guardar los datos.');
      }
    } finally {
      setGuardandoDatos(false);
    }
  };

  const guardarFoto = async (event: FormEvent) => {
    event.preventDefault();
    if (!archivo) {
      setFotoError('Elige una imagen (PNG, JPG o WEBP).');
      return;
    }
    setGuardandoFoto(true);
    setFotoError(null);
    setFotoOk(false);
    try {
      await subirAvatar(archivo);
      setArchivo(null);
      setFotoOk(true);
    } catch (error) {
      setFotoError(error instanceof ApiError ? error.message : 'No se pudo subir la imagen.');
    } finally {
      setGuardandoFoto(false);
    }
  };

  const guardarContrasena = async (event: FormEvent) => {
    event.preventDefault();
    const errores: typeof passErrores = {};
    if (nueva.length < 6) errores.nueva = 'La contraseña debe tener al menos 6 caracteres.';
    if (confirmar !== nueva) errores.confirmar = 'Las contraseñas no coinciden.';

    setPassErrores(errores);
    setPassError(null);
    setPassOk(false);
    if (Object.keys(errores).length > 0) return;

    setGuardandoPass(true);
    try {
      await cambiarContrasena({ actual: actual || undefined, nueva });
      setPassOk(true);
      setActual('');
      setNueva('');
      setConfirmar('');
    } catch (error) {
      setPassError(
        error instanceof ApiError ? error.message : 'No se pudo cambiar la contraseña.'
      );
    } finally {
      setGuardandoPass(false);
    }
  };

  const togglePassword = (
    <button
      type="button"
      onClick={() => setShowPassword((v) => !v)}
      aria-pressed={showPassword}
      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
      className="grid size-10 place-items-center rounded-lg text-ink-3 transition duration-300 ease-out hover:text-pink"
    >
      {showPassword ? <EyeOff className="size-[19px]" /> : <Eye className="size-[19px]" />}
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-200 grid place-items-center overflow-y-auto bg-black/75 p-4 backdrop-blur-sm"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`${uid}-titulo`}
        className="relative max-h-[92vh] w-full max-w-[480px] overflow-y-auto rounded-2xl border border-line bg-bg-2 p-6 shadow-[0_30px_80px_-30px_rgba(194,16,160,0.7)] sm:p-8"
      >
        <span
          className="absolute inset-x-8 top-0 h-0.5 rounded-full bg-gradient-to-r from-transparent via-magenta to-transparent"
          aria-hidden="true"
        />

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar"
          className="absolute top-4 right-4 grid size-9 place-items-center rounded-lg text-ink-3 transition duration-300 ease-out hover:text-pink"
        >
          <Close className="size-5" />
        </button>

        {/* Cabecera con avatar */}
        <div className="flex items-center gap-4">
          <span className="grid size-14 flex-none place-items-center overflow-hidden rounded-full bg-gradient-to-br from-pink via-magenta to-purple font-display text-lg font-black text-white">
            {preview ?? fotoActual ? (
              <img src={preview ?? fotoActual ?? ''} alt="" className="size-full object-cover" />
            ) : (
              (usuario?.username.charAt(0) ?? '?').toUpperCase()
            )}
          </span>
          <div className="min-w-0">
            <p className="eyebrow">Mi cuenta</p>
            <h2 id={`${uid}-titulo`} className="truncate font-display text-xl font-black">
              {usuario?.username ?? 'Mi perfil'}
            </h2>
            <p className="truncate text-xs text-ink-3">{usuario?.email}</p>
          </div>
        </div>

        {/* Pestañas */}
        <div
          role="tablist"
          aria-label="Secciones del perfil"
          className="mt-6 flex gap-1 rounded-xl border border-line bg-surface p-1"
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              type="button"
              role="tab"
              aria-selected={tab === t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold transition duration-300 ease-out ${
                tab === t.id ? 'bg-magenta/20 text-white' : 'text-ink-2 hover:text-white'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ---------- Datos ---------- */}
        {tab === 'datos' ? (
          <form onSubmit={guardarDatos} noValidate className="mt-5 grid gap-4">
            {datosError ? <Banner tipo="error">{datosError}</Banner> : null}
            {datosOk ? <Banner tipo="ok">Datos actualizados correctamente.</Banner> : null}

            <Field
              id={`${uid}-username`}
              label="Usuario"
              type="text"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="tu_usuario"
              icon={<User className="size-[19px]" />}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              error={datosErrores.username}
              disabled={guardandoDatos}
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
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={datosErrores.email}
              disabled={guardandoDatos}
            />

            <button type="submit" disabled={guardandoDatos} className="btn btn-primary btn-lg w-full">
              {guardandoDatos ? (
                <>
                  <Spinner className="size-4.5 animate-spin" />
                  Guardando…
                </>
              ) : (
                'Guardar cambios'
              )}
            </button>
          </form>
        ) : null}

        {/* ---------- Foto ---------- */}
        {tab === 'foto' ? (
          <form onSubmit={guardarFoto} className="mt-5 grid gap-4">
            {fotoError ? <Banner tipo="error">{fotoError}</Banner> : null}
            {fotoOk ? <Banner tipo="ok">Foto actualizada correctamente.</Banner> : null}

            <div className="flex items-center gap-4 rounded-xl border border-line bg-surface p-4">
              <span className="grid size-20 flex-none place-items-center overflow-hidden rounded-full bg-gradient-to-br from-pink via-magenta to-purple font-display text-2xl font-black text-white">
                {preview ?? fotoActual ? (
                  <img
                    src={preview ?? fotoActual ?? ''}
                    alt=""
                    className="size-full object-cover"
                  />
                ) : (
                  (usuario?.username.charAt(0) ?? '?').toUpperCase()
                )}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold">Foto de perfil</p>
                <p className="mt-1 text-xs text-ink-3">PNG, JPG o WEBP.</p>
                <input
                  ref={inputArchivo}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={onElegirArchivo}
                  className="hidden"
                />
                <button
                  type="button"
                  onClick={() => inputArchivo.current?.click()}
                  className="btn btn-outline btn-sm mt-3"
                >
                  <Camera className="size-4" />
                  {preview ? 'Elegir otra' : 'Elegir imagen'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={guardandoFoto || !archivo}
              className="btn btn-primary btn-lg w-full"
            >
              {guardandoFoto ? (
                <>
                  <Spinner className="size-4.5 animate-spin" />
                  Subiendo…
                </>
              ) : (
                'Guardar foto'
              )}
            </button>
          </form>
        ) : null}

        {/* ---------- Contraseña ---------- */}
        {tab === 'seguridad' ? (
          <form onSubmit={guardarContrasena} noValidate className="mt-5 grid gap-4">
            {passError ? <Banner tipo="error">{passError}</Banner> : null}
            {passOk ? <Banner tipo="ok">Contraseña actualizada correctamente.</Banner> : null}

            {usuario?.provider === 'local' ? (
              <Field
                id={`${uid}-actual`}
                label="Contraseña actual"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                placeholder="Tu contraseña actual"
                icon={<Lock className="size-[19px]" />}
                value={actual}
                onChange={(e) => setActual(e.target.value)}
                disabled={guardandoPass}
              />
            ) : (
              <p className="rounded-xl border border-line bg-surface px-4 py-3 text-xs leading-relaxed text-ink-2">
                Entraste con {usuario?.provider}. Aquí puedes establecer una contraseña para
                iniciar sesión también sin ese proveedor.
              </p>
            )}

            <Field
              id={`${uid}-nueva`}
              label="Nueva contraseña"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Mínimo 6 caracteres"
              icon={<Lock className="size-[19px]" />}
              value={nueva}
              onChange={(e) => setNueva(e.target.value)}
              error={passErrores.nueva}
              disabled={guardandoPass}
              addon={togglePassword}
            />

            <Field
              id={`${uid}-confirmar`}
              label="Repite la nueva contraseña"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="••••••••"
              icon={<Lock className="size-[19px]" />}
              value={confirmar}
              onChange={(e) => setConfirmar(e.target.value)}
              error={passErrores.confirmar}
              disabled={guardandoPass}
            />

            <button
              type="submit"
              disabled={guardandoPass}
              className="btn btn-primary btn-lg w-full"
            >
              {guardandoPass ? (
                <>
                  <Spinner className="size-4.5 animate-spin" />
                  Actualizando…
                </>
              ) : (
                'Cambiar contraseña'
              )}
            </button>
          </form>
        ) : null}
      </div>
    </div>
  );
}
