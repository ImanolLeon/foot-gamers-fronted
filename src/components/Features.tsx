import { FEATURES } from '../data/content';

export function Features() {
  return (
    <section id="juego" className="border-t border-pitch/15 bg-paper py-20 lg:py-28">
      <div className="container-page grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
        <div className="self-start lg:sticky lg:top-28">
          <h2 className="max-w-[13ch] font-poster text-[clamp(44px,6vw,76px)] leading-[0.86] font-extrabold text-pitch uppercase">
            Lo que pasa cuando entras
          </h2>
          <p className="mt-6 max-w-[40ch] text-[16px] leading-[1.65] text-pitch/75">
            No es solo jugar. Es tener con quién, cuándo y por qué. Cuatro cosas que ya están
            montadas para que solo tengas que elegir equipo.
          </p>
        </div>

        <ul className="border-t border-pitch/20">
          {FEATURES.map((feature) => (
            <li
              key={feature.title}
              className="grid grid-cols-[40px_1fr] gap-5 border-b border-pitch/20 py-7 sm:grid-cols-[52px_1fr] sm:gap-7"
            >
              <span
                className="grid size-10 place-items-center border border-pitch/25 text-pitch sm:size-[52px]"
                aria-hidden="true"
              >
                <feature.icon className="size-5 sm:size-6" />
              </span>
              <div>
                <h3 className="font-poster text-[26px] leading-none font-bold text-pitch uppercase">
                  {feature.title}
                </h3>
                <p className="mt-2.5 max-w-[54ch] text-[15px] leading-[1.65] text-pitch/75">
                  {feature.desc}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
