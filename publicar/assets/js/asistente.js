/* Pregúntale a Contraste
   Asistente sin IA: responde solo con los datos publicados en esta página, siempre con su fuente.
   Conserva la lógica del prototipo original y la extiende a las 20 autoridades y a las votaciones oficiales. */
(function () {
  'use strict';
  const A = window.CONTRASTE_APP; if (!A) return;
  const { P, PID, NEWS, E, VOT, GLOS, esc, norm, uniq, icon, fFecha, personVotes, OPC } = A;

  // Nombres cortos y alias para reconocer a cada autoridad
  const CORTO = {}; const ALIAS = {};
  P.forEach((p) => {
    const partes = p.nombre.split(' ');
    const ap = partes.length > 2 ? partes[partes.length - 2] : partes[partes.length - 1];
    CORTO[p.id] = ap;
    // Las fichas básicas solo se reconocen por nombre completo: muchos apellidos se repiten
    ALIAS[p.id] = p.basica ? uniq([norm(p.nombre), norm(p.corto || '')].filter((x) => x.length > 5)) : uniq([norm(p.nombre), norm(partes[0] + ' ' + ap), norm(ap), norm(p.cargoCorto)].filter((x) => x.length > 3));
  });
  // ajustes: apellidos compartidos y alias del prototipo original
  CORTO.tvodanovic = 'Tomás Vodanovic'; CORTO.pvodanovic = 'Paulina Vodanovic'; CORTO.kaiser = 'Kaiser';
  const extra = {
    tvodanovic: ['tomas vodanovic', 'alcalde vodanovic', 'alcalde de maipu', 'maipu'],
    pvodanovic: ['paulina vodanovic', 'paulina', 'senadora vodanovic', 'senadora por el maule', 'maule'],
    orrego: ['gobernador metropolitano', 'gobernador de santiago', 'gobierno de santiago'], mundaca: ['gobernador de valparaiso'],
    arrau: ['ministro de seguridad'], poduje: ['ministro de vivienda', 'minvu'], toledo: ['puente alto'], bassaletti: ['distrito 8'],
    walker: ['senador por coquimbo', 'coquimbo'], quiroz: ['ministro de hacienda', 'hacienda'], bellolio: ['providencia'],
    desbordes: ['alcalde de santiago'], espinoza: ['fidel'], kaiser: ['vanessa kaiser', 'senadora kaiser']
  };
  Object.keys(extra).forEach((id) => { if (!ALIAS[id]) return; ALIAS[id] = (id === 'tvodanovic' || id === 'pvodanovic') ? extra[id] : ALIAS[id].concat(extra[id]); });
  // «Kaiser» a secas también nombra a otras personas (Johannes Kaiser): no basta para identificar a la senadora
  if (ALIAS.kaiser) ALIAS.kaiser = ALIAS.kaiser.filter((x) => x !== 'kaiser');

  const EVK = {
    ruf: ['ruf', 'reglas de uso de la fuerza', 'uso de la fuerza'], gabinete: ['gabinete', 'cambio de ministro'],
    recorte: ['recorte', 'recortes'], reforma: ['megarreforma', 'mega reforma', 'reconstruccion nacional', 'impuesto de primera'],
    acuerdos: ['acuerdos nacionales', 'siete acuerdos', '7 acuerdos'], presupuesto2027: ['presupuesto 2027', 'ley de presupuestos', 'presupuesto']
  };
  const EV_BILL = { ruf: '15805-07', reforma: '18216-05', presupuesto2027: '18702-05' };
  const STOP = new Set(('quien quienes cual cuales donde cuando como sobre tiene tienen este esta estos estas ese esa eso para porque desde hasta entre ultima ultimas ultimo ultimos noticia noticias votacion votaciones voto votos votaron votado votar decision decisiones dijo dicho dice partido partidos fuente fuentes cargo perfil quiero saber dime muestrame mostrar busca buscar puedes podrias necesito informacion datos algun alguna favor contra abstencion autoridad autoridades contraste medios medio prensa cobertura recientes reciente ministro ministra alcalde alcaldesa gobernador senador senadora diputado diputada parlamentario parlamentarios regional region tema temas tienes sabes todos todas cosas algo ahora hace pasado tambien cuanto cuantos coberturas contrastar comparar compara').split(' '));
  const lc1 = (t) => t.charAt(0).toLowerCase() + t.slice(1);
  const esP = (p) => p.tipo === 'Diputados' || p.tipo === 'Senadores';
  const byD = (a, b) => b.d.localeCompare(a.d);
  const INICIO = ['¿Cómo votaron las RUF?', '¿Cómo votó Walker la megarreforma?', '¿De qué partido es Desbordes?', '¿Qué dijo Provoste sobre el presupuesto?', '¿Qué significa «Pareo»?'];

  // Piezas de respuesta (HTML)
  const itNot = (n) => '<a class="it" href="' + esc(n.url) + '" target="_blank" rel="noopener"><span class="m">' + esc(n.medio + ' · ' + n.fecha + ' · ' + (CORTO[n.pid] || n.persona)) + '</span><span class="t">' + esc(n.titulo) + '</span></a>' +
    (n.ev ? '<a class="it" href="#/contrastar/' + n.ev + '"><span class="m">Contrastar cobertura</span><span class="t">' + esc(E[n.ev].titulo) + '</span></a>' : '');
  const itAut = (p, tab) => '<a class="it" href="#/autoridad/' + p.id + (tab ? '/' + tab : '') + '"><span class="m">' + esc(p.cargoCorto + ' · ' + p.partido) + '</span><span class="t">' + esc(p.nombre) + '</span></a>';
  const itEv = (k) => '<a class="it" href="#/contrastar/' + k + '"><span class="m">Contrastar cobertura · ' + E[k].items.length + ' medios</span><span class="t">' + esc(E[k].titulo) + '</span></a>';
  const itVotOf = (v, p) => '<a class="it" href="#/votacion/' + v.id + '"><span class="m">' + esc(v.camara + ' · ' + fFecha(v.fecha) + ' · Boletín ' + v.boletin) + '</span><span class="t">' + esc((CORTO[p.id] || p.nombre) + ': ' + OPC[v.suVoto] + ' — ' + (v.materiaCorta || 'votación del proyecto')) + '</span></a>';
  const itDec = (v, p) => '<a class="it" href="' + esc(v.url) + '" target="_blank" rel="noopener"><span class="m">' + esc((CORTO[p.id] || p.nombre) + ' · ' + v.fecha + ' · ' + v.instancia + ' · ' + v.voto) + '</span><span class="t">' + esc(v.titulo) + '</span></a>';
  const itFue = (f) => '<a class="it" href="' + esc(f.url) + '" target="_blank" rel="noopener"><span class="m">' + esc(f.fuente + ' · ' + f.estado) + '</span><span class="t">' + esc(f.titulo) + '</span></a>';
  const itVoto = (v) => '<a class="it" href="#/votacion/' + v.id + '"><span class="m">' + esc(v.camara + ' · ' + fFecha(v.fecha)) + '</span><span class="t">' + esc(v.totales.si + ' a favor, ' + v.totales.no + ' en contra, ' + v.totales.abst + ' abstenciones — ' + (v.materiaCorta || '')) + '</span></a>';

  function responder(texto, prevIds) {
    const nq = ' ' + norm(texto).replace(/[^a-z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim() + ' ';
    const has = (ph) => nq.includes(' ' + ph + ' ');
    const rx = (r) => r.test(nq);
    const nWords = nq.trim().split(' ').filter(Boolean).length;
    const L = [], IT = [], N = []; let CH = [];
    let ids = P.filter((p) => (ALIAS[p.id] || []).some(has)).map((p) => p.id);
    let ambiguo = false;
    if (has('vodanovic') && !ids.includes('tvodanovic') && !ids.includes('pvodanovic')) {
      if (rx(/ senador| senado /)) ids.push('pvodanovic'); else if (rx(/ alcald| municip/)) ids.push('tvodanovic'); else ambiguo = true;
    }
    const I = {
      opinion: rx(/ (es|sera|fue|era) (un |una |el |la )?(buen|bueno|buena|mal|malo|mala|mejor|peor) | (buen|buena|mal|mala|mejor|peor) (ministro|ministra|alcalde|alcaldesa|gobernador|senador|senadora|diputado|diputada|politico|politica|persona|autoridad|gestion) | corrupt| opinas | opinion | que piensas | votar por | recomiendas | confiable | mentiros| ladron| facho| comunista de mierda /),
      saludo: nWords <= 4 && rx(/^ (hola|buenas|buen dia|buenos dias|buenas tardes|buenas noches|hey|que tal) /),
      gracias: nWords <= 4 && rx(/ (gracias|genial|perfecto|excelente) /),
      about: rx(/ que es contraste | que haces | que puedes | como funciona| para que sirve| ayuda | quien eres /),
      glos: rx(/ significa| que es | que quiere decir| etiqueta/),
      metodo: rx(/ metodolog| como verific| de donde sacan| actualiz| fotos | fotografia/),
      votos: rx(/ vot| decisi| decidi| aprob| rechaz| a favor | en contra | absten/),
      noticias: rx(/ noticia| prensa | dijo | dicho | dice | declar| public| ultim| reciente| que ha pasado | que paso | hablo /),
      partido: rx(/ partido| milit| independiente | bancada /),
      quien: rx(/ quien | cargo | trayectoria | biograf| resena | antecedentes | perfil /),
      fuentes: rx(/ fuentes? | lobby | patrimonio | probidad | servel | transparencia | oficial/),
      conf: rx(/ versiones | version | contradic| no coincid/),
      contrastar: rx(/ contrast| compar| distintos medios /)
    };
    const evKey = Object.keys(EVK).find((k) => EVK[k].some(has)) || '';
    const GK = Object.keys(GLOS).find((k) => has(norm(k)));
    const pron = rx(/^ y | (su|sus|ella|el|lo|le|este|esta) /);
    if (!ids.length && !ambiguo && pron && prevIds.length && !(I.glos && GK)) ids = prevIds.slice();
    const Ps = ids.map((id) => PID[id]).slice(0, 3);

    if (I.saludo && !Ps.length) { L.push('Hola. Puedo responder sobre las ' + P.length + ' autoridades de Contraste: quiénes son, qué publicaron los medios, cómo votaron y de qué fuente viene cada dato.'); return { L, IT, CH: INICIO.slice(0, 4), ids: [] }; }
    if (I.gracias && !Ps.length) { L.push('De nada. Si necesitas algo más, pregúntame.'); return { L, IT, CH: INICIO.slice(0, 3), ids: prevIds }; }
    if (ambiguo) { L.push('Hay dos Vodanovic en Contraste. ¿A quién te refieres?'); IT.push(itAut(PID.tvodanovic), itAut(PID.pvodanovic)); const base = texto.replace(/vodanovic/i, '').trim(); return { L, IT, CH: [base + ' Tomás Vodanovic', base + ' Paulina Vodanovic'], ids: [] }; }
    if (I.opinion) {
      L.push('Contraste no califica a las autoridades ni opina sobre ellas. Te muestro lo que hicieron y lo que publicaron los medios, con su fuente, para que saques tus propias conclusiones.');
      Ps.forEach((p) => { L.push(p.nombre + ': ' + lc1(p.cargo) + '. Partido o condición: ' + p.partido + '.'); IT.push(itAut(p)); });
      return { L, IT, CH: Ps.length ? ['Últimas noticias de ' + CORTO[Ps[0].id]] : INICIO.slice(0, 3), ids };
    }
    if (GK && (I.glos || nWords <= 3) && !Ps.length) { L.push('«' + GK + '»: ' + GLOS[GK]); L.push('Las etiquetas y los conceptos legislativos se explican en Fuentes y metodología.'); return { L, IT, CH: ['¿Qué significa «Abstención»?', '¿Qué significa «Quórum»?', '¿Cómo verifican los datos?'].filter((c) => !c.includes(GK)), ids: [] }; }
    if ((I.about && !Ps.length) || (!Ps.length && nWords <= 2 && rx(/ ayuda /))) {
      L.push('Soy el asistente de Contraste. Respondo solo con lo publicado aquí: ' + P.length + ' autoridades, ' + NEWS.length + ' noticias enlazadas a su medio, ' + Object.keys(VOT).length + ' votaciones oficiales y sus fuentes.');
      L.push('No uso internet ni invento datos. Si algo no está aquí, te lo digo.'); return { L, IT, CH: INICIO.slice(0, 4), ids: [] };
    }
    if (I.metodo && !Ps.length) { L.push('Verificamos cargos y partidos en fuentes oficiales o en al menos dos medios. Las votaciones vienen de los registros oficiales de la Cámara y el Senado. Los datos están al ' + fFecha(A.CORTE) + ' y no se actualizan solos.'); IT.push('<a class="it" href="#/metodologia"><span class="m">Contraste</span><span class="t">Fuentes y metodología</span></a>'); return { L, IT, CH: ['¿Qué significa «Revisado»?', '¿Qué autoridades hay?'], ids: [] }; }

    if (Ps.length) {
      let ints = ['conf', 'votos', 'contrastar', 'noticias', 'partido', 'fuentes', 'quien'].filter((k) => I[k]);
      if (evKey && !ints.length) ints = ['votos', 'noticias'];
      if (!ints.length) ints = ['quien'];
      if (ints.includes('contrastar')) ints = ints.filter((k) => k !== 'noticias');
      if (ints.length > 1) ints = ints.filter((k) => k !== 'quien');
      ints = ints.slice(0, 2);
      Ps.forEach((p) => {
        const nm = CORTO[p.id] || p.nombre;
        ints.forEach((it) => {
          if (it === 'quien') { L.push(p.nombre + ' es ' + lc1(p.cargo) + '. Período: ' + p.periodo + '. ' + p.resena); IT.push(itAut(p)); }
          else if (it === 'partido') { L.push('Partido o condición de ' + nm + ': ' + p.partido + '.'); (p.conf || []).filter((c) => /milit|partido/i.test(c.tema)).forEach((c) => L.push('Ojo, las fuentes no siempre coinciden: ' + c.aFuente + ' dice «' + c.aDice + '» y ' + c.bFuente + ' dice «' + c.bDice + '». ' + c.aclara)); }
          else if (it === 'fuentes') { L.push('Fuentes de ' + nm + ':'); (p.fue || []).forEach((f) => IT.push(itFue(f))); }
          else if (it === 'conf') { if ((p.conf || []).length) { L.push(nm + ' tiene ' + p.conf.length + (p.conf.length === 1 ? ' dato' : ' datos') + ' con versiones distintas según la fuente.'); IT.push(itAut(p, 'fuentes')); } else L.push('No registramos datos con versiones distintas para ' + nm + '.'); }
          else if (it === 'contrastar') { const evs = uniq(NEWS.filter((n) => (n.pid === p.id || (n.tambien || []).includes(p.id)) && n.ev).map((n) => n.ev)); if (evs.length) { L.push('Coberturas sobre ' + nm + ' que puedes contrastar:'); evs.forEach((k) => IT.push(itEv(k))); } else { L.push('Aún no hay un hecho de ' + nm + ' con cobertura agrupada para contrastar. Sí están sus noticias en el perfil.'); IT.push(itAut(p, 'noticias')); } }
          else if (it === 'votos') {
            let vs = personVotes(p);
            if (evKey && EV_BILL[evKey]) vs = vs.filter((v) => v.boletin === EV_BILL[evKey]);
            if (esP(p) && vs.length) {
              const dir = has('a favor') ? 'A' : has('en contra') ? 'C' : rx(/ absten/) ? 'B' : '';
              if (dir) vs = vs.filter((v) => v.suVoto === dir);
              L.push(vs.length ? 'Votos de ' + nm + ' según el registro oficial (' + vs.length + '):' : 'No encontré votos con ese criterio para ' + nm + '.');
              vs.slice(0, 5).forEach((v) => IT.push(itVotOf(v, p)));
              if (vs.length > 5) IT.push(itAut(p, 'votaciones'));
            } else if (esP(p)) {
              L.push(evKey ? 'No hay un voto oficial de ' + nm + ' sobre ese proyecto entre las votaciones que reúne Contraste.' : 'Estas son las decisiones registradas de ' + nm + ':');
              (p.vot || []).slice().sort(byD).slice(0, 4).forEach((v) => IT.push(itDec(v, p)));
            } else {
              L.push(nm + ' no vota proyectos de ley (es ' + lc1(p.cargoCorto) + '). Estas son sus decisiones registradas:');
              (p.vot || []).slice().sort(byD).slice(0, 4).forEach((v) => IT.push(itDec(v, p)));
            }
          } else if (it === 'noticias') {
            let ns = NEWS.filter((n) => n.pid === p.id || (n.tambien || []).includes(p.id)).sort(byD);
            if (evKey) { const f = ns.filter((n) => n.ev === evKey || (EV_BILL[evKey] && n.proyecto === EV_BILL[evKey])); if (f.length) ns = f; }
            L.push('Noticias de ' + nm + ' (' + ns.length + '), de la más reciente a la más antigua:');
            ns.slice(0, 3).forEach((n) => IT.push(itNot(n)));
            if (ns.length > 3) IT.push(itAut(p, 'noticias'));
          }
        });
      });
      CH = Ps.length === 1 ? ['Últimas noticias de ' + CORTO[Ps[0].id], esP(Ps[0]) ? '¿Cómo ha votado ' + CORTO[Ps[0].id] + '?' : 'Decisiones de ' + CORTO[Ps[0].id], 'Fuentes oficiales de ' + CORTO[Ps[0].id]].filter((c) => !c.toLowerCase().includes(ints[0] === 'noticias' ? 'noticias' : '·')) : Ps.map((p) => 'Perfil de ' + CORTO[p.id]);
      return { L, IT, CH: CH.slice(0, 3), ids };
    }

    if (evKey) {
      if (I.votos && EV_BILL[evKey]) {
        const vs = Object.keys(VOT).map((k) => VOT[k]).filter((v) => v.boletin === EV_BILL[evKey]).sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));
        L.push('Estas son las votaciones más recientes del proyecto en el registro oficial. Cada una muestra el voto de todos los parlamentarios:');
        vs.slice(0, 3).forEach((v) => IT.push(itVoto(v)));
        IT.push('<a class="it" href="#/proyecto/' + EV_BILL[evKey] + '#votaciones"><span class="m">Boletín ' + EV_BILL[evKey] + '</span><span class="t">Ver el historial completo de votaciones</span></a>');
      } else if (E[evKey]) {
        L.push(E[evKey].titulo + ' (' + E[evKey].fecha + '). Lo cubrieron ' + E[evKey].items.length + ' medios: ' + E[evKey].items.map((x) => x.medio).join(', ') + '.');
        if (E[evKey].coinc[0]) L.push('En lo que coinciden: ' + E[evKey].coinc[0]);
        IT.push(itEv(evKey));
      }
      return { L, IT, CH: ['¿Cómo votaron las RUF?', 'Coberturas para contrastar'], ids: [] };
    }

    const tipos = [['Alcaldes', / alcald/], ['Gobernadores', / gobernador/], ['Ministros', / ministr/], ['Diputados', / diputad/], ['Senadores', / senador/]].filter((t) => rx(t[1])).map((t) => t[0]);
    if (tipos.length || rx(/ autoridades | quienes estan | lista /)) {
      const ps = P.filter((p) => !tipos.length || tipos.includes(p.tipo));
      L.push('En Contraste hay ' + ps.length + (ps.length === 1 ? ' autoridad' : ' autoridades') + (tipos.length ? ' de ese tipo:' : ':'));
      ps.slice(0, 8).forEach((p) => IT.push(itAut(p)));
      if (ps.length > 8) IT.push('<a class="it" href="#/autoridades"><span class="m">Directorio</span><span class="t">Ver todas las autoridades</span></a>');
      return { L, IT, CH: ps.slice(0, 2).map((p) => 'Últimas noticias de ' + CORTO[p.id]), ids: [] };
    }
    if (I.contrastar) { L.push('Estos hechos tienen cobertura de varios medios para comparar lado a lado:'); Object.keys(E).forEach((k) => IT.push(itEv(k))); return { L, IT, CH: ['¿Cómo votaron las RUF?'], ids: [] }; }

    const toks = uniq(nq.trim().split(' ').filter((w) => w.length >= 5 && !STOP.has(w)).map((w) => (w.length > 6 ? w.slice(0, -1) : w)));
    if (toks.length) {
      const ns = NEWS.filter((n) => toks.some((t) => norm(n.titulo + ' ' + n.resumen + ' ' + n.tema).includes(t))).sort(byD);
      if (ns.length) { L.push('Encontré ' + ns.length + (ns.length === 1 ? ' noticia' : ' noticias') + ' relacionadas. Las más recientes:'); ns.slice(0, 4).forEach((n) => IT.push(itNot(n))); return { L, IT, CH: uniq(ns.map((n) => n.pid)).slice(0, 2).map((id) => 'Últimas noticias de ' + CORTO[id]), ids: [] }; }
    }
    L.push('No encontré eso en Contraste. Solo respondo con lo que está publicado aquí: ' + P.length + ' autoridades, sus noticias, votaciones, decisiones y fuentes.');
    L.push('Prueba nombrando a una autoridad, un tema o un proyecto, o usa la búsqueda.');
    return { L, IT, CH: INICIO.slice(0, 3), ids: prevIds };
  }

  // Interfaz
  const S = { open: false, turns: [] };
  const cap = document.createElement('div'); document.body.appendChild(cap);
  function draw() {
    if (!S.open) {
      cap.innerHTML = '<button type="button" class="fab" data-chat="open" aria-label="Pregúntale a Contraste" data-tip="Pregúntale a Contraste">' + icon('chat', 22) + '<span class="lbl">Pregúntale a Contraste</span></button>';
      return;
    }
    let ctx = [];
    const log = S.turns.map((t, i) => {
      const r = responder(t, ctx); ctx = r.ids && r.ids.length ? r.ids : ctx;
      const last = i === S.turns.length - 1;
      return '<div class="msg-q">' + esc(t) + '</div><div class="msg-a">' + r.L.map((l) => '<p>' + esc(l) + '</p>').join('') + (r.IT.length ? '<div style="display:flex;flex-direction:column;gap:6px">' + r.IT.join('') + '</div>' : '') + (r.N || []).map((n) => '<p class="note">' + esc(n) + '</p>').join('') + '</div>' +
        (last && r.CH.length ? '<div class="chat-chips">' + r.CH.map((c) => '<button type="button" data-chat="ask" data-q="' + esc(c) + '">' + esc(c) + '</button>').join('') + '</div>' : '');
    }).join('');
    cap.innerHTML = '<section class="chat" role="dialog" aria-label="Pregúntale a Contraste"><div class="chat-head"><div style="flex:1;min-width:0"><h2>Pregúntale a Contraste</h2><p>Responde solo con datos de esta página, con su fuente.</p></div>' +
      (S.turns.length ? '<button type="button" class="btn btn-quiet btn-sm" style="color:#C3CDE0" data-chat="clear">Borrar</button>' : '') +
      '<button type="button" class="head-icon" data-chat="close" aria-label="Cerrar asistente">' + icon('x', 20) + '</button></div>' +
      '<div class="chat-body"><div class="chat-log" aria-live="polite"><div class="msg-a"><p>Hola. Pregúntame por cualquiera de las ' + P.length + ' autoridades, un tema, un proyecto de ley o una votación. Si algo no está en Contraste, te lo digo: no invento datos.</p></div>' +
      (S.turns.length ? log : '<div class="chat-chips">' + INICIO.map((c) => '<button type="button" data-chat="ask" data-q="' + esc(c) + '">' + esc(c) + '</button>').join('') + '</div>') + '</div></div>' +
      '<form class="chat-form" data-chat-form><label class="sr-only" for="cq">Escribe tu pregunta</label><input id="cq" autocomplete="off" placeholder="Ej.: ¿Cómo votó Walker las RUF?" enterkeyhint="send"><button class="btn btn-primary" type="submit" aria-label="Enviar pregunta" style="min-height:44px;width:44px;padding:0">' + icon('send', 18) + '</button></form></section>';
    const i = cap.querySelector('#cq'); if (i) i.focus({ preventScroll: true });
  }
  cap.addEventListener('click', (e) => {
    const b = e.target.closest('[data-chat]'); if (!b) { if (e.target.closest('a.it') && matchMedia('(max-width: 640px)').matches) { S.open = false; draw(); } return; }
    const a = b.dataset.chat;
    if (a === 'open') { S.open = true; draw(); }
    else if (a === 'close') { S.open = false; draw(); cap.querySelector('.fab').focus(); }
    else if (a === 'clear') { S.turns = []; draw(); }
    else if (a === 'ask') { S.turns.push(b.dataset.q); S.turns = S.turns.slice(-20); draw(); }
  });
  cap.addEventListener('submit', (e) => {
    if (!e.target.matches('[data-chat-form]')) return; e.preventDefault();
    const q = e.target.querySelector('input').value.trim(); if (!q) return;
    S.turns.push(q); S.turns = S.turns.slice(-20); draw();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && S.open) { S.open = false; draw(); } });
  window.addEventListener('contraste:render', (e) => { const r = e.detail; cap.style.display = ''; document.body.classList.toggle('on-home', r.name === 'inicio'); });
  draw();
})();
