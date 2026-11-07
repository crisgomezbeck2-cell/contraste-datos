#!/usr/bin/env python3
"""Actualizador de Contraste.

Descarga las fuentes oficiales y de prensa, guarda lo nuevo en automatizacion/almacen y genera los
archivos que lee el sitio en publicar/datos. Corre solo todos los días (GitHub Actions) y también a mano.

Reglas:
- Nunca borra lo que ya tiene: si una fuente falla, se conserva la última versión buena y queda anotado en el estado.
- Ningún voto se edita a mano. Si los votos individuales no suman los totales oficiales, la votación lo advierte.

Uso: python automatizacion/actualizar.py [--sin-noticias] [--sin-tramites] [--gnews N]
"""
import argparse, collections, datetime, html, json, pathlib, re, sys, time, unicodedata
import xml.etree.ElementTree as ET
from email.utils import parsedate_to_datetime
from playwright.sync_api import sync_playwright

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ALM = RAIZ / "automatizacion" / "almacen"
SAL = RAIZ / "publicar" / "datos"
ALM.mkdir(parents=True, exist_ok=True); SAL.mkdir(parents=True, exist_ok=True)

UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36"
NS = {"c": "http://opendata.camara.cl/camaradiputados/v1"}
W = "https://opendata.camara.cl/camaradiputados/WServices"
SB = "https://web-back.senado.cl/api"
TR = "https://tramitacion.senado.cl/appsenado/index.php"
INICIO_PERIODO = "2026-03-11"
LEGISLATURAS_SENADO = [507, 505, 504, 503]  # 374 completa; las anteriores solo para los proyectos con seguimiento
CURADOS = ["15805-07", "18216-05", "18389-04", "18524-05", "18525-06", "18314-07", "18702-05"]
HOY = datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=-3))).date().isoformat()

def cargar(nombre, defecto):
    f = ALM / nombre
    return json.loads(f.read_text(encoding="utf-8")) if f.exists() else defecto

def guardar(nombre, datos):
    (ALM / nombre).write_text(json.dumps(datos, ensure_ascii=False, indent=0, sort_keys=True), encoding="utf-8")

def nrm(t):
    t = unicodedata.normalize("NFD", t or "").encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z0-9 ]+", " ", t).strip()

def limpio(t):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", t or ""))).strip()

def titulo_propio(t):
    menores = {"de", "del", "la", "las", "los", "el", "y", "e", "en"}
    p = [(w if w in menores and i else w.capitalize()) for i, w in enumerate(t.lower().split())]
    return " ".join(p)

EXTRA = json.loads((RAIZ / "automatizacion" / "autoridades_extra.json").read_text(encoding="utf-8"))
ESTADO = {"fuentes": {}}
def anotar(fuente, ok, n=None, nota=""):
    ESTADO["fuentes"][fuente] = {"ok": bool(ok), "n": n, "nota": nota[:160], "cuando": HOY}
    print(("OK   " if ok else "FALLA"), fuente, n if n is not None else "", nota[:120], flush=True)

class Red:
    def __init__(self, pw):
        self.api = pw.request.new_context(extra_http_headers={"User-Agent": UA})
    def get(self, url, reintentos=3, espera=1.5, timeout=90000):
        ultimo = None
        for i in range(reintentos):
            try:
                r = self.api.get(url, timeout=timeout)
                if r.status == 200:
                    b = r.body()
                    try: return b.decode("utf-8")
                    except UnicodeDecodeError: return b.decode("iso-8859-1")
                ultimo = "HTTP %s" % r.status
                if r.status in (403, 404): break
            except Exception as e:
                ultimo = str(e).splitlines()[0][:120]
            time.sleep(espera * (i + 1))
        raise RuntimeError("%s: %s" % (url[:90], ultimo))
    def xml(self, url):
        return ET.fromstring(self.get(url))

# ---------------------------------------------------------------- Cámara
OPC = {"Afirmativo": "A", "En Contra": "C", "Abstención": "B", "Abstencion": "B", "Dispensado": "D", "No Vota": "N", "Pareo": "P"}
RES = {"Aprobado": "Aprobado", "Rechazado": "Rechazado", "Empate": "Empate", "Sin Quórum": "Sin quórum", "Sin Resultado": "Sin resultado"}
TIPO_C = {"Única": "única", "General": "en general", "Particular": "en particular"}

