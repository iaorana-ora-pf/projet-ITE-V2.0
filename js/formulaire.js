document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('event-form');
  const titleInput = document.getElementById('title');
  const idInput = document.getElementById('event-id');
  const slugInput = document.getElementById('event-slug');
  const addedInput = document.getElementById('event-added');
  const confirmation = document.getElementById('confirmation');

  // Fonction pour générer l'ID au format evt-YYYYMMDD-HHMMSS
  function generateEventId() {
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    return `evt-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  }

  // Fonction pour créer un slug à partir du titre
  function generateSlug(text) {
    return text
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  // Générer automatiquement l’ID, le slug et la date à la soumission
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const now = new Date();
    const eventId = generateEventId();
    const eventSlug = generateSlug(titleInput.value);
    const addedDate = now.toISOString().split('T')[0];

    // Construire l'objet de données
    const data = {
      id: eventId,
      title: titleInput.value,
      year: parseInt(document.getElementById('year').value),
      description: document.getElementById('description').value,
      categories: Array.from(document.getElementById('categories').selectedOptions).map(opt => opt.value),
      keywords: document.getElementById('keywords').value.split(',').map(k => k.trim()),
      sources: document.getElementById('sources').value,
      more: document.getElementById('more').value,
      slug: eventSlug,
      added: addedDate
    };

    // ENVOI VERS GOOGLE APPS SCRIPT
    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwH6-uUAG7wvRTRn1LHnWNWsEuB303XkxBXVQId5Cnv5we6iOFR_exNK3szQfUg-BJu/exec", {
        method: "POST",
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      });

      const result = await response.json();
      if (result.success) {
        form.reset();
        confirmation.textContent = "✅ Proposition envoyée avec succès !";
        confirmation.classList.remove("hidden");
      } else {
        confirmation.textContent = "❌ Une erreur s’est produite.";
        confirmation.classList.remove("hidden");
      }
    } catch (error) {
      console.error("Erreur d’envoi :", error);
      confirmation.textContent = "❌ Erreur de connexion.";
      confirmation.classList.remove("hidden");
    }
  });
});
