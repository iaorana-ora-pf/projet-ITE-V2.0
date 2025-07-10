const isAdmin = new URLSearchParams(window.location.search).get("admin") === "true";
let isListView = false;
let currentSort = "az"; // Tri par défaut

async function loadDocuments() {
  const response = await fetch("bibliotheque.json");
  let documents = await response.json();

  // Tri
  documents.sort((a, b) => {
    return currentSort === "az"
      ? a.label.localeCompare(b.label)
      : b.label.localeCompare(a.label);
  });

  const container = document.getElementById("bibli-container");
  container.innerHTML = "";
  container.classList.toggle("list-mode", isListView);

  documents.forEach((doc) => {
    let element;

    if (isListView) {
      element = document.createElement("a");
      element.href = doc.url;
      element.className = "doc-list-item";
      element.textContent = doc.label;
      element.target = "_blank";
    } else {
      const link = document.createElement("a");
link.href = doc.url;
link.target = "_blank";
link.className = "bibli-card"; // Le lien devient la carte entière
link.style.textDecoration = "none"; // retire soulignement

const title = document.createElement("h2");
title.className = "doc-title";
title.textContent = doc.label;

const img = document.createElement("img");
img.src = doc.image;
img.alt = "Illustration du document";
img.className = "doc-img";

link.appendChild(title);
link.appendChild(img);
element = link;

    }

    container.appendChild(element);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("search-input");
  const toggleViewBtn = document.getElementById("toggle-view");
  const toggleSortBtn = document.getElementById("toggle-sort");
 const clearBtn = document.getElementById("clear-search"); // 👉 AJOUT ICI
  clearBtn.addEventListener("click", () => {
    searchInput.value = "";
    searchInput.dispatchEvent(new Event("input")); // relance le filtre
  });
  loadDocuments();

  // 🔍 Recherche
  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll("#bibli-container > *").forEach((el) => {
      el.style.display = el.textContent.toLowerCase().includes(query) ? "" : "none";
    });
  });

  // 🔄 Vue Grille / Liste
  toggleViewBtn.addEventListener("click", () => {
    isListView = !isListView;
    toggleViewBtn.textContent = isListView ? "Vue en grille" : "Vue en liste";

    loadDocuments();
  });

  // 🔃 Tri A ↔ Z
  toggleSortBtn.addEventListener("click", () => {
    currentSort = currentSort === "az" ? "za" : "az";
    toggleSortBtn.textContent = currentSort === "az" ? "Tri A → Z" : "Tri Z → A";
    loadDocuments();
  });

});
