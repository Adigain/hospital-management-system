// Dashboard scripts
document.addEventListener('DOMContentLoaded', function() {
    console.log('Dashboard loaded');
    
    // Initialize UI elements
    initializeSidebar();
    initializeDarkMode();
    initializeUserMenu();
    initializeCharts();
});

function initializeSidebar() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('sidebar-collapsed');
            mainContent.classList.toggle('ml-64');
            mainContent.classList.toggle('ml-20');
        });
    }

    // Handle sidebar navigation
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            sidebarLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
}

function initializeDarkMode() {
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');

    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', () => {
            document.documentElement.classList.toggle('dark');
            darkModeIcon.setAttribute('name', 
                document.documentElement.classList.contains('dark') ? 'sunny-outline' : 'moon-outline'
            );
        });
    }
}

function initializeUserMenu() {
    const userMenuButton = document.getElementById('userMenuButton');
    const userMenu = document.getElementById('userMenu');

    if (userMenuButton && userMenu) {
        userMenuButton.addEventListener('click', () => {
            userMenu.classList.toggle('hidden');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!userMenuButton.contains(e.target) && !userMenu.contains(e.target)) {
                userMenu.classList.add('hidden');
            }
        });
    }
}

function initializeCharts() {
    // Patient Admissions Chart
    const patientAdmissionsCtx = document.getElementById('patientAdmissionsChart');
    if (patientAdmissionsCtx) {
        new Chart(patientAdmissionsCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    label: 'Patient Admissions',
                    data: [65, 59, 80, 81, 56, 55],
                    borderColor: 'rgb(59, 130, 246)',
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }

    // Department Popularity Chart
    const departmentPopularityCtx = document.getElementById('departmentPopularityChart');
    if (departmentPopularityCtx) {
        new Chart(departmentPopularityCtx, {
            type: 'doughnut',
            data: {
                labels: ['Cardiology', 'Neurology', 'Pediatrics', 'Orthopedics', 'Others'],
                datasets: [{
                    data: [30, 20, 25, 15, 10],
                    backgroundColor: [
                        'rgb(59, 130, 246)',
                        'rgb(16, 185, 129)',
                        'rgb(245, 158, 11)',
                        'rgb(239, 68, 68)',
                        'rgb(107, 114, 128)'
                    ]
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false
            }
        });
    }
}