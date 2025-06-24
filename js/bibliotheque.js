
document.addEventListener("DOMContentLoaded", function () {
  const searchInput = document.getElementById("search-input");
  const typeFilters = document.querySelectorAll(".doc-type-filter input[type='checkbox']");
  const cards = document.querySelectorAll(".card");

  function applyFilters() {
    const searchQuery = searchInput.value.toLowerCase();
    const activeTypes = Array.from(typeFilters)
      .filter(checkbox => checkbox.checked)
      .map(cb => cb.value);

    cards.forEach(card => {
      const title = card.querySelector(".card-title").textContent.toLowerCase();
      const type = card.dataset.type;

      const matchesSearch = title.includes(searchQuery);
      const matchesType = activeTypes.length === 0 || activeTypes.includes(type);

      if (matchesSearch && matchesType) {
        card.style.display = "";
      } else {
        card.style.display = "none";
      }
    });
  }

  searchInput.addEventListener("input", applyFilters);
  typeFilters.forEach(cb => cb.addEventListener("change", applyFilters));
});
