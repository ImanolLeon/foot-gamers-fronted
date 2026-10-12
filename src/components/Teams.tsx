import { ArrowRight, Shield } from './Icons';
import { Reveal } from './Reveal';
import { TEAMS } from '../data/content';

export function Teams() {
  return (
    <section
      id="equipos"
      className="bg-[radial-gradient(90%_60%_at_50%_0%,rgba(74,15,107,0.28)_0%,rgba(74,15,107,0)_60%)] py-20 lg:py-26"
    >
      <div className="container-page">
        <Reveal className="mb-10 text-center">
          <p className="eyebrow eyebrow-center">Equipos 2021</p>
          <h2 className="font-display text-[clamp(28px,4vw,36px)] leading-[1.12] font-extrabold">
            Equipos auténticos, plantillas 2021
          </h2>
        </Reveal>

        <Reveal>
          <div
            role="list"
            aria-label="Equipos disponibles en el juego"
            className="no-scrollbar -mx-1 flex snap-x snap-proximity gap-3 overflow-x-auto px-1 pb-4"
          >
            {TEAMS.map((team) => (
              <a key={team} href="#equipos" role="listitem" className="pill">
                <Shield className="size-[18px] flex-none text-magenta" />
                {team}
              </a>
            ))}

            <a href="#equipos" role="listitem" className="pill border-magenta text-pink hover:shadow-[0_0_22px_rgba(194,16,160,0.5)]">
              +200 equipos
              <ArrowRight className="size-4 flex-none" />
            </a>
          </div>
        </Reveal>

        <div
          className="mt-7 h-px bg-gradient-to-r from-transparent via-magenta to-transparent"
          role="presentation"
        />
      </div>
    </section>
  );
}