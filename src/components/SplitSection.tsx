import { CheckCircle } from './Icons';
import { Reveal } from './Reveal';
import { SPLIT_CHECKS, SPLIT_IMAGE } from '../data/content';

export function SplitSection() {
  return (
    <section className="grid min-h-[420px] grid-cols-1 bg-bg-2 lg:grid-cols-[55%_45%]">
      {/* Imagen a sangre */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#1a0526] to-[#3a0a52]">
        <img
          src={SPLIT_IMAGE}
          alt="Jugadores con camiseta roja saliendo por el túnel del estadio con la Allianz Arena al fondo"
          className="size-full min-h-[300px] object-cover object-center lg:min-h-[420px] lg:[mask-image:linear-gradient(to_right,#000_62%,transparent_100%)]"
          loading="lazy"
          decoding="async"
        />
      </div>

      {/* Texto */}
      <div className="flex flex-col justify-center px-5 py-11 lg:pr-20 lg:pl-14 lg:py-18">
        <Reveal>
          <p className="eyebrow">Comunidad</p>
        </Reveal>

        <Reveal delay={80}>
          <h2 className="font-display text-[clamp(30px,3.6vw,40px)] leading-[1.1] font-extrabold">
            Juega, compite y diviértete con nosotros
          </h2>
        </Reveal>

        <Reveal delay={160}>
          <p className="mt-4 mb-6 max-w-[460px] text-[15px] leading-[1.65] text-ink-2">
            Un espacio para los que aman PES 2021 y quieren algo más que partidos sueltos. Aquí
            armamos torneos, medimos fuerzas y compartimos la pasión por el fútbol virtual.
          </p>
        </Reveal>

        <Reveal delay={240}>
          <ul className="grid gap-3.5">
            {SPLIT_CHECKS.map((item) => (
              <li key={item} className="flex items-start gap-3 text-[15px] text-white/82">
                <CheckCircle className="mt-0.5 size-5 flex-none text-magenta" />
                {item}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}