/**
 * Data for Kikwetu Cafe Listing
 */

// Cafe data
const cafesData = {
    cafes: [
        {
            id: 1,
            name: "Mama Njeri's Kitchen",
            image: "https://i.imgur.com/Xh4enez.jpg",
            rating: 4.8,
            reviews: 230,
            location: "Nairobi, Kenya",
            tags: ["Traditional", "Kenyan", "Local"],
            description: "Authentic Kenyan cuisine with traditional cooking methods",
            featured: true,
            hours: "8AM - 10PM",
            priceRange: "$$",
            phone: "+254 712 345 678",
            address: "36 Kimathi Street, Nairobi, Kenya",
            logo: "https://via.placeholder.com/120x60/333/d97706?text=MAMA+NJERI",
            featuredItem: {
                name: "Nyama Choma Platter",
                price: 850
            }
        },
        {
            id: 2,
            name: "Kibanda Ya Wazee",
            image: "https://i.imgur.com/ImheRee.jpg",
            rating: 4.6,
            reviews: 185,
            location: "Mombasa, Kenya",
            tags: ["Seafood", "Local", "Coastal"],
            description: "Fresh seafood prepared in traditional coastal style",
            featured: false,
            hours: "9AM - 9PM",
            priceRange: "$$",
            phone: "+254 722 456 789",
            address: "12 Beach Road, Mombasa, Kenya",
            logo: "https://via.placeholder.com/120x60/333/d97706?text=KIBANDA+YA+WAZEE",
            featuredItem: {
                name: "Grilled Fish Platter",
                price: 950
            }
        },
        {
            id: 3,
            name: "Urban Bites Cafe",
            image: "https://i.imgur.com/dN3ViKG.jpg",
            rating: 4.5,
            reviews: 120,
            location: "Nairobi, Kenya",
            tags: ["Modern", "Fusion", "Cafe"],
            description: "Modern cafe with a fusion of local and international flavors",
            featured: false,
            hours: "7AM - 8PM",
            priceRange: "$$$",
            phone: "+254 733 567 890",
            address: "45 Westlands Road, Nairobi, Kenya",
            logo: "https://via.placeholder.com/120x60/333/d97706?text=URBAN+BITES",
            featuredItem: {
                name: "Fusion Breakfast",
                price: 750
            }
        },
        {
            id: 4,
            name: "Nyama Choma Palace",
            image: "https://i.imgur.com/Vj7y2nt.jpg",
            rating: 4.9,
            reviews: 310,
            location: "Nakuru, Kenya",
            tags: ["BBQ", "Meat", "Traditional"],
            description: "The best grilled meat in town with authentic flavors",
            featured: false,
            hours: "11AM - 11PM",
            priceRange: "$$",
            phone: "+254 744 678 901",
            address: "78 Lake Road, Nakuru, Kenya",
            logo: "https://via.placeholder.com/120x60/333/d97706?text=NYAMA+CHOMA",
            featuredItem: {
                name: "Mixed Grill Platter",
                price: 1200
            }
        },
        {
            id: 5,
            name: "Chapati Corner",
            image: "https://i.imgur.com/Tj0Vg39.jpg",
            rating: 4.3,
            reviews: 95,
            location: "Eldoret, Kenya",
            tags: ["Fast Food", "Local", "Budget"],
            description: "Quick and delicious local fast food options",
            featured: false,
            hours: "6AM - 9PM",
            priceRange: "$",
            phone: "+254 755 789 012",
            address: "23 Market Street, Eldoret, Kenya",
            logo: "https://via.placeholder.com/120x60/333/d97706?text=CHAPATI+CORNER",
            featuredItem: {
                name: "Chapati Combo",
                price: 350
            }
        },
        {
            id: 6,
            name: "Mandazi & Chai",
            image: "https://i.imgur.com/kVeRtfr.jpg",
            rating: 4.4,
            reviews: 150,
            location: "Kisumu, Kenya",
            tags: ["Breakfast", "Cafe", "Traditional"],
            description: "Traditional breakfast spot with the best mandazi in town",
            featured: false,
            hours: "5AM - 2PM",
            priceRange: "$",
            phone: "+254 766 890 123",
            address: "56 Lake View Road, Kisumu, Kenya",
            logo: "https://via.placeholder.com/120x60/333/d97706?text=MANDAZI+CHAI",
            featuredItem: {
                name: "Breakfast Special",
                price: 250
            }
        },
        {
            id: 7,
            name: "Samaki Fresh",
            image: "https://i.imgur.com/ImheRee.jpg",
            rating: 4.7,
            reviews: 210,
            location: "Kisumu, Kenya",
            tags: ["Seafood", "Fresh", "Local"],
            description: "Fresh fish from Lake Victoria prepared to perfection",
            featured: false,
            hours: "10AM - 10PM",
            priceRange: "$$",
            phone: "+254 777 901 234",
            address: "89 Fish Market Road, Kisumu, Kenya",
            logo: "https://via.placeholder.com/120x60/333/d97706?text=SAMAKI+FRESH",
            featuredItem: {
                name: "Lake Fish Platter",
                price: 800
            }
        },
        {
            id: 8,
            name: "Kikwetu Delights",
            image: "https://i.imgur.com/Xh4enez.jpg",
            rating: 4.5,
            reviews: 180,
            location: "Nairobi, Kenya",
            tags: ["Modern", "Fusion", "Upscale"],
            description: "Modern take on traditional Kenyan cuisine",
            featured: false,
            hours: "11AM - 10PM",
            priceRange: "$$$",
            phone: "+254 788 012 345",
            address: "102 Uptown Plaza, Nairobi, Kenya",
            logo: "https://via.placeholder.com/120x60/333/d97706?text=KIKWETU+DELIGHTS",
            featuredItem: {
                name: "Signature Platter",
                price: 1500
            }
        },
        {
            id: 9,
            name: "Ugali House",
            image: "https://i.imgur.com/Vj7y2nt.jpg",
            rating: 4.6,
            reviews: 200,
            location: "Nakuru, Kenya",
            tags: ["Traditional", "Local", "Comfort Food"],
            description: "Comfort food with the best ugali in town",
            featured: false,
            hours: "10AM - 9PM",
            priceRange: "$$",
            phone: "+254 799 123 456",
            address: "67 Central Avenue, Nakuru, Kenya",
            logo: "https://via.placeholder.com/120x60/333/d97706?text=UGALI+HOUSE",
            featuredItem: {
                name: "Ugali Special",
                price: 450
            }
        },
        {
            id: 10,
            name: "UTA ",
            image: "https://i.imgur.com/Vj7y2nt.jpg",
            rating: 4.6,
            reviews: 200,
            location: "Nakuru, Kenya",
            tags: ["Traditional", "Local", "Comfort Food"],
            description: "Comfort food with the best ugali in town",
            featured: false,
            hours: "10AM - 9PM",
            priceRange: "$$",
            phone: "+254 799 123 456",
            address: "67 Central Avenue, Nakuru, Kenya",
            logo: "https://via.placeholder.com/120x60/333/d97706?text=UGALI+HOUSE",
            featuredItem: {
                name: "Ugali Special",
                price: 450
            }
        },
        
    ]
};

