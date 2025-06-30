// ✅ Chargement + rendu dynamique (image + titre cliquables uniquement)
const isAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';

async function loadDocuments(sortOrder = 'az') {
  try {
    const response = await fetch('./bibliotheque/bibliotheque.json');
    const documents = await response.json();

    // Tri
    documents.sort((a, b) => {
      return sortOrder === 'az'
        ? a.label.localeCompare(b.label)
        : b.label.localeCompare(a.label);
    });

    const container = document.getElementById('bibli-container');
    container.innerHTML = '';

    documents.forEach(doc => {
      if (!doc.label || !doc.url || !doc.image) return;

      const card = document.createElement('div');
      card.className = 'bibli-card';

      const imageLink = document.createElement('a');
      imageLink.href = doc.url;
      imageLink.target = '_blank';
      imageLink.rel = 'noopener noreferrer';
      const image = document.createElement('img');
      image.src = doc.image;
      image.alt = `Illustration du document ${doc.label}`;
      image.className = 'doc-img';
      imageLink.appendChild(image);

      const titleLink = document.createElement('a');
      titleLink.href = doc.url;
      titleLink.target = '_blank';
      titleLink.rel = 'noopener noreferrer';
      const title = document.createElement('h2');
      title.className = 'doc-title';
      title.textContent = doc.label;

      if (isAdmin && doc.statut) {
        const statutClass = {
          'traite': 'statut-traite',
          'a_finir': 'statut-a-finir',
          'non_initie': 'statut-non-initie'
        }[doc.statut];
        if (statutClass) title.classList.add(statutClass);
      }

      titleLink.appendChild(title);

      card.appendChild(imageLink);
      card.appendChild(titleLink);
      container.appendChild(card);
    });
  } catch (err) {
    console.error('Erreur de chargement du JSON:', err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  loadDocuments('az');

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

  if (isAdmin) document.body.classList.add('admin-visible');

  const gridBtn = document.getElementById('grid-view');
const listBtn = document.getElementById('list-view');
const viewContainer = document.getElementById('bibli-container');


  if (gridBtn && listBtn && viewContainer) {
  gridBtn.addEventListener("click", () => {
    viewContainer.classList.remove("list-view");
    viewContainer.classList.add("grid-view");
    gridBtn.classList.add("active");
    listBtn.classList.remove("active");
  });

  listBtn.addEventListener("click", () => {
    viewContainer.classList.remove("grid-view");
    viewContainer.classList.add("list-view");
    listBtn.classList.add("active");
    gridBtn.classList.remove("active");
  });
}

});
