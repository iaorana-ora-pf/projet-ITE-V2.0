<script>
const categoryInfo = {
  "Accès": { color: "#2a9d8f", icon: "fa-hospital" },
  "Contexte": { color: "#6c757d", icon: "fa-landmark" },
  "Données et recherche": { color: "#4b0082", icon: "fa-database" },
  "Gouvernance et pilotage": { color: "#007b7f", icon: "fa-scale-balanced" },
  "Promotion et prévention": { color: "#e76f51", icon: "fa-heart-pulse" },
  "Protection et gestion des risques": { color: "#f4a261", icon: "fa-shield-alt" }
};

document.addEventListener("DOMContentLoaded", () => {
  fetch("../events.json")  // adapt path if needed
    .then(res => res.json())
    .then(events => {
      const slug = window.location.pathname.split("/").pop().replace(".html", "");
      const event = events.find(ev => ev.slug === slug);
      if (!event) return;

      // 🎯 Afficher les catégories avec icônes
      const catContainer = document.getElementById("categories-container");
      if (catContainer && event.categories) {
        catContainer.innerHTML = event.categories.map(cat => {
          const info = categoryInfo[cat] || {};
          return `<span class="categories" title="${cat}" style="color:${info.color || '#000'}">
                    <i class="fas ${info.icon || 'fa-tag'}"></i> ${cat}
                  </span>`;
        }).join(" ");
      }

      // 📚 Générer section "Pour aller plus loin"
      const moreLinks = event.more || [];
      const moreContainer = document.getElementById("more-links");
      if (moreContainer && moreLinks.length > 0) {
        moreContainer.innerHTML = "<ul>" + moreLinks.map(item =>
          `<li><a href="${item.url}" target="_blank">${item.label}</a></li>`
        ).join("") + "</ul>";
      }
    });
});
</script>