// Menu data
const menuData = {
    items: [
        {
            id: 1,
            name: "Ugali with Tilapia",
            price: 600,
            weight: "350g",
            image: "https://i.imgur.com/ImheRee.jpg",
            badge: "Popular",
            rating: 4.8,
            category: "daily",
            description: "Authentic Kenyan dish with fresh tilapia fish and perfectly cooked ugali. Served with traditional vegetables.",
            allergens: "Fish",
            prepTime: "20-25 minutes"
        },
        {
            id: 2,
            name: "Pilau with Kachumbari",
            price: 450,
            weight: "300g",
            image: "https://i.imgur.com/dN3ViKG.jpg",
            badge: "",
            rating: 4.6,
            category: "daily",
            description: "Aromatic rice cooked with a blend of spices, served with fresh kachumbari salad.",
            allergens: "None",
            prepTime: "15-20 minutes"
        },
        {
            id: 3,
            name: "Chapati with Beans",
            price: 350,
            weight: "250g",
            image: "https://i.imgur.com/Tj0Vg39.jpg",
            badge: "Vegetarian",
            rating: 4.5,
            category: "daily",
            description: "Freshly made chapati served with delicious bean stew cooked with traditional spices.",
            allergens: "Gluten",
            prepTime: "15 minutes"
        },
        {
            id: 4,
            name: "Nyama Choma Platter",
            price: 850,
            weight: "500g",
            image: "https://i.imgur.com/Vj7y2nt.jpg",
            badge: "Best Seller",
            rating: 4.9,
            category: "daily",
            description: "Perfectly grilled meat platter with a selection of beef, goat, and chicken. Served with ugali and kachumbari.",
            allergens: "None",
            prepTime: "30 minutes"
        },
        {
            id: 5,
            name: "Mukimo with Beef Stew",
            price: 400,
            weight: "350g",
            image: "https://i.imgur.com/Xh4enez.jpg",
            badge: "",
            rating: 4.7,
            category: "daily",
            description: "Traditional mashed potato dish with peas, corn, and greens, served with rich beef stew.",
            allergens: "None",
            prepTime: "20 minutes"
        },
        {
            id: 6,
            name: "Mandazi with Chai",
            price: 150,
            weight: "200g",
            image: "https://i.imgur.com/kVeRtfr.jpg",
            badge: "Quick Bite",
            rating: 4.4,
            category: "pastry",
            description: "Sweet fried bread served with traditional Kenyan chai tea.",
            allergens: "Gluten, Dairy",
            prepTime: "10 minutes"
        },
        {
            id: 7,
            name: "Beef Samosas",
            price: 200,
            weight: "180g",
            image: "https://i.imgur.com/ImheRee.jpg",
            badge: "",
            rating: 4.5,
            category: "pastry",
            description: "Crispy pastry triangles filled with spiced minced beef. Served with tamarind sauce.",
            allergens: "Gluten",
            prepTime: "15 minutes"
        },
        {
            id: 8,
            name: "Githeri Special",
            price: 300,
            weight: "400g",
            image: "https://i.imgur.com/Vj7y2nt.jpg",
            badge: "Staff Pick",
            rating: 4.6,
            category: "daily",
            description: "Traditional mix of beans and corn, slow-cooked with herbs and spices.",
            allergens: "None",
            prepTime: "25 minutes"
        },
        {
            id: 9,
            name: "Matoke with Beef",
            price: 550,
            weight: "380g",
            image: "https://i.imgur.com/dN3ViKG.jpg",
            badge: "New",
            rating: 4.7,
            category: "daily",
            description: "Plantain stew cooked with tender beef chunks in a rich tomato sauce.",
            allergens: "None",
            prepTime: "25-30 minutes"
        },
        {
            id: 10,
            name: "Irio with Grilled Chicken",
            price: 480,
            weight: "320g",
            image: "https://i.imgur.com/Tj0Vg39.jpg",
            badge: "",
            rating: 4.5,
            category: "daily",
            description: "Mashed potatoes with peas and corn, served with perfectly grilled chicken.",
            allergens: "None",
            prepTime: "20 minutes"
        },
        {
            id: 11,
            name: "Mahamri",
            price: 120,
            weight: "150g",
            image: "https://i.imgur.com/kVeRtfr.jpg",
            badge: "Breakfast",
            rating: 4.3,
            category: "pastry",
            description: "Cardamom-spiced fried bread, perfect for breakfast or as a snack.",
            allergens: "Gluten",
            prepTime: "15 minutes"
        },
        {
            id: 12,
            name: "Chai Masala",
            price: 280,
            weight: "300g",
            image: "https://i.imgur.com/ImheRee.jpg",
            badge: "Vegetarian",
            rating: 4.4,
            category: "daily",
            description: "Sautéed collard greens with onions and spices, served with ugali.",
            allergens: "None",
            prepTime: "15 minutes"
        },
    ]
};

// Categories data
const categoriesData = {
    categories: [
        {
            id: 1,
            name: "Traditional",
            icon: "utensils",
            count: 15
        },
        {
            id: 2,
            name: "Cafes",
            icon: "coffee",
            count: 23
        },
        {
            id: 3,
            name: "Fast Food",
            icon: "hamburger",
            count: 12
        },
        {
            id: 4,
            name: "Seafood",
            icon: "fish",
            count: 8
        }
    ]
};

// Make data available globally
window.appData = {
    cafes: cafesData.cafes,
    menu: menuData.items,
    categories: categoriesData.categories
};