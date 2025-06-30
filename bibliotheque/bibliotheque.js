const isAdmin = new URLSearchParams(window.location.search).get("admin") === "true";
let isListView = false;

async function loadDocuments(sortOrder = "az") {
  const response = await fetch("./bibliotheque/bibliotheque.json");
  let documents = await response.json();

  documents.sort((a, b) => {
    return sortOrder === "az"
      ? a.label.localeCompare(b.label)
      : b.label.localeCompare(a.label);
  });

  const container = document.getElementById("bibli-container");
  container.innerHTML = "";

  documents.forEach((doc) => {
    let element;

    if (isListView) {
      element = document.createElement("a");
      element.href = doc.url;
      element.className = "doc-list-item";
      element.textContent = doc.label;
      element.target = "_blank";
    } else {
      element = document.createElement("div");
      element.className = "bibli-card";

      const title = document.createElement("h2");
      title.className = "doc-title";
      title.textContent = doc.label;

      const link = document.createElement("a");
      link.href = doc.url;
      link.target = "_blank";

      const img = document.createElement("img");
      img.src = doc.image;
      img.alt = "Illustration";
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

  loadDocuments();

  sortSelect.addEventListener("change", () => {
    loadDocuments(sortSelect.value);
  });

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();
    document.querySelectorAll("#bibli-container > *").forEach((el) => {
      el.style.display = el.textContent.toLowerCase().includes(query) ? "block" : "none";
    });
  });

  toggleBtn.addEventListener("click", () => {
    isListView = !isListView;
    toggleBtn.textContent = isListView ? "Grille" : "Liste";
    loadDocuments(sortSelect.value);
  });
});
