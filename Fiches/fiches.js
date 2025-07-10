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

fetch(`../events.json?ts=${Date.now()}`)
  .then(resp => resp.json())
  .then(events => {
    // Score de pertinence par nombre de catégories communes
    const scored = events
      .filter(e => e.id !== currentId)
      .map(e => {
        const common = e.categories.filter(cat => currentCategories.includes(cat)).length;
        return { ...e, score: common };
      })
      .filter(e => e.score > 0)
      .sort((a, b) => b.score - a.score);

    let suggestion;
    if (scored.length > 0) {
      const topScore = scored[0].score;
      const topSuggestions = scored.filter(e => e.score === topScore);
      suggestion = topSuggestions[Math.floor(Math.random() * topSuggestions.length)];
    } else {
      const fallback = events.filter(e => e.id !== currentId);
      suggestion = fallback[Math.floor(Math.random() * fallback.length)];
    }

    if (suggestion && suggestionEl) {
      suggestionEl.href = `../output/${suggestion.id}.html`;
      suggestionEl.textContent = `${suggestion.year} – ${suggestion.title}`;
    } else if (suggestionEl) {
      suggestionEl.textContent = "Pas d'autre événement";
    }
  });

});
