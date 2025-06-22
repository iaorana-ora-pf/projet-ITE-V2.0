import json
import os
import re
import unicodedata

# 🔧 Convertit un titre en slug
def slugify(text):
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^a-zA-Z0-9 -]', '', text)
    text = text.lower()
    text = re.sub(r'\s+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text.strip('-')

# 📂 Config
json_file = "events.json"
output_dir = "fiches"
os.makedirs(output_dir, exist_ok=True)

# 📄 Template HTML des fiches
template = """
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>{title}</title>
  <style>
    body {{
      font-family: 'Open Sans', sans-serif;
      margin: 40px;
      max-width: 800px;
    }}
    h1 {{ font-size: 2em; }}
    .section {{ margin-bottom: 1em; }}
    .nav-arrows {{
      display: flex;
      justify-content: space-between;
      margin-top: 40px;
    }}
    .nav-arrows a {{
      font-size: 1.5em;
      text-decoration: none;
    }}
    .categories, .keywords {{
      display: inline-block;
      background: #f0f0f0;
      padding: 5px 10px;
      margin-right: 8px;
      border-radius: 5px;
    }}
  </style>
</head>
<body>
  <h1>{title}</h1>

  <div class="section"><strong>📅 Année :</strong> {year}</div>
  <div class="section"><strong>🏷️ Catégories :</strong> {categories}</div>
  <div class="section"><strong>🗝️ Mots-clés :</strong> {keywords}</div>
  <div class="section"><strong>📆 Date d’ajout :</strong> {added}</div>
  <div class="section"><strong>🔗 Lien source :</strong> <a href="{source_url}" target="_blank">Voir la source</a></div>
  <div class="section"><strong>📝 Description :</strong> {description}</div>

  <hr />
  <h2>Pour aller plus loin</h2>
  <div class="nav-arrows">
    <a href="{prev_link}">⬅️</a>
    <a href="{next_link}">➡️</a>
  </div>
</body>
</html>
"""

# 📦 Charger les événements
with open(json_file, "r", encoding="utf-8") as f:
    events = json.load(f)

# 🔁 Générer les slugs avec année
slugs = []
for event in events:
    year = event.get("year", "")
    title = event.get("title", "")
    combined = f"{year}-{title}"
    slug = slugify(combined)
    slugs.append(slug)

# 🔁 Générer les pages HTML individuelles
for i, event in enumerate(events):
    slug = slugs[i]
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

# 🗂️ Générer la page index.html avec tous les liens
index_html = """
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <title>Liste des événements</title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <style>
    body { font-family: Arial, sans-serif; max-width: 800px; margin: auto; padding: 2em; }
    ul { padding-left: 1em; }
    li { margin-bottom: 0.5em; }
    a { text-decoration: none; color: #007acc; }
    a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <h1>📚 Tous les événements</h1>
  <ul>
"""

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
