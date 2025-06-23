import json
import os
from datetime import datetime

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

# Icônes + couleurs des catégories
category_info = {
    "Accès": ("fa-hospital", "#2a9d8f"),
    "Contexte": ("fa-landmark", "#6c757d"),
    "Données et recherche": ("fa-database", "#4b0082"),
    "Gouvernance et pilotage": ("fa-scale-balanced", "#007b7f"),
    "Promotion et prévention": ("fa-heart-pulse", "#e76f51"),
    "Protection et gestion des risques": ("fa-shield-alt", "#f4a261")
}

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
        added = raw_date  # fallback

    # 🔗 Navigation
    prev_link = f"{slugs[i-1]}.html" if i > 0 else "#"
    next_link = f"{slugs[i+1]}.html" if i < len(slugs) - 1 else "#"

    # 📚 Sources
   sources_html = "<ul class='list-disc source-list'>" + "".join(
    f"<li><a href='{src['url']}' target='_blank'>{src['label']}</a></li>"
    for src in event.get("sources", [])
) + "</ul>"

    # 🗝️ Mots-clés
    keywords_html = "<ul class='list-disc keyword-list'>" + "".join(
    f"<li class="pill">{kw}</li>" for kw in event.get("keywords", [])
) + "</ul>"

    # 📘 Pour aller plus loin
   more_links_html = "<ul class='list-disc more-links-list'>" + "".join(
    f"<li><a href='{link['url']}' target='_blank'>{link['label']}</a></li>"
    for link in event.get("more", [])
) + "</ul>" if event.get("more") else ""

    # 🧩 Injecter dans le template
    html = template_fiche.format(
        title=title,
        year=year,
        added=added,
        description=description,
        keywords=keywords_html,
        sources=sources_html,
        more_links=more_links_html,
        prev_link=prev_link,
        next_link=next_link,
        categories_json=json.dumps(event.get("categories", []))
    )

    # 📄 Enregistrer le fichier HTML
    with open(os.path.join(output_dir, f"{slug}.html"), "w", encoding="utf-8") as f:
        f.write(html)

print(f"✅ {len(events)} fiches générées dans le dossier '{output_dir}/'")
