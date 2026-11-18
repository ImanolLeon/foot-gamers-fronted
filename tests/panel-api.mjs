import assert from 'node:assert/strict';
const base = process.env.PANEL_TEST_BASE_URL;
if (base !== 'http://localhost:8082')
  throw new Error(
    'Prueba destructiva de datos sintéticos: requiere backend aislado en localhost:8082.',
  );
let checks = 0;
async function api(path, method = 'GET', body, token, status = 200) {
  const res = await fetch(base + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const data = await res.json().catch(() => null);
  assert.equal(
    res.status,
    status,
    method + ' ' + path + ' ' + JSON.stringify(data),
  );
  checks++;
  return data;
}
const auth = await api('/auth/login', 'POST', {
  username: 'imanol',
  contrasena: '123456',
});
const admin = auth.token;
const prefix = 'panel' + Date.now();
const players = [];
for (let i = 0; i < 3; i++)
  players.push(
    await api(
      '/auth/register',
      'POST',
      {
        username: prefix + i,
        email: prefix + i + '@example.com',
        contrasena: 'PanelTest123!',
      },
      null,
      201,
    ),
  );
await api(
  '/categorias',
  'POST',
  { nombre: 'Prohibida', formato: '1v1' },
  players[0].token,
  403,
);
const category = await api(
  '/categorias',
  'POST',
  { nombre: prefix, formato: '1v1' },
  admin,
  201,
);
const trophy = await api(
  '/trofeos',
  'POST',
  { nombre: 'Copa ' + prefix, fecha: null, jugadorId: null },
  admin,
  201,
);
const tournament = await api(
  '/torneos',
  'POST',
  {
    nombre: prefix,
    categoriaId: category.id,
    trofeoId: trophy.id,
    fechaInicio: '2026-11-01',
    fechaFin: '2026-11-30',
    cantidadJugadores: 4,
    cantidadGrupos: 2,
  },
  admin,
  201,
);
assert.equal(tournament.trofeoId, trophy.id);
const id = tournament.id;
const open = await api(
  '/torneos/disponibles',
  'GET',
  undefined,
  players[0].token,
);
assert(
  open.content.some(
    (t) => t.id === id && t.cuposDisponibles === 4 && !t.yaInscrito,
  ),
);
for (const token of [admin, ...players.map((p) => p.token)])
  await api('/torneos/' + id + '/inscripcion', 'POST', undefined, token);
const full = await api(
  '/torneos/disponibles',
  'GET',
  undefined,
  players[0].token,
);
assert(
  !full.content.some((t) => t.id === id),
  'Un torneo lleno no debe ofrecer inscripciones',
);
const entrants = await api(
  '/torneos/' + id + '/participantes',
  'GET',
  undefined,
  admin,
);
assert.equal(entrants.length, 4);
const mine = await api(
  '/jugadores/mis-torneos',
  'GET',
  undefined,
  players[0].token,
);
assert(mine.content.some((t) => t.id === id));
await api(
  '/torneos/' + id + '/grupos',
  'POST',
  {
    tipoAsignacion: 'MANUAL',
    asignaciones: entrants.map((p, i) => ({
      jugadorId: p.id,
      nombreGrupo: i < 2 ? 'A' : 'B',
    })),
  },
  admin,
  201,
);
const matches = await api(
  '/torneos/' + id + '/partidos/grupos',
  'POST',
  undefined,
  admin,
  201,
);
assert.equal(matches.length, 2);
async function finish(match) {
  const ps = await api(
    '/partidos/' + match.id + '/participaciones',
    'GET',
    undefined,
    admin,
  );
  assert.equal(ps.length, 2);
  for (const p of ps)
    await api(
      '/participaciones/' + p.id + '/confirmar',
      'PUT',
      undefined,
      admin,
    );
  await api(
    '/partidos/' + match.id + '/confirmar?resultado=2-1',
    'PUT',
    undefined,
    admin,
  );
  const winner = ps.find((p) => p.numeroLado === 1);
  await api(
    '/partidos/' + match.id + '/ganador/' + winner.bandoId,
    'PUT',
    undefined,
    admin,
  );
}
for (const m of matches) await finish(m);
const groups = await api(
  '/torneos/' + id + '/grupos',
  'GET',
  undefined,
  players[0].token,
);
const table = await api(
  '/grupos/' + groups[0].id + '/clasificacion',
  'GET',
  undefined,
  players[0].token,
);
assert(table.some((p) => p.puntos === 3));
const personal = await api(
  '/jugadores/mis-partidos',
  'GET',
  undefined,
  players[0].token,
);
assert((personal.totalElements ?? personal.page?.totalElements) > 0);
await api('/torneos/' + id + '/llaves', 'POST', undefined, admin, 201);
for (let step = 0; step < 3; step++) {
  const pending = await api(
    '/torneos/' + id + '/proximaRonda',
    'GET',
    undefined,
    admin,
  );
  for (const m of pending) {
    const ps = await api(
      '/partidos/' + m.id + '/participaciones',
      'GET',
      undefined,
      admin,
    );
    if (ps.length === 2) await finish(m);
  }
}
const done = await api('/torneos/' + id, 'GET', undefined, admin);
assert.equal(done.estado, 'TERMINADO');
assert(done.ganadorId);
const prize = await api('/trofeos/' + trophy.id, 'GET', undefined, admin);
assert.equal(prize.jugadorId, done.ganadorId);
for (const resource of [
  'usuarios',
  'jugadores',
  'categorias',
  'bando',
  'trofeos',
  'partidos',
  'participaciones',
  'torneos',
]) {
  const p = await api(
    '/' + resource + '?pagina=0&tamano=1',
    'GET',
    undefined,
    admin,
  );
  assert(Array.isArray(p.content));
}
console.log(
  'PASS: ' +
    checks +
    ' respuestas verificadas; inscripción, roles, grupos manuales, resultados, clasificación, eliminatorias y campeón.',
);
