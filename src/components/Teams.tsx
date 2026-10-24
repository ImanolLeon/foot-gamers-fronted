import { Shield } from './Icons';
import { TEAMS } from '../data/content';

export function Teams() {
  return (
    <section id="equipos" className="border-t border-pitch/15 bg-paper py-20 lg:py-28">
      <div className="container-page">
        <div className="flex flex-wrap items-end justify-between gap-x-12 gap-y-5">
          <h2 className="max-w-[10ch] font-poster text-[clamp(44px,6vw,76px)] leading-[0.86] font-extrabold text-pitch uppercase">
            Elige tu escudo
          </h2>
          <p className="max-w-[42ch] text-[15px] leading-[1.65] text-pitch/75">
            Plantillas 2021, sin fichajes inventados. Los clásicos de siempre y otros doscientos
            equipos por descubrir.
          </p>
        </div>

        <ul className="mt-10  sm:grid sm:grid-cols-2 sm:gap-x-14">
          {TEAMS.map((team) => (
            <li
              key={team}
              className="flex items-center gap-3.5  py-4 sm:py-5"
            >
              <Shield className="size-[18px] flex-none text-magenta" />
              <span className="font-poster text-[22px] leading-none font-semibold text-pitch uppercase">
                {team}
              </span>
            </li>
          ))}

          <li className="">
            <a
              href="#torneos"
              className="group flex items-center justify-between gap-4 py-4 text-magenta transition-colors hover:text-pitch sm:py-5"
            >
              <span className="font-poster text-[22px] leading-none font-bold uppercase">
                +200 equipos
              </span>
              
            </a>
          </li>
        </ul>
      </div>
    </section>
  );
}
