#!/usr/bin/env python3
"""Reúne una selección de noticias antiguas de cada autoridad, con Google Noticias, por períodos.

No forma parte de la actualización diaria: se corre a mano y se guarda aparte, en publicar/datos/noticias-antiguas.js.
Solo acepta titulares que pasan el mismo filtro contra homónimos de la actualización diaria, y marca su fecha real.
Uso: python automatizacion/historico.py [--personas N] [--resolver N]
"""
import argparse, collections, datetime, json, pathlib, re, sys, time, xml.etree.ElementTree as ET
from urllib.parse import quote

sys.path.insert(0, str(pathlib.Path(__file__).resolve().parent))
import actualizar as AC

ALM = AC.ALM if hasattr(AC, "ALM") else pathlib.Path(__file__).resolve().parent / "almacen"
SAL = pathlib.Path(__file__).resolve().parent.parent / "publicar" / "datos" / "noticias-antiguas.js"
STORE = "historico.json"
HOY = datetime.date.fromisoformat(AC.HOY)
LIMITE = (HOY - datetime.timedelta(days=366)).isoformat()   # lo más nuevo ya lo cubre la actualización diaria
VENTANAS = [("2010-01-01", "2018-01-01"), ("2018-01-01", "2022-01-01"), ("2022-01-01", "2024-01-01"), ("2024-01-01", LIMITE)]
POR_VENTANA = 3

# Con años de distancia, el riesgo de homónimos es mayor que en la actualización diaria. Por eso aquí se exige más:
POL = re.compile(r"diputad|senador|ministr|concejal|alcald|gobernador|intendent|candidat|bancada|parlamentari|\b(UDI|RN|PS|PPD|PC|FA|DC|PDG|PNL|PRSD|Ev[oó]poli|Republican\w*)\b|convenci[oó]n constitucional|constituyente|convencional|c[aá]mara de diputad|senado|congreso|boric|pi[ñn]era|bachelet|la moneda|elecci[oó]n|elecciones|primarias|seremi|militan|acusaci[oó]n constitucional|interpel|comisi[oó]n investigadora|municipio|municipal", re.I)
ANTES = re.compile(r"^(ex)?-?(diputad|senador|ministr|alcald|gobernador|concejal|president|candidat|precandidat|intendent|seremi|subsecretari|parlamentari|convencional|constituyente|delegad|l[ií]der|abogad|periodista|doctor|dra?$|profesor|perfil|entrevista|confidencial|exclusiva|caso|qui[eé]n|c[oó]mo|qu[eé]|por|para|con|sin|según|tras|ante|desde|hasta|sobre|entre|los|las|del|que|una|uno|bancada|militante|rector|vocero|vocera|jefe|jefa)", re.I)
CHILE_COM = {"latercera.com", "emol.com", "cnnchile.com", "lacuarta.com", "lun.com", "elciudadano.com", "elpinguino.com", "elpais.com", "bbc.com", "theconversation.com", "infobae.com", "publimetro.cl"}

def dominio(u):
    from urllib.parse import urlparse
    return urlparse(u).netloc.replace("www.", "").lower()

def valido(v, pid, nombres, repetidos):
    corto, largo = nombres.get(pid, ("", ""))
    if not corto: return False
    n = " " + AC.nrm(v["t"]) + " "; c = AC.nrm(corto); l = AC.nrm(largo)
    if not POL.search(v["t"]): return False
    if len(l.split()) >= 3 and (" " + l + " ") in n: return True
    # dos autoridades con el mismo nombre (el Presidente y su hijo diputado): sin el nombre completo no se puede saber de quién es
    if corto in repetidos or (" " + c + " ") not in n: return False
    # «Javier Muñoz Menéndez» no es «Javier Muñoz Riquelme»: si sigue otro apellido, es otra persona
    pal = re.findall(r"[^\W\d_]+(?:[-'][^\W\d_]+)?", v["t"]); nor = [AC.nrm(x) for x in pal]; cs = c.split(); propio = set(l.split())
    for i in range(len(nor) - len(cs)):
        if nor[i:i + len(cs)] == cs:
            sig = pal[i + len(cs)]
            if sig[0].isupper() and len(sig) > 2 and AC.nrm(sig) not in propio: return False
            # «Juan Pablo Silva» no es «Pablo Silva»: si antes viene otro nombre propio, también es otra persona
            if i > 0 and pal[i - 1][0].isupper() and len(pal[i - 1]) > 2 and not ANTES.match(pal[i - 1]) and AC.nrm(pal[i - 1]) not in propio: return False
    return True

