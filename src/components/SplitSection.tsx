import { SPLIT_CHECKS, SPLIT_IMAGE } from '../data/content';

export function SplitSection() {
  return (
    <section id="comunidad" className="border-t border-pitch/15 bg-paper-2">
      <div className="grid lg:grid-cols-2">
        {/* Imagen a sangre, tintada en verde de césped */}
        <div className="relative min-h-[340px] overflow-hidden bg-pitch lg:min-h-[580px]">
          <img
            src={SPLIT_IMAGE}
            alt="Jugadores con camiseta roja saliendo por el túnel del estadio con la Allianz Arena al fondo"
            className="absolute inset-0 size-full object-cover object-center opacity-75 mix-blend-luminosity"
            loading="lazy"
            decoding="async"
          />
          <div
            className="absolute inset-0 bg-gradient-to-t from-pitch-deep/90 via-pitch-deep/15 to-transparent"
            aria-hidden="true"
          />
          <p className="absolute inset-x-6 bottom-6 max-w-[22ch] font-poster text-[clamp(28px,4vw,44px)] leading-[0.92] font-bold text-chalk uppercase sm:inset-x-10 sm:bottom-10">
            Se juega los sábados. Se recuerda toda la temporada.
          </p>
        </div>

        {/* Texto */}
        <div className="flex flex-col justify-center px-5 py-16 sm:px-10 lg:px-16 lg:py-24">
          <h2 className="max-w-[12ch] font-poster text-[clamp(44px,5.5vw,72px)] leading-[0.86] font-extrabold text-pitch uppercase">
            Aquí nadie juega solo
          </h2>

          <p className="mt-6 max-w-[48ch] text-[16px] leading-[1.7] text-pitch/75">
            Entras a un grupo de gente que sabe lo que es perder una final en el minuto 90 y
            volver la semana siguiente. Encontrar rival es lo de menos; lo difícil es no quedarte
            con las ganas de la revancha.
          </p>

          <ul className="mt-8 grid gap-4  pt-7">
            {SPLIT_CHECKS.map((item) => (
              <li key={item} className="flex items-start gap-3.5 text-[15px] leading-[1.5] text-pitch">
                <span className="mt-[7px] size-2 flex-none bg-magenta" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>

        </div>
      </div>
    </section>
  );
}