def camara(red):
    vot = cargar("votos_camara.json", {}); pro = cargar("proyectos.json", {}); cant_prev = len(vot)
    anual = {}; pendientes = collections.defaultdict(set)
    anio = int(HOY[:4])
    for y in range(2023, anio + 1):
        for v in red.xml(f"{W}/WSLegislativo.asmx/retornarVotacionesXAnno?prmAnno={y}"):
            g = lambda t: v.findtext("c:" + t, namespaces=NS) or ""
            vid = g("Id"); anual[vid] = g("Resultado")
            m = re.search(r"(\d+-\d+)", g("Descripcion"))
            if not m: continue
            bol = m.group(1)
            if g("Tipo") == "Proyecto de Ley" and (g("Fecha")[:10] >= INICIO_PERIODO or bol in CURADOS) and ("C" + vid) not in vot:
                pendientes[bol].add(vid)
    for b in CURADOS: pendientes.setdefault(b, set())
    ses = []
    for y in range(2023, anio + 1):
        for s in red.xml(f"{W}/WSSala.asmx/retornarSesionesXAnno?prmAnno={y}").findall("c:Sesion", NS):
            ses.append((s.findtext("c:FechaInicio", namespaces=NS) or "", s.findtext("c:FechaTermino", namespaces=NS) or "", s.findtext("c:Numero", namespaces=NS), s.findtext("c:Tipo", namespaces=NS) or ""))
    def sesion_de(fh):
        mejor = None
        for ini, fin, num, tipo in ses:
            if ini[:10] != fh[:10]: continue
            f2 = fin or ini[:10] + "T23:59:59"
            if ini[:19] <= fh[:19] <= f2[:19]: return f"Sesión {num}ª, {tipo.lower()}"
            if fh[:19] > f2[:19] and not mejor: mejor = f"Sesión {num}ª, {tipo.lower()}"
        return mejor or ""
    for bol, ids in sorted(pendientes.items()):
        try:
            x = red.xml(f"{W}/WSLegislativo.asmx/retornarProyectoLey?prmNumeroBoletin={bol}")
        except Exception as e:
            print("  sin proyecto", bol, e); continue
        g = lambda t: (x.findtext("c:" + t, namespaces=NS) or "").strip()
        p = pro.setdefault(bol, {})
        p.update({"titulo": g("Nombre") or p.get("titulo", ""), "ingreso": g("FechaIngreso")[:10], "iniciativa": g("TipoIniciativa"), "origen": g("CamaraOrigen"),
                  "ministerios": [m.findtext("c:Nombre", namespaces=NS) for m in x.findall("c:MinisteriosPatrocinantes/c:Ministerio", NS)], "idCamara": g("Id")})
        for v in x.findall("c:Votaciones/c:VotacionProyectoLey", NS):
            gv = lambda t: (v.findtext("c:" + t, namespaces=NS) or "").strip()
            vid = gv("Id"); clave = "C" + vid
            if clave in vot or (gv("Fecha")[:10] < INICIO_PERIODO and bol not in CURADOS): continue
            try:
                det = red.xml(f"{W}/WSLegislativo.asmx/retornarVotacionDetalle?prmVotacionID={vid}")
            except Exception as e:
                print("  sin detalle", vid, e); continue
            votos = [[vo.findtext("c:Diputado/c:Id", namespaces=NS), OPC.get(vo.findtext("c:OpcionVoto", namespaces=NS), "?")] for vo in det.findall("c:Votos/c:Voto", NS)]
            if not votos: continue
            ent = lambda t: int(gv(t) or 0)
            vot[clave] = {"id": clave, "boletin": bol, "camara": "Cámara de Diputadas y Diputados", "fecha": gv("Fecha")[:10], "hora": gv("Fecha")[11:16],
                          "sesion": sesion_de(gv("Fecha")), "tramite": gv("TramiteConstitucional"), "informe": gv("TramiteReglamentario"),
                          "tipo": TIPO_C.get(gv("TipoVotacionProyectoLey"), gv("TipoVotacionProyectoLey").lower()), "materia": re.sub(r"\s+", " ", gv("Articulo"))[:600],
                          "quorum": gv("Quorum"), "resultado": RES.get(anual.get(vid), anual.get(vid) or ("Rechazado" if gv("Resultado") == "Unánime" else gv("Resultado"))),
                          "totales": {"si": ent("TotalSi"), "no": ent("TotalNo"), "abst": ent("TotalAbstencion"), "disp": ent("TotalDispensado")},
                          "url": f"https://www.camara.cl/legislacion/sala_sesiones/votacion_detalle.aspx?prmIdVotacion={vid}", "votos": votos}
        guardar("votos_camara.json", vot); guardar("proyectos.json", pro)
    anotar("camara_votaciones", True, len(vot), f"{len(vot) - cant_prev} nuevas")
    return vot, pro

def diputados(red, navegador):
    per = cargar("personas.json", {"diputados": {}, "senadores": {}})
    x = red.xml(f"{W}/WSDiputado.asmx/retornarDiputadosPeriodoActual")
    vistos = set()
    for d in x.findall("c:DiputadoPeriodo", NS):
        dip = d.find("c:Diputado", NS)
        g = lambda t: (dip.findtext("c:" + t, namespaces=NS) or "").strip()
        did = g("Id"); vistos.add(did)
        mil = [[(m.findtext("c:FechaInicio", namespaces=NS) or "")[:10], (m.findtext("c:FechaTermino", namespaces=NS) or "")[:10], m.findtext("c:Partido/c:Nombre", namespaces=NS) or ""] for m in dip.findall("c:Militancias/c:Militancia", NS)]
        e = per["diputados"].setdefault(did, {})
        e.update({"n": " ".join(filter(None, [g("Nombre"), g("Nombre2"), g("ApellidoPaterno"), g("ApellidoMaterno")])), "corto": (g("Nombre") + " " + g("ApellidoPaterno")).strip(),
                  "sexo": "F" if g("Sexo").startswith("Fem") else "M", "m": sorted(mil), "vigente": True})
    for did, e in per["diputados"].items():
        if did not in vistos: e["vigente"] = False
    if len(vistos) < 150: raise RuntimeError("la nómina de diputados vino incompleta: %d" % len(vistos))
    anotar("camara_diputados", True, len(vistos))
    # distrito y región: solo los publica el listado de camara.cl
    try:
        pg = navegador.new_context(user_agent=UA, locale="es-CL").new_page()
        r = pg.goto("https://www.camara.cl/diputados/diputados.aspx", timeout=60000, wait_until="domcontentloaded"); pg.wait_for_timeout(2500)
        h = pg.content()
        if not r or r.status != 200: raise RuntimeError("HTTP %s" % (r.status if r else "?"))
        n = 0
        for art in re.findall(r"<article[^>]*>(.*?)</article>", h, re.S):
            m = re.search(r"mociones\.aspx\?prmID=(\d+)", art)
            dm = re.search(r"Distrito:\s*N[º°]\s*(\d+)", art)
            rg = re.search(r"Regi[oó]n:\s*([^<]+)", art)
            pa = re.search(r"Partido:\s*([^<]+)", art)
            if not (m and dm): continue
            did = m.group(1)
            if did in per["diputados"]:
                per["diputados"][did].update({"dist": int(dm.group(1)), "reg": limpio(rg.group(1)) if rg else "", "partidoActual": limpio(pa.group(1)) if pa else ""}); n += 1
            cargo = re.findall(r"<p>\s*([^<]*?(?:Presidente|Presidenta|Vicepresident[ea]s?)[^<]*?)\s*</p>", art)
            if cargo and did in per["diputados"]: per["diputados"][did]["mesa"] = limpio(cargo[0])
        anotar("camara_distritos", n >= 150, n)
        pg.context.close()
    except Exception as e:
        anotar("camara_distritos", False, None, str(e))
    guardar("personas.json", per)
    return per

