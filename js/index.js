document.addEventListener("DOMContentLoaded", async () => {
  const countEl = document.getElementById("event-count-number");
  if (!countEl) return;

  try {
    const response = await fetch("events.json");
    if (!response.ok) throw new Error("events.json introuvable");

    const data = await response.json();
    const total = Object.values(data).flat().length;
    countEl.textContent = total;
  } catch (err) {
    console.error("Erreur de chargement des événements :", err);
    countEl.textContent = "—";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const adminBtn = document.getElementById("admin-access-btn");
  const adminModal = document.getElementById("admin-modal");
  const closeModal = document.getElementById("close-modal");
  const submitBtn = document.getElementById("submit-admin-code");
  const errorMsg = document.getElementById("admin-error");

  // Afficher la modale
  adminBtn.addEventListener("click", () => {
    adminModal.classList.remove("hidden");
    errorMsg.textContent = "";
    document.getElementById("admin-code-input").value = "";
  });

  // Fermer la modale
  closeModal.addEventListener("click", () => {
    adminModal.classList.add("hidden");
  });

  // Clic en dehors de la modale
  window.addEventListener("click", (e) => {
    if (e.target === adminModal) {
      adminModal.classList.add("hidden");
    }
  });

  // Validation du code
  submitBtn.addEventListener("click", () => {
    const code = document.getElementById("admin-code-input").value.trim();
    
    if (code === "bazinga") {
      window.location.href = "explorer.html?admin=true";
    } else {
      errorMsg.textContent = "Code incorrect.";
    }
  });
});

