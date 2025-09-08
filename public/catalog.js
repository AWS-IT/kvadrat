document.addEventListener('DOMContentLoaded', () => {
  const cardsContainer = document.getElementById('catalog_list');
  const paginationContainer = document.getElementById('catalog_pagination');
  const itemsPerPage = 6;
  let currentPage = 1;
  let data = [];

  fetch('../data/catalog_a.json')
    .then(response => response.json())
    .then(json => {
      data = json;

      // Берем номер страницы из sessionStorage
      const savedPage = parseInt(sessionStorage.getItem('catalogPage'));
      if (!isNaN(savedPage)) {
        currentPage = savedPage;
      }

      renderPage(currentPage);
      renderPagination();
    });

  function renderPage(page) {
    cardsContainer.innerHTML = '';
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const pageItems = data.slice(startIndex, endIndex);

    pageItems.forEach(item => {
      const card = document.createElement('div');
      card.className = 'card';

      // Сохраняем текущую страницу при клике
      const link = document.createElement('a');
      link.href = `./pages/object.html?id=${item.id}`;
      link.addEventListener('click', () => {
        sessionStorage.setItem('catalogPage', currentPage);
      });

      link.innerHTML = `
        <img src="./img/${item.image}" alt="${item.title}">
        <h3>${item.title}</h3>
        <p>${item.shortDescription}</p>
      `;
      card.appendChild(link);
      cardsContainer.appendChild(card);
    });
  }

  function renderPagination() {
    paginationContainer.innerHTML = '';
    const totalPages = Math.ceil(data.length / itemsPerPage);
    const delta = 1;

    const addButton = (page) => {
      const btn = document.createElement('button');
      btn.textContent = page;
      if (page === currentPage) btn.classList.add('active');
      btn.addEventListener('click', () => {
        currentPage = page;
        renderPage(currentPage);
        renderPagination();
      });
      paginationContainer.appendChild(btn);
    };

    const addDots = () => {
      const span = document.createElement('span');
      span.textContent = '...';
      paginationContainer.appendChild(span);
    };

    if (currentPage > delta + 2) {
      addButton(1);
      addDots();
    } else {
      for (let i = 1; i < currentPage; i++) {
        addButton(i);
      }
    }

    for (let i = currentPage - delta; i <= currentPage + delta; i++) {
      if (i > 0 && i <= totalPages) addButton(i);
    }

    if (currentPage < totalPages - (delta + 1)) {
      addDots();
      addButton(totalPages);
    } else {
      for (let i = currentPage + 1; i <= totalPages; i++) {
        addButton(i);
      }
    }
  }
});