def territorio(red):
    # Comunas por distrito vigente (Ley 20.840, 28 distritos). El servicio retornarDistritos entrega los 60 distritos antiguos, así que no se usa.
    com = json.loads((RAIZ / "automatizacion" / "comunas.json").read_text(encoding="utf-8"))
    anotar("comunas", len(com) == 346, len(com))
    return {"comunas": com}

# ---------------------------------------------------------------- Senado
SEN_PARTY = {"P.S.": "Partido Socialista", "P.P.D.": "Partido por la Democracia", "R.N.": "Renovación Nacional", "U.D.I.": "Unión Demócrata Independiente", "P.D.C.": "Democracia Cristiana", "D.C.": "Democracia Cristiana",
             "P.C": "Partido Comunista", "P.C.": "Partido Comunista", "Evópoli": "Evópoli", "EVOP": "Evópoli", "Frente Amplio": "Frente Amplio", "F.A.": "Frente Amplio", "Nacional Libertario": "Partido Nacional Libertario", "P.N.L.": "Partido Nacional Libertario",
             "Independiente": "Independiente", "IND": "Independiente", "Ind.": "Independiente", "Liberal": "Partido Liberal de Chile", "P.L.": "Partido Liberal de Chile", "Republicano": "Partido Republicano", "P. Republicano": "Partido Republicano", "REP": "Partido Republicano", "F.R.E.V.S.": "Federación Regionalista Verde Social", "Demócratas": "Demócratas", "P.D.G.": "Partido de la Gente", "P.R.": "Partido Radical"}

def senadores(red, per):
    try:
        t = red.get("https://www.senado.cl/senadoras-y-senadores/listado-de-senadoras-y-senadores")
        nd = json.loads(re.search(r'__NEXT_DATA__"[^>]*>(.*?)</script>', t, re.S).group(1))
        lista = None
        def buscar(o):
            nonlocal lista
            if lista is not None: return
            if isinstance(o, dict):
                for k, v in o.items():
                    if k == "parlamentarios" and isinstance(v, dict) and isinstance(v.get("data"), list): lista = v["data"]; return
                    buscar(v)
            elif isinstance(o, list):
                for v in o: buscar(v)
        buscar(nd["props"]["pageProps"])
        if not lista or len(lista) < 45: raise RuntimeError("nómina incompleta")
        vistos = set()
        for s in lista:
            k = str(s["ID_PARLAMENTARIO"]); vistos.add(k)
            per["senadores"][k] = {"n": s["NOMBRE_COMPLETO"], "corto": s.get("NOMBRE_COMPLETO_CORTO") or s["NOMBRE_COMPLETO"], "slug": s["SLUG"], "p": SEN_PARTY.get(s.get("PARTIDO"), s.get("PARTIDO") or ""), "pOrig": s.get("PARTIDO"),
                                   "reg": s.get("REGION", ""), "regId": s.get("REGION_ID"), "circ": s.get("CIRCUNSCRIPCION_ID"), "mail": s.get("EMAIL", ""), "fono": s.get("FONO", ""), "sexo": "F" if s.get("SEXO") == 1 else "M", "vigente": True}
        for k, e in per["senadores"].items():
            if k not in vistos: e["vigente"] = False
        guardar("personas.json", per); anotar("senado_nomina", True, len(vistos))
    except Exception as e:
        anotar("senado_nomina", False, None, str(e))
    return per

def senado(red, per):
    vot = cargar("votos_senado.json", {}); prev = len(vot); errores = 0; ultimo_error = ""
    for leg in LEGISLATURAS_SENADO:
        off = 0
        while True:
            try:
                d = json.loads(red.get(f"{SB}/votes?id_legislatura={leg}&limit=200&offset={off}&palabra_clave=&desde=&hasta="))["data"]
            except Exception as e:
                errores += 1; ultimo_error = str(e); print("  senado", leg, off, e); break
            filas = d.get("data") or []
            if not filas: break
            for v in filas:
                bol = (v.get("BOLETIN") or "").strip()
                if not bol or (leg != LEGISLATURAS_SENADO[0] and bol not in CURADOS): continue
                clave = "S" + str(v["ID_VOTACION"])
                if clave in vot: continue
                f = v["FECHA_VOTACION"]; iso = f[6:10] + "-" + f[3:5] + "-" + f[:2]
                L = v.get("VOTACIONES") or {}
                votos = []
                for campo, cod in (("SI", "A"), ("NO", "C"), ("ABSTENCION", "B"), ("PAREO", "P")):
                    for s in (L.get(campo) or []):
                        pid = str(s["PARLID"]); votos.append([pid, cod])
                        if pid not in per["senadores"]:
                            per["senadores"][pid] = {"n": " ".join(filter(None, [s.get("NOMBRE"), s.get("APELLIDO_PATERNO"), s.get("APELLIDO_MATERNO")])), "slug": s.get("SLUG"), "vigente": False}
                if not votos: continue
                vot[clave] = {"id": clave, "boletin": bol, "camara": "Senado", "fecha": iso, "hora": f[11:16], "sesion": "Sesión %sª" % v.get("NUMERO_SESION"), "tramite": "", "informe": "", "tipo": "",
                              "materia": re.sub(r"^[\s\-–]+", "", re.sub(r"\s+", " ", v.get("TEMA") or ""))[:600], "quorum": v.get("QUORUM") or "", "resultado": "",
                              "totales": {"si": int(v.get("SI") or 0), "no": int(v.get("NO") or 0), "abst": int(v.get("ABS") or 0), "pareo": int(v.get("PAREO") or 0)},
                              "url": f"https://tramitacion.senado.cl/appsenado/templates/tramitacion/index.php?boletin_ini={bol}",
                              "fuenteDatos": "https://www.senado.cl/actividad-legislativa/sala/votaciones", "votos": votos}
            off += len(filas)
            if off >= int(d.get("total") or 0): break
    guardar("votos_senado.json", vot); guardar("personas.json", per)
    anotar("senado_votaciones", errores == 0, len(vot), f"{len(vot) - prev} nuevas" + (" · " + ultimo_error if ultimo_error else ""))
    return vot

