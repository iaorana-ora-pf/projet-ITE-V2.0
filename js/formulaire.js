document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('event-form');
  const titleInput = document.getElementById('title');
  const idInput = document.getElementById('event-id');
  const slugInput = document.getElementById('event-slug');
  const addedInput = document.getElementById('event-added');

  function generateEventId() {
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    return `evt-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  }

  function generateSlug(text) {
    return text
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  titleInput.addEventListener('input', () => {
    slugInput.value = generateSlug(titleInput.value);
  });

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    idInput.value = generateEventId();
    addedInput.value = new Date().toISOString().split('T')[0];

    const selectedCategories = Array.from(document.querySelectorAll('input[name="categories"]:checked')).map(cb => cb.value);

    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    // Traitements spécifiques
    data.categories = selectedCategories;
    data.keywords = data.keywords ? data.keywords.split(',').map(k => k.trim()) : [];

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbw5TjQ6TIIHA9fMDFKHSrMBYGmViLXMK2lh4bSI8F214UbuN0rZ6DBfYq91GFXrFU07/exec", {
        method: "POST",
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
