import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { LayoutDashboard, LogOut } from './Icons';
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
    <span className="inline-flex items-center gap-3">
      <span
        className="grid size-8 place-items-center rounded-[2px] bg-magenta font-poster text-[15px] font-extrabold text-chalk"
        aria-hidden="true"
      >
        FG
      </span>
      <span className="font-poster text-[25px] leading-none font-extrabold tracking-[0.02em] whitespace-nowrap text-pitch uppercase">
        Foot Gamer&apos;s
      </span>
    </span>
  );

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-100 h-[var(--nav-h)]  transition-colors duration-300 ease-out ${
          scrolled ? 'border-pitch/20 bg-paper/95 backdrop-blur-md' : 'border-pitch/10 bg-paper'
        }`}
      >
        <div className="container-page flex h-full items-center justify-between gap-6">
          <a href="#inicio" className="flex-none" aria-label="Foot Gamer's, ir al inicio">
            {brand}
          </a>

          {/* Links de escritorio */}
          <nav aria-label="Navegación principal" className="hidden lg:block">
            <ul className="flex items-center gap-7">
              {NAV_LINKS.map((link) => {
                const isActive = active === link.href.slice(1);
                return (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      aria-current={isActive ? 'page' : undefined}
                      className={`group relative block py-2 text-sm font-medium transition-colors duration-200 ${
                        isActive ? 'text-magenta' : 'text-pitch/70 hover:text-pitch'
                      }`}
                    >
                      {link.label}
                      <span
                        className={`absolute inset-x-0 -bottom-px h-0.5 transition-colors duration-200 ${
                          isActive ? 'bg-magenta' : 'bg-transparent group-hover:bg-pitch/30'
                        }`}
                        aria-hidden="true"
                      />
                    </a>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Acciones: sesión activa o invitado */}
          <div className="hidden flex-none items-center gap-5 lg:flex">
            {isAuthenticated ? (
              <>
                <Link
                  to={esAdmin ? '/admin' : '/jugador'}
                  className="flex items-center gap-2.5 transition-colors hover:text-magenta"
                >
                  <span
                    className="grid size-8 place-items-center rounded-[2px] bg-pitch text-sm font-semibold text-chalk"
                    aria-hidden="true"
                  >
                    {session?.username.charAt(0).toUpperCase()}
                  </span>
                  <span className="text-sm font-semibold">{session?.username}</span>
                  <span className="text-[11px] text-pitch/70">
                    {esAdmin ? 'Admin' : 'Jugador'}
                  </span>
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex cursor-pointer items-center gap-2 text-sm font-medium text-pitch/70 transition-colors hover:text-magenta"
                  aria-label="Cerrar sesión"
                >
                  <LogOut className="size-4" />
                  Salir
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-semibold text-pitch transition-colors hover:text-magenta"
                >
                  Entrar
                </Link>
                <button
                  type="button"
                  onClick={() => setRegistroAbierto(true)}
                  className="l-btn l-btn-outline h-10 px-4 text-sm"
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
            className="grid size-10 place-items-center rounded-[2px] border border-pitch/25 transition-colors hover:border-magenta hover:text-magenta lg:hidden"
          >
            <span className="flex flex-col gap-1">
              <span
                className={`block h-0.5 w-4.5 bg-current transition duration-300 ease-out ${
                  open ? 'translate-y-[6px] rotate-45' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-4.5 bg-current transition duration-300 ease-out ${
                  open ? 'opacity-0' : ''
                }`}
              />
              <span
                className={`block h-0.5 w-4.5 bg-current transition duration-300 ease-out ${
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
        className={`fixed inset-x-0 top-[var(--nav-h)] z-99 border-b border-pitch/20 bg-paper px-5 pb-6 backdrop-blur-md transition duration-300 ease-out lg:hidden ${
          open ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-3 opacity-0'
        }`}
      >
        <nav aria-label="Navegación móvil">
          <ul>
            {NAV_LINKS.map((link, i) => (
              <li key={link.href} className={i > 0 ? 'border-t border-pitch/15' : ''}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 text-base font-medium text-pitch/80 transition-colors hover:text-magenta"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
        <div className="mt-4 flex flex-col gap-2.5">
          {isAuthenticated ? (
            <>
              <div className="mb-1 flex items-center gap-2.5 border border-pitch/20 px-3 py-2.5">
                <span
                  className="grid size-8 place-items-center rounded-[2px] bg-pitch text-sm font-semibold text-chalk"
                  aria-hidden="true"
                >
                  {session?.username.charAt(0).toUpperCase()}
                </span>
                <span className="text-sm font-semibold">{session?.username}</span>
                <span className="ml-auto text-[11px] text-magenta">
                  {esAdmin ? 'Admin' : 'Jugador'}
                </span>
              </div>
              <Link
                to={esAdmin ? '/admin' : '/jugador'}
                onClick={() => setOpen(false)}
                className="l-btn l-btn-primary w-full"
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
                className="l-btn l-btn-outline w-full"
              >
                <LogOut className="size-4" />
                Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setOpen(false)} className="l-btn l-btn-outline w-full">
                Entrar
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpen(false);
                  setRegistroAbierto(true);
                }}
                className="l-btn l-btn-primary w-full"
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
