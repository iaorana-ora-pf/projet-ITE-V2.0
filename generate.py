import json
import os
from datetime import datetime

# 🔍 Trouver un événement proche
def find_similar_event(current_event, all_events):
    def score(event):
        if event["id"] == current_event["id"]:
            return float('inf')  # exclure l’événement courant
        keywords_match = len(set(event.get("keywords", [])) & set(current_event.get("keywords", [])))
        categories_match = len(set(event.get("categories", [])) & set(current_event.get("categories", [])))
        year_diff = abs(event.get("year", 0) - current_event.get("year", 0))
        return (-keywords_match, -categories_match, year_diff)
    
    sorted_events = sorted(all_events, key=score)
    return sorted_events[0] if sorted_events else None

# 📂 Config
json_file = "events.json"
output_dir = "fiches"
os.makedirs(output_dir, exist_ok=True)

# 📥 Lire le template HTML externe
with open("template_fiche.html", "r", encoding="utf-8") as tf:
    template_fiche = tf.read()

# 📦 Charger les événements
with open(json_file, "r", encoding="utf-8") as f:
    events = json.load(f)

# Liste des slugs pour navigation
slugs = [event["slug"] for event in events]

# 🔁 Générer les pages HTML
for i, event in enumerate(events):
    slug = event["slug"]
    title = event.get("title", "")
    year = event.get("year", "")
    description = event.get("description", "Aucune description disponible.")

    # 📅 Formatage de la date
    raw_date = event.get("added", "")
    try:
        added = datetime.strptime(raw_date, "%Y-%m-%d").strftime("%d/%m/%Y")
    except ValueError:
        added = raw_date

    # 📚 Sources
    sources_html = "<ul class='source-list list-disc'>" + "".join(
        f"<li><a href='{src['url']}' target='_blank'>{src['label']}</a></li>"
        for src in event.get("sources", [])
    ) + "</ul>"

    # 🗝️ Mots-clés
    keywords_html = "<ul class='keyword-list list-disc'>" + "".join(
        f"<li class='pill'>{kw}</li>" for kw in event.get("keywords", [])
    ) + "</ul>"

    # 📘 Pour aller plus loin
    more_links_html = "<ul class='more-links-list list-disc'>" + "".join(
        f"<li><a href='{link['url']}' target='_blank'>{link['label']}</a></li>"
        for link in event.get("more", [])
    ) + "</ul>" if event.get("more") else ""

    # 💡 Suggestion intelligente
    similar = find_similar_event(event, events)
    suggestion_html = f"""
<hr class="suggestion-separator">
<div class="section">
  <strong>Événement lié à découvrir :</strong><br>
  <a href="{similar['slug']}.html" class="suggestion-link">
    {similar['title']} ({similar['year']})
  </a>
</div>
""" if similar else ""

    # 🧩 Injection dans le template
    html = template_fiche.format(
        title=title,
        year=year,
        added=added,
        description=description,
        keywords=keywords_html,
        sources=sources_html,
        more_links=more_links_html,
        suggestion_block=suggestion_html,
        categories_json=json.dumps(event.get("categories", []))
    )

    # 📄 Enregistrement
    with open(os.path.join(output_dir, f"{slug}.html"), "w", encoding="utf-8") as f:
        f.write(html)

print(f"✅ {len(events)} fiches générées dans le dossier '{output_dir}/'")
