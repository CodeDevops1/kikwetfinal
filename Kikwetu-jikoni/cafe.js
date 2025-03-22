/**
 * JavaScript for Cafe Detail Page
 */

document.addEventListener("DOMContentLoaded", () => {
    // Get cafe ID from URL
    const params = window.utils.getUrlParams();
    const cafeId = parseInt(params.id) || 1;
    
    // Load cafe details
    loadCafeDetails(cafeId);
    
    // Load menu items
    loadMenuItems(cafeId);
    
    // Initialize cart
    initializeCart();
    
    // Initialize view all button
    initViewAllButton();
    
    // Initialize filter options
    initFilterOptions();
    
    // Initialize modal
    initModal();
    
    // Initialize cart overlay
    initCartOverlay();
    
    initMpesaButton();
     // Initialize map functionality
    initializeMap(window.appData.cafes);
    // Load cafes on home page if on index page
    loadCafesOnHomePage()

    
});

// Load cafe details
function loadCafeDetails(cafeId) {
    // Find cafe by ID
    const cafe = window.appData.cafes.find(cafe => cafe.id === cafeId);
    
    if (!cafe) {
        window.location.href = "index.html";
        return;
    }
    
    // Update page title
    document.title = `${cafe.name} - Kikwetu`;
    
    // Update cafe details
    const cafeTitle = document.getElementById("cafe-title");
    const cafeDescription = document.getElementById("cafe-description");
    const cafeLocation = document.getElementById("cafe-location");
    const cafePhone = document.getElementById("cafe-phone");
    const cafeLogo = document.getElementById("cafe-logo");
    const heroImg = document.getElementById("hero-img");
    const featuredName = document.getElementById("featured-name");
    const featuredNameSecond = document.getElementById("featured-name-second");
    const featuredPrice = document.getElementById("featured-price");
    const cartCafeLogo = document.getElementById("cart-cafe-logo");
    const copyrightCafeName = document.getElementById("copyright-cafe-name");
    const copyrightAddress = document.getElementById("copyright-address");
    
    if (cafeTitle) cafeTitle.textContent = cafe.name.toUpperCase();
    if (cafeDescription) cafeDescription.textContent = cafe.description;
    if (cafeLocation) cafeLocation.textContent = cafe.location;
    if (cafePhone) cafePhone.textContent = cafe.phone;
    if (cafeLogo && cafe.logo) cafeLogo.innerHTML = `<img src="${cafe.logo}" alt="${cafe.name} Logo">`;
    if (heroImg) heroImg.src = cafe.image;
    
    // Update featured item
    if (featuredName && cafe.featuredItem) {
        const nameParts = cafe.featuredItem.name.split(" ");
        if (nameParts.length > 1) {
            featuredName.textContent = nameParts[0];
            featuredNameSecond.textContent = nameParts.slice(1).join(" ");
        } else {
            featuredName.textContent = cafe.featuredItem.name;
            featuredNameSecond.textContent = "";
        }
    }
    
    if (featuredPrice && cafe.featuredItem) {
        featuredPrice.textContent = `KSh ${cafe.featuredItem.price}`;
    }
    
    // Update cart logo
    if (cartCafeLogo && cafe.logo) {
        cartCafeLogo.innerHTML = `<img src="${cafe.logo}" alt="${cafe.name} Logo">`;
    }
    
    // Update copyright
    if (copyrightCafeName) copyrightCafeName.textContent = cafe.name.toUpperCase();
    if (copyrightAddress) copyrightAddress.textContent = cafe.address;
}



// Initialize map
function initializeMap(cafes) {
  // Find cafe by ID
  const params = window.utils.getUrlParams();
  const cafeId = parseInt(params.id) || 1;
  const cafe = cafes.find(cafe => cafe.id === cafeId);

  if (!cafe) {
    console.error(`Cafe with ID ${cafeId} not found.`);
    return;
  }

  // Get the map icon
  const mapIcon = document.getElementById('map-icon');

  if (mapIcon) {
    mapIcon.addEventListener('click', () => {
      // Open Google Maps with the cafe's coordinates
      window.open(`https://www.google.com/maps/search/?api=1&query=${cafe.latitude},${cafe.longitude}`, '_blank');
    });
  }
}

// Load cafes on home page
function loadCafesOnHomePage() {
    // Check if on index page
    if (window.location.pathname.includes("index.html") || window.location.pathname === "/") {
        const homeCafes = document.getElementById("home-cafes");

        if (homeCafes) {
            homeCafes.innerHTML = ""; // Clear existing cafes

            window.appData.cafes.forEach((cafe, index) => {
                const cafeCard = document.createElement("div");
                cafeCard.className = "home-cafe";
                cafeCard.style.animationDelay = `${index * 0.1}s`; // Add animation delay

                cafeCard.innerHTML = `
                    <div class="home-cafe-image">
                        <img src="${cafe.image}" alt="${cafe.name}">
                        <div class="map-icon" id="map-icon-${cafe.id}" title="View on Map">
                            <i class="fas fa-map-marker-alt"></i>
                        </div>
                    </div>
                    <div class="home-cafe-details">
                        <div class="home-cafe-name">${cafe.name}</div>
                        <div class="home-cafe-location"><i class="fas fa-map-marker-alt"></i> ${cafe.location}</div>
                        <div class="home-cafe-description">${cafe.description}</div>
                    </div>
                    <a href="cafe.html?id=${cafe.id}" class="home-cafe-button">Order Now</a>
                `;

                homeCafes.appendChild(cafeCard);

                // Add map functionality to each cafe
                const mapIcon = document.getElementById(`map-icon-${cafe.id}`);

                if (mapIcon) {
                    mapIcon.addEventListener('click', () => {
                        // Open Google Maps with the cafe's coordinates
                        window.open(`https://www.google.com/maps/search/?api=1&query=${cafe.latitude},${cafe.longitude}`, '_blank');
                    });
                }
            });
        }
    }
}

// Function to check if on index page (simplified)
function isOnIndexPage() {
    return window.location.pathname === '/' || window.location.pathname.endsWith('index.html');
}




