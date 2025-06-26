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
document.getElementById("mon-formulaire").addEventListener("submit", async (e) => {
  e.preventDefault();

  const formData = {
    id: document.getElementById("event-id").value,
    title: document.getElementById("event-title").value,
    year: parseInt(document.getElementById("event-year").value),
    slug: document.getElementById("event-slug").value,
    description: document.getElementById("event-description").value,
    categories: document.getElementById("event-categories").value.split(",").map(s => s.trim()),
    keywords: document.getElementById("event-keywords").value.split(",").map(s => s.trim()),
    sources: document.getElementById("event-sources").value.split(",").map(src => ({ label: src.trim() })),
    more: document.getElementById("event-more").value.split(",").map(url => ({ label: "Pour aller plus loin", url: url.trim() })),
    validated: false
  };

  try {
    const response = await fetch("http://localhost:5000/submit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData)
    });

    const result = await response.json();
    if (response.ok) {
      alert("Événement enregistré !");
    } else {
      alert("Erreur : " + result.message);
    }
  } catch (err) {
    console.error("Erreur d'envoi :", err);
    alert("Erreur de connexion au serveur");
  }
});
document.getElementById('download-json').addEventListener('click', () => {
  const form = document.getElementById('event-form');
  const formData = new FormData(form);
  const json = {};

  formData.forEach((value, key) => {
    if (key.endsWith('[]')) {
      const trueKey = key.replace('[]', '');
      if (!json[trueKey]) json[trueKey] = [];
      json[trueKey].push(value);
    } else {
      json[key] = value;
    }
  });

  // Forcer des champs particuliers à être bien typés
  json.year = parseInt(json.year || 0, 10);
  json.validated = false;

  const fileName = `${json.id || 'evenement'}.json`;
  const blob = new Blob([JSON.stringify(json, null, 2)], { type: "application/json" });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
});
<script>
  document.getElementById("contact-form").addEventListener("submit", function (e) {
    e.preventDefault();

    const form = e.target;
    const data = {
      nom: form.nom.value,
      email: form.email.value,
      message: form.message.value,
    };

    fetch("https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec", {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    })
    .then(res => res.text())
    .then(txt => {
      document.getElementById("form-status").textContent = "Merci ! Votre message a été envoyé.";
      form.reset();
    })
    .catch(err => {
      document.getElementById("form-status").textContent = "Erreur lors de l'envoi.";
      console.error(err);
    });
  });
</script>
