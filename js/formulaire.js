document.addEventListener("DOMContentLoaded", () => {
  // 1. Remplissage automatique du champ 'added' avec la date du jour
  const addedField = document.getElementById("added");
  if (addedField) {
    const today = new Date().toISOString().split("T")[0];
    addedField.value = today;
  }

  // 2. Préremplissage automatique de l'ID avec timestamp
  const idField = document.getElementById("id");
  if (idField) {
    const now = new Date();
    const id = `evt-${now.getFullYear()}${String(now.getMonth()+1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}-${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}${String(now.getSeconds()).padStart(2, '0')}`;
    idField.value = id;
  }

  // 3. Génération automatique du slug depuis le titre
  const titleField = document.getElementById("title");
  const slugField = document.getElementById("slug");
  if (titleField && slugField) {
    titleField.addEventListener("input", () => {
      const slug = titleField.value
        .toLowerCase()
        .normalize("NFD") // enlève les accents
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-")
        .replace(/-+/g, "-")
        .replace(/^-+|-+$/g, "");
      slugField.value = slug;
    });
  }

  // 4. Validation basique des champs obligatoires
  const form = document.getElementById("event-form");
  form.addEventListener("submit", (e) => {
    const requiredFields = ["id", "year", "title", "description", "slug"];
    let valid = true;

    requiredFields.forEach(fieldId => {
      const input = document.getElementById(fieldId);
      if (!input || input.value.trim() === "") {
        input.style.borderColor = "red";
        valid = false;
      } else {
        input.style.borderColor = "#ccc";
      }
    });

    if (!valid) {
      e.preventDefault();
      alert("Merci de remplir tous les champs obligatoires.");
    }
  });
});
