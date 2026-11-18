import assert from 'node:assert/strict';
const base = process.env.PANEL_TEST_BASE_URL;
if (base !== 'http://localhost:8082')
  throw new Error(
    'Usar únicamente instancia de pruebas con esquema aislado en 8082.',
  );
let checks = 0;
async function api(path, method = 'GET', body, token, status = 200) {
  const r = await fetch(base + path, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: 'Bearer ' + token } : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  });
  const data = await r.json().catch(() => null);
  assert.equal(r.status, status, JSON.stringify(data));
  checks++;
  return data;
}
const admin = (
  await api('/auth/login', 'POST', { username: 'imanol', contrasena: '123456' })
).token;
const prefix = 'bracket' + Date.now();
const players = [];
for (let i = 0; i < 16; i++)
  players.push(
    await api(
      '/auth/register',
      'POST',
      {
        username: prefix + i,
        email: prefix + i + '@example.com',
        contrasena: 'BracketTest123!',
      },
      null,
      201,
    ),
  );
const category = await api(
  '/categorias',
  'POST',
  { nombre: prefix, formato: '1v1' },
  admin,
  201,
);
const prize = await api(
  '/trofeos',
  'POST',
  { nombre: prefix, fecha: null, jugadorId: null },
  admin,
  201,
);
const t = await api(
  '/torneos',
  'POST',
  {
    nombre: prefix,
    categoriaId: category.id,
    trofeoId: prize.id,
    fechaInicio: '2026-11-01',
    fechaFin: '2026-11-30',
    cantidadJugadores: 16,
    cantidadGrupos: 8,
  },
  admin,
  201,
);
for (const p of players)
  await api('/torneos/' + t.id + '/inscripcion', 'POST', undefined, p.token);
const entrants = await api(
  '/torneos/' + t.id + '/participantes',
  'GET',
  undefined,
  admin,
);
await api(
  '/torneos/' + t.id + '/grupos',
  'POST',
  {
    tipoAsignacion: 'MANUAL',
    asignaciones: entrants.map((p, i) => ({
      jugadorId: p.id,
      nombreGrupo: String.fromCharCode(65 + Math.floor(i / 2)),
    })),
  },
  admin,
  201,
);
await api('/torneos/' + t.id + '/llaves', 'POST', undefined, admin, 201);
await api('/torneos/' + t.id + '/llaves', 'POST', undefined, admin, 400);
const bracket = () =>
  api('/torneos/' + t.id + '/bracket', 'GET', undefined, admin);
let rows = await bracket();
assert.equal(rows.length, 15);
const first = rows.find((m) => m.fase === 'OCTAVOS');
await api(
  '/partidos/' + first.id + '/ganador/' + first.equipos[0].bandoId,
  'PUT',
  undefined,
  players[0].token,
  403,
);
const final = rows.find((m) => m.fase === 'FINAL');
await api(
  '/partidos/' + final.id + '/ganador/' + first.equipos[0].bandoId,
  'PUT',
  undefined,
  admin,
  400,
);
for (const phase of ['OCTAVOS', 'CUARTOS', 'SEMIFINALES', 'FINAL']) {
  rows = await bracket();
  for (const m of rows.filter((m) => m.fase === phase))
    await api(
      '/partidos/' + m.id + '/ganador/' + m.equipos[0].bandoId,
      'PUT',
      undefined,
      admin,
    );
}
let done = await api('/torneos/' + t.id, 'GET', undefined, admin);
assert.equal(done.estado, 'TERMINADO');
assert(done.ganadorId);
rows = await bracket();
const changed = rows.find((m) => m.id === first.id);
const other = changed.equipos.find((e) => e.bandoId !== changed.ganadorId);
const dependent = new Set();
let current = changed.id;
while (true) {
  const next = rows.find(
    (m) => m.fuenteUnoId === current || m.fuenteDosId === current,
  );
  if (!next) break;
  dependent.add(next.id);
  current = next.id;
}
await api(
  '/partidos/' + changed.id + '/ganador/' + other.bandoId,
  'PUT',
  undefined,
  admin,
);
const updated = await bracket();
for (const m of updated) {
  if (dependent.has(m.id)) {
    assert.equal(m.ganadorId, null);
    assert.equal(m.resultado, null);
  } else if (m.id !== changed.id) {
    assert.deepEqual(
      m,
      rows.find((old) => old.id === m.id),
    );
  }
}
const next = updated.find(
  (m) => m.fuenteUnoId === changed.id || m.fuenteDosId === changed.id,
);
assert(next.equipos.some((e) => e.jugadorId === other.jugadorId));
done = await api('/torneos/' + t.id, 'GET', undefined, admin);
assert.equal(done.estado, 'EN_PROCESO');
assert.equal(done.faseActual, 'OCTAVOS');
assert.equal(done.ganadorId, null);
assert.equal(
  (await api('/trofeos/' + prize.id, 'GET', undefined, admin)).jugadorId,
  null,
);
for (const phase of ['CUARTOS', 'SEMIFINALES', 'FINAL']) {
  for (const m of (await bracket()).filter(
    (m) => m.fase === phase && !m.ganadorId,
  ))
    await api(
      '/partidos/' + m.id + '/ganador/' + m.equipos[0].bandoId,
      'PUT',
      undefined,
      admin,
    );
}
assert.equal(
  (await api('/torneos/' + t.id, 'GET', undefined, admin)).estado,
  'TERMINADO',
);
const before = await bracket();
const last = before.find((m) => m.fase === 'FINAL');
await api(
  '/partidos/' + last.id + '/ganador/' + last.ganadorId,
  'PUT',
  undefined,
  admin,
);
assert.deepEqual(await bracket(), before);
console.log(
  'PASS',
  checks,
  'respuestas: 16 equipos, 15 partidos, roles, cambio de ganador, limpieza de dependencias, campeón y repetición idempotente. Torneo',
  t.id,
);
