// ➕ Met à jour dynamiquement le nombre total d'événements depuis explorer.json
document.addEventListener("DOMContentLoaded", function () {
  const countEl = document.getElementById("event-count-number");

  // Vérifie si on est bien sur la page d'accueil (présence du compteur)
  if (countEl) {
    fetch("explorer.json")
      .then((response) => {
        if (!response.ok) {
          throw new Error("explorer.json introuvable");
        }
        return response.json();
      })
      .then((data) => {
        const total = Object.values(data).flat().length;
        countEl.textContent = total;
      })
      .catch((error) => {
        console.error("Erreur de chargement des événements :", error);
        countEl.textContent = "—";
      });
  }
});