def tramites(red, pro, vot_c, vot_s, solo_cambios=True):
    ult = collections.defaultdict(str)
    for v in list(vot_c.values()) + list(vot_s.values()): ult[v["boletin"]] = max(ult[v["boletin"]], v["fecha"])
    bols = sorted(set(ult) | set(CURADOS)); n = fall = 0
    try:
        red.get(f"{TR}?mo=tramitacion&ac=datos_proy&nboletin=15805-07", reintentos=1)
        anotar("senado_tramitacion_prueba", True)
    except Exception as e:
        anotar("senado_tramitacion_prueba", False, None, str(e))
    for b in bols:
        p = pro.setdefault(b, {})
        reciente = ult[b] >= (datetime.date.fromisoformat(HOY) - datetime.timedelta(days=21)).isoformat()
        if p.get("tramVisto") == HOY or (solo_cambios and p.get("tramVisto") and not reciente and b not in CURADOS and p.get("tramVisto") >= (datetime.date.fromisoformat(HOY) - datetime.timedelta(days=14)).isoformat()):
            continue
        try:
            t = red.get(f"{TR}?mo=tramitacion&ac=datos_proy&nboletin={b}", reintentos=2)
            m = re.search(r"proyid=(\d+)", t)
            cel = lambda et: (lambda x: limpio(x.group(1)) if x else "")(re.search(et + r"\s*:?\s*</?[^>]*>.*?<td[^>]*>(.*?)</td>", t, re.S | re.I))
            tx = limpio(t)
            cam = lambda et, fin: (lambda x: x.group(1).strip() if x else "")(re.search(et + r"\s*:\s*(.*?)\s*(?:" + fin + r")", tx))
            p.update({"tituloSenado": cam("Título", "Fecha de Ingreso"), "urgencia": cam("Urgencia Actual", "Cámara de Origen|Camara de Origen"), "etapa": cam("Etapa", "Link para|Subetapa|$"), "leynro": cam("Ley N[º°]?", "Fecha|Etapa|Diario") if "Ley N" in tx else p.get("leynro", ""), "tramVisto": HOY})
            if not p.get("titulo") and p.get("tituloSenado"): p["titulo"] = p["tituloSenado"]
            if not p.get("ingreso"):
                ff = re.search(r"Fecha de Ingreso\s*:\s*\w+ (\d+) de (\w+), (\d{4})", tx)
                MES = {"enero":1,"febrero":2,"marzo":3,"abril":4,"mayo":5,"junio":6,"julio":7,"agosto":8,"septiembre":9,"octubre":10,"noviembre":11,"diciembre":12}
                if ff: p["ingreso"] = "%s-%02d-%02d" % (ff.group(3), MES.get(ff.group(2).lower(), 1), int(ff.group(1)))
            if not p.get("origen"): p["origen"] = "Cámara de Diputados" if "C.Diputados" in tx[:3000] else ("Senado" if re.search(r"Cámara de Origen:\s*Senado", tx) else "")
            if not p.get("iniciativa"): p["iniciativa"] = cam("Iniciativa", "Tipo de Proyecto")
            if m:
                c = "D" if b.split("-")[0] else "S"
                th = red.get(f"{TR}?mo=tramitacion&ac=tramites&proyid={m.group(1)}&camara={c}&boletin={b}", reintentos=2)
                filas = []
                for fila in re.findall(r"<tr[^>]*>(.*?)</tr>", th, re.S):
                    cs = [limpio(x) for x in re.findall(r"<td[^>]*>(.*?)</td>", fila, re.S)]
                    if len(cs) >= 4 and re.match(r"\d{2}/\d{2}/\d{4}", cs[1]):
                        f = cs[1]; filas.append({"f": f[6:10] + "-" + f[3:5] + "-" + f[:2], "t": cs[2].rstrip(" ."), "e": cs[3], "s": cs[0]})
                if filas:
                    p["tramites"] = filas; u = filas[-1]
                    p["ultimoTramite"] = {"iso": u["f"], "descripcion": u["t"], "etapa": u["e"]}
            n += 1
        except Exception as e:
            fall += 1; print("  tramitación", b, str(e)[:100])
        if n % 10 == 0: guardar("proyectos.json", pro)
        time.sleep(0.15)
    guardar("proyectos.json", pro)
    anotar("senado_tramitacion", fall < max(5, len(bols) * .2), n, f"{fall} sin respuesta")
    return pro

