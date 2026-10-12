import { Reveal } from './Reveal';
import { FEATURES } from '../data/content';

export function Features() {
  return (
    <section
      id="juego"
      className="relative bg-[radial-gradient(120%_70%_at_50%_118%,rgba(194,16,160,0.16)_0%,rgba(194,16,160,0)_62%)] py-20 lg:py-28"
    >
      <div className="container-page">
        <Reveal className="mb-13 text-center">
          <p className="eyebrow eyebrow-center">Únete a la comunidad</p>
          <h2 className="mx-auto max-w-[720px] font-display text-[clamp(28px,4vw,36px)] leading-[1.12] font-extrabold">
            Vive el fútbol con quienes también lo aman
          </h2>
        </Reveal>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.title} delay={i * 90} className="h-full">
              <article className={`feature-card h-full ${feature.highlighted ? 'border-pink/55' : ''}`}>
                <span
                  className={`feature-icon ${
                    feature.highlighted
                      ? 'bg-gradient-to-br from-[#f8b6ec] to-magenta text-purple-dark'
                      : ''
                  }`}
                >
                  <feature.icon className="size-6" />
                </span>
                <h3 className="mb-2.5 font-display text-lg font-bold">{feature.title}</h3>
                <p className="text-sm leading-[1.55] text-ink-2">{feature.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}