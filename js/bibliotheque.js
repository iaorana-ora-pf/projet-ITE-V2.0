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

    card.innerHTML = `
      <h2 class="doc-title">${doc.label}</h2>
      <img src="${doc.image}" alt="Illustration du document" class="doc-img">
      <a class="doc-link" href="https://docs.google.com/viewer?url=${encodeURIComponent(doc.url)}&embedded=true" target="_blank">Télécharger le document</a>
    `;

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