// Load menu items
function loadMenuItems(cafeId) {
    const menuGrid = document.getElementById("menu-grid");
    
    if (!menuGrid) return;
    
    // Clear existing items
    menuGrid.innerHTML = "";
    
    // Get menu items
    const menuItems = window.appData.menu;
    
    // Create menu item cards
    menuItems.forEach((item, index) => {
        const menuItem = document.createElement("div");
        menuItem.className = "menu-item";
        menuItem.setAttribute("data-id", item.id);
        menuItem.setAttribute("data-name", item.name);
        menuItem.setAttribute("data-price", item.price);
        menuItem.setAttribute("data-weight", item.weight);
        menuItem.setAttribute("data-image", item.image);
        menuItem.setAttribute("data-category", item.category);
        menuItem.setAttribute("data-description", item.description);
        menuItem.setAttribute("data-rating", item.rating);
        menuItem.setAttribute("data-allergens", item.allergens);
        menuItem.setAttribute("data-prep-time", item.prepTime);
        
        // Add animation delay
        menuItem.style.animationDelay = `${index * 0.1}s`;
        
        // Create star rating HTML
        const starsHTML = window.utils.generateStarRating(item.rating);
        
        menuItem.innerHTML = `
            <div class="menu-item-badge">${item.badge || ""}</div>
            <div class="menu-item-rating"><i class="fas fa-star"></i> ${item.rating}</div>
            <div class="menu-item-image">
                <img src="${item.image}" alt="${item.name}">
                <div class="info-icon">
                    <i class="fas fa-info"></i>
                </div>
            </div>
            <div class="menu-item-details">
                <div class="menu-item-price">KSh ${item.price} <span class="menu-item-time"><i class="far fa-clock"></i> ${item.prepTime}</span></div>
                <div class="menu-item-name">${item.name}</div>
                <div class="menu-item-weight">${item.weight}</div>
                <button class="add-to-cart">Add</button>
            </div>
        `;
        
        menuGrid.appendChild(menuItem);
    });
    
    // Add event listeners to menu items
    initMenuItemEvents();
}

// Initialize menu item events
function initMenuItemEvents() {
    const menuItems = document.querySelectorAll(".menu-item");
    const infoIcons = document.querySelectorAll(".info-icon");
    const addToCartButtons = document.querySelectorAll(".add-to-cart");
    
    // Add click event to menu items
    menuItems.forEach(item => {
        item.addEventListener("click", function() {
            openItemModal(this);
        });
    });
    
    // Add click event to info icons
    infoIcons.forEach(icon => {
        icon.addEventListener("click", function(e) {
            e.stopPropagation();
            const menuItem = this.closest(".menu-item");
            openItemModal(menuItem);
        });
    });
    
    // Add click event to add to cart buttons
    addToCartButtons.forEach(button => {
        button.addEventListener("click", function(e) {
            e.stopPropagation();
            
            const menuItem = this.closest(".menu-item");
            const id = parseInt(menuItem.getAttribute("data-id"));
            const name = menuItem.getAttribute("data-name");
            const price = parseInt(menuItem.getAttribute("data-price"));
            const weight = menuItem.getAttribute("data-weight");
            const image = menuItem.getAttribute("data-image");
            
            // Add item to cart
            addItemToCart({
                id,
                name,
                price,
                weight,
                image,
                quantity: 1
            });
            
            // Visual feedback
            this.textContent = "Added!";
            this.style.backgroundColor = "#4CAF50";
            
            setTimeout(() => {
                this.textContent = "Add";
                this.style.backgroundImage = "linear-gradient(135deg, #d97706, #92400e)";
            }, 1000);
            
            // Show notification
            window.utils.showNotification(`Added ${name} to cart`, "success");
        });
    });
}

// Open item modal
function openItemModal(menuItem) {
    const modal = document.getElementById("item-modal");
    const modalTitle = document.getElementById("modal-title");
    const modalPrice = document.getElementById("modal-price");
    const modalDescription = document.getElementById("modal-description");
    const modalImage = document.getElementById("modal-image");
    const modalWeight = document.getElementById("modal-weight");
    const modalPrepTime = document.getElementById("modal-prep-time");
    const modalRating = document.getElementById("modal-rating");
    const modalAllergens = document.getElementById("modal-allergens");
    const quantityValue = document.getElementById("quantity-value");
    
    if (!modal) return;
    
    // Get item details
    const name = menuItem.getAttribute("data-name");
    const price = menuItem.getAttribute("data-price");
    const weight = menuItem.getAttribute("data-weight");
    const image = menuItem.getAttribute("data-image");
    const description = menuItem.getAttribute("data-description");
    const rating = menuItem.getAttribute("data-rating");
    const allergens = menuItem.getAttribute("data-allergens");
    const prepTime = menuItem.getAttribute("data-prep-time");
    
    // Update modal content
    if (modalTitle) modalTitle.textContent = name;
    if (modalPrice) modalPrice.textContent = `KSh ${price}`;
    if (modalDescription) modalDescription.textContent = description;
    if (modalImage) modalImage.src = image;
    if (modalWeight) modalWeight.textContent = weight;
    if (modalPrepTime) modalPrepTime.textContent = prepTime;
    if (modalRating) modalRating.innerHTML = `<i class="fas fa-star" style="color: #f8e71c;"></i> ${rating} (${Math.floor(rating * 20)} reviews)`;
    if (modalAllergens) modalAllergens.textContent = allergens || "None";
    
    // Reset quantity
    if (quantityValue) quantityValue.textContent = "1";
    
    // Show modal
    modal.classList.add("active");
}

// Initialize view all button
function initViewAllButton() {
    const viewAllBtn = document.getElementById("view-all-btn");
    const menuGrid = document.getElementById("menu-grid");
    const scrollIndicator = document.getElementById("scroll-indicator");
    let isExpanded = false;
    
    if (viewAllBtn && menuGrid) {
        viewAllBtn.addEventListener("click", function() {
            if (!isExpanded) {
                menuGrid.classList.remove("compact");
                menuGrid.classList.add("expanded");
                this.textContent = "Show Less";
                if (scrollIndicator) scrollIndicator.classList.add("hidden");
            } else {
                menuGrid.classList.remove("expanded");
                menuGrid.classList.add("compact");
                this.textContent = "View All";
                document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
                if (scrollIndicator) scrollIndicator.classList.remove("hidden");
            }
            isExpanded = !isExpanded;
        });
    }
}

