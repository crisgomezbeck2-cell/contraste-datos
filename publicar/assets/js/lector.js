/* Contraste · lector de fuentes.
   Abre los enlaces externos en un panel dentro del sitio, con pestañas internas. Muchos sitios prohíben mostrarse dentro de otra
   página: para esos el panel muestra la ficha de la fuente y un botón al original. También se puede elegir abrir siempre en pestaña nueva. */
(function () {
  'use strict';
  var A = window.CONTRASTE_APP; if (!A) return;
  var esc = A.esc, icon = A.icon;
  // Sitios cuyo encabezado de seguridad permite mostrarlos dentro de otra página (revisado el 5 de noviembre de 2026)
  var PERMITEN = ['biobiochile.cl', 'chilevision.cl', 'cnnchile.com', 'contrapoderchile.cl', 'cooperativa.cl', 'eldiariosantiago.cl', 'eldinamo.cl', 'elmostrador.cl', 'emol.com', 'estapasando.cl', 'infolobby.cl', 'infoprobidad.cl', 'latercera.com', 'miradiols.cl', 'municipalidadmaipu.cl', 'prensa-latina.cu', 'pschile.cl', 'senado.cl', 'theclinic.cl', 'tribunalcalificador.cl', 'commons.wikimedia.org'];
  ((window.CONTRASTE_ESTADO || {}).marcos || []).forEach(function (d) { if (PERMITEN.indexOf(d) < 0) PERMITEN.push(d); });
  var CLAVE = 'contraste_lector';
  var leer = function () { try { return JSON.parse(localStorage.getItem(CLAVE)) || {}; } catch (e) { return {}; } };
  var pref = function () { return leer().modo || 'panel'; };
  var guardarPref = function (m) { try { var o = leer(); o.modo = m; localStorage.setItem(CLAVE, JSON.stringify(o)); } catch (e) { /* navegación privada */ } };
  var panel = document.getElementById('lector');
  var tabs = []; var activa = -1;

  var dominio = function (u) { try { return new URL(u).hostname.replace(/^www\./, ''); } catch (e) { return ''; } };
  var permite = function (u) {
    if (!/^https:/.test(u)) return false;
    var d = dominio(u); if (d === 'tramitacion.senado.cl') return false;
    return PERMITEN.some(function (x) { return d === x || d.slice(-x.length - 1) === '.' + x; });
  };

  function dibujar() {
    if (activa < 0 || !tabs[activa]) { panel.hidden = true; document.body.classList.remove('con-lector'); panel.innerHTML = ''; return; }
    var t = tabs[activa]; var n = t.key && A.NEWSK[t.key]; var embebe = permite(t.url);
    panel.hidden = false; document.body.classList.add('con-lector');
    panel.innerHTML =
      '<div class="lc-tabs" role="tablist" aria-label="Fuentes abiertas">' + tabs.map(function (x, i) {
        return '<div class="lc-tab' + (i === activa ? ' on' : '') + '"><button type="button" role="tab" aria-selected="' + (i === activa) + '" data-lc="ir" data-i="' + i + '" title="' + esc(x.titulo) + '">' + esc(x.nombre) + '</button><button type="button" class="lc-x" data-lc="quitar" data-i="' + i + '" aria-label="Cerrar ' + esc(x.nombre) + '">' + icon('x', 14) + '</button></div>';
      }).join('') + '<button type="button" class="lc-cerrar" data-lc="cerrar" aria-label="Cerrar lector">' + icon('x', 20) + '</button></div>' +
      '<div class="lc-barra"><a class="btn btn-primary btn-sm" href="' + esc(t.url) + '" target="_blank" rel="noopener" data-directo="1">Abrir en pestaña nueva' + icon('ext', 16) + '</a>' +
      (n ? '<button type="button" class="btn btn-quiet btn-sm" data-act="ref" data-kind="news" data-id="' + n.key + '">' + icon('copy', 16) + 'Citar en APA</button>' + A.saveBtn('news', n.key) : '') +
      '<label class="lc-pref"><input type="checkbox" data-lc="pref"' + (pref() === 'pestana' ? ' checked' : '') + '> Abrir siempre en pestaña nueva</label></div>' +
      (embebe
        ? '<div class="lc-marco"><div class="lc-cargando">Cargando ' + esc(dominio(t.url)) + '… Si no aparece, usa «Abrir en pestaña nueva».</div><iframe title="' + esc(t.titulo) + '" src="' + esc(t.url) + '" referrerpolicy="no-referrer" sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-popups-to-escape-sandbox"></iframe></div>'
        : '<div class="lc-ficha"><span class="lc-medio">' + esc(n ? n.medio : dominio(t.url)) + (n ? ' · ' + esc(n.fecha) : '') + '</span><h2>' + esc(t.titulo) + '</h2>' + (n && n.resumen ? '<p>' + esc(n.resumen) + '</p>' : '') +
          '<a class="btn btn-primary" href="' + esc(t.url) + '" target="_blank" rel="noopener" data-directo="1">Leer en ' + esc(n ? n.medio : dominio(t.url)) + icon('ext', 16) + '</a>' +
          '<p class="meta">Este sitio no permite mostrarse dentro de otras páginas, así que se abre en una pestaña nueva. Tus otras fuentes siguen aquí.</p></div>');
  }

  function abrir(url, titulo, key) {
    var i = tabs.findIndex(function (x) { return x.url === url; });
    if (i < 0) {
      var nombre = (key && A.NEWSK[key] && A.NEWSK[key].medio) || dominio(url);
      tabs.push({ url: url, titulo: titulo || nombre, nombre: nombre, key: key });
      if (tabs.length > 8) tabs.shift();
      i = tabs.length - 1;
    }
    activa = i; dibujar();
  }

  document.addEventListener('click', function (e) {
    var a = e.target.closest && e.target.closest('a[target="_blank"]');
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button) return;
    if (a.dataset.directo || pref() === 'pestana') return;
    if (!/^https?:/.test(a.href)) return;
    e.preventDefault();
    var key = a.dataset.key; var t = (key && A.NEWSK[key] && A.NEWSK[key].titulo) || a.textContent.trim();
    abrir(a.href, t, key);
  }, false);

  panel.addEventListener('click', function (e) {
    var b = e.target.closest('[data-lc]'); if (!b) return;
    var q = b.dataset.lc;
    if (q === 'ir') { activa = +b.dataset.i; dibujar(); }
    else if (q === 'quitar') { tabs.splice(+b.dataset.i, 1); activa = Math.min(activa, tabs.length - 1); dibujar(); }
    else if (q === 'cerrar') { activa = -1; dibujar(); }
  });
  panel.addEventListener('change', function (e) {
    if (e.target.dataset.lc === 'pref') { guardarPref(e.target.checked ? 'pestana' : 'panel'); A.toast(e.target.checked ? 'Las fuentes se abrirán en una pestaña nueva' : 'Las fuentes se abrirán aquí mismo'); }
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && activa >= 0 && !document.querySelector('.sheet')) { activa = -1; dibujar(); } });
  window.CONTRASTE_LECTOR = { abrir: abrir };
})();
