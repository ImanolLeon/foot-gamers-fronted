import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PitchMarkings } from './PitchMarkings';
import { RegistroModal } from './RegistroModal';
import { CTA_DETAILS, CTA_SOCIALS } from '../data/content';
import { useAuth } from '../hooks/useAuth';

export function CtaSection() {
  const { isAuthenticated } = useAuth();
  const [registroAbierto, setRegistroAbierto] = useState(false);

  return (
    <section
      id="torneos"
      className="relative isolate overflow-hidden border-t border-pitch/20 bg-pitch-deep text-chalk"
    >
      <PitchMarkings className="pointer-events-none absolute -top-[35%] right-0 z-0 h-[170%] w-[85%] text-chalk/[0.06]" />

      <div className="container-page relative z-10 grid gap-14 py-20 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20 lg:py-28">
        <div>
         
          <h2 className="mt-4 font-poster text-[clamp(52px,8vw,104px)] leading-[0.84] font-extrabold uppercase">
            El sábado
            <br />
            hay jornada
          </h2>

          <p className="mt-6 max-w-[46ch] text-[16px] leading-[1.7] text-chalk/70">
            Inscríbete antes del viernes a las 20:00. Se juega en una sola noche, con 16 equipos y
            un campeón que se lleva algo más que el título.
          </p>

          

  
        </div>

        <dl className="">
          {CTA_DETAILS.map((detail) => (
            <div
              key={detail.label}
              className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1  py-4"
            >
              <dt className="text-sm text-chalk/55">{detail.label}</dt>
              <dd className="font-poster text-[22px] leading-none font-semibold uppercase">
                {detail.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <RegistroModal open={registroAbierto} onClose={() => setRegistroAbierto(false)} />
    </section>
  );
}
