document.addEventListener('DOMContentLoaded', function() {
    // Initialize the application
    initApp();

    // Add event listeners
    addEventListeners();
});

// Initialize the application
function initApp() {
    // Load featured cafe
    loadFeaturedCafe();

    // Load cafes
    loadCafes();

    // Load categories
    loadCategories();
}

// Add event listeners
function addEventListeners() {
    // Mobile menu toggle
    const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
    const closeMenu = document.querySelector('.close-menu');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', function() {
            mobileMenu.classList.add('active');
        });
    }

    if (closeMenu) {
        closeMenu.addEventListener('click', function() {
            mobileMenu.classList.remove('active');
        });
    }

    // Search functionality
    const mainSearch = document.getElementById('main-search');
    const searchBtn = document.querySelector('.search-btn');

    if (searchBtn) {
        searchBtn.addEventListener('click', function() {
            searchCafes(mainSearch.value);
        });
    }

    if (mainSearch) {
        mainSearch.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                searchCafes(mainSearch.value);
            }
        });
    }

    // Filter buttons
    const filterButtons = document.querySelectorAll('.filter-button');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter cafes
            filterCafes(this.dataset.filter);
        });
    });

    // View toggle
    const viewOptions = document.querySelectorAll('.view-option');

    viewOptions.forEach(option => {
        option.addEventListener('click', function() {
            // Remove active class from all options
            viewOptions.forEach(opt => opt.classList.remove('active'));
            
            // Add active class to clicked option
            this.classList.add('active');
            
            // Toggle view
            toggleView(this.dataset.view);
        });
    });

    // Load more button
    const loadMoreBtn = document.getElementById('load-more-btn');

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', function() {
            loadMoreCafes();
        });
    }

    // Newsletter form
    const newsletterSubmit = document.getElementById('newsletter-submit');
    const newsletterEmail = document.getElementById('newsletter-email');
    const newsletterMessage = document.getElementById('newsletter-message');

    if (newsletterSubmit) {
        newsletterSubmit.addEventListener('click', function() {
            if (validateEmail(newsletterEmail.value)) {
                // Simulate form submission
                newsletterMessage.textContent = 'Thank you for subscribing!';
                newsletterMessage.style.color = '#4CAF50';
                newsletterEmail.value = '';
            } else {
                newsletterMessage.textContent = 'Please enter a valid email address.';
                newsletterMessage.style.color = '#F44336';
            }
        });
    }
}

// Load featured cafe
function loadFeaturedCafe() {
    const featuredCafeContainer = document.getElementById('featured-cafe');

    if (!featuredCafeContainer) return;

    // Find featured cafe
    const featuredCafe = window.appData.cafes.find(cafe => cafe.featured);

    if (featuredCafe) {
        featuredCafeContainer.innerHTML = `
            <div class="featured-content">
                <div class="featured-badge">Featured</div>
                <h2>${featuredCafe.name}</h2>
                <div class="featured-rating">
                    <div class="stars">${getStarsHTML(featuredCafe.rating)}</div>
                    <span>${featuredCafe.rating.toFixed(1)} (${featuredCafe.reviews} reviews)</span>
                </div>
                <p>${featuredCafe.description}</p>
                <div class="featured-meta">
                    <div class="meta-item">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${featuredCafe.location}</span>
                    </div>
                    <div class="meta-item">
                        <i class="fas fa-clock"></i>
                        <span>Open: ${featuredCafe.hours}</span>
                    </div>
                </div>
                <a href="cafe-details.html?id=${featuredCafe.id}" class="btn btn-primary">View Menu</a>
            </div>
            <div class="featured-image">
                <img src="${featuredCafe.image}" alt="${featuredCafe.name}">
            </div>
        `;
    }
}

