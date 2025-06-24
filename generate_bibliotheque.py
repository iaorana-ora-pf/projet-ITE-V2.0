import json
import os
from jinja2 import Environment, FileSystemLoader

# 📁 Fichier source et sortie
json_file = "docs.json"
output_html = "bibliotheque.html"

# 📁 Préparer l’environnement Jinja2
template_dir = "."
env = Environment(loader=FileSystemLoader(template_dir))
template = env.get_template("template_bibliotheque.html")

# 📦 Charger les documents depuis JSON
with open(json_file, "r", encoding="utf-8") as f:
    documents = json.load(f)

# 🧩 Injecter dans le template
html = template.render(cards=documents)

# 📄 Écrire dans le fichier final
with open(output_html, "w", encoding="utf-8") as f:
    f.write(html)

print(f"✅ Page générée : {output_html}")
