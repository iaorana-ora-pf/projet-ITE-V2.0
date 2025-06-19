/*
 Nettoyé automatiquement par CodeNinja 🥷
 Fichier : explorer.js
 Date : Juin 2025
 Ne pas modifier cet en-tête à la main.
*/

// === Fichier JavaScript complet avec catégories fixes et gestion du filtre ===
let events = {};
let currentEvents = [];
let currentIndex = -1;
let isAdmin = false; // devient vrai quand tu actives l'interface
function toggleAdmin() {
  const pass = prompt("Mot de passe admin :");
  if (pass === "Bazinga") {
    isAdmin = true;
    document.getElementById("admin-panel").style.display = "block";
  } else {
    alert("Mot de passe incorrect");
  }
}
function normalize(str) {
  return (str || "")
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
// Catégories fixes avec icônes associées
const categoryColors = {
  "Gouvernance et pilotage stratégique": "#007b7f",
  "Données surveillance et recherche": "#4b0082",
  "Promotion de la santé et prévention": "#e76f51",
  "Protection sanitaire et gestion des risques": "#f4a261",
  "Accès aux services et aux moyens": "#2a9d8f",
  "Contexte": "#6c757d"
};

const fixedCategoryIcons = {
  "Gouvernance et pilotage stratégique": "fa-scale-balanced",
  "Données surveillance et recherche": "fa-database",
  "Promotion de la santé et prévention": "fa-heart-pulse",
  "Protection sanitaire et gestion des risques": "fa-shield-alt",
  "Accès aux services et aux moyens": "fa-hospital",
  "Contexte": "fa-landmark"
};
const fixedCategories = Object.keys(categoryColors);

function getIconForCategory(cat) {
  const icon = fixedCategoryIcons[cat] || "fa-circle";
  const color = categoryColors[cat] || "#888";
  return `<i class="fas ${icon}" title="${cat}" style="margin-right:4px;color:${color}"></i>`;
}

fetch('explorer.json')
  .then(r => r.json())
  .then(data => {
    events = data; // ✅ on utilise le JSON directement, sans duplication pluriannuelle
    initDropdowns();
    updateTimeline();
    document.getElementById("event-details-container").innerHTML = `<p style="text-align:center; font-style:italic; color:#555;">  Cliquez sur un événement pour accéder à sa fiche détaillée puis utilisez les flèches “◀” et “▶” pour naviguer entre les événements (filtrés).</p>`;
  })
  .catch(err => console.error("Erreur de chargement :", err));

function getFilters() {
  const getChecked = cls => [...document.querySelectorAll('.' + cls + '-filter:checked')].map(e => e.value);
  return {
    categories: getChecked("category"),
    keywords: getChecked("keyword"),
    search: normalize(document.getElementById("searchInput").value)
  };
}

function updateTimeline() {
  const container = document.getElementById("timeline");
  container.innerHTML = "";
  const filters = getFilters();

  for (const year in events) {
    const filtered = events[year].filter(e =>
      (!filters.categories.length || (Array.isArray(e.category) ? e.category.some(c => filters.categories.includes(c)) : filters.categories.includes(e.category))) &&
      (!filters.keywords.length || filters.keywords.some(k => e.keywords.includes(k))) &&
   (!filters.search || (
  normalize(e.name).includes(filters.search) ||
  normalize(e.description).includes(filters.search) ||
  (Array.isArray(e.keywords) && e.keywords.some(k => normalize(k).includes(filters.search))) ||
  (Array.isArray(e.sources) && e.sources.some(s => normalize(s).includes(filters.search))) ||
  (Array.isArray(e.category) ? e.category.some(c => normalize(c).includes(filters.search)) : normalize(e.category).includes(filters.search)) ||
  normalize(e.start).includes(filters.search) ||
  normalize(e.end).includes(filters.search)
))
    );

    if (filtered.length) {
      const block = document.createElement("div");
      block.className = "year-block";
      block.innerHTML = `
      <h3 class="timeline-year">${year}</h3>
        <ul class="event-grid">
          ${filtered.map((ev, i) => {
            const id = `event-${year}-${i}`;
            window[id] = ev;
            const isContext = Array.isArray(ev.category) ? ev.category.includes("Contexte") : ev.category === "Contexte";
            const contextClass = isContext ? "context-event" : "";
           const iconHTML = (Array.isArray(ev.category) ? ev.category : [ev.category])
  .map(cat => getIconForCategory(cat)).join("");
            return `<li class="${contextClass}" data-uid="${ev.name}-${year}" onclick='showDetails(window["${id}"], "${year}")'>${iconHTML}<span>${ev.name}</span></li>`;
          }).join("")}
        </ul>`;
      container.appendChild(block);
    }
  }
  updateDependentFilters();
  updateActiveFilterBadges();
const total = Object.values(events).flat().filter(e =>
  (!filters.categories.length || (Array.isArray(e.category) ? e.category.some(c => filters.categories.includes(c)) : filters.categories.includes(e.category))) &&
  (!filters.keywords.length || filters.keywords.some(k => e.keywords.includes(k))) &&
  (!filters.search || (
    e.name?.toLowerCase().includes(filters.search) ||
    e.description?.toLowerCase().includes(filters.search) ||
    (Array.isArray(e.keywords) && e.keywords.some(k => k.toLowerCase().includes(filters.search))) ||
    (Array.isArray(e.sources) && e.sources.some(s => s.toLowerCase().includes(filters.search))) ||
    (Array.isArray(e.category) ? e.category.join(',').toLowerCase() : e.category.toLowerCase()).includes(filters.search) ||
    `${e.start}`.includes(filters.search) || `${e.end}`.includes(filters.search)
  ))
).length;

const countEl = document.getElementById("event-count-number");
if (countEl) {
  countEl.textContent = total;
}
const countText = document.getElementById("event-count-text");
if (countText) {
  if (total === 0) {
    countText.innerHTML = "Aucun événement ne correspond aux critères sélectionnés.";
  } else if (total === 1) {
    countText.innerHTML = `La frise contient <strong>1</strong> événement.`;
  } else {
    countText.innerHTML = `La frise contient <strong>${total}</strong> événements.`;
  }
}
}

function updateDependentFilters() {
  const filters = getFilters();
  const visibleKeywords = new Set();
  const visibleCategories = new Set();

  // Étape 1 : on collecte uniquement les catégories/keywords visibles
  Object.values(events).flat().forEach(ev => {
    const matchCat = !filters.categories.length || (Array.isArray(ev.category) ? ev.category.some(cat => filters.categories.includes(cat)) : filters.categories.includes(ev.category));
    const matchKey = !filters.keywords.length || ev.keywords.some(k => filters.keywords.includes(k));

    if (matchCat && matchKey) {
      ev.keywords.forEach(k => visibleKeywords.add(k));
      (Array.isArray(ev.category) ? ev.category : [ev.category]).forEach(cat => visibleCategories.add(cat));
    }
  });

  // Étape 2 : appliquer les couleurs – toutes noires si aucun filtre actif
  const allClear = filters.categories.length === 0 && filters.keywords.length === 0;

  document.querySelectorAll(".keyword-filter").forEach(cb => {
    cb.parentElement.style.color = allClear || visibleKeywords.has(cb.value) ? "black" : "#999";
  });

  document.querySelectorAll(".category-filter").forEach(cb => {
    cb.parentElement.style.color = allClear || visibleCategories.has(cb.value) ? "black" : "#999";
  });
}

function initDropdowns() {
  const keywords = new Set();

 Object.values(events).flat().forEach(e => {
  e.keywords.forEach(k => keywords.add(k));
  });

   document.getElementById("categoryDropdown").innerHTML =
    fixedCategories
  .slice().sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }))
  .map(c => {
    const iconHTML = getIconForCategory(c);
    return `<label>
      <input type="checkbox" class="category-filter" value="${c}" onchange="updateTimeline(); updateDependentFilters(); updateActiveFilterBadges()">
      ${iconHTML} ${c}
    </label><br>`;
  }).join("");

  document.getElementById("keywordDropdown").innerHTML =
  Array.from(keywords)
    .sort((a, b) => a.localeCompare(b, 'fr', { sensitivity: 'base' }))
    .map(k => `
      <label><input type="checkbox" class="keyword-filter" value="${k}" onchange="updateTimeline(); updateDependentFilters(); updateActiveFilterBadges()"> ${k}</label><br>
    `).join("");
}