// Load cafes
function loadCafes(limit = 6) {
    const cafesGrid = document.getElementById('cafes-grid');

    if (!cafesGrid) return;

    // Clear cafes grid
    cafesGrid.innerHTML = '';

    // Get cafes (excluding featured)
    const cafes = window.appData.cafes.filter(cafe => !cafe.featured).slice(0, limit);

    // Add cafes to grid
    cafes.forEach(cafe => {
        const cafeCard = document.createElement('div');
        cafeCard.className = 'cafe-card';
        cafeCard.dataset.id = cafe.id;
        cafeCard.dataset.tags = cafe.tags.join(',').toLowerCase();
        cafeCard.dataset.price = getPriceCategory(cafe.priceRange);
        cafeCard.dataset.rating = cafe.rating;
        
        cafeCard.innerHTML = `
            <div class="cafe-image">
                <img src="${cafe.image}" alt="${cafe.name}">
            </div>
            <div class="cafe-details">
                <div>
                    <h3 class="cafe-name">${cafe.name}</h3>
                    <div class="cafe-rating">
                        <div class="stars">${getStarsHTML(cafe.rating)}</div>
                        <span class="rating-count">${cafe.rating.toFixed(1)} (${cafe.reviews})</span>
                    </div>
                    <div class="cafe-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${cafe.location}</span>
                    </div>
                </div>
                <div class="cafe-tags">
                    ${cafe.tags.map(tag => `<span class="cafe-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        // Add click event to cafe card
        cafeCard.addEventListener('click', function() {
            window.location.href = `cafe-details.html?id=${cafe.id}`;
        });
        
        cafesGrid.appendChild(cafeCard);
    });

    // Show/hide load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = limit >= window.appData.cafes.filter(cafe => !cafe.featured).length ? 'none' : 'inline-block';
    }
}

// Load categories
function loadCategories() {
    const categoriesGrid = document.getElementById('categories-grid');

    if (!categoriesGrid) return;

    // Clear categories grid
    categoriesGrid.innerHTML = '';

    // Add categories to grid
    window.appData.categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'category-card';
        categoryCard.dataset.category = category.name.toLowerCase();
        
        categoryCard.innerHTML = `
            <div class="category-icon">
                <i class="fas fa-${category.icon}"></i>
            </div>
            <h3>${category.name}</h3>
            <p>${category.count} places</p>
        `;
        
        // Add click event to category card
        categoryCard.addEventListener('click', function() {
            // Filter cafes by category
            filterCafes(category.name.toLowerCase());
            
            // Scroll to cafes section
            document.querySelector('.cafes-section').scrollIntoView({ behavior: 'smooth' });
            
            // Update active filter button
            const filterButtons = document.querySelectorAll('.filter-button');
            filterButtons.forEach(btn => btn.classList.remove('active'));
            
            // Try to find matching filter button
            const matchingButton = Array.from(filterButtons).find(btn => 
                btn.dataset.filter.toLowerCase() === category.name.toLowerCase()
            );
            
            if (matchingButton) {
                matchingButton.classList.add('active');
            } else {
                // Default to "All" if no matching button
                const allButton = Array.from(filterButtons).find(btn => btn.dataset.filter === 'all');
                if (allButton) allButton.classList.add('active');
            }
        });
        
        categoriesGrid.appendChild(categoryCard);
    });
}

// Search cafes
function searchCafes(query) {
    if (!query) {
        // If query is empty, show all cafes
        loadCafes();
        return;
    }

    query = query.toLowerCase();

    const cafesGrid = document.getElementById('cafes-grid');

    if (!cafesGrid) return;

    // Clear cafes grid
    cafesGrid.innerHTML = '';

    // Filter cafes by query
    const filteredCafes = window.appData.cafes.filter(cafe => {
        return (
            cafe.name.toLowerCase().includes(query) ||
            cafe.description.toLowerCase().includes(query) ||
            cafe.location.toLowerCase().includes(query) ||
            cafe.tags.some(tag => tag.toLowerCase().includes(query))
        );
    });

    // Add filtered cafes to grid
    filteredCafes.forEach(cafe => {
        const cafeCard = document.createElement('div');
        cafeCard.className = 'cafe-card';
        cafeCard.dataset.id = cafe.id;
        
        cafeCard.innerHTML = `
            <div class="cafe-image">
                <img src="${cafe.image}" alt="${cafe.name}">
            </div>
            <div class="cafe-details">
                <div>
                    <h3 class="cafe-name">${cafe.name}</h3>
                    <div class="cafe-rating">
                        <div class="stars">${getStarsHTML(cafe.rating)}</div>
                        <span class="rating-count">${cafe.rating.toFixed(1)} (${cafe.reviews})</span>
                    </div>
                    <div class="cafe-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${cafe.location}</span>
                    </div>
                </div>
                <div class="cafe-tags">
                    ${cafe.tags.map(tag => `<span class="cafe-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        // Add click event to cafe card
        cafeCard.addEventListener('click', function() {
            window.location.href = `cafe-details.html?id=${cafe.id}`;
        });
        
        cafesGrid.appendChild(cafeCard);
    });

    // Hide load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }

    // Show message if no results
    if (filteredCafes.length === 0) {
        cafesGrid.innerHTML = `
            <div class="no-results">
                <p>No cafes found matching "${query}"</p>
                <button class="btn btn-secondary" onclick="loadCafes()">Show All Cafes</button>
            </div>
        `;
    }
}

