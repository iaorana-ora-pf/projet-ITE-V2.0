document.addEventListener("DOMContentLoaded", async () => {
  const countEl = document.getElementById("event-count-number");
  if (!countEl) return;

  try {
    const response = await fetch("events.json");
    if (!response.ok) throw new Error("events.json introuvable");

    const data = await response.json();
    const allEvents = Object.values(data).flat();

    // ✅ Ne compter que les événements validés
    const validatedEvents = allEvents.filter(evt => evt.validated);
    countEl.textContent = validatedEvents.length;
  } catch (err) {
    console.error("Erreur de chargement des événements :", err);
    countEl.textContent = "—";
  }
});

