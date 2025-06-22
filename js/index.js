document.addEventListener("DOMContentLoaded", async () => {
  const countEl = document.getElementById("event-count-number");
  if (!countEl) return;

  try {
    const response = await fetch("events.json");
    if (!response.ok) throw new Error("events.json introuvable");

    const data = await response.json();
    const total = Object.values(data).flat().length;
    countEl.textContent = total;
  } catch (err) {
    console.error("Erreur de chargement des événements :", err);
    countEl.textContent = "—";
  }
});
