const isAdmin = new URLSearchParams(window.location.search).get("admin") === "true";
let isListView = false;
let allDocuments = [];

async function loadDocuments(sortOrder = "az", filterQuery = "") {
  if (allDocuments.length === 0) {
    const response = await fetch("./bibliotheque/bibliotheque.json");
    allDocuments = await response.json();
  }

  // Filtrer selon la recherche
  let filteredDocs = allDocuments.filter(doc =>
    doc.label.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Trier
  filteredDocs.sort((a, b) =>
    sortOrder === "az" ? a.label.localeCompare(b.label) : b.label.localeCompare(a.label)
  );

  const container = document.getElementById("bibli-container");
  container.innerHTML = "";

  // Affichage selon le mode
  filteredDocs.forEach(doc => {
    if (isListView) {
      const link = document.createElement("a");
      link.href = doc.url;
      link.textContent = doc.label;
      link.className = "doc-list-item";
      link.target = "_blank";
      container.appendChild(link);
    } else {
      const card = document.createElement("div");
      card.className = "bibli-card";

      const title = document.createElement("h2");
      title.className = "doc-title";
      title.textContent = doc.label;

      // Code couleur (mode admin)
      if (isAdmin && doc.statut) {
        const statusClass = {
          "traite": "statut-traite",
          "a_finir": "statut-a-finir",
          "non_initie": "statut-non-initie"
        }[doc.statut];
        if (statusClass) {
          title.classList.add(statusClass);
        }
      }

      const link = document.createElement("a");
      link.href = `https://docs.google.com/viewer?url=${encodeURIComponent(doc.url)}&embedded=true`;
      link.target = "_blank";

      const img = document.createElement("img");
      img.src = doc.image;
      img.alt = "Illustration du document";
      img.className = "doc-img";

      link.appendChild(img);
      card.appendChild(title);
      card.appendChild(link);

      container.appendChild(card);
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const sortSelect = document.getElementById("sort-select");
  const searchInput = document.getElementById("search-input");
  const toggleBtn = document.getElementById("toggle-view");

  loadDocuments(sortSelect.value);

  sortSelect.addEventListener("change", () => {
    loadDocuments(sortSelect.value, searchInput.value);
  });

  searchInput.addEventListener("input", () => {
    loadDocuments(sortSelect.value, searchInput.value);
  });

  toggleBtn.addEventListener("click", () => {
    isListView = !isListView;
    toggleBtn.textContent = isListView ? "Grille" : "Liste";
    loadDocuments(sortSelect.value, searchInput.value);

    // Adapter le style du container
    const container = document.getElementById("bibli-container");
    if (isListView) {
      container.classList.add("list-mode");
    } else {
      container.classList.remove("list-mode");
    }
  });
});