# ---------------------------------------------------------------- Noticias
FEEDS = {
    "BioBioChile": ("json", "https://www.biobiochile.cl/lista/api/get-todo?limit=100"),
    "Cooperativa": ("rss", "https://www.cooperativa.cl/noticias/site/tax/port/all/rss_3___1.xml"),
    "La Tercera": ("rss", "https://www.latercera.com/arc/outboundfeeds/rss/?outputType=xml"),
    "Ex-Ante": ("rss", "https://www.ex-ante.cl/feed/"),
    "CIPER": ("rss", "https://www.ciperchile.cl/feed/"),
    "The Clinic": ("rss", "https://www.theclinic.cl/feed/"),
    "CNN Chile": ("rss", "https://www.cnnchile.com/feed/"),
    "El Ciudadano": ("rss", "https://www.elciudadano.com/feed/"),
    "El Desconcierto": ("rss", "https://www.eldesconcierto.cl/feed/"),
    "Radio U. de Chile": ("rss", "https://radio.uchile.cl/feed/"),
    "Interferencia": ("rss", "https://interferencia.cl/feed"),
    "El País Chile": ("rss", "https://feeds.elpais.com/mrss-s/pages/ep/site/elpais.com/section/chile/portada"),
}
TEMAS_N = [("Presupuesto", r"presupuest|partida|dipres"), ("Seguridad", r"seguridad|delincu|crimen|carabiner|polic[ií]a|homicid|narco|rufs?\b|uso de la fuerza|fiscal[ií]a"), ("Migración", r"migra|expuls|frontera"),
           ("Educación", r"educaci|colegio|escolar|universidad|gratuidad|\bcae\b|\bfes\b"), ("Salud", r"salud|hospital|isapre|fonasa|listas? de espera"), ("Vivienda", r"vivienda|campamento|hipotecari|subsidio habitacional|reconstrucci"),
           ("Hacienda", r"impuesto|tributar|megarreforma|hacienda|royalty|econom[ií]a"), ("Trabajo", r"pension|trabajo|salario|sueldo|sindica|empleo"), ("Medio ambiente", r"ambient|clim[aá]t|incendio|forestal|agua\b"),
           ("Probidad", r"corrupci|querella|investigaci[oó]n|fraude|desafuero|probidad|acusaci[oó]n"), ("Política", r"partido|elecci|campa[nñ]a|gabinete|oposici[oó]n|oficialismo|bancada|senador|diputad|ministr")]

def tema_de(t):
    n = t.lower()
    for tema, rx in TEMAS_N:
        if re.search(rx, n): return tema
    return "Otros"

def iso_fecha(s):
    try:
        d = parsedate_to_datetime(s); return d.astimezone(datetime.timezone(datetime.timedelta(hours=-3))).date().isoformat()
    except Exception:
        m = re.match(r"(\d{4}-\d{2}-\d{2})", s or ""); return m.group(1) if m else ""

POLITICA = re.compile(r"diputad|senador|ministr|gobiern|presidente|kast|bancada|proyecto|\bley\b|presupuesto|comisi[oó]n|partido|congreso|c[aá]mara|senado|regional|gobernador|alcald|seremi|fiscal[ií]a|oposici|oficialismo|cr[ií]tic|acus|solicit|interpel|votaci|chile|seguridad|reforma|elecci|candidat|\b(ps|ppd|rn|udi|pc|fa|pdg|pnl|dc)\b", re.I)
RUIDO = {"VAVEL.com", "VAVEL", "ESPN", "Olé", "TyC Sports", "Transfermarkt", "BeSoccer", "IMDb", "Goal.com", "Bolavip Chile", "Redgol", "En Cancha"}
ROLES = re.compile(r"diputad|senador|ministr|gobernador|bancada|parlamentari|\((ps|ppd|rn|udi|pc|fa|pdg|pnl|dc|evopoli|rep|republican\w*)\)", re.I)

def titular_valido(titulo, medio, corto):
    # Evita homónimos: el titular debe traer el nombre completo o el apellido junto a su cargo, y hablar de política
    if medio in RUIDO: return False
    n = " " + nrm(titulo) + " "
    c = nrm(corto)
    if not POLITICA.search(titulo): return False
    if " " + c + " " in n: return True
    return (" " + c.split()[-1] + " ") in n and bool(ROLES.search(titulo))

def resolver_google(red, alm, cuota):
    # Convierte el enlace de Google Noticias en el enlace real del medio, para citar y abrir la fuente original
    from urllib.parse import urlencode
    n = fall = 0
    for k, v in alm.items():
        if n >= cuota or fall >= 8: break
        if "news.google.com" not in v["u"]: continue
        try:
            i = re.search(r"articles/([^?]+)", v["u"]).group(1)
            t = red.get("https://news.google.com/rss/articles/" + i + "?oc=5", reintentos=1, timeout=30000)
            sg = re.search(r'data-n-a-sg="([^"]+)"', t); ts = re.search(r'data-n-a-ts="([^"]+)"', t)
            if not (sg and ts): fall += 1; continue
            interno = json.dumps(["garturlreq", [["X", "X", ["X", "X"], None, None, 1, 1, "US:en", None, 1, None, None, None, None, None, 0, 1], "X", "X", 1, [1, 1, 1], 1, 1, None, 0, 0, None, 0], i, int(ts.group(1)), sg.group(1)], separators=(",", ":"))
            cuerpo = urlencode({"f.req": json.dumps([[["Fbv4je", interno, None, "generic"]]], separators=(",", ":"))})
            r = red.api.post("https://news.google.com/_/DotsSplashUi/data/batchexecute", headers={"Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"}, data=cuerpo, timeout=30000)
            m = re.search(r'garturlres\\",\\"(https?:[^\\"]+)', r.body().decode("utf-8", "replace"))
            if m: v["u"] = m.group(1); v["f"] = "gnews+"; n += 1; fall = 0
            else: fall += 1
            time.sleep(0.5)
            if n % 50 == 0: guardar("noticias.json", alm)
        except Exception as e:
            fall += 1; time.sleep(3)
    faltan = sum(1 for v in alm.values() if "news.google.com" in v["u"])
    anotar("enlaces_directos", fall < 8, n, f"{faltan} pendientes")
    return alm

