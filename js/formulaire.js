document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('event-form');

  // Générer un ID unique : evt-YYYYMMDD-HHMMSS
  function generateEventId() {
    const now = new Date();
    const pad = n => n.toString().padStart(2, '0');
    return `evt-${now.getFullYear()}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${pad(now.getHours())}${pad(now.getMinutes())}${pad(now.getSeconds())}`;
  }

  // Générer un slug à partir du titre
  function generateSlug(text) {
    return text
      .toLowerCase()
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .replace(/[^\w\s-]/g, '')
      .trim()
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(form);

    // Ajouter ID et date
    const id = generateEventId();
    const added = new Date().toISOString().split('T')[0];
    const title = formData.get("title") || "";
    const slug = generateSlug(title);

    // Catégories (checkboxes multiples)
    const categories = Array.from(document.querySelectorAll('input[name="categories"]:checked')).map(cb => cb.value).join(", ");

    // Formater les données à envoyer
    const data = {
      id,
      title,
      year: formData.get("year") || "",
      categories,
      keywords: formData.get("keywords") || "",
      description: formData.get("description") || "",
      sources: formData.get("sources") || "",
      more: formData.get("more") || "",
      contributor: formData.get("contributor") || "",
      slug,
      added,
      validated: false
    };

    try {
      const response = await fetch("https://script.google.com/macros/s/AKfycbwA-h-F_jHf4Zm-rDN9i8wzJfdkvFe0hAbUKU2jkjANVgDF2O3K4dkEvJc1JrA8U4BY/exec", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(data)
});

      alert("✅ Merci ! Votre événement a bien été soumis.");
      form.reset();
    } catch (err) {
      console.error(err);
      alert("❌ Une erreur est survenue. Merci de réessayer plus tard.");
    }
  });
});
