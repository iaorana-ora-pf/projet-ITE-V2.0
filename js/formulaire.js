document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('event-form');
  const titleInput = document.getElementById('title');
  const idInput = document.getElementById('event-id');
  const slugInput = document.getElementById('event-slug');
  const addedInput = document.getElementById('event-added');

  // Génère un ID unique du type evt-YYYYMMDD-HHMMSS
  function generateEventId() {
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    return `evt-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  }

  // Crée un slug à partir du titre
  function generateSlug(text) {
    return text
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Supprime accents
      .replace(/[^\w\s-]/g, '')                        // Supprime ponctuation
      .trim()
      .replace(/\s+/g, '-')                            // Remplace espaces par tirets
      .replace(/-+/g, '-');
  }

  // Mettre à jour automatiquement les champs techniques
  titleInput.addEventListener('input', () => {
    slugInput.value = generateSlug(titleInput.value);
  });

  // Gérer la soumission du formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Ajout de l'ID et de la date d'ajout
    idInput.value = generateEventId();
    addedInput.value = new Date().toISOString().split('T')[0];

    // Récupère les catégories cochées (checkboxes)
    const selectedCategories = Array.from(document.querySelectorAll('input[name="categories"]:checked')).map(cb => cb.value);

    // Préparer les données
    const formData = new FormData(form);
    formData.set("categories", selectedCategories.join(", ")); // Ajoute les catégories comme texte
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbw5TjQ6TIIHA9fMDFKHSrMBYGmViLXMK2lh4bSI8F214UbuN0rZ6DBfYq91GFXrFU07/exec", {
        method: "POST",
        mode: "no-cors", // Important pour éviter les erreurs CORS
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      });

      alert("Merci ! Votre proposition a bien été envoyée.");
      form.reset();
    } catch (error) {
      console.error("Erreur lors de l’envoi :", error);
      alert("Une erreur est survenue. Merci de réessayer plus tard.");
    }
  });
});
