let activeThemes = [];
let eventsData = [];
let searchQuery = "";
function normalize(str) {
  return str
    .toLowerCase()
    .normalize("NFD")               // décompose les accents
    .replace(/[\u0300-\u036f]/g, "") // supprime les accents
    .replace(/s\b/g, "")             // supprime les 's' en fin de mot
    .replace(/[^a-z0-9 ]/g, "");     // supprime ponctuation
}

const themeInfo = {
   "Accès aux soins": { // rouge
        "color": "#C00000",
        "icon": "fa-solid fa-syringe"
    },
    "Contexte historique et institutionnel": {
        "color": "#404040",  // gris
        "icon": "fa-solid fa-landmark"
    },
    "Gouvernance et politiques": {
        "color": "#05676C",  // bleu vert
        "icon": "fa-solid fa-scale-balanced"
    },
    "Indicateurs": {
        "color": "#0B5294",  // bleu 
        "icon": "fa-solid fa-list-ol"
    },
    "Pathologies": {
        "color": "#A66500",  // orange
        "icon": "fa-solid fa-virus"
    },
    "Prévention et promotion": {
        "color": "#005E00",  // vert
        "icon": "fa-solid fa-triangle-exclamation"
    },
    "Professionnels de santé": {
        "color": "#7030A0",  // violet
        "icon": "fa-solid fa-stethoscope"
    },
    "Protection sociale": {
        "color": "#003400",  // vert forêt
        "icon": "fa-solid fa-people-group"
    },
    "Structures de santé": {
        "color": "#787800",  // marron clair
        "icon": "fa-solid fa-hospital"
    }
}

document.addEventListener("DOMContentLoaded", () => {
  fetch("./events.json")
    .then(res => res.json())
  .then(events => {
  eventsData = events;
  generateThemeCheckboxes();
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
    document.querySelectorAll('#themeCheckboxGroup input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
    });
    activeThemes = [];
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

// En mode normal, on filtre les événements non validés
const filtered = sorted.filter(event => {
  const matchesCategory = activeThemes.length === 0 ||
    event.theme?.some(cat => activeThemes.includes(cat));

const searchableFields = [
  event.title || "",
  event.description || "",
  ...(event.theme || []),
  event.year?.toString() || ""
].join(" ").toLowerCase();

  const matchesSearch = normalize(searchableFields).includes(normalize(searchQuery));

  return matchesCategory && matchesSearch;
});

  document.getElementById("timeline-header").textContent =
    `La frise contient ${filtered.length} événements`;

  const grouped = {};
  filtered.forEach(event => {
    if (!grouped[event.year]) grouped[event.year] = [];
    grouped[event.year].push(event);
  });

  timeline.innerHTML = "";

  const sortedYears = Object.keys(grouped).sort((a, b) =>
    order === "asc" ? a - b : b - a
  );

  sortedYears.forEach(year => {
  const items = grouped[year];

  const groupDiv = document.createElement("div");
  groupDiv.className = "timeline-group"; // <-- plus de left/right

  const yearLabel = document.createElement("div");
  yearLabel.className = "year-label";
  yearLabel.textContent = year;
yearLabel.setAttribute("data-year", year);
    
  const dot = document.createElement("div");
  dot.className = "timeline-dot";

  const eventsBlock = document.createElement("div");
  eventsBlock.className = "year-block";

  items.forEach(ev => {
    const evDiv = document.createElement("div");
    evDiv.className = "event-item";
    evDiv.onclick = () => window.open(`/${ev.id}.html`, "_blank");

    const icons = (ev.theme || []).map(cat => {
      const info = themeInfo[cat];
      return info
        ? `<span class="cat-icon" title="${cat}" style="color:${info.color};"><i class="fas ${info.icon}"></i></span>`
        : '';
    }).join("");

    evDiv.innerHTML = `
  <div class="event-title">
    ${ev.title}
    <span class="event-icons">${icons}</span>
  </div>`;
    eventsBlock.appendChild(evDiv);
  });

  // Toujours la même structure
  groupDiv.appendChild(yearLabel);
  groupDiv.appendChild(dot);
  groupDiv.appendChild(eventsBlock);

  timeline.appendChild(groupDiv);
});

}




function generateThemeCheckboxes() {
  const group = document.getElementById("themeCheckboxGroup");
  if (!group) return;

  group.innerHTML = "";

  Object.entries(themeInfo).forEach(([cat, info]) => {
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
    activeThemes = [...group.querySelectorAll("input:checked")].map(cb => cb.value);
    const sortValue = document.querySelector('input[name="sortOrder"]:checked').value;
    renderTimeline(eventsData, sortValue);
    document.querySelectorAll(".cat-check").forEach(label => {
      const input = label.querySelector("input");
      label.classList.toggle("selected", input.checked);
    });
  });
}
document.addEventListener("DOMContentLoaded", () => {
  const adminBtn = document.getElementById("admin-toggle-btn");
  if (adminBtn) {
    adminBtn.addEventListener("click", () => {
      const code = prompt("Code admin ?");
      if (code === "bazinga") {
        localStorage.setItem("isAdmin", "true");
        window.location.reload();
      } else {
        alert("Code incorrect");
      }
    });
  }
});
document.addEventListener("DOMContentLoaded", () => {
  const adminBtn = document.getElementById("admin-access-btn");
  const adminModal = document.getElementById("admin-modal");
  const closeModal = document.getElementById("close-admin-modal");
  const submitBtn = document.getElementById("validate-admin-code");
  const errorMsg = document.getElementById("admin-error");

  if (adminBtn) {
    adminBtn.addEventListener("click", () => {
      adminModal.classList.remove("hidden");
      errorMsg.textContent = "";
      document.getElementById("admin-code-input").value = "";
    });

    closeModal.addEventListener("click", () => {
      adminModal.classList.add("hidden");
    });

    window.addEventListener("click", (e) => {
      if (e.target === adminModal) {
        adminModal.classList.add("hidden");
      }
    });

    submitBtn.addEventListener("click", () => {
      const code = document.getElementById("admin-code-input").value.trim();

      if (code === "bazinga") {
        // Recharge la page avec le paramètre admin
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set("admin", "true");
        window.location.href = newUrl.toString();
      } else {
        errorMsg.textContent = "Code incorrect.";
      }
    });
  }
});