function showDetails(ev, year) {
  currentEvents = collectFilteredEvents();
  currentIndex = currentEvents.findIndex(e => e.uid === ev.uid);
  const container = document.getElementById("event-details-container");

  const catList = (Array.isArray(ev.category) ? ev.category : [ev.category])
    .map(cat => `<li>${getIconForCategory(cat)} ${cat}</li>`).join("");
  const sourceList = (ev.sources || []).map(src => {
    if (typeof src === "object" && src.url) {
      return `<li><a href="${src.url}" target="_blank">${src.label || src.url}</a></li>`;
    } else {
      return `<li>${src}</li>`;
    }
  }).join("");
  const keywordList = (ev.keywords || []).map(k => `• ${k}`).join("<br>");

  container.innerHTML = `
    <h2 style="color:#007b7f; font-size:1.2rem; margin-bottom: 1rem;">${ev.name}</h2>
    <p><strong>Année :</strong> ${ev.start || year}</p>
    <div>
      <strong>Catégorie(s) :</strong>
      <ul style="list-style: none; padding-left: 0; text-align: left;">
        ${catList}
      </ul>
    </div>
    <p><strong>Mots-clés :</strong><br>${keywordList}</p>
    <p><strong>Description :</strong><br>${ev.description || "N/A"}</p>
    <div>
      <strong>Source(s) :</strong>
      ${sourceList ? `<ul style="padding-left: 1rem; text-align: left;">${sourceList}</ul>` : "<p>N/A</p>"}
    </div>
    <div style="display:flex; justify-content: space-between; margin-top: 1.5rem;">
      <button class="button" onclick="navigateEvent(-1)">◀ Précédent</button>
      <button class="button" onclick="navigateEvent(1)">Suivant ▶</button>
    </div>
  `;

  document.querySelectorAll(".year-block li").forEach(li => li.classList.remove("selected-event"));
  const selected = document.querySelector(`li[data-uid="${ev.name}-${year}"]`);
  if (selected) {
    selected.classList.add("selected-event");
    selected.scrollIntoView({ behavior: "smooth", block: "center" });
  }
}
function navigateEvent(dir) {
  if (currentEvents.length === 0 || currentIndex === -1) return;

  const currentUid = currentEvents[currentIndex].uid;
  let nextIndex = currentIndex + dir;

  while (
    nextIndex >= 0 &&
    nextIndex < currentEvents.length &&
    currentEvents[nextIndex].uid === currentUid
  ) {
    nextIndex += dir;
  }

  if (nextIndex >= 0 && nextIndex < currentEvents.length) {
    currentIndex = nextIndex;
    const nextEvent = currentEvents[nextIndex];
    const year = Object.keys(events).find(y =>
      events[y].some(e => e.uid === nextEvent.uid)
    );
    showDetails(nextEvent, year);
  }
}

