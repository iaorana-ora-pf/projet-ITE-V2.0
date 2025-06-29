// Détecte si le mode admin est activé via l'URL
const isAdmin = new URLSearchParams(window.location.search).get('admin') === 'true';

async function loadDocuments(sortOrder = 'az') {
  const response = await fetch('bibliotheque.json');
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

    // ✅ Création du titre avec statut coloré si mode admin
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

    // ✅ Création de l'image et du lien
    const image = document.createElement('img');
    image.src = doc.image;
    image.alt = "Illustration du document";
    image.className = 'doc-img';

    const link = document.createElement('a');
    link.className = 'doc-link';
    link.href = `https://docs.google.com/viewer?url=${encodeURIComponent(doc.url)}&embedded=true`;
    link.target = '_blank';
    link.textContent = "Voir le document";

    // ✅ Ajout des éléments dans la carte
    card.appendChild(title);
    card.appendChild(image);
    card.appendChild(link);

    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Charger les documents en tri A-Z par défaut
  loadDocuments('az');

  // Tri dynamique A-Z / Z-A
  document.getElementById('sort-select').addEventListener('change', function () {
    const order = this.value;
    loadDocuments(order);
  });

  // Recherche
  document.getElementById('search-input').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.bibli-card').forEach(card => {
      const title = card.querySelector('.doc-title').textContent.toLowerCase();
      card.style.display = title.includes(query) ? 'block' : 'none';
    });
  });

  // Scroll boutons
  document.querySelector('.scroll-left').addEventListener('click', () => {
    document.getElementById('bibli-container').scrollBy({ left: -300, behavior: 'smooth' });
  });

  document.querySelector('.scroll-right').addEventListener('click', () => {
    document.getElementById('bibli-container').scrollBy({ left: 300, behavior: 'smooth' });
  });
});
