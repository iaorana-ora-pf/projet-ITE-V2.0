const categoryInfo = {
  "Accès": { color: "#2a9d8f", icon: "fa-hospital" },
  "Contexte": { color: "#6c757d", icon: "fa-landmark" },
  "Données et recherche": { color: "#4b0082", icon: "fa-database" },
  "Gouvernance et pilotage": { color: "#007b7f", icon: "fa-scale-balanced" },
  "Promotion et prévention": { color: "#e76f51", icon: "fa-heart-pulse" },
  "Protection et gestion des risques": { color: "#f4a261", icon: "fa-shield-alt" }
};

document.addEventListener("DOMContentLoaded", () => {
 

  // Suggestion d’un autre événement depuis events.json
  const suggestionEl = document.querySelector(".suggestion-link");
  const currentId = document.body.dataset.id;
  const currentCategories = JSON.parse(document.body.dataset.categories || "[]");

  fetch(`../output/events.json?ts=${Date.now()}`)
    .then(resp => resp.json())
    .then(events => {
      const sameCat = events.filter(e =>
        e.id !== currentId &&
        e.categories.some(cat => currentCategories.includes(cat))
      );

    let suggestion = sameCat.length > 0
      ? sameCat[Math.floor(Math.random() * sameCat.length)]
      : events.filter(e => e.id !== currentId)[Math.floor(Math.random() * (events.length - 1))];

      if (suggestion && suggestionEl) {
        suggestionEl.href = `../output/${suggestion.id}.html`;
        suggestionEl.textContent = `${suggestion.year} – ${suggestion.title}`;
      } else if (suggestionEl) {
        suggestionEl.textContent = "Pas d'autre événement";
      }
    });
});
