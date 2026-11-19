import { Link } from 'react-router-dom';

/** Pasos para preparar un torneo, visibles solo para el administrador. */
export function AdminSetupSteps() {
  return (
    <section className="live-card">
      <div className="live-heading">
        <h2>Prepara tu torneo</h2>
      </div>
      <div className="dashboard-steps">
        <Link to="/admin/categorias">
          <strong>01 · Configura</strong>
          <span>Categorías y formatos de competición</span>
        </Link>
        <Link to="/admin/trofeos">
          <strong>02 · Elige el premio</strong>
          <span>Trofeos que recibirán los campeones</span>
        </Link>
        <Link to="/admin/torneos">
          <strong>03 · Organiza</strong>
          <span>Inscritos, grupos, llaves y resultados</span>
        </Link>
        <Link to="/admin/participaciones">
          <strong>04 · Confirma</strong>
          <span>Participaciones y bandos de cada partido</span>
        </Link>
      </div>
    </section>
  );
}
