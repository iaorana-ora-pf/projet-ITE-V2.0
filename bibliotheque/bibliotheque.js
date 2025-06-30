const isAdmin = new URLSearchParams(window.location.search).get("admin") === "true";
let isListView = false;
let allDocuments = []; // Pour stocker tous les docs une seule fois

async function loadDocuments(sortOrder = "az", filterQuery = "") {
  // Charger les documents une seule fois
  if (allDocuments.length === 0) {
    const response = await fetch("./bibliotheque/bibliotheque.json");
    allDocuments = await response.json();
  }

  // Filtrage
  let filteredDocs = allDocuments.filter(doc =>
    doc.label.toLowerCase().includes(filterQuery.toLowerCase())
  );

  // Tri
  filteredDocs.sort((a, b) =>
    sortOrder === "az" ? a.label.localeCompare(b.label) : b.label.localeCompare(a.label)
  );

  const container = document.getElementById("bibli-container");
  container.innerHTML = "";

  // Affichage en liste ou grille
  filteredDocs.forEach(doc => {
    let element;

    if (isListView) {
      element = document.createElement("a");
      element.href = doc.url;
      element.textContent = doc.label;
      element.className = "doc-list-item";
      element.target = "_blank";
    } else {
      element = document.createElement("div");
      element.className = "bibli-card";

      const title = document.createElement("h2");
      title.className = "doc-title";
      title.textContent = doc.label;

      const link = document.createElement("a");
      link.href = `https://docs.google.com/viewer?url=${encodeURIComponent(doc.url)}&embedded=true`;
      link.target = "_blank";

      const img = document.createElement("img");
      img.src = doc.image;
      img.alt = "Illustration du document";
      img.className = "doc-img";

      link.appendChild(img);

      element.appendChild(title);
      element.appendChild(link);
    }

    container.appendChild(element);
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const sortSelect = document.getElementById("sort-select");
  const searchInput = document.getElementById("search-input");
  const toggleBtn = document.getElementById("toggle-view");

  // Charger au départ
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
  });
});
