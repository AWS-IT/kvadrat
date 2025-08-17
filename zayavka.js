(() => {
  if (window.__zayavkaInit) {
    console.debug('zayavka.js: already initialized, skip');
    return;
  }
  window.__zayavkaInit = true;

  document.addEventListener("DOMContentLoaded", () => {
    const modal = document.getElementById("modal");
    const form = document.getElementById("modalRequestForm");
    const responseMsg = document.getElementById("modalResponseMessage");
    if (!modal || !form || !responseMsg) return;

    const modalContent = modal.querySelector(".modal-content");
    let isSubmitting = false;

    // Делаем крестик доступным с клавиатуры
    modal.querySelectorAll(".close-btn").forEach(el => {
      el.setAttribute("role", "button");
      el.setAttribute("tabindex", "0");
    });

    const openModal = () => {
      modal.style.display = "flex";
      modal.classList.add("active");
      responseMsg.textContent = "";
      responseMsg.classList.remove("error", "success");
      document.body.classList.add("lock");
    };

    const closeModal = () => {
      modal.style.display = "none";
      modal.classList.remove("active");
      document.body.classList.remove("lock");
    };

    // Открытие по .submit-request-btn
    document.addEventListener("click", (e) => {
      const openBtn = e.target.closest(".submit-request-btn");
      if (openBtn) {
        e.preventDefault();
        openModal();
      }
    }, false); // Фаза всплытия

    // Закрыть по крестику
    document.addEventListener("click", (e) => {
      const closeBtn = e.target.closest(".close-btn");
      if (closeBtn) {
        e.preventDefault();
        closeModal();
      }
    }, false); // Фаза всплытия

    // Закрыть по Enter/Space на крестику
    document.addEventListener("keydown", (e) => {
      const active = document.activeElement;
      if (active && active.classList.contains("close-btn")) {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          closeModal();
        }
      }
    });

    // Клик по подложке
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModal();
    });

    // ESC
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modal.style.display === "flex") {
        closeModal();
      }
    });

    // Отправка формы
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (isSubmitting) return;

      const name = document.getElementById("modal-name")?.value.trim();
      const phone = document.getElementById("modal-phone")?.value.trim();
      if (!name || !phone) {
        responseMsg.textContent = "❌ Пожалуйста, заполните все поля.";
        responseMsg.classList.add("error");
        setTimeout(() => {
          responseMsg.textContent = "";
          responseMsg.classList.remove("error");
        }, 4000);
        return;
      }

      isSubmitting = true;
      const submitBtn = form.querySelector('button[type="submit"]');
      if (submitBtn) submitBtn.disabled = true;

      try {
        const res = await fetch(form.action, { method: "POST", body: new FormData(form) });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        let data;
        try { data = await res.json(); } catch { data = { result: "success" }; }

        if (data.result === "success") {
          responseMsg.textContent = "✅ Спасибо! Заявка отправлена.";
          responseMsg.classList.remove("error");
          responseMsg.classList.add("success");
          form.reset();
          setTimeout(() => {
            closeModal();
            responseMsg.textContent = "";
            responseMsg.classList.remove("success");
          }, 2500);
        } else {
          throw new Error(data.error || "Попробуйте позже.");
        }
      } catch (err) {
        responseMsg.textContent = `❌ Ошибка: ${err.message}`;
        responseMsg.classList.add("error");
        responseMsg.classList.remove("success");
        console.error("Ошибка отправки:", err);
        setTimeout(() => {
          responseMsg.textContent = "";
          responseMsg.classList.remove("error");
        }, 4000);
      } finally {
        isSubmitting = false;
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  });
})();