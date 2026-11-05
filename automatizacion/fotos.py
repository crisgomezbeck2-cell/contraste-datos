#!/usr/bin/env python3
"""Busca retratos con licencia libre para parlamentarios y autoridades, por lotes, en Wikipedia y Wikimedia Commons.

Solo acepta artículos cuya descripción indica que la persona es de Chile y licencias CC BY, CC BY-SA, CC0 o dominio público.
No se ejecuta en la actualización diaria: se corre a mano cuando cambia la nómina. Sin retrato libre, el sitio muestra las iniciales.
Guarda recortes cuadrados de 240 px en publicar/assets/fotos/auto y los créditos en publicar/datos/fotos.js.
Uso: python automatizacion/fotos.py
"""
import io, json, pathlib, re, time, unicodedata
from urllib.parse import quote
from PIL import Image
from playwright.sync_api import sync_playwright

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ALM = RAIZ / "automatizacion" / "almacen"
DIR = RAIZ / "publicar" / "assets" / "fotos" / "auto"; DIR.mkdir(parents=True, exist_ok=True)
SAL = RAIZ / "publicar" / "datos" / "fotos.js"
CACHE = ALM / "fotos_cache.json"
UA = "ContrasteBot/1.0 (prototipo universitario de periodismo en Chile; contacto: repositorio del proyecto)"

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
        faltan = [g for g in gente if g[0] not in cache]
        for ronda in ("corto", "completo", "apellidos"):
            if not faltan: break
            nombres = {}
            for pid, nom, cor in faltan:
                pal = nom.split()
                t = {"corto": cor, "completo": nom, "apellidos": " ".join(pal[:1] + pal[-2:]) if len(pal) > 2 else nom}[ronda]
                nombres.setdefault(t, []).append((pid, nom))
            lista = list(nombres)
            for i in range(0, len(lista), 45):
                lote = lista[i:i + 45]
                d = js("https://es.wikipedia.org/w/api.php?action=query&format=json&redirects=1&prop=pageimages|description&piprop=name&pilimit=50&titles=" + quote("|".join(lote)))
                q = d.get("query", {}); alias = {}
                for x in q.get("normalized", []) + q.get("redirects", []): alias[x["to"]] = alias.get(x["from"], x["from"])
                archivos = {}
                for pg in q.get("pages", {}).values():
                    if "pageimage" not in pg or "missing" in pg: continue
                    if not re.search(r"chil|polític|diputad|senador|abogad|ministr", (pg.get("description") or "").lower()): continue
                    orig = alias.get(pg["title"], pg["title"])
                    if orig in nombres: archivos[pg["pageimage"]] = orig
                if archivos:
                    im = js("https://commons.wikimedia.org/w/api.php?action=query&format=json&prop=imageinfo&iiprop=url|extmetadata&iiurlwidth=330&titles=" + quote("|".join("File:" + a for a in archivos)))
                    nor = {x["to"]: x["from"] for x in im.get("query", {}).get("normalized", [])}
                    for pg in im.get("query", {}).get("pages", {}).values():
                        if "imageinfo" not in pg: continue
                        ii = pg["imageinfo"][0]; mt = ii.get("extmetadata", {})
                        lic = (mt.get("LicenseShortName", {}) or {}).get("value", "")
                        titulo = nor.get(pg["title"], pg["title"]).replace("File:", "").replace("Archivo:", "").replace(" ", "_")
                        org = archivos.get(titulo) or archivos.get(pg["title"].replace("File:", "").replace(" ", "_"))
                        if not org or not lic_ok(lic): continue
                        autor = re.sub(r"<[^>]+>", "", (mt.get("Artist", {}) or {}).get("value", "")).strip()[:70]
                        for pid, nom in nombres[org]:
                            cache[pid] = {"url": ii.get("thumburl") or ii["url"], "pagina": ii["descriptionurl"], "lic": lic, "autor": autor, "nombre": nom}
                            print("foto ", nom, lic, flush=True)
                CACHE.write_text(json.dumps(cache, ensure_ascii=False, indent=0), encoding="utf-8")
                time.sleep(1.0)
            faltan = [g for g in gente if g[0] not in cache]
            print("ronda", ronda, "faltan", len(faltan), flush=True)
        cred = {}
        def escribir():
            SAL.write_text("window.CONTRASTE_FOTOS_AUTO=" + json.dumps(cred, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")
        inicio = time.time()
        for pid, c in cache.items():
            if time.time() - inicio > 600: print("tiempo agotado; sigue en la próxima corrida", flush=True); break
            f = DIR / (pid + ".webp")
            if not f.exists():
                try:
                    for i in range(4):
                        r = api.get(re.sub(r"/\d+px-", "/330px-", c["url"]), timeout=40000)
                        if r.status == 200: break
                        time.sleep(15)
                    if r.status != 200: print("descarga", pid, r.status, flush=True); continue
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
