/* Contraste · aplicación
   JavaScript sin dependencias. Rutas con # para que cualquier vista se pueda compartir
   y funcione igual desde el disco o publicada en Netlify. */
(function () {
  'use strict';

  const D = window.CONTRASTE_DATA;
  const LEG = window.CONTRASTE_LEG || { consulta: '', proyectos: [], votaciones: {}, diputados: {}, senadores: {}, meta: {} };

  /* =========================================================
     Utilidades
     ========================================================= */
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (t) => String(t || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
  const uniq = (xs) => xs.filter((x, i) => xs.indexOf(x) === i);
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const MES = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
  const MES_L = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const fFecha = (iso) => { if (!iso) return ''; const [y, m, d] = iso.split('-').map(Number); return d ? d + ' ' + MES[m - 1] + ' ' + y : MES[m - 1] + ' ' + y; };
  const fFechaL = (iso) => { if (!iso) return ''; const [y, m, d] = iso.split('-').map(Number); return d + ' de ' + MES_L[m - 1] + ' de ' + y; };
  const plural = (n, a, b) => n + ' ' + (n === 1 ? a : b);
  const CORTE = [D.corte, LEG.consulta].filter(Boolean).sort().pop() || '2026-10-15';
  const addDays = (iso, n) => { const d = new Date(iso + 'T12:00:00'); d.setDate(d.getDate() + n); return d.toISOString().slice(0, 10); };
  const initials = (name) => { const w = String(name || '').replace(/[^A-Za-zÁÉÍÓÚÑÜáéíóúñü ]/g, ' ').split(/\s+/).filter((x) => x.length > 1 && /^[A-ZÁÉÍÓÚÑ]/.test(x)); return ((w[0] || '?')[0] + ((w[1] || '')[0] || '')).toUpperCase(); };

  const ICONS = {
    search: '<circle cx="11" cy="11" r="6.5"/><path d="M20 20l-4.2-4.2"/>',
    arrow: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    back: '<path d="M19 12H5"/><path d="M11 6l-6 6 6 6"/>',
    ext: '<path d="M8 16L16 8"/><path d="M9.5 8H16v6.5"/>',
    chev: '<path d="M9.5 6.5l5.5 5.5-5.5 5.5"/>',
    down: '<path d="M6 9.5l6 6 6-6"/>',
    x: '<path d="M6.5 6.5l11 11"/><path d="M17.5 6.5l-11 11"/>',
    cal: '<rect x="4" y="5.5" width="16" height="14.5"/><path d="M4 10h16"/><path d="M8.5 3.5v4"/><path d="M15.5 3.5v4"/>',
    filter: '<path d="M4 7h9"/><path d="M19 7h1"/><rect x="13.5" y="5" width="4" height="4"/><path d="M4 17h3"/><path d="M13 17h7"/><rect x="7.5" y="15" width="4" height="4"/>',
    share: '<path d="M12 15V4"/><path d="M8 8l4-4 4 4"/><path d="M5 12v8h14v-8"/>',
    copy: '<rect x="8" y="8" width="11.5" height="11.5"/><path d="M15.5 8V4.5h-11v11H8"/>',
    info: '<circle cx="12" cy="12" r="8.5"/><path d="M12 11v5.5"/><path d="M12 7.6v.4"/>',
    check: '<path d="M5.5 12.5l4 4 9-9"/>',
    menu: '<path d="M4 7h16"/><path d="M4 12h16"/><path d="M4 17h16"/>',
    chat: '<path d="M4.5 5.5h15v10.5H10l-4.5 3.5V16H4.5z"/><path d="M8.5 9.5h7"/><path d="M8.5 12.5h4"/>',
    compare: '<rect x="3.5" y="5.5" width="10" height="10"/><rect x="10.5" y="8.5" width="10" height="10"/>',
    send: '<path d="M5 12h14"/><path d="M13 6l6 6-6 6"/>',
    guide: '<path d="M4 6.5h11"/><path d="M4 12h11"/><path d="M4 17.5h6"/><path d="M14.5 17l2.2 2.2 3.8-4"/>',
    people: '<circle cx="9" cy="8.5" r="3.2"/><path d="M3.5 19.5c.6-3.3 2.8-5 5.5-5s4.9 1.7 5.5 5"/><path d="M15.5 5.6a3.2 3.2 0 0 1 0 5.8"/><path d="M17.5 14.8c1.6.7 2.6 2.3 3 4.7"/>',
    save: '<path d="M6 3.5h12v17l-6-4-6 4z"/>',
    bell: '<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2h-15z"/><path d="M10 20.5a2 2 0 0 0 4 0"/>',
    down2: '<path d="M12 4v11"/><path d="M7 11l5 5 5-5"/><path d="M5 20h14"/>',
    pin: '<path d="M12 21s6.5-6.2 6.5-11A6.5 6.5 0 0 0 5.500 10c0 4.8 6.5 11 6.5 11z"/><circle cx="12" cy="10" r="2.3"/>',
    ballot: '<rect x="4" y="4" width="4.5" height="4.5"/><rect x="9.75" y="4" width="4.5" height="4.5"/><rect x="15.5" y="4" width="4.5" height="4.5"/><rect x="4" y="9.75" width="4.5" height="4.5"/><rect x="9.75" y="9.75" width="4.5" height="4.5"/><path d="M4 17.5h16"/><path d="M4 20.5h10"/>'
  };
  const icon = (n, s) => '<svg width="' + (s || 18) + '" height="' + (s || 18) + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true">' + ICONS[n] + '</svg>';
  const LOGO = () => '<i class="logo-m" aria-hidden="true"></i>';

  /* =========================================================
     Datos: autoridades, noticias, coberturas, proyectos y votaciones
     ========================================================= */
  const AP = window.CONTRASTE_PERSONAS || { diputados: [], senadores: [], comunas: [], gobierno: [] };
  const FA = {}; const baseFotos = !window.__CONTRASTE_SOLO_LOCAL && window.CONTRASTE_REMOTO ? window.CONTRASTE_REMOTO.replace(/datos\/$/, '') : '';
  Object.keys(window.CONTRASTE_FOTOS_AUTO || {}).forEach((k) => { FA[k] = Object.assign({}, window.CONTRASTE_FOTOS_AUTO[k]); FA[k].src = baseFotos + FA[k].src; });
  const EST = window.CONTRASTE_ESTADO || {};
  const PARTY_CANON = Object.assign({
    'Independientes': 'Independiente', 'IND': 'Independiente', 'Independiente': 'Independiente',
    'P.S.': 'Partido Socialista', 'P.P.D.': 'Partido por la Democracia', 'R.N.': 'Renovación Nacional', 'U.D.I.': 'Unión Demócrata Independiente',
    'P.C.': 'Partido Comunista', 'D.C.': 'Democracia Cristiana', 'P.D.C.': 'Democracia Cristiana', 'Partido Demócrata Cristiano': 'Democracia Cristiana', 'P.R.': 'Partido Radical', 'P.R.S.D.': 'Partido Radical',
    'EVOP': 'Evópoli', 'Evopoli': 'Evópoli', 'Evolución Política': 'Evópoli', 'P.REP.': 'Partido Republicano', 'REP': 'Partido Republicano', 'F.A.': 'Frente Amplio', 'FA': 'Frente Amplio',
    'P.N.L.': 'Partido Nacional Libertario', 'PNL': 'Partido Nacional Libertario', 'P.D.G.': 'Partido de la Gente', 'PDG': 'Partido de la Gente', 'PSC': 'Partido Social Cristiano',
    'Partido Por la Democracia': 'Partido por la Democracia', 'Partido Demócratas Chile': 'Demócratas', 'Partido Comunista de Chile': 'Partido Comunista', 'Partido Socialista de Chile': 'Partido Socialista', 'Partido Radical de Chile': 'Partido Radical', 'Partido Radical Socialdemócrata': 'Partido Radical'
  }, LEG.partidos || {});
  const canonParty = (x) => (x ? (PARTY_CANON[x] || x) : '');
  const regCanon = (r) => {
    const s = String(r || '').replace(/^Regi[oó]n\s*/i, '').replace(/^(de la|de los|del|de)\s+/i, '').trim();
    if (/higgins/i.test(s)) return "O'Higgins"; if (/metropolitana/i.test(s)) return 'Metropolitana'; if (/ays[eé]n/i.test(s)) return 'Aysén'; if (/magallanes/i.test(s)) return 'Magallanes';
    if (/araucan/i.test(s)) return 'La Araucanía'; if (/b[ií]o ?b[ií]o/i.test(s)) return 'Biobío'; if (/^(los )?r[ií]os$/i.test(s)) return 'Los Ríos'; if (/^(los )?lagos$/i.test(s)) return 'Los Lagos';
    return s;
  };
  const palabras = (n) => norm(n).replace(/[^a-z ]/g, ' ').split(/\s+/).filter((w) => w.length > 2);
  const mismaPersona = (a, b) => { const x = palabras(a); const y = palabras(b); const [c, l] = x.length <= y.length ? [x, y] : [y, x]; return c.length >= 2 && c.every((w) => l.includes(w)); };
  const portales = () => [
    { titulo: 'Declaraciones de patrimonio e intereses', fuente: 'InfoProbidad', estado: 'Ver en portal', url: 'https://www.infoprobidad.cl/' },
    { titulo: 'Reuniones y audiencias de lobby', fuente: 'InfoLobby', estado: 'Ver en portal', url: 'https://www.infolobby.cl/' },
    { titulo: 'Gasto electoral y resultados', fuente: 'Servel', estado: 'Ver en portal', url: 'https://www.servel.cl/' }];

  const ligado = { d: {}, s: {} };
  const PBASE = D.P.map((p) => {
    const f = D.FOTOS[p.id] || {};
    const o = Object.assign({}, p, { foto: p.foto || f.src || '', fotoCred: p.fotoCred || f.cred || '', fotoFuente: p.fotoFuente || f.fuente || '', fotoUrl: p.fotoUrl || f.url || '', region: regCanon(p.region), partidoF: canonParty(p.partidoF) });
    if (p.tipo === 'Diputados' && p.camaraId) { ligado.d[p.camaraId] = o; const a = AP.diputados.find((x) => x.id === String(p.camaraId)); if (a) o.dist = a.dist; }
    if (p.tipo === 'Senadores') { const s = AP.senadores.find((x) => mismaPersona(x.n, p.nombre)); if (s) { o.senadoKey = 'S' + s.id; o.mail = s.mail; o.fono = s.fono; ligado.s[s.id] = o; } else o.senadoKey = null; }
    return o;
  });
  const AUTOG = (AP.gobierno || []).map((x) => {
    const f = FA[x.id] || {};
    const partido = x.partido || 'Partido por confirmar';
    return { id: x.id, nombre: x.nombre, corto: x.corto, tipo: x.tipo, cargo: x.cargo, cargoCorto: x.cargo, institucion: x.institucion, partido, partidoF: x.partido || 'Partido por confirmar', region: regCanon(x.region), periodo: x.periodo || '', basica: true, gobierno: true,
      resena: x.cargo + (x.periodo ? ' (' + x.periodo.charAt(0).toLowerCase() + x.periodo.slice(1) + ')' : '') + '. Ficha básica: revisa sus noticias y las fuentes para ampliar.', temas: [], oficialFuente: x.fuente || 'Gobierno de Chile', oficialUrl: x.url || x.oficial || 'https://www.gob.cl/',
      foto: f.src || '', fotoCred: f.cred || '', fotoFuente: f.fuente || '', fotoUrl: f.url || '', news: [], vot: [], fue: portales() };
  });
  const REG_DIST = {}; (AP.comunas || []).forEach((c) => { REG_DIST[c[1]] = c[2]; });
  const AUTOD = AP.diputados.filter((a) => !ligado.d[a.id]).map((a) => {
    a = Object.assign({}, a, { reg: a.reg || REG_DIST[a.dist] || '' });
    const f = FA['D' + a.id] || {}; const partido = canonParty(a.p) || 'Sin dato'; const titulo = (a.sexo === 'F' ? 'Diputada' : 'Diputado') + ' por el Distrito ' + a.dist; const url = 'https://www.camara.cl/diputados/detalle/mociones.aspx?prmID=' + a.id;
    return { id: 'd' + a.id, nombre: a.n, corto: a.corto, tipo: 'Diputados', cargo: titulo + (a.mesa ? ' · ' + a.mesa + ' de la Cámara' : ''), cargoCorto: titulo, institucion: 'Cámara de Diputadas y Diputados', partido, partidoF: partido, region: regCanon(a.reg), periodo: '2026–2030', camaraId: a.id, dist: a.dist, basica: true,
      resena: titulo + (a.reg ? ', región ' + regCanon(a.reg) : '') + ', período 2026–2030. ' + (a.mesa ? a.mesa + ' de la Cámara. ' : '') + 'Ficha generada desde los datos oficiales de la Cámara.', temas: [], oficialFuente: 'Cámara', oficialUrl: url,
      foto: f.src || '', fotoCred: f.cred || '', fotoFuente: f.fuente || '', fotoUrl: f.url || '', news: [], vot: [], fue: [{ titulo: 'Ficha parlamentaria', fuente: 'Cámara de Diputadas y Diputados', estado: 'Ver en portal', url }].concat(portales()) };
  });
  const AUTOS = AP.senadores.filter((a) => !ligado.s[a.id]).map((a) => {
    const f = FA['S' + a.id] || {}; const partido = a.p || 'Sin dato'; const reg = regCanon(a.reg); const titulo = (a.sexo === 'F' ? 'Senadora' : 'Senador') + ' por ' + (reg === 'Metropolitana' ? 'la Región Metropolitana' : reg); const url = 'https://www.senado.cl/senadoras-y-senadores/listado-de-senadoras-y-senadores/' + a.slug;
    return { id: 's' + a.id, nombre: a.n, corto: a.corto, tipo: 'Senadores', cargo: titulo + (a.circ ? ', circunscripción ' + a.circ : ''), cargoCorto: titulo, institucion: 'Senado', partido, partidoF: partido, region: reg, periodo: 'Período vigente', senadoKey: 'S' + a.id, mail: a.mail, fono: a.fono, basica: true,
      resena: titulo + '. Ficha generada desde la nómina oficial del Senado.', temas: [], oficialFuente: 'Senado', oficialUrl: url,
      foto: f.src || '', fotoCred: f.cred || '', fotoFuente: f.fuente || '', fotoUrl: f.url || '', news: [], vot: [], fue: [{ titulo: 'Ficha parlamentaria', fuente: 'Senado', estado: 'Ver en portal', url }].concat(portales()) };
  });
  const P = PBASE.concat(AUTOG, AUTOS, AUTOD).map((p, i) => Object.assign(p, { i }));
  const PID = {}; P.forEach((p) => { PID[p.id] = p; });
  const E = D.E;
  const esParl = (p) => p.tipo === 'Diputados' || p.tipo === 'Senadores';

  // partido de la autoridad a una fecha (si hay historial verificado); si no, el actual
  const partidoEn = (p, iso) => {
    if (p.partidoHist && iso) for (const h of p.partidoHist) if ((!h.desde || h.desde <= iso) && (!h.hasta || iso <= h.hasta)) return h.partido;
    return p.partidoF;
  };

  const hashKey = (s) => { let h = 5381; for (let i = 0; i < s.length; i++) h = ((h * 33) ^ s.charCodeAt(i)) >>> 0; return h.toString(36); };
  const idDesdeAuto = (x) => { const c = x.charAt(0); const r = x.slice(1); if (c === 'd' && ligado.d[r]) return ligado.d[r].id; if (c === 's' && ligado.s[r]) return ligado.s[r].id; return PID[x] ? x : null; };
  const NEWS = [];
  P.forEach((p) => (p.news || []).forEach((n, k) => NEWS.push(Object.assign({}, n, { pid: p.id, key: p.id + '-' + k, persona: p.nombre, verificado: n.verificado || p.verificado || D.corteOriginal || D.corte }))));
  const URLS = new Set(NEWS.map((n) => n.url));
  (window.CONTRASTE_AUTO_NEWS || []).forEach((a) => {
    if (URLS.has(a.u)) return; const ids = uniq((a.p || []).map(idDesdeAuto).filter(Boolean)); if (!ids.length) return;
    URLS.add(a.u);
    NEWS.push({ d: a.d, fecha: fFecha(a.d), medio: a.m, tm: a.f === 'gnews' ? 'Vía Google Noticias' : 'Detección automática', tema: a.te, orig: true, titulo: a.t, resumen: a.r, url: a.u, auto: true, viaG: a.f === 'gnews', pid: ids[0], tambien: ids.slice(1), key: 'a' + hashKey(a.u), persona: PID[ids[0]].nombre });
  });
  NEWS.sort((a, b) => (b.d || '').localeCompare(a.d || ''));
  const NEWSK = {}; NEWS.forEach((n) => { NEWSK[n.key] = n; });
  const newsOf = (p) => NEWS.filter((n) => n.pid === p.id || (n.tambien || []).includes(p.id));

  const BILLS = (LEG.proyectos || []).map((b) => { const m = (LEG.meta && LEG.meta[b.boletin]) || {}; return Object.assign({}, b, m, { tema: m.tema || b.tema }); });
  const BID = {}; BILLS.forEach((b) => { BID[b.boletin] = b; });
  const VOT = LEG.votaciones || {};
  const COMUNAS = AP.comunas || [];

  /* =========================================================
     Estado de ruta
     ========================================================= */
  function parseHash() {
    const h = decodeURI(location.hash || '').replace(/^#\/?/, '');
    const [path, qs] = h.split('?');
    const parts = (path || '').split('/').filter(Boolean).map(decodeURIComponent);
    const params = {};
    new URLSearchParams(qs || '').forEach((v, k) => { params[k] = v; });
    return { name: parts[0] || 'inicio', parts, params };
  }
  function buildHash(name, parts, params) {
    const p = [name].concat(parts || []).map(encodeURIComponent).join('/');
    const q = new URLSearchParams();
    Object.keys(params || {}).forEach((k) => { const v = params[k]; if (v !== undefined && v !== null && v !== '') q.set(k, v); });
    const s = q.toString();
    return '#/' + p + (s ? '?' + s : '');
  }
  const go = (hash) => { if (location.hash === hash) render(); else location.hash = hash; };
  const replaceHash = (hash) => { history.replaceState(null, '', hash); };
  const absUrl = (hash) => location.href.split('#')[0] + hash;

  /* =========================================================
     Avisos, copiar y compartir
     ========================================================= */
  let toastT;
  function toast(msg) {
    const t = $('#aviso'); t.innerHTML = icon('check', 16) + '<span>' + esc(msg) + '</span>';
    t.classList.add('is-on'); clearTimeout(toastT); toastT = setTimeout(() => t.classList.remove('is-on'), 2600);
  }
  function copyText(txt, okMsg) {
    const done = () => toast(okMsg || 'Copiado');
    const fallback = () => {
      const ta = document.createElement('textarea'); ta.value = txt; ta.setAttribute('readonly', ''); ta.style.position = 'fixed'; ta.style.opacity = '0';
      document.body.appendChild(ta); ta.select();
      try { document.execCommand('copy'); done(); } catch (e) { toast('No se pudo copiar. Selecciona el texto manualmente.'); }
      ta.remove();
    };
    if (navigator.clipboard && window.isSecureContext) navigator.clipboard.writeText(txt).then(done, fallback); else fallback();
  }
  function share(hash, title) {
    const url = absUrl(hash);
    if (navigator.share && matchMedia('(pointer: coarse)').matches) { navigator.share({ title: title || 'Contraste', url }).catch(() => {}); return; }
    copyText(url, 'Enlace copiado');
  }
  const consultado = 'consultado en Contraste el ' + fFechaL(CORTE);
  const fechaAPA = (iso) => { if (!iso) return 's. f.'; const [y, m, d] = iso.split('-').map(Number); return y + (m ? ', ' + (d ? d + ' de ' : '') + MES_L[m - 1] : ''); };
  // Citas en formato APA 7: el título va en cursiva en los documentos; aquí se entrega como texto plano
  function citaAPA(kind, id) {
    if (kind === 'news') { const n = NEWSK[id]; if (!n) return ''; return n.titulo.replace(/\.$/, '') + '. (' + fechaAPA(n.d) + '). ' + n.medio + '. ' + n.url; }
    if (kind === 'vote') { const v = VOT[id]; if (!v) return ''; const b = BID[v.boletin]; return (v.camara === 'Senado' ? 'Senado de Chile' : 'Cámara de Diputadas y Diputados de Chile') + '. (' + fechaAPA(v.fecha) + '). Votación del Boletín N° ' + v.boletin + (b ? ': ' + (b.nombreCorto || b.titulo) : '') + '. ' + v.url; }
    if (kind === 'bill') { const b = BID[id]; if (!b) return ''; return 'Congreso Nacional de Chile. (' + fechaAPA(b.ingreso) + '). Proyecto de ley, Boletín N° ' + b.boletin + ': ' + b.titulo.replace(/\.$/, '') + '. Tramitación de proyectos, Senado de Chile. ' + senadoBillUrl(b.boletin); }
    if (kind === 'person') { const p = PID[id]; if (!p) return ''; return p.oficialFuente + '. (s. f.). ' + p.nombre + '. ' + p.oficialUrl; }
    if (kind === 'event') { const e = E[id]; if (!e) return ''; return 'Contraste. (' + fechaAPA(evDate(id)) + '). Cobertura comparada: ' + e.titulo + '. ' + absUrl('#/contrastar/' + id); }
    return refText(kind, id);
  }
  function refText(kind, id) {
    if (kind === 'news') {
      const n = NEWS.find((x) => x.key === id); if (!n) return '';
      return '«' + n.titulo + '». ' + n.medio + ', ' + n.fecha + '. ' + n.url + (n.orig ? '' : ' (titular resumido por Contraste)') + '. Verificado por Contraste el ' + fFechaL(n.verificado) + '.';
    }
    if (kind === 'person') {
      const p = PID[id]; return p.nombre + '. ' + p.cargo + ' (' + p.periodo + '). Ficha oficial: ' + p.oficialFuente + ', ' + p.oficialUrl + '. Perfil en Contraste: ' + absUrl('#/autoridad/' + p.id) + ' (' + consultado + ').';
    }
    if (kind === 'fuente') {
      const [pid, k] = id.split('|'); const f = PID[pid].fue[+k]; return f.titulo + ' de ' + PID[pid].nombre + '. ' + f.fuente + '. ' + f.url + ' (' + consultado + ').';
    }
    if (kind === 'decision') {
      const [pid, k] = id.split('|'); const v = PID[pid].vot[+k]; return PID[pid].nombre + ': ' + v.titulo + ' (' + v.instancia + ', ' + v.fecha + '). Fuente: ' + v.fuente + ', ' + v.url + '.';
    }
    if (kind === 'bill') {
      const b = BID[id]; return 'Proyecto de ley, Boletín N° ' + b.boletin + ': «' + b.titulo + '». Ingreso: ' + fFechaL(b.ingreso) + ', ' + b.origen + '. Tramitación: ' + senadoBillUrl(b.boletin) + ' (' + consultado + ').';
    }
    if (kind === 'vote') {
      const v = VOT[id]; const b = BID[v.boletin];
      const t = v.totales; const ex = [t.disp ? t.disp + ' dispensados' : '', t.pareo ? t.pareo + ' pareos' : ''].filter(Boolean).join(', ');
      return v.camara + ', votación del ' + fFechaL(v.fecha) + (v.sesion ? ' (' + sesionTxt(v) + ')' : '') + '. Boletín N° ' + v.boletin + (b ? ' «' + b.titulo + '»' : '') + '. ' + (v.tramite ? v.tramite + '. ' : '') + 'Resultado: ' + t.si + ' a favor, ' + t.no + ' en contra, ' + t.abst + ' abstenciones' + (ex ? ', ' + ex : '') + '. Registro oficial: ' + v.url + ' (' + consultado + ').';
    }
    if (kind === 'event') {
      const e = E[id]; return 'Cobertura comparada: «' + e.titulo + '» (' + e.fecha + '). ' + e.items.map((it) => it.medio + ', «' + it.titulo + '», ' + it.url).join('; ') + '. Comparación en Contraste: ' + absUrl('#/contrastar/' + id) + '.';
    }
    return '';
  }

  /* =========================================================
     Glosario contextual
     ========================================================= */
  const GLOS = {
    'Revisado': 'Comparamos los datos de este perfil con esta fuente y coinciden.',
    'Ver en portal': 'Es el portal oficial donde está esta información, pero todavía no revisamos su contenido para esta autoridad.',
    'Aclarado': 'Una fuente explica por qué las versiones no coinciden. Puedes usar el dato aclarado.',
    'Sin resolver': 'No encontramos una fuente que confirme cuál versión es la correcta. Úsalo con cuidado o verifícalo.',
    'A favor': 'Votó a favor, según el registro oficial.',
    'En contra': 'Votó en contra, según el registro oficial.',
    'Abstención': 'Participó en la votación sin votar a favor ni en contra. Se registra, pero no suma a ninguna de las dos opciones.',
    'Decisión': 'Una medida que tomó la autoridad como parte de su cargo. No es una votación.',
    'Hecho': 'Algo en lo que participó o que la afectó, pero que no fue una decisión suya.',
    'Boletín': 'Número con que el Congreso identifica cada proyecto de ley durante toda su tramitación. Los dígitos después del guion indican la comisión a la que se asignó al ingresar.',
    'Trámite legislativo': 'Etapa del proyecto según la cámara que lo revisa: primer trámite (cámara de origen), segundo trámite (cámara revisora), tercer trámite (la cámara de origen revisa los cambios), comisión mixta (resuelve diferencias entre ambas cámaras) y trámite de aprobación presidencial.',
    'Votación en general': 'Se vota la idea de legislar: si el proyecto, en su conjunto, debe seguir adelante.',
    'Votación en particular': 'Se votan artículos, indicaciones o partes específicas del proyecto, una por una.',
    'Votación única': 'Una sola votación resuelve todo lo sometido a decisión; por ejemplo, la propuesta de una comisión mixta.',
    'Pareo': 'Acuerdo entre dos parlamentarios de posiciones distintas para no votar cuando uno de ellos está ausente. Así la ausencia no altera el resultado.',
    'Dispensado': 'Diputada o diputado que no vota porque fue eximido o se inhabilitó, por ejemplo por un posible conflicto de interés.',
    'No vota': 'Figura en el registro oficial de la votación sin un voto emitido; por ejemplo, porque no estaba en la Sala en ese momento.',
    'Quórum': 'Número mínimo de votos que exige la Constitución para aprobar ciertas normas. Con quórum simple basta la mayoría de los presentes; las reformas constitucionales y otras normas exigen más votos. Por eso un proyecto puede rechazarse aunque tenga más votos a favor que en contra.',
    'Fecha de verificación': 'Día en que Contraste revisó el dato contra su fuente. No es la fecha del hecho ni de su publicación.'
  };
  let glN = 0;
  const gl = (term, label) => {
    const id = 'gl' + (++glN);
    return '<span class="gl"><button type="button" class="gl-btn" data-act="gl" aria-expanded="false" aria-controls="' + id + '" aria-label="Qué significa ' + esc(label || term) + '">' + icon('info', 16) + '</button><span class="gl-pop" id="' + id + '" role="note" hidden><strong>' + esc(label || term) + '</strong>' + esc(GLOS[term] || '') + '</span></span>';
  };

  /* =========================================================
     Piezas de interfaz
     ========================================================= */
  const photoTag = (p, size, cls) => p && p.foto
    ? '<img src="' + esc(p.foto) + '" alt="Fotografía de ' + esc(p.nombre) + '" width="' + size + '" height="' + size + '" loading="lazy" decoding="async"' + (cls ? ' class="' + cls + '"' : '') + ' data-ini="' + esc(initials(p.nombre)) + '">'
    : '<span class="ph' + (cls ? ' ' + cls : '') + '" style="width:' + size + 'px;height:' + size + 'px" role="img" aria-label="Sin fotografía disponible de ' + esc(p ? p.nombre : '') + '">' + esc(initials(p ? p.nombre : '')) + '</span>';

  function searchForm(opts) {
    const id = opts.id; const size = opts.size || 'md';
    return '<form class="search search-' + size + '" role="search" data-search="' + (opts.mode || 'go') + '" autocomplete="off">' +
      '<label class="sr-only" for="' + id + '">Buscar autoridad, noticia, tema o proyecto de ley</label>' +
      '<div class="search-field"><span class="ico">' + icon('search', size === 'lg' ? 22 : 20) + '</span>' +
      '<input id="' + id + '" type="search" name="q" value="' + esc(opts.value || '') + '" placeholder="' + esc(opts.placeholder || (innerWidth < 600 ? 'Autoridad, noticia, tema o boletín' : 'Buscar autoridad, noticia, tema o proyecto de ley...')) + '" spellcheck="false" enterkeyhint="search"' +
      (opts.suggest ? ' role="combobox" aria-autocomplete="list" aria-expanded="false" aria-controls="' + id + '-sug"' : '') + '>' +
      '<button type="button" class="search-clear" data-act="clear-q" aria-label="Borrar la búsqueda"' + (opts.value ? '' : ' hidden') + '>' + icon('x', 18) + '</button>' +
      '<button class="btn btn-primary" type="submit"><span class="ico-b" aria-hidden="true">' + icon('search', 20) + '</span><span class="lbl">Buscar</span></button></div>' +
      (opts.suggest ? '<div class="suggest" id="' + id + '-sug" role="listbox" aria-label="Sugerencias" hidden></div>' : '') +
      '</form>';
  }

  function personRow(p, extra) {
    return '<a class="person" href="#/autoridad/' + p.id + '">' + photoTag(p, 64) +
      '<span class="p-txt"><span class="p-name">' + esc(p.nombre) + '</span><span class="p-cargo">' + esc(p.cargoCorto) + '</span>' +
      '<span class="p-party">' + esc(extra || [p.partido, p.region].filter(Boolean).join(' · ')) + '</span></span>' +
      '<span class="chev">' + icon('chev') + '</span></a>';
  }

  function newsRecord(n, opt) {
    opt = opt || {};
    const p = PID[n.pid];
    const ev = n.ev && E[n.ev];
    const bill = n.proyecto && BID[n.proyecto];
    return '<article class="record">' +
      '<div class="record-stamp"><strong>' + esc(n.medio) + '</strong><span class="dot num">' + esc(n.fecha) + '</span>' +
      (opt.persona !== false ? '<span class="dot"><a href="#/autoridad/' + p.id + '">' + esc(p.nombre) + '</a></span>' : '') +
      (n.tema && n.tema !== 'Otros' ? '<span class="dot">' + esc(n.tema) + '</span>' : '') + '</div>' +
      '<h3 class="h3">' + esc(n.titulo) + '</h3>' +
      (n.auto ? '<span class="note-tag">Detectada automáticamente · sin revisión editorial</span>' : n.orig ? '' : '<span class="note-tag">Titular resumido por Contraste · el original está en el enlace</span>') +
      (n.resumen ? '<p class="sum">' + esc(n.resumen) + '</p>' : '') +
      '<div class="record-actions">' +
      senalFuentes(n) +
      '<a class="ext" href="' + esc(n.url) + '" target="_blank" rel="noopener" data-key="' + n.key + '">Leer en ' + esc(n.medio) + icon('ext', 16) + '</a>' +
      (ev ? '<a class="btn btn-line btn-sm" href="#/contrastar/' + n.ev + '">' + icon('compare', 16) + 'Contrastar cobertura · ' + ev.items.length + ' medios</a>' : '') +
      (bill ? '<a class="ext" href="#/proyecto/' + bill.boletin + '">Proyecto relacionado: Boletín ' + esc(bill.boletin) + '</a>' : '') +
      '<button type="button" class="btn btn-quiet btn-sm" data-act="ref" data-kind="news" data-id="' + n.key + '">' + icon('copy', 16) + 'Citar en APA</button>' + saveBtn('news', n.key) +
      (n.auto ? '' : '<span class="verif">Verificado ' + fFecha(n.verificado) + '</span>') +
      '</div></article>';
  }

  const estadoClass = (b) => /promulg|publicad|ley n|archiv/i.test((b.etapa || '') + ' ' + (b.estado || '')) ? 'done' : '';
  const senadoBillUrl = (bol) => 'https://tramitacion.senado.cl/appsenado/templates/tramitacion/index.php?boletin_ini=' + bol;
  const billVotes = (b) => (b.votaciones || []).map((id) => VOT[id]).filter(Boolean).sort((a, c) => (c.fecha + c.hora).localeCompare(a.fecha + a.hora));

  function billRecord(b) {
    const vs = billVotes(b); const nC = vs.filter((v) => v.camara !== 'Senado').length; const nS = vs.length - nC;
    return '<article class="record">' +
      '<div class="record-stamp"><strong class="bill-num">Boletín ' + esc(b.boletin) + '</strong><span class="dot">Ingreso ' + fFecha(b.ingreso) + '</span><span class="dot">' + esc(b.iniciativa) + '</span>' + (b.tema ? '<span class="dot">' + esc(b.tema) + '</span>' : '') + '</div>' +
      '<h3 class="h3"><a href="#/proyecto/' + b.boletin + '">' + esc(b.nombreCorto || b.titulo) + '</a></h3>' +
      (b.nombreCorto ? '<p class="sum">' + esc(b.titulo) + '</p>' : '') +
      '<div class="record-actions">' +
      '<span class="bill-state ' + estadoClass(b) + '">' + esc(b.estadoCorto || b.etapa || 'Etapa no informada') + '</span>' +
      (vs.length ? '<a class="btn btn-line btn-sm" href="#/proyecto/' + b.boletin + '#votaciones">Ver votaciones <span class="count">' + vs.length + '</span></a>' : '<span class="meta">Sin votaciones en Sala al ' + fFecha(LEG.consulta) + '</span>') +
      (vs.length ? '<span class="meta">' + [nC ? plural(nC, 'en la Cámara', 'en la Cámara') : '', nS ? plural(nS, 'en el Senado', 'en el Senado') : ''].filter(Boolean).join(' · ') + '</span>' : '') +
      '</div></article>';
  }

  const sesionTxt = (v) => {
    if (!v.sesion) return '';
    if (v.camara === 'Senado') { return v.sesion; }
    const m = v.sesion.match(/n°\s*(\d+),?\s*([A-Za-záéíóú]+)?/i); return m ? 'Sesión ' + m[1] + 'ª' + (m[2] ? ' ' + m[2].toLowerCase() : '') : v.sesion;
  };
  const resultado = (v) => {
    if (v.resultadoTexto) return v.resultadoTexto;
    if (v.camara !== 'Senado') return v.resultado || '';
    const t = v.totales; return t.si > t.no ? 'Más votos a favor' : t.no > t.si ? 'Más votos en contra' : 'Empate en el registro';
  };
  const resBadge = (v) => {
    const r = resultado(v); if (!r) return '<span class="badge b-otro">Resultado en el registro oficial</span>';
    const cls = /rechaz|en contra/i.test(r) ? 'b-no' : /aprob|a favor/i.test(r) ? 'b-si' : 'b-otro';
    return '<span class="badge ' + cls + '">' + esc(r) + '</span>';
  };
  const camaraCorta = (v) => v.camara === 'Senado' ? 'Senado' : 'Cámara';

  function voteRow(v, opt) {
    opt = opt || {};
    const t = v.totales;
    return '<a class="vote-row" href="#/votacion/' + v.id + '">' +
      '<span class="vr-date">' + fFecha(v.fecha) + '<span>' + camaraCorta(v) + (v.hora ? ' · ' + v.hora : '') + '</span></span>' +
      '<span><span class="vr-title">' + esc(v.materiaCorta || v.materia || 'Votación del proyecto') + '</span>' +
      '<span class="vr-meta">' + [v.tramite, v.tipo ? 'Votación ' + v.tipo.toLowerCase() : '', sesionTxt(v)].filter(Boolean).map(esc).join(' · ') + (opt.boletin ? ' · Boletín ' + esc(v.boletin) : '') + '</span>' +
      (opt.voto ? '<span class="vr-meta">' + opt.voto + '</span>' : '') + '</span>' +
      '<span class="vr-res"><span class="tally" aria-label="' + t.si + ' a favor, ' + t.no + ' en contra, ' + t.abst + ' abstenciones"><span class="si">' + t.si + '</span><span class="no">' + t.no + '</span><span class="ab">' + t.abst + '</span></span>' + resBadge(v) + '</span>' +
      '</a>';
  }

  const emptyBox = (title, text, actions) => '<div class="empty"><strong>' + esc(title) + '</strong><p>' + esc(text) + '</p>' + (actions ? '<div class="row">' + actions + '</div>' : '') + '</div>';

  /* =========================================================
     Búsqueda
     ========================================================= */
  const SIN = { 'ruf': ['uso de la fuerza', 'reglas de uso'], 'megarreforma': ['reconstruccion nacional'], 'presupuesto': ['presupuestos'], 'seguridad': ['seguridad'] };
  function tokens(q) {
    const n = norm(q).replace(/boletin|n°|nº|numero/g, ' ').replace(/[^a-z0-9\- ]/g, ' ').trim();
    return n.split(/\s+/).filter((w) => w.length > 1 || /\d/.test(w));
  }
  function scoreText(fields, toks) {
    if (!toks.length) return 1;
    let total = 0;
    for (const t of toks) {
      let best = 0;
      for (const [txt, w] of fields) {
        const s = norm(txt);
        if (!s) continue;
        if (s.includes(t)) best = Math.max(best, w * (new RegExp('(^|[^a-z0-9])' + t.replace(/[-]/g, '\\-')).test(s) ? 1.5 : 1));
      }
      if (!best) return 0;
      total += best;
    }
    return total;
  }
  const pFields = (p) => [[p.nombre, 10], [p.cargo + ' ' + p.cargoCorto, 5], [p.institucion, 4], [p.partido, 4], [p.region, 3], [(p.temas || []).join(' '), 3], [p.resena, 1], [p.alias || '', 6]];
  const nFields = (n) => [[n.titulo, 6], [n.persona, 6], [n.tema, 4], [n.medio, 3], [n.resumen, 2]];
  const bFields = (b) => [[b.boletin + ' ' + b.boletin.replace('-', ''), 12], [b.nombreCorto || '', 8], [b.titulo, 6], [b.tema || '', 5], [(b.claves || []).join(' '), 5], [b.resumen || '', 2], [b.etapa || '', 1]];

  function expandQuery(q) {
    const n = norm(q).trim(); let extra = '';
    Object.keys(SIN).forEach((k) => { if (n === k || n.split(' ').includes(k)) extra = SIN[k][0]; });
    return extra || q;
  }

  // filtro de fecha → [desde, hasta] en ISO
  const PRESETS = { '7d': 'Últimos 7 días', '30d': 'Último mes', '365d': 'Último año' };
  function dateRange(f) {
    if (!f) return null;
    if (PRESETS[f]) { const n = { '7d': 7, '30d': 30, '365d': 365 }[f]; return [addDays(CORTE, -n), CORTE]; }
    let m = f.match(/^dia:(\d{4}-\d{2}-\d{2})$/); if (m) return [m[1], m[1]];
    m = f.match(/^rango:(\d{4}-\d{2}-\d{2})?\.\.(\d{4}-\d{2}-\d{2})?$/); if (m) return [m[1] || '0000-01-01', m[2] || '9999-12-31'];
    return null;
  }
  function dateLabel(f) {
    if (!f) return '';
    if (PRESETS[f]) return PRESETS[f] + ' (al ' + fFecha(CORTE) + ')';
    let m = f.match(/^dia:(.+)$/); if (m) return 'El ' + fFecha(m[1]);
    m = f.match(/^rango:(.*)\.\.(.*)$/); if (m) return m[1] && m[2] ? 'Del ' + fFecha(m[1]) + ' al ' + fFecha(m[2]) : m[1] ? 'Desde el ' + fFecha(m[1]) : 'Hasta el ' + fFecha(m[2]);
    return f;
  }
  const inRange = (iso, r) => !r || (iso && iso >= r[0] && iso <= r[1]);

  function runSearch(st) {
    const q = expandQuery(st.q || ''); const toks = tokens(q);
    const r = dateRange(st.fecha);
    const parties = st.partido ? st.partido.split('|') : [];
    const pOk = (p) => (!st.tipo || p.tipo === st.tipo) && (!st.region || p.region === st.region) && (!parties.length || parties.includes(p.partidoF));
    // noticias
    let news = NEWS.map((n) => ({ n, s: scoreText(nFields(n), toks) })).filter((x) => x.s > 0 && inRange(x.n.d, r))
      .filter((x) => { const p = PID[x.n.pid]; return (!st.tipo || p.tipo === st.tipo) && (!st.region || p.region === st.region) && (!parties.length || parties.includes(partidoEn(p, x.n.d))) && (!st.tema || x.n.tema === st.tema) && (!st.medio || x.n.tm === st.medio); });
    // autoridades
    let people = P.map((p) => ({ p, s: scoreText(pFields(p), toks) })).filter((x) => pOk(x.p))
      .filter((x) => !st.tema || (x.p.temas || []).includes(st.tema) || (x.p.news || []).some((n) => n.tema === st.tema))
      .filter((x) => !st.medio || (x.p.news || []).some((n) => n.tm === st.medio));
    if (toks.length) {
      // una autoridad también aparece si coincide con alguna de sus noticias
      const viaNews = {}; news.forEach((x) => { viaNews[x.n.pid] = Math.max(viaNews[x.n.pid] || 0, x.s * 0.3); });
      people = people.map((x) => ({ p: x.p, s: x.s || viaNews[x.p.id] || 0 })).filter((x) => x.s > 0);
    }
    if (r) people = people.filter((x) => (x.p.news || []).some((n) => inRange(n.d, r)) || personVotes(x.p).some((v) => inRange(v.fecha, r)));
    // proyectos
    let bills = BILLS.map((b) => ({ b, s: scoreText(bFields(b), toks) })).filter((x) => x.s > 0 && inRange(x.b.ingreso, r))
      .filter((x) => !st.tema || x.b.tema === st.tema);
    if (st.tipo || st.region || st.medio || parties.length) bills = bills.filter((x) => (x.b.relacionados || []).some((id) => PID[id] && pOk(PID[id])));

    const ord = st.orden || 'relevancia';
    if (ord === 'fecha' || !toks.length) { news.sort((a, b) => b.n.d.localeCompare(a.n.d)); bills.sort((a, b) => b.b.ingreso.localeCompare(a.b.ingreso)); }
    else { news.sort((a, b) => b.s - a.s || b.n.d.localeCompare(a.n.d)); bills.sort((a, b) => b.s - a.s); }
    if (ord === 'autoridad') { news.sort((a, b) => a.n.persona.localeCompare(b.n.persona) || b.n.d.localeCompare(a.n.d)); people.sort((a, b) => a.p.nombre.localeCompare(b.p.nombre)); }
    else if (toks.length) people.sort((a, b) => b.s - a.s);
    return { people: people.map((x) => x.p), news: news.map((x) => x.n), bills: bills.map((x) => x.b) };
  }

  /* Votos de una autoridad con perfil (si es parlamentaria) */
  const voteKeyFor = (p) => p.camaraId ? 'D' + p.camaraId : p.senadoKey || null;
  function personVotes(p) {
    const k = voteKeyFor(p); if (!k) return [];
    const out = [];
    Object.keys(VOT).forEach((id) => { const v = VOT[id]; const o = LEG.votoDe ? LEG.votoDe(v, k) : ''; if (o) out.push(Object.assign(Object.create(v), { suVoto: o })); });
    return out.sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));
  }
  // Mayoría de un partido en una votación (solo cuenta a favor, en contra y abstención)
  function mayoriaPartido(v, partido) {
    const ids = LEG.roster(v); const c = { A: 0, C: 0, B: 0 };
    for (let i = 0; i < ids.length; i++) { const o = v.o.charAt(i); if (c[o] === undefined) continue; if (canonParty(LEG.partidoDe(ids[i], v.fecha).p) === partido) c[o]++; }
    const orden = Object.keys(c).sort((a, b) => c[b] - c[a]);
    const tot = c.A + c.C + c.B;
    if (tot < 3 || c[orden[0]] === c[orden[1]]) return '';
    return orden[0];
  }
  const sinBloque = (x) => !x || /independiente|sin dato|por confirmar/i.test(x);
  function distintoDePartido(v, key) {
    const o = LEG.votoDe(v, key); if (!/[ACB]/.test(o)) return false;
    const par = canonParty(LEG.partidoDe(key, v.fecha).p); if (sinBloque(par)) return false;
    const m = mayoriaPartido(v, par); return !!m && m !== o;
  }
  const OPC = { A: 'A favor', C: 'En contra', B: 'Abstención', P: 'Pareo', D: 'Dispensado', N: 'No vota', '?': 'Sin dato' };
  const OPC_CLS = { A: 'b-si', C: 'b-no', B: 'b-abs', P: 'b-otro', D: 'b-otro', N: 'b-otro', '?': 'b-otro' };

  /* =========================================================
     Cabecera, pie y menú móvil
     ========================================================= */
  const NAV = [['', 'Inicio'], ['autoridades', 'Autoridades'], ['proyectos', 'Proyectos de ley'], ['contrastar', 'Contrastar medios'], ['temas', 'Temas']];
  const NAV2 = [['carpeta', 'Mi carpeta'], ['comparar', 'Comparar parlamentarios'], ['comuna', 'Busca por comuna'], ['guia', 'Búsqueda guiada'], ['metodologia', 'Cómo citar y fuentes']];
  function navActive(route) {
    const map = { inicio: '', autoridad: 'autoridades', proyecto: 'proyectos', votacion: 'proyectos', tema: 'temas', evento: 'contrastar' };
    return route.name in map ? map[route.name] : route.name;
  }
  const estadoTexto = () => EST.hoy ? 'Actualizado el ' + fFecha(EST.hoy) : 'Datos al ' + fFecha(CORTE);
  function renderHeader(route) {
    const act = navActive(route);
    const n = carpeta().length; const nu = totalNuevos();
    const enlace = ([id, l]) => '<a class="n' + (act === id ? ' on' : '') + (id === 'guia' ? '" data-act="guia-start' : '') + '" href="#/' + id + '"' + (act === id ? ' aria-current="page"' : '') + '>' + l + (id === 'carpeta' ? '<b data-carpeta-n>' + (n || '') + '</b>' : '') + '</a>';
    $('#cabecera').innerHTML = '<a class="logo" href="#/" aria-label="Contraste, ir al inicio">' + LOGO() + '<span>Contraste</span></a>' +
      '<div class="rail-mov"><a class="head-icon" href="#/buscar" aria-label="Buscar">' + icon('search', 20) + '</a><a class="head-icon" href="#/carpeta" aria-label="Mi carpeta">' + icon('save', 20) + (n ? '<b data-carpeta-n>' + n + '</b>' : '') + '</a><button class="menu-btn" type="button" data-act="menu" aria-haspopup="dialog" aria-expanded="false">' + icon('menu', 20) + 'Menú</button></div>' +
      '<nav class="rail-nav" aria-label="Principal">' + NAV.map(enlace).join('') +
      (route.name !== 'inicio' ? '<form class="rail-search" role="search" data-search="go"><label class="sr-only" for="q-head">Buscar en Contraste</label><input id="q-head" type="search" name="q" placeholder="Buscar" enterkeyhint="search"><button aria-label="Buscar">' + icon('search', 16) + '</button></form>' : '') +
      '<div class="rh">Para tu trabajo</div>' + NAV2.map(enlace).join('') + '</nav>' +
      '<a class="est" href="#/metodologia#actualizacion"><b>' + esc(estadoTexto()) + '</b>Cámara y Senado, directo de sus datos oficiales' + (nu ? '<span class="nu">' + plural(nu, 'novedad', 'novedades') + ' en lo que sigues</span>' : '') + '</a>';
  }
  function renderFooter(route) {
    const f = $('#pie'); f.hidden = false;
    f.innerHTML = '<div class="wrap"><span>Contraste · Prototipo académico de investigación periodística</span><span>' + esc(estadoTexto()) + '</span><a href="#/metodologia">Fuentes y metodología</a></div>';
  }
  function openMenu(btn) {
    const route = parseHash(); const act = navActive(route);
    const cap = $('#capas');
    cap.innerHTML = '<div class="sheet-backdrop" data-act="close-menu"></div><div class="sheet" role="dialog" aria-modal="true" aria-label="Menú"><div class="grip" aria-hidden="true"></div><nav aria-label="Principal">' +
      NAV.concat(NAV2).map(([id, l]) => '<a href="#/' + id + '"' + (id === 'guia' ? ' data-act="guia-start"' : '') + (act === id ? ' aria-current="page"' : '') + '>' + l + icon('chev') + '</a>').join('') +
      '</nav><p class="sheet-foot">' + esc(estadoTexto()) + '.</p></div>';
    btn.setAttribute('aria-expanded', 'true');
    requestAnimationFrame(() => { $('.sheet-backdrop', cap).classList.add('is-open'); $('.sheet', cap).classList.add('is-open'); $('.sheet a', cap).focus({ preventScroll: true }); });
    document.documentElement.style.overflow = 'hidden';
  }
  function closeMenu() {
    const cap = $('#capas'); const sh = $('.sheet', cap); if (!sh) return;
    sh.classList.remove('is-open'); $('.sheet-backdrop', cap).classList.remove('is-open');
    document.documentElement.style.overflow = '';
    const b = $('.menu-btn'); if (b) b.setAttribute('aria-expanded', 'false');
    setTimeout(() => { if (!$('.sheet.is-open', cap)) cap.innerHTML = ''; }, 300);
  }

  /* =========================================================
     Vistas
     ========================================================= */
  const VIEWS = {};

  /* ---------- Inicio ---------- */
  VIEWS.inicio = () => {
    const vs = Object.keys(VOT).map((k) => VOT[k]).sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));
    const nombreV = (v) => { const b = BID[v.boletin]; return b ? (b.nombreCorto || recorta(b.titulo, 72)) : 'Boletín ' + v.boletin; };
    // una fila por proyecto: la votación más reciente de cada uno
    const vistos = {}; const ult = []; vs.forEach((v) => { if (!vistos[v.boletin] && ult.length < 5) { vistos[v.boletin] = 1; ult.push(v); } });
    const disputada = vs.find((v) => v.camara !== 'Senado' && v.totales.no >= 15 && v.totales.si >= 15) || vs[0];
    const fila = (v) => { const t = v.totales; const tot = Math.max(1, t.si + t.no + t.abst + (t.disp || 0) + (t.pareo || 0)); const pc = (x) => (100 * x / tot).toFixed(1) + '%';
      return '<a class="f" href="#/votacion/' + v.id + '"><time class="num">' + fFechaCorta(v.fecha) + '</time><strong>' + esc(nombreV(v)) + '</strong><span class="vbar" role="img" aria-label="' + t.si + ' a favor, ' + t.no + ' en contra, ' + t.abst + ' abstenciones"><i class="si" style="width:' + pc(t.si) + '"></i><i class="no" style="width:' + pc(t.no) + '"></i><i class="ab" style="width:' + pc(t.abst) + '"></i></span><span class="res">' + esc(resultadoCorto(v)) + '</span></a>'; };
    const cinta = vs.slice(0, 8).map((v) => '<span><b>' + fFechaCorta(v.fecha) + '</b>' + camaraCorta(v) + ' · ' + esc(nombreV(v)) + ' · ' + v.totales.si + ' a favor, ' + v.totales.no + ' en contra' + (resultado(v) ? ' · ' + esc(resultado(v)) : '') + '</span>').join('');
    const temas = TEMAS.slice(0, 5);
    const sig = bloqueSeguimiento();
    return {
      title: 'Contraste · Investiga mejor. Contrasta fuentes.',
      html: '<div class="home"><section class="hero"><div class="campo"><h1 class="display" tabindex="-1"><span><b>Investiga mejor.</b></span> <span><b>Contrasta fuentes.</b></span></h1>' +
        '<div class="bajo"><p>Autoridades, votaciones oficiales y prensa, listas para tu trabajo.</p>' + searchForm({ id: 'q-home', size: 'lg', suggest: true }) +
        '<a class="guia" href="#/guia" data-act="guia-start">Optimiza tu búsqueda <i aria-hidden="true">→</i></a></div></div>' +
        '<div class="muro" id="muro" aria-label="Algunas de las autoridades en Contraste"></div></section>' +
        (cinta ? '<div class="cinta" aria-label="Últimas votaciones"><div class="cinta-in">' + cinta + cinta + '</div></div>' : '') +
        sig +
        '<section class="wrap sec reveal"><h2 class="h2">Por dónde empezar</h2><div class="temas">' + temas.map((x, i) => '<a class="tema" href="#/tema/' + x.id + '"><strong>' + esc(x.n) + '</strong><span>' + esc(x.gancho) + '</span></a>').join('') + '</div><a class="link-arrow" href="#/temas">Ver todos los temas' + icon('arrow') + '</a></section>' +
        '<section class="wrap sec"><h2 class="h2">Últimas votaciones</h2><div class="dos"><div class="tabla reveal">' + ult.map(fila).join('') + '<a class="f f-mas" href="#/proyectos">Ver todos los proyectos' + icon('arrow', 16) + '</a></div>' +
        (disputada ? '<a class="hemi-box" href="#/votacion/' + disputada.id + '"><h3>' + esc(nombreV(disputada)) + '</h3><small>' + camaraCorta(disputada) + ' · ' + fFecha(disputada.fecha) + ' · cada punto es ' + (disputada.camara === 'Senado' ? 'una senadora o senador' : 'una diputada o diputado') + '</small>' + hemiciclo(disputada) + leyendaCorta(disputada) + '</a>' : '') + '</div></section>' +
        '<section class="wrap sec reveal"><div class="atajos">' +
        '<form class="atajo" data-search="comuna"><label for="q-com-home"><strong>Busca por comuna</strong><span>¿Quiénes son los parlamentarios de una comuna?</span></label><div class="fila-in"><input id="q-com-home" name="q" list="lista-comunas" placeholder="Ej.: Maipú" autocomplete="off"><button class="btn btn-primary">Ver</button></div>' + datalistComunas() + '</form>' +
        '<a class="atajo" href="#/comparar"><strong>Compara dos parlamentarios</strong><span>En qué votaciones coincidieron y en cuáles no.</span>' + icon('arrow') + '</a>' +
        '<a class="atajo" href="#/contrastar"><strong>Contrasta medios</strong><span>Un mismo hecho, contado por distintos medios.</span>' + icon('arrow') + '</a></div></section>' +
        '</div>',
      mount: montarMuro
    };
  };

  /* ---------- Buscar ---------- */
  const TIPOS = ['Presidencia', 'Ministros', 'Senadores', 'Diputados', 'Gobernadores', 'Alcaldes'];
  const TIPO_SING = { Diputados: 'Diputada o diputado', Senadores: 'Senadora o senador', Ministros: 'Ministra o ministro', Alcaldes: 'Alcaldesa o alcalde', Gobernadores: 'Gobernadora o gobernador regional', Presidencia: 'Presidencia' };
  function filterGroups(st) {
    const partidos = uniq(P.map((p) => p.partidoF).concat(P.flatMap((p) => (p.partidoHist || []).map((h) => h.partido)))).sort((a, b) => a === 'Independiente' ? -1 : b === 'Independiente' ? 1 : a.localeCompare(b, 'es'));
    return [
      { key: 'partido', label: 'Partido político', multi: true, opts: partidos },
      { key: 'tipo', label: 'Tipo de autoridad', opts: TIPOS.filter((t) => P.some((p) => p.tipo === t)) },
      { key: 'region', label: 'Región', opts: uniq(P.map((p) => p.region)).sort((a, b) => a.localeCompare(b, 'es')) },
      { key: 'tema', label: 'Tema', opts: uniq(NEWS.map((n) => n.tema).concat(BILLS.map((b) => b.tema).filter(Boolean))).sort((a, b) => a.localeCompare(b, 'es')) },
      { key: 'medio', label: 'Tipo de medio', opts: uniq(NEWS.map((n) => n.tm)).sort((a, b) => a.localeCompare(b, 'es')) }
    ];
  }
  function filtersPanel(st, scope) {
    const groups = filterGroups(st);
    return '<div class="fold' + (UI.filtersOpen ? ' is-open' : '') + '" id="fold-filtros"><div class="fold-inner"' + (UI.filtersOpen ? '' : ' inert') + '><section class="panel" aria-label="Filtros">' +
      '<p class="panel-note">Los filtros son opcionales y te ayudan a encontrar más rápido lo que buscas.</p>' +
      groups.map((g) => {
        const cur = g.multi ? (st[g.key] ? st[g.key].split('|') : []) : [st[g.key]];
        return '<fieldset class="fgroup" style="border:0;margin:0;padding-left:0;padding-right:0"><legend class="fl" style="float:left;padding:0">' + esc(g.label) + (g.key === 'partido' ? ' ' + gl('Partido', 'Partido político') : '') + '</legend><div class="fopts">' +
          (g.multi ? '' : '<label class="chk"><input type="radio" name="f-' + g.key + '" value="" data-filter="' + g.key + '"' + (!st[g.key] ? ' checked' : '') + '>Todos</label>') +
          g.opts.map((o) => '<label class="chk"><input type="' + (g.multi ? 'checkbox' : 'radio') + '" name="f-' + g.key + '" value="' + esc(o) + '" data-filter="' + g.key + '"' + (cur.includes(o) ? ' checked' : '') + '>' + esc(o) + '</label>').join('') +
          (g.multi ? '<span class="meta" style="align-self:center">Puedes marcar varios</span>' : '') +
          '</div></fieldset>';
      }).join('') +
      '</section></div></div>';
  }
  GLOS['Partido'] = 'Para autoridades, es su partido o condición actual verificada. En noticias se usa el partido a la fecha de publicación cuando cambió (por ejemplo, una renuncia). En votaciones, el partido registrado a la fecha de cada votación.';

  function datePanel(st, idp) {
    const f = st.fecha || '';
    const isDia = /^dia:/.test(f); const isRango = /^rango:/.test(f);
    const dia = isDia ? f.slice(4) : ''; const rg = isRango ? f.slice(6).split('..') : ['', ''];
    const mode = UI.dateMode || (isDia ? 'dia' : isRango ? 'rango' : 'rapido');
    return '<div class="fold' + (UI.dateOpen ? ' is-open' : '') + '" id="fold-fecha-' + idp + '"><div class="fold-inner"' + (UI.dateOpen ? '' : ' inert') + '><section class="panel" aria-label="Filtrar por fecha">' +
      '<div class="datebar" role="group" aria-label="Períodos rápidos">' +
      Object.keys(PRESETS).map((k) => '<label class="chk"><input type="radio" name="f-fecha-' + idp + '" value="' + k + '" data-date="preset"' + (f === k ? ' checked' : '') + '>' + PRESETS[k] + '</label>').join('') +
      '<label class="chk"><input type="radio" name="f-fecha-' + idp + '" value="dia" data-date="mode"' + (mode === 'dia' && !PRESETS[f] ? ' checked' : '') + '>Fecha específica</label>' +
      '<label class="chk"><input type="radio" name="f-fecha-' + idp + '" value="rango" data-date="mode"' + (mode === 'rango' && !PRESETS[f] ? ' checked' : '') + '>Rango personalizado</label>' +
      '</div>' +
      '<div class="date-grid">' +
      (mode === 'dia' && !PRESETS[f] ? '<label class="field">Fecha<input type="date" data-date="dia" value="' + esc(dia) + '" max="' + CORTE + '"></label>' : '') +
      (mode === 'rango' && !PRESETS[f] ? '<label class="field">Desde<input type="date" data-date="desde" value="' + esc(rg[0]) + '" max="' + CORTE + '"></label><label class="field">Hasta<input type="date" data-date="hasta" value="' + esc(rg[1]) + '" max="' + CORTE + '"></label>' : '') +
      '</div>' +
      '<p class="date-help">Se usa la fecha real de cada registro: la <strong>publicación</strong> de una noticia, el <strong>ingreso</strong> de un proyecto de ley y el día de cada <strong>votación</strong>. Las autoridades aparecen si tienen noticias o votaciones en el período. Los períodos rápidos se cuentan hasta el ' + fFechaL(CORTE) + ', fecha de corte de los datos.</p>' +
      '</section></div></div>';
  }

  function activeChips(st, keys) {
    const chips = [];
    if (st.fecha && keys.includes('fecha')) chips.push(['fecha', '', icon('cal', 15) + esc(dateLabel(st.fecha))]);
    (st.partido ? st.partido.split('|') : []).forEach((p) => keys.includes('partido') && chips.push(['partido', p, esc(p)]));
    ['tipo', 'region', 'tema', 'medio', 'estado', 'origen', 'camara'].forEach((k) => { if (st[k] && keys.includes(k)) chips.push([k, '', esc(st[k])]); });
    if (!chips.length) return '';
    return '<div class="chips" aria-label="Filtros activos">' + chips.map(([k, v, l]) => '<button type="button" class="chip" data-act="unfilter" data-k="' + k + '" data-v="' + esc(v) + '" aria-label="Quitar filtro: ' + esc(l.replace(/<[^>]+>/g, '')) + '">' + l + icon('x', 15) + '</button>').join('') +
      '<button type="button" class="btn btn-quiet btn-sm" data-act="unfilter-all">Limpiar filtros</button></div>';
  }

  const UI = { filtersOpen: false, dateOpen: false, dateMode: null };

  VIEWS.buscar = (route) => {
    const st = route.params;
    return {
      title: (st.q ? '«' + st.q + '» · ' : '') + 'Buscar · Contraste',
      html: '<div class="page"><div class="wrap">' +
        '<div class="page-head"><h1 class="h1" tabindex="-1">Buscar</h1></div>' +
        searchForm({ id: 'q-buscar', size: 'md', value: st.q || '', mode: 'live' }) +
        '<div class="toolbar">' +
        '<button type="button" class="btn btn-line' + (st.fecha ? ' is-on' : '') + '" data-act="toggle-date" data-p="b" aria-expanded="' + UI.dateOpen + '" aria-controls="fold-fecha-b">' + icon('cal') + 'Filtrar por fecha</button>' +
        '<button type="button" class="btn btn-line" data-act="toggle-filters" aria-expanded="' + UI.filtersOpen + '" aria-controls="fold-filtros">' + icon('filter') + 'Filtros<span class="count" data-filters-count></span></button>' +
        '<span class="spacer"></span>' +
        '<label class="inline" for="orden">Ordenar</label><select id="orden" data-param="orden"><option value="relevancia">Relevancia</option><option value="fecha"' + (st.orden === 'fecha' ? ' selected' : '') + '>Más recientes</option><option value="autoridad"' + (st.orden === 'autoridad' ? ' selected' : '') + '>Autoridad (A–Z)</option></select>' +
        '<button type="button" class="btn btn-quiet" data-act="share-here" data-title="Búsqueda en Contraste">' + icon('share') + '<span>Compartir<span class="lbl-largo"> búsqueda</span></span></button>' +
        '<a class="btn btn-quiet" href="#/guia">' + icon('guide') + '<span>Optimiza<span class="lbl-largo"> tu búsqueda</span></span></a>' +
        '</div>' +
        datePanel(st, 'b') + filtersPanel(st) +
        '<div id="chips-b">' + activeChips(st, ['fecha', 'partido', 'tipo', 'region', 'tema', 'medio']) + '</div>' +
        '<div id="res-b"></div></div></div>',
      mount: () => { renderResults(route); }
    };
  };

  function renderResults(route, opts) {
    const st = route.params; const cat = st.cat || 'todos';
    const R = runSearch(st);
    const lim = +(st.n || 0) || 10;
    const tabs = [['todos', 'Todos', R.people.length + R.news.length + R.bills.length], ['autoridades', 'Autoridades', R.people.length], ['noticias', 'Noticias', R.news.length], ['proyectos', 'Proyectos', R.bills.length]];
    let body = '';
    const none = !R.people.length && !R.news.length && !R.bills.length && !comunaDe(st.q);
    const partyNote = st.partido && cat === 'proyectos' ? '<p class="meta" style="margin:12px 0 0">El partido se aplica a las autoridades vinculadas a cada proyecto. Para ver cómo votó cada partido, abre una votación.</p>' : '';
    if (none) {
      const hayFiltros = ['fecha', 'partido', 'tipo', 'region', 'tema', 'medio'].some((k) => st[k]);
      UI.sinResultados = !hayFiltros && st.q;
      body = emptyBox('No encontramos resultados' + (st.q ? ' para «' + st.q + '»' : ''),
        hayFiltros ? 'Prueba quitando algunos filtros o ampliando el período. Los datos de Contraste llegan hasta el ' + fFechaL(CORTE) + '.' : 'No está en Contraste todavía, pero puedes seguir buscando en las fuentes de abajo. También puedes probar con un apellido, un tema o un número de boletín.',
        (hayFiltros ? '<button type="button" class="btn btn-line" data-act="unfilter-all">Quitar filtros</button>' : '') + '<a class="btn btn-line" href="#/guia" data-act="guia-start">' + icon('guide') + 'Búsqueda guiada</a><a class="btn btn-quiet" href="#/autoridades">Ver todas las autoridades</a>') + (st.q ? busquedaExterna(st.q) : '');
    } else if (cat === 'todos') {
      body += bloqueComuna(st.q);
      if (R.people.length) body += '<section class="section"><div class="section-head"><h2 class="h2">Autoridades <span class="count">' + R.people.length + '</span></h2>' + (R.people.length > 4 ? '<button type="button" class="btn btn-quiet" data-act="cat" data-cat="autoridades">Ver todas' + icon('arrow', 16) + '</button>' : '') + '</div><div class="people enter">' + R.people.slice(0, 4).map((p, i) => personRow(p).replace('class="person"', 'class="person" style="--i:' + i + '"')).join('') + '</div></section>';
      if (R.bills.length) body += '<section class="section"><div class="section-head"><h2 class="h2">Proyectos de ley <span class="count">' + R.bills.length + '</span></h2>' + (R.bills.length > 3 ? '<button type="button" class="btn btn-quiet" data-act="cat" data-cat="proyectos">Ver todos' + icon('arrow', 16) + '</button>' : '') + '</div><div class="records enter">' + R.bills.slice(0, 3).map(billRecord).join('') + '</div></section>';
      if (R.news.length) body += '<section class="section"><div class="section-head"><h2 class="h2">Noticias <span class="count">' + R.news.length + '</span></h2>' + (R.news.length > 5 ? '<button type="button" class="btn btn-quiet" data-act="cat" data-cat="noticias">Ver todas' + icon('arrow', 16) + '</button>' : '') + '</div><div class="records enter">' + R.news.slice(0, 5).map((n) => newsRecord(n)).join('') + '</div></section>';
      body += (R.people.length + R.news.length + R.bills.length) && st.q ? busquedaExterna(st.q, true) : '';
    } else {
      const list = cat === 'autoridades' ? R.people : cat === 'noticias' ? R.news : R.bills;
      if (!list.length) body = emptyBox('Nada en esta pestaña', 'Hay resultados en otras categorías. Revisa «Todos» o ajusta los filtros.', '<button type="button" class="btn btn-line" data-act="cat" data-cat="todos">Ver todos los resultados</button>');
      else {
        const shown = list.slice(0, lim);
        body = '<div class="section" style="margin-top:20px">' + (cat === 'autoridades' ? '<div class="people enter">' + shown.map((p) => personRow(p)).join('') + '</div>'
          : '<div class="records enter">' + shown.map((x) => cat === 'noticias' ? newsRecord(x) : billRecord(x)).join('') + '</div>') +
          (list.length > lim ? '<div class="more-row"><button type="button" class="btn btn-line" data-act="more">Ver más <span class="count">(' + (list.length - lim) + ')</span></button></div>' : '') + '</div>';
      }
    }
    const res = $('#res-b'); if (!res) return;
    res.innerHTML = '<div class="tabs" role="tablist" aria-label="Tipo de resultado">' + tabs.map(([id, l, n]) => '<button type="button" class="tab" role="tab" data-act="cat" data-cat="' + id + '" aria-selected="' + (cat === id) + '">' + l + ' <span class="n">' + n + '</span></button>').join('') + '<span class="tab-ink" aria-hidden="true"></span></div>' + partyNote + '<div aria-live="polite" class="sr-only">' + (none ? 'Sin resultados' : plural(R.people.length + R.news.length + R.bills.length, 'resultado', 'resultados')) + '</div>' + body;
    if (opts && opts.quiet) $$('.enter', res).forEach((e) => e.classList.remove('enter'));
    placeInk(res, !(opts && opts.animateInk));
    const n = ['partido', 'tipo', 'region', 'tema', 'medio'].reduce((a, k) => a + (st[k] ? st[k].split('|').length : 0), 0);
    const c = $('[data-filters-count]'); if (c) c.textContent = n ? ' (' + n + ')' : '';
    const chips = $('#chips-b'); if (chips) chips.innerHTML = activeChips(st, ['fecha', 'partido', 'tipo', 'region', 'tema', 'medio']);
    const db = $('[data-act="toggle-date"][data-p="b"]'); if (db) db.classList.toggle('is-on', !!st.fecha);
  }

  // Subrayado de la pestaña activa. Con `from` parte desde la posición anterior para deslizarse.
  let lastInk = null;
  function placeInk(scope, instant) {
    const tl = $('.tabs', scope); if (!tl) return;
    const ink = $('.tab-ink', tl); const sel = $('.tab[aria-selected="true"]', tl); if (!ink || !sel) return;
    const tf = (x, w) => 'translateX(' + x + 'px) scaleX(' + (w / 100) + ')';
    if (!instant && lastInk && !ink.dataset.placed) {
      ink.style.transition = 'none'; ink.style.transform = tf(lastInk.x, lastInk.w);
      ink.getBoundingClientRect(); ink.style.transition = '';
    } else if (instant) ink.style.transition = 'none';
    ink.style.transform = tf(sel.offsetLeft, sel.offsetWidth);
    ink.dataset.placed = '1';
    lastInk = { w: sel.offsetWidth, x: sel.offsetLeft };
    if (instant) { ink.getBoundingClientRect(); ink.style.transition = ''; }
  }

  /* ---------- Directorio de autoridades ---------- */
  VIEWS.autoridades = (route) => {
    const st = route.params; const lim = +(st.n || 0) || 24;
    const parties = st.partido ? st.partido.split('|') : [];
    const list = P.filter((p) => (!st.tipo || p.tipo === st.tipo) && (!st.region || p.region === st.region) && (!parties.length || parties.includes(p.partidoF)))
      .sort((a, b) => TIPOS.indexOf(a.tipo) - TIPOS.indexOf(b.tipo) || (a.basica ? 1 : 0) - (b.basica ? 1 : 0) || a.nombre.localeCompare(b.nombre, 'es'));
    const tipos = ['', ...TIPOS.filter((t) => P.some((p) => p.tipo === t))];
    const curadosPrimero = (a, b) => (a.basica ? 1 : 0) - (b.basica ? 1 : 0);
    const partidos = uniq(P.map((p) => p.partidoF)).sort((a, b) => a.localeCompare(b, 'es'));
    const regiones = uniq(P.map((p) => p.region)).sort((a, b) => a.localeCompare(b, 'es'));
    return {
      title: 'Autoridades · Contraste',
      html: '<div class="page"><div class="wrap">' +
        '<div class="page-head"><h1 class="h1" tabindex="-1">Autoridades</h1><p class="lede">' + P.length + ' autoridades: Presidencia, gabinete, todo el Congreso y gobernaciones regionales. Las marcadas como ficha básica se generan desde datos oficiales.</p></div>' +
        ((!st.tipo || st.tipo === 'Ministros') && (EST.gabinete || []).length ? '<div class="callout" style="margin-bottom:14px">' + icon('info') + '<span>La prensa informa movimientos en el gabinete. La lista de ministros se revisa a mano y podría no reflejarlos todavía: <a href="' + esc(EST.gabinete[0].u) + '" target="_blank" rel="noopener">' + esc(EST.gabinete[0].m) + ', ' + fFecha(EST.gabinete[0].d) + '</a>.</span></div>' : '') +
        '<div class="seg" role="group" aria-label="Tipo de autoridad" style="flex-wrap:wrap">' + tipos.map((t) => '<button type="button" aria-pressed="' + ((st.tipo || '') === t) + '" data-act="dir" data-k="tipo" data-v="' + t + '">' + (t || 'Todas') + '</button>').join('') + '</div>' +
        '<div class="toolbar"><label class="inline" for="dir-partido">Partido político</label><select id="dir-partido" data-dir="partido"><option value="">Todos</option>' + partidos.map((x) => '<option' + (parties[0] === x ? ' selected' : '') + '>' + esc(x) + '</option>').join('') + '</select>' +
        '<label class="inline" for="dir-region">Región</label><select id="dir-region" data-dir="region"><option value="">Todas</option>' + regiones.map((x) => '<option' + (st.region === x ? ' selected' : '') + '>' + esc(x) + '</option>').join('') + '</select>' +
        '<span class="spacer"></span><span class="meta num">' + plural(list.length, 'autoridad', 'autoridades') + '</span></div>' +
        (list.length ? '<div class="people enter" style="margin-top:16px">' + list.slice(0, lim).map((p, i) => personRow(p).replace('class="person"', 'class="person" style="--i:' + (i % 8) + '"')).join('') + '</div>' +
          (list.length > lim ? '<div class="more-row"><button type="button" class="btn btn-line" data-act="dir-more">Ver más <span class="count">(' + (list.length - lim) + ')</span></button></div>' : '')
          : '<div style="margin-top:16px">' + emptyBox('Ninguna autoridad calza con esa combinación', 'Quita uno de los filtros para ver más perfiles.', '<a class="btn btn-line" href="#/autoridades">Ver todas</a>') + '</div>') +
        '</div></div>'
    };
  };

  /* ---------- Perfil ---------- */
  VIEWS.autoridad = (route) => {
    const p = PID[route.parts[1]];
    if (!p) return VIEWS.noencontrado();
    const tab = route.parts[2] || 'perfil';
    const pv = personVotes(p);
    const nDec = (p.vot || []).length + pv.length; UI.pvLim = 30; UI.pvDist = false;
    const tabs = [['perfil', 'Perfil', ''], ['noticias', 'Noticias', newsOf(p).length], ['votaciones', esParl(p) ? 'Votaciones y decisiones' : 'Decisiones', nDec], ['fuentes', 'Fuentes', (p.fue || []).length]];
    return {
      title: p.nombre + ' · Contraste',
      html: '<div class="profile-head"><div class="wrap">' +
        '<button type="button" class="back" data-act="back">' + icon('back') + 'Volver</button>' +
        '<div class="p-top">' + photoTag(p, 132, 'p-photo').replace('loading="lazy"', 'loading="eager"') +
        '<div class="p-id"><h1 class="h1" tabindex="-1">' + esc(p.nombre) + '</h1><span class="p-cargo-l">' + esc(p.cargo) + '</span>' +
        '<span class="p-facts">' + [p.partido, p.region, p.periodo].filter(Boolean).map((x) => '<span>' + esc(x) + '</span>').join('') + '</span>' + (p.basica ? '<span class="ficha-b">Ficha básica · datos oficiales</span>' : '') +
        (p.foto ? '<span class="p-credit">Foto: ' + esc(p.fotoCred) + (p.fotoFuente ? ', vía ' + esc(p.fotoFuente) : '') + '</span>' : '<span class="p-credit">Sin fotografía con licencia verificable; se muestra un avatar neutro.</span>') + '</div>' +
        '<div class="p-actions">' + segBtn('person', p.id) + (esParl(p) ? '<a class="btn btn-line" href="' + buildHash('comparar', [], { a: p.id }) + '">' + icon('compare', 16) + 'Comparar</a>' : '') + '<a class="btn btn-line" href="' + esc(p.oficialUrl) + '" target="_blank" rel="noopener">Ficha oficial · ' + esc(p.oficialFuente) + icon('ext', 16) + '</a>' +
        '<button type="button" class="btn btn-quiet" data-act="share" data-url="#/autoridad/' + p.id + '" data-title="' + esc(p.nombre) + '">' + icon('share') + 'Compartir perfil</button>' +
        '<button type="button" class="btn btn-quiet" data-act="ref" data-kind="person" data-id="' + p.id + '">' + icon('copy') + 'Citar en APA</button>' + saveBtn('person', p.id) + '</div></div>' +
        '<div class="tabs" role="tablist" aria-label="Secciones del perfil" style="margin-top:0;box-shadow:none">' + tabs.map(([id, l, n]) => '<a class="tab" role="tab" href="#/autoridad/' + p.id + (id === 'perfil' ? '' : '/' + id) + '" data-act="ptab" data-tab="' + id + '" aria-selected="' + (tab === id) + '" aria-controls="ptab-panel">' + l + (n !== '' ? ' <span class="n">' + n + '</span>' : '') + '</a>').join('') + '<span class="tab-ink" aria-hidden="true"></span></div>' +
        '</div></div>' +
        '<div class="page" style="padding-top:28px"><div class="wrap" id="ptab-panel" role="tabpanel">' + profileTab(p, tab, pv) + '</div></div>',
      mount: () => placeInk($('.profile-head'), true)
    };
  };

  function profileTab(p, tab, pv) {
    if (tab === 'noticias') {
      const ns = newsOf(p).sort((a, b) => b.d.localeCompare(a.d));
      const evs = uniq(ns.filter((n) => n.ev).map((n) => n.ev));
      return '<div class="section-head" style="margin-top:0"><h2 class="h2">Noticias <span class="count">' + ns.length + '</span></h2><span class="meta">De la más reciente a la más antigua · ' + uniq(ns.map((n) => n.medio)).length + ' medios distintos</span></div>' +
        (evs.length ? '<p class="meta" style="margin-bottom:12px">' + plural(evs.length, 'hecho tiene', 'hechos tienen') + ' cobertura de varios medios para comparar: ' + evs.map((k) => '<a href="#/contrastar/' + k + '">' + esc(E[k].titulo) + '</a>').join(', ') + '.</p>' : '') +
        (ns.length ? '<div class="records enter">' + ns.map((n) => newsRecord(n, { persona: n.pid !== p.id })).join('') + '</div>' : emptyBox('Sin noticias registradas', 'Todavía no hay noticias verificadas para esta autoridad.'));
    }
    if (tab === 'votaciones') {
      const decs = (p.vot || []).map((v, k) => Object.assign({ k }, v)).sort((a, b) => b.d.localeCompare(a.d));
      let html = '';
      if (esParl(p)) {
        html += '<div id="pv-box">' + bloqueVotosPersona(p, pv) + '</div>';
      } else {
        html += '<p class="meta" style="margin-bottom:12px">' + esc(p.nombre) + ' no vota proyectos de ley: es ' + esc(p.cargoCorto.charAt(0).toLowerCase() + p.cargoCorto.slice(1)) + '. Mostramos decisiones y hechos de su gestión, con su fuente.</p>';
      }
      if (decs.length) {
        html += '<div class="section-head"' + (esParl(p) ? '' : ' style="margin-top:0"') + '><h2 class="h2">' + (esParl(p) ? 'Otras decisiones y votaciones informadas' : 'Decisiones y hechos') + ' <span class="count">' + decs.length + '</span></h2></div>' +
          '<div class="records">' + decs.map((v) => {
            const cls = v.voto === 'A favor' ? 'b-si' : v.voto === 'En contra' ? 'b-no' : v.voto === 'Abstención' ? 'b-abs' : 'b-info';
            return '<article class="record"><div class="record-stamp"><strong class="num">' + esc(v.fecha) + '</strong><span class="dot">' + esc(v.instancia) + '</span><span class="dot"><span class="badge ' + cls + '">' + esc(v.voto) + '</span> ' + gl(v.voto) + '</span></div>' +
              '<h3 class="h3">' + esc(v.titulo) + '</h3><p class="sum">' + esc(v.detalle) + '</p>' +
              '<div class="record-actions"><a class="ext" href="' + esc(v.url) + '" target="_blank" rel="noopener">Fuente: ' + esc(v.fuente) + icon('ext', 16) + '</a>' +
              (v.proyecto && BID[v.proyecto] ? '<a class="ext" href="#/proyecto/' + v.proyecto + '">Ver proyecto y votación oficial</a>' : '') +
              '<button type="button" class="btn btn-quiet btn-sm" data-act="ref" data-kind="decision" data-id="' + p.id + '|' + v.k + '">' + icon('copy', 16) + 'Citar</button></div></article>';
          }).join('') + '</div>';
      }
      return html;
    }
    if (tab === 'fuentes') {
      return '<div class="section-head" style="margin-top:0"><h2 class="h2">Registros oficiales</h2></div><div class="records">' +
        (p.fue || []).map((f, k) => '<article class="record"><div class="record-stamp"><strong>' + esc(f.fuente) + '</strong><span class="dot"><span class="badge ' + (f.estado === 'Revisado' ? 'b-ok' : 'b-otro') + '">' + esc(f.estado) + '</span> ' + gl(f.estado) + '</span></div>' +
          '<h3 class="h3">' + esc(f.titulo) + '</h3><div class="record-actions"><a class="ext" href="' + esc(f.url) + '" target="_blank" rel="noopener">Abrir fuente' + icon('ext', 16) + '</a><button type="button" class="btn btn-quiet btn-sm" data-act="ref" data-kind="fuente" data-id="' + p.id + '|' + k + '">' + icon('copy', 16) + 'Citar</button></div></article>').join('') + '</div>' +
        '<div class="section"><div class="section-head"><h2 class="h2">Datos con versiones distintas</h2></div>' +
        ((p.conf || []).length ? p.conf.map((k) => '<div class="records" style="margin-bottom:12px"><div class="record"><div class="record-stamp"><strong>' + esc(k.tema) + '</strong><span class="dot"><span class="badge ' + (k.estado === 'Aclarado' ? 'b-ok' : 'b-warn') + '">' + esc(k.estado) + '</span> ' + gl(k.estado) + '</span></div>' +
          '<dl class="facts" style="padding:0;margin-top:8px"><div><dt>' + esc(k.aFuente) + '</dt><dd>' + esc(k.aDice) + '</dd></div><div><dt>' + esc(k.bFuente) + '</dt><dd>' + esc(k.bDice) + '</dd></div><div><dt>Lo que lo aclara · ' + esc(k.aclaraFuente) + '</dt><dd>' + esc(k.aclara) + '</dd></div></dl></div></div>').join('')
          : '<p class="meta">No detectamos datos contradictorios entre las fuentes revisadas.</p>') + '</div>';
    }
    // perfil
    const tray = p.trayectoria || [];
    const rel = relatedForPerson(p, pv);
    return (p.conf && p.conf.length ? '<a class="callout" style="margin-bottom:20px;text-decoration:none" href="#/autoridad/' + p.id + '/fuentes" data-act="ptab" data-tab="fuentes">' + icon('info') + plural(p.conf.length, 'dato tiene', 'datos tienen') + ' versiones distintas según la fuente. Ver detalle</a>' : '') +
      '<div class="p-grid"><div>' +
      '<h2 class="h2" style="margin-bottom:10px">Reseña</h2><p class="read">' + esc(p.resena) + '</p>' +
      ((p.temas || []).length ? '<div class="topics" style="margin-top:16px" aria-label="Temas">' + p.temas.map((t) => '<a class="topic" style="text-decoration:none" href="' + buildHash('buscar', [], { q: t }) + '">' + esc(t) + '</a>').join('') + '</div>' : '') +
      (tray.length ? '<h2 class="h2" style="margin:32px 0 6px">Trayectoria pública</h2><ul class="timeline">' + tray.map((t) => '<li><span class="when">' + esc(t.periodo) + '</span><span>' + esc(t.cargo) + (t.actual ? '<span class="now">Cargo actual</span>' : '') + '</span></li>').join('') + '</ul>' + (p.trayFuente ? '<p class="meta" style="margin-top:6px">Fuente: ' + esc(p.trayFuente) + '</p>' : '') : '') +
      '</div><div>' +
      '<dl class="facts">' + [['Cargo', p.cargo], ['Institución', p.institucion], ['Partido o condición', p.partido], ['Región o territorio', p.region], ['Período', p.periodo]].concat(p.mail ? [['Correo oficial', p.mail]] : []).concat(p.fono ? [['Teléfono oficial', p.fono]] : []).filter(([, v]) => v).map(([k, v]) => '<div><dt>' + k + '</dt><dd>' + esc(v) + '</dd></div>').join('') + '</dl>' +
      rel + '</div></div>';
  }

  function relatedForPerson(p, pv) {
    const bills = uniq(pv.map((v) => v.boletin).concat(BILLS.filter((b) => (b.relacionados || []).includes(p.id)).map((b) => b.boletin))).map((b) => BID[b]).filter(Boolean);
    const evs = uniq((p.news || []).filter((n) => n.ev).map((n) => n.ev));
    if (!bills.length && !evs.length) return '';
    return '<div style="margin-top:24px"><h2 class="h2" style="font-size:1.0625rem;margin-bottom:8px">Relacionado</h2><div class="records">' +
      bills.map((b) => '<a class="record" style="text-decoration:none;color:inherit;display:block" href="#/proyecto/' + b.boletin + '"><span class="record-stamp"><strong class="bill-num">Boletín ' + b.boletin + '</strong><span class="dot">Proyecto de ley</span></span><span class="h3" style="display:block;font-size:1rem;margin-top:4px">' + esc(b.nombreCorto || b.titulo) + '</span></a>').join('') +
      evs.map((k) => '<a class="record" style="text-decoration:none;color:inherit;display:block" href="#/contrastar/' + k + '"><span class="record-stamp"><strong>Contrastar cobertura</strong><span class="dot">' + E[k].items.length + ' medios</span></span><span class="h3" style="display:block;font-size:1rem;margin-top:4px">' + esc(E[k].titulo) + '</span></a>').join('') +
      '</div></div>';
  }

  /* ---------- Contrastar ---------- */
  const abbr = (m) => { const w = m.replace(/[^A-Za-zÁÉÍÓÚÑáéíóúñ0-9 ]/g, '').split(' ').filter((x) => x.length > 2 || /^[A-Z0-9]/.test(x)); return (w.length > 1 ? w[0][0] + w[1][0] : m.slice(0, 2)).toUpperCase(); };
  const cap1 = (t) => t.charAt(0).toUpperCase() + t.slice(1);
  VIEWS.contrastar = (route) => {
    if (route.parts[1]) return VIEWS.evento(route);
    const keys = Object.keys(E).sort((a, b) => evDate(b).localeCompare(evDate(a)));
    return {
      title: 'Contrastar cobertura · Contraste',
      html: '<div class="page"><div class="wrap">' +
        '<div class="page-head"><h1 class="h1" tabindex="-1">Contrastar cobertura</h1><p class="lede">Un mismo hecho, contado por distintos medios. Compara qué informa cada publicación y saca tus propias conclusiones.</p></div>' +
        '<div class="records enter">' + keys.map((k) => {
          const e = E[k];
          return '<a class="record" style="display:block;text-decoration:none;color:inherit" href="#/contrastar/' + k + '"><span class="record-stamp"><strong class="num">' + esc(e.fecha) + '</strong><span class="dot">' + plural(e.items.length, 'medio', 'medios') + ': ' + esc(e.items.map((i) => i.medio).join(', ')) + '</span></span>' +
            '<span class="h3" style="display:block;margin-top:6px">' + esc(e.titulo) + '</span><span class="link-arrow" style="color:var(--accent);min-height:36px">Ver comparación' + icon('arrow', 16) + '</span></a>';
        }).join('') + '</div>' +
        '<p class="meta" style="margin-top:16px;max-width:70ch">Contraste no evalúa qué medio tiene la razón ni asigna etiquetas de sesgo. Describe qué informa cada publicación, con enlace al original.</p>' +
        '</div></div>'
    };
  };
  const evDate = (k) => { const ds = NEWS.filter((n) => n.ev === k).map((n) => n.d).sort(); return ds.pop() || ''; };

  VIEWS.evento = (route) => {
    const k = route.parts[1]; const e = E[k]; if (!e) return VIEWS.noencontrado();
    const meds = e.items.map((i) => i.medio);
    const quienes = uniq(NEWS.filter((n) => n.ev === k).map((n) => n.pid)).map((id) => PID[id]);
    const bill = e.proyecto && BID[e.proyecto];
    const who = (fn) => '<span class="cmp-who">' + meds.map((m) => { const on = fn(m); return '<span class="w ' + (on ? 'on' : 'off') + '" title="' + esc(m) + (on ? ' lo informa' : ' no lo menciona') + '"><span class="sr-only">' + esc(m) + (on ? ': lo informa' : ': no lo menciona') + '</span><span aria-hidden="true">' + esc(m) + '</span></span>'; }).join('') + '</span>';
    return {
      title: e.titulo + ' · Contrastar · Contraste',
      html: '<div class="page"><div class="wrap">' +
        '<button type="button" class="back" data-act="back">' + icon('back') + 'Volver</button>' +
        '<div class="page-head"><h1 class="h1" tabindex="-1" style="max-width:24ch">' + esc(e.titulo) + '</h1>' +
        '<span class="meta num">' + esc(e.fecha) + ' · ' + e.items.length + ' publicaciones de medios distintos, puestas lado a lado</span>' +
        '<div class="record-actions" style="margin-top:4px"><button type="button" class="btn btn-quiet" data-act="share" data-url="#/contrastar/' + k + '" data-title="' + esc(e.titulo) + '">' + icon('share') + 'Compartir comparación</button><button type="button" class="btn btn-quiet" data-act="ref" data-kind="event" data-id="' + k + '">' + icon('copy') + 'Citar</button></div></div>' +
        '<div class="cmp"><h2 class="sr-only">Publicaciones comparadas</h2><div class="cmp-cols" style="--cols:' + e.items.length + '">' +
        e.items.map((it) => '<article class="cmp-col"><div class="cmp-outlet"><span class="cmp-mark" aria-hidden="true">' + esc(abbr(it.medio)) + '</span><span><strong>' + esc(it.medio) + '</strong><span class="meta num" style="display:block">' + esc(it.fecha) + '</span></span></div>' +
          '<h3 class="h3">' + esc(it.titulo) + '</h3>' + (it.orig ? '' : '<span class="note-tag">Titular resumido · el original está en el enlace</span>') +
          '<p class="sum">' + esc(it.resumen) + '</p><a class="ext" href="' + esc(it.url) + '" target="_blank" rel="noopener">Leer original' + icon('ext', 16) + '</a></article>').join('') + '</div>' +
        '<section class="cmp-sec"><div class="cmp-sec-h"><h2 class="h2">Coincidencias</h2><span>Hechos presentes en todas las publicaciones</span></div><ul class="cmp-list">' +
        e.coinc.map((t) => '<li><span>' + esc(t) + '</span>' + who(() => true) + '</li>').join('') + '</ul></section>' +
        '<section class="cmp-sec"><div class="cmp-sec-h"><h2 class="h2">Diferencias de cobertura</h2><span>En qué pone el foco cada medio</span></div><div class="cmp-focus" style="--cols:' + meds.length + '">' +
        meds.map((m) => { const f = e.enfoques.find((x) => x.medio === m); return '<div><span class="who">' + esc(m) + '</span><p>' + (f ? esc(cap1(f.t)) : '<span class="muted">Sin un foco distinto identificado.</span>') + '</p></div>'; }).join('') + '</div></section>' +
        '<section class="cmp-sec"><div class="cmp-sec-h"><h2 class="h2">Información complementaria</h2><span>Antecedentes que aparecen solo en algunas publicaciones</span></div><ul class="cmp-list">' +
        e.compl.map((c) => '<li><span>' + esc(cap1(c.t)) + '</span>' + who((m) => m === c.medio) + '</li>').join('') + '</ul></section>' +
        '<div class="cmp-legend"><span><span class="w" style="background:var(--navy);color:#fff;padding:2px 6px;font-weight:650">Medio</span> lo informa</span><span><span style="text-decoration:line-through">Medio</span> no lo menciona</span></div>' +
        '</div>' +
        '<p class="meta" style="margin-top:16px;max-width:75ch">Contraste no evalúa qué medio tiene la razón. La comparación describe qué informa cada publicación para que saques tus propias conclusiones.</p>' +
        ((quienes.length || bill) ? '<div class="section"><div class="section-head"><h2 class="h2">Relacionado</h2></div>' +
          (bill ? '<div class="records" style="margin-bottom:12px"><a class="record" style="display:block;text-decoration:none;color:inherit" href="#/proyecto/' + bill.boletin + '"><span class="record-stamp"><strong class="bill-num">Boletín ' + bill.boletin + '</strong><span class="dot">Proyecto de ley y votaciones oficiales</span></span><span class="h3" style="display:block;margin-top:4px">' + esc(bill.nombreCorto || bill.titulo) + '</span></a></div>' : '') +
          (quienes.length ? '<div class="people">' + quienes.map((p) => personRow(p)).join('') + '</div>' : '') + '</div>' : '') +
        '</div></div>'
    };
  };

  /* ---------- Proyectos de ley ---------- */
  VIEWS.proyectos = (route) => {
    const st = route.params;
    return {
      title: 'Proyectos de ley · Contraste',
      html: '<div class="page"><div class="wrap">' +
        '<div class="page-head"><h1 class="h1" tabindex="-1">Proyectos de ley</h1><p class="lede">Proyectos con su tramitación y el registro completo de cada votación en la Sala de la Cámara y del Senado.</p></div>' +
        searchForm({ id: 'q-proy', size: 'md', value: st.q || '', mode: 'proy', placeholder: 'Nombre, palabra clave o número de boletín (ej. 15805-07)' }) +
        '<div class="toolbar">' +
        '<button type="button" class="btn btn-line' + (st.fecha ? ' is-on' : '') + '" data-act="toggle-date" data-p="p" aria-expanded="' + UI.dateOpen + '" aria-controls="fold-fecha-p">' + icon('cal') + 'Filtrar por fecha de ingreso</button>' +
        '<label class="inline" for="p-tema">Tema</label><select id="p-tema" data-pparam="tema"><option value="">Todos</option>' + uniq(BILLS.map((b) => b.tema).filter(Boolean)).sort().map((t) => '<option' + (st.tema === t ? ' selected' : '') + '>' + esc(t) + '</option>').join('') + '</select>' +
        '<label class="inline" for="p-estado">Estado</label><select id="p-estado" data-pparam="estado"><option value="">Todos</option>' + uniq(BILLS.map((b) => b.estadoCorto).filter(Boolean)).sort().map((t) => '<option' + (st.estado === t ? ' selected' : '') + '>' + esc(t) + '</option>').join('') + '</select>' +
        '<label class="inline" for="p-origen">Origen</label><select id="p-origen" data-pparam="origen"><option value="">Ambas cámaras</option>' + uniq(BILLS.map((b) => b.origen)).sort().map((t) => '<option' + (st.origen === t ? ' selected' : '') + '>' + esc(t) + '</option>').join('') + '</select>' +
        '<span class="spacer"></span><button type="button" class="btn btn-quiet" data-act="share-here" data-title="Proyectos de ley en Contraste">' + icon('share') + '<span>Compartir<span class="lbl-largo"> búsqueda</span></span></button>' +
        '</div>' + datePanel(st, 'p') +
        '<div id="chips-p"></div><div id="res-p" style="margin-top:16px"></div>' +
        '<p class="meta" style="margin-top:16px;max-width:72ch">Contraste reúne todos los proyectos votados en la Sala de la Cámara o del Senado desde el 11 de marzo de 2026, además de otros con seguimiento. Datos consultados el ' + fFechaL(LEG.consulta || CORTE) + '. ' + gl('Boletín') + ' ' + gl('Trámite legislativo') + '</p>' +
        '</div></div>',
      mount: () => renderBills(route)
    };
  };
  function renderBills(route) {
    const st = route.params; const toks = tokens(expandQuery(st.q || '')); const r = dateRange(st.fecha);
    const list = BILLS.map((b) => ({ b, s: scoreText(bFields(b), toks) })).filter((x) => x.s > 0 && inRange(x.b.ingreso, r) && (!st.tema || x.b.tema === st.tema) && (!st.estado || x.b.estadoCorto === st.estado) && (!st.origen || x.b.origen === st.origen))
      .sort((a, c) => (toks.length ? c.s - a.s : 0) || c.b.ingreso.localeCompare(a.b.ingreso)).map((x) => x.b);
    $('#res-p').innerHTML = (BILLS.length ? '' : emptyBox('Datos legislativos no cargados', 'Recarga la página para volver a intentarlo.')) +
      (list.length ? '<p class="meta" aria-live="polite" style="margin-bottom:8px">' + plural(list.length, 'proyecto', 'proyectos') + '</p><div class="records enter">' + list.slice(0, UI.billsLim || 25).map(billRecord).join('') + '</div>' + (list.length > (UI.billsLim || 25) ? '<div class="more-row"><button type="button" class="btn btn-line" data-act="bills-more">Ver más <span class="count">(' + (list.length - (UI.billsLim || 25)) + ')</span></button></div>' : '')
        : BILLS.length ? emptyBox('No hay proyectos con esa combinación', 'Prueba con otra palabra o quita filtros. También puedes buscar por número de boletín.', '<a class="btn btn-line" href="#/proyectos">Ver todos los proyectos</a>') : '');
    $('#chips-p').innerHTML = activeChips(st, ['fecha', 'tema', 'estado', 'origen']);
    const db = $('[data-act="toggle-date"][data-p="p"]'); if (db) db.classList.toggle('is-on', !!st.fecha);
  }

  VIEWS.proyecto = (route) => {
    const b = BID[route.parts[1]]; if (!b) return VIEWS.noencontrado();
    const vs = billVotes(b);
    const voters = [];
    const rel = uniq(b.relacionados || []).map((id) => PID[id]).filter(Boolean).slice(0, 8);
    const relNews = noticiasDeProyecto(b);
    const relEv = Object.keys(E).filter((k) => E[k].proyecto === b.boletin);
    const autores = (b.autores || []).filter(Boolean);
    return {
      title: 'Boletín ' + b.boletin + ' · Contraste',
      html: '<div class="page"><div class="wrap">' +
        '<button type="button" class="back" data-act="back">' + icon('back') + 'Volver</button>' +
        '<div class="page-head"><span class="record-stamp"><strong class="bill-num">Boletín N° ' + esc(b.boletin) + '</strong> ' + gl('Boletín') + '<span class="dot">Proyecto de ley</span></span>' +
        '<h1 class="h1" tabindex="-1" style="max-width:30ch">' + esc(b.nombreCorto || b.titulo) + '</h1>' +
        (b.nombreCorto ? '<p class="meta" style="max-width:80ch">Nombre oficial: ' + esc(b.titulo) + '</p>' : '') +
        (b.resumen ? '<p class="read" style="margin-top:6px">' + esc(b.resumen) + (b.fuenteResumen ? ' <a href="' + esc(b.fuenteResumen.url) + '" target="_blank" rel="noopener" class="meta">Fuente: ' + esc(b.fuenteResumen.titulo) + '</a>' : '') + '</p>' : '') +
        '<div class="record-actions">' + (vs.length ? '<a class="btn btn-primary" href="#votaciones" data-act="to-votes">Ver votaciones <span class="count">' + vs.length + '</span></a>' : '') + segBtn('bill', b.boletin) +
        '<a class="btn btn-line" href="' + senadoBillUrl(b.boletin) + '" target="_blank" rel="noopener">Tramitación oficial' + icon('ext', 16) + '</a>' +
        '<button type="button" class="btn btn-quiet" data-act="share" data-url="#/proyecto/' + b.boletin + '" data-title="Boletín ' + b.boletin + '">' + icon('share') + 'Compartir</button>' +
        '<button type="button" class="btn btn-quiet" data-act="ref" data-kind="bill" data-id="' + b.boletin + '">' + icon('copy') + 'Citar en APA</button>' + saveBtn('bill', b.boletin) + '</div></div>' +
        '<div class="p-grid"><dl class="facts">' +
        [['Fecha de ingreso', fFechaL(b.ingreso)], ['Cámara de origen', b.origen], ['Iniciativa', b.iniciativa + (b.iniciativa === 'Mensaje' ? ' (del Ejecutivo)' : b.iniciativa === 'Moción' ? ' (de parlamentarios)' : '')],
          [b.iniciativa === 'Mensaje' ? 'Patrocinio' : 'Autores', (b.iniciativa === 'Mensaje' ? (b.ministerios || []).join(', ') : autores.join(', ')) || 'No informado en la fuente'],
          ['Estado', b.estadoCorto || 'No informado'], ['Etapa', (b.etapa || 'No informada') + (b.leynro ? ' · Ley N° ' + b.leynro : '')], ['Último trámite', b.ultimoTramite && b.ultimoTramite.iso ? fFecha(b.ultimoTramite.iso) + ': ' + b.ultimoTramite.descripcion.replace(/\s+\.\s*$/, '') : 'No informado'], ['Urgencia', b.urgencia || 'Sin urgencia informada'], ['Tema', b.tema || '—']]
          .map(([k, v]) => '<div><dt>' + k + (k === 'Etapa' ? ' ' + gl('Trámite legislativo') : '') + '</dt><dd>' + esc(v) + '</dd></div>').join('') +
        '<div><dt>Fuente y fecha</dt><dd>Tramitación del Senado y datos abiertos de la Cámara. Última consulta: ' + fFechaL(LEG.consulta) + '</dd></div></dl>' +
        '<div>' + (rel.length ? '<h2 class="h2" style="font-size:1.0625rem;margin-bottom:8px">Autoridades de Contraste relacionadas</h2><div class="people" style="grid-template-columns:1fr">' + rel.map((p) => personRow(p, p.cargoCorto + ' · ' + p.partido)).join('') + '</div>' : '') +
        (relEv.length || relNews.length ? '<h2 class="h2" style="font-size:1.0625rem;margin:20px 0 8px">Cobertura</h2><div class="records">' +
          relEv.map((k) => '<a class="record" style="display:block;text-decoration:none;color:inherit" href="#/contrastar/' + k + '"><span class="record-stamp"><strong>Contrastar cobertura</strong><span class="dot">' + E[k].items.length + ' medios</span></span><span class="h3" style="display:block;font-size:1rem;margin-top:4px">' + esc(E[k].titulo) + '</span></a>').join('') +
          relNews.slice(0, 4).map((n) => '<a class="record" style="display:block;text-decoration:none;color:inherit" href="' + esc(n.url) + '" target="_blank" rel="noopener"><span class="record-stamp"><strong>' + esc(n.medio) + '</strong><span class="dot num">' + esc(n.fecha) + '</span></span><span class="h3" style="display:block;font-size:1rem;margin-top:4px">' + esc(n.titulo) + '</span></a>').join('') + '</div>' : '') +
        '</div></div>' +
        lineaDeTiempo(b, vs, relNews) +
        '<section class="section" id="votaciones" tabindex="-1"><div class="section-head"><h2 class="h2">Historial de votaciones <span class="count">' + vs.length + '</span></h2>' +
        '<span class="meta">Un proyecto puede tener muchas votaciones. Cada una tiene su propio resultado. ' + gl('Votación en general') + gl('Votación en particular') + '</span></div>' +
        (vs.length ? '<div class="toolbar" style="margin:0 0 12px"><div class="seg" role="group" aria-label="Cámara">' + ['Todas', 'Cámara', 'Senado'].map((c) => '<button type="button" aria-pressed="' + ((UI.billCam || 'Todas') === c) + '" data-act="bill-cam" data-v="' + c + '">' + c + '</button>').join('') + '</div>' +
          '<button type="button" class="btn btn-line" data-act="toggle-date" data-p="v" aria-expanded="' + UI.dateOpen + '" aria-controls="fold-fecha-v">' + icon('cal') + 'Filtrar por fecha de votación</button></div>' + datePanel({ fecha: UI.billFecha || '' }, 'v') + '<div id="bill-votes"></div>' : emptyBox('Sin votaciones en Sala', 'Al ' + fFechaL(LEG.consulta) + ' este proyecto no registra votaciones en la Sala de ninguna de las dos cámaras.')) +
        '</section></div></div>',
      mount: () => { if (vs.length) renderBillVotes(b); if (location.hash.endsWith('#votaciones') || route.params.ver === 'votaciones') setTimeout(() => $('#votaciones').scrollIntoView(), 50); }
    };
  };
  function renderBillVotes(b) {
    const cam = UI.billCam || 'Todas'; const r = dateRange(UI.billFecha);
    const all = billVotes(b).filter((v) => (cam === 'Todas' || camaraCorta(v) === cam) && inRange(v.fecha, r));
    const lim = UI.billLim || 12;
    const box = $('#bill-votes'); if (!box) return;
    box.innerHTML = (all.length ? '<p class="meta" style="margin-bottom:8px" aria-live="polite">' + plural(all.length, 'votación', 'votaciones') + (UI.billFecha ? ' · ' + esc(dateLabel(UI.billFecha)) : '') + ' · de la más reciente a la más antigua</p><div class="records">' + all.slice(0, lim).map((v) => voteRow(v)).join('') + '</div>' +
      (all.length > lim ? '<div class="more-row"><button type="button" class="btn btn-line" data-act="bill-more">Ver más <span class="count">(' + (all.length - lim) + ')</span></button></div>' : '')
      : emptyBox('Sin votaciones con ese filtro', 'Cambia la cámara o el período.'));
  }

  /* ---------- Votación ---------- */
  const PROF_BY_KEY = {}; P.forEach((p) => { const k = voteKeyFor(p); if (k) PROF_BY_KEY[k] = p; });
  function voterInfo(v, x) {
    const prof = PROF_BY_KEY[x.id];
    const nombre = x.id.charAt(0) === 'D' ? ((LEG.diputados[x.id] || {}).nombre || x.id) : ((LEG.senadores[x.id] || {}).nombre || x.id.slice(2));
    return { nombre, partido: canonParty(x.p) || 'Sin dato', partidoNota: x.pn || '', prof, o: x.o };
  }
  VIEWS.votacion = (route) => {
    const v = VOT[route.parts[1]]; if (!v) return VIEWS.noencontrado();
    const b = BID[v.boletin];
    const t = v.totales;
    const people = (v.votos || []).map((x) => voterInfo(v, x));
    const cnt = (o) => people.filter((x) => x.o === o).length;
    const mismatch = (cnt('A') !== t.si || cnt('C') !== t.no || cnt('B') !== t.abst);
    const extra = v.camara === 'Senado' ? [['P', 'Pareos', t.pareo || 0]] : [['D', 'Dispensados', t.disp || 0]];
    const noVota = cnt('N');
    const ord = { A: 0, C: 1, B: 2, P: 3, D: 3, N: 4 };
    const board = people.slice().sort((a, c) => ord[a.o] - ord[c.o] || a.nombre.localeCompare(c.nombre, 'es'));
    return {
      title: 'Votación ' + fFecha(v.fecha) + ' · Boletín ' + v.boletin + ' · Contraste',
      html: '<div class="page"><div class="wrap">' +
        '<button type="button" class="back" data-act="back">' + icon('back') + 'Volver</button>' +
        '<div class="page-head"><span class="record-stamp"><a class="bill-num" href="#/proyecto/' + v.boletin + '">Boletín N° ' + esc(v.boletin) + '</a><span class="dot">' + esc(v.camara) + '</span><span class="dot num">' + fFechaL(v.fecha) + (v.hora ? ', ' + v.hora : '') + '</span></span>' +
        '<h1 class="h1" tabindex="-1" style="max-width:32ch">' + esc(b ? (b.nombreCorto || b.titulo) : 'Votación') + '</h1>' +
        '<dl class="facts" style="margin-top:8px">' +
        [['Materia votada', v.materia || 'No informada en la fuente'], ['Etapa', [v.tramite, v.informe].filter(Boolean).join(' · ')], ['Tipo de votación', v.tipo], ['Sesión', sesionTxt(v) || v.sesion || 'No informada'], ['Quórum', v.quorum], ['Resultado', resultado(v) || 'El dato abierto no informa el resultado; revísalo en el registro oficial']]
          .filter(([, x]) => x).map(([k, x]) => '<div><dt>' + k + (k === 'Tipo de votación' ? ' ' + gl(/general/i.test(v.tipo) ? 'Votación en general' : /particular/i.test(v.tipo) ? 'Votación en particular' : 'Votación única', 'Votación ' + String(v.tipo).toLowerCase()) : k === 'Etapa' ? ' ' + gl('Trámite legislativo') : k === 'Quórum' ? ' ' + gl('Quórum') : '') + '</dt><dd>' + esc(x) + (k === 'Resultado' && v.resultadoNota ? '<span class="meta" style="display:block;font-weight:400">' + esc(v.resultadoNota) + '</span>' : '') + '</dd></div>').join('') + '</dl>' +
        '<div class="record-actions"><a class="btn btn-line" href="' + esc(v.url) + '" target="_blank" rel="noopener">Registro oficial' + icon('ext', 16) + '</a>' +
        (v.fuenteDatos ? '<a class="ext" href="' + esc(v.fuenteDatos) + '" target="_blank" rel="noopener">Votaciones del Senado' + icon('ext', 16) + '</a>' : '<a class="ext" href="https://opendata.camara.cl/camaradiputados/WServices/WSLegislativo.asmx/retornarVotacionDetalle?prmVotacionID=' + esc(v.id.slice(1)) + '" target="_blank" rel="noopener">Datos abiertos de la Cámara' + icon('ext', 16) + '</a>') +
        '<button type="button" class="btn btn-quiet" data-act="csv-voto" data-id="' + v.id + '">' + icon('down2') + 'Descargar CSV</button><button type="button" class="btn btn-quiet" data-act="share" data-url="#/votacion/' + v.id + '" data-title="Votación Boletín ' + v.boletin + '">' + icon('share') + 'Compartir</button>' +
        '<button type="button" class="btn btn-quiet" data-act="ref" data-kind="vote" data-id="' + v.id + '">' + icon('copy') + 'Citar en APA</button>' + saveBtn('vote', v.id) + '</div>' +
        (v.camara === 'Senado' ? '<p class="meta" style="max-width:80ch">El registro oficial abre la tramitación del boletín, donde figura esta votación (' + esc(v.sesion) + ', ' + fFecha(v.fecha) + ').</p>' : '') +
        '</div>' +
        '<h2 class="sr-only">Resultado</h2><div class="totals">' +
        [['si', 'A favor', t.si, 'A favor'], ['no', 'En contra', t.no, 'En contra'], ['ab', 'Abstenciones', t.abst, 'Abstención']].concat(extra.map(([o, l, n]) => ['ot', l, n, o === 'P' ? 'Pareo' : 'Dispensado'])).concat(noVota ? [['ot', 'No votan', noVota, 'No vota']] : [])
          .map(([c, l, n, g]) => '<div class="total ' + c + '"><div class="n">' + n + '</div><div class="l">' + l + ' ' + gl(g, l) + '</div></div>').join('') + '</div>' +
        '<div class="hemi-box hemi-grande">' + hemiciclo(v) + '<div class="ley"><span><i class="A"></i>A favor</span><span><i class="C"></i>En contra</span><span><i class="B"></i>Abstención</span><span><i class="O"></i>' + (v.camara === 'Senado' ? 'Pareo' : 'Dispensado') + '</span>' + (noVota ? '<span><i class="N"></i>No vota</span>' : '') + '<span>· ' + plural(people.length, 'parlamentario', 'parlamentarios') + ' en el registro oficial</span></div></div>' +
        (mismatch ? '<p class="callout" style="margin-top:12px">' + icon('info') + 'Los totales oficiales no coinciden exactamente con el detalle individual publicado. Mostramos ambos tal como los publica la fuente.</p>' : '') +
        (v.nota ? '<p class="callout" style="margin-top:12px">' + icon('info') + esc(v.nota) + '</p>' : '') +
        bloqueDisidentes(v, people) + '<section class="section"><div class="section-head"><h2 class="h2">Cómo votó cada parlamentario</h2><div class="seg" role="group" aria-label="Vista"><button type="button" aria-pressed="' + (UI.vview !== 'partido') + '" data-act="vview" data-v="voto">Por voto</button><button type="button" aria-pressed="' + (UI.vview === 'partido') + '" data-act="vview" data-v="partido">Por partido</button></div></div>' +
        '<form class="search search-md" role="search" data-search="voter" style="max-width:560px;margin-bottom:12px"><label class="sr-only" for="q-voter">Buscar parlamentario</label><div class="search-field" style="border-width:1px"><span class="ico">' + icon('search') + '</span><input id="q-voter" type="search" placeholder="Buscar parlamentario..." value="' + esc(UI.voterQ || '') + '" spellcheck="false"><button type="button" class="search-clear" data-act="clear-voter" aria-label="Borrar"' + (UI.voterQ ? '' : ' hidden') + '>' + icon('x') + '</button></div></form>' +
        '<p class="meta" style="margin-bottom:12px;max-width:80ch">' + (v.camara === 'Senado' ? (v.fecha >= '2026-03-11' ? 'Partido según la nómina vigente del Senado, consultada el ' + fFechaL(LEG.consulta) + '. El Senado no publica la militancia a la fecha de cada votación.' : 'El Senado no publica la militancia a la fecha de esta votación, por eso no la asignamos.') : 'Partido registrado por la Cámara a la fecha de la votación.') + ' El resultado del Senado no viene en este registro: revísalo en la tramitación oficial.</p>'.replace(v.camara === 'Senado' ? '@@' : ' El resultado del Senado no viene en este registro: revísalo en la tramitación oficial.', '') +
        '<div id="voters"></div></section>' +
        '</div></div>',
      mount: () => { UI.curVote = { v, people }; renderVoters(); }
    };
  };
  function renderVoters() {
    const { v, people } = UI.curVote; const q = norm(UI.voterQ || '');
    const list = people.filter((x) => !q || norm(x.nombre + ' ' + x.partido).includes(q));
    const box = $('#voters'); if (!box) return;
    if (!list.length) { box.innerHTML = emptyBox('Nadie con ese nombre en esta votación', 'Revisa la ortografía o busca por apellido.'); return; }
    if (UI.vview === 'partido') {
      const by = {};
      list.forEach((x) => { const k = x.partido || 'Sin dato'; (by[k] = by[k] || { A: 0, C: 0, B: 0, O: 0, n: 0 }); const o = x.o === 'A' || x.o === 'C' || x.o === 'B' ? x.o : 'O'; by[k][o]++; by[k].n++; });
      const rows = Object.keys(by).sort((a, c) => by[c].n - by[a].n || a.localeCompare(c, 'es'));
      box.innerHTML = '<div class="table-scroll"><table class="party-table"><caption class="sr-only">Votos por partido</caption><thead><tr><th scope="col">Partido</th><th scope="col">A favor</th><th scope="col">En contra</th><th scope="col">Abstención</th><th scope="col">Otros</th><th scope="col">Total</th><th scope="col" class="bar"><span class="sr-only">Distribución</span></th></tr></thead><tbody>' +
        rows.map((k) => { const r = by[k]; const pc = (x) => (100 * x / r.n).toFixed(1) + '%'; return '<tr><th scope="row">' + esc(k) + '</th><td>' + r.A + '</td><td>' + r.C + '</td><td>' + r.B + '</td><td>' + r.O + '</td><td><strong>' + r.n + '</strong></td><td class="bar"><div class="pbar" aria-hidden="true"><span class="A" style="width:' + pc(r.A) + '"></span><span class="C" style="width:' + pc(r.C) + '"></span><span class="B" style="width:' + pc(r.B) + '"></span><span class="O" style="width:' + pc(r.O) + '"></span></div></td></tr>'; }).join('') +
        '</tbody></table></div><p class="meta" style="margin-top:8px">«Otros» suma ' + (v.camara === 'Senado' ? 'pareos' : 'dispensados y quienes no votaron') + '. La tabla describe el registro; no asigna puntajes ni interpreta posiciones.</p>';
      return;
    }
    const groups = [['A', 'A favor'], ['C', 'En contra'], ['B', 'Abstención'], ['P', 'Pareo'], ['D', 'Dispensados'], ['N', 'No votan']];
    box.innerHTML = '<div class="voters">' + groups.map(([o, l]) => {
      const g = list.filter((x) => x.o === o).sort((a, c) => (c.prof ? 1 : 0) - (a.prof ? 1 : 0) || a.nombre.localeCompare(c.nombre, 'es'));
      if (!g.length) return '';
      return '<div class="voter-group"><h3><span class="badge ' + OPC_CLS[o] + '">' + l + '</span><span class="num">' + g.length + '</span></h3><ul class="voter-list">' +
        g.map((x) => '<li class="voter">' + (x.prof ? photoTag(x.prof, 40) : '<span class="ph" style="width:40px;height:40px" aria-hidden="true">' + esc(initials(x.nombre)) + '</span>') +
          '<span class="v-txt">' + (x.prof ? '<a class="v-name" href="#/autoridad/' + x.prof.id + '">' + esc(x.nombre) + '</a><span class="v-pro">Perfil en Contraste</span>' : '<span class="v-name">' + esc(x.nombre) + '</span>') +
          '<span class="v-party">' + esc(x.partido) + (x.partidoNota === 'vigente' ? ' (vigente)' : '') + '</span></span></li>').join('') + '</ul></div>';
    }).join('') + '</div>';
  }

  /* ---------- Metodología ---------- */
  const FUENTE_NOM = { camara_diputados: 'Diputados', camara_distritos: 'Distritos de diputados', senado_nomina: 'Senadores', comunas: 'Comunas', camara_votaciones: 'Votaciones de la Cámara', senado_votaciones: 'Votaciones del Senado', senado_tramitacion: 'Tramitación de proyectos', google_noticias: 'Google Noticias', noticias_total: 'Noticias automáticas' };
  VIEWS.metodologia = () => {
    const nVot = Object.keys(VOT).length;
    const fotos = P.filter((p) => p.foto && !p.basica);
    return {
      title: 'Fuentes y metodología · Contraste',
      html: '<div class="page"><div class="wrap wrap-narrow">' +
        '<div class="page-head"><h1 class="h1" tabindex="-1">Fuentes y metodología</h1><span class="meta">Perfiles y noticias originales verificados al ' + fFechaL(D.corteOriginal || D.corte) + '; autoridades incorporadas y correcciones, al ' + fFechaL(D.corte) + '. Registros legislativos consultados el ' + fFechaL(LEG.consulta || CORTE) + '.</span></div>' +
        '<div class="prose">' +
        '<h2>Qué reúne Contraste</h2><p>' + P.length + ' autoridades chilenas en ejercicio (' + TIPOS.map((t) => { const n = P.filter((p) => p.tipo === t).length; return n ? n + ' ' + t.toLowerCase() : ''; }).filter(Boolean).join(', ') + '), ' + NEWS.length + ' noticias enlazadas a su medio original, ' + Object.keys(E).length + ' coberturas comparadas, ' + BILLS.length + ' proyectos de ley y ' + nVot + ' votaciones de Sala con su registro individual completo.</p>' +
        '<p>Es un prototipo académico con información real. Parte de los datos se actualiza sola y otra parte la revisamos a mano, y siempre se indica cuál es cuál.</p>' +
        '<h2 id="actualizacion">Cómo se mantiene al día</h2><p>Un proceso automático consulta las fuentes una vez al día. Si una fuente falla, se conserva su última versión buena.</p>' +
        (EST.hoy ? '<p><strong>Última actualización: ' + fFechaL(EST.hoy) + '.</strong></p><ul class="credits">' + Object.keys(EST.fuentes || {}).filter((k) => !/^rss_/.test(k)).map((k) => { const s = EST.fuentes[k]; return '<li>' + esc(FUENTE_NOM[k] || k) + ': ' + (s.ok ? 'al día' : 'sin respuesta en la última consulta; se muestra la versión anterior') + (s.n != null && s.ok ? ' (' + s.n + ')' : '') + '</li>'; }).join('') + '</ul>' : '') +
        '<ul><li><strong>Automático y oficial:</strong> votaciones, proyectos, tramitación, diputados, senadores y partidos.</li><li><strong>Automático sin revisión editorial:</strong> titulares de prensa detectados por nombre de la autoridad. Van marcados y siempre enlazan al original.</li><li><strong>Revisado a mano:</strong> perfiles completos, noticias con fecha de verificación, coberturas comparadas, gabinete y gobernaciones.</li><li><strong>Comunas por distrito:</strong> distritos vigentes de la Ley 20.840.</li></ul>' +
        '<h2>Cómo citar</h2><p>Los botones «Citar en APA» entregan la referencia en formato APA 7 con su enlace. En Mi carpeta puedes copiar la bibliografía completa o descargarla en Word. Revisa siempre la cita final contra la fuente original y agrega cursivas donde corresponda.</p>' +
        '<h2>Fuentes</h2><ul><li>Datos abiertos de la Cámara (opendata.camara.cl): proyectos, votaciones, voto de cada diputada y diputado, y su militancia con fechas. Listado oficial de diputados de camara.cl: distrito y región.</li><li>Senado (senado.cl y tramitacion.senado.cl): votaciones de Sala, nómina vigente y tramitación de cada boletín.</li><li>Biblioteca del Congreso Nacional, municipalidades, gobiernos regionales, ministerios, Servel, InfoLobby e InfoProbidad.</li><li>Medios de comunicación identificables, siempre con enlace a la publicación original.</li></ul>' +
        '<h2>Cómo se recopila y se verifica</h2><p>Los cargos y partidos se confirmaron con fuentes oficiales o con al menos dos medios. Cada noticia enlaza al artículo original y lleva la fecha en que la verificamos. Cuando el titular original es largo lo resumimos y lo marcamos como «Titular resumido».</p><p>Las votaciones se descargaron de los registros oficiales y se comprobó que los votos individuales sumen los totales publicados. Si no coinciden, la votación lo advierte.</p>' +
        '<h2>Señales de fuentes</h2><p>Junto a cada noticia indicamos si la detectamos en un solo medio o en varios con un titular similar. Es una ayuda para decidir qué confirmar, no una calificación de los medios.</p><h2>Votar distinto a su partido</h2><p>Comparamos el voto de cada parlamentario con la mayoría de su partido en esa misma votación. No se calcula para independientes ni cuando el partido tiene menos de tres votos o hay empate. Es una descripción del registro, no una evaluación.</p><h2>Fechas</h2><p>Distinguimos la fecha del registro (cuándo se publicó la noticia, cuándo ingresó el proyecto, cuándo fue la votación) de la fecha de verificación en Contraste. El filtro por fecha siempre usa la fecha del registro. ' + gl('Fecha de verificación') + '</p>' +
        '<h2>Partidos políticos</h2><p>En los perfiles mostramos el partido o la condición actual verificada. En la Cámara usamos la militancia registrada a la fecha de cada votación. El Senado no publica la militancia histórica: desde marzo de 2026 mostramos el partido de su nómina vigente y lo indicamos; para votaciones anteriores no asignamos partido.</p>' +
        '<h2>Proyectos de ley y votaciones</h2><p>Cada votación muestra los totales oficiales y el voto de todas las personas que figuran en el registro. La sesión de cada votación de la Cámara se asignó cruzando su fecha y hora con el registro oficial de sesiones de Sala.</p>' +
        '<p>Encontramos una inconsistencia en los datos abiertos de la Cámara: el servicio que entrega las votaciones por proyecto rotula como «Unánime» votaciones que el registro anual rotula «Rechazado» (por ejemplo, 64 votos a favor y 75 en contra). En esos casos mostramos el resultado del registro anual. El Senado no informa el resultado en su registro de votaciones: indicamos si hubo más votos a favor o en contra, sin afirmar si se aprobó, porque eso depende del quórum exigido.</p>' +
        '<p>Si en una votación el detalle individual no suma lo mismo que el total oficial, la votación lo advierte.</p>' +
        '<h2>Correcciones a la versión anterior</h2><ul><li>El enlace oficial de Tomás Vodanovic apuntaba a una página inexistente de la Asociación Chilena de Municipalidades; ahora enlaza a la página del alcalde en la Municipalidad de Maipú.</li><li>El sitio del Gobierno Regional de Valparaíso no respondía al 15 de octubre de 2026; agregamos la ficha oficial de Rodrigo Mundaca en la Subdere y mantuvimos el sitio regional como referencia.</li><li>Dos votos de Enrique Bassaletti estaban mal descritos (un boletín con otro nombre y un voto que el registro oficial consigna a favor). Los reemplazamos por el registro oficial de la Cámara.</li><li>Los votos de senadores sobre las RUF y la votación en general de la Reconstrucción Nacional que antes venían de la prensa coinciden con el registro oficial y ahora se muestran desde ese registro.</li><li>Las fotografías de Paulina Vodanovic y Matías Walker se reemplazaron por los retratos oficiales de la Biblioteca del Congreso, con licencia verificable.</li></ul>' +
        '<h2>Cómo funciona el contraste de cobertura</h2><p>Agrupamos publicaciones de distintos medios sobre un mismo hecho. Describimos las coincidencias, en qué pone el foco cada medio y qué antecedentes aparecen solo en algunas. No calificamos a los medios ni decidimos quién tiene la razón.</p>' +
        '<h2>Datos con versiones distintas</h2><p>Si dos fuentes no coinciden, lo mostramos junto a la fuente que lo aclara. Si no hay una, el dato queda como «Sin resolver».</p>' +
        '<h2>Limitaciones</h2><ul><li>Incluye todos los proyectos votados en Sala desde el 11 de marzo de 2026, pero no todas las noticias: las automáticas dependen de lo que publican los medios conectados.</li><li>Las fichas básicas de parlamentarios y gabinete tienen menos información que los perfiles revisados a mano.</li><li>El gabinete se revisa a mano: si hay un cambio reciente, puede tardar en reflejarse.</li><li>Los portales marcados «Ver en portal» (Servel, InfoLobby, InfoProbidad) se enlazan, pero su contenido no fue revisado para cada autoridad.</li><li>Las votaciones son de Sala; no incluyen las votaciones en comisiones.</li><li>Solo usamos fotografías con licencia libre. Cuando no encontramos una, mostramos las iniciales.</li><li>' + (P.some((p) => p.pendiente) ? 'Algunos datos están marcados como pendientes de verificación.' : 'Los datos marcados como «Sin resolver» o «pendiente» no deben usarse sin revisar la fuente.') + '</li></ul>' +
        '<h2>Fotografías</h2><p>Las fotografías de las autoridades provienen de fuentes con licencia que permite reutilizarlas citando al autor. Las recortamos en cuadrado, redujimos su tamaño y las mostramos en blanco y negro para dar unidad visual.</p>' +
        '<ul class="credits">' + fotos.map((p) => '<li>' + esc(p.nombre) + ': ' + esc(p.fotoCred) + (p.fotoFuente ? ', vía ' + (p.fotoUrl ? '<a href="' + esc(p.fotoUrl) + '" target="_blank" rel="noopener">' + esc(p.fotoFuente) + '</a>' : esc(p.fotoFuente)) : '') + '</li>').join('') + '</ul>' +
        '<h2>Qué significan las etiquetas</h2></div>' +
        '<div class="labels">' + ['Revisado', 'Ver en portal', 'Aclarado', 'Sin resolver', 'A favor', 'En contra', 'Abstención', 'Pareo', 'Dispensado', 'No vota', 'Decisión', 'Hecho'].map((k) => {
          const cls = /Revisado|Aclarado|A favor/.test(k) ? 'b-ok' : k === 'Sin resolver' ? 'b-warn' : k === 'En contra' ? 'b-no' : k === 'Abstención' ? 'b-abs' : /Decisión|Hecho/.test(k) ? 'b-info' : 'b-otro';
          return '<div><span><span class="badge ' + cls + '">' + k + '</span></span><span>' + esc(GLOS[k]) + '</span></div>';
        }).join('') + '</div>' +
        '<div class="prose"><h2>Conceptos legislativos</h2></div><div class="labels">' + ['Boletín', 'Trámite legislativo', 'Votación en general', 'Votación en particular', 'Votación única', 'Quórum'].map((k) => '<div><strong>' + k + '</strong><span>' + esc(GLOS[k]) + '</span></div>').join('') + '</div>' +
        '</div></div>'
    };
  };

  /* El texto de ejemplo del buscador se acorta para no quedar cortado en pantallas angostas */
  function ajustarPlaceholder() {
    const i = $('#q-home'); if (!i) return;
    const c = document.createElement('canvas').getContext('2d'); c.font = getComputedStyle(i).font;
    const w = i.clientWidth - 30;
    i.placeholder = ['Buscar autoridad, noticia, tema o proyecto de ley...', 'Busca un nombre, tema o proyecto', 'Nombre, tema o proyecto', 'Nombre o tema', 'Buscar'].find((x) => c.measureText(x).width <= w) || 'Buscar';
  }
  addEventListener('resize', ajustarPlaceholder);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarPlaceholder);

  /* ---------- Piezas nuevas: formato ---------- */
  const recorta = (t, n) => { t = String(t || ''); return t.length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, '') + '…' : t; };
  const fFechaCorta = (iso) => { if (!iso) return ''; const [, m, d] = iso.split('-').map(Number); return d + ' ' + MES[m - 1]; };
  const resultadoCorto = (v) => { const r = resultado(v); return r.length > 22 ? r.split(' ').slice(0, 3).join(' ') : r; };
  const descargar = (nombre, tipo, texto) => { const u = URL.createObjectURL(new Blob(['﻿' + texto], { type: tipo })); const a = document.createElement('a'); a.href = u; a.download = nombre; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(u), 2000); };
  const celdaCSV = (x) => '"' + String(x == null ? '' : x).replace(/"/g, '""') + '"';
  GLOS['Fuentes'] = 'Cuántas fuentes respaldan esto en Contraste. Un solo medio no significa que sea falso, pero conviene confirmarlo con otra fuente. Es una señal para verificar, no una calificación del medio.';
  GLOS['Distinto a su partido'] = 'Votó diferente a lo que votó la mayoría de su partido en esa votación. Es un dato del registro oficial que ayuda a detectar temas para investigar; no es una evaluación.';

  /* ---------- Hemiciclo: un punto por parlamentario ---------- */
  function hemiciclo(v) {
    const ord = { A: 0, C: 1, B: 2, P: 3, D: 3, N: 4 };
    const ids = LEG.roster(v);
    const gente = ids.map((id, i) => ({ id, o: v.o.charAt(i) })).sort((a, b) => (ord[a.o] - ord[b.o]) || 0);
    const n = gente.length; const filas = n > 100 ? 5 : n > 40 ? 3 : 2;
    const W = 360; const H = 192; const cx = W / 2; const cy = H - 12; const rMin = n > 100 ? 72 : 96; const rMax = 166;
    const radios = []; for (let i = 0; i < filas; i++) radios.push(filas === 1 ? rMax : rMin + (rMax - rMin) * i / (filas - 1));
    const tot = radios.reduce((a, b) => a + b, 0); let quedan = n; const pos = [];
    radios.forEach((r, i) => { const k = i === filas - 1 ? quedan : Math.round(n * r / tot); quedan -= k; for (let j = 0; j < k; j++) { const a = Math.PI - Math.PI * (j + 0.5) / k; pos.push({ a, x: cx + r * Math.cos(a), y: cy - r * Math.sin(a) }); } });
    pos.sort((p, q) => q.a - p.a);
    const radio = n > 100 ? 5.4 : n > 40 ? 7.4 : 9;
    const nombre = (id) => (id.charAt(0) === 'D' ? (LEG.diputados[id] || {}).nombre : (LEG.senadores[id] || {}).nombre) || id;
    return '<svg class="hemi" viewBox="0 0 ' + W + ' ' + H + '" role="img" aria-label="' + v.totales.si + ' a favor, ' + v.totales.no + ' en contra, ' + v.totales.abst + ' abstenciones">' +
      gente.map((g, i) => '<circle class="' + g.o + '" cx="' + pos[i].x.toFixed(1) + '" cy="' + pos[i].y.toFixed(1) + '" r="' + radio + '" style="transition-delay:' + (i * 8) + 'ms"><title>' + esc(nombre(g.id)) + ' · ' + OPC[g.o] + '</title></circle>').join('') + '</svg>';
  }
  const leyendaCorta = (v) => { const t = v.totales; const nv = (v.o.match(/N/g) || []).length; return '<div class="ley2"><span><b class="A">' + t.si + '</b>a favor</span><span><b class="C">' + t.no + '</b>en contra</span><span><b class="B">' + t.abst + '</b>abst.</span>' + (nv ? '<span><b>' + nv + '</b>no votan</span>' : '') + '</div>'; };

  /* ---------- Muro de fotos: se reordena como rompecabezas ---------- */
  function montarMuro() {
    const muro = $('#muro'); if (!muro) return;
    const conFoto = P.filter((p) => p.foto);
    const base = ['walker', 'provoste', 'kast', 'hassler', 'arrau', 'jiles', 'macaya', 'desbordes', 'fries', 'orrego', 'quiroz', 'kaiser', 'alvarado', 'schalper'].map((i) => PID[i]).filter((p) => p && p.foto);
    const azar = conFoto.filter((p) => !base.includes(p)).sort(() => Math.random() - 0.5);
    const elegidos = base.concat(azar).slice(0, 11);
    const estrecho = () => innerWidth <= 1020; const cols = () => estrecho() ? 4 : 3; const filas = () => 3 + (estrecho() ? 0 : 1);
    const celdas = elegidos.map((p, i) => { const a = document.createElement('a'); a.className = 'ce'; a.href = '#/autoridad/' + p.id; a.innerHTML = '<img src="' + esc(p.foto) + '" alt="' + esc(p.nombre) + '" loading="eager" decoding="async"><em>' + esc(p.nombre) + '</em>'; muro.appendChild(a); return { el: a, pos: i < 4 ? i : i + 1 }; });
    const dato = document.createElement('a'); dato.className = 'ce dato'; dato.href = '#/autoridades'; dato.innerHTML = '<span class="tx"></span>'; muro.appendChild(dato); const D0 = { el: dato, pos: 4 };
    const nVot = Object.keys(VOT).length;
    const hechos = [[P.filter(esParl).length, 'parlamentarios'], [nVot, 'votaciones oficiales'], [BILLS.length, 'proyectos de ley'], [EST.hoy ? fFechaCorta(EST.hoy) : fFechaCorta(CORTE), 'última actualización']];
    let fi = 0; let ultimo = -1;
    const pinta = () => { $('.tx', dato).innerHTML = '<b>' + hechos[fi][0] + '</b>' + hechos[fi][1]; };
    pinta();
    const ubica = (c) => { const n = cols(); c.el.style.transform = 'translate(' + (c.pos % n) * 100 + '%,' + Math.floor(c.pos / n) * 100 + '%)'; };
    const todo = () => { celdas.forEach(ubica); ubica(D0); }; todo();
    if (UI.muroR) removeEventListener('resize', UI.muroR); UI.muroR = todo; addEventListener('resize', todo);
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    UI.muroT = setInterval(() => {
      if (document.hidden || muro.matches(':hover') || !muro.isConnected) return;
      const n = cols(); const t = n * filas(); const p = D0.pos; const op = [];
      if (p % n > 0) op.push(p - 1); if (p % n < n - 1) op.push(p + 1); if (p >= n) op.push(p - n); if (p + n < t) op.push(p + n);
      const c = op.filter((o) => o !== ultimo && celdas.some((x) => x.pos === o)); if (!c.length) return;
      const to = c[Math.floor(Math.random() * c.length)]; const otra = celdas.find((x) => x.pos === to); ultimo = p; otra.pos = p; D0.pos = to; ubica(otra); ubica(D0);
      fi = (fi + 1) % hechos.length; const tx = $('.tx', dato); tx.style.opacity = 0; setTimeout(() => { pinta(); tx.style.opacity = 1; }, 340);
    }, 2600);
  }

  /* ---------- Entradas al bajar por la página ---------- */
  let observador;
  function observarEntradas() {
    if (!('IntersectionObserver' in window)) { $$('.reveal, .hemi-box').forEach((x) => x.classList.add('vis')); return; }
    if (observador) observador.disconnect();
    observador = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('vis'); observador.unobserve(e.target); } }), { threshold: 0.15 });
    $$('.reveal, .hemi-box').forEach((x) => observador.observe(x));
  }

  /* ---------- Carpeta y seguimiento (se guardan en este navegador) ---------- */
  const leerLS = (k, d) => { try { return JSON.parse(localStorage.getItem(k)) || d; } catch (e) { return d; } };
  const escribirLS = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* navegación privada */ } };
  const KIND_C = { p: 'person', n: 'news', b: 'bill', v: 'vote', e: 'event' };
  let memoCarpeta = null;
  const carpeta = () => (memoCarpeta || (memoCarpeta = leerLS('contraste_carpeta', [])));
  function guardarCarpeta(x) { memoCarpeta = x; escribirLS('contraste_carpeta', x); $$('[data-carpeta-n]').forEach((b) => { b.textContent = x.length || ''; }); }
  const enCarpeta = (k, id) => carpeta().some((x) => x.k === k && x.id === id);
  function alternarCarpeta(k, id) { const c = carpeta(); const on = !enCarpeta(k, id); guardarCarpeta(on ? c.concat([{ k, id, t: Date.now() }]) : c.filter((x) => !(x.k === k && x.id === id))); return on; }
  function pintarGuardar(b, on) { b.setAttribute('aria-pressed', on); $('.g-t', b).textContent = on ? 'Guardado' : 'Guardar'; }
  function saveBtn(k, id) { const on = enCarpeta(k, id); return '<button type="button" class="btn btn-quiet btn-sm btn-guardar" data-act="guardar" data-kind="' + k + '" data-id="' + esc(id) + '" aria-pressed="' + on + '">' + icon('save', 16) + '<span class="g-t">' + (on ? 'Guardado' : 'Guardar') + '</span></button>'; }
  function itemInfo(k, id) {
    if (k === 'person') { const p = PID[id]; return p && { tipo: 'Autoridad', titulo: p.nombre, sub: p.cargoCorto + ' · ' + p.partido, href: '#/autoridad/' + p.id }; }
    if (k === 'news') { const n = NEWSK[id]; return n && { tipo: 'Noticia', titulo: n.titulo, sub: n.medio + ' · ' + n.fecha, href: n.url, ext: true, key: n.key }; }
    if (k === 'bill') { const b = BID[id]; return b && { tipo: 'Proyecto de ley', titulo: b.nombreCorto || b.titulo, sub: 'Boletín ' + b.boletin + ' · ' + (b.estadoCorto || ''), href: '#/proyecto/' + b.boletin }; }
    if (k === 'vote') { const v = VOT[id]; if (!v) return null; const b = BID[v.boletin]; return { tipo: 'Votación', titulo: b ? (b.nombreCorto || b.titulo) : 'Boletín ' + v.boletin, sub: camaraCorta(v) + ' · ' + fFecha(v.fecha) + ' · ' + v.totales.si + ' a favor, ' + v.totales.no + ' en contra', href: '#/votacion/' + v.id }; }
    if (k === 'event') { const e = E[id]; return e && { tipo: 'Cobertura comparada', titulo: e.titulo, sub: e.fecha + ' · ' + e.items.length + ' medios', href: '#/contrastar/' + id }; }
    return null;
  }
  function descargarDoc() {
    const citas = carpeta().map((x) => citaAPA(x.k, x.id)).filter(Boolean).sort((a, b) => a.localeCompare(b, 'es'));
    descargar('bibliografia-contraste.doc', 'application/msword', '<html><head><meta charset="utf-8"></head><body style="font-family:Times New Roman,serif;font-size:12pt"><h1 style="font-size:14pt">Referencias</h1>' + citas.map((c) => '<p style="margin-left:36pt;text-indent:-36pt;line-height:2">' + esc(c) + '</p>').join('') + '</body></html>');
  }
  function descargarCSVCarpeta() {
    const filas = [['Tipo', 'Título', 'Detalle', 'Cita APA']].concat(carpeta().map((x) => { const i = itemInfo(x.k, x.id) || {}; return [i.tipo, i.titulo, i.sub, citaAPA(x.k, x.id)]; }));
    descargar('carpeta-contraste.csv', 'text/csv;charset=utf-8', filas.map((f) => f.map(celdaCSV).join(',')).join('\r\n'));
  }
  function descargarCSVVoto(id) {
    const v = VOT[id]; if (!v) return;
    const filas = [['Parlamentario', 'Partido', 'Voto']].concat(v.votos.map((x) => { const i = voterInfo(v, x); return [i.nombre, i.partido, OPC[x.o]]; }));
    descargar('votacion-' + id + '-boletin-' + v.boletin + '.csv', 'text/csv;charset=utf-8', filas.map((f) => f.map(celdaCSV).join(',')).join('\r\n'));
  }
  VIEWS.carpeta = (route) => {
    const compartida = route.params.c;
    const items = compartida ? compartida.split(',').map((s) => { const [c, ...i] = s.split(':'); return { k: KIND_C[c], id: i.join(':') }; }).filter((x) => x.k) : carpeta().slice().reverse();
    const validos = items.map((x) => Object.assign({ info: itemInfo(x.k, x.id) }, x)).filter((x) => x.info);
    const grupos = ['Autoridad', 'Proyecto de ley', 'Votación', 'Noticia', 'Cobertura comparada'];
    return {
      title: 'Mi carpeta · Contraste',
      html: '<div class="page"><div class="wrap"><div class="page-head"><h1 class="h1" tabindex="-1">' + (compartida ? 'Carpeta compartida' : 'Mi carpeta') + '</h1><p class="lede">' + (compartida ? 'Alguien de tu grupo te compartió estas fuentes.' : 'Reúne lo que encuentres y sácalo listo para tu trabajo. Se guarda en este navegador.') + '</p></div>' +
        (validos.length ? '<div class="toolbar">' + (compartida ? '<button type="button" class="btn btn-primary" data-act="carpeta-importar">Agregar a mi carpeta</button>' :
          '<button type="button" class="btn btn-primary" data-act="carpeta-apa">' + icon('copy') + 'Copiar bibliografía APA</button><button type="button" class="btn btn-line" data-act="carpeta-doc">' + icon('down2') + 'Descargar Word</button><button type="button" class="btn btn-line" data-act="carpeta-csv">' + icon('down2') + 'Descargar CSV</button><button type="button" class="btn btn-line" data-act="carpeta-link">' + icon('share') + 'Compartir con mi grupo</button><span class="spacer"></span><button type="button" class="btn btn-quiet" data-act="carpeta-vaciar">Vaciar</button>') + '</div>' +
          grupos.map((g) => { const l = validos.filter((x) => x.info.tipo === g); if (!l.length) return ''; return '<section class="section"><h2 class="h2">' + g + ' <span class="count">' + l.length + '</span></h2><div class="records" style="margin-top:10px">' + l.map((x) => '<article class="record"><h3 class="h3"><a href="' + esc(x.info.href) + '"' + (x.info.ext ? ' target="_blank" rel="noopener"' : '') + (x.info.key ? ' data-key="' + x.info.key + '"' : '') + '>' + esc(x.info.titulo) + '</a></h3><p class="meta">' + esc(x.info.sub) + '</p><div class="record-actions"><button type="button" class="btn btn-quiet btn-sm" data-act="ref" data-kind="' + x.k + '" data-id="' + esc(x.id) + '">' + icon('copy', 16) + 'Citar en APA</button>' + (compartida ? '' : saveBtn(x.k, x.id)) + '</div></article>').join('') + '</div></section>'; }).join('')
          : emptyBox('Tu carpeta está vacía', 'Usa el botón «Guardar» en autoridades, proyectos, votaciones y noticias. Aquí podrás copiar la bibliografía en APA o compartirla con tu grupo.', '<a class="btn btn-line" href="#/temas">Explorar temas</a><a class="btn btn-quiet" href="#/guia" data-act="guia-start">Búsqueda guiada</a>')) +
        '</div></div>'
    };
  };

  /* Seguimiento: autoridades y proyectos, con novedades desde la última vez que los viste */
  const seguidos = () => leerLS('contraste_sigue', []);
  const siguiendo = (k, id) => seguidos().some((x) => x.k === k && x.id === id);
  function alternarSeguir(k, id) { const s = seguidos(); const on = !siguiendo(k, id); escribirLS('contraste_sigue', on ? s.concat([{ k, id, visto: CORTE }]) : s.filter((x) => !(x.k === k && x.id === id))); return on; }
  function marcarVisto(k, id) { escribirLS('contraste_sigue', seguidos().map((x) => (x.k === k && x.id === id ? Object.assign({}, x, { visto: CORTE }) : x))); }
  function pintarSeguir(b, on) { b.setAttribute('aria-pressed', on); $('.g-t', b).textContent = on ? 'Siguiendo' : 'Seguir'; }
  function segBtn(k, id) { const on = siguiendo(k, id); return '<button type="button" class="btn btn-line btn-seguir" data-act="seguir" data-kind="' + k + '" data-id="' + esc(id) + '" aria-pressed="' + on + '">' + icon('bell', 16) + '<span class="g-t">' + (on ? 'Siguiendo' : 'Seguir') + '</span></button>'; }
  function novedades(x) {
    if (x.k === 'person') { const p = PID[x.id]; if (!p) return []; const nv = newsOf(p).filter((n) => n.d > x.visto).map((n) => ({ d: n.d, t: n.medio + ': ' + n.titulo })); const vv = esParl(p) ? personVotes(p).filter((v) => v.fecha > x.visto).map((v) => ({ d: v.fecha, t: 'Votó ' + OPC[v.suVoto].toLowerCase() + ': ' + ((BID[v.boletin] || {}).nombreCorto || (BID[v.boletin] || {}).titulo || 'Boletín ' + v.boletin) })) : []; return nv.concat(vv); }
    if (x.k === 'bill') { const b = BID[x.id]; if (!b) return []; return billVotes(b).filter((v) => v.fecha > x.visto).map((v) => ({ d: v.fecha, t: camaraCorta(v) + ': ' + v.totales.si + ' a favor, ' + v.totales.no + ' en contra' })).concat((b.tram || []).filter((r) => r[0] > x.visto).map((r) => ({ d: r[0], t: r[1] }))); }
    return [];
  }
  function totalNuevos() { try { return seguidos().reduce((a, x) => a + novedades(x).length, 0); } catch (e) { return 0; } }
  function bloqueSeguimiento() {
    const s = seguidos(); if (!s.length) return '';
    const filas = s.map((x) => { const n = novedades(x).sort((a, b) => b.d.localeCompare(a.d)); const i = itemInfo(x.k, x.id); return i && { x, n, i }; }).filter(Boolean).sort((a, b) => b.n.length - a.n.length);
    return '<section class="wrap sec"><h2 class="h2">Lo que sigues</h2><div class="records seg-lista">' + filas.slice(0, 6).map(({ x, n, i }) => '<article class="record"><div class="record-stamp"><strong>' + esc(i.tipo) + '</strong>' + (n.length ? '<span class="nuevo">' + plural(n.length, 'novedad', 'novedades') + '</span>' : '<span class="dot">Sin novedades desde tu última visita</span>') + '</div><h3 class="h3"><a href="' + esc(i.href) + '">' + esc(i.titulo) + '</a></h3>' + (n.length ? '<ul class="nov">' + n.slice(0, 3).map((r) => '<li><time class="num">' + fFechaCorta(r.d) + '</time> ' + esc(recorta(r.t, 110)) + '</li>').join('') + '</ul><div class="record-actions"><button type="button" class="btn btn-quiet btn-sm" data-act="visto" data-kind="' + x.k + '" data-id="' + esc(x.id) + '">' + icon('check', 16) + 'Marcar como visto</button></div>' : '') + '</article>').join('') + '</div></section>';
  }

  /* ---------- Señal de fuentes ---------- */
  const VACIAS = new Set('para como sobre tras desde entre esta este estas estos ante pero porque cuando donde sera fue han hay con sin por los las del una unos unas que más mas sus ser según segun'.split(' '));
  const firma = (t) => new Set(norm(t).replace(/[^a-z0-9 ]/g, ' ').split(/\s+/).filter((w) => w.length > 3 && !VACIAS.has(w)));
  const memoSim = {};
  function mediosSimilares(n) {
    if (memoSim[n.key]) return memoSim[n.key];
    const a = firma(n.titulo); const desde = addDays(n.d, -3); const hasta = addDays(n.d, 3); const out = new Set([n.medio]);
    NEWS.forEach((o) => { if (o === n || o.medio === n.medio || !o.d || o.d < desde || o.d > hasta) return; const b = firma(o.titulo); let c = 0; a.forEach((w) => { if (b.has(w)) c++; }); if (c >= 3 && c / Math.min(a.size, b.size) >= 0.5) out.add(o.medio); });
    return (memoSim[n.key] = Array.from(out));
  }
  function senalFuentes(n) {
    if (n.tm === 'Oficial') return '<span class="senal s3" title="Publicación de una institución">Fuente oficial</span>' + gl('Fuentes');
    if (n.ev && E[n.ev]) return '<span class="senal s3">' + E[n.ev].items.length + ' medios comparados</span>' + gl('Fuentes');
    const m = mediosSimilares(n);
    return (m.length > 1 ? '<span class="senal s2" title="' + esc(m.join(', ')) + '">' + m.length + ' medios con titular similar</span>' : '<span class="senal s1">1 medio: conviene confirmar</span>') + gl('Fuentes');
  }

  /* ---------- Búsqueda por comuna ---------- */
  const comunaDe = (q) => { const n = norm(q || '').trim(); return n ? COMUNAS.find((c) => norm(c[0]) === n) : null; };
  const datalistComunas = () => '<datalist id="lista-comunas">' + COMUNAS.map((c) => '<option value="' + esc(c[0]) + '"></option>').join('') + '</datalist>';
  const genteDeComuna = (c) => ({ dip: P.filter((p) => p.tipo === 'Diputados' && p.dist === c[1]), sen: P.filter((p) => p.tipo === 'Senadores' && regCanon(p.region) === regCanon(c[2])), gob: P.filter((p) => p.tipo === 'Gobernadores' && regCanon(p.region) === regCanon(c[2])), alc: P.filter((p) => p.tipo === 'Alcaldes' && norm(p.cargoCorto).endsWith(norm(c[0]))) });
  function bloqueComuna(q) {
    const c = comunaDe(q); if (!c) return '';
    const g = genteDeComuna(c);
    return '<section class="section"><div class="comuna-res"><div><h2 class="h2">Comuna de ' + esc(c[0]) + '</h2><p class="meta">Distrito ' + c[1] + ' · Región ' + esc(regCanon(c[2])) + ' · ' + plural(g.dip.length, 'diputación', 'diputaciones') + ' y ' + plural(g.sen.length, 'senaduría', 'senadurías') + '</p></div><a class="btn btn-primary" href="#/comuna/' + encodeURIComponent(c[0]) + '">' + icon('pin', 16) + 'Ver a sus parlamentarios</a></div></section>';
  }
  VIEWS.comuna = (route) => {
    const q = route.parts[1] || ''; const c = comunaDe(q); const g = c && genteDeComuna(c);
    const lista = (t, l) => l.length ? '<section class="section"><h2 class="h2">' + t + ' <span class="count">' + l.length + '</span></h2><div class="people" style="margin-top:10px">' + l.map((p) => personRow(p)).join('') + '</div></section>' : '';
    return {
      title: (c ? c[0] + ' · ' : '') + 'Busca por comuna · Contraste',
      html: '<div class="page"><div class="wrap"><div class="page-head"><h1 class="h1" tabindex="-1">' + (c ? 'Comuna de ' + esc(c[0]) : 'Busca por comuna') + '</h1><p class="lede">' + (c ? 'Distrito ' + c[1] + ' · Región ' + esc(regCanon(c[2])) : 'Escribe una comuna y mira qué parlamentarios fueron elegidos por esa zona. Sirve para notas locales o cuando no sabes el nombre de la autoridad.') + '</p></div>' +
        '<form class="atajo atajo-ancho" data-search="comuna"><label class="sr-only" for="q-comuna">Comuna</label><div class="fila-in"><input id="q-comuna" name="q" list="lista-comunas" placeholder="Ej.: Maipú, Temuco, Punta Arenas" value="' + esc(c ? c[0] : q) + '" autocomplete="off"><button class="btn btn-primary">Ver</button></div>' + datalistComunas() + '</form>' +
        (c ? lista('Diputadas y diputados del Distrito ' + c[1], g.dip) + lista('Senadoras y senadores de la región', g.sen) + lista('Gobernación regional', g.gob) + lista('Alcaldía con ficha en Contraste', g.alc) +
          '<p class="meta" style="margin-top:16px;max-width:75ch">Las diputaciones se eligen por distrito y las senadurías por región (Ley 20.840, listado de comunas). Para la alcaldía, revisa el sitio de la municipalidad si no aparece aquí. ' + '<a href="' + 'https://news.google.com/search?q=' + encodeURIComponent('alcalde ' + c[0] + ' Chile') + '&hl=es-419&gl=CL&ceid=CL:es-419" target="_blank" rel="noopener">Buscar noticias de la alcaldía</a></p>'
          : (q ? '<div style="margin-top:16px">' + emptyBox('No encontramos esa comuna', 'Revisa la ortografía: la lista incluye las 346 comunas de Chile.') + '</div>' : '')) +
        '</div></div>'
    };
  };

  /* ---------- Sin resultados: seguir buscando fuera ---------- */
  function busquedaExterna(q, compacto) {
    const e = encodeURIComponent(q);
    const L = [['Google Noticias', 'https://news.google.com/search?q=' + e + '&hl=es-419&gl=CL&ceid=CL:es-419', 'Prensa reciente'],
      ['Cámara de Diputados', 'https://www.google.com/search?q=' + e + '+site%3Acamara.cl', 'Proyectos, sesiones y diputados'], ['Senado', 'https://www.google.com/search?q=' + e + '+site%3Asenado.cl', 'Tramitación y senadores'],
      ['Ley Chile (BCN)', 'https://www.bcn.cl/leychile/consulta/listado_n_sel?agr=1&comp=&q=' + e, 'Leyes y normas']];
    return '<section class="section ext-bus' + (compacto ? ' compacto' : '') + '"><h2 class="h2">' + (compacto ? '¿Te falta algo? Sigue buscando «' + esc(q) + '»' : 'Sigue buscando «' + esc(q) + '» en estas fuentes') + '</h2><div class="ext-grid">' + L.map(([t, u, d]) => '<a href="' + u + '" target="_blank" rel="noopener"><strong>' + t + icon('ext', 16) + '</strong><span>' + d + '</span></a>').join('') + '</div></section>';
  }

  /* ---------- Votos en el perfil ---------- */
  function bloqueVotosPersona(p, pv) {
    const k = voteKeyFor(p); if (!pv.length) return emptyBox('Sin votaciones registradas', 'No registra votaciones de Sala en los proyectos que reúne Contraste.', '<a class="btn btn-line" href="' + esc(p.oficialUrl) + '" target="_blank" rel="noopener">Ficha oficial' + icon('ext', 16) + '</a>');
    const memo = UI.dist && UI.dist.k === k ? UI.dist.ids : (UI.dist = { k, ids: new Set(pv.filter((v) => distintoDePartido(v, k)).map((v) => v.id)) }).ids;
    const c = { A: 0, C: 0, B: 0, N: 0, P: 0, D: 0 }; pv.forEach((v) => { c[v.suVoto] = (c[v.suVoto] || 0) + 1; });
    const sinCalculo = !memo.size && (sinBloque(canonParty(LEG.partidoDe(k, pv[0].fecha).p)) || !pv.slice(0, 40).some((v) => mayoriaPartido(v, canonParty(LEG.partidoDe(k, v.fecha).p))));
    const lista = UI.pvDist ? pv.filter((v) => memo.has(v.id)) : pv;
    const lim = UI.pvLim || 30;
    return '<div class="section-head" style="margin-top:0"><h2 class="h2">Cómo vota</h2><span class="meta">Registro individual de la ' + (p.tipo === 'Senadores' ? 'Sala del Senado' : 'Sala de la Cámara') + ' en ' + plural(pv.length, 'votación', 'votaciones') + '</span></div>' +
      '<div class="resumen-v"><div><b class="A">' + c.A + '</b>a favor</div><div><b class="C">' + c.C + '</b>en contra</div><div><b class="B">' + c.B + '</b>abstenciones</div>' + (p.tipo === 'Diputados' ? '<div><b>' + c.N + '</b>no votó</div>' : '<div><b>' + c.P + '</b>pareos</div>') + '<div class="dest"><b>' + (sinCalculo ? '—' : memo.size) + '</b>distinto a su partido ' + gl('Distinto a su partido') + '</div></div>' + (sinCalculo ? '<p class="meta" style="margin:8px 0 0">No lo calculamos porque ' + (sinBloque(p.partidoF) ? 'no milita en un partido.' : 'su partido tiene muy pocos parlamentarios en esta cámara.') + '</p>' : '') +
      (p.tipo === 'Senadores' ? '<p class="meta" style="margin:8px 0 0">El Senado solo publica a quienes votaron; las ausencias no aparecen en este registro.</p>' : '') +
      '<div class="toolbar" style="margin:12px 0">' + (memo.size ? '<button type="button" class="btn btn-line' + (UI.pvDist ? ' is-on' : '') + '" data-act="pv-dist">' + (UI.pvDist ? 'Ver todas' : 'Ver solo donde votó distinto a su partido') + '</button>' : '') + '<a class="btn btn-quiet" href="' + buildHash('comparar', [], { a: p.id }) + '">' + icon('compare', 16) + 'Comparar con otro parlamentario</a></div>' +
      (lista.length ? '<div class="records">' + lista.slice(0, lim).map((v) => voteRow(v, { boletin: true, voto: 'Su voto: <span class="badge ' + OPC_CLS[v.suVoto] + '">' + OPC[v.suVoto] + '</span>' + (memo.has(v.id) ? ' <span class="senal s2">Distinto a su partido</span>' : '') })).join('') + '</div>' +
        (lista.length > lim ? '<div class="more-row"><button type="button" class="btn btn-line" data-act="pv-mas">Ver más <span class="count">(' + (lista.length - lim) + ')</span></button></div>' : '') : emptyBox('No hay votaciones así', 'En estos registros votó igual que la mayoría de su partido.'));
  }

  /* ---------- Quiénes votaron distinto a su partido, en una votación ---------- */
  function bloqueDisidentes(v, people) {
    const porPartido = {}; const ids = LEG.roster(v);
    ids.forEach((id, i) => { const o = v.o.charAt(i); const par = canonParty(LEG.partidoDe(id, v.fecha).p); if (!/[ACB]/.test(o) || sinBloque(par)) return; (porPartido[par] = porPartido[par] || []).push({ id, o }); });
    const lista = [];
    Object.keys(porPartido).forEach((par) => { const m = mayoriaPartido(v, par); if (!m) return; porPartido[par].forEach((x) => { if (x.o !== m) lista.push({ par, o: x.o, m, nombre: x.id.charAt(0) === 'D' ? (LEG.diputados[x.id] || {}).nombre : (LEG.senadores[x.id] || {}).nombre, prof: PROF_BY_KEY[x.id] }); }); });
    if (!lista.length) return '';
    return '<section class="section"><div class="section-head"><h2 class="h2">Votaron distinto a su partido <span class="count">' + lista.length + '</span> ' + gl('Distinto a su partido') + '</h2><span class="meta">Una pista para investigar, no una evaluación</span></div><div class="records disid">' + lista.sort((a, b) => a.par.localeCompare(b.par, 'es')).slice(0, 40).map((x) => '<div class="record fila-dis"><span>' + (x.prof ? '<a href="#/autoridad/' + x.prof.id + '"><strong>' + esc(x.nombre) + '</strong></a>' : '<strong>' + esc(x.nombre) + '</strong>') + '<span class="meta"> · ' + esc(x.par) + '</span></span><span class="badge ' + OPC_CLS[x.o] + '">' + OPC[x.o] + '</span><span class="meta">Su partido: ' + OPC[x.m].toLowerCase() + '</span></div>').join('') + '</div></section>';
  }

  /* ---------- Línea de tiempo de un proyecto ---------- */
  function noticiasDeProyecto(b) {
    const claves = (b.claves || []).map(norm).filter((c) => c.length > 4 && c.split(' ').length > 1);
    return NEWS.filter((n) => n.proyecto === b.boletin || n.titulo.includes(b.boletin) || (claves.length && claves.some((c) => norm(n.titulo).includes(c)))).slice(0, 40);
  }
  function lineaDeTiempo(b, vs, news) {
    const ev = [];
    if (b.ingreso) ev.push({ d: b.ingreso, c: 'hito', t: 'Ingreso del proyecto', s: b.origen });
    (b.tram || []).forEach((r) => { if (!/ingreso de proyecto/i.test(r[1])) ev.push({ d: r[0], c: /aprob|despach|publica|promulg|rechaz/i.test(r[1]) ? 'hito' : 'tram', t: r[1], s: r[2] }); });
    const porDia = {}; vs.forEach((v) => { const k = v.fecha + camaraCorta(v); (porDia[k] = porDia[k] || []).push(v); });
    Object.keys(porDia).forEach((k) => { const l = porDia[k]; const v = l[0]; ev.push({ d: v.fecha, c: 'voto', t: l.length > 1 ? plural(l.length, 'votación', 'votaciones') + ' en ' + (camaraCorta(v) === 'Senado' ? 'el Senado' : 'la Cámara') : (camaraCorta(v) === 'Senado' ? 'Votación en el Senado' : 'Votación en la Cámara') + ': ' + v.totales.si + ' a favor, ' + v.totales.no + ' en contra', href: l.length === 1 ? '#/votacion/' + v.id : '#votaciones' }); });
    news.slice(0, 12).forEach((n) => ev.push({ d: n.d, c: 'nota', t: n.titulo, s: n.medio, ext: n.url, key: n.key }));
    if (ev.length < 2) return '';
    ev.sort((x, y) => y.d.localeCompare(x.d));
    return '<section class="section"><div class="section-head"><h2 class="h2">Línea de tiempo</h2><span class="ley-t"><i class="hito"></i>Hito <i class="tram"></i>Trámite <i class="voto"></i>Votación <i class="nota"></i>Prensa</span></div><ol class="linea reveal">' + ev.slice(0, 40).map((x) => {
      const cuerpo = '<strong>' + esc(recorta(x.t, 150)) + '</strong>' + (x.s ? '<span>' + esc(x.s) + '</span>' : '');
      return '<li class="' + x.c + '"><time class="num">' + fFecha(x.d) + '</time><div>' + (x.href ? '<a href="' + x.href + '">' + cuerpo + '</a>' : x.ext ? '<a href="' + esc(x.ext) + '" target="_blank" rel="noopener" data-key="' + x.key + '">' + cuerpo + '</a>' : cuerpo) + '</div></li>';
    }).join('') + '</ol></section>';
  }

  /* ---------- Comparar parlamentarios ---------- */
  VIEWS.comparar = (route) => {
    const st = route.params; const a = PID[st.a]; const b = PID[st.b];
    const opciones = P.filter(esParl).sort((x, y) => x.nombre.localeCompare(y.nombre, 'es'));
    const sel = (id, name, cur) => '<label class="field">' + name + '<select data-comp="' + id + '"><option value="">Elige un parlamentario</option>' + ['Senadores', 'Diputados'].map((t) => '<optgroup label="' + t + '">' + opciones.filter((p) => p.tipo === t).map((p) => '<option value="' + p.id + '"' + (cur === p.id ? ' selected' : '') + '>' + esc(p.nombre) + ' (' + esc(p.partido) + ')</option>').join('') + '</optgroup>').join('') + '</select></label>';
    let cuerpo = '';
    if (a && b && a.tipo !== b.tipo) cuerpo = emptyBox('Están en cámaras distintas', 'Diputados y senadores votan por separado, así que no hay votaciones comunes. Elige a dos de la misma cámara.');
    else if (a && b && a.id === b.id) cuerpo = emptyBox('Es la misma persona', 'Elige a dos parlamentarios distintos.');
    else if (a && b) {
      const ka = voteKeyFor(a); const kb = voteKeyFor(b); const dif = []; let igual = 0;
      Object.keys(VOT).forEach((id) => { const v = VOT[id]; const x = LEG.votoDe(v, ka); const y = LEG.votoDe(v, kb); if (!/[ACB]/.test(x) || !/[ACB]/.test(y)) return; if (x === y) igual++; else dif.push({ v, x, y }); });
      const tot = igual + dif.length; const pct = tot ? Math.round(100 * igual / tot) : 0;
      dif.sort((p, q) => (q.v.fecha + q.v.hora).localeCompare(p.v.fecha + p.v.hora));
      cuerpo = tot ? '<div class="comp-res reveal"><div class="comp-gente"><a href="#/autoridad/' + a.id + '">' + photoTag(a, 72) + '<strong>' + esc(a.nombre) + '</strong><span>' + esc(a.partido) + '</span></a><div class="comp-pct"><b>' + pct + '%</b><span>votaron igual</span></div><a href="#/autoridad/' + b.id + '">' + photoTag(b, 72) + '<strong>' + esc(b.nombre) + '</strong><span>' + esc(b.partido) + '</span></a></div><div class="comp-bar" aria-hidden="true"><i style="width:' + pct + '%"></i></div><p class="meta">Coincidieron en ' + igual + ' de ' + plural(tot, 'votación', 'votaciones') + ' en que ambos votaron a favor, en contra o se abstuvieron. No incluye ausencias ni pareos.</p></div>' +
        '<section class="section"><h2 class="h2">Votaron distinto <span class="count">' + dif.length + '</span></h2>' + (dif.length ? '<div class="records" style="margin-top:10px">' + dif.slice(0, 40).map(({ v, x, y }) => { const bb = BID[v.boletin]; return '<a class="vote-row" href="#/votacion/' + v.id + '"><span class="vr-date">' + fFecha(v.fecha) + '</span><span><span class="vr-title">' + esc(bb ? (bb.nombreCorto || bb.titulo) : 'Boletín ' + v.boletin) + '</span><span class="vr-meta">' + esc(v.materiaCorta || '') + '</span></span><span class="comp-votos"><span class="badge ' + OPC_CLS[x] + '">' + OPC[x] + '</span><span class="badge ' + OPC_CLS[y] + '">' + OPC[y] + '</span></span></a>'; }).join('') + '</div>' : '<p class="meta" style="margin-top:8px">No hay votaciones con votos distintos.</p>') + '</section><p class="meta" style="margin-top:16px;max-width:72ch">Es una descripción del registro oficial: no asigna puntajes ni interpreta posiciones.</p>'
        : emptyBox('No tienen votaciones en común', 'En los registros de Contraste no coinciden en ninguna votación.');
    }
    return {
      title: 'Comparar parlamentarios · Contraste',
      html: '<div class="page"><div class="wrap"><div class="page-head"><h1 class="h1" tabindex="-1">Comparar parlamentarios</h1><p class="lede">Elige a dos de la misma cámara y mira en qué votaciones coincidieron y en cuáles no.</p></div><div class="comp-sel">' + sel('a', 'Primera persona', st.a) + sel('b', 'Segunda persona', st.b) + '</div>' + (cuerpo ? '<div style="margin-top:20px">' + cuerpo + '</div>' : '') + '</div></div>'
    };
  };
  document.addEventListener('change', (e) => { const t = e.target; if (t.matches && t.matches('[data-comp]')) { const r = parseHash(); const pa = Object.assign({}, r.params, { [t.dataset.comp]: t.value }); go(buildHash('comparar', [], pa)); } });

  /* ---------- Temas y kit para empezar un trabajo ---------- */
  const TEMAS = [
    { id: 'seguridad', n: 'Seguridad', gancho: 'Reglas de Uso de la Fuerza, ley municipal', bt: ['Seguridad'], nt: ['Seguridad', 'Comercio ambulante'], inst: /seguridad|defensa/i, ctx: 'Abarca las reglas para policías y Fuerzas Armadas, la seguridad municipal y el crimen organizado. Parte por las Reglas de Uso de la Fuerza, aprobadas en octubre de 2026.', fuentes: [['Ministerio de Seguridad Pública', 'https://www.minsegpublica.gob.cl/'], ['Fiscalía de Chile', 'https://www.fiscaliadechile.cl/'], ['Centro de Estudios y Análisis del Delito', 'https://cead.minsegpublica.gob.cl/']] },
    { id: 'presupuesto', n: 'Presupuesto 2027', gancho: 'Ley de Presupuestos, Hacienda y megarreforma', bt: ['Presupuesto', 'Hacienda', 'Economía'], nt: ['Presupuesto', 'Hacienda'], inst: /hacienda|econom/i, ctx: 'Incluye la discusión de la Ley de Presupuestos 2027 y la agenda tributaria del Gobierno, como la megarreforma de Reconstrucción Nacional.', fuentes: [['Dirección de Presupuestos', 'https://www.dipres.gob.cl/'], ['Ministerio de Hacienda', 'https://www.hacienda.cl/'], ['Consejo Fiscal Autónomo', 'https://cfachile.cl/']] },
    { id: 'educacion', n: 'Educación', gancho: 'Admisión escolar y proyectos del sector', bt: ['Educación'], nt: ['Educación'], inst: /educaci/i, ctx: 'Proyectos y cobertura sobre colegios, admisión escolar y educación superior.', fuentes: [['Ministerio de Educación', 'https://www.mineduc.cl/'], ['Superintendencia de Educación', 'https://www.supereduc.cl/'], ['Agencia de Calidad', 'https://www.agenciaeducacion.cl/']] },
    { id: 'migracion', n: 'Migración', gancho: 'Expulsiones y control de fronteras', bt: ['Migración'], nt: ['Migración'], inst: /interior/i, ctx: 'Reforma constitucional sobre detención para expulsar y cobertura sobre control migratorio.', fuentes: [['Servicio Nacional de Migraciones', 'https://serviciomigraciones.cl/'], ['Instituto Nacional de Derechos Humanos', 'https://www.indh.cl/']] },
    { id: 'vivienda', n: 'Vivienda', gancho: 'Subsidio a la tasa, reconstrucción y obras', bt: ['Vivienda', 'Obras públicas'], nt: ['Vivienda', 'Obras', 'Reconstrucción', 'Ciudad'], inst: /vivienda|obras/i, ctx: 'Subsidio a créditos hipotecarios, reconstrucción y déficit habitacional.', fuentes: [['Ministerio de Vivienda y Urbanismo', 'https://www.minvu.gob.cl/'], ['Observatorio Urbano', 'https://www.observatoriourbano.cl/']] },
    { id: 'salud', n: 'Salud', gancho: 'Listas de espera, isapres y hospitales', bt: ['Salud'], nt: ['Salud'], inst: /salud/i, ctx: 'Proyectos del sector y cobertura sobre el sistema de salud.', fuentes: [['Ministerio de Salud', 'https://www.minsal.cl/'], ['Superintendencia de Salud', 'https://www.supersalud.gob.cl/']] },
    { id: 'trabajo', n: 'Trabajo y pensiones', gancho: 'Empleo, sala cuna y previsión', bt: ['Trabajo', 'Familia', 'Mujer'], nt: ['Trabajo'], inst: /trabajo|mujer/i, ctx: 'Empleo, previsión, sala cuna y derechos laborales.', fuentes: [['Ministerio del Trabajo', 'https://www.mintrab.gob.cl/'], ['Dirección del Trabajo', 'https://www.dt.gob.cl/'], ['Instituto Nacional de Estadísticas', 'https://www.ine.gob.cl/']] },
    { id: 'justicia', n: 'Justicia y probidad', gancho: 'Reformas, querellas y control público', bt: ['Justicia y Constitución', 'Derechos humanos'], nt: ['Justicia', 'Probidad'], inst: /justicia/i, ctx: 'Reformas legales y constitucionales, y casos de probidad en autoridades.', fuentes: [['Poder Judicial', 'https://www.pjud.cl/'], ['Contraloría General', 'https://www.contraloria.cl/'], ['Consejo para la Transparencia', 'https://www.consejotransparencia.cl/']] },
    { id: 'ambiente', n: 'Medio ambiente y energía', gancho: 'Clima, agua, minería y energía', bt: ['Medio ambiente', 'Minería y energía', 'Recursos hídricos', 'Agricultura', 'Pesca'], nt: ['Medio ambiente'], inst: /ambiente|energ|miner|agricultura/i, ctx: 'Proyectos sobre medio ambiente, energía, minería, agua y territorio.', fuentes: [['Ministerio del Medio Ambiente', 'https://mma.gob.cl/'], ['Servicio de Evaluación Ambiental', 'https://www.sea.gob.cl/']] },
    { id: 'politica', n: 'Política y gobierno', gancho: 'Gabinete, partidos y regiones', bt: ['Gobierno y regiones'], nt: ['Política', 'Gabinete', 'Género'], inst: /presidencia|segpres/i, ctx: 'Gabinete, partidos, relaciones entre el Gobierno y el Congreso, y gobiernos regionales.', fuentes: [['Servel', 'https://www.servel.cl/'], ['Cámara de Diputadas y Diputados', 'https://www.camara.cl/'], ['Senado', 'https://www.senado.cl/']] }
  ];
  const TEMA_ID = {}; TEMAS.forEach((x) => { TEMA_ID[x.id] = x; });
  function datosTema(x) {
    const bills = BILLS.filter((b) => x.bt.includes(b.tema)).sort((a, b) => (ultFecha(b) || '').localeCompare(ultFecha(a) || ''));
    const news = NEWS.filter((n) => x.nt.includes(n.tema));
    const evs = Object.keys(E).filter((k) => NEWS.some((n) => n.ev === k && x.nt.includes(n.tema)) || (E[k].proyecto && BID[E[k].proyecto] && x.bt.includes(BID[E[k].proyecto].tema)));
    const cuenta = {}; news.forEach((n) => { cuenta[n.pid] = (cuenta[n.pid] || 0) + 1; });
    const ministros = P.filter((p) => (p.tipo === 'Ministros' || p.tipo === 'Presidencia') && x.inst.test(p.cargo + ' ' + p.institucion));
    const gente = uniq(ministros.map((p) => p.id).concat(Object.keys(cuenta).sort((a, b) => cuenta[b] - cuenta[a]))).map((i) => PID[i]).filter(Boolean).slice(0, 8);
    const votos = uniq(bills.flatMap((b) => b.votaciones || [])).map((i) => VOT[i]).filter(Boolean).sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora));
    return { bills, news, evs, gente, votos };
  }
  const ultFecha = (b) => { const v = (b.votaciones || []).map((i) => VOT[i]).filter(Boolean).map((z) => z.fecha).sort().pop(); return v || b.ingreso; };
  const kitItems = (x) => { const d = datosTema(x); return d.gente.slice(0, 4).map((p) => ['person', p.id]).concat(d.bills.slice(0, 4).map((b) => ['bill', b.boletin]), d.evs.slice(0, 2).map((k) => ['event', k]), d.news.slice(0, 5).map((n) => ['news', n.key])); };
  VIEWS.temas = () => ({
    title: 'Temas · Contraste',
    html: '<div class="page"><div class="wrap"><div class="page-head"><h1 class="h1" tabindex="-1">Temas</h1><p class="lede">Elige un tema y recibe un kit para empezar tu trabajo: contexto, personas clave, proyectos, votaciones, prensa y fuentes por consultar.</p></div><div class="temas temas-todos">' +
      TEMAS.map((x) => { const d = datosTema(x); return '<a class="tema" href="#/tema/' + x.id + '"><strong>' + esc(x.n) + '</strong><span>' + esc(x.gancho) + '</span><span class="tema-c num">' + plural(d.bills.length, 'proyecto', 'proyectos') + ' · ' + plural(d.news.length, 'noticia', 'noticias') + '</span></a>'; }).join('') + '</div></div></div>'
  });
  VIEWS.tema = (route) => {
    const x = TEMA_ID[route.parts[1]]; if (!x) return VIEWS.noencontrado();
    const d = datosTema(x);
    const prs = [];
    const dispu = d.votos.find((v) => v.totales.si && v.totales.no && Math.abs(v.totales.si - v.totales.no) <= 10);
    if (dispu) prs.push(['¿Por qué esta votación fue tan estrecha?', (BID[dispu.boletin] || {}).nombreCorto || (BID[dispu.boletin] || {}).titulo || dispu.boletin, '#/votacion/' + dispu.id, dispu.totales.si + ' a favor y ' + dispu.totales.no + ' en contra']);
    const activo = d.bills.find((b) => /discusi[oó]n inmediata|suma/i.test(b.urgencia || ''));
    if (activo) prs.push(['¿Qué explica la urgencia de este proyecto?', activo.nombreCorto || activo.titulo, '#/proyecto/' + activo.boletin, 'Urgencia: ' + activo.urgencia]);
    const unico = d.news.find((n) => n.d >= addDays(CORTE, -30) && mediosSimilares(n).length === 1);
    if (unico) prs.push(['¿Otra fuente confirma esta noticia?', unico.titulo, unico.url, 'Por ahora la detectamos en un solo medio: ' + unico.medio, unico.key]);
    if (d.evs[0]) prs.push(['¿Qué cuenta cada medio distinto de los demás?', E[d.evs[0]].titulo, '#/contrastar/' + d.evs[0], plural(E[d.evs[0]].items.length, 'medio comparado', 'medios comparados')]);
    return {
      title: x.n + ' · Kit de investigación · Contraste',
      html: '<div class="kit-head"><div class="wrap"><a class="back" href="#/temas">' + icon('back') + 'Todos los temas</a><h1 class="h1 display-k" tabindex="-1">' + esc(x.n) + '</h1><p class="lede">' + esc(x.ctx) + '</p><div class="record-actions"><button type="button" class="btn btn-primary" data-act="kit-guardar" data-id="' + x.id + '">' + icon('save', 16) + 'Guardar este kit en mi carpeta</button><button type="button" class="btn btn-quiet" data-act="share" data-url="#/tema/' + x.id + '" data-title="' + esc(x.n) + ' en Contraste">' + icon('share') + 'Compartir</button></div></div></div>' +
        '<div class="page"><div class="wrap kit">' +
        (prs.length ? '<section class="reveal"><h2 class="h2">Preguntas para partir</h2><p class="meta">Salen de los datos: sirven como punto de partida para tu reporteo.</p><div class="preguntas">' + prs.map(([q, tt, h, s, key]) => '<a href="' + esc(h) + '"' + (/^http/.test(h) ? ' target="_blank" rel="noopener"' : '') + (key ? ' data-key="' + key + '"' : '') + '><strong>' + esc(q) + '</strong><span>' + esc(recorta(tt, 80)) + '</span><span class="meta">' + esc(s) + '</span></a>').join('') + '</div></section>' : '') +
        (d.gente.length ? '<section class="section"><h2 class="h2">Personas clave</h2><div class="people" style="margin-top:10px">' + d.gente.map((p) => personRow(p)).join('') + '</div></section>' : '') +
        (d.bills.length ? '<section class="section"><div class="section-head"><h2 class="h2">Proyectos de ley <span class="count">' + d.bills.length + '</span></h2><a class="link-arrow" href="' + buildHash('proyectos', [], { tema: d.bills[0].tema }) + '">Ver todos' + icon('arrow', 16) + '</a></div><div class="records">' + d.bills.slice(0, 4).map(billRecord).join('') + '</div></section>' : '') +
        (d.votos.length ? '<section class="section"><h2 class="h2">Últimas votaciones</h2><div class="records" style="margin-top:10px">' + d.votos.slice(0, 4).map((v) => voteRow(v, { boletin: true })).join('') + '</div></section>' : '') +
        (d.evs.length ? '<section class="section"><h2 class="h2">Cobertura comparada</h2><div class="records" style="margin-top:10px">' + d.evs.map((k) => '<a class="record" style="display:block;text-decoration:none;color:inherit" href="#/contrastar/' + k + '"><span class="record-stamp"><strong class="num">' + esc(E[k].fecha) + '</strong><span class="dot">' + E[k].items.length + ' medios</span></span><span class="h3" style="display:block;margin-top:4px">' + esc(E[k].titulo) + '</span></a>').join('') + '</div></section>' : '') +
        (d.news.length ? '<section class="section"><div class="section-head"><h2 class="h2">Prensa reciente <span class="count">' + d.news.length + '</span></h2><a class="link-arrow" href="' + buildHash('buscar', [], { cat: 'noticias', tema: d.news[0].tema }) + '">Ver más' + icon('arrow', 16) + '</a></div><div class="records">' + d.news.slice(0, 5).map((n) => newsRecord(n)).join('') + '</div></section>' : '') +
        '<section class="section"><h2 class="h2">Fuentes por consultar</h2><div class="ext-grid" style="margin-top:10px">' + x.fuentes.map(([t, u]) => '<a href="' + u + '" target="_blank" rel="noopener"><strong>' + esc(t) + icon('ext', 16) + '</strong></a>').join('') + '</div></section>' +
        '</div></div>'
    };
  };

  /* ---------- Búsqueda guiada ---------- */
  const GP = [
    { key: 'obj', q: '¿Qué necesitas preparar?', opts: [
      ['noticia', 'Una nota o noticia', 'Noticias recientes de distintos medios.'],
      ['perfil', 'Antecedentes de una autoridad', 'Perfiles con trayectoria, cargo y fuentes oficiales.'],
      ['contrastar', 'Comparar cómo lo cubrieron los medios', 'Un mismo hecho contado por varios medios.'],
      ['proyectos', 'Proyectos de ley y votaciones', 'Cómo votó cada parlamentario, con el registro oficial.']] },
    { key: 'tipo', q: '¿Sobre qué tipo de autoridad?', opts: [
      ['Parlamentarios', 'Parlamentarios', 'Diputados y senadores.'], ['Ministros', 'Ministros', 'Gobierno central.'], ['Gobernadores', 'Gobernadores regionales', 'Gobiernos regionales.'], ['Alcaldes', 'Alcaldes', 'Gestión de comunas.']] },
    { key: 'tema', q: '¿Qué tema te interesa?', opts: [
      ['seguridad', 'Seguridad', 'Policías, crimen organizado, espacio público.'], ['economia', 'Presupuesto y economía', 'Presupuesto 2027, impuestos, recortes.'],
      ['vivienda', 'Vivienda y obras', 'Reconstrucción, viviendas, obras en comunas.'], ['educacion', 'Educación', 'Admisión escolar y comunidad educativa.'], ['politica', 'Política y partidos', 'Militancias, gabinete, conflictos políticos.']] },
    { key: 'periodo', q: '¿De qué período?', opts: [['30d', 'Último mes', 'Lo más reciente.'], ['90d', 'Últimos 3 meses', 'Desde mediados de julio.'], ['todos', 'Cualquier fecha', 'Todo lo disponible.']] }
  ];
  const TG = { seguridad: ['Seguridad', 'Justicia', 'Comercio ambulante', 'Migración'], economia: ['Presupuesto', 'Hacienda'], vivienda: ['Obras', 'Vivienda', 'Reconstrucción', 'Ciudad'], educacion: ['Educación'], politica: ['Política', 'Gabinete', 'Género', 'Probidad'] };
  VIEWS.guia = (route) => {
    const g = UI.guia || (UI.guia = { step: 0 });
    if (g.step >= GP.length) return guiaResultados(g);
    const paso = GP[g.step];
    return {
      title: 'Búsqueda guiada · Contraste',
      html: '<div class="page"><div class="wrap" style="max-width:720px">' +
        '<div style="display:flex;align-items:center;gap:14px"><div class="steps" style="flex:1" aria-hidden="true">' + GP.map((_, i) => '<span class="' + (i <= g.step ? 'on' : '') + '"></span>').join('') + '</div><span class="meta num">Paso ' + (g.step + 1) + ' de ' + GP.length + '</span><button type="button" class="head-icon" style="color:var(--ink-2)" data-act="back" aria-label="Cerrar búsqueda guiada">' + icon('x', 20) + '</button></div>' +
        '<h1 class="h1" tabindex="-1" style="margin:28px 0 8px">' + paso.q + '</h1><p class="meta" style="margin-bottom:20px">Responde y te mostramos solo lo que calza con lo que buscas.</p>' +
        '<div style="display:flex;flex-direction:column;gap:8px">' + paso.opts.map(([v, l, d]) => '<button type="button" class="opt" data-act="guia" data-v="' + v + '" aria-pressed="' + (g[paso.key] === v) + '"><span class="radio" aria-hidden="true"></span><span><span class="t" style="display:block">' + l + '</span><span class="d">' + d + '</span></span></button>').join('') + '</div>' +
        '<div style="display:flex;justify-content:space-between;gap:12px;margin-top:20px">' + (g.step > 0 ? '<button type="button" class="back" data-act="guia-back">' + icon('back') + 'Atrás</button>' : '<span></span>') + (g.step > 0 ? '<button type="button" class="btn btn-quiet" data-act="guia" data-v="todos">Me da igual, saltar</button>' : '') + '</div>' +
        '</div></div>'
    };
  };
  function guiaResultados(g) {
    const tipoOk = (t) => !g.tipo || g.tipo === 'todos' || (g.tipo === 'Parlamentarios' ? esParl({ tipo: t }) : t === g.tipo);
    const temaOk = (t) => !g.tema || g.tema === 'todos' || (TG[g.tema] || []).includes(t);
    const per = g.periodo && g.periodo !== 'todos' ? [addDays(CORTE, g.periodo === '30d' ? -30 : -92), CORTE] : null;
    const obj = g.obj || 'noticia';
    let html = '';
    let n = 0;
    if (obj === 'noticia') { const ns = NEWS.filter((x) => tipoOk(PID[x.pid].tipo) && temaOk(x.tema) && inRange(x.d, per)).sort((a, b) => b.d.localeCompare(a.d)); n = ns.length; html = '<div class="records enter">' + ns.slice(0, 40).map((x) => newsRecord(x)).join('') + '</div>' + (ns.length > 40 ? '<p class="meta" style="margin-top:8px">Mostramos las 40 más recientes.</p>' : ''); }
    else if (obj === 'perfil') { const ps = P.filter((p) => tipoOk(p.tipo) && newsOf(p).some((x) => temaOk(x.tema) && inRange(x.d, per))).slice(0, 40); n = ps.length; html = '<div class="people enter">' + ps.map((p) => personRow(p)).join('') + '</div>'; }
    else if (obj === 'contrastar') { const ks = Object.keys(E).filter((k) => NEWS.some((x) => x.ev === k && tipoOk(PID[x.pid].tipo) && temaOk(x.tema)) && inRange(evDate(k), per)); n = ks.length; html = '<div class="records enter">' + ks.map((k) => '<a class="record" style="display:block;text-decoration:none;color:inherit" href="#/contrastar/' + k + '"><span class="record-stamp"><strong>' + esc(E[k].fecha) + '</strong><span class="dot">' + E[k].items.length + ' medios</span></span><span class="h3" style="display:block;margin-top:4px">' + esc(E[k].titulo) + '</span></a>').join('') + '</div>'; }
    else { const vs = Object.keys(VOT).map((k) => VOT[k]).filter((v) => inRange(v.fecha, per) && (!g.tema || g.tema === 'todos' || temaOk((BID[v.boletin] || {}).tema)) && (!g.tipo || g.tipo === 'todos' || g.tipo === 'Parlamentarios')).sort((a, b) => (b.fecha + b.hora).localeCompare(a.fecha + a.hora)); n = vs.length; html = '<div class="records">' + vs.slice(0, 30).map((v) => voteRow(v, { boletin: true })).join('') + '</div>' + (vs.length > 30 ? '<p class="meta" style="margin-top:8px">Mostramos las 30 más recientes. Revisa cada proyecto para ver su historial completo.</p>' : ''); }
    const lbl = (k) => { const s = GP.find((x) => x.key === k); const o = s.opts.find((x) => x[0] === g[k]); return o ? o[1] : { tipo: 'Cualquier autoridad', tema: 'Cualquier tema', periodo: 'Cualquier fecha', obj: '' }[k]; };
    return {
      title: 'Resultados de la búsqueda guiada · Contraste',
      html: '<div class="page"><div class="wrap"><div class="page-head"><h1 class="h1" tabindex="-1">' + ({ noticia: 'Noticias para tu nota', perfil: 'Autoridades que calzan con lo que buscas', contrastar: 'Coberturas para contrastar', proyectos: 'Votaciones de proyectos de ley' }[obj]) + '</h1><span class="meta num">' + plural(n, 'resultado', 'resultados') + ' · solo lo que calza con tus respuestas</span></div>' +
        '<div class="chips" style="margin-bottom:16px">' + GP.map((s, i) => '<button type="button" class="btn btn-line btn-sm" data-act="guia-edit" data-i="' + i + '">' + esc(lbl(s.key)) + '</button>').join('') + '<button type="button" class="btn btn-quiet btn-sm" data-act="guia-reset">Empezar de nuevo</button></div>' +
        (n ? html : emptyBox('No hay resultados exactos para esa combinación', 'Prueba ampliando una de tus respuestas.', '<button type="button" class="btn btn-line" data-act="guia-edit" data-i="3">Cambiar período</button><button type="button" class="btn btn-line" data-act="guia-edit" data-i="2">Cambiar tema</button>')) +
        '</div></div>'
    };
  }

  VIEWS.noencontrado = () => ({ title: 'No encontrado · Contraste', html: '<div class="page"><div class="wrap">' + '<div class="page-head"><h1 class="h1" tabindex="-1">No encontramos esta página</h1><p class="lede">El enlace puede estar incompleto o el registro ya no está en Contraste.</p></div>' + searchForm({ id: 'q-404', size: 'md', suggest: true }) + '<p style="margin-top:16px"><a class="link-arrow" href="#/">Ir al inicio' + icon('arrow') + '</a></p></div></div>' });

  /* =========================================================
     Render principal
     ========================================================= */
  let lastRouteKey = '';
  function render() {
    closeMenu();
    clearInterval(UI.muroT);
    const route = parseHash();
    document.body.classList.toggle('en-inicio', route.name === 'inicio');
    const view = (VIEWS[route.name] || VIEWS.noencontrado)(route);
    renderHeader(route); renderFooter(route);
    const main = $('#contenido');
    main.innerHTML = view.html;
    document.title = view.title || 'Contraste';
    const key = route.name + '/' + route.parts.join('/');
    if (key !== lastRouteKey) { window.scrollTo(0, 0); const h = $('h1', main); if (h && lastRouteKey) h.focus({ preventScroll: true }); }
    lastRouteKey = key;
    if (view.mount) view.mount();
    observarEntradas(); ajustarPlaceholder();
    window.dispatchEvent(new CustomEvent('contraste:render', { detail: route }));
  }

  /* Actualiza parámetros de la ruta actual sin recargar la vista */
  function setParams(patch, opts) {
    const r = parseHash();
    const params = Object.assign({}, r.params, patch);
    Object.keys(params).forEach((k) => { if (params[k] === '' || params[k] == null) delete params[k]; });
    if (!('n' in patch)) delete params.n;
    const h = buildHash(r.name, r.parts.slice(1), params);
    replaceHash(h);
    const nr = parseHash();
    if (r.name === 'buscar') renderResults(nr, opts);
    else if (r.name === 'proyectos') renderBills(nr);
    else render();
  }

  /* ---------- Sugerencias en vivo (inicio) ---------- */
  function suggestFor(input) {
    const box = $('#' + input.id + '-sug'); if (!box) return;
    const q = input.value.trim();
    if (q.length < 2) { box.hidden = true; input.setAttribute('aria-expanded', 'false'); return; }
    const R = runSearch({ q });
    const items = [];
    R.people.slice(0, 3).forEach((p) => items.push(['Autoridades', '#/autoridad/' + p.id, '<span style="width:36px;height:36px;flex-shrink:0;display:block">' + photoTag(p, 36) + '</span><span><span class="s-title" style="display:block">' + esc(p.nombre) + '</span><span class="s-meta">' + esc(p.cargoCorto + ' · ' + p.partido) + '</span></span>']));
    R.bills.slice(0, 2).forEach((b) => items.push(['Proyectos de ley', '#/proyecto/' + b.boletin, '<span class="tag-b">' + esc(b.boletin) + '</span><span><span class="s-title" style="display:block">' + esc(b.nombreCorto || b.titulo) + '</span><span class="s-meta">' + plural((b.votaciones || []).length, 'votación', 'votaciones') + ' oficiales</span></span>']));
    R.news.slice(0, 3).forEach((n) => items.push(['Noticias', n.ev ? '#/contrastar/' + n.ev : '#/autoridad/' + n.pid + '/noticias', '<span><span class="s-title" style="display:block">' + esc(n.titulo) + '</span><span class="s-meta">' + esc(n.medio + ' · ' + n.fecha + ' · ' + n.persona) + '</span></span>']));
    let html = ''; let cur = '';
    items.forEach(([g, href, inner], i) => { if (g !== cur) { html += '<h3>' + g + '</h3>'; cur = g; } html += '<a href="' + href + '" role="option" id="' + input.id + '-o' + i + '" aria-selected="false">' + inner + '</a>'; });
    const total = R.people.length + R.news.length + R.bills.length;
    html += '<a class="s-all" role="option" id="' + input.id + '-oall" aria-selected="false" href="' + buildHash('buscar', [], { q }) + '">' + (total ? 'Ver los ' + plural(total, 'resultado', 'resultados') + ' para «' + esc(q) + '»' : 'Sin coincidencias directas. Buscar «' + esc(q) + '» de todas formas') + '</a>';
    box.innerHTML = html; box.hidden = false; input.setAttribute('aria-expanded', 'true');
  }
  function moveSuggest(input, dir) {
    const box = $('#' + input.id + '-sug'); if (!box || box.hidden) return false;
    const opts = $$('[role="option"]', box); if (!opts.length) return false;
    let i = opts.findIndex((o) => o.getAttribute('aria-selected') === 'true');
    if (i >= 0) opts[i].setAttribute('aria-selected', 'false');
    i = (i + dir + opts.length + 1) % (opts.length + 1) - 1;
    if (i < 0) { input.removeAttribute('aria-activedescendant'); return true; }
    opts[i].setAttribute('aria-selected', 'true'); input.setAttribute('aria-activedescendant', opts[i].id); opts[i].scrollIntoView({ block: 'nearest' });
    return true;
  }

  /* =========================================================
     Eventos (delegación)
     ========================================================= */
  let liveT;
  document.addEventListener('input', (e) => {
    const t = e.target;
    if (t.matches('.search input[type="search"]')) {
      const clr = $('.search-clear', t.closest('.search')); if (clr) clr.hidden = !t.value;
      const mode = t.closest('form').dataset.search;
      if (mode === 'go' && t.getAttribute('role') === 'combobox') suggestFor(t);
      if (mode === 'live') { clearTimeout(liveT); liveT = setTimeout(() => setParams({ q: t.value.trim() }, { quiet: true }), 120); }
      if (mode === 'proy') { clearTimeout(liveT); liveT = setTimeout(() => setParams({ q: t.value.trim() }), 120); }
      if (mode === 'voter') { UI.voterQ = t.value; renderVoters(); }
    }
    if (t.matches('[data-date="dia"]') && t.value) applyDate(t, 'dia:' + t.value);
    if (t.matches('[data-date="desde"], [data-date="hasta"]')) {
      const panel = t.closest('.panel'); const a = $('[data-date="desde"]', panel).value; const b = $('[data-date="hasta"]', panel).value;
      if (a || b) applyDate(t, 'rango:' + (a || '') + '..' + (b || ''));
    }
  });
  function applyDate(el, val) {
    const fold = el.closest('.fold'); const which = fold.id.split('-').pop();
    if (which === 'v') { UI.billFecha = val; const b = BID[parseHash().parts[1]]; renderBillVotes(b); return; }
    setParams({ fecha: val });
  }

  document.addEventListener('change', (e) => {
    const t = e.target;
    if (t.matches('[data-filter]')) {
      const k = t.dataset.filter;
      if (t.type === 'checkbox') { const vals = $$('input[data-filter="' + k + '"]:checked').map((x) => x.value); setParams({ [k]: vals.join('|') }); }
      else setParams({ [k]: t.value });
    }
    if (t.matches('[data-param]')) setParams({ [t.dataset.param]: t.value === 'relevancia' ? '' : t.value });
    if (t.matches('[data-pparam]')) setParams({ [t.dataset.pparam]: t.value });
    if (t.matches('[data-dir]')) setParams({ [t.dataset.dir]: t.value });
    if (t.matches('[data-date="preset"]')) { UI.dateMode = null; applyDate(t, t.value); }
    if (t.matches('[data-date="mode"]')) {
      UI.dateMode = t.value; const fold = t.closest('.fold'); const which = fold.id.split('-').pop();
      if (which === 'v') { const b = BID[parseHash().parts[1]]; const wasOpen = true; UI.dateOpen = wasOpen; const holder = fold.parentNode; const tmp = document.createElement('div'); tmp.innerHTML = datePanel({ fecha: UI.billFecha && !PRESETS[UI.billFecha] ? UI.billFecha : '' }, 'v'); holder.replaceChild(tmp.firstChild, fold); $('#fold-fecha-v').classList.add('is-open'); renderBillVotes(b); }
      else { const r = parseHash(); const cur = r.params.fecha; const keep = cur && ((t.value === 'dia' && /^dia:/.test(cur)) || (t.value === 'rango' && /^rango:/.test(cur))); const holder = fold.parentNode; const tmp = document.createElement('div'); tmp.innerHTML = datePanel(Object.assign({}, r.params, { fecha: keep ? cur : '' }), which); holder.replaceChild(tmp.firstChild, fold); if (!keep && cur) setParams({ fecha: '' }); }
      const inp = $('#fold-fecha-' + fold.id.split('-').pop() + ' input[type="date"]'); if (inp) inp.focus();
    }
  });

  document.addEventListener('submit', (e) => {
    const f = e.target; if (!f.matches('[data-search]')) return;
    e.preventDefault();
    const q = (f.q ? f.q.value : ($('input', f) || {}).value || '').trim();
    const mode = f.dataset.search;
    if (mode === 'comuna') { go('#/comuna/' + encodeURIComponent(q)); return; }
    if (mode === 'comparar') { return; }
    if (mode === 'go') { const box = $('.suggest', f); const sel = box && $('[aria-selected="true"]', box); if (sel) { location.hash = sel.getAttribute('href'); return; } go(buildHash('buscar', [], { q })); }
    else if (mode === 'live') setParams({ q });
    else if (mode === 'proy') setParams({ q });
  });

  document.addEventListener('keydown', (e) => {
    const t = e.target;
    if (t.matches && t.matches('input[role="combobox"]')) {
      if (e.key === 'ArrowDown') { if (moveSuggest(t, 1)) e.preventDefault(); }
      else if (e.key === 'ArrowUp') { if (moveSuggest(t, -1)) e.preventDefault(); }
      else if (e.key === 'Escape') { const b = $('#' + t.id + '-sug'); if (b) b.hidden = true; t.setAttribute('aria-expanded', 'false'); }
    }
    if (e.key === 'Escape') {
      closeMenu();
      $$('.gl-btn[aria-expanded="true"]').forEach(closeGl);
    }
    if (e.key === '/' && !/input|textarea|select/i.test(document.activeElement.tagName)) { const i = $('#q-home, #q-buscar, #q-head'); if (i) { e.preventDefault(); i.focus(); } }
  });

  function closeGl(btn) { btn.setAttribute('aria-expanded', 'false'); const pop = document.getElementById(btn.getAttribute('aria-controls')); if (pop) pop.hidden = true; }

  document.addEventListener('click', (e) => {
    const box = e.target.closest('.suggest');
    if (!e.target.closest('.search')) $$('.suggest').forEach((s) => { s.hidden = true; });
    if (!e.target.closest('.gl')) $$('.gl-btn[aria-expanded="true"]').forEach(closeGl);
    if (box && e.target.closest('a')) box.hidden = true;
    const a = e.target.closest('[data-act]'); if (!a) return;
    const act = a.dataset.act;
    const route = parseHash();
    switch (act) {
      case 'clear-q': { const inp = $('input', a.closest('.search')); inp.value = ''; a.hidden = true; inp.focus(); inp.dispatchEvent(new Event('input', { bubbles: true })); break; }
      case 'clear-voter': { UI.voterQ = ''; const i = $('#q-voter'); i.value = ''; a.hidden = true; renderVoters(); i.focus(); break; }
      case 'menu': openMenu(a); break;
      case 'close-menu': closeMenu(); break;
      case 'back': if (navDepth > 0) history.back(); else go(route.name === 'autoridad' ? '#/autoridades' : route.name === 'votacion' ? '#/proyecto/' + (VOT[route.parts[1]] || {}).boletin : route.name === 'proyecto' ? '#/proyectos' : route.name === 'evento' || route.name === 'contrastar' ? '#/contrastar' : '#/'); break;
      case 'toggle-filters': { UI.filtersOpen = !UI.filtersOpen; a.setAttribute('aria-expanded', UI.filtersOpen); toggleFold($('#fold-filtros'), UI.filtersOpen); break; }
      case 'toggle-date': { UI.dateOpen = !(a.getAttribute('aria-expanded') === 'true'); a.setAttribute('aria-expanded', UI.dateOpen); toggleFold($('#fold-fecha-' + a.dataset.p), UI.dateOpen); break; }
      case 'unfilter': {
        const k = a.dataset.k; const v = a.dataset.v;
        if (route.name === 'proyecto' || k === 'fecha' && route.name === 'proyecto') { UI.billFecha = ''; renderBillVotes(BID[route.parts[1]]); break; }
        if (k === 'partido' && v) { const rest = (route.params.partido || '').split('|').filter((x) => x && x !== v); setParams({ partido: rest.join('|') }); }
        else setParams({ [k]: '' });
        syncFilterInputs(); break;
      }
      case 'unfilter-all': { const keep = { q: route.params.q || '', cat: route.params.cat || '' }; replaceHash(buildHash(route.name, route.parts.slice(1), keep)); if (route.name === 'buscar') { renderResults(parseHash()); syncFilterInputs(); } else render(); break; }
      case 'cat': setParams({ cat: a.dataset.cat === 'todos' ? '' : a.dataset.cat }, { animateInk: true }); if (!a.closest('.tabs')) { const r2 = $('#res-b'); if (r2) r2.scrollIntoView({ block: 'start' }); } break;
      case 'more': setParams({ n: String((+route.params.n || 10) + 10) }, { quiet: true }); break;
      case 'dir': setParams({ [a.dataset.k]: a.dataset.v }); break;
      case 'dir-more': setParams({ n: String((+route.params.n || 24) + 24) }); break;
      case 'ptab': {
        e.preventDefault();
        const p = PID[route.parts[1]]; const tab = a.dataset.tab;
        replaceHash('#/autoridad/' + p.id + (tab === 'perfil' ? '' : '/' + tab));
        $$('.profile-head .tab').forEach((x) => x.setAttribute('aria-selected', x.dataset.tab === tab));
        placeInk($('.profile-head'));
        const panel = $('#ptab-panel'); panel.innerHTML = '<div class="swap">' + profileTab(p, tab, personVotes(p)) + '</div>';
        if (a.closest('#ptab-panel')) panel.scrollIntoView({ block: 'start' });
        break;
      }
      case 'share': share(a.dataset.url, a.dataset.title); break;
      case 'share-here': share(location.hash || '#/', a.dataset.title); break;
      case 'ref': copyText(citaAPA(a.dataset.kind, a.dataset.id), /news|vote|bill|person|event/.test(a.dataset.kind) ? 'Cita en APA copiada' : 'Referencia copiada'); break;
      case 'gl': { const open = a.getAttribute('aria-expanded') !== 'true'; $$('.gl-btn[aria-expanded="true"]').forEach(closeGl); if (open) { a.setAttribute('aria-expanded', 'true'); const pop = document.getElementById(a.getAttribute('aria-controls')); pop.hidden = false; const r = a.getBoundingClientRect(); pop.classList.toggle('flip', r.left > innerWidth - 340); } break; }
      case 'to-votes': e.preventDefault(); $('#votaciones').scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); $('#votaciones').focus({ preventScroll: true }); break;
      case 'bill-cam': UI.billCam = a.dataset.v; $$('[data-act="bill-cam"]').forEach((x) => x.setAttribute('aria-pressed', x === a)); UI.billLim = 12; renderBillVotes(BID[route.parts[1]]); break;
      case 'bills-more': UI.billsLim = (UI.billsLim || 25) + 25; renderBills(route); break;
      case 'bill-more': UI.billLim = (UI.billLim || 12) + 12; renderBillVotes(BID[route.parts[1]]); break;
      case 'vview': UI.vview = a.dataset.v; $$('[data-act="vview"]').forEach((x) => x.setAttribute('aria-pressed', x === a)); renderVoters(); { const bx = $('#voters'); if (bx && bx.firstElementChild) bx.firstElementChild.classList.add('swap'); } break;
      case 'guia': { const g = UI.guia; g[GP[Math.min(g.step, GP.length - 1)].key] = a.dataset.v; g.step = g.editando ? GP.length : g.step + 1; g.editando = false; render(); break; }
      case 'guia-back': UI.guia.step = Math.max(0, UI.guia.step - 1); render(); break;
      case 'guia-edit': UI.guia.step = +a.dataset.i; UI.guia.editando = true; render(); break;
      case 'guia-reset': UI.guia = { step: 0 }; render(); break;
      case 'guia-start': UI.guia = { step: 0 }; break;
      case 'guardar': { const on = alternarCarpeta(a.dataset.kind, a.dataset.id); $$('[data-act="guardar"][data-kind="' + a.dataset.kind + '"][data-id="' + a.dataset.id + '"]').forEach((b) => pintarGuardar(b, on)); toast(on ? 'Guardado en tu carpeta' : 'Quitado de tu carpeta'); if (route.name === 'carpeta') render(); break; }
      case 'seguir': { const on = alternarSeguir(a.dataset.kind, a.dataset.id); pintarSeguir(a, on); toast(on ? 'Ahora lo sigues: verás sus novedades en el inicio' : 'Dejaste de seguirlo'); break; }
      case 'visto': marcarVisto(a.dataset.kind, a.dataset.id); render(); break;
      case 'carpeta-apa': copyText(carpeta().map((x) => citaAPA(x.k, x.id)).filter(Boolean).sort((p, q) => p.localeCompare(q, 'es')).join('\n\n'), 'Bibliografía copiada'); break;
      case 'carpeta-doc': descargarDoc(); break;
      case 'carpeta-csv': descargarCSVCarpeta(); break;
      case 'carpeta-link': copyText(absUrl('#/carpeta?c=' + encodeURIComponent(carpeta().map((x) => x.k.charAt(0) + ':' + x.id).join(','))), 'Enlace copiado: compártelo con tu grupo'); break;
      case 'carpeta-importar': { const r = parseHash(); (r.params.c || '').split(',').forEach((s) => { const [c, ...i] = s.split(':'); const k = KIND_C[c]; if (k && i.length && !enCarpeta(k, i.join(':'))) alternarCarpeta(k, i.join(':')); }); toast('Agregado a tu carpeta'); go('#/carpeta'); break; }
      case 'carpeta-vaciar': guardarCarpeta([]); render(); break;
      case 'csv-voto': descargarCSVVoto(a.dataset.id); break;
      case 'pv-mas': UI.pvLim += 40; { const p = PID[route.parts[1]]; $('#pv-box').innerHTML = bloqueVotosPersona(p, personVotes(p)); } break;
      case 'pv-dist': UI.pvDist = !UI.pvDist; UI.pvLim = 30; { const p = PID[route.parts[1]]; $('#pv-box').innerHTML = bloqueVotosPersona(p, personVotes(p)); } break;
      case 'kit-guardar': { const k = TEMA_ID[a.dataset.id]; kitItems(k).forEach(([kk, id]) => { if (!enCarpeta(kk, id)) alternarCarpeta(kk, id); }); toast('Kit guardado en tu carpeta'); break; }
    }
  });

  function placeInkAnimated(scope) { placeInk(scope, false); }
  function toggleFold(fold, open) {
    if (!fold) return;
    const inner = $('.fold-inner', fold);
    if (open) { inner.removeAttribute('inert'); fold.classList.add('is-open'); }
    else { fold.classList.remove('is-open'); inner.setAttribute('inert', ''); }
  }
  function syncFilterInputs() {
    const r = parseHash();
    $$('input[data-filter]').forEach((i) => { const k = i.dataset.filter; const cur = r.params[k] || ''; i.checked = i.type === 'checkbox' ? cur.split('|').includes(i.value) : i.value === cur; });
  }

  // Fotos que no cargan → avatar con iniciales
  document.addEventListener('error', (e) => {
    const img = e.target; if (!(img instanceof HTMLImageElement) || !img.dataset.ini) return;
    const s = document.createElement('span'); s.className = 'ph ' + (img.className || ''); s.style.width = img.width + 'px'; s.style.height = img.height + 'px'; s.textContent = img.dataset.ini; s.setAttribute('role', 'img'); s.setAttribute('aria-label', img.alt + ' (no disponible)');
    img.replaceWith(s);
  }, true);

  let navDepth = 0;
  window.addEventListener('hashchange', () => { navDepth++; const r = parseHash(); UI.billsLim = 25; if (r.name !== 'proyecto') { UI.billCam = null; UI.billFecha = ''; UI.billLim = 12; } if (r.name !== 'votacion') { UI.voterQ = ''; } if (r.name !== 'buscar' && r.name !== 'proyectos') { UI.dateMode = null; } render(); });
  window.addEventListener('resize', () => { placeInk(document, true); });

  // API para el asistente
  window.CONTRASTE_APP = { P, PID, NEWS, NEWSK, E, BILLS, BID, VOT, GLOS, esc, norm, uniq, icon, photoTag, fFecha, go, personVotes, OPC, CORTE, citaAPA, saveBtn, toast, enCarpeta, alternarCarpeta };

  render();
})();
