import json
import hashlib
import os

# 📁 Fichiers
new_events_path = "output_events.json"
old_events_path = "events.json"
delta_output_path = "events-a-integrer.json"

# 🔧 Fonction de hash (hors champ ID)
def hash_event(event):
    clean_event = dict(event)
    clean_event.pop("id", None)
    clean_event_str = json.dumps(clean_event, sort_keys=True, ensure_ascii=False)
    return hashlib.sha256(clean_event_str.encode("utf-8")).hexdigest()

# 📦 Charger les nouveaux événements
with open(new_events_path, "r", encoding="utf-8") as f:
    new_events = json.load(f)

# 📦 Charger les anciens événements (s’il existe)
if os.path.exists(old_events_path):
    with open(old_events_path, "r", encoding="utf-8") as f:
        old_events = json.load(f)
else:
    old_events = []

# 🧠 Indexer les anciens événements par ID et hash
old_index = {e["id"]: hash_event(e) for e in old_events}

# 🔍 Comparer pour détecter les nouveaux ou modifiés
delta_events = []
for event in new_events:
    eid = event["id"]
    new_hash_
