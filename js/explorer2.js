let activeCategories = [];
let eventsData = [];

const categoryInfo = {
  
    "Accès": {
    color: "#2a9d8f",
    icon: "fa-hospital"
  },
  "Contexte": {
    color: "#6c757d",
    icon: "fa-landmark"
  },
  "Données et recherche": {
    color: "#4b0082",
    icon: "fa-database"
  },
  "Gouvernance et pilotage": {
    color: "#007b7f",
    icon: "fa-scale-balanced"
  },
  "Promotion et prévention": {
    color: "#e76f51",
    icon: "fa-heart-pulse"
  },
  "Protection et gestion des risques": {
    color: "#f4a261",
    icon: "fa-shield-alt"
  }
};

fetch("data/events.json")
  .then(response => response.json())
  .then(events => {
    eventsData = events;
    generateCategoryFilters();
    renderTimeline(eventsData, "desc");
  })
  .catch(err => console.error("Erreur chargement JSON:", err));

function renderTimeline(events, order = "desc") {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = "";

  const sorted = [...events].sort((a, b) =>
    order === "asc" ? a.year - b.year : b.year - a.year
  );

 const filtered = activeCategories.length
  ? sorted.filter(event =>
      event.categories?.some(cat => activeCategories.includes(cat))
    )
  : sorted;

  filtered.forEach(event => {
    const div = document.createElement("div");
    div.classList.add("event", event.year % 2 === 0 ? "left" : "right");

    const catIcons = event.categories?.map(cat => {
      const info = categoryInfo[cat];
      return info
        ? `<span class="cat-icon" title="${cat}" style="color:${info.color};"><i class="fas ${info.icon}"></i></span>`
        : '';
    }).join("");

    div.innerHTML = `
      <div class="year">${event.year}</div>
      <div class="title">${event.title}</div>
      ${event.shortDescription ? `<div class="desc">${event.shortDescription}</div>` : ''}
      <div class="categories">${catIcons}</div>
    `;

    timeline.appendChild(div);
  });
}

// Tri dynamique
document.querySelectorAll('input[name="sortOrder"]').forEach(radio => {
  radio.addEventListener("change", () => {
    const selected = document.querySelector('input[name="sortOrder"]:checked').value;
    renderTimeline(eventsData, selected);
  });
});

document.addEventListener("DOMContentLoaded", () => {
  // Gestion de la modale "À propos des catégories"
  const modal = document.getElementById("category-modal");
  const openBtn = document.getElementById("category-info-btn");
  const closeBtn = document.getElementById("close-modal");

  if (openBtn && modal) {
    openBtn.addEventListener("click", () => {
      modal.classList.remove("hidden");
    });
  }

  if (closeBtn && modal) {
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
const categoryRadioGroup = document.getElementById("categoryRadioGroup");

function generateCategoryRadios() {
  const entries = Object.entries(categoryInfo).sort((a, b) => a[0].localeCompare(b[0]));

  entries.forEach(([cat, info]) => {
    const label = document.createElement("label");
    label.className = "cat-radio";

    label.innerHTML = `
      <input type="radio" name="categoryFilter" value="${cat}">
      <i class="fas ${info.icon}" style="color: ${info.color}; margin-right: 6px;"></i>
      <span class="cat-label">${cat}</span>
    `;

    categoryRadioGroup.appendChild(label);
  });

  // Gestion du filtrage
  categoryRadioGroup.addEventListener("change", () => {
    const selected = document.querySelector('input[name="categoryFilter"]:checked');
    activeCategories = selected ? [selected.value] : [];
    renderTimeline(eventsData, document.querySelector('input[name="sortOrder"]:checked').value);

    // Mettre à jour le gras
    document.querySelectorAll(".cat-radio").forEach(label => {
      label.classList.remove("selected");
    });
    if (selected) {
      selected.closest("label").classList.add("selected");
    }
  });
}