// Initialize filter options
function initFilterOptions() {
    const filterOptions = document.querySelectorAll(".filter-option");
    
    if (filterOptions.length > 0) {
        filterOptions.forEach(option => {
            option.addEventListener("click", function() {
                // Remove active class from all options
                filterOptions.forEach(opt => opt.classList.remove("active"));
                
                // Add active class to clicked option
                this.classList.add("active");
                
                // Get filter type
                const filterType = this.getAttribute("data-filter");
                
                // Filter menu items
                filterMenuItems(filterType);
            });
        });
    }
}

// Filter menu items
function filterMenuItems(filterType) {
    const menuItems = document.querySelectorAll(".menu-item");
    
    menuItems.forEach(item => {
        const itemCategory = item.getAttribute("data-category") || "daily";
        
        if (filterType === "all") {
            item.style.display = "flex";
        } else if (itemCategory === filterType) {
            item.style.display = "flex";
        } else {
            item.style.display = "none";
        }
    });
}

// Initialize modal
function initModal() {
    const modal = document.getElementById("item-modal");
    const modalClose = document.getElementById("modal-close");
    const quantityMinus = document.getElementById("quantity-minus");
    const quantityPlus = document.getElementById("quantity-plus");
    const quantityValue = document.getElementById("quantity-value");
    const modalAddToCart = document.getElementById("modal-add-to-cart");
    
    if (modal && modalClose) {
        // Close modal when clicking the close button
        modalClose.addEventListener("click", () => {
            modal.classList.remove("active");
        });
        
        // Close modal when clicking outside the modal content
        modal.addEventListener("click", e => {
            if (e.target === modal) {
                modal.classList.remove("active");
            }
        });
    }
    
    // Quantity controls
    if (quantityMinus && quantityPlus && quantityValue) {
        quantityMinus.addEventListener("click", () => {
            let quantity = parseInt(quantityValue.textContent);
            if (quantity > 1) {
                quantity--;
                quantityValue.textContent = quantity;
            }
        });
        
        quantityPlus.addEventListener("click", () => {
            let quantity = parseInt(quantityValue.textContent);
            quantity++;
            quantityValue.textContent = quantity;
        });
    }
    
    // Add to cart button
    if (modalAddToCart) {
        modalAddToCart.addEventListener("click", () => {
            const modalTitle = document.getElementById("modal-title");
            const modalPrice = document.getElementById("modal-price");
            const modalImage = document.getElementById("modal-image");
            const modalWeight = document.getElementById("modal-weight");
            const quantityValue = document.getElementById("quantity-value");
            
            if (!modalTitle || !modalPrice || !modalImage || !modalWeight || !quantityValue) return;
            
            // Get item details
            const name = modalTitle.textContent;
            const priceText = modalPrice.textContent.replace("KSh ", "");
            const price = parseInt(priceText);
            const image = modalImage.src;
            const weight = modalWeight.textContent;
            const quantity = parseInt(quantityValue.textContent);
            
            // Add item to cart
            addItemToCart({
                id: Date.now(), // Use timestamp as ID for simplicity
                name,
                price,
                weight,
                image,
                quantity
            });
            
            // Visual feedback
            modalAddToCart.textContent = "Added to Cart!";
            modalAddToCart.style.backgroundColor = "#4CAF50";
            
            setTimeout(() => {
                modalAddToCart.textContent = "Add to Cart";
                modalAddToCart.style.backgroundImage = "linear-gradient(135deg, #d97706, #92400e)";
                modal.classList.remove("active");
            }, 1000);
            
            // Show notification
            window.utils.showNotification(`Added ${name} to cart`, "success");
        });
    }
}

// Initialize cart
function initializeCart() {
    // Check if cart exists in localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Update cart count
    updateCartCount(cart.reduce((total, item) => total + item.quantity, 0));
    
    // Update cart items
    updateCartItems(cart);
    
    // Update order summary
    updateOrderSummary(cart);
    
    // Toggle empty cart state
    toggleEmptyCartState(cart);
}

// Add item to cart
function addItemToCart(item) {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Check if item already exists in cart
    const existingItemIndex = cart.findIndex(cartItem => cartItem.name === item.name);
    
    if (existingItemIndex !== -1) {
        // Update quantity if item exists
        cart[existingItemIndex].quantity += item.quantity;
    } else {
        // Add new item to cart
        cart.push(item);
    }
    
    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Update cart count
    updateCartCount(cart.reduce((total, item) => total + item.quantity, 0));
    
    // Update cart items
    updateCartItems(cart);
    
    // Update order summary
    updateOrderSummary(cart);
    
    // Toggle empty cart state
    toggleEmptyCartState(cart);
}

// Update cart count
function updateCartCount(count) {
    const cartCountElements = document.querySelectorAll("#cart-count, #mini-cart-count");
    
    cartCountElements.forEach(el => {
        if (el) el.textContent = count;
    });
}

// Update cart items
function updateCartItems(cart) {
    const cartItemsList = document.getElementById("cart-items-list");
    
    if (!cartItemsList) return;
    
    // Clear existing items
    cartItemsList.innerHTML = "";
    
    // Add items to cart
    cart.forEach(item => {
        const cartItem = document.createElement("tr");
        cartItem.className = "cart-item";
        cartItem.setAttribute("data-id", item.id);
        
        cartItem.innerHTML = `
            <td class="cart-item-cell">
                <div class="item-details">
                    <div class="item-image">
                        <img src="${item.image}" alt="${item.name}">
                    </div>
                    <div class="item-info">
                        <div class="item-name">${item.name}</div>
                        <div class="item-variant">Weight: ${item.weight}</div>
                    </div>
                </div>
            </td>
            <td class="cart-item-cell">
                <div class="quantity-control">
                    <button class="quantity-btn minus-btn" data-id="${item.id}"><i class="fas fa-minus"></i></button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-btn plus-btn" data-id="${item.id}"><i class="fas fa-plus"></i></button>
                </div>
            </td>
            <td class="cart-item-cell">
                <div class="item-price">KSh ${window.utils.formatNumber(item.price * item.quantity)}</div>
            </td>
            <td class="cart-item-cell item-remove-cell">
                <button class="item-remove" data-id="${item.id}"><i class="fas fa-trash-alt"></i></button>
            </td>
        `;
        
        cartItemsList.appendChild(cartItem);
    });
    
    // Add event listeners to cart items
    initCartItemEvents();
}