def escribir(alm, gente):
    nombres = dict((g[0], (g[1], g[2])) for g in gente)
    cuenta = collections.Counter(g[1] for g in gente); repetidos = {k for k, c in cuenta.items() if c > 1}
    nts = []
    for v in alm["noticias"].values():
        if "news.google.com" in v["u"]: continue                                # sin enlace real al medio no sirve para citar
        d = dominio(v["u"])
        if not (d.endswith(".cl") or d in CHILE_COM): continue                  # medios de otros países traen homónimos
        ps = [p for p in v["p"] if valido(v, p, nombres, repetidos)]
        if not ps: continue
        nts.append(dict(v, p=ps, m=re.sub(r"^[-\s|]+|[-\s|]+$", "", v["m"]).replace("www.", "")))
    nts.sort(key=lambda n: n["d"], reverse=True)
    SAL.write_text("/* Contraste · selección de noticias antiguas, detectada automáticamente y sin revisión editorial. */\nwindow.CONTRASTE_NEWS_HIST=" + json.dumps(nts, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
    print("noticias antiguas publicables:", len(nts), "de", len(alm["noticias"]), round(SAL.stat().st_size / 1024), "KB", flush=True)

def main():
    ap = argparse.ArgumentParser(); ap.add_argument("--personas", type=int, default=0); ap.add_argument("--resolver", type=int, default=0); ap.add_argument("--solo-filtrar", action="store_true")
    a = ap.parse_args()
    from playwright.sync_api import sync_playwright
    per = AC.cargar("personas.json", {"diputados": {}, "senadores": {}})
    gente = [("d" + k, e.get("corto") or e["n"], e["n"]) for k, e in per["diputados"].items() if e.get("vigente")] + [("s" + k, e.get("corto") or e["n"], e["n"]) for k, e in per["senadores"].items() if e.get("vigente")] + [(x["id"], x.get("corto") or x["nombre"], x["nombre"]) for x in AC.EXTRA]
    alm = AC.cargar(STORE, {"hechos": [], "noticias": {}})
    if a.solo_filtrar: return escribir(alm, gente)
    with sync_playwright() as pw:
        red = AC.Red(pw)
        pendientes = [g for g in gente if g[0] not in alm["hechos"]]
        if a.personas: pendientes = pendientes[:a.personas]
        fallos = 0
        for n, (pid, nom, _largo) in enumerate(pendientes):
            completo = True
            for desde, hasta in VENTANAS:
                q = '"%s" after:%s before:%s' % (nom, desde, hasta)
                try:
                    t = red.get("https://news.google.com/rss/search?q=" + quote(q) + "&hl=es-419&gl=CL&ceid=CL:es-419", reintentos=2, timeout=30000)
                    k2 = 0; fallos = 0
                    for it in ET.fromstring(t.encode("utf-8")).iter("item"):
                        ti = AC.limpio(it.findtext("title")); so = it.find("source"); med = (so.text or "").strip() if so is not None else ""
                        if med and ti.endswith(" - " + med): ti = ti[: -len(" - " + med)].strip()
                        fe = AC.iso_fecha(it.findtext("pubDate") or "")
                        if not fe or not (desde <= fe < hasta) or not AC.titular_valido(ti, med, nom): continue
                        link = (it.findtext("link") or "").strip(); k = link[-180:]
                        if k in alm["noticias"]:
                            if pid not in alm["noticias"][k]["p"]: alm["noticias"][k]["p"].append(pid)
                        else:
                            alm["noticias"][k] = {"t": ti[:220], "m": med or "Google Noticias", "u": link, "d": fe, "r": "", "p": [pid], "te": AC.tema_de(ti), "f": "gnews"}
                        k2 += 1
                        if k2 >= POR_VENTANA: break
                except Exception as ex:
                    completo = False; fallos += 1; print("  falla", nom, str(ex)[:90], flush=True); time.sleep(5)
                time.sleep(1.1)
            if completo: alm["hechos"].append(pid)
            if fallos >= 10: print("demasiadas fallas; sigue en la próxima corrida", flush=True); break
            if n % 10 == 0:
                print(n, "de", len(pendientes), nom, len(alm["noticias"]), flush=True)
                AC.guardar(STORE, alm); escribir(alm, gente)
        AC.guardar(STORE, alm)
        if a.resolver:
            # el resolutor guarda su avance en el almacén diario: aquí debe guardar en este archivo aparte
            original = AC.guardar
            AC.guardar = lambda nombre, datos: original(STORE, alm) if nombre == "noticias.json" else original(nombre, datos)
            AC.resolver_google(red, alm["noticias"], a.resolver)
            AC.guardar = original
            AC.guardar(STORE, alm)
    escribir(alm, gente)
    faltan = sum(1 for v in alm["noticias"].values() if "news.google.com" in v["u"])
    print("con enlace de Google pendiente:", faltan, flush=True)

if __name__ == "__main__":
    main()