def permiten_marco(red, alm):
    # Revisa qué sitios permiten mostrarse dentro de otra página, para abrirlos en el lector interno
    from urllib.parse import urlparse
    mem = cargar("marcos.json", {})
    por = {}
    for v in alm.values():
        if "news.google.com" in v["u"]: continue
        por.setdefault(urlparse(v["u"]).netloc.replace("www.", ""), v["u"])
    nuevos = [d for d in por if d not in mem][:80]
    for d in nuevos:
        try:
            r = red.api.get(por[d], timeout=20000); h = r.headers
            xfo = (h.get("x-frame-options") or "").strip(); csp = h.get("content-security-policy") or ""
            fa = re.search(r"frame-ancestors[^;]*", csp)
            mem[d] = r.status == 200 and not xfo and not (fa and "*" not in fa.group(0)) and por[d].startswith("https")
        except Exception:
            mem[d] = False
    guardar("marcos.json", mem)
    ESTADO["marcos"] = sorted(d for d, ok in mem.items() if ok)
    anotar("sitios_lector", True, len(ESTADO["marcos"]))

def noticias(red, per, extra_personas, gnews_cuota, resolver_cuota=150):
    alm = cargar("noticias.json", {})
    prev = len(alm)
    # nombres que se buscan: nombre + apellido paterno, y nombre completo
    claves = []
    for k, e in per["diputados"].items():
        if e.get("vigente"): claves.append(("d" + k, e))
    for k, e in per["senadores"].items():
        if e.get("vigente"): claves.append(("s" + k, e))
    for x in extra_personas: claves.append((x["id"], {"n": x["nombre"], "corto": x.get("corto") or x["nombre"]}))
    # Si dos personas comparten el nombre corto (el Presidente Kast y su hijo diputado), solo vale el nombre completo
    rep_corto = collections.Counter(nrm(e.get("corto") or e.get("n") or "") for _, e in claves)
    formas = []
    for pid, e in claves:
        corto = nrm(e.get("corto") or "")
        cs = {nrm(e.get("n") or "")} | ({corto} if rep_corto[corto] < 2 else set())
        formas.append((pid, [c for c in cs if len(c.split()) >= 2]))
    corto_de = {pid: (e.get("corto") or e.get("n")) for pid, e in claves}
    # limpieza de lo ya guardado con la regla contra homónimos
    for k in list(alm):
        v = alm[k]
        if v.get("f", "").startswith("gnews"):
            v["p"] = [q for q in v["p"] if q not in corto_de or titular_valido(v["t"], v["m"], corto_de[q])]
            if not v["p"]: del alm[k]
    def quienes(texto):
        s = " " + nrm(texto) + " "
        return [pid for pid, fs in formas if any(" " + f + " " in s for f in fs)]
    def meter(url, titulo, medio, fecha, resumen, fuente):
        if not (url and titulo and fecha): return
        ps = quienes(titulo + " " + (resumen or ""))
        if not ps: return
        k = re.sub(r"[?#].*$", "", url)[-180:]
        if k in alm:
            alm[k]["p"] = sorted(set(alm[k]["p"]) | set(ps)); return
        alm[k] = {"t": titulo[:220], "m": medio, "u": url, "d": fecha, "r": (resumen or "")[:240], "p": ps, "te": tema_de(titulo + " " + (resumen or "")), "f": fuente}
    # Vigilancia del gabinete: si la prensa informa un cambio, el sitio avisa hasta que se revise la lista a mano
    GAB = re.compile(r"cambio de gabinete|nuev[oa] ministr|asume como ministr|asumi[oó] como ministr|renuncia? (de la |del )?ministr|renunci[oó] (la |el )?ministr|sale del gabinete", re.I)
    vistos_gab = []
    def vigilar(ti, medio, url, fecha):
        if ti and url and fecha and fecha >= (datetime.date.fromisoformat(HOY) - datetime.timedelta(days=10)).isoformat() and GAB.search(ti): vistos_gab.append({"t": ti[:160], "m": medio, "u": url, "d": fecha})
    for medio, (tipo, url) in FEEDS.items():
        try:
            t = red.get(url, reintentos=2, timeout=40000); n0 = len(alm)
            if tipo == "json":
                for a in json.loads(t):
                    meter(a.get("post_URL") or a.get("guid") or a.get("permalink") or a.get("url"), limpio(a.get("post_title")), medio, (a.get("raw_post_date") or "")[:10], limpio(a.get("post_excerpt") or a.get("post_content"))[:300], "rss")
                    vigilar(limpio(a.get("post_title")), medio, a.get("post_URL"), (a.get("raw_post_date") or "")[:10])
            else:
                r = ET.fromstring(t.encode("utf-8"))
                for it in r.iter("item"):
                    desc = it.findtext("description") or ""
                    cats = " ".join(c.text or "" for c in it.findall("category"))
                    meter((it.findtext("link") or "").strip(), limpio(it.findtext("title")), medio, iso_fecha(it.findtext("pubDate") or ""), limpio(desc)[:300], "rss")
                    vigilar(limpio(it.findtext("title")), medio, (it.findtext("link") or "").strip(), iso_fecha(it.findtext("pubDate") or ""))
            anotar("rss_" + nrm(medio).replace(" ", "_"), True, len(alm) - n0)
        except Exception as e:
            anotar("rss_" + nrm(medio).replace(" ", "_"), False, None, str(e))
    # Google Noticias: rota entre las personas para no sobrecargar el servicio
    if gnews_cuota:
        est = cargar("estado_gnews.json", {"i": 0}); i = est["i"]; n = fall = 0
        hasta = (datetime.date.fromisoformat(HOY) - datetime.timedelta(days=75)).isoformat()
        for _ in range(min(gnews_cuota, len(claves))):
            pid, e = claves[i % len(claves)]; i += 1
            nom = e.get("corto") or e.get("n")
            if rep_corto[nrm(nom)] > 1: nom = e.get("n") or nom
            q = '"' + nom + '" when:60d'
            from urllib.parse import quote
            try:
                t = red.get("https://news.google.com/rss/search?q=" + quote(q) + "&hl=es-419&gl=CL&ceid=CL:es-419", reintentos=2, timeout=30000)
                k2 = 0
                for it in ET.fromstring(t.encode("utf-8")).iter("item"):
                    ti = limpio(it.findtext("title")); so = it.find("source"); med = (so.text or "").strip() if so is not None else ""
                    if med and ti.endswith(" - " + med): ti = ti[: -len(" - " + med)].strip()
                    fe = iso_fecha(it.findtext("pubDate") or "")
                    if not fe or fe < hasta or not titular_valido(ti, med, nom): continue
                    k = (it.findtext("link") or "")[-180:]
                    if k in alm: continue
                    alm[k] = {"t": ti[:220], "m": med or "Google Noticias", "u": (it.findtext("link") or "").strip(), "d": fe, "r": "", "p": [pid] + [x for x in quienes(ti) if x != pid], "te": tema_de(ti), "f": "gnews"}
                    k2 += 1
                    if k2 >= 8: break
                n += 1
            except Exception as ex:
                fall += 1
                if fall >= 6: print("  gnews detenido:", str(ex)[:100]); break
            time.sleep(1.1)
        est["i"] = i % max(1, len(claves)); guardar("estado_gnews.json", est)
        anotar("google_noticias", fall < 6, n, f"{fall} sin respuesta")
    ESTADO["gabinete"] = sorted(vistos_gab, key=lambda x: x["d"], reverse=True)[:3]
    if resolver_cuota: alm = resolver_google(red, alm, resolver_cuota)
    try: permiten_marco(red, alm)
    except Exception as e: anotar("sitios_lector", False, None, str(e))
    # recorte: últimos 12 meses y hasta 30 por persona
    corte = (datetime.date.fromisoformat(HOY) - datetime.timedelta(days=365)).isoformat()
    alm = {k: v for k, v in alm.items() if v["d"] >= corte and v["d"] <= HOY}
    cuenta = collections.Counter(); final = {}
    for k, v in sorted(alm.items(), key=lambda kv: kv[1]["d"], reverse=True):
        if all(cuenta[p] >= 30 for p in v["p"]): continue
        for p in v["p"]: cuenta[p] += 1
        final[k] = v
    guardar("noticias.json", final)
    anotar("noticias_total", True, len(final), f"{len(final) - prev} nuevas")
    return final

