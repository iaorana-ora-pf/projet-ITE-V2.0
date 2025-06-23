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
}).join("<br>");
      }

      // ✅ Affiche les liens "Pour aller plus loin"
      const moreEl = document.getElementById("more-links");
      if (moreEl && event.more?.length > 0) {
        moreEl.innerHTML = event.more.map(m => 
          `<li><a href="${m.url}" target="_blank">${m.label}</a></li>`
        ).join("");
      }

// 🧠 Gestion du modal d'infos Mots-clés
const motsModal = document.getElementById("mots-modal");
const openKeywordsBtn = document.getElementById("keywords-info-btn");
const closeKeywordsBtn = document.getElementById("close-keywords-modal");

if (motsModal && openKeywordsBtn) {
  openKeywordsBtn.addEventListener("click", () => {
    motsModal.classList.remove("hidden");
  });
}
if (motsModal && closeKeywordsBtn) {
  closeKeywordsBtn.addEventListener("click", () => {
    motsModal.classList.add("hidden");
  });
}
window.addEventListener("click", (e) => {
  if (e.target === motsModal) {
    motsModal.classList.add("hidden");
  }
});
      
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

      // === Navigation avec filtres depuis l'URL ===
const urlParams = new URLSearchParams(window.location.search);
const filterCat = urlParams.get("cat");
const filterKw = urlParams.get("kw");

if (filterCat || filterKw) {
  const matches = events.filter(ev => {
    const hasCat = filterCat ? ev.categories?.includes(filterCat) : true;
    const hasKw = filterKw ? ev.keywords?.includes(filterKw) : true;
    return hasCat && hasKw;
  });

  const currentIndex = matches.findIndex(ev => ev.slug === slug);
  const prevEv = currentIndex > 0 ? matches[currentIndex - 1] : null;
  const nextEv = currentIndex < matches.length - 1 ? matches[currentIndex + 1] : null;

  const leftArrow = document.querySelector(".nav-arrow[href*='{prev_link}']");
  const rightArrow = document.querySelector(".nav-arrow[href*='{next_link}']");

  if (leftArrow && prevEv) {
    leftArrow.href = `${prevEv.slug}.html?cat=${filterCat || ""}&kw=${filterKw || ""}`;
  } else if (leftArrow) {
    leftArrow.href = "#";
  }

  if (rightArrow && nextEv) {
    rightArrow.href = `${nextEv.slug}.html?cat=${filterCat || ""}&kw=${filterKw || ""}`;
  } else if (rightArrow) {
    rightArrow.href = "#";
  }
}
    });
});
