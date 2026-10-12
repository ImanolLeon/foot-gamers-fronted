import { Crown, Instagram, Twitter, Youtube } from './Icons';
import { FOOTER_COLUMNS } from '../data/content';

const SOCIALS = [
  { label: 'Twitter', Icon: Twitter },
  { label: 'Instagram', Icon: Instagram },
  { label: 'YouTube', Icon: Youtube },
] as const;

export function Footer() {
  return (
    <footer id="comunidad" className="border-t border-line-soft bg-bg-2 pt-14 lg:pt-20">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-9 pb-14 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr]">
          {/* Marca */}
          <div>
            <a href="#inicio" className="inline-flex items-center gap-2.5" aria-label="FOOT GAMER'S, ir al inicio">
              <span
                className="grid size-9 place-items-center rounded-[10px] bg-gradient-to-br from-pink via-magenta to-purple shadow-[0_0_18px_rgba(194,16,160,0.55)]"
                aria-hidden="true"
              >
                <Crown className="size-5 text-white" />
              </span>
              <span className="font-display text-lg font-black tracking-[0.1em] uppercase">
                Foot Gamer&apos;s
              </span>
            </a>

            <p className="mt-4.5 mb-6 max-w-[340px] text-sm leading-relaxed text-ink-2">
              Comunidad de jugadores de PES 2021. Organizamos torneos, medimos fuerzas y
              compartimos la pasión por el fútbol virtual.
            </p>

            <div className="flex gap-2.5">
              {SOCIALS.map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#comunidad"
                  aria-label={`${label} de Foot Gamer's`}
                  className="grid size-8 place-items-center rounded-lg border border-white/14 text-ink-2 transition duration-300 ease-out hover:-translate-y-[3px] hover:border-magenta hover:text-pink hover:shadow-[0_0_16px_rgba(194,16,160,0.4)]"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Columnas de links */}
          {FOOTER_COLUMNS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="mb-5 text-xs font-bold tracking-[0.16em] text-white uppercase">
                {column.title}
              </h3>
              <ul className="grid gap-3">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-ink-2 transition duration-300 ease-out hover:pl-1 hover:text-magenta"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        {/* Barra inferior */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/7 py-5.5 text-xs text-ink-3 max-sm:flex-col max-sm:items-start">
          <span>
            © 2025 Foot Gamer&apos;s. Todos los derechos reservados. Konami Digital Entertainment.
          </span>
          <span>
            Hecho con <strong className="font-bold text-ink-2">♥</strong> para los fans del fútbol
          </span>
        </div>
      </div>
    </footer>
  );
}