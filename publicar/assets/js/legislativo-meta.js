/* Contraste · descripción editorial de los proyectos con seguimiento y decodificador de la base legislativa.
   Los estados y votaciones vienen de datos/legislativo.js, generado desde las fuentes oficiales. */
window.CONTRASTE_LEG_META = {
  '15805-07': {
    nombreCorto: 'Reglas de Uso de la Fuerza (RUF)', tema: 'Seguridad',
    claves: ['ruf', 'uso de la fuerza', 'reglas de uso', 'policías', 'fuerzas armadas', 'carabineros'],
    resumen: 'Mensaje presentado en abril de 2023 que establece normas generales sobre el uso de la fuerza para las policías y las Fuerzas Armadas. El 7 de octubre de 2026 la Cámara y el Senado aprobaron la propuesta de la comisión mixta.',
    relacionados: ['arrau', 'pvodanovic', 'walker', 'espinoza', 'macaya', 'provoste', 'kaiser', 'bassaletti', 'fries', 'jiles', 'hassler', 'schalper']
  },
  '18216-05': {
    nombreCorto: 'Reconstrucción Nacional y Desarrollo Económico y Social (megarreforma)', tema: 'Hacienda',
    claves: ['megarreforma', 'reconstrucción', 'reconstruccion nacional', 'impuesto de primera categoría', 'invariabilidad tributaria', 'reactivación'],
    resumen: 'Mensaje del Gobierno ingresado el 22 de abril de 2026. Según el Ministerio de Hacienda, rebaja gradualmente el impuesto de primera categoría del 27% al 23% hacia 2029, restablece la integración total del sistema tributario y crea un estatuto de invariabilidad tributaria para nuevos proyectos.',
    fuenteResumen: { titulo: 'Ministerio de Hacienda, 6 oct 2026', url: 'https://www.hacienda.cl/noticias-y-eventos/noticias/ministro-jorge-quiroz-nuestro-compromiso-es-perseverar-en-esta-hoja-de-ruta' },
    relacionados: ['quiroz', 'pvodanovic', 'walker', 'macaya', 'provoste', 'espinoza', 'kaiser', 'fries', 'jiles', 'hassler', 'schalper', 'bassaletti', 'mundaca']
  },
  '18389-04': {
    nombreCorto: 'Elección mutua en la admisión escolar', tema: 'Educación',
    claves: ['admisión escolar', 'sae', 'elección mutua', 'colegios', 'educación'],
    resumen: 'Mensaje que faculta a los establecimientos educacionales a implementar un mecanismo de elección mutua en el proceso de admisión escolar. La Cámara lo aprobó el 5 de agosto de 2026.',
    relacionados: ['bassaletti', 'fries', 'jiles', 'hassler', 'schalper']
  },
  '18524-05': {
    nombreCorto: 'Extensión del subsidio a la tasa hipotecaria (Ley N° 21.836)', tema: 'Vivienda',
    claves: ['subsidio hipotecario', 'tasa de interés', 'vivienda', 'créditos hipotecarios', 'ley 21.748', 'ley 21.836', 'fogaes'],
    resumen: 'Mensaje que extiende la vigencia y aumenta la cobertura de la Ley N° 21.748, que estableció un subsidio a la tasa de interés de créditos hipotecarios para viviendas nuevas. Se aprobó por unanimidad en ambas cámaras y se publicó como Ley N° 21.836 el 17 de agosto de 2026.',
    fuenteResumen: { titulo: 'Ley Chile, BCN', url: 'https://www.bcn.cl/leychile/navegar?idLey=21836' },
    relacionados: ['poduje', 'quiroz', 'bassaletti', 'macaya', 'provoste', 'espinoza', 'kaiser', 'pvodanovic', 'walker', 'fries', 'jiles', 'hassler', 'schalper']
  },
  '18525-06': {
    nombreCorto: 'Ajustes a la ley de seguridad municipal (Ley N° 21.802)', tema: 'Seguridad',
    claves: ['seguridad municipal', 'ley 21.802', 'municipios', 'inspectores municipales', 'prevención del delito'],
    resumen: 'Mensaje que modifica la Ley N° 21.802, publicada en febrero de 2026, que fortaleció el rol de las municipalidades en seguridad pública y prevención del delito. La Cámara lo aprobó el 18 de agosto de 2026.',
    fuenteResumen: { titulo: 'Ley Chile, BCN (Ley N° 21.802)', url: 'https://www.bcn.cl/leychile/navegar?idLey=21802' },
    relacionados: ['desbordes', 'bassaletti', 'fries', 'jiles', 'hassler', 'schalper']
  },
  '18314-07': {
    nombreCorto: 'Detención para ejecutar expulsiones administrativas (reforma constitucional)', tema: 'Migración',
    claves: ['expulsiones', 'migración', 'migrantes', 'detención', 'reforma constitucional'],
    resumen: 'Mensaje de reforma constitucional en materia de detención para ejecutar expulsiones administrativas. El 22 de septiembre de 2026 la Cámara lo rechazó en general: obtuvo 88 votos a favor, menos que los 4/7 que exige una reforma constitucional. El Ejecutivo insistió ante el Senado.',
    relacionados: ['bassaletti', 'fries', 'jiles', 'hassler', 'schalper']
  },
  '18702-05': {
    nombreCorto: 'Ley de Presupuestos 2027', tema: 'Presupuesto',
    claves: ['presupuesto', 'presupuestos 2027', 'ley de presupuestos', 'gasto público', 'recorte', 'dipres'],
    resumen: 'Proyecto de Ley de Presupuestos del Sector Público para 2027, ingresado por el ministro de Hacienda el 30 de septiembre de 2026. Revisa abajo su última etapa y las votaciones disponibles.',
    fuenteResumen: { titulo: 'Ministerio de Hacienda, 30 sep 2026', url: 'https://www.hacienda.cl/noticias-y-eventos/noticias/ministro-de-hacienda-jorge-quiroz-ingresa-proyecto-de-ley-de-presupuestos-2027' },
    relacionados: ['quiroz', 'macaya', 'provoste', 'orrego', 'mundaca', 'arrau']
  }
};