// Initialize cart item events
function initCartItemEvents() {
    const minusBtns = document.querySelectorAll(".minus-btn");
    const plusBtns = document.querySelectorAll(".plus-btn");
    const removeBtns = document.querySelectorAll(".item-remove");
    const updateCartBtn = document.getElementById("update-cart");
    
    // Minus buttons
    minusBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            updateItemQuantity(id, -1);
        });
    });
    
    // Plus buttons
    plusBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            updateItemQuantity(id, 1);
        });
    });
    
    // Remove buttons
    removeBtns.forEach(btn => {
        btn.addEventListener("click", function() {
            const id = this.getAttribute("data-id");
            removeItemFromCart(id);
        });
    });
    
    // Update cart button
    if (updateCartBtn) {
        updateCartBtn.addEventListener("click", function() {
            window.utils.showNotification("Cart updated successfully", "success");
        });
    }
}

// Update item quantity
function updateItemQuantity(id, change) {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Find item in cart
    const itemIndex = cart.findIndex(item => item.id.toString() === id.toString());
    
    if (itemIndex !== -1) {
        // Update quantity
        cart[itemIndex].quantity += change;
        
        // Remove item if quantity is 0 or less
        if (cart[itemIndex].quantity <= 0) {
            cart.splice(itemIndex, 1);
        }
        
        // Save cart to localStorage
        localStorage.setItem("cart", JSON.stringify(cart));
        
        // Update cart count
        updateCartCount(cart.reduce((total, item) => total + item.quantity, 0));
        
        // Update cart items
        updateCartItems(cart);
        
        // Update order summary
        updateOrderSummary(cart);
        
        // Toggle empty cart state
        toggleEmptyCartState(cart);
    }
}

// Remove item from cart
function removeItemFromCart(id) {
    // Get cart from localStorage
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    // Remove item from cart
    cart = cart.filter(item => item.id.toString() !== id.toString());
    
    // Save cart to localStorage
    localStorage.setItem("cart", JSON.stringify(cart));
    
    // Update cart count
    updateCartCount(cart.reduce((total, item) => total + item.quantity, 0));
    
    // Update cart items
    updateCartItems(cart);
    
    // Update order summary
    updateOrderSummary(cart);
    
    // Toggle empty cart state
    toggleEmptyCartState(cart);
    
    // Show notification
    window.utils.showNotification("Item removed from cart", "info");
}

// Update order summary
function updateOrderSummary(cart) {
    const subtotalElement = document.getElementById("summary-subtotal");
    const discountElement = document.getElementById("summary-discount");
    const discountPercentage = document.getElementById("discount-percentage");
    const deliveryElement = document.getElementById("summary-delivery");
    const totalElement = document.getElementById("summary-total");
    const buyNowMainBtn = document.getElementById("buy-now-main");
    
    // Calculate subtotal
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    
    // Calculate discount (10%)
    const discount = Math.round(subtotal * 0.1);
    
    // Calculate total
    const deliveryFee = subtotal > 0 ? 150 : 0;
    const total = subtotal - discount + deliveryFee;
    
    // Update elements
    if (subtotalElement) subtotalElement.textContent = `KSh ${window.utils.formatNumber(subtotal)}`;
    if (discountElement) discountElement.textContent = `- KSh ${window.utils.formatNumber(discount)}`;
    if (discountPercentage) discountPercentage.textContent = "10";
    if (deliveryElement) deliveryElement.textContent = `KSh ${window.utils.formatNumber(deliveryFee)}`;
    if (totalElement) totalElement.textContent = `KSh ${window.utils.formatNumber(total)}`;
    
    // Update Buy Now button
    if (buyNowMainBtn) {
        if (subtotal > 0) {
            buyNowMainBtn.innerHTML = `<i class="fas fa-credit-card"></i> BUY NOW • KSh ${window.utils.formatNumber(total)}`;
        } else {
            buyNowMainBtn.innerHTML = `<i class="fas fa-credit-card"></i> Mpesa`;
        }
    }
}

// Toggle empty cart state
function toggleEmptyCartState(cart) {
    const cartHasItems = document.getElementById("cart-has-items");
    const cartEmpty = document.getElementById("cart-empty");
    
    if (!cartHasItems || !cartEmpty) return;
    
    if (cart.length > 0) {
        cartHasItems.style.display = "block";
        cartEmpty.style.display = "none";
    } else {
        cartHasItems.style.display = "none";
        cartEmpty.style.display = "block";
    }
}

