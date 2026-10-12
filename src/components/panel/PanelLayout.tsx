import { useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Bell, Crown, LogOut, Menu, Search } from '../Icons';
import { useAuth } from '../../hooks/useAuth';
import { urlImagenUsuario } from '../../lib/api';
import { PerfilModal } from './PerfilModal';
import type { IconComponent, PanelNavItem } from '../../data/panelNav';

type PanelLayoutProps = {
  /** Secciones del panel; el primer elemento es la raíz. */
  nav: PanelNavItem[];
  /** Raíz del panel (p.ej. "/admin"). Marca el `end` del enlace índice. */
  raiz: string;
  /** Texto bajo el logo en el sidebar. */
  subtitulo: string;
  /** Encabezado del grupo de enlaces. */
  etiquetaGrupo: string;
  /** Icono del atajo "Ver sitio". */
  IconoVerSitio: IconComponent;
  /** Texto del buscador de la topbar. */
  placeholderBusqueda: string;
  /** Etiqueta cuando el backend aún no devolvió el email. */
  rolFallback: string;
  /** Contador decorativo de la campana. */
  notificaciones?: number;
};

/**
 * Estructura compartida de los paneles (admin y jugador): sidebar con la
 * identidad de marca sobre contenido en tema claro. Sólo cambia la
 * navegación y los textos, que llegan por props.
 */
