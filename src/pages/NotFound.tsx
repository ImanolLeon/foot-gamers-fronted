import { Link } from 'react-router-dom';
import { Crown } from '../components/Icons';

export function NotFound() {
  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden bg-gradient-to-br from-[#1a0526] via-[#2e0a46] to-[#5a1180] px-5 text-center">
      <div
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-bg to-transparent"
        aria-hidden="true"
      />

      <div className="relative">
        <span
          className="mx-auto mb-7 grid size-14 place-items-center rounded-2xl bg-gradient-to-br from-pink via-magenta to-purple shadow-[0_0_24px_rgba(194,16,160,0.55)]"
          aria-hidden="true"
        >
          <Crown className="size-7 text-white" />
        </span>

        <p className="font-display text-[clamp(80px,16vw,150px)] leading-none font-black text-gradient-title">
          404
        </p>

        <h1 className="mt-2 font-display text-2xl font-extrabold">Esta jugada no existe</h1>
        <p className="mx-auto mt-3 max-w-md text-ink-2">
          La página que buscas se fue fuera de campo. Vuelve al inicio y sigue jugando.
        </p>

        <Link to="/" className="btn btn-primary btn-lg mt-9">
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}