// Initialize cart overlay
function initCartOverlay() {
    const cartIcons = document.querySelectorAll("#cart-icon-top, #mini-cart");
    const cartOverlay = document.getElementById("cart-overlay");
    const cartClose = document.getElementById("cart-close");
    const continueShopping = document.getElementById("continue-shopping");
    const cartTabs = document.querySelectorAll(".cart-tab");
    const cartItemsContainer = document.getElementById("cart-items-container");
    const orderSummary = document.querySelector(".order-summary");
    const buyNowBtn = document.getElementById("buy-now-btn");
    const buyNowMainBtn = document.getElementById("buy-now-main");
    const checkoutBtn = document.getElementById("checkout-btn");
    
    // Open cart overlay
    if (cartIcons.length > 0 && cartOverlay) {
        cartIcons.forEach(icon => {
            icon.addEventListener("click", () => {
                cartOverlay.classList.add("active");
                document.body.style.overflow = "hidden";
            });
        });
    }
    
    // Close cart overlay
    if (cartClose && cartOverlay) {
        cartClose.addEventListener("click", () => {
            cartOverlay.classList.remove("active");
            document.body.style.overflow = "";
        });
    }
    
    // Continue shopping button
    if (continueShopping && cartOverlay) {
        continueShopping.addEventListener("click", () => {
            cartOverlay.classList.remove("active");
            document.body.style.overflow = "";
        });
    }
    
    // Cart tabs (for mobile)
    if (cartTabs.length > 0) {
        cartTabs.forEach(tab => {
            tab.addEventListener("click", function() {
                // Remove active class from all tabs
                cartTabs.forEach(t => t.classList.remove("active"));
                
                // Add active class to clicked tab
                this.classList.add("active");
                
                // Get target tab
                const targetTab = this.getAttribute("data-tab");
                
                // Show/hide content based on selected tab
                if (window.innerWidth <= 767) {
                    if (cartItemsContainer) cartItemsContainer.style.display = "none";
                    if (orderSummary) orderSummary.style.display = "none";
                    
                    if (targetTab === "cart-items-container" && cartItemsContainer) {
                        cartItemsContainer.style.display = "block";
                    } else if (targetTab === "order-summary" && orderSummary) {
                        orderSummary.style.display = "block";
                    }
                }
            });
        });
    }
    
    // Buy Now and Checkout buttons
    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", processOrder);
    }
    
    if (buyNowMainBtn) {
        buyNowMainBtn.addEventListener("click", processOrder);
    }
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", processOrder);
    }
    
    // Apply promo code
    const promoCodeInput = document.getElementById("promo-code");
    const applyPromoBtn = document.getElementById("apply-promo");
    
    if (promoCodeInput && applyPromoBtn) {
        applyPromoBtn.addEventListener("click", function() {
            const promoCode = promoCodeInput.value.trim();
            
            if (!promoCode) {
                window.utils.showNotification("Please enter a promo code", "warning");
                return;
            }
            
            // Simulate promo code application
            if (promoCode.toUpperCase() === "KIKWETU20") {
                // Update discount percentage
                const discountPercentage = document.getElementById("discount-percentage");
                if (discountPercentage) discountPercentage.textContent = "20";
                
                // Update order summary with new discount
                const cart = JSON.parse(localStorage.getItem("cart")) || [];
                const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
                const discount = Math.round(subtotal * 0.2);
                
                const discountElement = document.getElementById("summary-discount");
                if (discountElement) discountElement.textContent = `- KSh ${window.utils.formatNumber(discount)}`;
                
                const deliveryFee = subtotal > 0 ? 150 : 0;
                const total = subtotal - discount + deliveryFee;
                
                const totalElement = document.getElementById("summary-total");
                if (totalElement) totalElement.textContent = `KSh ${window.utils.formatNumber(total)}`;
                
                // Update Buy Now button
                if (buyNowMainBtn && subtotal > 0) {
                    buyNowMainBtn.innerHTML = `<i class="fas fa-credit-card"></i> BUY NOW • KSh ${window.utils.formatNumber(total)}`;
                }
                
                window.utils.showNotification("Promo code applied: 20% discount", "success");
            } else {
                window.utils.showNotification("Invalid promo code", "error");
            }
        });
    }
}

// Process order
function processOrder() {
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cart.length === 0) {
        window.utils.showNotification("Your cart is empty", "warning");
        return;
    }
    
    // Simulate order processing
    const orderBtn = this;
    const originalText = orderBtn.innerHTML;
    
    orderBtn.disabled = true;
    orderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    
    setTimeout(() => {
        // Clear cart
        localStorage.setItem("cart", JSON.stringify([]));
        
        // Update cart UI
        updateCartCount(0);
        updateCartItems([]);
        updateOrderSummary([]);
        toggleEmptyCartState([]);
        
        // Reset button
        orderBtn.disabled = false;
        orderBtn.innerHTML = originalText;
        
        // Show success message
        window.utils.showNotification("Order placed successfully! Thank you for your purchase.", "success");
        
        // Close cart overlay
        const cartOverlay = document.getElementById("cart-overlay");
        if (cartOverlay) {
            cartOverlay.classList.remove("active");
            document.body.style.overflow = "";
        }
    }, 2000);
}
/**
 * M-Pesa STK Push Integration
 * Add this code to your cafe.js file
 */

// Initialize M-Pesa button
function initMpesaButton() {
    // Connect checkout buttons to the STK push modal
    const checkoutBtn = document.getElementById("checkout-btn");
    const buyNowBtn = document.getElementById("buy-now-btn");
    const buyNowMainBtn = document.getElementById("buy-now-main");
    
    if (checkoutBtn) {
        checkoutBtn.addEventListener("click", showStkPushModal);
    }
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener("click", showStkPushModal);
    }
    
    if (buyNowMainBtn) {
        buyNowMainBtn.addEventListener("click", showStkPushModal);
    }
    
    // Create and append the STK Push modal to the body
    createStkPushModal();
    
    // Add event listeners for the modal
    initStkPushModalEvents();
}

