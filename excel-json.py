import pandas as pd
import json

# Charger le fichier Excel
df = pd.read_excel("ton_fichier.xlsx")

# Supprimer les lignes totalement vides
df = df.dropna(how='all')

# Fonction pour splitter une chaîne en liste
def to_list(val):
    if pd.isna(val):
        return []
    return [v.strip() for v in str(val).split(",") if v.strip()]

# Fonction pour transformer le champ "more"
def parse_more(val):
    if pd.isna(val) or val.strip() == "":
        return []
    items = [v.strip() for v in val.split("|")]
    more = []
    for item in items:
        if "http" in item:
            more.append({"label": "Lien", "url": item})
        else:
            more.append({"label": item, "url": ""})
    return more

# Conversion ligne par ligne
json_data = []
for i, row in df.iterrows():
    event = {
        "id": f"event{i+1}",
        "title": str(row.get("title", "")).strip(),
        "year": int(row.get("year", 0)),
        "slug": str(row.get("slug", "")).strip(),
        "added": str(row.get("added", "")).strip(),
        "description": str(row.get("description", "")).strip(),
        "categories": to_list(row.get("categories", "")),
        "keywords": to_list(row.get("keywords", "")),
        "sources": [{"id_doc": s.strip()} for s in to_list(row.get("sources", ""))],
        "more": parse_more(str(row.get("more", ""))),
        "validated": str(row.get("validated", "")).strip().lower() == "true"
    }
    json_data.append(event)

# Export JSON
with open("output_events.json", "w", encoding="utf-8") as f:
    json.dump(json_data, f, ensure_ascii=False, indent=2)

print("✅ Tous les événements ont été exportés avec succès.")
