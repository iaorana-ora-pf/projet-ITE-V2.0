async function loadDocuments() {
  const response = await fetch('bibliotheque.json'); // ← Ton nouveau JSON
  const documents = await response.json();

  const container = document.getElementById('bibli-container');
  container.innerHTML = '';

  documents.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'bibli-card';

    card.innerHTML = `
      <h2 class="doc-title">${doc.label}</h2>
      <img src="${doc.image}" alt="Illustration du document" class="doc-img">
      <a class="doc-link" href="${doc.url}" target="_blank">Voir le document</a>
    `;

    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadDocuments();

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

});
