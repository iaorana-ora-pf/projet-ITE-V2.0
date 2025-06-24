document.addEventListener("DOMContentLoaded", () => {
  // Ajoute la date du jour au champ 'added'
  const addedField = document.getElementById("added");
  if (addedField) {
    const today = new Date().toISOString().split("T")[0];
    addedField.value = today;
  }

  // Validation simple à la soumission
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
