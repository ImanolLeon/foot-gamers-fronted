import { Download, Globe } from './Icons';
import { Reveal } from './Reveal';
import { CTA_SOCIALS } from '../data/content';

export function CtaSection() {
  return (
    <section id="torneos" className="relative overflow-hidden bg-bg py-20 text-center lg:py-32">
      {/* Óvalo de brillo morado difuso */}
      <div
        className="absolute top-1/2 left-1/2 h-[560px] w-[min(1100px,130vw)] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(122,26,168,0.45)_0%,rgba(74,15,107,0.22)_42%,rgba(194,16,160,0)_72%)] blur-[28px]"
        aria-hidden="true"
      />

      <div className="container-page relative z-1">
        <Reveal>
          <h2 className="font-display text-[clamp(34px,5.2vw,48px)] leading-[1.05] font-black">
            ¿Listo para competir con nosotros?
          </h2>
        </Reveal>

        <Reveal delay={80}>
          <p className="mx-auto mt-5 mb-9 max-w-[550px] text-base leading-relaxed text-ink-2">
            Únete a la comunidad, arma tu equipo y participa en nuestros torneos. La próxima final
            te está esperando.
          </p>
        </Reveal>

        <Reveal delay={160}>
          <div className="mb-11 flex flex-wrap justify-center gap-3.5 max-sm:flex-col">
            <a href="#comunidad" className="btn btn-primary btn-lg max-sm:w-full">
              <Download className="size-[18px]" />
              Únete a la comunidad
            </a>
            <a href="#equipos" className="btn btn-ghost btn-lg max-sm:w-full">
              <Globe className="size-5" />
              Ver próximos torneos
            </a>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <div className="flex flex-wrap items-center justify-center gap-7 max-sm:gap-4">
            <span className="text-xs font-semibold tracking-[0.22em] text-ink-3 uppercase">
              Únete en
            </span>
            {CTA_SOCIALS.map(({ label, Icon }) => (
              <a
                key={label}
                href="#comunidad"
                aria-label={`${label} de Foot Gamer's`}
                className="inline-flex items-center gap-2 text-xs font-medium text-ink-2 transition duration-300 ease-out hover:-translate-y-0.5 hover:text-pink"
              >
                <Icon className="size-[17px]" />
                {label}
              </a>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}