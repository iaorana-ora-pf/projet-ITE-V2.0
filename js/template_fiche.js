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
      if (!event) {
        console.warn("Événement introuvable pour ce slug :", slug);
        return;
      }

      // ✅ Affiche les catégories avec icône et couleur
      const catEl = document.getElementById("categories-with-icons");
      if (catEl && event.categories) {
        catEl.innerHTML = event.categories.map(cat => {
          const info = categoryInfo[cat] || {};
          return `<span class="cat-label" title="${cat}">
          <i class="fas ${info.icon || 'fa-tag'}" style="color:${info.color || '#666'};"></i> ${cat}
        </span>`;
        }).join(" ");
      }

      // ✅ Affiche les liens "Pour aller plus loin"
      const moreEl = document.getElementById("more-links");
      if (moreEl && event.more?.length > 0) {
        moreEl.innerHTML = event.more.map(m => 
          `<li><a href="${m.url}" target="_blank">${m.label}</a></li>`
        ).join("");
      }

      // ✅ Gestion du modal catégorie
      const modal = document.getElementById("category-modal");
      const openBtn = document.getElementById("category-info-btn");
      const closeBtn = document.getElementById("close-category-modal");

      if (modal && openBtn) {
        openBtn.addEventListener("click", () => {
          modal.classList.remove("hidden");
        });
      }
      if (modal && closeBtn) {
        closeBtn.addEventListener("click", () => {
          modal.classList.add("hidden");
        });
      }
      window.addEventListener("click", (e) => {
        if (e.target === modal) {
          modal.classList.add("hidden");
        }
      });
    });
});
