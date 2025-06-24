async function loadBibliotheque() {
  const response = await fetch('data/events.json');
  const events = await response.json();

  const docsMap = new Map();

  events.forEach(event => {
    if (!event.sources) return;
    event.sources.forEach(source => {
      const id = source.id_doc;
      if (!docsMap.has(id)) {
        docsMap.set(id, {
          id,
          label: source.label,
          url: source.url,
          events: [],
          image: 'https://via.placeholder.com/300x180?text=Document'
        });
      }
      docsMap.get(id).events.push({
        title: event.title,
        url: `${event.slug}.html`
      });
    });
  });

  const container = document.getElementById('bibli-container');
  container.innerHTML = '';

  docsMap.forEach(doc => {
    const card = document.createElement('div');
    card.className = 'bibli-card';

    const eventsHTML = doc.events.map(ev =>
      `<li><a href="${ev.url}">${ev.title}</a></li>`
    ).join('');

    card.innerHTML = `
      <h2 class="doc-title">${doc.label}</h2>
      <img src="${doc.image}" alt="Illustration" class="doc-img">
      <div class="doc-events">
        Mentionné dans :
        <ul>${eventsHTML}</ul>
      </div>
      <a class="doc-link" href="${doc.url}" target="_blank">Voir le document</a>
    `;

    container.appendChild(card);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  loadBibliotheque();

  document.getElementById('search-input').addEventListener('input', function () {
    const query = this.value.toLowerCase();
    document.querySelectorAll('.bibli-card').forEach(card => {
      const title = card.querySelector('.doc-title').textContent.toLowerCase();
      card.style.display = title.includes(query) ? 'block' : 'none';
    });
  });
});
