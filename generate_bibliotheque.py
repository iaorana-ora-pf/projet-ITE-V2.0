import json
import os

# Charger les événements
with open("events.json", "r", encoding="utf-8") as f:
    events = json.load(f)

# Collecter toutes les sources uniques
all_sources = []
seen_urls = set()

for event in events:
    for source in event.get("sources", []):
        url = source.get("url")
        label = source.get("label", "Document")

        if url and url not in seen_urls:
            all_sources.append({"label": label, "url": url})
            seen_urls.add(url)

# Générer les données JSON dans un fichier temporaire (optionnel)
with open("sources_data.json", "w", encoding="utf-8") as f:
    json.dump(all_sources, f, ensure_ascii=False, indent=2)

# Générer un HTML qui appelle un template avec placeholders
html = """<!DOCTYPE html>
<html lang="fr">
<head>
    <meta charset="UTF-8">
    <title>Bibliothèque de ressources</title>
    <link rel="stylesheet" href="css/bibliotheque.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.0/css/all.min.css">
</head>
<body>
    <div class="container">
        <h1>📚 Bibliothèque de ressources</h1>
        <div class="grid">
            {cards}
        </div>
    </div>
</body>
</html>
"""

# Générer uniquement les blocs de contenu pour HTML
cards = ""
for source in all_sources:
    url = source["url"]
    label = source["label"]
    icon = "fa-file-pdf" if ".pdf" in url.lower() else "fa-link"

    cards += f"""
    <div class="card">
        <div class="icon"><i class="fas {icon}"></i></div>
        <h3>{label}</h3>
        <a href="{url}" target="_blank">Télécharger</a>
    </div>
    """

# Finaliser le HTML avec injection
final_html = html.format(cards=cards)

# Enregistrer
with open("bibliotheque.html", "w", encoding="utf-8") as f:
    f.write(final_html)

print(f"✅ Page 'bibliotheque.html' générée avec {len(all_sources)} ressources.")
