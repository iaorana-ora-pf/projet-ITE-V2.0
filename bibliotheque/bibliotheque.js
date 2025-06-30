const isAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';

async function loadDocuments(sortOrder = 'az') {
  const response = await fetch('../bibliotheque/bibliotheque.json');
  let documents = await response.json();

  // ✅ Tri dynamique
  documents.sort((a, b) => {
    return sortOrder === 'az'
      ? a.label.localeCompare(b.label)
      : b.label.localeCompare(a.label);
  });

  const container = document.getElementById('bibli-container');
  container.innerHTML = '';

  documents.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'bibli-card';

    // ✅ Titre avec statut coloré si mode admin
    const title = document.createElement('h2');
    title.classList.add('doc-title');
    title.textContent = doc.label;

    if (isAdmin && doc.statut) {
      const statutClass = {
        'traite': 'statut-traite',
        'a_finir': 'statut-a-finir',
        'non_initie': 'statut-non-initie'
      }[doc.statut];

      if (statutClass) {
        title.classList.add(statutClass);
      }
    }

    // ✅ Image et lien vers le PDF (affiché via Google Viewer)
    const image = document.createElement('img');
    image.src = doc.image;
    image.alt = "Illustration du document";
    image.className = 'doc-img';

    const link = document.createElement('a');
    link.className = 'doc-link';
    link.href = `https://docs.google.com/viewer?url=${encodeURIComponent(doc.url)}&embedded=true`;
    link.target = '_blank';
    link.textContent = "Voir le document";

    // ✅ Ajout dans la carte
    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(link);

    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadDocuments('az'); // Chargement initial

  document.getElementById('sort-select').addEventListener('change', function () {
    loadDocuments(this.value);
  });

  document.getElementById('search-input').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.bibli-card').forEach(card => {
      const title = card.querySelector('.doc-title').textContent.toLowerCase();
      card.style.display = title.includes(query) ? 'block' : 'none';
    });
  });

  document.querySelector('.scroll-left').addEventListener('click', () => {
    document.getElementById('bibli-container').scrollBy({ left: -300, behavior: 'smooth' });
  });

  document.querySelector('.scroll-right').addEventListener('click', () => {
    document.getElementById('bibli-container').scrollBy({ left: 300, behavior: 'smooth' });
  });

  // ✅ Ajouter une classe au body pour activer un style admin visible
  if (isAdmin) {
    document.body.classList.add('admin-visible');
  }
});
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
