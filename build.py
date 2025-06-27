import pandas as pd
import json
import os
import hashlib
from datetime import datetime
from jinja2 import Environment, FileSystemLoader

# 📁 Config fichier
EXCEL_FILE = "base-evenement.xlsx"
JSON_FILE = "events.json"
TEMPLATE_FILE = "template_fiche.html"
FICHES_DIR = "fiches"
INDEX_FILE = "index.html"
os.makedirs(FICHES_DIR, exist_ok=True)

# 🧠 Jinja2 init
env = Environment(loader=FileSystemLoader("."), autoescape=True)
template = env.get_template(TEMPLATE_FILE)

# 🔄 Charger events.json
if os.path.exists(JSON_FILE):
    with open(JSON_FILE, "r", encoding="utf-8") as f:
        existing_events = json.load(f)
else:
    existing_events = []

existing_map = {e["id"]: e for e in existing_events}

# 📊 Charger Excel
df = pd.read_excel(EXCEL_FILE).dropna(subset=["id", "title"])

# 🔐 Calcul d'empreinte pour comparer contenu
def compute_hash(event):
    fields = [
        event.get("title", ""), event.get("year", ""), event.get("slug", ""), event.get("added", ""),
        event.get("description", ""), ",".join(event.get("categories", [])),
        ",".join(event.get("keywords", [])),
        ",".join([s.get("id_doc", "") for s in event.get("sources", [])]),
        ",".join([m.get("label", "") + m.get("url", "") for m in event.get("more", [])]),
        str(event.get("validated", ""))
    ]
    return hashlib.md5("|".join(fields).encode("utf-8")).hexdigest()

# 🧩 Génération intelligente
updated_events = []
generated_slugs = []

for _, row in df.iterrows():
    eid = str(row["id"]).strip()
    event = {
        "id": eid,
        "title": str(row.get("title", "")).strip(),
        "year": int(row.get("year", 0)),
        "slug": str(row.get("slug", "")).strip(),
        "added": str(row.get("added", "")).strip(),
        "description": str(row.get("description", "")).strip(),
        "categories": [v.strip() for v in str(row.get("categories", "")).split(",") if v.strip()],
        "keywords": [v.strip() for v in str(row.get("keywords", "")).split(",") if v.strip()],
        "sources": [{"id_doc": s.strip()} for s in str(row.get("sources", "")).split(",") if s.strip()],
        "more": [],
        "validated": str(row.get("validated", "")).strip().lower() == "true"
    }

    # 🔗 more (liens ou étiquettes)
    more_val = str(row.get("more", "")).strip()
    if more_val:
        for item in more_val.split("|"):
            item = item.strip()
            if "http" in item:
                event["more"].append({"label": "Lien", "url": item})
            else:
                event["more"].append({"label": item, "url": ""})

    # 🔍 Comparaison de contenu
    current_hash = compute_hash(event)
    old_hash = compute_hash(existi
