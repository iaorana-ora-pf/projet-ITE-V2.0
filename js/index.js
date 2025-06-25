document.addEventListener("DOMContentLoaded", async () => {
  const countEl = document.getElementById("event-count-number");
  if (!countEl) return;

  try {
    const response = await fetch("events.json");
    if (!response.ok) throw new Error("events.json introuvable");

    const data = await response.json();
    const allEvents = Object.values(data).flat();

    // ✅ Ne compter que les événements validés
    const validatedEvents = allEvents.filter(evt => evt.validated);
    countEl.textContent = validatedEvents.length;
  } catch (err) {
    console.error("Erreur de chargement des événements :", err);
    countEl.textContent = "—";
  }
});


document.addEventListener("DOMContentLoaded", () => {
  const adminBtn = document.getElementById("admin-access-btn");
  const adminModal = document.getElementById("admin-modal");
  const closeModal = document.getElementById("close-admin-modal");
  const submitBtn = document.getElementById("validate-admin-code");
  const errorMsg = document.getElementById("admin-error");

  if (adminBtn) {
    adminBtn.addEventListener("click", () => {
      adminModal.classList.remove("hidden");
      errorMsg.textContent = "";
      document.getElementById("admin-code-input").value = "";
    });

    closeModal.addEventListener("click", () => {
      adminModal.classList.add("hidden");
    });

    window.addEventListener("click", (e) => {
      if (e.target === adminModal) {
        adminModal.classList.add("hidden");
      }
    });

    submitBtn.addEventListener("click", () => {
      const code = document.getElementById("admin-code-input").value.trim();

      if (code === "bazinga") {
       window.location.href = "frise.html?admin=true";
      } else {
        errorMsg.textContent = "Code incorrect.";
      }
    });
  }
});
