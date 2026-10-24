import { Shield } from './Icons';
import { PitchMarkings } from './PitchMarkings';
import {  NEXT_MATCH } from '../data/content';

export function Hero() {
  return (
    <section id="inicio" className="relative isolate overflow-hidden bg-paper">
      {/* Trazado de campo: el único gesto decorativo del héroe */}
      <PitchMarkings className="pointer-events-none absolute -right-[24%] -bottom-[38%] z-0 h-[150%] w-[120%] text-pitch/[0.07] sm:-right-[8%] sm:w-[82%]" />

      <div className="container-page relative z-10 grid items-center gap-14 pt-12 pb-16 lg:grid-cols-[minmax(0,1.12fr)_minmax(360px,0.88fr)] lg:gap-16 lg:pt-20 lg:pb-24">
        <div>
        
          <h1
            className="hero-in mt-5 font-poster text-[clamp(56px,8vw,104px)] leading-[0.82] font-extrabold tracking-[-0.005em] text-pitch uppercase"
            style={{ animationDelay: '120ms' }}
          >
            Cada jornada
            <br />
            tiene su
            <br />
            campeón
          </h1>

          <p
            className="hero-in mt-7 max-w-[45ch] text-[17px] leading-[1.6] text-pitch/75"
            style={{ animationDelay: '200ms' }}
          >
            Torneos semanales de PES 2021 para jugadores que quieren algo más que partidos
            sueltos. Elige equipo, compite y deja tu nombre en la tabla.
          </p>

          <div
            className="hero-in mt-8 flex flex-wrap items-center gap-x-7 gap-y-4"
            style={{ animationDelay: '280ms' }}
          >
      
          </div>

         
        </div>

        {/* Cartelera de la próxima jornada: el objeto memorable de la página */}
        <aside
          className="hero-in relative w-full max-w-[420px] lg:justify-self-end"
          aria-label="Detalles de la próxima jornada"
          style={{ animationDelay: '300ms' }}
        >
          <div
            className="absolute inset-0 translate-x-2 translate-y-2 rounded-[3px] border border-pitch/30"
            aria-hidden="true"
          />

          <div className="relative rounded-[3px] bg-pitch-deep px-6 pt-6 pb-7 text-chalk shadow-[10px_10px_0_0_rgba(12,59,39,0.1)]">
            <div className="flex items-start justify-between gap-5">
              <div>
                <p className="text-xs font-medium text-chalk/55">Próxima jornada</p>
                <p className="mt-2 font-poster text-[28px] leading-[0.9] font-bold uppercase">
                  {NEXT_MATCH.competition}
                </p>
              </div>
              <div className="text-right">
                <span className="block font-poster text-[64px] leading-[0.7] font-extrabold text-magenta">
                  {NEXT_MATCH.matchday}
                </span>
                <span className="mt-1 block text-[11px] text-chalk/50">Jornada</span>
              </div>
            </div>

            <div className="mt-6 border-t border-chalk/15 pt-5">
              <div className="flex items-center gap-3">
                <span
                  className="grid size-9 flex-none place-items-center rounded-[2px] border border-chalk/25 font-poster text-sm font-bold"
                  aria-hidden="true"
                >
                  TÚ
                </span>
                <span>
                  <span className="block text-sm font-semibold">Tu equipo</span>
                  <span className="block text-[11px] text-chalk/55">
                    Elige escudo al inscribirte
                  </span>
                </span>
              </div>

              <p className="my-3 flex items-center gap-3 text-[11px] text-chalk/55">
                <span className="h-px flex-1 bg-chalk/15" aria-hidden="true" />
                contra
                <span className="h-px flex-1 bg-chalk/15" aria-hidden="true" />
              </p>

              <div className="flex items-center gap-3">
                <span
                  className="grid size-9 flex-none place-items-center rounded-[2px] border border-chalk/25 text-chalk/60"
                  aria-hidden="true"
                >
                  <Shield className="size-4" />
                </span>
                <span>
                  <span className="block text-sm font-semibold">Rival por sorteo</span>
                  <span className="block text-[11px] text-chalk/55">Se sortea el viernes</span>
                </span>
              </div>
            </div>

            <div className="mt-5 flex items-center justify-between gap-4 text-xs text-chalk/60">
              <span>{NEXT_MATCH.date}</span>
              <span>{NEXT_MATCH.slots}</span>
            </div>

            {/* Perforación del ticket */}
            <div className="relative my-5" aria-hidden="true">
              <div className="border-t border-dashed border-chalk/20" />
              <span className="absolute top-1/2 -left-8 size-4 -translate-y-1/2 rounded-full bg-paper" />
              <span className="absolute top-1/2 -right-8 size-4 -translate-y-1/2 rounded-full bg-paper" />
            </div>

            <a href="#torneos" className="l-btn l-btn-chalk w-full">
              Reservar mi cupo
            </a>
            <p className="mt-3 text-center text-[11px] text-chalk/55">
              {NEXT_MATCH.left}. {NEXT_MATCH.note}.
            </p>
          </div>
        </aside>
      </div>
    </section>
  );
}
