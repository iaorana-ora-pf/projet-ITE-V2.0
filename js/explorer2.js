let eventsData = [];
let activeCategory = null;

const categoryInfo = {
  "Gouvernance et pilotage stratégique": {
    color: "#007b7f",
    icon: "fa-scale-balanced"
  },
  "Données surveillance et recherche": {
    color: "#4b0082",
    icon: "fa-database"
  },
  "Promotion de la santé et prévention": {
    color: "#e76f51",
    icon: "fa-heart-pulse"
  },
  "Protection sanitaire et gestion des risques": {
    color: "#f4a261",
    icon: "fa-shield-alt"
  },
  "Accès aux services et aux moyens": {
    color: "#2a9d8f",
    icon: "fa-hospital"
  },
  "Contexte": {
    color: "#6c757d",
    icon: "fa-landmark"
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

  const filtered = activeCategory
    ? sorted.filter(event => event.categories?.includes(activeCategory))
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
document.getElementById("sortOrder").addEventListener("change", (e) => {
  renderTimeline(eventsData, e.target.value);
});

// Générer les boutons de filtre
function generateCategoryFilters() {
  const container = document.querySelector(".category-filters");
  if (!container) return;

  Object.entries(categoryInfo).forEach(([cat, info]) => {
    const btn = document.createElement("button");
    btn.textContent = cat;
    btn.className = "category-btn";
    btn.style.backgroundColor = info.color;
    btn.dataset.cat = cat;
    container.appendChild(btn);
  });

  container.addEventListener("click", (e) => {
    if (e.target.matches("button")) {
      const selected = e.target.dataset.cat;
      activeCategory = (activeCategory === selected) ? null : selected;
      renderTimeline(eventsData, document.getElementById("sortOrder").value);
    }
  });
}
