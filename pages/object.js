document.addEventListener("DOMContentLoaded", () => {
  fetch("/data/catalog_a.json")
    .then(res => res.json())
    .then(data => {
      const id = parseInt(new URLSearchParams(window.location.search).get("id"));
      const object = data.find(item => item.id === id);
      if (!object) {
        document.body.innerHTML = "<p>Объект не найден</p>";
        return;
      }

      // Фон страницы
      document.body.style.backgroundImage = `url('${object.image}')`;
      document.body.style.backgroundSize = "cover";
      document.body.style.backgroundPosition = "center";
      document.body.style.backgroundAttachment = "fixed";

      // Затемнение/blur
      const overlay = document.createElement('div');
      overlay.style.position = 'fixed';
      overlay.style.inset = 0;
      overlay.style.background = 'rgba(0, 0, 0, 0.4)';
      overlay.style.backdropFilter = 'blur(8px)';
      overlay.style.zIndex = '-1';
      overlay.style.opacity = '0';
      document.body.appendChild(overlay);
      requestAnimationFrame(() => (overlay.style.opacity = '1'));

      // Контент
      const el = document.getElementById("object-details");
      el.innerHTML = `
        <button class="back-btn" onclick="goBack()">Назад</button>
        <h1 class="object-title">${object.title}</h1>
        <img class="main-img" src="${object.image}" alt="${object.title}"/>
        <p class="short-desc">${object.shortDescription || ""}</p>

        <div class="details-box">
          <p class="price">${object.price || ""}</p>
          <p class="info">${object.deliveryDate || ""}</p>
          <p class="info">${object.floors || ""}</p>
          <p class="info">${object.commercialFloors || ""} - Коммерческие помещения</p>
          <p class="info">${object.parking || ""}</p>
        </div>

        <p class="info-title">Описание объекта</p>
        <div class="full-desc">${(object.description || "").replace(/\\n/g, "<br>")}</div>

        <div style="text-align:center; margin-top:40px;">
          <button class="submit-request-btn">Узнать побольше</button>  <!-- Кнопка с классом для открытия модалки -->
        </div>
      `;
    });
});

function goBack() {
  const savedPage = sessionStorage.getItem('catalogPage');
  if (savedPage) {
    window.location.href = `../index.html#catalog`;
  } else {
    history.back();
  }
}