import json
import os
from jinja2 import Environment, FileSystemLoader

# 📁 Config
json_file = "events.json"
template_file = "template_bibliotheque.html"
output_file = "bibliotheque.html"
template_dir = "."
output_dir = "."

# 📚 Charger les événements
with open(json_file, "r", encoding="utf-8") as f:
    events = json.load(f)

# 🔄 Indexer les sources avec les événements associés
documents_dict = {}

for event in events:
    for src in event.get("sources", []):
        key = src["url"]

        if key not in documents_dict:
            documents_dict[key] = {
                "title": src.get("label", "Sans titre"),
                "type": src.get("type", "Autre"),
                "url": src["url"],
                "image": src.get("image", ""),  # facultatif
                "related_events": []
            }

        documents_dict[key]["related_events"].append({
            "slug": event["slug"],
            "title": event["title"],
            "year": event["year"]
        })

# 🔢 Convertir en liste pour l'affichage
document_cards = list(documents_dict.values())

# 🧪 Types uniques pour les filtres
types_disponibles = sorted(set(doc["type"] for doc in document_cards))

# 🖨️ Rendu HTML avec Jinja2
env = Environment(loader=FileSystemLoader(template_dir))
template = env.get_template(template_file)

rendered_html = template.render(
    cards=document_cards,
    types=types_disponibles
)

with open(os.path.join(output_dir, output_file), "w", encoding="utf-8") as f:
    f.write(rendered_html)

print(f"✅ Page générée : {output_file}")