export function PanelLayout({
  nav,
  raiz,
  subtitulo,
  etiquetaGrupo,
  IconoVerSitio,
  placeholderBusqueda,
  rolFallback,
  notificaciones = 3,
}: PanelLayoutProps) {
  const { session, usuario, logout } = useAuth();
  const { pathname } = useLocation();
  const seccion = nav.find((item) => item.to === pathname) ?? nav[0];
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [perfilAbierto, setPerfilAbierto] = useState(false);

  const fotoPerfil = usuario
    ? usuario.imagen
      ? urlImagenUsuario(usuario.id, usuario.imagen)
      : usuario.avatarUrl
    : null;

  const avatar = (
    <span
      className="grid size-9 flex-none place-items-center overflow-hidden rounded-full bg-gradient-to-br from-pink via-magenta to-purple font-display text-sm font-black text-white"
      aria-hidden="true"
    >
      {fotoPerfil ? (
        <img src={fotoPerfil} alt="" className="size-full object-cover" />
      ) : (
        session?.username.charAt(0).toUpperCase()
      )}
    </span>
  );

  return (
    <div className="min-h-screen bg-bg">
      {/* ============================================================
          SIDEBAR — conserva la identidad de marca (morado)
      ============================================================ */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[264px] flex-col border-r border-line bg-bg-2 transition-transform duration-300 ease-out lg:translate-x-0 ${
          menuAbierto ? 'translate-x-0' : '-translate-x-full'
        }`}
        aria-label="Navegación del panel"
      >
        {/* Marca */}
        <div className="flex h-[70px] flex-none items-center gap-2.5 border-b border-line px-5">
          <span
            className="grid size-9 flex-none place-items-center rounded-[10px] bg-gradient-to-br from-pink via-magenta to-purple shadow-[0_0_18px_rgba(194,16,160,0.55)]"
            aria-hidden="true"
          >
            <Crown className="size-5 text-white" />
          </span>
          <span className="min-w-0">
            <span className="block font-display text-sm font-black tracking-[0.1em] uppercase">
              Foot Gamer&apos;s
            </span>
            <span className="block text-[11px] tracking-[0.16em] text-pink uppercase">
              {subtitulo}
            </span>
          </span>
        </div>

        {/* Enlaces */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="px-3 pb-2 text-[10px] font-bold tracking-[0.18em] text-ink-3 uppercase">
            {etiquetaGrupo}
          </p>
          <ul className="grid gap-0.5">
            {nav.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.to === raiz}
                  onClick={() => setMenuAbierto(false)}
                  className={({ isActive }) =>
                    `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition duration-300 ease-out ${
                      isActive
                        ? 'bg-magenta/15 text-white shadow-[inset_2px_0_0_0_#c210a0]'
                        : 'text-ink-2 hover:bg-white/4 hover:text-white'
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <item.Icon
                        className={`size-[18px] flex-none transition-colors duration-300 ${
                          isActive ? 'text-pink' : 'text-ink-3 group-hover:text-pink'
                        }`}
                      />
                      {item.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Usuario */}
        <div className="flex-none border-t border-line p-3">
          <div className="flex items-center gap-2 rounded-xl border border-line bg-surface px-2.5 py-2.5">
            <button
              type="button"
              onClick={() => setPerfilAbierto(true)}
              aria-label="Editar mi perfil"
              title="Editar mi perfil"
              className="flex min-w-0 flex-1 items-center gap-3 rounded-lg text-left"
            >
              {avatar}
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-bold transition duration-300 ease-out hover:text-pink">
                  {session?.username}
                </span>
                <span className="block truncate text-[11px] text-ink-3">
                  {usuario?.email ?? rolFallback}
                </span>
              </span>
            </button>
            <button
              type="button"
              onClick={logout}
              aria-label="Cerrar sesión"
              className="grid size-8 flex-none place-items-center rounded-lg text-ink-3 transition duration-300 ease-out hover:bg-magenta/15 hover:text-pink"
            >
              <LogOut className="size-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay del drawer móvil */}
      {menuAbierto ? (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() => setMenuAbierto(false)}
          className="fixed inset-0 z-40 bg-black/65 lg:hidden"
        />
      ) : null}

      {/* ============================================================
          CONTENIDO — tema claro con acentos de marca
      ============================================================ */}
      <div className="panel-content min-h-screen lg:pl-[264px]">
        {/* Topbar */}
        <header className="sticky top-0 z-30 flex h-[70px] items-center gap-4 border-b border-line bg-bg/85 px-5 backdrop-blur-xl lg:px-8">
          <button
            type="button"
            onClick={() => setMenuAbierto(true)}
            aria-label="Abrir menú del panel"
            className="grid size-10 flex-none place-items-center rounded-lg border border-line text-ink-2 transition duration-300 ease-out hover:border-magenta hover:text-magenta lg:hidden"
          >
            <Menu className="size-5" />
          </button>

          <div className="min-w-0 flex-1">
            <h1 className="truncate font-display text-lg font-extrabold">{seccion.label}</h1>
            <p className="hidden truncate text-xs text-ink-3 sm:block">{seccion.descripcion}</p>
          </div>

          {/* Buscador (decorativo) */}
          <div className="relative hidden md:block">
            <Search className="pointer-events-none absolute top-1/2 left-3.5 size-4 -translate-y-1/2 text-ink-3" />
            <input
              type="search"
              placeholder={placeholderBusqueda}
              aria-label="Buscar"
              className="h-10 w-[240px] rounded-lg border border-line bg-surface pr-4 pl-10 text-sm text-ink placeholder:text-ink-3 transition duration-300 ease-out focus:border-magenta focus:outline-none"
            />
          </div>

          {/* Notificaciones (decorativas) */}
          <button
            type="button"
            aria-label={`Notificaciones: ${notificaciones} sin leer`}
            className="relative grid size-10 flex-none place-items-center rounded-lg border border-line text-ink-2 transition duration-300 ease-out hover:border-magenta hover:text-magenta"
          >
            <Bell className="size-5" />
            <span
              className="absolute -top-1 -right-1 grid size-4.5 place-items-center rounded-full bg-magenta text-[10px] font-bold text-white"
              aria-hidden="true"
            >
              {notificaciones}
            </span>
          </button>

          <Link
            to="/"
            className="hidden flex-none items-center gap-2 rounded-lg border border-line px-3 py-2 text-sm font-semibold text-ink-2 transition duration-300 ease-out hover:border-magenta hover:text-magenta sm:inline-flex"
          >
            <IconoVerSitio className="size-4" />
            Ver sitio
          </Link>
        </header>

        {/* Contenido */}
        <main id="contenido" className="px-5 py-7 lg:px-8 lg:py-9">
          <Outlet />
        </main>
      </div>

      <PerfilModal open={perfilAbierto} onClose={() => setPerfilAbierto(false)} />
    </div>
  );
}
