import json

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

# Charger JSON
with open(json_file, "r", encoding="utf-8") as f:
    events = json.load(f)

# Générer les fichiers avec slug
for i, event in enumerate(events):
    title = event.get("title", "")
    year = event.get("year", "")
    added = event.get("added", "")
    categories = " ".join(f'<span class="categories">{c}</span>' for c in event.get("categories", []))
    keywords = " ".join(f'<span class="keywords">{k}</span>' for k in event.get("keywords", []))
    source_url = event["sources"][0]["url"] if event.get("sources") else "#"
    description = event.get("description", "Aucune description disponible.")
    slug = slugify(title)

    prev_slug = slugify(events[i - 1]["title"]) if i > 0 else "#"
    next_slug = slugify(events[i + 1]["title"]) if i < len(events) - 1 else "#"

    filename = f"{slug}.html"
    filepath = os.path.join(output_dir, filename)

    html = template.format(
        title=title,
        year=year,
        categories=categories,
        keywords=keywords,
        added=added,
        source_url=source_url,
        description=description,
        prev_link=f"{prev_slug}.html" if prev_slug != "#" else "#",
        next_link=f"{next_slug}.html" if next_slug != "#" else "#"
    )

    with open(filepath, "w", encoding="utf-8") as f:
        f.write(html)

print(f"✅ {len(events)} fichiers HTML générés avec slugs dans /{output_dir}/")
