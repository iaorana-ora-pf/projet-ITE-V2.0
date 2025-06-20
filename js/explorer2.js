let eventsData = [];

fetch("data/events.json")
  .then(response => response.json())
  .then(events => {
    eventsData = events;
    renderTimeline(eventsData, "desc"); // Affichage par défaut : du plus récent au plus ancien
  })
  .catch(err => console.error("Erreur chargement JSON:", err));

function renderTimeline(events, order = "desc") {
  const timeline = document.getElementById("timeline");
  timeline.innerHTML = ""; // Nettoyer le conteneur

  // Trier selon l'ordre choisi
  const sorted = [...events].sort((a, b) =>
    order === "asc" ? a.year - b.year : b.year - a.year
  );

  // Générer les blocs HTML
  sorted.forEach(event => {
    const div = document.createElement("div");
    div.classList.add("event", event.year % 2 === 0 ? "left" : "right");

    div.innerHTML = `
      <div class="year">${event.year}</div>
      <div class="title">${event.title}</div>
      ${event.shortDescription ? `<div class="desc">${event.shortDescription}</div>` : ''}
      ${event.categories ? `
        <div class="categories">
          ${event.categories.map(cat => `
            <img src="icons/${cat}.svg" alt="${cat}" title="${cat}" />
          `).join("")}
        </div>` : ''}
    `;

    timeline.appendChild(div);
  });
}

// 🎛️ Tri dynamique via le select
document.getElementById("sortOrder").addEventListener("change", (e) => {
  renderTimeline(eventsData, e.target.value);
});