/* Decodifica la base compacta. Los votos individuales se arman solo cuando se necesitan, para que la página cargue rápido. */
window.CONTRASTE_LEG = (function () {
  var R = window.CONTRASTE_LEG_RAW; if (!R) return null;
  var CANON = {
    'Independientes': 'Independiente', 'Partido Por la Democracia': 'Partido por la Democracia', 'Partido Demócratas Chile': 'Demócratas',
    'Partido Comunista de Chile': 'Partido Comunista', 'Partido Socialista de Chile': 'Partido Socialista', 'Evolución Política': 'Evópoli',
    'Partido Radical de Chile': 'Partido Radical', 'Partido Radical Socialdemócrata': 'Partido Radical', 'Partido Demócrata Cristiano': 'Democracia Cristiana'
  };
  var canon = function (p) { return p ? (CANON[p] || p) : ''; };
  var partyAt = function (dip, fecha) {
    var m = dip && dip.m || [];
    for (var i = 0; i < m.length; i++) if (m[i][0] <= fecha && (!m[i][1] || fecha <= m[i][1])) return canon(m[i][2]);
    return '';
  };
  var INICIO = '2026-03-11';
  var partidoDe = function (k, fecha) {
    if (k.charAt(0) === 'D') return { p: partyAt(R.diputados[k], fecha) || 'Sin dato', pn: '' };
    var s = R.senadores[k] || {};
    return (fecha >= INICIO && s.p) ? { p: s.p, pn: 'vigente' } : { p: 'Sin dato a la fecha', pn: '' };
  };
  var indices = [];
  var indiceDe = function (r) {
    if (indices[r]) return indices[r];
    var o = {}; var ids = R.rosters[r]; for (var i = 0; i < ids.length; i++) o[ids[i]] = i;
    return (indices[r] = o);
  };
  var votaciones = {};
  Object.keys(R.votaciones).forEach(function (id) {
    var v = R.votaciones[id];
    var mc = (v.materia || '').replace(/^En votaci[oó]n,?\s*/i, '');
    if (mc) mc = mc.charAt(0).toUpperCase() + mc.slice(1);
    v.materiaCorta = mc ? (mc.length > 210 ? mc.slice(0, 200).replace(/\s+\S*$/, '') + '…' : mc) : (v.tipo === 'en general' ? 'Votación en general del proyecto' : v.tipo ? 'Votación ' + v.tipo + ' del proyecto' : 'Votación del proyecto');
    Object.defineProperty(v, 'votos', { configurable: true, enumerable: false, get: function () {
      var ids = R.rosters[v.r]; var a = [];
      for (var i = 0; i < ids.length; i++) { var q = partidoDe(ids[i], v.fecha); a.push({ id: ids[i], o: v.o.charAt(i), p: q.p, pn: q.pn }); }
      Object.defineProperty(v, 'votos', { value: a, enumerable: false });
      return a;
    } });
    votaciones[id] = v;
  });
  var diputados = {}; Object.keys(R.diputados).forEach(function (k) { diputados[k] = { nombre: R.diputados[k].n, militancias: R.diputados[k].m }; });
  var senadores = {}; Object.keys(R.senadores).forEach(function (k) { var s = R.senadores[k]; senadores[k] = { nombre: s.n, partidoVigente: s.p || '', region: s.reg || '' }; });
  return {
    consulta: R.consulta, proyectos: R.proyectos, votaciones: votaciones, diputados: diputados, senadores: senadores, meta: window.CONTRASTE_LEG_META,
    votoDe: function (v, k) { var i = indiceDe(v.r)[k]; return i === undefined ? '' : v.o.charAt(i); },
    partidoDe: partidoDe, roster: function (v) { return R.rosters[v.r]; }
  };
})();
