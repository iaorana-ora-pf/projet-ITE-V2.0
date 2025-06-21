let activeCategories = [];
let eventsData = [];
let searchQuery = "";

const categoryInfo = {
  "Accès": { color: "#2a9d8f", icon: "fa-hospital" },
  "Contexte": { color: "#6c757d", icon: "fa-landmark" },
  "Données et recherche": { color: "#4b0082", icon: "fa-database" },
  "Gouvernance et pilotage": { color: "#007b7f", icon: "fa-scale-balanced" },
  "Promotion et prévention": { color: "#e76f51", icon: "fa-heart-pulse" },
  "Protection et gestion des risques": { color: "#f4a261", icon: "fa-shield-alt" }
};

document.addEventListener("DOMContentLoaded", () => {
  fetch("data/events.json")
    .then(res => res.json())
    .then(events => {
      eventsData = events;
      generateCategoryCheckboxes();
      renderTimeline(eventsData, "desc");
    });

  document.querySelectorAll('input[name="sortOrder"]').forEach(radio => {
    radio.addEventListener("change", () => {
      const selected = document.querySelector('input[name="sortOrder"]:checked').value;
      renderTimeline(eventsData, selected);
    });
  });

  document.getElementById("searchInput").addEventListener("input", (e) => {
    searchQuery = e.target.value.toLowerCase().trim();
    const sortValue = document.querySelector('input[name="sortOrder"]:checked').value;
    renderTimeline(eventsData, sortValue);
  });

  document.getElementById("resetFilters").addEventListener("click", () => {
    document.querySelectorAll('#categoryCheckboxGroup input[type="checkbox"]').forEach(cb => {
      cb.checked = false;
    });
    activeCategories = [];
    searchQuery = "";
    document.getElementById("searchInput").value = "";
    renderTimeline(eventsData, document.querySelector('input[name="sortOrder"]:checked').value);
    document.querySelectorAll(".cat-check").forEach(label => label.classList.remove("selected"));
  });

  const mod
