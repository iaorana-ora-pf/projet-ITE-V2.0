import json
import os
from datetime import datetime
from jinja2 import Environment, FileSystemLoader

# 🔍 Trouver un événement proche
def find_similar_event(current_event, all_events):
    def score(event):
        if event["id"] == current_event["id"]:
            return (float('inf'), float('inf'), float('inf'))  # Exclure soi-même
        keywords_match = len(set(event.get("keywords", [])) & set(current_event.get("keywords", [])))
        categories_match = len(set(event.get("categories", [])) & set(current_event.get("categories", [])))
        year_diff = abs(event.get("year", 0) - current_event.get("year", 0))
        return (-keywords_match, -categories_match, year_diff)

    sorted_events = sorted(all_events, key=score)
    return sorted_events[0] if sorted_events else None

# 📁 Dossiers
json_file = "events.json"
template_dir = "."
output_dir = "fiches"
os.makedirs(output_dir, exist_ok=True)

# 🔧 Config Jinja2
env = Environment(loader=FileSystemLoader(template_dir), autoescape=True)
template = env.get_template("template_fiche.html")

# 📦 Charger les données
with open(json_file, "r", encoding="utf-8") as f:
    events = json.load(f)

# 🔁 Générer les pages
for event in events:
    event["added_formatted"] = datetime.strptime(event["added"], "%Y-%m-%d").strftime("%d/%m/%Y") if event.get("added") else ""

    similar = find_similar_event(event, events)

    rendered = template.render(
        title=event.get("title", ""),
        year=event.get("year", ""),
        added=event["added_formatted"],
        description=event.get("description", "Aucune description disponible."),
        keywords=event.get("keywords", []),
        sources=event.get("sources", []),
        more_links=event.get("more", []),
        suggestion_event=similar,
        categories=event.get("categories", []),
        categories_json=json.dumps(event.get("categories", []))
    )

    # Sauvegarde HTML
    with open(os.path.join(output_dir, f"{event['slug']}.html"), "w", encoding="utf-8") as f_out:
        f_out.write(rendered)

print(f"✅ {len(events)} fiches générées dans le dossier '{output_dir}/'")