// Create STK Push Modal
function createStkPushModal() {
    // Create modal container
    const stkModal = document.createElement('div');
    stkModal.id = 'stk-push-modal';
    stkModal.className = 'stk-modal';
    
    // Add modal HTML content
    stkModal.innerHTML = `
        <div class="stk-modal-content">
            <div class="stk-modal-header">
                <div class="stk-modal-title">
                    <div class="stk-cafe-logo" id="stk-cafe-logo">
                        <img src="/placeholder.svg" alt="Cafe Logo">
                    </div>
                    <h2>M-Pesa Payment</h2>
                </div>
                <button class="stk-modal-close" id="stk-modal-close"><i class="fas fa-times"></i></button>
            </div>
            <div class="stk-modal-body">
                <div class="stk-payment-info">
                    <div class="stk-cafe-name" id="stk-cafe-name">Loading cafe name...</div>
                    <div class="stk-amount-row">
                        <span class="stk-label">Amount:</span>
                        <span class="stk-amount" id="stk-amount">KSh 0</span>
                    </div>
                </div>
                
                <div class="stk-input-group">
                    <label for="stk-phone-number">M-Pesa Phone Number</label>
                    <div class="stk-phone-input">
                        <span class="stk-prefix">+254</span>
                        <input type="tel" id="stk-phone-number" placeholder="7XXXXXXXX" maxlength="9">
                    </div>
                    <div class="stk-phone-hint">Enter your M-Pesa registered phone number</div>
                </div>
                
                <div class="stk-payment-steps">
                    <h3>How it works:</h3>
                    <ol>
                        <li>Enter your M-Pesa phone number</li>
                        <li>Click "Pay Now" button</li>
                        <li>You'll receive a payment prompt on your phone</li>
                        <li>Enter your M-Pesa PIN to complete payment</li>
                    </ol>
                </div>
                
                <div class="stk-status" id="stk-status"></div>
                
                <button class="stk-pay-button" id="stk-pay-button">
                    <i class="fas fa-credit-card"></i> Pay Now
                </button>
                
                <div class="stk-secure-badge">
                    <i class="fas fa-lock"></i> Secure Payment via M-Pesa
                </div>
            </div>
        </div>
    `;
    
    // Add CSS styles
    const stkStyles = document.createElement('style');
    stkStyles.textContent = `
        .stk-modal {
            display: none;
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: rgba(0, 0, 0, 0.7);
            z-index: 1000;
            overflow: auto;
            opacity: 0;
            transition: opacity 0.3s ease;
        }
        
        .stk-modal.active {
            display: flex;
            justify-content: center;
            align-items: center;
            opacity: 1;
        }
        
       .stk-modal-content {
            background-color: #fff;
            border-radius: 12px;
            width: 90%;
            max-width: 480px;
            box-shadow: 0 5px 20px rgba(0, 0, 0, 0.2);
            position: relative;
            overflow: hidden;
            animation: stkModalIn 0.4s ease-out;
            }

            @media (max-width: 480px) {
            .stk-modal-content {
                width: 95%;
                margin: 10px;
            }
            
            .stk-modal-header {
                flex-direction: column;
            }
            }
                    
        @keyframes stkModalIn {
            from {
                transform: translateY(50px);
                opacity: 0;
            }
            to {
                transform: translateY(0);
                opacity: 1;
            }
        }
        
        .stk-modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            border-bottom: 1px solid #eee;
            background: linear-gradient(135deg, #d97706, #92400e);
            color: white;
        }
        
        .stk-modal-title {
            display: flex;
            align-items: center;
            gap: 15px;
        }
        
        .stk-modal-title h2 {
            margin: 0;
            font-size: 1.5rem;
            font-weight: 600;
        }
        
        .stk-cafe-logo img {
            height: 40px;
            width: auto;
            border-radius: 4px;
        }
        
        .stk-modal-close {
            background: transparent;
            border: none;
            color: white;
            font-size: 1.2rem;
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: background-color 0.2s;
        }
        
        .stk-modal-close:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }
        
        .stk-modal-body {
            padding: 20px;
        }
        
        .stk-payment-info {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .stk-cafe-name {
            font-size: 1.2rem;
            font-weight: 600;
            margin-bottom: 10px;
            color: #333;
        }
        
        .stk-amount-row {
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .stk-label {
            font-weight: 500;
            color: #555;
        }
        
        .stk-amount {
            font-size: 1.3rem;
            font-weight: 700;
            color: #d97706;
        }
        
        .stk-input-group {
            margin-bottom: 20px;
        }
        
        .stk-input-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #333;
        }
        
        .stk-phone-input {
            display: flex;
            border: 1px solid #ddd;
            border-radius: 6px;
            overflow: hidden;
        }
        
        .stk-prefix {
            background-color: #f1f1f1;
            padding: 12px 10px;
            color: #333;
            font-weight: 500;
            border-right: 1px solid #ddd;
        }
        
        .stk-phone-input input {
            flex: 1;
            padding: 12px;
            border: none;
            outline: none;
            font-size: 1rem;
        }
        
        .stk-phone-hint {
            font-size: 0.8rem;
            color: #666;
            margin-top: 5px;
        }
        
        .stk-payment-steps {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            margin-bottom: 20px;
        }
        
        .stk-payment-steps h3 {
            margin-top: 0;
            margin-bottom: 10px;
            font-size: 1rem;
            color: #333;
        }
        
        .stk-payment-steps ol {
            margin: 0;
            padding-left: 20px;
        }
        
        .stk-payment-steps li {
            margin-bottom: 5px;
            color: #555;
        }
        
        .stk-status {
            min-height: 24px;
            margin-bottom: 15px;
            text-align: center;
            font-weight: 500;
        }
        
        .stk-status.success {
            color: #10b981;
        }
        
        .stk-status.error {
            color: #ef4444;
        }
        
        .stk-status.loading {
            color: #d97706;
        }
        
        .stk-pay-button {
            width: 100%;
            padding: 14px;
            background: linear-gradient(135deg, #d97706, #92400e);
            color: white;
            border: none;
            border-radius: 6px;
            font-size: 1.1rem;
            font-weight: 600;
            cursor: pointer;
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 10px;
            transition: all 0.2s;
        }
        
        .stk-pay-button:hover {
            background: linear-gradient(135deg, #b45309, #78350f);
        }
        
        .stk-pay-button:disabled {
            background: #ccc;
            cursor: not-allowed;
        }
        
        .stk-secure-badge {
            display: flex;
            justify-content: center;
            align-items: center;
            gap: 5px;
            margin-top: 15px;
            color: #666;
            font-size: 0.9rem;
        }
    `;
    
    // Append modal and styles to the document
    document.head.appendChild(stkStyles);
    document.body.appendChild(stkModal);
}

// Hide STK Push Modal
function hideStkPushModal() {
    const stkModal = document.getElementById('stk-push-modal');
    if (stkModal) {
        stkModal.classList.remove('active');
        document.body.style.overflow = '';
    }
}
// Initialize STK Push Modal Events
function initStkPushModalEvents() {
    const stkModal = document.getElementById('stk-push-modal');
    const closeBtn = document.getElementById('stk-modal-close');
    const payBtn = document.getElementById('stk-pay-button');
    const phoneInput = document.getElementById('stk-phone-number');
    
    // Close modal when clicking the close button
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            hideStkPushModal();
        });
    }
    
    // Close modal when clicking outside the modal content
    if (stkModal) {
        stkModal.addEventListener('click', (e) => {
            if (e.target === stkModal) {
                hideStkPushModal();
            }
        });
    }
    
    // Handle pay button click
    if (payBtn) {
        payBtn.addEventListener('click', async () => {
            payBtn.disabled = false;
             await handleMpesaRequest();
        });
    };
    
    // Format phone number input
    if (phoneInput) {
        phoneInput.addEventListener('input', (e) => {
            // Remove non-numeric characters
            e.target.value = e.target.value.replace(/\D/g, '');
            
            // Limit to 9 digits (without the +254 prefix)
            if (e.target.value.length > 9) {
                e.target.value = e.target.value.slice(0, 9);
            }
        });
    }
}

