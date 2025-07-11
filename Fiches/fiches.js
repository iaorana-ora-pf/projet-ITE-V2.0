document.addEventListener("DOMContentLoaded", () => {
  const suggestionEl = document.querySelector(".suggestion-link");
  if (suggestionEl) {
    suggestionEl.style.display = "none";
  }

  const currentId = document.body.dataset.id;
  const currentThemes = JSON.parse(document.body.dataset.theme || "[]");

  fetch(`../events.json?ts=${Date.now()}`)
    .then(resp => resp.json())
    .then(events => {
      const scored = events
        .filter(e => e.id !== currentId)
        .map(e => {
          const common = (e.theme || []).filter(cat => currentThemes.includes(cat)).length;
          return { ...e, score: common };
        })
        .filter(e => e.score > 0)
        .sort((a, b) => b.score - a.score);

      let suggestion;
      if (scored.length > 0) {
        const topScore = scored[0].score;
        const topSuggestions = scored.filter(e => e.score === topScore);
        suggestion = topSuggestions[Math.floor(Math.random() * topSuggestions.length)];
      } else {
        const fallback = events.filter(e => e.id !== currentId);
        suggestion = fallback[Math.floor(Math.random() * fallback.length)];
      }

      if (suggestion && suggestionEl) {
        suggestionEl.href = `../${suggestion.id}.html`;
        suggestionEl.textContent = `${suggestion.year} – ${suggestion.title}`;
        suggestionEl.style.display = "";
      } else if (suggestionEl) {
        suggestionEl.textContent = "Pas d'autre événement";
      }
    });
});
