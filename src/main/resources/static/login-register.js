// login-register.js

document.addEventListener('DOMContentLoaded', () => {
    const roleSelectors = document.querySelectorAll('.role-selector');
    const formArea = document.getElementById('form-area');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const html = document.documentElement;

    let currentRole = 'patient';
    let currentMode = 'login';

    const loginFormRoutes = {
        'admin': 'forms/admin-login.html',
        'doctor': 'forms/doctor-login.html',
        'patient': 'forms/patient-login.html',
        'staff': 'forms/staff-login.html',
        'pharmacy': 'forms/pharmacy-staff-login.html'
    };

    const registerFormRoutes = {
        'admin': 'forms/admin-register.html',
        'doctor': 'forms/doctor-register.html',
        'patient': 'forms/patient-register.html',
        'staff': 'forms/staff-register.html',
        'pharmacy': 'forms/pharmacy-staff-register.html'
    };

    const redirectAfterAction = (role, action) => {
        // This function is no longer needed for redirects.
        // The form submission will be handled by the server.
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

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const htmlContent = await response.text();
            formArea.innerHTML = htmlContent;

            const form = formArea.querySelector('form');
            if (form) {
                // Set the correct form action and method for server-side processing
                if (mode === 'login') {
                    form.setAttribute('action', '/perform_login');
                    form.setAttribute('method', 'post');
                } else {
                    form.setAttribute('action', '/register');
                    form.setAttribute('method', 'post');
                    // Add a hidden input to submit the role along with the form data
                    const roleInput = document.createElement('input');
                    roleInput.type = 'hidden';
                    roleInput.name = 'role';
                    roleInput.value = role;
                    form.appendChild(roleInput);
                }
            }

            const switchLink = document.getElementById('switch-form-link');
            if (switchLink) {
                switchLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    currentMode = (currentMode === 'login') ? 'register' : 'login';
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