// Update your showStkPushModal function in cafe.js:

function showStkPushModal() {
    const stkModal = document.getElementById('stk-push-modal');
    const stkCafeLogo = document.getElementById('stk-cafe-logo').querySelector('img');
    const stkCafeName = document.getElementById('stk-cafe-name');
    const stkAmount = document.getElementById('stk-amount');
    const stkStatus = document.getElementById('stk-status');
    
    if (!stkModal) return;
    
    // Get cart and cafe details
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
    
    if (cart.length === 0) {
        window.utils.showNotification("Your cart is empty", "warning");
        return;
    }
    
    // Calculate total amount
    const subtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    const discount = Math.round(subtotal * 0.1);
    const deliveryFee = 150;
    const total = subtotal - discount + deliveryFee;
    
    // Get cafe details from cart title
    const cafeName = document.getElementById('copyright-cafe-name').textContent;
    const cafeLogo = document.getElementById('cart-cafe-logo').querySelector('img').src;
    
    // Update modal with cafe details
    if (stkCafeLogo) stkCafeLogo.src = cafeLogo;
    if (stkCafeName) stkCafeName.textContent = cafeName;
    
    // Format the amount with the window.utils.formatNumber function
    if (stkAmount) {
        // Check if window.utils.formatNumber exists
        if (window.utils && typeof window.utils.formatNumber === 'function') {
            stkAmount.textContent = `KSh ${window.utils.formatNumber(total)}`;
        } else {
            // Fallback to basic formatting
            stkAmount.textContent = `KSh ${total.toLocaleString()}`;
        }
        
        // Store the amount in a data attribute for later use
        stkAmount.dataset.amount = total;
    }
    
    if (stkStatus) stkStatus.textContent = '';
    
    // Show modal
    stkModal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Focus on phone input
    setTimeout(() => {
        document.getElementById('stk-phone-number').focus();
    }, 300);
}

// Update your processMpesaPayment function to use the stored amount:
async function handleMpesaRequest() {
    console.log('handling mpessa request');
    const payBtn = document.getElementById('stk-pay-button');
    const stkAmount = document.getElementById('stk-amount');
    const phoneNumber = "254723132475";
    const stkPhoneNumber = document.getElementById('stk-phone-number').value;
    const { reference, description } = { reference: 'test', description: 'test' };
    const amount = stkAmount.dataset.amount; 
    const formattedPhoneNumber = `+2547${stkPhoneNumber}`;

    
    

    
    
    try {
      // Get credentials from environment variables
      const consumerKey = "YOUR_CONSUMER_KEY";
      const consumerSecret = "YOUR_CONSUMER_SECRET";
      const shortcode = "YOUR_SHORTCODE";
      const passkey = "YOUR_PASSKEY";
      
      // Validate required credentials
     /* if (!consumerKey || !consumerSecret || !passkey) {
        console.error("Missing M-Pesa API credentials in environment variables:", {
          consumerKey: !!consumerKey,
          consumerSecret: !!consumerSecret,
          passkey: !!passkey
        });       
        return res.status(500).json({ 
          success: false, 
          message: "❌ Server configuration error: Missing M-Pesa API credentials" 
        });
      }*/
      
      // Generate timestamp and password
      const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0, 14);
      const password = btoa(`${shortcode}${passkey}${timestamp}`);
      
      const auth = btoa(`${consumerKey}:${consumerSecret}`);
      console.log("Base64 Auth Token generated");
      
      let tokenResponse;
      try {
        tokenResponse = await axios.get(
          "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials", 
          { 
            headers: { Authorization: `Basic ${auth}` },
            timeout: 10000 // 10 seconds timeout
          }
        );

      } catch (tokenError) {
        console.error("❌ M-Pesa Token Error:", tokenError.response?.data || tokenError.message);
        console.error("Error:", error);
        window.utils.showNotification("Payment failed. Please try again.", "error");
        return;
      }
      const accessToken = tokenResponse.data.access_token;
  
      // Use the actual URL of your server for the callback
      const callbackUrl = "https://fast-turkey-8.loca.lt/callback";
      
      // Add more detailed error handling for the STK push request
      let stkResponse;
      try {
        stkResponse = await axios.post(
          "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest",
          {
            BusinessShortCode: shortcode,
            Password: password,
            Timestamp: timestamp,
            TransactionType: "CustomerPayBillOnline",
            Amount: amount,
            PartyA: formattedPhoneNumber,
            PartyB: shortcode,
            PhoneNumber: formattedPhoneNumber,
            CallBackURL: callbackUrl,
             AccountReference: reference,
            TransactionDesc: description
          },
          { 
            headers: { 
              Authorization: `Bearer ${accessToken}`, 
              "Content-Type": "application/json" 
            },
            timeout: 10000
          }
        );
      } catch (stkError) {
        console.error("❌ M-Pesa STK Push Error:", stkError.response?.data || stkError.message);
        console.error("Error:", error);
        window.utils.showNotification("Payment failed. Please try again.", "error");
        return;
      }
  
      // Store the request details for later status checking

        console.log("M-Pesa request sent! Check your phone.")
      
      /*res.status(200).json({ 
        success: true, 
        message: "📲 M-Pesa request sent! Check your phone.",
        requestId: stkResponse.data.CheckoutRequestID || 'unknown'
      });*/
      console.log("M-Pesa request sent! Check your phone.")
        payBtn.disabled = true;
        payBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Failed';
      console.error("❌ M-Pesa Error:", error.response?.data || error.message);
        window.utils.showNotification(`❌ Payment request failed.error: ${error.message} `, "error");
    
    }finally {
        setTimeout(() => {
            payBtn.disabled = false;
            payBtn.innerHTML = '<i class="fas fa-credit-card"></i> Pay Now';
        }, 3000);
    };