function collectFilteredEvents() {
  const filters = getFilters();
  return Object.entries(events).flatMap(([year, list]) =>
    list.filter(e =>
      (!filters.categories.length || (Array.isArray(e.category) ? e.category.some(cat => filters.categories.includes(cat)) : filters.categories.includes(e.category))) &&
      (!filters.keywords.length || filters.keywords.some(k => e.keywords.includes(k))) &&
      (!filters.search || (
  normalize(e.name).includes(filters.search) ||
  normalize(e.description).includes(filters.search) ||
  (Array.isArray(e.keywords) && e.keywords.some(k => normalize(k).includes(filters.search))) ||
  (Array.isArray(e.sources) && e.sources.some(s => normalize(s).includes(filters.search))) ||
  (Array.isArray(e.category) ? e.category.some(c => normalize(c).includes(filters.search)) : normalize(e.category).includes(filters.search)) ||
  normalize(e.start).includes(filters.search) ||
  normalize(e.end).includes(filters.search)
))
    )
  );
}

function updateActiveFilterBadges() {
  const filters = getFilters();
  const container = document.getElementById("active-filters");
  const section = document.getElementById("active-filters-section");
  container.innerHTML = "";
  const all = [
    ...filters.categories.map(c => ({ type: "category", value: c })),
    ...filters.keywords.map(k => ({ type: "keyword", value: k }))
  ];
  section.classList.remove("empty");
container.innerHTML = "";

if (all.length === 0) {
  container.innerHTML = '<span style="color:#999;font-style:italic;">Aucun filtre sélectionné</span>';
  section.classList.add("empty");
  return;
}
  all.forEach(({ type, value }) => {
    const badge = document.createElement("span");
    badge.className = "filter-badge";
    badge.innerHTML = `${type === "category" ? "Catégorie" : "Mot-clé"} : ${value} <span class="remove-badge" data-type="${type}" data-value="${value}">&times;</span>`;
    container.appendChild(badge);
  });
  document.querySelectorAll(".remove-badge").forEach(span => {
    span.addEventListener("click", () => {
      const type = span.dataset.type;
      const value = span.dataset.value;
      const selector = `.${type}-filter[value="${value}"]`;
      const cb = document.querySelector(selector);
      if (cb) {
        cb.checked = false;
        updateTimeline();
        updateDependentFilters();
        updateActiveFilterBadges();
      }
    });
  });
}

