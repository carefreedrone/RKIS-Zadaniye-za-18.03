// script.js — Полноценная клиентская фильтрация (без блока выбранных фильтров)

document.addEventListener('DOMContentLoaded', () => {
    // ==================== ДАННЫЕ ТОВАРОВ ====================
    const products = [
        {
            id: 1,
            name: 'Торшер Arco',
            category: 'Торшеры',
            brand: 'Flos',
            price: 32900,
            rating: 5,
            reviews: 12,
            inStock: true,
            isNew: true,
            isHit: false,
            discount: null,
            image: 'Torchere',
            description: 'напольный'
        },
        {
            id: 2,
            name: 'Lampa 265',
            category: 'Настольные',
            brand: 'Ikea',
            price: 5490,
            rating: 4,
            reviews: 34,
            inStock: true,
            isNew: false,
            isHit: true,
            discount: null,
            image: 'Table+Lamp',
            description: 'настольная'
        },
        {
            id: 3,
            name: 'AJ Wall',
            category: 'Бра',
            brand: 'Muuto',
            price: 11200,
            rating: 4,
            reviews: 8,
            inStock: true,
            isNew: false,
            isHit: false,
            discount: null,
            image: 'Wall+Light',
            description: 'бра'
        },
        {
            id: 4,
            name: 'Grasshopper',
            category: 'Торшеры',
            brand: 'Artemide',
            price: 27900,
            rating: 3,
            reviews: 5,
            inStock: true,
            isNew: false,
            isHit: false,
            discount: 15,
            image: 'Floor+Lamp',
            description: 'напольный'
        },
        {
            id: 5,
            name: 'Tolomeo',
            category: 'Настольные',
            brand: 'Artemide',
            price: 18500,
            rating: 5,
            reviews: 22,
            inStock: true,
            isNew: false,
            isHit: false,
            discount: null,
            image: 'Desk+Lam',
            description: 'настольная'
        },
        {
            id: 6,
            name: 'PH 5',
            category: 'Подвесные',
            brand: 'Louis Poulsen',
            price: 42800,
            rating: 4,
            reviews: 17,
            inStock: false,
            isNew: false,
            isHit: false,
            discount: null,
            image: 'Suspen',
            description: 'подвес'
        },
        {
            id: 7,
            name: 'Floor 600',
            category: 'Торшеры',
            brand: 'Ikea',
            price: 8900,
            rating: 4,
            reviews: 45,
            inStock: true,
            isNew: true,
            isHit: false,
            discount: null,
            image: 'Floor+Lamp',
            description: 'напольный'
        },
        {
            id: 8,
            name: 'Table Mini',
            category: 'Настольные',
            brand: 'Muuto',
            price: 7300,
            rating: 5,
            reviews: 11,
            inStock: true,
            isNew: false,
            isHit: true,
            discount: null,
            image: 'Table+Lamp',
            description: 'настольная'
        },
        {
            id: 9,
            name: 'Wall 120',
            category: 'Бра',
            brand: 'Flos',
            price: 15600,
            rating: 4,
            reviews: 9,
            inStock: true,
            isNew: false,
            isHit: false,
            discount: null,
            image: 'Wall+Light',
            description: 'бра'
        },
        {
            id: 10,
            name: 'Suspension Bell',
            category: 'Подвесные',
            brand: 'Louis Poulsen',
            price: 31500,
            rating: 5,
            reviews: 14,
            inStock: true,
            isNew: true,
            isHit: false,
            discount: null,
            image: 'Suspen',
            description: 'подвес'
        },
        {
            id: 11,
            name: 'Classic Floor',
            category: 'Торшеры',
            brand: 'Ikea',
            price: 12500,
            rating: 4,
            reviews: 23,
            inStock: true,
            isNew: false,
            isHit: false,
            discount: 10,
            image: 'Floor+Lamp',
            description: 'напольный'
        },
        {
            id: 12,
            name: 'Modern Table',
            category: 'Настольные',
            brand: 'Muuto',
            price: 9800,
            rating: 4,
            reviews: 16,
            inStock: true,
            isNew: false,
            isHit: false,
            discount: null,
            image: 'Table+Lamp',
            description: 'настольная'
        }
    ];

    // ==================== СОСТОЯНИЕ ====================
    let filteredProducts = [...products];
    let currentPage = 1;
    const productsPerPage = 6;
    let currentView = 'grid'; // 'grid' или 'list'
    let activeFilters = {
        category: 'all',
        priceMin: 0,
        priceMax: 50000,
        brands: ['Ikea', 'Muuto'], // по умолчанию выбраны
        inStockOnly: true
    };

    // ==================== DOM ЭЛЕМЕНТЫ ====================
    const productsContainer = document.getElementById('products-container');
    const paginationContainer = document.getElementById('pagination-container');
    const loadMoreBtn = document.getElementById('load-more');
    const productCountEl = document.getElementById('product-count');
    
    // Элементы фильтров
    const categoryRadios = document.querySelectorAll('.filter-category');
    const priceMinInput = document.getElementById('price-min');
    const priceMaxInput = document.getElementById('price-max');
    const priceRange = document.getElementById('price-range');
    const brandCheckboxes = document.querySelectorAll('.filter-brand');
    const inStockSwitch = document.getElementById('inStockOnly');
    const sortSelect = document.getElementById('sort-select');
    const gridViewBtn = document.getElementById('grid-view');
    const listViewBtn = document.getElementById('list-view');
    const applyMobileBtn = document.getElementById('apply-filters-mobile');

    // ==================== ИНИЦИАЛИЗАЦИЯ ====================
    function init() {
        // Устанавливаем начальные значения фильтров в UI
        document.querySelector('input[name="category"][value="all"]').checked = true;
        brandCheckboxes.forEach(cb => {
            if (activeFilters.brands.includes(cb.value)) {
                cb.checked = true;
            }
        });
        inStockSwitch.checked = activeFilters.inStockOnly;
        priceMinInput.value = activeFilters.priceMin;
        priceMaxInput.value = activeFilters.priceMax;
        priceRange.value = activeFilters.priceMax;

        // Отрисовываем товары
        applyFiltersAndRender();
        
        // Добавляем обработчики событий
        addEventListeners();
    }

    // ==================== ОБРАБОТЧИКИ ====================
    function addEventListeners() {
        // Категория
        categoryRadios.forEach(radio => {
            radio.addEventListener('change', () => {
                activeFilters.category = document.querySelector('input[name="category"]:checked').value;
                currentPage = 1;
                applyFiltersAndRender();
            });
        });

        // Цена (поля ввода)
        priceMinInput.addEventListener('input', () => {
            activeFilters.priceMin = parseInt(priceMinInput.value) || 0;
            priceRange.value = activeFilters.priceMax;
            currentPage = 1;
            applyFiltersAndRender();
        });

        priceMaxInput.addEventListener('input', () => {
            activeFilters.priceMax = parseInt(priceMaxInput.value) || 50000;
            priceRange.value = activeFilters.priceMax;
            currentPage = 1;
            applyFiltersAndRender();
        });

        // Цена (ползунок)
        priceRange.addEventListener('input', () => {
            activeFilters.priceMax = parseInt(priceRange.value);
            priceMaxInput.value = activeFilters.priceMax;
            currentPage = 1;
            applyFiltersAndRender();
        });

        // Бренды
        brandCheckboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                updateBrandsFilter();
                currentPage = 1;
                applyFiltersAndRender();
            });
        });

        // Наличие
        inStockSwitch.addEventListener('change', () => {
            activeFilters.inStockOnly = inStockSwitch.checked;
            currentPage = 1;
            applyFiltersAndRender();
        });

        // Сортировка
        sortSelect.addEventListener('change', () => {
            applyFiltersAndRender();
        });

        // Кнопки вида (плитка/список)
        gridViewBtn.addEventListener('click', () => {
            currentView = 'grid';
            gridViewBtn.classList.add('active');
            listViewBtn.classList.remove('active');
            renderProducts();
        });

        listViewBtn.addEventListener('click', () => {
            currentView = 'list';
            listViewBtn.classList.add('active');
            gridViewBtn.classList.remove('active');
            renderProducts();
        });

        // Кнопка "Загрузить ещё"
        loadMoreBtn.addEventListener('click', () => {
            currentPage++;
            renderProducts();
        });

        // Кнопка "Применить фильтры" на мобильных
        if (applyMobileBtn) {
            applyMobileBtn.addEventListener('click', () => {
                // Просто закрываем меню (Bootstrap коллапс)
                const aside = document.querySelector('aside');
                // Фильтры уже применились через события выше
            });
        }

        // Лайки (делегирование событий)
        productsContainer.addEventListener('click', (e) => {
            const likeBtn = e.target.closest('.btn-like');
            if (likeBtn) {
                e.preventDefault();
                const icon = likeBtn.querySelector('i');
                if (icon.classList.contains('bi-heart')) {
                    icon.classList.remove('bi-heart');
                    icon.classList.add('bi-heart-fill', 'text-danger');
                } else {
                    icon.classList.remove('bi-heart-fill', 'text-danger');
                    icon.classList.add('bi-heart');
                }
            }
        });
    }

    // ==================== ФИЛЬТРАЦИЯ ====================
    function updateBrandsFilter() {
        const selectedBrands = [];
        brandCheckboxes.forEach(cb => {
            if (cb.checked) {
                selectedBrands.push(cb.value);
            }
        });
        activeFilters.brands = selectedBrands;
    }

    function filterProducts() {
        return products.filter(product => {
            // Фильтр по категории
            if (activeFilters.category !== 'all' && product.category !== activeFilters.category) {
                return false;
            }

            // Фильтр по цене
            if (product.price < activeFilters.priceMin || product.price > activeFilters.priceMax) {
                return false;
            }

            // Фильтр по брендам
            if (activeFilters.brands.length > 0 && !activeFilters.brands.includes(product.brand)) {
                return false;
            }

            // Фильтр по наличию
            if (activeFilters.inStockOnly && !product.inStock) {
                return false;
            }

            return true;
        });
    }

    function sortProducts(productsToSort) {
        const sortBy = sortSelect.value;
        
        switch(sortBy) {
            case 'price-asc':
                return [...productsToSort].sort((a, b) => a.price - b.price);
            case 'price-desc':
                return [...productsToSort].sort((a, b) => b.price - a.price);
            case 'new':
                return [...productsToSort].sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
            case 'popular':
            default:
                return [...productsToSort].sort((a, b) => b.reviews - a.reviews);
        }
    }

    // ==================== ОТРИСОВКА ====================
    function renderProducts() {
        const startIndex = (currentPage - 1) * productsPerPage;
        const endIndex = startIndex + productsPerPage;
        const productsToShow = filteredProducts.slice(0, endIndex);
        
        let html = '';
        
        productsToShow.forEach(product => {
            const ratingStars = '★'.repeat(product.rating) + '☆'.repeat(5 - product.rating);
            const discountBadge = product.discount ? `<span class="position-absolute bottom-0 start-0 m-2 badge bg-warning text-dark rounded-pill">-${product.discount}%</span>` : '';
            const newBadge = product.isNew ? `<span class="position-absolute bottom-0 start-0 m-2 badge bg-primary rounded-pill">Новинка</span>` : '';
            const hitBadge = product.isHit ? `<span class="position-absolute bottom-0 start-0 m-2 badge bg-success rounded-pill">Хит</span>` : '';
            const outOfStockBadge = !product.inStock ? `<span class="position-absolute bottom-0 start-0 m-2 badge bg-secondary rounded-pill">Нет в наличии</span>` : '';
            
            // Выбираем какой бейдж показывать (приоритет: скидка > новинка > хит > нет в наличии)
            let positionBadge = discountBadge || newBadge || hitBadge || outOfStockBadge;
            
            html += `
                <div class="${currentView === 'grid' ? 'col-sm-6 col-xl-4' : 'col-12'}">
                    <article class="card h-100 border-0 shadow-sm rounded-4 product-card ${currentView === 'list' ? 'list-view' : ''}">
                        <div class="position-relative ${currentView === 'list' ? 'h-100' : ''}">
                            <img src="Media/банан.png"
                            class="card-img-top ${currentView === 'list' ? 'rounded-start-4 rounded-top-0' : 'rounded-top-4'}" 
                                 alt="${product.name}">
                            <button class="btn btn-like position-absolute top-0 end-0 m-2 bg-white rounded-circle p-2 border-0 shadow-sm">
                                <i class="bi bi-heart fs-6"></i>
                            </button>
                            ${positionBadge}
                        </div>
                        <div class="card-body">
                            <h5 class="card-title fw-semibold mb-1">${product.name}</h5>
                            <p class="text-secondary small mb-2">${product.brand} · ${product.description}</p>
                            <div class="d-flex justify-content-between align-items-center mb-2">
                                <span class="fw-bold fs-5">${product.price.toLocaleString()} ₽</span>
                                <span class="text-warning small">${ratingStars} <span class="text-secondary">(${product.reviews})</span></span>
                            </div>
                            <div class="input-group input-group-sm mt-2">
                                <input type="text" class="form-control form-control-sm bg-light border-0" placeholder="Ваш комментарий...">
                                <button class="btn btn-outline-secondary border-0" type="button"><i class="bi bi-send"></i></button>
                            </div>
                        </div>
                    </article>
                </div>
            `;
        });

        // Если товаров нет
        if (productsToShow.length === 0) {
            html = `
                <div class="col-12 text-center py-5">
                    <i class="bi bi-search fs-1 text-secondary"></i>
                    <h4 class="mt-3">Ничего не найдено</h4>
                    <p class="text-secondary">Попробуйте изменить параметры фильтрации</p>
                </div>
            `;
        }

        productsContainer.innerHTML = html;

        // Обновляем пагинацию
        renderPagination();

        // Обновляем кнопку "Загрузить ещё"
        if (endIndex >= filteredProducts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }

        // Обновляем счетчик товаров
        productCountEl.textContent = `${filteredProducts.length} ${getProductWord(filteredProducts.length)} · минимализм и стиль`;
    }

    function renderPagination() {
        const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
        
        if (totalPages <= 1) {
            paginationContainer.innerHTML = '';
            return;
        }

        let paginationHtml = '<ul class="pagination">';
        
        // Кнопка "Назад"
        paginationHtml += `<li class="page-item ${currentPage === 1 ? 'disabled' : ''}">
            <a class="page-link border-0 bg-transparent text-secondary" href="#" data-page="${currentPage - 1}">←</a>
        </li>`;

        // Номера страниц
        for (let i = 1; i <= totalPages; i++) {
            paginationHtml += `<li class="page-item ${currentPage === i ? 'active' : ''}">
                <a class="page-link border-0 ${currentPage === i ? 'bg-primary' : 'bg-transparent text-dark'} rounded-circle mx-1" href="#" data-page="${i}">${i}</a>
            </li>`;
        }

        // Кнопка "Вперед"
        paginationHtml += `<li class="page-item ${currentPage === totalPages ? 'disabled' : ''}">
            <a class="page-link border-0 bg-transparent text-secondary" href="#" data-page="${currentPage + 1}">→</a>
        </li>`;

        paginationHtml += '</ul>';

        paginationContainer.innerHTML = paginationHtml;

        // Добавляем обработчики на ссылки пагинации
        document.querySelectorAll('.pagination a').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = parseInt(e.target.dataset.page);
                if (!isNaN(page) && page >= 1 && page <= totalPages) {
                    currentPage = page;
                    renderProducts();
                    // Прокрутка вверх
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }
            });
        });
    }

    function applyFiltersAndRender() {
        filteredProducts = filterProducts();
        filteredProducts = sortProducts(filteredProducts);
        renderProducts();
    }

    // Вспомогательная функция для склонения слова "товар"
    function getProductWord(count) {
        if (count % 10 === 1 && count % 100 !== 11) {
            return 'модель';
        } else if ([2, 3, 4].includes(count % 10) && ![12, 13, 14].includes(count % 100)) {
            return 'модели';
        } else {
            return 'моделей';
        }
    }

    // Запуск
    init();
});