# ---------------------------------------------------------------- Temas por comisión de origen (dígitos del boletín)
TEMA_COMISION = {"01": "Agricultura", "02": "Defensa", "03": "Economía", "04": "Educación", "05": "Hacienda", "06": "Gobierno y regiones", "07": "Justicia y Constitución", "08": "Minería y energía", "09": "Obras públicas", "10": "Relaciones exteriores",
                 "11": "Salud", "12": "Medio ambiente", "13": "Trabajo", "14": "Vivienda", "15": "Transportes", "17": "Derechos humanos", "18": "Familia", "19": "Ciencia", "21": "Pesca", "24": "Cultura", "25": "Seguridad", "29": "Deporte", "31": "Desarrollo social", "33": "Recursos hídricos", "34": "Mujer", "35": "Zonas extremas"}
ESTADOS = [(r"publicad|ley n|promulg", "Publicado como ley"), (r"archiv", "Archivado"), (r"retirad|rechazad", "Rechazado o retirado"), (r"aprobaci[oó]n presidencial|tribunal constitucional|oficio de ley", "Despachado al Ejecutivo"), (r"comisi[oó]n mixta|c\.\s?mixta", "Comisión Mixta"),
           (r"tercer", "Tercer trámite"), (r"segundo", "Segundo trámite"), (r"primer", "Primer trámite")]

def estado_corto(p):
    t = " ".join([p.get("etapa") or "", (p.get("ultimoTramite") or {}).get("etapa") or "", (p.get("ultimoTramite") or {}).get("descripcion") or ""]).lower()
    for rx, e in ESTADOS:
        if re.search(rx, t): return e
    return "En tramitación"

def tram_utiles(p):
    fs = [x for x in p.get("tramites", []) if not re.search(r"urgencia|Cuenta del Mensaje|Oficio.*conocimiento", x["t"], re.I)]
    if len(fs) > 16: fs = fs[:2] + fs[-14:]
    return [[x["f"], x["t"][:160], x["e"][:80]] for x in fs]

