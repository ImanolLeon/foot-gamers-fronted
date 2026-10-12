import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Crown, LayoutDashboard, LogOut } from './Icons';
import { RegistroModal } from './RegistroModal';
import { NAV_LINKS } from '../data/content';
import { useActiveSection, useScrolled } from '../hooks';
import { useAuth } from '../hooks/useAuth';

const SECTION_IDS = NAV_LINKS.map((l) => l.href.replace('#', ''));

export function Navbar() {
  const scrolled = useScrolled();
  const active = useActiveSection(SECTION_IDS);
  const { isAuthenticated, session, logout } = useAuth();
  const esAdmin = session?.rol === 'ADMINISTRADOR';
  const [open, setOpen] = useState(false);
  const [registroAbierto, setRegistroAbierto] = useState(false);

  // Cierra el menú móvil al cambiar el breakpoint a desktop
  useEffect(() => {
    const mq = window.matchMedia('(min-width: 1025px)');
    const onChange = () => mq.matches && setOpen(false);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Cierra el menú móvil con la tecla Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open]);

  const brand = (
    <span className="inline-flex items-center gap-2.5">
      <span
        className="grid size-9 place-items-center rounded-[10px] bg-gradient-to-br from-pink via-magenta to-purple shadow-[0_0_18px_rgba(194,16,160,0.55)]"
        aria-hidden="true"
      >
        <Crown className="size-5 text-white" />
      </span>
      <span className="font-display text-lg font-black tracking-[0.1em] uppercase whitespace-nowrap">
        Foot Gamer&apos;s
      </span>
    </span>
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-100 h-[var(--nav-h)] border-b-2 border-transparent transition duration-300 ease-out ${
          scrolled ? 'bg-nav/88 backdrop-blur-xl backdrop-saturate-150' : 'bg-nav/72'
        }`}
      >
        <div className="absolute inset-x-0 -bottom-2 h-0.5 bg-gradient-to-r from-magenta via-purple to-transparent" />

        <div className="container-page flex h-full items-center justify-between gap-6">
          <a href="#inicio" className="flex-none" aria-label="FOOT GAMER'S, ir al inicio">
            {brand}
          </a>

          {/* Links de escritorio */}
          <nav aria-label="Navegación principal" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    aria-current={active === link.href.slice(1) ? 'page' : undefined}
                    className={`group relative py-1.5 text-sm transition duration-300 ease-out ${
                      active === link.href.slice(1)
                        ? 'text-white'
                        : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {link.label}
                    <span
                      className={`absolute inset-x-0 bottom-0 h-0.5 origin-left rounded-full bg-magenta transition-transform duration-300 ease-out ${
                        active === link.href.slice(1)
                          ? 'scale-x-100'
                          : 'scale-x-0 group-hover:scale-x-100'
                      }`}
                    />
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          {/* Acciones: sesión activa o invitado */}
          <div className="hidden flex-none items-center gap-2.5 lg:flex">
            {isAuthenticated ? (
              <>
                {esAdmin ? (
                  <Link
                    to="/admin"
                    className="flex items-center gap-2.5 rounded-full  py-1.5 pr-4 pl-1.5 transition duration-300 ease-out hover:border-magenta hover:shadow-[0_0_16px_rgba(194,16,160,0.35)]"
                  >
                    <span
                      className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-pink via-magenta to-purple font-display text-sm font-black text-white"
                      aria-hidden="true"
                    >
                      {session?.username.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm font-bold">{session?.username}</span>
                  
                  </Link>
                ) : (
                  <Link
                    to="/jugador"
                    title="Ir a mi panel"
                    className="flex items-center gap-2.5 rounded-full border border-line py-1.5 pr-4 pl-1.5 transition duration-300 ease-out hover:border-magenta hover:shadow-[0_0_16px_rgba(194,16,160,0.35)]"
                  >
                    <span
                      className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-pink via-magenta to-purple font-display text-sm font-black text-white"
                      aria-hidden="true"
                    >
                      {session?.username.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm font-bold">{session?.username}</span>
                    <span className="rounded-full bg-white/8 px-2 py-0.5 text-[10px] font-bold tracking-[0.1em] text-ink-2 uppercase">
                      Jugador
                    </span>
                  </Link>
                )}
                <button
                  type="button"
                  onClick={logout}
                  className="btn btn-ghost btn-sm"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="size-4" />
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-outline btn-sm">
                  Iniciar Sesión
                </Link>
                <button
                  type="button"
                  onClick={() => setRegistroAbierto(true)}
                  className="btn btn-primary btn-sm"
                >
                  Crear cuenta
                </button>
              </>
            )}
          </div>

          {/* Hamburguesa */}
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="nav-mobile"
            aria-label={open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación'}
            className="grid size-10 place-items-center rounded-[10px] border border-line bg-white/4 transition duration-300 ease-out hover:border-magenta hover:shadow-[0_0_14px_rgba(194,16,160,0.4)] lg:hidden"
          >
            <span className="flex flex-col gap-1">
              <span
                className={`block h-0.5 w-4.5 rounded-full bg-white transition duration-300 ease-out ${
                  open ? 'translate-y-[6px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-4.5 rounded-full bg-white transition duration-300 ease-out ${
                  open ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-4.5 rounded-full bg-white transition duration-300 ease-out ${
                  open ? '-translate-y-[6px] -rotate-45' : ''
                }`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Panel móvil */}
      <div
        id="nav-mobile"
        className={`fixed inset-x-0 top-[var(--nav-h)] z-99 border-b border-line bg-bg/97 px-5 pb-6 backdrop-blur-xl transition duration-300 ease-out lg:hidden ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0'
        }`}
      >
        <nav aria-label="Navegación móvil">
          <ul>
            {NAV_LINKS.map((link, i) => (
              <li key={link.href} className={i > 0 ? 'border-t border-white/6' : ''}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 text-base font-semibold text-ink-2 transition duration-300 ease-out hover:text-pink"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex flex-col gap-2.5">
          {isAuthenticated ? (
            <>
              <div className="flex items-center gap-2.5 rounded-xl border border-line bg-surface px-3 py-2.5">
                <span
                  className="grid size-8 place-items-center rounded-full bg-gradient-to-br from-pink via-magenta to-purple font-display text-sm font-black text-white"
                  aria-hidden="true"
                >
                  {session?.username.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-bold">{session?.username}</span>
                <span className="ml-auto rounded-full bg-magenta/20 px-2 py-0.5 text-[10px] font-bold tracking-[0.1em] text-pink uppercase">
                  {esAdmin ? 'Admin' : 'Jugador'}
                </span>
              </div>
              <Link
                to={esAdmin ? '/admin' : '/jugador'}
                onClick={() => setOpen(false)}
                className="btn btn-primary w-full"
              >
                <LayoutDashboard className="size-4" />
                Ir a mi panel
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  logout();
                }}
                className="btn btn-ghost w-full"
              >
                <LogOut className="size-4" />
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="btn btn-outline w-full">
                Iniciar Sesión
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setRegistroAbierto(true);
                }}
                className="btn btn-primary w-full"
              >
                Crear cuenta
              </button>
            </>
          )}
        </div>
      </div>

      <RegistroModal open={registroAbierto} onClose={() => setRegistroAbierto(false)} />
    </>
  );
}