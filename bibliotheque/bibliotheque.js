let isListView = false;

async function loadDocuments(sortOrder = "az") {
  const response = await fetch("./bibliotheque/bibliotheque.json");
  const documents = await response.json();

  documents.sort((a, b) => {
    return sortOrder === "az"
      ? a.label.localeCompare(b.label)
      : b.label.localeCompare(a.label);
  });

  const container = document.getElementById("bibli-container");
  container.innerHTML = "";

  documents.forEach((doc) => {
    if (isListView) {
      const link = document.createElement("a");
      link.href = `https://docs.google.com/viewer?url=${encodeURIComponent(doc.url)}&embedded=true`;
      link.target = "_blank";
      link.className = "doc-list-item";
      link.textContent = doc.label;
      container.appendChild(link);
    } else {
      const card = document.createElement("div");
      card.className = "bibli-card";

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
      card.appendChild(title);
      card.appendChild(link);
      container.appendChild(card);
    }
  });

  applySearchFilter(); // re-applique filtre après render
}

function applySearchFilter() {
  const query = document.getElementById("search-input").value.toLowerCase();
  const items = document.querySelectorAll("#bibli-container > *");

  items.forEach((el) => {
    const visible = el.textContent.toLowerCase().includes(query);
    el.style.display = visible ? "" : "none";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  const sortSelect = document.getElementById("sort-select");
  const toggleViewBtn = document.getElementById("toggle-view");
  const searchInput = document.getElementById("search-input");
  const instructions = document.getElementById("bibli-instructions");

  function updateViewText() {
    instructions.textContent = isListView
      ? "Pour accéder au document, cliquer sur le titre."
      : "Pour accéder au document, cliquer sur l'image correspondante.";
    toggleViewBtn.textContent = isListView ? "Vue en grille" : "Vue en liste";
  }

  sortSelect.addEventListener("change", () => {
    loadDocuments(sortSelect.value);
  });

  searchInput.addEventListener("input", applySearchFilter);

  toggleViewBtn.addEventListener("click", () => {
    isListView = !isListView;
    updateViewText();
    loadDocuments(sortSelect.value);
  });

  updateViewText();
  loadDocuments();
});