// Filter cafes
function filterCafes(filter) {
    if (filter === 'all') {
        // If filter is 'all', show all cafes
        loadCafes();
        return;
    }

    const cafesGrid = document.getElementById('cafes-grid');

    if (!cafesGrid) return;

    // Clear cafes grid
    cafesGrid.innerHTML = '';

    // Filter cafes by filter
    let filteredCafes = [];

    switch (filter) {
        case 'top-rated':
            filteredCafes = window.appData.cafes.filter(cafe => cafe.rating >= 4.5);
            break;
        case 'affordable':
            filteredCafes = window.appData.cafes.filter(cafe => cafe.priceRange === '$');
            break;
        case 'traditional':
            filteredCafes = window.appData.cafes.filter(cafe => 
                cafe.tags.some(tag => tag.toLowerCase() === 'traditional')
            );
            break;
        case 'modern':
            filteredCafes = window.appData.cafes.filter(cafe => 
                cafe.tags.some(tag => tag.toLowerCase() === 'modern')
            );
            break;
        default:
            // Try to match with tags
            filteredCafes = window.appData.cafes.filter(cafe => 
                cafe.tags.some(tag => tag.toLowerCase() === filter.toLowerCase())
            );
    }

    // Add filtered cafes to grid
    filteredCafes.forEach(cafe => {
        const cafeCard = document.createElement('div');
        cafeCard.className = 'cafe-card';
        cafeCard.dataset.id = cafe.id;
        
        cafeCard.innerHTML = `
            <div class="cafe-image">
                <img src="${cafe.image}" alt="${cafe.name}">
            </div>
            <div class="cafe-details">
                <div>
                    <h3 class="cafe-name">${cafe.name}</h3>
                    <div class="cafe-rating">
                        <div class="stars">${getStarsHTML(cafe.rating)}</div>
                        <span class="rating-count">${cafe.rating.toFixed(1)} (${cafe.reviews})</span>
                    </div>
                    <div class="cafe-location">
                        <i class="fas fa-map-marker-alt"></i>
                        <span>${cafe.location}</span>
                    </div>
                </div>
                <div class="cafe-tags">
                    ${cafe.tags.map(tag => `<span class="cafe-tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        // Add click event to cafe card
        cafeCard.addEventListener('click', function() {
            window.location.href = `cafe-details.html?id=${cafe.id}`;
        });
        
        cafesGrid.appendChild(cafeCard);
    });

    // Hide load more button
    const loadMoreBtn = document.getElementById('load-more-btn');
    if (loadMoreBtn) {
        loadMoreBtn.style.display = 'none';
    }

    // Show message if no results
    if (filteredCafes.length === 0) {
        cafesGrid.innerHTML = `
            <div class="no-results">
                <p>No cafes found matching the selected filter</p>
                <button class="btn btn-secondary" onclick="loadCafes()">Show All Cafes</button>
            </div>
        `;
    }
}

