document.addEventListener("DOMContentLoaded", () => {
  fetch("../data/catalog_a.json")
    .then(res => {
      if (!res.ok) {
        throw new Error(`Failed to load JSON: ${res.status}`);
      }
      return res.json();
    })
    .then(data => {
      const hotObjects = data.filter(obj => obj.hot === true);
      let current = 0;

      const titleEl = document.querySelector(".slider-title");
      const imageEl = document.querySelector(".slider-image");
      const buttonEl = document.getElementById("slider-button");
      const sliderContainer = document.getElementById("hot-slider");

      function showObject(index) {
        const obj = hotObjects[index];
        if (!obj || !obj.id || !obj.title || !obj.image) {
          console.error("Invalid object data:", obj);
          return;
        }

        titleEl.textContent = obj.title;
        buttonEl.href = `./pages/object.html?id=${obj.id}`;
        imageEl.style.opacity = 0;

        setTimeout(() => {
          imageEl.src = `./img/${obj.image}`; // Убедитесь, что путь к изображениям правильный
          imageEl.style.opacity = 1;
        }, 300);
      }

      // Инициализация слайдера
      showObject(current);

      // Автоматическая смена слайдов
      setInterval(() => {
        current = (current + 1) % hotObjects.length;
        showObject(current);
      }, 7000);

      // Обработчик клика по кнопке
      buttonEl.addEventListener("click", (e) => {
        e.preventDefault(); // Предотвращаем стандартное поведение, если нужно
        const href = buttonEl.getAttribute("href");
        if (href) {
          window.location.href = href; // Явный переход
        } else {
          console.error("No href found for slider button");
        }
      });

      // Опционально: сделать весь слайдер кликабельным
      sliderContainer.addEventListener("click", (e) => {
        // Проверяем, что клик не по кнопке, чтобы избежать двойного срабатывания
        if (!e.target.closest("#slider-button")) {
          const href = buttonEl.getAttribute("href");
          if (href) {
            window.location.href = href;
          }
        }
      });
    })
    .catch(error => {
      console.error("Error loading slider data:", error);
      // Можно показать сообщение об ошибке на странице
      document.querySelector(".slider-content").innerHTML = "<p>Ошибка загрузки горячих предложений</p>";
    });
});
