import json
import os
import re
import unicodedata

# 📂 Config
json_file = "events.json"
output_dir = "fiches"
os.makedirs(output_dir, exist_ok=True)

# Lire le template HTML externe
with open("template.html", "r", encoding="utf-8") as tf:
    template = tf.read()

# 📦 Charger les événements
with open(json_file, "r", encoding="utf-8") as f:
    events = json.load(f)

# ✅ Important : créer liste des slugs AVANT la boucle
slugs = [event["slug"] for event in events]

# 🔁 Générer les pages HTML individuelles
for i, event in enumerate(events):
    slug = event["slug"]
    title = event.get("title", "")
    year = event.get("year", "")
    added = event.get("added", "")
    categories = " ".join(f'<span class="categories">{c}</span>' for c in event.get("categories", []))
    keywords = " ".join(f'<span class="keywords">{k}</span>' for k in event.get("keywords", []))
    source_url = event["sources"][0]["url"] if event.get("sources") else "#"
    description = event.get("description", "Aucune description disponible.")
    prev_link = f"{slugs[i-1]}.html" if i > 0 else "#"
    next_link = f"{slugs[i+1]}.html" if i < len(slugs) - 1 else "#"

    html = template.format(
        title=title,
        year=year,
        categories=categories,
        keywords=keywords,
        added=added,
        source_url=source_url,
        description=description,
        prev_link=prev_link,
        next_link=next_link
    )

    with open(os.path.join(output_dir, f"{slug}.html"), "w", encoding="utf-8") as f:
        f.write(html)

print(f"✅ {len(events)} fiches générées dans le dossier '{output_dir}/'")

for event, slug in zip(events, slugs):
    index_html += f'    <li><a href="fiches/{slug}.html">{event["title"]}</a></li>\n'

index_html += """
  </ul>
</body>
</html>
"""

with open("index.html", "w", encoding="utf-8") as f:
    f.write(index_html)

print("✅ index.html généré avec tous les liens vers /fiche/*.html")