def salida(vot_c, vot_s, pro, per, te, noti):
    vot = {}; vot.update(vot_c); vot.update(vot_s)
    rosters = []; idx = {}; salida_v = {}; bols = collections.defaultdict(list)
    for vid, v in vot.items():
        pre = "D" if v["camara"] != "Senado" else "S"
        ids = [pre + x[0] for x in v["votos"]]; clave = "|".join(ids)
        if clave not in idx: idx[clave] = len(rosters); rosters.append(ids)
        cods = "".join(x[1] for x in v["votos"])
        nv = {k: v[k] for k in v if k != "votos"}; nv["r"] = idx[clave]; nv["o"] = cods
        c = collections.Counter(cods); t = v["totales"]
        if c["A"] != t["si"] or c["C"] != t["no"] or c["B"] != t["abst"]:
            nv["nota"] = f"El detalle individual publicado suma {c['A']} a favor, {c['C']} en contra y {c['B']} abstenciones, mientras los totales oficiales informan {t['si']}, {t['no']} y {t['abst']}. Mostramos ambos tal como los publica la fuente."
        salida_v[vid] = nv; bols[v["boletin"]].append(vid)
    proy = []
    for b, ids in bols.items():
        p = pro.get(b, {})
        if not p.get("titulo") or re.match(r"no se ha encontrado", p["titulo"], re.I) or re.match(r"no existe", p["titulo"], re.I):
            m0 = vot[ids[0]]["materia"]
            p["titulo"] = (m0[:170].rsplit(" ", 1)[0] + "…") if len(m0) > 170 else (m0 or "Asunto votado, Boletín N° " + b)
        d = {"boletin": b, "titulo": p["titulo"], "ingreso": p.get("ingreso", ""), "iniciativa": p.get("iniciativa", ""), "origen": p.get("origen", ""), "ministerios": p.get("ministerios", []), "etapa": p.get("etapa", ""), "urgencia": p.get("urgencia", ""), "leynro": p.get("leynro", ""),
             "ultimoTramite": p.get("ultimoTramite"), "tema": TEMA_COMISION.get(b.split("-")[-1], "Otros"), "estadoCorto": estado_corto(p), "tram": tram_utiles(p),
             "votaciones": sorted(ids, key=lambda i: vot[i]["fecha"] + vot[i]["hora"], reverse=True)}
        proy.append(d)
    for b in CURADOS:
        if b not in bols and b in pro:
            p = pro[b]; proy.append({"boletin": b, "titulo": p.get("titulo", ""), "ingreso": p.get("ingreso", ""), "iniciativa": p.get("iniciativa", ""), "origen": p.get("origen", ""), "ministerios": p.get("ministerios", []), "etapa": p.get("etapa", ""), "urgencia": p.get("urgencia", ""), "leynro": p.get("leynro", ""), "ultimoTramite": p.get("ultimoTramite"), "tema": TEMA_COMISION.get(b.split("-")[-1], "Otros"), "estadoCorto": estado_corto(p), "tram": tram_utiles(p), "votaciones": []})
    proy.sort(key=lambda p: p["ingreso"], reverse=True)
    dip = {("D" + k): {"n": e["n"], "m": e.get("m", [])} for k, e in per["diputados"].items()}
    sen = {("S" + k): {"n": e["n"], "p": e.get("p", ""), "reg": e.get("reg", ""), "circ": e.get("circ")} for k, e in per["senadores"].items()}
    raw = {"consulta": HOY, "proyectos": proy, "votaciones": salida_v, "rosters": rosters, "diputados": dip, "senadores": sen}
    (SAL / "legislativo.js").write_text("/* Contraste · proyectos y votaciones de Sala. Generado automáticamente desde datos oficiales. */\nwindow.CONTRASTE_LEG_RAW=" + json.dumps(raw, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    pers = {"diputados": [dict(id=k, n=e["n"], corto=e.get("corto"), sexo=e.get("sexo"), dist=e.get("dist"), reg=e.get("reg", ""), p=(sorted(e.get("m") or [["", "", ""]])[-1][2]), mesa=e.get("mesa")) for k, e in sorted(per["diputados"].items(), key=lambda kv: kv[1]["n"]) if e.get("vigente")],
            "senadores": [dict(id=k, n=e["n"], corto=e.get("corto"), sexo=e.get("sexo"), slug=e.get("slug"), p=e.get("p", ""), reg=e.get("reg", ""), regId=e.get("regId"), circ=e.get("circ"), mail=e.get("mail", ""), fono=e.get("fono", "")) for k, e in sorted(per["senadores"].items(), key=lambda kv: kv[1]["n"]) if e.get("vigente")],
            "comunas": te.get("comunas", []), "gobierno": [x for x in EXTRA if not x.get("curado")]}
    (SAL / "personas.js").write_text("/* Contraste · parlamentarios vigentes y comunas. Generado automáticamente desde datos oficiales. */\nwindow.CONTRASTE_PERSONAS=" + json.dumps(pers, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    nts = sorted(noti.values(), key=lambda n: n["d"], reverse=True)
    (SAL / "noticias.js").write_text("/* Contraste · titulares detectados automáticamente, sin revisión editorial. */\nwindow.CONTRASTE_AUTO_NEWS=" + json.dumps(nts, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    ESTADO.update({"generado": datetime.datetime.now(datetime.timezone.utc).isoformat(timespec="minutes"), "hoy": HOY, "conteos": {"votaciones": len(salida_v), "camara": sum(1 for v in salida_v.values() if v["camara"] != "Senado"), "senado": sum(1 for v in salida_v.values() if v["camara"] == "Senado"), "proyectos": len(proy), "diputados": len(pers["diputados"]), "senadores": len(pers["senadores"]), "comunas": len(pers["comunas"]), "noticiasAuto": len(nts)}})
    (SAL / "estado.js").write_text("window.CONTRASTE_ESTADO=" + json.dumps(ESTADO, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    print(json.dumps(ESTADO["conteos"], ensure_ascii=False))
    for f in SAL.glob("*.js"): print(f.name, round(f.stat().st_size / 1024), "KB")

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--sin-noticias", action="store_true"); ap.add_argument("--sin-tramites", action="store_true"); ap.add_argument("--gnews", type=int, default=40); ap.add_argument("--resolver", type=int, default=150)
    a = ap.parse_args()
    extra = EXTRA
    with sync_playwright() as pw:
        red = Red(pw); nav = None
        try:
            try: nav = pw.chromium.launch(headless=True)
            except Exception as e: print("sin navegador:", str(e)[:100])
            class SinNav:
                def new_context(self, **k): raise RuntimeError("sin navegador")
            per = cargar("personas.json", {"diputados": {}, "senadores": {}})
            try: per = diputados(red, nav or SinNav())
            except Exception as e: anotar("camara_diputados", False, None, str(e))
            per = senadores(red, per)
            te = territorio(red) or cargar("territorio.json", {})
            vot_c = cargar("votos_camara.json", {}); pro = cargar("proyectos.json", {})
            try: vot_c, pro = camara(red)
            except Exception as e: anotar("camara_votaciones", False, None, str(e))
            vot_s = cargar("votos_senado.json", {})
            try: vot_s = senado(red, per)
            except Exception as e: anotar("senado_votaciones", False, None, str(e))
            if not a.sin_tramites:
                try: pro = tramites(red, pro, vot_c, vot_s)
                except Exception as e: anotar("senado_tramitacion", False, None, str(e))
            noti = cargar("noticias.json", {})
            if not a.sin_noticias:
                try: noti = noticias(red, per, extra, a.gnews, a.resolver)
                except Exception as e: anotar("noticias_total", False, None, str(e))
            salida(vot_c, vot_s, pro, per, te, noti)
        finally:
            if nav: nav.close()

if __name__ == "__main__":
    main()
