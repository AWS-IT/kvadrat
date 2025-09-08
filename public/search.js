document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("nameSearch");
  const suggestionsContainer = document.getElementById("suggestions");

  let data = [];

  // Загружаем catalog.json
  fetch("../data/catalog_a.json")
    .then((response) => response.json())
    .then((json) => {
      data = json;
    })
    .catch((err) => {
      console.error("Ошибка загрузки catalog.json:", err);
    });

  // Слушаем ввод
  searchInput.addEventListener("input", () => {
    const value = searchInput.value.trim().toLowerCase();
    suggestionsContainer.innerHTML = "";

    if (value === "") return;

    const matches = data.filter((item) =>
      item.title.toLowerCase().includes(value)
    );

    matches.slice(0, 5).forEach((match) => {
      const suggestion = document.createElement("div");
      suggestion.textContent = match.title;
      suggestion.addEventListener("click", () => {
        window.location.href = `./pages/object.html?id=${match.id}`;
      });
      suggestionsContainer.appendChild(suggestion);
    });
  });

  // Закрытие подсказок при клике вне
  document.addEventListener("click", (e) => {
    if (
      !suggestionsContainer.contains(e.target) &&
      e.target !== searchInput
    ) {
      suggestionsContainer.innerHTML = "";
    }
  });
});