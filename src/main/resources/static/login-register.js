/**
 * Login and Registration Handler
 * 
 * Core frontend functionality for authentication:
 * - Manages user login and registration forms
 * - Handles form submissions and validation
 * - Implements role-based form switching
 * - Manages CSRF token handling
 * - Provides dark mode toggle functionality
 * - Handles form loading and error states
 * - Manages user role selection
 * - Handles authentication responses
 */

document.addEventListener('DOMContentLoaded', () => {
    const roleSelectors = document.querySelectorAll('.role-selector');
    const formArea = document.getElementById('form-area');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const html = document.documentElement;

    let currentRole = 'patient';
    let currentMode = 'login';
    
    // Get CSRF token from meta tag
    const getCsrfToken = () => {
        const token = document.querySelector('meta[name="_csrf"]')?.getAttribute('content');
        const header = document.querySelector('meta[name="_csrf_header"]')?.getAttribute('content');
        return { token, header };
    };

    const loginFormRoutes = {
        'admin': '/static/forms/admin-login.html',
        'doctor': '/static/forms/doctor-login.html',
        'patient': '/static/forms/patient-login.html',
        'staff': '/static/forms/staff-login.html',
        'pharmacy': '/static/forms/pharmacy-staff-login.html'
    };

    const registerFormRoutes = {
        'admin': '/static/forms/admin-register.html',
        'doctor': '/static/forms/doctor-register.html',
        'patient': '/static/forms/patient-register.html',
        'staff': '/static/forms/staff-register.html',
        'pharmacy': '/static/forms/pharmacy-staff-register.html'
    };

    const setupFormListeners = (form, role, mode) => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const { token, header } = getCsrfToken();
            
            try {
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'X-Requested-With': 'XMLHttpRequest',
                        [header]: token,
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    body: new URLSearchParams(formData)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                if (data.success) {
                    if (mode === 'login') {
                        window.location.href = `/${role.toLowerCase()}/dashboard`;
                    } else {
                        alert('Registration successful! Please login.');
                        currentMode = 'login';
                        loadForm(currentRole, currentMode);
                    }
                } else {
                    throw new Error(data.message || 'Operation failed');
                }
            } catch (error) {
                console.error('Form submission failed:', error);
                alert(error.message || 'An error occurred. Please try again.');
            }
        });
    };

    const loadForm = async (role, mode) => {
        let url;
        if (mode === 'login') {
            url = loginFormRoutes[role];
        } else {
            url = registerFormRoutes[role];
        }

        if (!url) {
            formArea.innerHTML = '<div class="p-6 text-red-500">Form not found.</div>';
            return;
        }

        console.log('Loading form from:', url);
        formArea.innerHTML = `
            <div class="flex items-center justify-center p-6">
                <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span class="ml-2 text-gray-600 dark:text-gray-400">Loading ${role} ${mode} form...</span>
            </div>
        `;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'text/html',
                    'X-Requested-With': 'XMLHttpRequest'
                }
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const htmlContent = await response.text();
            if (!htmlContent.trim()) {
                throw new Error('Empty form content received');
            }
            
            formArea.innerHTML = htmlContent;

            const form = formArea.querySelector('form');
            if (form) {
                // Set form action and method
                if (mode === 'login') {
                    form.setAttribute('action', '/perform_login');
                } else {
                    form.setAttribute('action', '/api/register');
                }
                form.setAttribute('method', 'post');

                // Add CSRF token input
                const { token, header } = getCsrfToken();
                if (token && header) {
                    const csrfInput = document.createElement('input');
                    csrfInput.type = 'hidden';
                    csrfInput.name = '_csrf';
                    csrfInput.value = token;
                    form.appendChild(csrfInput);
                }

                // Add role input for registration
                if (mode === 'register') {
                    const roleInput = document.createElement('input');
                    roleInput.type = 'hidden';
                    roleInput.name = 'role';
                    roleInput.value = role;
                    form.appendChild(roleInput);
                }

                // Setup form submission handler
                setupFormListeners(form, role, mode);
            }

            const switchLink = document.getElementById('switch-form-link');
            if (switchLink) {
                switchLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentMode = currentMode === 'login' ? 'register' : 'login';
                    loadForm(currentRole, currentMode);
                });
            }

        } catch (error) {
            console.error('Failed to load form:', error);
            formArea.innerHTML = '<div class="p-6 text-red-500">Failed to load form.</div>';
        }
    };

    const updateRoleButtons = () => {
        roleSelectors.forEach(button => {
            if (button.dataset.role === currentRole) {
                button.classList.add('active', 'border-blue-500', 'text-blue-500');
                button.classList.remove('border-transparent', 'hover:border-blue-500', 'hover:text-blue-500');
            } else {
                button.classList.remove('active', 'border-blue-500', 'text-blue-500');
                button.classList.add('border-transparent', 'hover:border-blue-500', 'hover:text-blue-500');
            }
        });
    };

    roleSelectors.forEach(button => {
        button.addEventListener('click', () => {
            currentRole = button.dataset.role;
            updateRoleButtons();
            loadForm(currentRole, currentMode);
        });
    });

    darkModeToggle.addEventListener('click', () => {
        html.classList.toggle('dark');
        const isDark = html.classList.contains('dark');
        darkModeIcon.name = isDark ? 'sunny-outline' : 'moon-outline';
        localStorage.setItem('darkMode', isDark ? 'enabled' : 'disabled');
    });

    if (localStorage.getItem('darkMode') === 'enabled') {
        html.classList.add('dark');
        darkModeIcon.name = 'sunny-outline';
    }
    updateRoleButtons();
    loadForm(currentRole, currentMode);
});