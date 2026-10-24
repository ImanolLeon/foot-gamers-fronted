import { Instagram, Twitter, Youtube } from './Icons';
import { FOOTER_COLUMNS } from '../data/content';

const SOCIALS = [
  { label: 'Twitter', Icon: Twitter },
  { label: 'Instagram', Icon: Instagram },
  { label: 'YouTube', Icon: Youtube },
] as const;

export function Footer() {
  return (
    <footer className="border-t border-chalk/10 bg-[#03150f] pt-14 text-chalk lg:pt-20">
      <div className="container-page">
        <div className="grid grid-cols-1 gap-12 pb-14 sm:grid-cols-2 lg:grid-cols-[1.5fr_2fr] lg:gap-20">
          {/* Marca */}
          <div>
            <a
              href="#inicio"
              className="inline-flex items-center gap-3"
              aria-label="Foot Gamer's, ir al inicio"
            >
              <span
                className="grid size-9 place-items-center rounded-[2px] bg-magenta font-poster text-base font-extrabold text-chalk"
                aria-hidden="true"
              >
                FG
              </span>
              <span className="font-poster text-[26px] leading-none font-extrabold uppercase">
                Foot Gamer&apos;s
              </span>
            </a>

            <p className="mt-5 max-w-[38ch] text-sm leading-[1.7] text-chalk/60">
              Una comunidad de PES 2021 que se toma los torneos en serio y la diversión todavía
              más en serio.
            </p>

            <div className="mt-6 flex gap-2.5">
              {SOCIALS.map(({ label, Icon }) => (
                <a
                  key={label}
                  href="#comunidad"
                  aria-label={`${label} de Foot Gamer's`}
                  className="grid size-9 place-items-center rounded-[2px] border border-chalk/20 text-chalk/65 transition-colors hover:border-magenta hover:text-magenta"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Columnas */}
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
            {FOOTER_COLUMNS.map((column) => (
              <nav key={column.title} aria-label={column.title}>
                <h3 className="mb-4 text-sm font-semibold text-chalk">{column.title}</h3>
                <ul className="grid gap-3">
                  {column.links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        className="text-sm text-chalk/60 transition-colors hover:text-chalk"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        {/* Barra inferior */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-chalk/15 py-6 text-xs text-chalk/55 max-sm:flex-col max-sm:items-start">
          <span>© 2026 Foot Gamer&apos;s. Todos los derechos reservados.</span>
          <span>
            PES y eFootball son marcas de Konami Digital Entertainment. Hecho por la comunidad.
          </span>
        </div>
      </div>
    </footer>
  );
}
