let activeCategories = [];
let eventsData = [];

const categoryInfo = {
  "Accès": { color: "#2a9d8f", icon: "fa-hospital" },
  "Contexte": { color: "#6c757d", icon: "fa-landmark" },
  "Données et recherche": { color: "#4b0082", icon: "fa-database" },
  "Gouvernance et pilotage": { color: "#007b7f", icon: "fa-scale-balanced" },
  "Promotion et prévention": { color: "#e76f51", icon: "fa-heart-pulse" },
  "Protection et gestion des risques": { color: "#f4a261", icon: "fa-shield-alt" }
};

fetch("data/events.json")
  .then(res => res.json())
  .then(events => {
    eventsData = events;
    generateCategoryCheckboxes();
    renderTimeline(eventsData, "desc");
  });

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

// Tri
document.querySelectorAll('input[name="sortOrder"]').forEach(radio => {
  radio.addEventListener("change", () => {
    const selected = document.querySelector('input[name="sortOrder"]:checked').value;
    renderTimeline(eventsData, selected);
  });
});

// ✅ Cases à cocher pour les catégories
function generateCategoryCheckboxes() {
  const group = document.getElementById("categoryCheckboxGroup");
  if (!group) return;

  Object.entries(categoryInfo).forEach(([cat, info]) => {
    const label = document.createElement("label");
    label.className = "cat-check";

    label.innerHTML = `
      <input type="checkbox" value="${cat}">
      <i class="fas ${info.icon}" style="color: ${info.color};"></i>
      <span>${cat}</span>
    `;

    group.appendChild(label);
  });

  group.addEventListener("change", () => {
    activeCategories = [...group.querySelectorAll("input:checked")].map(cb => cb.value);
    const sortValue = document.querySelector('input[name="sortOrder"]:checked').value;
    renderTimeline(eventsData, sortValue);
  });
  document.querySelectorAll(".cat-check").forEach(label => {
  const input = label.querySelector("input");
  if (input.checked) {
    label.classList.add("selected");
  } else {
    label.classList.remove("selected");
  }
});
}