// Toggle view (grid/list)
function toggleView(view) {
    const cafesGrid = document.getElementById('cafes-grid');

    if (!cafesGrid) return;

    if (view === 'grid') {
        cafesGrid.className = 'cafes-grid';
        
        // Convert list items to grid cards
        const listItems = cafesGrid.querySelectorAll('.cafe-list-item');
        
        if (listItems.length > 0) {
            // Get cafe data
            const cafeIds = Array.from(listItems).map(item => item.dataset.id);
            const cafes = window.appData.cafes.filter(cafe => cafeIds.includes(cafe.id.toString()));
            
            // Clear cafes container
            cafesGrid.innerHTML = '';
            
            // Add cafes as grid cards
            cafes.forEach(cafe => {
                const cafeCard = document.createElement('div');
                cafeCard.className = 'cafe-card';
                cafeCard.dataset.id = cafe.id;
                
                cafeCard.innerHTML = `
                    <div class="cafe-image">
                        <img src="${cafe.image}" alt="${cafe.name}">
                    </div>
                    <div class="cafe-details">
                        <div>
                            <h3 class="cafe-name">${cafe.name}</h3>
                            <div class="cafe-rating">
                                <div class="stars">${getStarsHTML(cafe.rating)}</div>
                                <span class="rating-count">${cafe.rating.toFixed(1)} (${cafe.reviews})</span>
                            </div>
                            <div class="cafe-location">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${cafe.location}</span>
                            </div>
                        </div>
                        <div class="cafe-tags">
                            ${cafe.tags.map(tag => `<span class="cafe-tag">${tag}</span>`).join('')}
                        </div>
                    </div>
                `;
                
                // Add click event to cafe card
                cafeCard.addEventListener('click', function() {
                    window.location.href = `cafe-details.html?id=${cafe.id}`;
                });
                
                cafesGrid.appendChild(cafeCard);
            });
        }
    } else if (view === 'list') {
        cafesGrid.className = 'cafes-list';
        
        // Convert grid cards to list items
        const gridCards = cafesGrid.querySelectorAll('.cafe-card');
        
        if (gridCards.length > 0) {
            // Get cafe data
            const cafeIds = Array.from(gridCards).map(card => card.dataset.id);
            const cafes = window.appData.cafes.filter(cafe => cafeIds.includes(cafe.id.toString()));
            
            // Clear cafes container
            cafesGrid.innerHTML = '';
            
            // Add cafes as list items
            cafes.forEach(cafe => {
                const cafeListItem = document.createElement('div');
                cafeListItem.className = 'cafe-list-item';
                cafeListItem.dataset.id = cafe.id;
                
                cafeListItem.innerHTML = `
                    <div class="cafe-list-image">
                        <img src="${cafe.image}" alt="${cafe.name}">
                    </div>
                    <div class="cafe-list-details">
                        <div class="cafe-list-header">
                            <h3 class="cafe-list-name">${cafe.name}</h3>
                            <div class="cafe-list-rating">
                                <div class="stars">${getStarsHTML(cafe.rating)}</div>
                                <span>${cafe.rating.toFixed(1)} (${cafe.reviews})</span>
                            </div>
                        </div>
                        <p class="cafe-list-description">${cafe.description}</p>
                        <div class="cafe-list-meta">
                            <div class="meta-item">
                                <i class="fas fa-map-marker-alt"></i>
                                <span>${cafe.location}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-clock"></i>
                                <span>${cafe.hours}</span>
                            </div>
                            <div class="meta-item">
                                <i class="fas fa-tag"></i>
                                <span>${getPriceRangeText(cafe.priceRange)}</span>
                            </div>
                        </div>
                        <div class="cafe-list-tags">
                            ${cafe.tags.map(tag => `<span class="cafe-tag">${tag}</span>`).join('')}
                        </div>
                        <a href="cafe-details.html?id=${cafe.id}" class="btn btn-primary">View Details</a>
                    </div>
                `;
                
                cafesGrid.appendChild(cafeListItem);
            });
        }
    }
}

// Load more cafes
function loadMoreCafes() {
    const cafesGrid = document.getElementById('cafes-grid');

    if (!cafesGrid) return;

    // Get current number of cafes
    const currentCount = cafesGrid.querySelectorAll('.cafe-card').length;

    // Load more cafes
    loadCafes(currentCount + 3);
}

// Helper functions
function getStarsHTML(rating) {
    const fullStars = Math.floor(rating);
    const halfStar = rating % 1 >= 0.5;
    const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

    let starsHTML = '';

    // Add full stars
    for (let i = 0; i < fullStars; i++) {
        starsHTML += '★';
    }

    // Add half star
    if (halfStar) {
        starsHTML += '★';
    }

    // Add empty stars
    for (let i = 0; i < emptyStars; i++) {
        starsHTML += '☆';
    }

    return starsHTML;
}

function getPriceCategory(priceRange) {
    switch (priceRange) {
        case '$':
            return 'affordable';
        case '$$':
            return 'moderate';
        case '$$$':
            return 'expensive';
        default:
            return 'moderate';
    }
}

function getPriceRangeText(priceRange) {
    switch (priceRange) {
        case '$':
            return 'Affordable';
        case '$$':
            return 'Moderate';
        case '$$$':
            return 'Expensive';
        default:
            return 'Moderate';
    }
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Make functions available globally
window.loadCafes = loadCafes;