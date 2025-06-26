document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('event-form');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const data = {
      id: document.getElementById('event-id').value,
      title: document.getElementById('title').value,
      year: document.getElementById('year').value,
      description: document.getElementById('description').value,
      categories: Array.from(document.getElementById('categories').selectedOptions).map(opt => opt.value),
      keywords: document.getElementById('keywords').value.split(',').map(k => k.trim()),
      sources: document.getElementById('sources').value,
      more: document.getElementById('more').value,
      slug: document.getElementById('event-slug').value,
      added: document.getElementById('event-added').value
    };

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbw5TjQ6TIIHA9fMDFKHSrMBYGmViLXMK2lh4bSI8F214UbuN0rZ6DBfYq91GFXrFU07/exec", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data)
      });

      const result = await response.json();

      if (result.success) {
        alert("✅ Proposition envoyée avec succès !");
        form.reset();
      } else {
        alert("❌ Erreur serveur : " + (result.error || "Envoi échoué."));
      }
    } catch (err) {
      alert("❌ Erreur réseau : " + err.message);
    }
  });
});