function resetFilters() {
  document.querySelectorAll("input[type=checkbox]").forEach(cb => cb.checked = false);
  document.getElementById("searchInput").value = "";
  updateTimeline();
  updateActiveFilterBadges();
}
function toggleFilters() {
  const el = document.getElementById("filters");
  el.style.display = (el.style.display === "none" || el.style.display === "") ? "block" : "none";
}
function toggleSidePanel() {
  const panel = document.getElementById('side-panel');
  panel.style.display = (panel.style.display === 'none') ? 'flex' : 'none';
}
function toggleSidePanel() {
  const panel = document.getElementById('side-panel');
  const openBtn = document.getElementById('open-panel-btn');

  if (panel.style.display === 'none') {
    panel.style.display = 'flex';
    openBtn.style.display = 'none';
  } else {
    panel.style.display = 'none';
    openBtn.style.display = 'block';
  }
}
function toggleSidePanel() {
  const layout = document.getElementById("app-layout");
  layout.classList.toggle("sidebar-hidden");
}
function toggleHelpPanel() {
  const panel = document.getElementById('help-panel');
  panel.style.display = (panel.style.display === 'block') ? 'none' : 'block';
}

function toggleHelpModal() {
  const modal = document.getElementById("help-modal");
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

function toggleNewModal() {
  const modal = document.getElementById("new-modal");
  modal.style.display = modal.style.display === "flex" ? "none" : "flex";
}

function toggleCategoryInfo() {
  const box = document.getElementById("category-info-box");
  box.classList.toggle("hidden");
}
function toggleCategoryTooltip(event) {
  event.stopPropagation(); // évite que le clic se propage

  const tooltip = document.getElementById("categoryTooltip");
  const isVisible = !tooltip.classList.contains("hidden");

  document.querySelectorAll(".tooltip-floating").forEach(el => el.classList.add("hidden"));

  if (!isVisible) {
    tooltip.classList.remove("hidden");
    document.addEventListener("click", closeTooltipOnClickOutside);
  }
}

function closeTooltipOnClickOutside(e) {
  const tooltip = document.getElementById("categoryTooltip");
  if (!tooltip.contains(e.target) && !e.target.classList.contains("info-icon")) {
    tooltip.classList.add("hidden");
    document.removeEventListener("click", closeTooltipOnClickOutside);
  }
}
function toggleInfoModal() {
  document.getElementById("infoModal").classList.toggle("hidden");
}
function toggleKeywordModal() {
  document.getElementById("keywordModal").classList.toggle("hidden");
}
function toggleFilters() {
  const content = document.getElementById("filters-content");
  const icon = document.getElementById("filtersArrow");

  content.classList.toggle("filters-collapsed");

  // Change l'icône flèche haut/bas
  if (content.classList.contains("filters-collapsed")) {
    icon.classList.remove("fa-chevron-up");
    icon.classList.add("fa-chevron-down");
  } else {
    icon.classList.remove("fa-chevron-down");
    icon.classList.add("fa-chevron-up");
  }
}
function filterRecent() {
  const output = document.getElementById("admin-output");
  const recentEvents = Object.values(events).flat().filter(ev => {
    if (!ev.added) return false;
    const addedDate = new Date(ev.added);
    return addedDate > new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
  });
  output.innerHTML = `<p><strong>${recentEvents.length}</strong> événements récents trouvés.</p><ul>` +
    recentEvents.map(ev => `<li>${ev.name} (${ev.added})</li>`).join("") + "</ul>";
}

function checkBrokenLinks() {
  const output = document.getElementById("admin-output");

  const links = Object.values(events).flatMap(ev =>
    (ev.sources || [])
      .map(s => typeof s === "object" && s.url ? s.url : s)
      .filter(url => typeof url === "string" && url.startsWith("http"))
  );

  let checked = 0;
  let broken = [];

  output.innerHTML = `<span style="color: #007b7f;"><i class="fa fa-spinner fa-spin"></i> Vérification des liens en cours...</span>`;

  links.forEach(link => {
    fetch(link, { method: 'HEAD' })
      .then(res => {
        if (!res.ok) {
          broken.push(link);
        }
      })
      .catch(() => broken.push(link)) // lien inaccessible ou CORS bloqué
      .finally(() => {
        checked++;
        if (checked === links.length) {
          output.innerHTML = broken.length === 0
            ? "✅ Tous les liens semblent valides."
            : `<p><strong>${broken.length}</strong> lien(s) potentiellement cassé(s) :</p><ul>` +
              broken.map(b => `<li><a href="${b}" target="_blank">${b}</a></li>`).join("") + "</ul>" +
              `<p style="font-size:0.9rem; color:#666; margin-top: 1rem;">
                ⚠️ Certains liens peuvent être bloqués à cause des restrictions de sécurité du navigateur (CORS). Testez-les manuellement si vous avez un doute.
              </p>`;
        }
      });
  });
}
// Obtenir les éléments du DOM
const popup = document.getElementById("welcomePopup");
const closePopupButton = document.getElementById("closePopup");

// Fonction pour fermer la fenêtre flottante
function closePopup() {
  popup.classList.add("hide");
  // Afficher la frise ou tout autre contenu après la fermeture
  // Par exemple, tu peux faire apparaître un élément supplémentaire ou activer des fonctionnalités
}

 window.addEventListener("DOMContentLoaded", function () {
    const popup = document.getElementById("welcomePopup");
    const exploreLink = document.getElementById("exploreBtn");

    if (popup && exploreLink) {
      exploreLink.addEventListener("click", function (e) {
        e.preventDefault(); // évite le saut brutal

        // Ajoute la classe 'hide' pour animer la fermeture
        popup.classList.add("hide");

        // Navigue vers la frise après la transition
        setTimeout(() => {
          window.location.hash = "frise";
        }, 400); // délai pour laisser le temps à l'animation CSS
      });
    }
  });
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("searchInput");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      updateTimeline(); // Met à jour les résultats dès que l'utilisateur tape
    });
  }
});
// ➕ Affiche le total des événements dans la page d'accueil
document.addEventListener("DOMContentLoaded", function () {
  const countEl = document.getElementById("event-count-number");
  if (countEl) {
    fetch('explorer.json')
      .then(response => response.json())
      .then(data => {
        const total = Object.values(data).flat().length;
        countEl.textContent = total;
      })
      .catch(err => console.error("Erreur lors du chargement des événements :", err));
  }
});
