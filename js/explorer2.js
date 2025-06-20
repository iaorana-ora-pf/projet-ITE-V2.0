const events = [
  { year: 1990, title: "Chute du Mur de Berlin", category: "Histoire" },
  { year: 2001, title: "Premier iPod", category: "Sciences" },
  { year: 2010, title: "Instagram est lancé", category: "Arts" },
  { year: 2020, title: "Pandémie COVID-19", category: "Histoire" },
  { year: 2024, title: "Lancement mission Mars", category: "Sciences" },
];

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
