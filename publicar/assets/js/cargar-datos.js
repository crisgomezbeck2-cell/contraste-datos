/* Contraste · carga de datos.
   Los datos se actualizan solos en un repositorio aparte y este archivo los trae al abrir la página.
   Si ese servicio no responde, usa la copia incluida en el sitio. */
(function () {
  'use strict';
  var REMOTO = window.CONTRASTE_REMOTO || ''; // se define en config.js cuando la actualización diaria está activa
  var ESPERA = 6000;
  var DATOS = ['estado.js', 'personas.js', 'legislativo.js', 'noticias.js', 'fotos.js'];
  var FIJOS = ['assets/js/datos-autoridades.js', 'assets/js/legislativo-meta.js', 'assets/js/app.js', 'assets/js/asistente.js', 'assets/js/lector.js'];

  function cargar(src, ok, mal) {
    var s = document.createElement('script'); var hecho = false;
    var t = setTimeout(function () { if (!hecho) { hecho = true; s.remove(); mal && mal(); } }, ESPERA);
    s.src = src; s.async = false;
    s.onload = function () { if (hecho) return; hecho = true; clearTimeout(t); ok && ok(); };
    s.onerror = function () { if (hecho) return; hecho = true; clearTimeout(t); mal && mal(); };
    document.head.appendChild(s);
  }
  function fallo() {
    var m = document.getElementById('contenido');
    if (m) m.innerHTML = '<div class="page"><div class="wrap"><h1 class="h1">No pudimos cargar los datos</h1><p class="lede">Revisa tu conexión y recarga la página.</p></div></div>';
  }
  function serie(lista, i, fin) {
    if (i >= lista.length) return fin();
    cargar(lista[i], function () { serie(lista, i + 1, fin); }, fallo);
  }
  function datos(i) {
    if (i >= DATOS.length) return serie(FIJOS, 0, function () {});
    var local = 'datos/' + DATOS[i];
    var seguir = function () { datos(i + 1); };
    if (REMOTO && !window.__CONTRASTE_SOLO_LOCAL) {
      cargar(REMOTO + DATOS[i] + '?v=' + new Date().toISOString().slice(0, 13), seguir, function () { window.__CONTRASTE_SOLO_LOCAL = true; cargar(local, seguir, fallo); });
    } else cargar(local, seguir, fallo);
  }
  datos(0);
})();
