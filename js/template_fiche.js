const categoryInfo = {
  "Accès": { color: "#2a9d8f", icon: "fa-hospital" },
  "Contexte": { color: "#6c757d", icon: "fa-landmark" },
  "Données et recherche": { color: "#4b0082", icon: "fa-database" },
  "Gouvernance et pilotage": { color: "#007b7f", icon: "fa-scale-balanced" },
  "Promotion et prévention": { color: "#e76f51", icon: "fa-heart-pulse" },
  "Protection et gestion des risques": { color: "#f4a261", icon: "fa-shield-alt" }
};

document.addEventListener("DOMContentLoaded", () => {
  fetch("../events.json")
    .then(res => res.json())
    .then(events => {
      const slug = window.location.pathname.split("/").pop().replace(".html", "");
      const event = events.find(ev => ev.slug === slug);
      if (!event) return;

      // ✅ Affiche uniquement les catégories du JSON avec icône & couleur
      const catEl = document.getElementById("categories-with-icons");
      if (catEl && event.categories) {
        catEl.innerHTML = event.categories.map(cat => {
          const info = categoryInfo[cat] || {};
          return `<span class="categories" title="${cat}" style="color:${info.color || '#000'};">
                    <i class="fas ${info.icon || 'fa-tag'}"></i> ${cat}
                  </span>`;
        }).join(" ");
      }

      // ✅ Affiche les liens "Pour aller plus loin" comme Sources
      const moreEl = document.getElementById("more-links");
      if (moreEl && event.more && event.more.length > 0) {
        moreEl.innerHTML = `
          <div class="section">
            <strong>📘 Pour aller plus loin :</strong><br />
            ${event.more.map(m => `<a href="${m.url}" target="_blank">${m.label}</a><br />`).join("")}
          </div>
        `;
      }
    });
});