// Add the payment status polling function if you haven't already:
function startPaymentStatusPolling(reference, statusEl) {
    const API_URL = "https://fast-turkey-8.loca.lt";
    let attempts = 0;
    const maxAttempts = 10;
    const pollInterval = 3000; // 3 seconds
    
    // Update UI
    statusEl.innerHTML = 'Waiting for payment confirmation... <i class="fas fa-spinner fa-spin"></i>';
    
    const pollTimer = setInterval(async () => {
        attempts++;
        console.log(`Polling payment status (attempt ${attempts}/${maxAttempts})...`);
        
        try {
            // Pass the attempt count to help with test mode
            const response = await fetch(`${API_URL}/payment-status?reference=${reference}&count=${attempts}`);
            
            if (!response.ok) {
                throw new Error(`Status check failed: ${response.status}`);
            }
            
            const result = await response.json();
            console.log("Payment status:", result);
            
            if (result.status === 'completed') {
                clearInterval(pollTimer);
                statusEl.textContent = 'Payment successful! Processing your order...';
                statusEl.className = 'stk-status success';
                processSuccessfulOrder();
            } else if (result.status === 'failed') {
                clearInterval(pollTimer);
                statusEl.textContent = 'Payment failed. Please try again.';
                statusEl.className = 'stk-status error';
            } else {
                // Still pending, update the UI to show which attempt we're on
                statusEl.innerHTML = `Waiting for payment confirmation... (${attempts}/${maxAttempts}) <i class="fas fa-spinner fa-spin"></i>`;
            }
            
        } catch (error) {
            console.error("Error checking payment status:", error);
            if (error.response?.status === 404) {
              console.log("Server might have restarted - reinitializing connection");
              testServerConnection();
            }
          }
        
        // Stop polling after max attempts
        if (attempts >= maxAttempts) {
            clearInterval(pollTimer);
            
            // We don't know if the payment succeeded or failed, so show an appropriate message
            statusEl.textContent = 'Payment status unknown. If you completed the payment on your phone, your order will be processed.';
            statusEl.className = 'stk-status';
            
            // Add a manual check button
            const checkButton = document.createElement('button');
            checkButton.textContent = 'Check Payment Status';
            checkButton.className = 'stk-pay-button';
            checkButton.style.marginTop = '10px';
            checkButton.addEventListener('click', () => {
                // Reset and start polling again
                attempts = 0;
                startPaymentStatusPolling(reference, statusEl);
            });
            
            // Add the button after the status element
            statusEl.parentNode.insertBefore(checkButton, statusEl.nextSibling);
        }
    }, pollInterval);
}
  // Add this function to your client-side code and call it when needed

function testServerConnection() {
    console.log("Testing server connection...");
    
    // Test both GET and POST methods
    Promise.all([
      // Test GET request
      fetch("https://fast-turkey-8.loca.lt/", {
        method: 'GET'
      }).then(response => {
        if (!response.ok) throw new Error(`GET request failed: ${response.status}`);
        return response.text();
      }).then(text => {
        console.log("GET request successful:", text);
        return true;
      }).catch(error => {
        console.error("GET request failed:", error);
        return false;
      }),
      
      // Test POST request
      fetch("https://fast-turkey-8.loca.lt/callback", {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ test: true })
      }).then(response => {
        if (!response.ok) throw new Error(`POST request failed: ${response.status}`);
        return response.json();
      }).then(data => {
        console.log("POST request successful:", data);
        return true;
      }).catch(error => {
        console.error("POST request failed:", error);
        return false;
      })
    ])
    .then(results => {
      const [getSuccess, postSuccess] = results;
      
      if (getSuccess && postSuccess) {
        window.utils.showNotification("Server connection successful for both GET and POST!", "success");
      } else if (getSuccess) {
        window.utils.showNotification("GET requests work, but POST requests fail.", "warning");
      } else if (postSuccess) {
        window.utils.showNotification("POST requests work, but GET requests fail.", "warning");
      } else {
        window.utils.showNotification("Server connection failed for both GET and POST.", "error");
      }
    });
  }
  
  // Add a test button to your page
  function addTestButton() {
    const testButton = document.createElement('button');
    testButton.textContent = 'Test Server Connection';
    testButton.style.padding = '10px';
    testButton.style.margin = '10px';
    testButton.style.backgroundColor = '#3b82f6';
    testButton.style.color = 'white';
    testButton.style.border = 'none';
    testButton.style.borderRadius = '4px';
    testButton.style.cursor = 'pointer';
    
    testButton.addEventListener('click', testServerConnection);
    
    // Add to the beginning of the body
    document.body.insertBefore(testButton, document.body.firstChild);
  }
  
  // Call this when the page loads
  document.addEventListener('DOMContentLoaded', () => {
    // Add this line to your existing DOMContentLoaded event handler
    addTestButton();
  });
// Process Successful Order
function processSuccessfulOrder() {
    // Clear cart
    localStorage.setItem("cart", JSON.stringify([]));
    
    // Define the functions before using them
    function updateCartCount(count) {
        // Implementation for updating cart count
        console.log("Updating cart count to:", count);
        // You might want to update the DOM element that displays the cart count here
    }

    function updateCartItems(items) {
        // Implementation for updating cart items
        console.log("Updating cart items:", items);
        // You might want to update the DOM element that displays the cart items here
    }

    function updateOrderSummary(summary) {
        // Implementation for updating order summary
        console.log("Updating order summary:", summary);
        // You might want to update the DOM element that displays the order summary here
    }

    function toggleEmptyCartState(items) {
        // Implementation for toggling empty cart state
        console.log("Toggling empty cart state:", items);
        // You might want to show/hide a message or element based on whether the cart is empty
    }
    
    // Update cart UI
    updateCartCount(0);
    updateCartItems([]);
    updateOrderSummary([]);
    toggleEmptyCartState([]);
    
    // Show success message
    window.utils.showNotification("Payment successful! Your order has been placed.", "success");
    
    // Close modals after a delay
    setTimeout(() => {
        hideStkPushModal();
        
        const cartOverlay = document.getElementById("cart-overlay");
        if (cartOverlay) {
            cartOverlay.classList.remove("active");
            document.body.style.overflow = "";
        }
        
        // Redirect to confirmation page or show confirmation message
        // window.location.href = "order-confirmation.html"; // Uncomment if you have a confirmation page
    }, 2000);
}}
