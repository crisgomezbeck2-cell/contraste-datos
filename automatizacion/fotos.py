#!/usr/bin/env python3
"""Busca retratos con licencia libre para parlamentarios y autoridades, por lotes, en Wikipedia y Wikimedia Commons.

Solo acepta artículos cuya descripción indica que la persona es de Chile y licencias CC BY, CC BY-SA, CC0 o dominio público.
No se ejecuta en la actualización diaria: se corre a mano cuando cambia la nómina. Sin retrato libre, el sitio muestra las iniciales.
Guarda recortes cuadrados de 240 px en publicar/assets/fotos/auto y los créditos en publicar/datos/fotos.js.
Uso: python automatizacion/fotos.py
"""
import io, json, pathlib, re, time, unicodedata
from urllib.parse import quote, unquote
from PIL import Image
from playwright.sync_api import sync_playwright

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ALM = RAIZ / "automatizacion" / "almacen"
DIR = RAIZ / "publicar" / "assets" / "fotos" / "auto"; DIR.mkdir(parents=True, exist_ok=True)
SAL = RAIZ / "publicar" / "datos" / "fotos.js"
CACHE = ALM / "fotos_cache.json"
UA = "ContrasteBot/1.0 (https://github.com/crisgomezbeck2-cell/contraste-datos; prototipo universitario de periodismo)"

def nrm(t):
    t = unicodedata.normalize("NFD", t or "").encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z ]+", " ", t).split()

def lic_ok(s):
    s = (s or "").lower()
    return bool(re.search(r"cc[ -]by|cc0|public domain|dominio p|^pd", s)) and "-nc" not in s and "-nd" not in s and " nc" not in s

