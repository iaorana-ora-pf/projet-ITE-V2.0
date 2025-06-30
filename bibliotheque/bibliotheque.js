const isAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';

async function loadDocuments(sortOrder = 'az') {
  const response = await fetch('./bibliotheque.json');
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

  // Lien cliquable autour de l'image
  const imageLink = document.createElement('a');
  imageLink.href = doc.url;
  imageLink.target = '_blank';
  imageLink.rel = 'noopener noreferrer';

  const image = document.createElement('img');
  image.src = doc.image;
  image.alt = "Illustration du document";
  image.className = 'doc-img';

  imageLink.appendChild(image);
  card.appendChild(imageLink);

  // Lien cliquable autour du titre
  const titleLink = document.createElement('a');
  titleLink.href = doc.url;
  titleLink.target = '_blank';
  titleLink.rel = 'noopener noreferrer';

  const title = document.createElement('h2');
  title.classList.add('doc-title');
  title.textContent = doc.label;

  // Ajout du statut si admin
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

  titleLink.appendChild(title);
  card.appendChild(titleLink);

  container.appendChild(card);
});



document.addEventListener('DOMContentLoaded', () => {
  loadDocuments('az'); // Initial load

  const sortSelect = document.getElementById('sort-select');
  if (sortSelect) {
    sortSelect.addEventListener('change', function () {
      loadDocuments(this.value);
    });
  }

  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      const query = this.value.toLowerCase();
      document.querySelectorAll('.bibli-card').forEach(card => {
       const titleEl = card.querySelector('.doc-title');
const title = titleEl ? titleEl.textContent.toLowerCase() : '';

        card.style.display = title.includes(query) ? 'block' : 'none';
      });
    });
  }

  // Scroll arrows
  const scrollLeft = document.querySelector('.scroll-left');
  const scrollRight = document.querySelector('.scroll-right');
  if (scrollLeft && scrollRight) {
    scrollLeft.addEventListener('click', () => {
      document.getElementById('bibli-container').scrollBy({ left: -300, behavior: 'smooth' });
    });
    scrollRight.addEventListener('click', () => {
      document.getElementById('bibli-container').scrollBy({ left: 300, behavior: 'smooth' });
    });
  }

  // Admin style activation
  if (isAdmin) {
    document.body.classList.add('admin-visible');
  }

  // Vue grille/liste
  const gridBtn = document.getElementById("grid-view");
  const listBtn = document.getElementById("list-view");
  const container = document.getElementById("bibli-container");

  if (gridBtn && listBtn && container) {
    gridBtn.addEventListener("click", () => {
      container.classList.remove("list-view");
      container.classList.add("grid-view");
      gridBtn.classList.add("active");
      listBtn.classList.remove("active");
    });

    listBtn.addEventListener("click", () => {
      container.classList.remove("grid-view");
      container.classList.add("list-view");
      listBtn.classList.add("active");
      gridBtn.classList.remove("active");
    });
  }

  // Admin modal (sécurité par code)
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
