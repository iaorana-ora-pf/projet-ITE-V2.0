let activeCategories = [];
let eventsData = [];
let searchQuery = "";

const categoryInfo = {
  "Accès": { color: "#2a9d8f", icon: "fa-hospital" },
  "Contexte": { color: "#6c757d", icon: "fa-landmark" },
  "Données et recherche": { color: "#4b0082", icon: "fa-database" },
  "Gouvernance et pilotage": { color: "#007b7f", icon: "fa-scale-balanced" },
  "Promotion et prévention": { color: "#e76f51", icon: "fa-heart-pulse" },
  "Protection et gestion des risques": { color: "#f4a261", icon: "fa-shield-alt" }
};

document.addEventListener("DOMContentLoaded", () => {
  fetch("data/events.json")
    .then(res => res.json())
    .then(events => {
      eventsData = events;
      generateCategoryCheckboxes();
      renderTimeline(eventsData, "desc");
    });

  document.querySelectorAll('input[name="sortOrder"]').forEach(radio => {
    radio.addEventListener("change", () => {
      const selected = document.querySelector('input[name="sortOrder"]:checked').value;
      renderTimeline(eventsData, selected);
    });
  });

  document.getElementById("searchInput").addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    const sortValue = document.querySelector('input[name="sortOrder"]:checked').value;
    renderTimeline(eventsData, sortValue);
  });

  document.getElementById("resetFilters").addEventListener("click", () => {
    document.querySelectorAll('#categoryCheckboxGroup input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
    });
    activeCategories = [];
    searchQuery = "";
    document.getElementById("searchInput").value = "";
    renderTimeline(eventsData, document.querySelector('input[name="sortOrder"]:checked').value);
    document.querySelectorAll(".cat-check").forEach(label => label.classList.remove("selected"));
  });

  const modal = document.getElementById("category-modal");
  const openBtn = document.getElementById("category-info-btn");
  const closeBtn = document.getElementById("close-modal");

  if (openBtn && modal) openBtn.addEventListener("click", () => modal.classList.remove("hidden"));
  if (closeBtn && modal) closeBtn.addEventListener("click", () => modal.classList.add("hidden"));
  window.addEventListener("click", (e) => {
    if (e.target === modal) modal.classList.add("hidden");
  });
});

function renderTimeline(events, order = "desc") {
  const timeline = document.getElementById("timeline");
  if (!timeline) return;

  const sorted = [...events].sort((a, b) =>
    order === "asc" ? a.year - b.year : b.year - a.year
  );

  const filtered = sorted.filter(event => {
    const matchesCategory = activeCategories.length === 0 ||
      event.categories?.some(cat => activeCategories.includes(cat));

    const searchableFields = [
      event.title,
      ...(event.categories || []),
      ...(event.keywords || []),
      event.year.toString()
    ].join(" ").toLowerCase();

    return matchesCategory && searchableFields.includes(searchQuery);
  });

  document.getElementById("timeline-header").textContent =
    `La frise contient ${filtered.length} événements`;

  const grouped = {};
  filtered.forEach(event => {
    if (!grouped[event.year]) grouped[event.year] = [];
    grouped[event.year].push(event);
  });

  timeline.innerHTML = "";
  for (const [year, items] of Object.entries(grouped)) {
    const yearDiv = document.createElement("div");
    yearDiv.className = "year-block";

    const yearTitle = document.createElement("div");
    yearTitle.className = "year-title";
    yearTitle.textContent = year;
    yearDiv.appendChild(yearTitle);

    items.forEach(ev => {
      const evDiv = document.createElement("div");
      evDiv.className = "event-item";
      evDiv.onclick = () => window.open(`details/${ev.id}.html`, "_blank");

      const icons = (ev.categories || []).map(cat => {
        const info = categoryInfo[cat];
        return info
          ? `<span class="cat-icon" title="${cat}" style="color:${info.color};"><i class="fas ${info.icon}"></i></span>`
          : '';
      }).join("");

      evDiv.innerHTML = `
        <div class="event-title">${ev.title}<span class="event-icons">${icons}</span></div>
      `;

      yearDiv.appendChild(evDiv);
    });

    timeline.appendChild(yearDiv);
  }
}

function generateCategoryCheckboxes() {
  const group = document.getElementById("categoryCheckboxGroup");
  if (!group) return;

  group.innerHTML = "";

  Object.entries(categoryInfo).forEach(([cat, info]) => {
    const label = document.createElement("label");
    label.className = "cat-check";
    label.innerHTML = `
      <input type="checkbox" value="${cat}">
      <span>${cat}</span>
      <i class="fas ${info.icon}" style="color: ${info.color}; margin-left: 4px;"></i>
    `;
    group.appendChild(label);
  });

  group.addEventListener("change", () => {
    activeCategories = [...group.querySelectorAll("input:checked")].map(cb => cb.value);
    const sortValue = document.querySelector('input[name="sortOrder"]:checked').value;
    renderTimeline(eventsData, sortValue);

    document.querySelectorAll(".cat-check").forEach(label => {
      const input = label.querySelector("input");
      label.classList.toggle("selected", input.checked);
    });
  });
}