def main():
    per = json.loads((ALM / "personas.json").read_text(encoding="utf-8"))
    gente = []
    for k, e in per["diputados"].items():
        if e.get("vigente"): gente.append(("D" + k, e["n"], e.get("corto") or e["n"]))
    for k, e in per["senadores"].items():
        if e.get("vigente"): gente.append(("S" + k, e["n"], e.get("corto") or e["n"]))
    ex = RAIZ / "automatizacion" / "autoridades_extra.json"
    if ex.exists():
        for x in json.loads(ex.read_text(encoding="utf-8")):
            if not x.get("curado"): gente.append((x["id"], x["nombre"], x.get("corto") or x["nombre"]))
    cache = json.loads(CACHE.read_text(encoding="utf-8")) if CACHE.exists() else {}
    cache = {k: v for k, v in cache.items() if v.get("url")}
    with sync_playwright() as p:
        api = p.request.new_context(extra_http_headers={"User-Agent": UA})
        def js(u):
            for i in range(6):
                r = api.get(u, timeout=60000)
                if r.status == 200: return json.loads(r.body())
                print("  espera", r.status, flush=True); time.sleep(20 if r.status == 429 else 4)
            raise RuntimeError("HTTP %s" % r.status)
        def archivo(titulo, nom, pid, pedir_contexto):
            im = js("https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=330&titles=" + quote(titulo))
            for pg in im.get("query", {}).get("pages", {}).values():
                if "imageinfo" not in pg: continue
                ii = pg["imageinfo"][0]; mt = ii.get("extmetadata", {})
                lic = (mt.get("LicenseShortName", {}) or {}).get("value", "")
                if not lic_ok(lic): continue
                if pedir_contexto:
                    ctx = titulo + " " + (mt.get("ImageDescription", {}) or {}).get("value", "") + " " + (mt.get("Categories", {}) or {}).get("value", "")
                    if not re.search(r"chil|diputad|senador|c[aá]mara de|ministr|gobernador|bcn", ctx, re.I): continue
                autor = re.sub(r"<[^>]+>", "", (mt.get("Artist", {}) or {}).get("value", "")).strip()[:70]
                cache[pid] = {"url": ii.get("thumburl") or ii["url"], "pagina": ii["descriptionurl"], "lic": lic, "autor": autor, "nombre": nom}
                print("foto*", nom, lic, titulo[:70], flush=True)
                return True
            return False
        faltan = [g for g in gente if g[0] not in cache]
        # Primero, el retrato del artículo que resenas.py ya verificó (nombre, dos apellidos, Chile, cargo político y época)
        rs = RAIZ / "publicar" / "datos" / "resenas.js"; verif = {}
        if rs.exists():
            tx = rs.read_text(encoding="utf-8"); verif = json.loads(tx[tx.index("{"):tx.rindex("}") + 1])
        nom_de = {g[0]: g[1] for g in gente}
        ids = [g[0] for g in faltan if g[0] in verif]
        for pid in ids:
            tit = unquote(verif[pid]["u"].rsplit("/", 1)[-1]).replace("_", " ")
            pi = js("https://es.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageimages&piprop=name&titles=" + quote(tit))
            for pg in pi.get("query", {}).get("pages", {}).values():
                if pg.get("pageimage"): archivo("File:" + pg["pageimage"], nom_de[pid], pid, False)
            time.sleep(0.5)
        faltan = [g for g in gente if g[0] not in cache]
        print("con artículo verificado; faltan", len(faltan), flush=True)
        # Búsqueda para los que quedan: artículo de Wikipedia por nombre y luego archivos de Commons que traigan el nombre completo
        for pid, nom, cor in faltan:
            c = nrm(cor)
            if len(c) < 2: continue
            d = js("https://es.wikipedia.org/w/api.php?action=query&format=json&list=search&srlimit=3&srsearch=" + quote('"%s" Chile' % cor))
            hallada = False
            for h in d.get("query", {}).get("search", []):
                t = set(nrm(re.sub(r"\(.*?\)", "", h["title"])))
                if c[0] not in t or c[-1] not in t: continue
                n = nrm(nom)
                if len(n) >= 3 and n[-1] not in t: continue
                pi = js("https://es.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageimages|description&piprop=name&titles=" + quote(h["title"]))
                for pg in pi.get("query", {}).get("pages", {}).values():
                    if pg.get("pageimage") and re.search(r"polític|diputad|senador|ministr|gobernador|alcald|parlamentari", (pg.get("description") or "").lower()):
                        hallada = archivo("File:" + pg["pageimage"], nom, pid, False)
                if hallada: break
            if not hallada:
                d = js("https://commons.wikimedia.org/w/api.php?action=query&format=json&list=search&srnamespace=6&srlimit=6&srsearch=" + quote('"%s"' % cor))
                for h in d.get("query", {}).get("search", []):
                    if not re.search(r"\.(jpe?g|png)$", h["title"], re.I): continue
                    t = set(nrm(h["title"].rsplit(".", 1)[0]))
                    n = nrm(nom)
                    if c[0] in t and c[-1] in t and (len(n) < 3 or n[-1] in t) and not re.search(r"\b1[6-9]\d\d\b|estadio", h["title"], re.I) and archivo(h["title"], nom, pid, True): break
            time.sleep(0.6)
        CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=0), encoding="utf-8")
        cred = {}
        def escribir():
            SAL.write_text("window.CONTRASTE_FOTOS_AUTO=" + json.dumps(cred, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
        inicio = time.time(); limites = 0
        for pid, c in cache.items():
            if time.time() - inicio > 600: print("tiempo agotado; sigue en la próxima corrida", flush=True); break
            f = DIR / (pid + ".webp")
            if not f.exists():
                try:
                    r = api.get(re.sub(r"/\d+px-", "/330px-", c["url"]), timeout=40000)
                    if r.status == 429:
                        limites += 1; print("limite", limites, flush=True); time.sleep(30)
                        if limites >= 8: print("demasiados limites; sigue en la proxima corrida", flush=True); break
                        continue
                    if r.status != 200: print("descarga", pid, r.status, flush=True); continue
                    limites = 0
                    im = Image.open(io.BytesIO(r.body())).convert("RGB")
                    w, h = im.size; s = min(w, h)
                    y = int((h - s) * 0.12) if h > w else 0
                    x = (w - s) // 2
                    im.crop((x, y, x + s, y + s)).resize((240, 240), Image.LANCZOS).save(f, "WEBP", quality=74, method=6)
                    time.sleep(1.2)
                except Exception as e:
                    print("descarga", pid, str(e)[:90], flush=True); continue
            cred[pid] = {"src": "assets/fotos/auto/" + pid + ".webp", "cred": (c.get("autor") or "Autor en Wikimedia Commons") + " · " + c.get("lic", ""), "fuente": "Wikimedia Commons", "url": c.get("pagina", "")}
    escribir()
    print("con foto:", len(cred), "de", len(gente), flush=True)

if __name__ == "__main__":
    main()
