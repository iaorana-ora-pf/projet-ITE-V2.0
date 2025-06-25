document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('event-form');
  const titleInput = document.getElementById('title');
  const idInput = document.getElementById('event-id');
  const slugInput = document.getElementById('event-slug');
  const addedInput = document.getElementById('event-added');

  // Fonction pour générer l'ID au format evt-YYYYMMDD-HHMMSS
  function generateEventId() {
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    const id = `evt-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
    return id;
  }

  // Fonction pour créer un slug à partir du titre
  function generateSlug(text) {
    return text
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // enlever accents
      .replace(/[^\w\s-]/g, '')                         // enlever ponctuation
      .trim()
      .replace(/\s+/g, '-')                             // espaces → tirets
      .replace(/-+/g, '-');
  }

  // Mettre à jour automatiquement les champs cachés
  titleInput.addEventListener('input', () => {
    slugInput.value = generateSlug(titleInput.value);
  });

  // À la soumission du formulaire : ajouter l'ID et la date
  form.addEventListener('submit', () => {
    idInput.value = generateEventId();

    // Date d'ajout (au format YYYY-MM-DD)
    const today = new Date();
    addedInput.value = today.toISOString().split('T')[0];
  });
});
