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
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Supprime les accents
      .replace(/[^\w\s-]/g, '')                         // Supprime la ponctuation
      .trim()
      .replace(/\s+/g, '-')                             // Remplace les espaces par des tirets
      .replace(/-+/g, '-');
  }

  // Mettre à jour le slug automatiquement dès qu'on tape un titre
  titleInput.addEventListener('input', () => {
    slugInput.value = generateSlug(titleInput.value);
  });

  // Gestion du formulaire
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Ajoute automatiquement l'ID et la date
    idInput.value = generateEventId();
    addedInput.value = new Date().toISOString().split('T')[0];

    // Récupère les catégories cochées
    const selectedCategories = Array.from(document.querySelectorAll('input[name="categories"]:checked')).map(cb => cb.value);

    // Prépare les données à envoyer
    const formData = new FormData(form);
    formData.set("categories", selectedCategories.join(", ")); // Format texte

    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbw5TjQ6TIIHA9fMDFKHSrMBYGmViLXMK2lh4bSI8F214UbuN0rZ6DBfYq91GFXrFU07/exec", {
        method: "POST",
        mode: "cors", // pour autoriser la réponse JSON
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Merci ! Votre proposition a bien été envoyée.");
        form.reset();
      } else {
        throw new Error(result.error || "Erreur côté serveur");
      }

    } catch (error) {
      console.error("Erreur d'envoi :", error);
      alert("❌ Une erreur est survenue : " + error.message);
    }
  });
});
