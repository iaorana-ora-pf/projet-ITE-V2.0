const categoryInfo = {
  "Accès": { color: "#2a9d8f", icon: "fa-hospital" },
  "Contexte": { color: "#6c757d", icon: "fa-landmark" },
  "Données et recherche": { color: "#4b0082", icon: "fa-database" },
  "Gouvernance et pilotage": { color: "#007b7f", icon: "fa-scale-balanced" },
  "Promotion et prévention": { color: "#e76f51", icon: "fa-heart-pulse" },
  "Protection et gestion des risques": { color: "#f4a261", icon: "fa-shield-alt" }
};

document.addEventListener("DOMContentLoaded", () => {
  // Récupère les catégories depuis l'attribut HTML data-categories
  const catEl = document.getElementById("categories-with-icons");
  const bodyCat = document.body.dataset.categories;

  try {
    const categories = JSON.parse(bodyCat);
    if (catEl && categories) {
      catEl.innerHTML = categories.map(cat => {
        const info = categoryInfo[cat] || {};
        return `<span class="cat-icon" title="${cat}">
                  <i class="fas ${info.icon || 'fa-tag'}" style="color:${info.color || '#666'};"></i> ${cat}
                </span>`;
      }).join(" ");
    }
  } catch (e) {
    console.warn("Catégories mal formatées :", bodyCat);
  }

  // Suggestion d'événement aléatoire dans le dossier output
  const suggestionEl = document.querySelector(".suggestion-link");
  const currentSlug = window.location.pathname.split("/").pop();

  fetch("../output/index.html")
    .then(resp => resp.text())
    .then(html => {
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, "text/html");
      const links = [...doc.querySelectorAll("a")]
        .map(a => a.getAttribute("href"))
        .filter(href => href.endsWith(".html") && href !== currentSlug);

      if (links.length > 0 && suggestionEl) {
        const choice = links[Math.floor(Math.random() * links.length)];
        const label = choice.replace(".html", "").replace(/-/g, " ");
        suggestionEl.href = choice;
        suggestionEl.textContent = label.charAt(0).toUpperCase() + label.slice(1);
      }
    });
});
