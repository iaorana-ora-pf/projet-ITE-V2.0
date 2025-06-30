const isAdmin = new URLSearchParams(window.location.search).get("admin") === "true";
let isListView = false;
let currentSort = "az"; // Tri par défaut

async function loadDocuments() {
  const response = await fetch("./bibliotheque/bibliotheque.json");
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
      element.href = `https://docs.google.com/viewer?url=${encodeURIComponent(doc.url)}&embedded=true`;
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
  const searchInput = document.getElementById("search-input");
  const toggleViewBtn = document.getElementById("toggle-view");
  const toggleSortBtn = document.getElementById("toggle-sort");
  const instruction = document.getElementById("doc-instruction");

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

    if (instruction) {
      instruction.innerHTML = isListView
        ? "<em>Pour accéder au document, cliquer sur le titre.</em>"
        : "<em>Pour accéder au document, cliquer sur l'image correspondante</em>";
    }

    loadDocuments();
  });

  // 🔃 Tri A ↔ Z
  toggleSortBtn.addEventListener("click", () => {
    currentSort = currentSort === "az" ? "za" : "az";
    toggleSortBtn.textContent = currentSort === "az" ? "Tri A → Z" : "Tri Z → A";
    loadDocuments();
  });

  // 🔐 Admin access modal
  const adminBtn = document.getElementById("admin-access-btn");
  const adminModal = document.getElementById("admin-modal");
  const closeModal = document.getElementById("close-admin-modal");
  const submitBtn = document.getElementById("validate-admin-code");
  const errorMsg = document.getElementById("admin-error");

  if (adminBtn && adminModal) {
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
        const url = new URL(window.location.href);
        url.searchParams.set("admin", "true");
        window.location.href = url.toString();
      } else {
        errorMsg.textContent = "Code incorrect.";
      }
    });
  }
});
