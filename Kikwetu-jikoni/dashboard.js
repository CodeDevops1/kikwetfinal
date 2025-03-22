document.addEventListener('DOMContentLoaded', () => {
    // Login and signup containers
    const loginContainer = document.getElementById('login-container');
    const dashboardContainer = document.getElementById('dashboard-container');
    
    // Login form
    const loginForm = document.getElementById('login-form');
    const roleOptions = document.querySelectorAll('.role-option');
    const togglePassword = document.getElementById('toggle-password');
    const passwordInput = document.getElementById('password');

    // Set default role
    let selectedRole = 'cafe-owner';

    // Role selection
    if (roleOptions) {
        roleOptions.forEach(option => {
            option.addEventListener('click', function() {
                roleOptions.forEach(opt => opt.classList.remove('active'));
                this.classList.add('active');
                selectedRole = this.getAttribute('data-role');
            });
        });
    }

    // Toggle password visibility for login
    if (togglePassword && passwordInput) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('fa-eye');
            this.querySelector('i').classList.toggle('fa-eye-slash');
        });
    }

    // Login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const emailError = document.getElementById('email-error');
            const passwordError = document.getElementById('password-error');
            
            // Reset errors
            if (emailError) emailError.textContent = '';
            if (passwordError) passwordError.textContent = '';
            
            // Simple validation
            let isValid = true;
            
            if (!email) {
                if (emailError) emailError.textContent = 'Email is required';
                isValid = false;
            } else if (!isValidEmail(email)) {
                if (emailError) emailError.textContent = 'Please enter a valid email';
                isValid = false;
            }
            
            if (!password) {
                if (passwordError) passwordError.textContent = 'Password is required';
                isValid = false;
            } else if (password.length < 6) {
                if (passwordError) passwordError.textContent = 'Password must be at least 6 characters';
                isValid = false;
            }
            
            if (isValid) {
                // Try to authenticate with the server
                authenticateUser(email, password, selectedRole)
                    .then(userData => {
                        // Save login state to localStorage
                        localStorage.setItem('isLoggedIn', 'true');
                        localStorage.setItem('userRole', userData.role || selectedRole);
                        localStorage.setItem('userEmail', email);
                        localStorage.setItem('userId', userData.id);
                        
                        if (userData.cafeId) {
                            localStorage.setItem('cafeId', userData.cafeId);
                        }
                        
                        // Redirect to dashboard
                        redirectToDashboard(email, userData.role || selectedRole);
                    })
                    .catch(error => {
                        showNotification(error.message || 'Authentication failed', 'error');
                    });
            }
        });
    }

    // Function to authenticate user with server
    async function authenticateUser(email, password, role) {
        try {
            // For now, simulate authentication success
            // In production, this would make an API call to your Next.js server
            return {
                id: 'user_' + Date.now(),
                email,
                role,
                cafeId: role === 'cafe-owner' ? 'cafe_' + Date.now() : null
            };
        } catch (error) {
            throw new Error('Authentication failed');
        }
    }

    // Function to redirect to dashboard
    function redirectToDashboard(email, role) {
        if (loginContainer) loginContainer.classList.add('hidden');
        if (dashboardContainer) dashboardContainer.classList.remove('hidden');
        
        // Set user info in dashboard
        const userRoleElement = document.getElementById('user-role');
        const headerUserName = document.getElementById('header-user-name');
        const userName = document.getElementById('user-name');
        
        if (userRoleElement) {
            userRoleElement.textContent = role === 'admin' ? 'Admin' : 'Cafe Owner';
        }
        
        if (headerUserName) {
            const displayName = localStorage.getItem('userName') || email.split('@')[0];
            headerUserName.textContent = displayName;
        }
        
        if (userName) {
            const displayName = localStorage.getItem('userName') || email.split('@')[0];
            userName.textContent = displayName;
        }
        
        // Show/hide admin sections based on role
        const adminSections = document.querySelectorAll('.admin-only');
        if (role === 'admin') {
            adminSections.forEach(section => {
                section.style.display = 'block';
            });
            if (document.getElementById('toggle-role')) {
                document.getElementById('toggle-role').textContent = 'Switch to Cafe Owner View';
            }
        } else {
            adminSections.forEach(section => {
                section.style.display = 'none';
            });
            if (document.getElementById('toggle-role')) {
                document.getElementById('toggle-role').textContent = 'Switch to Admin View';
            }
        }
        
        // Load cafe data if user is a cafe owner
        if (role === 'cafe-owner') {
            const cafeId = localStorage.getItem('cafeId');
            if (cafeId) {
                loadCafeData(cafeId);
            }
        }
        
        // Initialize charts after login
        initializeCharts();
        
        // Update order counts
        updateOrderCounts();
    }

    // Check if user is already logged in
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    if (isLoggedIn) {
        const savedRole = localStorage.getItem('userRole') || 'cafe-owner';
        const savedEmail = localStorage.getItem('userEmail') || 'user@example.com';
        
        // Redirect to dashboard if already logged in
        redirectToDashboard(savedEmail, savedRole);
    }

    // Email validation helper
    function isValidEmail(email) {
        const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    }

    // Navigation functionality
    const navItems = document.querySelectorAll('.nav-item');
    const contentSections = document.querySelectorAll('.content-section');

    navItems.forEach(item => {
        item.addEventListener('click', function() {
            const sectionId = this.getAttribute('data-section');
            
            // Hide all sections
            contentSections.forEach(section => {
                section.classList.remove('active');
            });
            
            // Show selected section
            const selectedSection = document.getElementById(sectionId);
            if (selectedSection) {
                selectedSection.classList.add('active');
            }
            
            // Update active nav item
            navItems.forEach(navItem => {
                navItem.classList.remove('active');
            });
            
            this.classList.add('active');
            
            // On mobile, close sidebar after navigation
            if (window.innerWidth <= 768) {
                const sidebar = document.querySelector('.sidebar');
                if (sidebar) {
                    sidebar.classList.remove('expanded');
                }
            }
        });
    });

    // Mobile menu toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    if (mobileMenuToggle) {
        mobileMenuToggle.addEventListener('click', () => {
            const sidebar = document.querySelector('.sidebar');
            if (sidebar) {
                sidebar.classList.toggle('expanded');
            }
        });
    }

    // Tab functionality
    const tabs = document.querySelectorAll('.tab');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            const tabContainer = this.closest('.tabs-container');
            if (!tabContainer) return;
            
            const tabContents = tabContainer.nextElementSibling.parentElement.querySelectorAll('.tab-content');
            
            // Update active tab
            tabContainer.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });
            
            this.classList.add('active');
            
            // Show selected tab content
            tabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            const selectedTabContent = document.getElementById(`${tabId}-orders`);
            if (selectedTabContent) {
                selectedTabContent.classList.add('active');
            }
        });
    });

    // Profile tabs functionality
    const profileTabs = document.querySelectorAll('.profile-tab');

    profileTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-tab');
            
            // Update active tab
            profileTabs.forEach(t => {
                t.classList.remove('active');
            });
            
            this.classList.add('active');
            
            // Show selected tab content
            document.querySelectorAll('.profile-tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            const selectedTabContent = document.getElementById(tabId);
            if (selectedTabContent) {
                selectedTabContent.classList.add('active');
            }
        });
    });

    // Settings tabs functionality
    const settingsTabs = document.querySelectorAll('.settings-nav-item');

    settingsTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const tabId = this.getAttribute('data-settings');
            
            // Update active tab
            settingsTabs.forEach(t => {
                t.classList.remove('active');
            });
            
            this.classList.add('active');
            
            // Show selected tab content
            document.querySelectorAll('.settings-panel').forEach(content => {
                content.classList.remove('active');
            });
            
            const selectedTabContent = document.getElementById(`${tabId}-settings`);
            if (selectedTabContent) {
                selectedTabContent.classList.add('active');
            }
        });
    });

    // Toggle between cafe owner and admin views
    const toggleRoleBtn = document.getElementById('toggle-role');
    const adminSections = document.querySelectorAll('.admin-only');
    let isAdmin = localStorage.getItem('userRole') === 'admin';

    if (toggleRoleBtn) {
        toggleRoleBtn.addEventListener('click', function() {
            isAdmin = !isAdmin;
            
            if (isAdmin) {
                this.textContent = 'Switch to Cafe Owner View';
                if (document.getElementById('user-role')) {
                    document.getElementById('user-role').textContent = 'Admin';
                }
                
                adminSections.forEach(section => {
                    section.style.display = 'block';
                });
            } else {
                this.textContent = 'Switch to Admin View';
                if (document.getElementById('user-role')) {
                    document.getElementById('user-role').textContent = 'Cafe Owner';
                }
                
                adminSections.forEach(section => {
                    section.style.display = 'none';
                });
                
                // If currently on an admin section, switch to overview
                const activeSection = document.querySelector('.content-section.active');
                if (activeSection && activeSection.classList.contains('admin-only')) {
                    const overviewSection = document.getElementById('overview');
                    if (overviewSection) {
                        overviewSection.classList.add('active');
                        activeSection.classList.remove('active');
                    }
                    
                    // Update nav item
                    const overviewNavItem = document.querySelector('.nav-item[data-section="overview"]');
                    if (overviewNavItem) {
                        overviewNavItem.classList.add('active');
                    }
                    
                    const currentActive = document.querySelector('.nav-item.active:not([data-section="overview"])');
                    if (currentActive) {
                        currentActive.classList.remove('active');
                    }
                }
            }
        });
    }

    // Notification dropdown
    const notificationBell = document.getElementById('notification-bell');

    if (notificationBell) {
        notificationBell.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.querySelector('.notification-dropdown');
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
            
            // Close other dropdowns
            const helpDropdown = document.querySelector('.help-dropdown');
            if (helpDropdown) {
                helpDropdown.classList.remove('active');
            }
            
            const userDropdown = document.querySelector('.user-dropdown');
            if (userDropdown) {
                userDropdown.classList.remove('active');
            }
        });
    }

    // Help dropdown
    const helpIcon = document.getElementById('help-icon');

    if (helpIcon) {
        helpIcon.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.querySelector('.help-dropdown');
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
            
            // Close other dropdowns
            const notificationDropdown = document.querySelector('.notification-dropdown');
            if (notificationDropdown) {
                notificationDropdown.classList.remove('active');
            }
            
            const userDropdown = document.querySelector('.user-dropdown');
            if (userDropdown) {
                userDropdown.classList.remove('active');
            }
        });
    }

    // User dropdown
    const userDropdownToggle = document.getElementById('user-dropdown-toggle');

    if (userDropdownToggle) {
        userDropdownToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            const dropdown = this.querySelector('.user-dropdown');
            if (dropdown) {
                dropdown.classList.toggle('active');
            }
            
            // Close other dropdowns
            const notificationDropdown = document.querySelector('.notification-dropdown');
            if (notificationDropdown) {
                notificationDropdown.classList.remove('active');
            }
            
            const helpDropdown = document.querySelector('.help-dropdown');
            if (helpDropdown) {
                helpDropdown.classList.remove('active');
            }
        });
    }

    // Close dropdowns when clicking outside
    document.addEventListener('click', () => {
        const notificationDropdown = document.querySelector('.notification-dropdown');
        if (notificationDropdown) {
            notificationDropdown.classList.remove('active');
        }
        
        const helpDropdown = document.querySelector('.help-dropdown');
        if (helpDropdown) {
            helpDropdown.classList.remove('active');
        }
        
        const userDropdown = document.querySelector('.user-dropdown');
        if (userDropdown) {
            userDropdown.classList.remove('active');
        }
    });

    // Mark all notifications as read
    const markAllReadBtn = document.querySelector('.mark-all-read');

    if (markAllReadBtn) {
        markAllReadBtn.addEventListener('click', () => {
            document.querySelectorAll('.notification-item').forEach(item => {
                item.classList.remove('unread');
            });
            
            // Update notification badge
            const badge = document.querySelector('.notification-bell .badge');
            if (badge) {
                badge.style.display = 'none';
            }
        });
    }

    // Logout functionality
    const logoutBtns = document.querySelectorAll('#logout-btn, #header-logout');

    logoutBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (confirm('Are you sure you want to logout?')) {
                // Clear login state
                localStorage.removeItem('isLoggedIn');
                localStorage.removeItem('userRole');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userId');
                localStorage.removeItem('cafeId');
                
                // Show login screen
                if (dashboardContainer && loginContainer) {
                    dashboardContainer.classList.add('hidden');
                    loginContainer.classList.remove('hidden');
                }
            }
        });
    });

    // Date filter functionality
    const dateFilterBtns = document.querySelectorAll('.date-filter-btn');
    const customDateBtn = document.getElementById('custom-date-btn');
    const datePickerContainer = document.getElementById('date-picker-container');

    dateFilterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (this.id !== 'custom-date-btn') {
                dateFilterBtns.forEach(b => b.classList.remove('active'));
                this.classList.add('active');
                
                // Hide date picker if open
                if (datePickerContainer) {
                    datePickerContainer.classList.remove('active');
                }
                
                // Update stats based on selected period
                updateStats(this.getAttribute('data-period'));
            }
        });
    });

    if (customDateBtn && datePickerContainer) {
        customDateBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            datePickerContainer.classList.toggle('active');
        });
        
        // Close date picker when clicking outside
        document.addEventListener('click', (e) => {
            if (datePickerContainer && !datePickerContainer.contains(e.target) && e.target !== customDateBtn) {
                datePickerContainer.classList.remove('active');
            }
        });
        
        // Apply custom date range
        const applyDateBtn = document.querySelector('.apply-date-btn');
        if (applyDateBtn) {
            applyDateBtn.addEventListener('click', () => {
                const dateFrom = document.getElementById('date-from').value;
                const dateTo = document.getElementById('date-to').value;
                
                if (dateFrom && dateTo) {
                    dateFilterBtns.forEach(b => b.classList.remove('active'));
                    customDateBtn.classList.add('active');
                    customDateBtn.textContent = `${formatDate(dateFrom)} - ${formatDate(dateTo)}`;
                    datePickerContainer.classList.remove('active');
                    
                    // Update stats based on custom date range
                    updateStats('custom', { from: dateFrom, to: dateTo });
                } else {
                    showNotification('Please select both start and end dates', 'error');
                }
            });
        }
    }

    // Format date helper
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    // Update stats based on selected period
    async function updateStats(period, customDates) {
        const cafeId = localStorage.getItem('cafeId');
        if (!cafeId) return;
        
        try {
            // In production, fetch from API
            // const response = await fetch(`/api/analytics/${cafeId}?period=${period}`);
            // const data = await response.json();
            
            // For now, use sample data
            const statsData = {
                today: {
                    orders: 24,
                    revenue: 15240,
                    customers: 18,
                    rating: 4.8,
                    ordersChange: 12,
                    revenueChange: 8,
                    customersChange: -5,
                    ratingChange: 0
                },
                week: {
                    orders: 168,
                    revenue: 98750,
                    customers: 112,
                    rating: 4.7,
                    ordersChange: 15,
                    revenueChange: 12,
                    customersChange: 8,
                    ratingChange: 2
                },
                month: {
                    orders: 720,
                    revenue: 425000,
                    customers: 480,
                    rating: 4.6,
                    ordersChange: 20,
                    revenueChange: 18,
                    customersChange: 15,
                    ratingChange: -1
                },
                custom: {
                    orders: 45,
                    revenue: 28500,
                    customers: 32,
                    rating: 4.7,
                    ordersChange: 5,
                    revenueChange: 7,
                    customersChange: 3,
                    ratingChange: 1
                }
            };
            
            // Get data for selected period
            const data = statsData[period] || statsData.today;
            
            // Update stats in the UI
            const ordersCount = document.getElementById('orders-count');
            const revenueAmount = document.getElementById('revenue-amount');
            const customersCount = document.getElementById('customers-count');
            const ratingValue = document.getElementById('rating-value');
            
            if (ordersCount) ordersCount.textContent = data.orders;
            if (revenueAmount) revenueAmount.textContent = `KSh ${formatNumber(data.revenue)}`;
            if (customersCount) customersCount.textContent = data.customers;
            if (ratingValue) ratingValue.textContent = data.rating;
            
            // Update change percentages
            updateChangePercentage('orders-count', data.ordersChange);
            updateChangePercentage('revenue-amount', data.revenueChange);
            updateChangePercentage('customers-count', data.customersChange);
            updateChangePercentage('rating-value', data.ratingChange);
            
            // Update charts
            updateCharts(period);
        } catch (error) {
            console.error('Error updating stats:', error);
            showNotification('Failed to update statistics', 'error');
        }
    }

    // Update change percentage helper
    function updateChangePercentage(elementId, change) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const changeElement = element.nextElementSibling;
        if (!changeElement) return;
        
        if (change > 0) {
            changeElement.className = 'stat-change positive';
            changeElement.innerHTML = `<i class="fas fa-arrow-up"></i> ${change}% from previous period`;
        } else if (change < 0) {
            changeElement.className = 'stat-change negative';
            changeElement.innerHTML = `<i class="fas fa-arrow-down"></i> ${Math.abs(change)}% from previous period`;
        } else {
            changeElement.className = 'stat-change neutral';
            changeElement.textContent = 'Same as previous period';
        }
    }

    // Format number helper
    function formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    // Chart functionality
    let salesChart, popularItemsChart;

    function initializeCharts() {
        const salesChartCtx = document.getElementById('sales-chart');
        const popularItemsChartCtx = document.getElementById('popular-items-chart');
        
        if (salesChartCtx) {
            salesChart = new Chart(salesChartCtx, {
                type: 'line',
                data: {
                    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                    datasets: [{
                        label: 'Sales',
                        data: [12000, 19000, 15000, 17000, 22000, 25000, 18000],
                        borderColor: '#d97706',
                        backgroundColor: 'rgba(217, 119, 6, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    return `KSh ${context.parsed.y.toLocaleString()}`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                callback: function(value) {
                                    return 'KSh ' + value.toLocaleString();
                                }
                            }
                        }
                    }
                }
            });
        }
        
        if (popularItemsChartCtx) {
            popularItemsChart = new Chart(popularItemsChartCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Chapati with Beans', 'Nyama Choma Platter', 'Ugali with Tilapia', 'Other'],
                    datasets: [{
                        data: [28, 24, 19, 29],
                        backgroundColor: [
                            '#d97706',
                            '#0891b2',
                            '#7c3aed',
                            '#6b7280'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            display: false
                        },
                        tooltip: {
                            callbacks: {
                                label: function(context) {
                                    const label = context.label || '';
                                    const value = context.parsed || 0;
                                    return `${label}: ${value}%`;
                                }
                            }
                        }
                    },
                    cutout: '70%'
                }
            });
        }
    }

    // Update charts based on selected period
    async function updateCharts(period) {
        if (!salesChart || !popularItemsChart) return;
        
        const cafeId = localStorage.getItem('cafeId');
        if (!cafeId) return;
        
        try {
            // In production, fetch from API
            // const response = await fetch(`/api/analytics/charts/${cafeId}?period=${period}`);
            // const chartData = await response.json();
            
            // For now, use sample data
            const chartData = {
                today: {
                    sales: [12000, 19000, 15000, 17000, 22000, 25000, 18000],
                    popular: [28, 24, 19, 29]
                },
                week: {
                    sales: [85000, 92000, 88000, 95000, 102000, 98000, 90000],
                    popular: [25, 28, 22, 25]
                },
                month: {
                    sales: [350000, 380000, 365000, 390000, 410000, 400000, 385000],
                    popular: [22, 30, 18, 30]
                },
                custom: {
                    sales: [25000, 28000, 22000, 30000, 35000, 32000, 28000],
                    popular: [26, 25, 20, 29]
                }
            };
            
            // Get data for selected period
            const data = chartData[period] || chartData.today;
            
            // Update sales chart
            salesChart.data.datasets[0].data = data.sales;
            salesChart.update();
            
            // Update popular items chart
            popularItemsChart.data.datasets[0].data = data.popular;
            popularItemsChart.update();
        } catch (error) {
            console.error('Error updating charts:', error);
        }
    }

    // Chart action buttons
    const chartActionBtns = document.querySelectorAll('.chart-action-btn');

    chartActionBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const chartType = this.getAttribute('data-chart');
            const parent = this.closest('.chart-actions');
            
            // Update active button
            parent.querySelectorAll('.chart-action-btn').forEach(b => {
                b.classList.remove('active');
            });
            
            this.classList.add('active');
            
            // Update chart data based on selected type
            updateChartByType(chartType);
        });
    });

    // Update chart based on type (daily, weekly, monthly)
    function updateChartByType(type) {
        if (!salesChart) return;
        
        // Sample data for different chart types
        const chartTypeData = {
            daily: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                data: [12000, 19000, 15000, 17000, 22000, 25000, 18000]
            },
            weekly: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
                data: [85000, 92000, 88000, 95000]
            },
            monthly: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                data: [350000, 380000, 365000, 390000, 410000, 400000]
            }
        };
        
        // Get data for selected type
        const data = chartTypeData[type] || chartTypeData.daily;
        
        // Update sales chart
        salesChart.data.labels = data.labels;
        salesChart.data.datasets[0].data = data.data;
        salesChart.update();
    }

    // Export chart functionality
    const chartExportBtns = document.querySelectorAll('.chart-export-btn');

    chartExportBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const chartCanvas = this.closest('.chart-card').querySelector('canvas');
            if (!chartCanvas) return;
            
            // Create a temporary link to download the chart image
            const link = document.createElement('a');
            link.download = 'chart-export.png';
            link.href = chartCanvas.toDataURL('image/png');
            link.click();
        });
    });

    // Theme toggle functionality
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    if (themeToggle) {
        // Check if user has a saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        body.className = savedTheme + '-mode';
        
        // Update theme toggle icon
        updateThemeToggleIcon(savedTheme);
        
        themeToggle.addEventListener('click', () => {
            if (body.classList.contains('light-mode')) {
                body.classList.remove('light-mode');
                body.classList.add('dark-mode');
                localStorage.setItem('theme', 'dark');
                updateThemeToggleIcon('dark');
            } else {
                body.classList.remove('dark-mode');
                body.classList.add('light-mode');
                localStorage.setItem('theme', 'light');
                updateThemeToggleIcon('light');
            }
        });
    }

    // Update theme toggle icon based on current theme
    function updateThemeToggleIcon(theme) {
        const icon = themeToggle.querySelector('i');
        if (icon) {
            if (theme === 'dark') {
                icon.className = 'fas fa-sun';
            } else {
                icon.className = 'fas fa-moon';
            }
        }
    }

    // Global search functionality
    const globalSearch = document.getElementById('global-search');
    const searchResults = document.getElementById('search-results');

    if (globalSearch && searchResults) {
        globalSearch.addEventListener('input', function() {
            const query = this.value.trim().toLowerCase();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
                return;
            }
            
            // Sample search data
            const searchData = [
                { type: 'menu', name: 'Ugali with Tilapia', url: '#menu' },
                { type: 'menu', name: 'Nyama Choma Platter', url: '#menu' },
                { type: 'menu', name: 'Chapati with Beans', url: '#menu' },
                { type: 'order', name: 'Order #1234', url: '#orders' },
                { type: 'customer', name: 'Jane Doe', url: '#customers' }
            ];
            
            // Filter results based on query
            const results = searchData.filter(item => 
                item.name.toLowerCase().includes(query)
            );
            
            // Display results
            if (results.length > 0) {
                searchResults.innerHTML = '';
                
                results.forEach(result => {
                    const resultItem = document.createElement('div');
                    resultItem.className = 'search-result-item';
                    
                    let icon;
                    switch (result.type) {
                        case 'menu':
                            icon = 'fas fa-utensils';
                            break;
                        case 'order':
                            icon = 'fas fa-shopping-cart';
                            break;
                        case 'customer':
                            icon = 'fas fa-user';
                            break;
                        default:
                            icon = 'fas fa-search';
                    }
                    
                    resultItem.innerHTML = `
                        <i class="${icon}"></i>
                        <div class="search-result-content">
                            <p>${result.name}</p>
                            <span>${result.type}</span>
                        </div>
                    `;
                    
                    resultItem.addEventListener('click', () => {
                        window.location.hash = result.url;
                        searchResults.style.display = 'none';
                        globalSearch.value = '';
                    });
                    
                    searchResults.appendChild(resultItem);
                });
                
                searchResults.style.display = 'block';
            } else {
                searchResults.innerHTML = '<div class="no-results">No results found</div>';
                searchResults.style.display = 'block';
            }
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target !== globalSearch && !searchResults.contains(e.target)) {
                searchResults.style.display = 'none';
            }
        });
    }

    // Load cafe data
    async function loadCafeData(cafeId) {
        try {
            // In production, fetch from API
            // const response = await fetch(`/api/cafes/${cafeId}`);
            // const cafeData = await response.json();
            
            // For now, use sample data
            const cafeData = {
                id: cafeId,
                name: 'Mama Njeri\'s Kitchen',
                description: 'Traditional Kenyan restaurant serving authentic local cuisine',
                location: 'Nairobi, Kenya',
                phone: '+254 712 345 678',
                email: 'info@mamanjeri.co.ke',
                website: 'https://mamanjeri.co.ke',
                rating: 4.8,
                reviewCount: 124,
                cuisine: ['Kenyan', 'African'],
                services: ['Dine-in', 'Takeaway', 'Delivery']
            };
            
            // Update profile UI with cafe data
            document.getElementById('profile-cafe-name').textContent = cafeData.name;
            document.getElementById('profile-location').textContent = cafeData.location;
            document.getElementById('cafe-name').value = cafeData.name;
            document.getElementById('cafe-phone').value = cafeData.phone;
            document.getElementById('cafe-email').value = cafeData.email;
            document.getElementById('cafe-website').value = cafeData.website;
            document.getElementById('cafe-description').value = cafeData.description;
            
            // Update header
            document.getElementById('header-user-name').textContent = cafeData.name;
            document.getElementById('user-name').textContent = cafeData.name;
            
            return cafeData;
        } catch (error) {
            console.error('Error loading cafe data:', error);
            showNotification('Failed to load cafe data', 'error');
        }
    }

    // Form submission handler for all forms
    document.addEventListener('submit', async function(e) {
        // Check if the form has the data-form-handler attribute
        if (e.target.hasAttribute('data-form-handler')) {
            e.preventDefault();
            
            const form = e.target;
            const formId = form.id;
            const formData = new FormData(form);
            const formDataObj = {};
            
            formData.forEach((value, key) => {
                formDataObj[key] = value;
            });
            
            try {
                // Save form data based on form ID
                switch (formId) {
                    case 'basic-info-form':
                        await saveCafeProfile(formDataObj);
                        break;
                    case 'business-hours-form':
                        await saveBusinessHours(formDataObj);
                        break;
                    case 'location-form':
                        await saveCafeLocation(formDataObj);
                        break;
                    case 'menu-item-form':
                        await saveMenuItem(formDataObj);
                        break;
                    case 'account-settings-form':
                        await saveAccountSettings(formDataObj);
                        break;
                    case 'notifications-settings-form':
                        await saveNotificationSettings(formDataObj);
                        break;
                    case 'appearance-settings-form':
                        await saveAppearanceSettings(formDataObj);
                        break;
                    default:
                        // Generic form save
                        await saveFormData(formId, formDataObj);
                }
                
                // Show success notification
                const message = form.getAttribute('data-notification-message') || 'Changes saved successfully!';
                showNotification(message, 'success');
                
                // Update UI if needed
                if (formId === 'basic-info-form') {
                    updateProfileInfo(formDataObj);
                }
            } catch (error) {
                console.error('Error saving form data:', error);
                showNotification('Failed to save changes', 'error');
            }
        }
    });

    // Save cafe profile
    async function saveCafeProfile(data) {
        const cafeId = localStorage.getItem('cafeId');
        if (!cafeId) return;
        
        try {
            // In production, send to API
            // await fetch(`/api/cafes/${cafeId}`, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(data),
            // });
            
            // For now, just log the data
            console.log('Saving cafe profile:', data);
            
            // Store in localStorage for demo purposes
            localStorage.setItem('cafeData', JSON.stringify({
                ...JSON.parse(localStorage.getItem('cafeData') || '{}'),
                ...data
            }));
            
            return true;
        } catch (error) {
            console.error('Error saving cafe profile:', error);
            throw error;
        }
    }

    // Save business hours
    async function saveBusinessHours(data) {
        const cafeId = localStorage.getItem('cafeId');
        if (!cafeId) return;
        
        try {
            // In production, send to API
            // await fetch(`/api/cafes/${cafeId}/hours`, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(data),
            // });
            
            // For now, just log the data
            console.log('Saving business hours:', data);
            
            // Store in localStorage for demo purposes
            localStorage.setItem('cafeHours', JSON.stringify(data));
            
            return true;
        } catch (error) {
            console.error('Error saving business hours:', error);
            throw error;
        }
    }

    // Save cafe location
    async function saveCafeLocation(data) {
        const cafeId = localStorage.getItem('cafeId');
        if (!cafeId) return;
        
        try {
            // In production, send to API
            // await fetch(`/api/cafes/${cafeId}/location`, {
            //     method: 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(data),
            // });
            
            // For now, just log the data
            console.log('Saving cafe location:', data);
            
            // Store in localStorage for demo purposes
            localStorage.setItem('cafeLocation', JSON.stringify(data));
            
            return true;
        } catch (error) {
            console.error('Error saving cafe location:', error);
            throw error;
        }
    }

    // Save menu item
    async function saveMenuItem(data) {
        const cafeId = localStorage.getItem('cafeId');
        if (!cafeId) return;
        
        try {
            const isNewItem = !data['menu-item-id'];
            const endpoint = isNewItem ? 
                `/api/cafes/${cafeId}/menu` : 
                `/api/cafes/${cafeId}/menu/${data['menu-item-id']}`;
            
            // In production, send to API
            // await fetch(endpoint, {
            //     method: isNewItem ? 'POST' : 'PUT',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(data),
            // });
            
            // For now, just log the data
            console.log('Saving menu item:', data);
            
            // Store in localStorage for demo purposes
            const menuItems = JSON.parse(localStorage.getItem('cafeMenuItems') || '[]');
            
            if (isNewItem) {
                // Add new item
                menuItems.push({
                    id: 'item_' + Date.now(),
                    name: data['menu-item-name'],
                    description: data['menu-item-description'],
                    price: data['menu-item-price'],
                    category: Array.from(data['menu-item-category']),
                    status: data['menu-item-status']
                });
            } else {
                // Update existing item
                const itemIndex = menuItems.findIndex(item => item.id === data['menu-item-id']);
                if (itemIndex !== -1) {
                    menuItems[itemIndex] = {
                        ...menuItems[itemIndex],
                        name: data['menu-item-name'],
                        description: data['menu-item-description'],
                        price: data['menu-item-price'],
                        category: Array.from(data['menu-item-category']),
                        status: data['menu-item-status']
                    };
                }
            }
            
            localStorage.setItem('cafeMenuItems', JSON.stringify(menuItems));
            
            // Close the modal
            const modal = document.getElementById('menu-item-modal');
            if (modal) modal.style.display = 'none';
            
            return true;
        } catch (error) {
            console.error('Error saving menu item:', error);
            throw error;
        }
    }

    // Generic form data save
    async function saveFormData(formId, data) {
        try {
            // In production, send to API
            // await fetch(`/api/forms/${formId}`, {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //     },
            //     body: JSON.stringify(data),
            // });
            
            // For now, just log the data
            console.log(`Saving form data for ${formId}:`, data);
            
            // Store in localStorage for demo purposes
            localStorage.setItem(`formData_${formId}`, JSON.stringify(data));
            
            return true;
        } catch (error) {
            console.error('Error saving form data:', error);
            throw error;
        }
    }

    // Update profile info in UI
    function updateProfileInfo(data) {
        const { 'cafe-name': cafeName } = data;
        if (cafeName) {
            const profileName = document.getElementById('profile-cafe-name');
            if (profileName) profileName.textContent = cafeName;

            const headerUserName = document.getElementById('header-user-name');
            if (headerUserName) headerUserName.textContent = cafeName;

            const sidebarUserName = document.getElementById('user-name');
            if (sidebarUserName) sidebarUserName.textContent = cafeName;

            localStorage.setItem('userName', cafeName);
        }
    }

    // Menu item modal functionality
    const addMenuItemBtn = document.getElementById('add-menu-item-btn');
    const menuItemModal = document.getElementById('menu-item-modal');
    const menuModalClose = document.getElementById('menu-modal-close');
    const menuCancelBtn = document.getElementById('menu-cancel-btn');
    const menuItemForm = document.getElementById('menu-item-form');

    if (addMenuItemBtn && menuItemModal) {
        // Open modal when clicking add button
        addMenuItemBtn.addEventListener('click', () => {
            menuItemModal.style.display = 'block';
            document.getElementById('menu-modal-title').textContent = 'Add Menu Item';
            menuItemForm.reset();
            document.getElementById('menu-item-id').value = '';
            document.getElementById('menu-preview-image').src = 'https://via.placeholder.com/150?text=No+Image';
        });
        
        // Close modal when clicking close button or cancel button
        menuModalClose.addEventListener('click', () => {
            menuItemModal.style.display = 'none';
        });
        
        menuCancelBtn.addEventListener('click', () => {
            menuItemModal.style.display = 'none';
        });
        
        // Close modal when clicking outside
        window.addEventListener('click', (e) => {
            if (e.target === menuItemModal) {
                menuItemModal.style.display = 'none';
            }
        });
        
        // Edit menu item functionality
        const editMenuItemBtns = document.querySelectorAll('.edit-menu-item');
        
        editMenuItemBtns.forEach(btn => {
            btn.addEventListener('click', function() {
                const menuItem = this.closest('.menu-item-card');
                const itemId = menuItem.getAttribute('data-id');
                const itemName = menuItem.querySelector('h3').textContent;
                const itemDescription = menuItem.querySelector('.menu-item-description').textContent;
                const itemPrice = menuItem.querySelector('.menu-item-price').textContent.replace('KSh ', '');
                const itemCategories = menuItem.querySelector('.menu-item-category').textContent.split(', ');
                const itemImage = menuItem.querySelector('img').src;
                const itemStatus = menuItem.querySelector('.menu-item-status').classList.contains('available') ? 'available' : 
                                  menuItem.querySelector('.menu-item-status').classList.contains('low-stock') ? 'low-stock' : 'out-of-stock';
                
                // Set modal title
                document.getElementById('menu-modal-title').textContent = 'Edit Menu Item';
                
                // Fill form with item data
                document.getElementById('menu-item-id').value = itemId;
                document.getElementById('menu-item-name').value = itemName;
                document.getElementById('menu-item-description').value = itemDescription;
                document.getElementById('menu-item-price').value = itemPrice;
                document.getElementById('menu-item-status').value = itemStatus;
                document.getElementById('menu-preview-image').src = itemImage;
                
                // Set categories
                const categorySelect = document.getElementById('menu-item-category');
                for (let i = 0; i < categorySelect.options.length; i++) {
                    categorySelect.options[i].selected = itemCategories.includes(categorySelect.options[i].text);
                }
                
                // Show modal
                menuItemModal.style.display = 'block';
            });
        });
    }

    // Delete menu item functionality
    const deleteMenuItemBtns = document.querySelectorAll('.delete-menu-item');

    deleteMenuItemBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to delete this menu item?')) {
                const menuItem = this.closest('.menu-item-card');
                const itemId = menuItem.getAttribute('data-id');
                
                // In production, send delete request to API
                // fetch(`/api/cafes/${cafeId}/menu/${itemId}`, {
                //     method: 'DELETE'
                // });
                
                // For now, just remove from DOM
                menuItem.remove();
                
                // Show notification
                showNotification('Menu item deleted successfully', 'success');
            }
        });
    });

    // Order management functionality
    const acceptOrderBtns = document.querySelectorAll('.accept-order');
    const rejectOrderBtns = document.querySelectorAll('.reject-order');

    acceptOrderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const orderCard = this.closest('.order-card');
            const orderId = orderCard.getAttribute('data-id');
            
            // Update order status
            orderCard.querySelector('.order-status').className = 'order-status preparing';
            orderCard.querySelector('.order-status').textContent = 'Preparing';
            
            // Update timeline
            const timelineItems = orderCard.querySelectorAll('.timeline-item');
            timelineItems[1].classList.add('active');
            timelineItems[1].querySelector('span').textContent = getCurrentTime();
            
            // Update buttons
            this.parentElement.innerHTML = `
                <button class="btn-success ready-order"><i class="fas fa-check-circle"></i> Mark as Ready</button>
                <button class="btn-secondary view-order-details"><i class="fas fa-eye"></i> View Details</button>
            `;
            
            // Add event listener to new button
            orderCard.querySelector('.ready-order').addEventListener('click', function() {
                // Update order status
                orderCard.querySelector('.order-status').className = 'order-status ready';
                orderCard.querySelector('.order-status').textContent = 'Ready for Pickup';
                
                // Update timeline
                timelineItems[2].classList.add('active');
                timelineItems[2].querySelector('span').textContent = getCurrentTime();
                
                // Update buttons
                this.parentElement.innerHTML = `
                    <button class="btn-success complete-order"><i class="fas fa-flag-checkered"></i> Complete Order</button>
                    <button class="btn-secondary view-order-details"><i class="fas fa-eye"></i> View Details</button>
                `;
                
                // Add event listener to new button
                orderCard.querySelector('.complete-order').addEventListener('click', function() {
                    // Update order status
                    orderCard.querySelector('.order-status').className = 'order-status completed';
                    orderCard.querySelector('.order-status').textContent = 'Completed';
                    
                    // Update timeline
                    timelineItems[3].classList.add('active');
                    timelineItems[3].querySelector('span').textContent = getCurrentTime();
                    timelineItems[4].classList.add('active');
                    timelineItems[4].querySelector('span').textContent = getCurrentTime();
                    
                    // Update buttons
                    this.parentElement.innerHTML = `
                        <button class="btn-secondary view-order-details"><i class="fas fa-eye"></i> View Details</button>
                        <button class="btn-primary print-receipt"><i class="fas fa-print"></i> Print Receipt</button>
                    `;
                    
                    // Move to completed orders tab
                    const completedOrders = document.getElementById('completed-orders');
                    if (completedOrders) {
                        completedOrders.appendChild(orderCard);
                    }
                    
                    // Update counts
                    updateOrderCounts();
                });
                
                // Move to ready orders tab
                const readyOrders = document.getElementById('ready-orders');
                if (readyOrders) {
                    readyOrders.appendChild(orderCard);
                }
                
                // Update counts
                updateOrderCounts();
            });
            
            // Move to preparing orders tab
            const preparingOrders = document.getElementById('preparing-orders');
            if (preparingOrders) {
                preparingOrders.appendChild(orderCard);
            }
            
            // Update counts
            updateOrderCounts();
        });
    });

    rejectOrderBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            if (confirm('Are you sure you want to reject this order?')) {
                this.closest('.order-card').remove();
                
                // Update counts
                updateOrderCounts();
                
                // Show notification
                showNotification('Order rejected', 'info');
            }
        });
    });

    // Get current time helper
    function getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    // Update order counts
    function updateOrderCounts() {
        const pendingCount = document.getElementById('pending-count');
        const preparingCount = document.getElementById('preparing-count');
        const readyCount = document.getElementById('ready-count');
        
        if (pendingCount) {
            pendingCount.textContent = document.querySelectorAll('#pending-orders .order-card').length;
        }
        
        if (preparingCount) {
            preparingCount.textContent = document.querySelectorAll('#preparing-orders .order-card').length;
        }
        
        if (readyCount) {
            readyCount.textContent = document.querySelectorAll('#ready-orders .order-card').length;
        }
        
        // Update badges
        const ordersBadge = document.getElementById('orders-badge');
        if (ordersBadge && pendingCount) {
            const pendingCountValue = parseInt(pendingCount.textContent);
            
            if (pendingCountValue > 0) {
                ordersBadge.textContent = pendingCountValue;
                ordersBadge.style.display = 'inline-flex';
            } else {
                ordersBadge.style.display = 'none';
            }
        }
    }

    // Show notification function
    function showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
                <p>${message}</p>
            </div>
            <button class="notification-close"><i class="fas fa-times"></i></button>
        `;

        document.body.appendChild(notification);

        // Close notification on button click
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.remove();
        });

        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.remove();
            }
        }, 5000);
    }
});