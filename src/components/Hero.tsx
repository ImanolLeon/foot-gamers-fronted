import { Play, Video } from './Icons';
import { BrandWaves } from './BrandWaves';
import { Reveal } from './Reveal';
import { HERO_IMAGE, HERO_STATS } from '../data/content';

export function Hero() {
  return (
    <section
      id="inicio"
      className="relative isolate flex min-h-[610px] flex-col items-center overflow-hidden bg-gradient-to-br from-[#1a0526] via-[#2e0a46] to-[#5a1180] md:flex-row"
    >
      {/* Ondas concéntricas tipo estadio */}
      <BrandWaves className="absolute -top-[280px] -right-[180px] z-0 size-[900px] opacity-85" />

      {/* Viñeta inferior */}
      <div
        className="absolute inset-x-0 bottom-0 z-1 h-[45%] bg-gradient-to-t from-bg/55 to-transparent"
        aria-hidden="true"
      />

      <div className="container-page relative z-3 py-14 lg:py-24">
        <div className="max-w-[640px]">
          <Reveal>
            <p className="eyebrow">La comunidad más grande de</p>
          </Reveal>

          <Reveal delay={80}>
            <h1 className="font-display text-[clamp(48px,8.4vw,88px)] leading-[0.95] font-black tracking-[-0.02em]">
              <span className="text-gradient-title block">PES &amp;</span>
              <span className="text-gradient-title block">
                <em className="not-italic text-white">e</em>Football
              </span>
            </h1>
          </Reveal>

          <Reveal delay={160}>
            <p className="mt-6 mb-8 max-w-[450px] text-base leading-relaxed text-white/72">
              La edición más intensa de la saga. Controles táctiles, física realista, estadios
              icónicos y la emoción del fútbol en cada pase.
            </p>
          </Reveal>

          <Reveal delay={240}>
            <div className="mb-11 flex flex-wrap gap-3.5 max-sm:flex-col">
              <a href="#torneos" className="btn btn-primary max-sm:w-full">
                <Play className="size-4" />
                Jugar PES 2021
              </a>
              <a href="#juego" className="btn btn-ghost max-sm:w-full">
                <Video className="size-[18px]" />
                Ver Gameplay
              </a>
            </div>
          </Reveal>

          <Reveal delay={320}>
            <dl className="flex flex-wrap items-center max-sm:gap-y-4">
              {HERO_STATS.map((stat, i) => (
                <div
                  key={stat.label}
                  className={`px-7 max-sm:px-5 ${i === 0 ? 'max-sm:pl-0' : ''} ${
                    i > 0 ? 'border-l border-white/16' : ''
                  }`}
                >
                  <dd className="font-display text-[28px] leading-tight font-extrabold text-pink drop-shadow-[0_0_18px_rgba(224,112,208,0.5)]">
                    {stat.value}
                  </dd>
                  <dt className="mt-1 text-[11px] font-semibold tracking-[0.18em] text-ink-3 uppercase">
                    {stat.label}
                  </dt>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </div>

      {/* Imagen del héroe */}
      <div className="pointer-events-none absolute inset-y-0 right-0 z-2 hidden w-[46%] md:flex lg:w-[46%]">
        <img
          src={HERO_IMAGE}
          alt="Futbolista con camiseta celeste y blanca besando un trofeo dorado"
          className="mask-fade-right size-full object-cover object-[78%_center]"
          fetchPriority="high"
          decoding="async"
        />
      </div>

      {/* Variante móvil: la imagen va debajo del texto */}
      <div className="pointer-events-none relative z-2 mt-9 h-[300px] w-full shrink-0 overflow-hidden md:hidden">
        <img
          src={HERO_IMAGE}
          alt="Futbolista con camiseta celeste y blanca besando un trofeo dorado"
          className="mask-fade-bottom size-full object-cover object-[60%_center]"
          loading="lazy"
          decoding="async"
        />
      </div>
    </section>
  );
}