ymaps.ready(init);

function init() {
    const map = new ymaps.Map("map", {
        center: [43.322308, 45.707061],
        zoom: 13
    });

    let allObjects = [];
    let visibleCount = 0;
    const itemsPerLoad = 14;

    fetch('../data/catalog_a.json')
        .then(response => {
            if (!response.ok) {
                console.error('Файл не найден:', '../data/catalog_a.json');
                throw new Error('Ошибка загрузки данных');
            }
            return response.json();
        })
        .then(data => {
            const coordinates = [];
            allObjects = data.filter(obj => obj.latitude != null && obj.longitude != null);
            data.forEach(object => {
                if (object.latitude != null && object.longitude != null) {
                    coordinates.push([object.latitude, object.longitude]);
                    const placemark = new ymaps.Placemark([object.latitude, object.longitude], {
                        balloonContent: `
                            <div style="text-align:center;">
                                <img src="${object.image || 'https://via.placeholder.com/100'}" alt="${object.title}" style="max-width: 100px; border-radius: 6px;"><br>
                                <strong>${object.title}</strong><br>
                                <a href="./pages/object.html?id=${object.id}" style="color: #11223d; text-decoration: none;">Подробнее</a>
                            </div>
                        `,
                    }, { preset: 'islands#blueIcon' });
                    map.geoObjects.add(placemark);
                } else {
                    console.log(`Пропущен объект: ${object.title} (нет координат)`);
                }
            });

            if (coordinates.length > 0) {
                map.setBounds(map.geoObjects.getBounds(), { checkZoomRange: true, zoomMargin: 50 });
            } else {
                console.warn('Нет объектов с координатами.');
            }
        })
        .catch(error => console.error('Ошибка:', error));

    fetch('../data/catalog_a.json')
        .then(response => {
            if (!response.ok) throw new Error('Файл не найден: ' + '../data/catalog_a.json');
            return response.json();
        })
        .then(data => {
            const listContainer = document.getElementById('object-list');
            const loadMoreBtn = document.querySelector('.load-more-btn');

            function loadMoreObjects() {
                const nextObjects = allObjects.length > 0 ? allObjects.slice(visibleCount, visibleCount + itemsPerLoad) : data.slice(visibleCount, visibleCount + itemsPerLoad);
                if (nextObjects.length === 0) return; // Прекращаем, если объектов нет
                nextObjects.forEach(object => {
                    const link = document.createElement('a');
                    link.href = `./pages/object.html?id=${object.id}`;
                    link.textContent = object.title;
                    listContainer.appendChild(link);
                });
                visibleCount += itemsPerLoad;
                if (visibleCount >= (allObjects.length > 0 ? allObjects.length : data.length)) {
                    loadMoreBtn.style.display = 'none';
                }
            }

            loadMoreObjects();
            loadMoreBtn.addEventListener('click', loadMoreObjects);
        })
        .catch(error => console.error('Ошибка загрузки списка:', error));
}