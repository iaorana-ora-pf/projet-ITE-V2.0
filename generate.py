import json
import os
import re
import unicodedata

# 📂 Config
json_file = "events.json"
output_dir = "fiches"
os.makedirs(output_dir, exist_ok=True)

# Lire le template_fiche HTML externe
with open("template_fiche.html", "r", encoding="utf-8") as tf:
    template_fiche = tf.read()

# 📦 Charger les événements
with open(json_file, "r", encoding="utf-8") as f:
    events = json.load(f)

# ✅ Important : créer liste des slugs AVANT la boucle
slugs = [event["slug"] for event in events]

# 🔁 Générer les pages HTML individuelles
category_info = {
    "Accès": ("fa-hospital", "#2a9d8f"),
    "Contexte": ("fa-landmark", "#6c757d"),
    "Données et recherche": ("fa-database", "#4b0082"),
    "Gouvernance et pilotage": ("fa-scale-balanced", "#007b7f"),
    "Promotion et prévention": ("fa-heart-pulse", "#e76f51"),
    "Protection et gestion des risques": ("fa-shield-alt", "#f4a261")
}
for i, event in enumerate(events):
    slug = event["slug"]
    title = event.get("title", "")
    year = event.get("year", "")
    added = event.get("added", "")
    categories = " ".join(
    f'<span class="categories"><i class="fas {category_info[c][0]}" style="color:{category_info[c][1]}; margin-right:6px;"></i>{c}</span>'
    for c in event.get("categories", []) if c in category_info)
    keywords = " ".join(f'<span class="keywords">{k}</span>' for k in event.get("keywords", []))
    source_url = event["sources"][0]["url"] if event.get("sources") else "#"
    description = event.get("description", "Aucune description disponible.")
    more_links = ""
if event.get("more"):
    more_links = "<div class='section'><strong>📘 Pour aller plus loin :</strong><br/>" + \
        "".join(f'<a href="{link["url"]}" target="_blank">{link["label"]}</a><br/>' for link in event["more"]) + \
        "</div>"
    prev_link = f"{slugs[i-1]}.html" if i > 0 else "#"
    next_link = f"{slugs[i+1]}.html" if i < len(slugs) - 1 else "#"

   # 🔍 Section "Pour aller plus loin"
more_links_html = ""
if event.get("more_links"):
    more_links_html = "<ul>" + "".join(
        f'<li><a href="{link["url"]}" target="_blank">{link["label"]}</a></li>'
        for link in event["more_links"]
    ) + "</ul>"
    
    html = template_fiche.format(
        title=title,
        description=description,
    year=year,
    categories=categories,
    keywords=keywords,
    added=added,
    source_url=source_url,
    prev_link=prev_link,
    next_link=next_link,
    more_links=more_links_html  # 👈 ajoute ceci
)

    with open(os.path.join(output_dir, f"{slug}.html"), "w", encoding="utf-8") as f:
        f.write(html)

print(f"✅ {len(events)} fiches générées dans le dossier '{output_dir}/'")
