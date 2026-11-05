#!/usr/bin/env python3
"""Reseñas breves desde la introducción del artículo de Wikipedia en español (CC BY-SA), con el enlace al artículo.

Solo acepta el artículo si su título trae el nombre y el apellido de la persona y si el artículo dice que es de Chile.
Sin artículo que cumpla, el perfil mantiene su reseña básica: nunca se completa con texto inventado.
Se corre a mano. Uso: python automatizacion/resenas.py
"""
import json, pathlib, re, time, unicodedata
from urllib.parse import quote
from playwright.sync_api import sync_playwright

RAIZ = pathlib.Path(__file__).resolve().parent.parent
ALM = RAIZ / "automatizacion" / "almacen"
SAL = RAIZ / "publicar" / "datos" / "resenas.js"
UA = "ContrasteBot/1.0 (https://github.com/crisgomezbeck2-cell/contraste-datos; prototipo universitario de periodismo)"
API = "https://es.wikipedia.org/w/api.php?format=json&action=query&"

def nrm(t):
    t = unicodedata.normalize("NFD", t or "").encode("ascii", "ignore").decode().lower()
    return re.sub(r"[^a-z ]+", " ", t).split()

def calza(titulo, nom, cor):
    # el título (sin aclaración entre paréntesis) debe traer el nombre de pila y el apellido paterno
    t = set(nrm(re.sub(r"\(.*?\)", "", titulo)))
    c = nrm(cor); n = nrm(nom)
    return bool(c) and c[0] in t and c[-1] in t and (not n or n[0] in t or c[0] == n[0])

def recorte(x):
    x = re.sub(r"\s*\([^()]*(?:\([^()]*\)[^()]*)*\)", lambda m: m.group(0) if re.search(r"\b(19|20)\d\d\b", m.group(0)) else "", x, count=1)
    x = re.sub(r"[\u200b\u200c\u200d\ufeff]", "", x)
    x = re.sub(r"\s+", " ", x).strip()
    fr = re.split(r"(?<=[a-záéíóúñ\)\d]\.)\s+(?=[A-ZÁÉÍÓÚÑ])", x)
    s = ""
    for f in fr:
        if len(s) + len(f) > 520 and s: break
        s = (s + " " + f).strip()
        if len(s) > 260: break
    return s if len(s) <= 640 else s[:640].rsplit(" ", 1)[0] + "…"

def main():
    per = json.loads((ALM / "personas.json").read_text(encoding="utf-8"))
    gente = []
    for k, e in per["diputados"].items():
        if e.get("vigente"): gente.append(("D" + k, e["n"], e.get("corto") or e["n"]))
    for k, e in per["senadores"].items():
        if e.get("vigente"): gente.append(("S" + k, e["n"], e.get("corto") or e["n"]))
    for x in json.loads((RAIZ / "automatizacion" / "autoridades_extra.json").read_text(encoding="utf-8")):
        if not x.get("curado"): gente.append((x["id"], x["nombre"], x.get("corto") or x["nombre"]))
    sal = {}
    with sync_playwright() as p:
        api = p.request.new_context(extra_http_headers={"User-Agent": UA})
        def js(u):
            for i in range(5):
                r = api.get(u, timeout=60000)
                if r.status == 200: return json.loads(r.body())
                time.sleep(15 if r.status == 429 else 3)
            raise RuntimeError("HTTP %s" % r.status)
        def extracto(titulos):
            d = js(API + "redirects=1&prop=extracts|info|description&inprop=url&exintro=1&explaintext=1&exlimit=20&titles=" + quote("|".join(titulos)))
            q = d.get("query", {}); de = {}
            for x in q.get("normalized", []) + q.get("redirects", []): de[x["to"]] = de.get(x["from"], x["from"])
            out = {}
            for pg in q.get("pages", {}).values():
                if "missing" in pg or not pg.get("extract"): continue
                out[de.get(pg["title"], pg["title"])] = pg
            return out
        def acepta(pg, pid, nom, cor):
            tx = pg.get("extract", "")
            if not calza(pg["title"], nom, cor): return False
            if "desambiguaci" in tx[:200].lower() or "puede referirse" in tx[:200].lower(): return False
            if not re.search(r"chil", (pg.get("description") or "") + " " + tx[:600], re.I): return False
            # el apellido materno debe aparecer al comienzo del artículo: «Jorge Alessandri» también es un expresidente
            n = nrm(nom)
            if len(n) >= 3 and n[-1] not in nrm(pg["title"] + " " + tx[:200]): print("otro apellido", nom, "->", tx[:80], flush=True); return False
            # personas fallecidas o de otra época no pueden ser autoridades vigentes
            ap = re.search(r"\(([^)]*)\)", tx[:260])
            if ap and (len(re.findall(r"\b(1[6-9]\d\d|20\d\d)\b", ap.group(1))) >= 2 or re.search(r"\b1[6-8]\d\d\b|\b19[0-3]\d\b", ap.group(1))): print("otra epoca", nom, "->", tx[:80], flush=True); return False
            if re.search(r"\bfue un[a]? (pol[ií]tic|abogad|militar|m[eé]dic|empresari|diplom|ingenier|agricultor)", tx[:300], re.I): print("fallecido", nom, "->", tx[:80], flush=True); return False
            # debe presentarse como autoridad o persona política: evita homónimos de otras áreas
            if not re.search(r"pol[ií]tic|diputad|senador|ministr|gobernador|alcald|concejal|militante|parlamentari|president", tx[:500], re.I): print("descartado", nom, "->", tx[:90], flush=True); return False
            sal[pid] = {"t": recorte(tx), "u": pg.get("fullurl") or ("https://es.wikipedia.org/wiki/" + quote(pg["title"].replace(" ", "_")))}
            return True
        faltan = list(gente)
        for ronda in ("corto", "completo"):
            mapa = {}
            for g in faltan: mapa.setdefault(g[2] if ronda == "corto" else g[1], []).append(g)
            lista = list(mapa)
            for i in range(0, len(lista), 20):
                got = extracto(lista[i:i + 20])
                for t, pg in got.items():
                    for pid, nom, cor in mapa.get(t, []): acepta(pg, pid, nom, cor)
                time.sleep(0.5)
            faltan = [g for g in gente if g[0] not in sal]
            print("ronda", ronda, "con reseña", len(sal), "faltan", len(faltan), flush=True)
        # búsqueda por nombre para el resto
        for pid, nom, cor in faltan:
            d = js(API + "list=search&srlimit=3&srsearch=" + quote('"%s" Chile' % cor))
            ts = [h["title"] for h in d.get("query", {}).get("search", []) if calza(h["title"], nom, cor)]
            if ts:
                for t, pg in extracto(ts[:1]).items(): acepta(pg, pid, nom, cor)
            time.sleep(0.4)
        print("con reseña:", len(sal), "de", len(gente), flush=True)
    SAL.write_text("/* Contraste · introducciones de Wikipedia en español (CC BY-SA 4.0), con enlace al artículo. */\nwindow.CONTRASTE_RESENAS=" + json.dumps(sal, ensure_ascii=False, separators=(",", ":")) + ";\n", encoding="utf-8")

if __name__ == "__main__":
    main()
