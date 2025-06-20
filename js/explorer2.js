fetch("data/events.json")
  .then(response => response.json())
  .then(events => {
    const timeline = document.getElementById("timeline");

    events.forEach(event => {
      const div = document.createElement("div");
      div.classList.add("event");
      div.classList.add(event.year % 2 === 0 ? "left" : "right");
      
      // Optionnel : ajouter description ou catégorie si tu enrichis le JSON
      div.innerHTML = `
        <div class="year">${event.year}</div>
        <div class="title">${event.title}</div>
        ${event.shortDescription ? `<div class="desc">${event.shortDescription}</div>` : ''}
        ${event.categories ? `
          <div class="categories">
            ${event.categories.map(cat => `<img src="icons/${cat}.svg" alt="${cat}" title="${cat}" />`).join("")}
          </div>` : ''}
      `;
      
      timeline.appendChild(div);
    });
  })
  .catch(err => console.error("Erreur chargement JSON:", err));

const timeline = document.getElementById("timeline");

events.forEach(event => {
  const div = document.createElement("div");
  div.classList.add("event");
  div.classList.add(event.year % 2 === 0 ? "left" : "right");
  div.innerHTML = `<div class="year">${event.year}</div><div>${event.title}</div>`;
  timeline.appendChild(div);
});

document.getElementById("toggleSidebar").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("hidden");
});
