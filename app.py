from flask import Flask, request, jsonify
import json
from datetime import datetime
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # autorise les requêtes depuis ton formulaire local

DATA_FILE = "events_a_valider.json"

@app.route("/submit", methods=["POST"])
def submit_event():
    data = request.json
    if not data:
        return jsonify({"status": "error", "message": "Données vides"}), 400

    try:
        # On ajoute automatiquement une date
        data["added"] = datetime.now().strftime("%Y-%m-%d")

        # On initialise ou on charge le fichier existant
        try:
            with open(DATA_FILE, "r", encoding="utf-8") as f:
                events = json.load(f)
        except FileNotFoundError:
            events = []

        events.append(data)

        with open(DATA_FILE, "w", encoding="utf-8") as f:
            json.dump(events, f, ensure_ascii=False, indent=2)

        return jsonify({"status": "success", "message": "Événement enregistré"}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

