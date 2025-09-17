/**
 * dashboard.js - Universal Dashboard Engine
 * 
 * This script serves as the core engine for all role-based dashboards in the HMS system.
 * It provides dynamic content loading, dark mode support, responsive sidebar,
 * and initializes various dashboard components including charts and tables.
 * 
 * Dependencies:
 * - Chart.js - For rendering statistical charts
 * - FullCalendar - For appointment calendar management
 * - DataTables - For interactive patient tables
 * - AOS - For smooth animations
 * - Ionicons - For UI icons
 * 
 * Required Global Objects:
 * - contentRoutes: Defined in the HTML file that loads this script.
 *                 Maps section names to their content URLs.
 */

document.addEventListener('DOMContentLoaded', function () {
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebarLinks = document.querySelectorAll('.sidebar-link');
    const contentArea = document.getElementById('content-area');
    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const userMenuButton = document.getElementById('userMenuButton');
    const userMenu = document.getElementById('userMenu');

    let patientAdmissionsChartInstance, departmentPopularityChartInstance;
    let isCalendarRendered = false;
    let calendarInstance = null;
    let patientTableInstance = null;

    /**
     * Dynamically loads content for the selected dashboard section.
     * 
     * Uses the contentRoutes object to fetch the appropriate content for each section.
     * Updates the URL hash, renders the content, and initializes section-specific scripts.
     * 
     * @param {string} sectionName - The name/identifier of the section to load
     * @returns {Promise<void>} A promise that resolves when content is loaded
     */
    async function loadContent(sectionName) {
        const url = contentRoutes[sectionName];
        if (!url) {
            contentArea.innerHTML = '<div class="p-6 text-red-500">Content not found.</div>';
            return;
        }
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const html = await response.text();
            contentArea.innerHTML = html;
            window.location.hash = sectionName;
            initializePageScripts(sectionName);
        } catch (error) {
            console.error('Failed to load content:', error);
            contentArea.innerHTML = '<div class="p-6 text-red-500">Failed to load content. Please try again.</div>';
        }
    }

    // --- Sidebar Toggle ---
    sidebarToggle.addEventListener('click', () => {
        sidebar.classList.toggle('sidebar-collapsed');
        sidebar.classList.toggle('sidebar-expanded');
        if (sidebar.classList.contains('sidebar-collapsed')) {
            mainContent.classList.remove('ml-64');
            mainContent.classList.add('ml-[4.5rem]');
        } else {
            mainContent.classList.remove('ml-[4.5rem]');
            mainContent.classList.add('ml-64');
        }
        setTimeout(() => {
            if (isCalendarRendered && calendarInstance) {
                calendarInstance.updateSize();
            }
            if (patientTableInstance) {
                patientTableInstance.columns.adjust().responsive.recalc();
            }
        }, 350);
    });

    // --- Dark Mode Toggle ---
    const applyDarkMode = (isDark) => {
        if (isDark) {
            document.documentElement.classList.add('dark');
            darkModeIcon.setAttribute('name', 'sunny-outline');
        } else {
            document.documentElement.classList.remove('dark');
            darkModeIcon.setAttribute('name', 'moon-outline');
        }
        if (patientAdmissionsChartInstance) { patientAdmissionsChartInstance.destroy(); initPatientAdmissionsChart(); }
        if (departmentPopularityChartInstance) { departmentPopularityChartInstance.destroy(); initDepartmentPopularityChart(); }
        if (isCalendarRendered && calendarInstance) { calendarInstance.destroy(); isCalendarRendered = false; initFullCalendar(); }
    };
    if (localStorage.getItem('darkMode') === 'enabled') {
        applyDarkMode(true);
    }
    darkModeToggle.addEventListener('click', () => {
        const isDarkModeEnabled = document.documentElement.classList.contains('dark');
        localStorage.setItem('darkMode', isDarkModeEnabled ? 'disabled' : 'enabled');
        applyDarkMode(!isDarkModeEnabled);
    });

    // --- User Menu Dropdown ---
    userMenuButton.addEventListener('click', () => userMenu.classList.toggle('hidden'));
    document.addEventListener('click', (event) => {
        if (!userMenuButton.contains(event.target) && !userMenu.contains(event.target)) {
            userMenu.classList.add('hidden');
        }
    });

    // --- Sidebar navigation logic ---
    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sectionId = link.dataset.section;
            sidebarLinks.forEach(s_link => s_link.classList.remove('active'));
            link.classList.add('active');
            loadContent(sectionId);
            if (window.innerWidth < 768 && !sidebar.classList.contains('sidebar-collapsed')) {
                sidebarToggle.click();
            }
        });
    });

    /**
     * Universal initialization function for loaded content.
     * 
     * Initializes animations and section-specific components such as:
     * - Dashboard: Patient admission and department charts
     * - Patients: Interactive patient data table
     * - Appointments: FullCalendar appointment scheduler
     * 
     * @param {string} sectionName - The name of the section being initialized
     */
    function initializePageScripts(sectionName) {
        AOS.init({ duration: 800, once: true });
        AOS.refreshHard();
        if (sectionName === 'dashboard') {
            initPatientAdmissionsChart();
            initDepartmentPopularityChart();
        } else if (sectionName === 'patients') {
            initPatientTable();
        } else if (sectionName === 'appointments') {
            initFullCalendar();
        }
    }
    
    // --- Initial page load ---
    const initialSection = window.location.hash.substring(1) || 'dashboard';
    const initialLink = document.querySelector(`.sidebar-link[data-section="${initialSection}"]`);
    if (initialLink) {
        initialLink.classList.add('active');
    }
    loadContent(initialSection);

    /**
     * Returns a color palette based on the current theme (light/dark).
     * 
     * Used by charts to maintain consistent theming and readability
     * in both light and dark modes.
     * 
     * @returns {Object} Color configuration for charts
     */
    function getChartColors() {
        const isDark = document.documentElement.classList.contains('dark');
        return {
            textColor: isDark ? '#E5E7EB' : '#374151',
            gridColor: isDark ? 'rgba(75, 85, 99, 0.5)' : 'rgba(209, 213, 219, 0.5)',
            primaryColor: '#3B82F6',
            secondaryColor: '#10B981',
            tertiaryColor: '#F59E0B',
        };
    }
    /**
     * Initializes the Patient Admissions line chart.
     * 
     * Creates a Chart.js line chart showing patient admission trends
     * over time. The chart is responsive and theme-aware.
     */
    function initPatientAdmissionsChart() {
        const canvas = document.getElementById('patientAdmissionsChart');
        if (!canvas) {
            return;
        }
        const ctx1 = canvas.getContext('2d');
        const colors = getChartColors();
        patientAdmissionsChartInstance = new Chart(ctx1, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Admissions',
                    data: [65, 59, 80, 81, 56, 55, 90],
                    fill: true,
                    borderColor: colors.primaryColor,
                    tension: 0.3,
                    backgroundColor: 'rgba(59, 130, 246, 0.1)'
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                scales: {
                    y: { beginAtZero: true, ticks: { color: colors.textColor }, grid: { color: colors.gridColor, borderColor: colors.gridColor } }
                },
                plugins: { legend: { labels: { color: colors.textColor } } }
            }
        });
    }
    /**
     * Initializes the Department Popularity doughnut chart.
     * 
     * Creates a Chart.js doughnut chart showing the distribution
     * of patient visits across different hospital departments.
     */
    function initDepartmentPopularityChart() {
        const canvas = document.getElementById('departmentPopularityChart');
        if (!canvas) {
            return;
        }
        const ctx2 = canvas.getContext('2d');
        const colors = getChartColors();
        departmentPopularityChartInstance = new Chart(ctx2, {
            type: 'doughnut',
            data: {
                labels: ['Cardiology', 'Neurology', 'Pediatrics', 'Oncology', 'Orthopedics'],
                datasets: [{
                    label: 'Patient Visits',
                    data: [300, 150, 220, 180, 250],
                    backgroundColor: [colors.primaryColor, colors.secondaryColor, colors.tertiaryColor, '#6366F1', '#EC4899'],
                    hoverOffset: 4,
                    borderColor: document.documentElement.classList.contains('dark') ? '#1f2937' : '#ffffff',
                }]
            },
            options: {
                responsive: true, maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom', labels: { color: colors.textColor } } }
            }
        });
    }
    /**
     * Initializes the FullCalendar appointment scheduler.
     * 
     * Sets up an interactive calendar for managing appointments.
     * Supports multiple views (month/week/day) and event management.
     * Re-renders on sidebar collapse/expand for proper sizing.
     */
    function initFullCalendar() {
        const calendarEl = document.getElementById('calendar');
        if (calendarEl && !isCalendarRendered) {
            calendarInstance = new FullCalendar.Calendar(calendarEl, {
                initialView: 'dayGridMonth',
                headerToolbar: {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
                },
                events: [
                    { title: 'Meeting with Dr. Smith', start: '2025-05-20T10:30:00', end: '2025-05-20T11:30:00', backgroundColor: '#3B82F6', borderColor: '#3B82F6' },
                    { title: 'Surgery - Patient X', start: '2025-05-22T09:00:00', end: '2025-05-22T13:00:00', backgroundColor: '#EF4444', borderColor: '#EF4444' },
                    { title: 'Conference Call', start: '2025-05-25', backgroundColor: '#10B981', borderColor: '#10B981' }
                ],
                editable: true, selectable: true, dayMaxEvents: true,
                dateClick: (info) => handleCalendarDateClick(info, calendarInstance),
                eventClick: (info) => handleCalendarEventClick(info, calendarInstance)
            });
            calendarInstance.render();
            isCalendarRendered = true;
        } else if (calendarInstance) {
            calendarInstance.updateSize();
        }
    }
    /**
     * Initializes the interactive patient data table.
     * 
     * Creates a DataTable instance for managing patient records.
     * Features include:
     * - Responsive layout
     * - Search/filter functionality
     * - Sortable columns
     * - Action buttons for view/edit/delete
     */
    function initPatientTable() {
        const patientTable = $('#patientTable');
        if (patientTable.length && $.fn.DataTable) {
            if ($.fn.DataTable.isDataTable('#patientTable')) {
                patientTable.DataTable().destroy();
            }
            patientTableInstance = patientTable.DataTable({
                responsive: true,
                data: [
                    ["P001", "John Doe", "35", "Male", "2025-05-10", "Dr. Smith", ""], ["P002", "Jane Smith", "28", "Female", "2025-05-12", "Dr. Lee", ""],
                    ["P003", "Robert Brown", "45", "Male", "2025-05-08", "Dr. Wilson", ""], ["P004", "Emily White", "62", "Female", "2025-05-11", "Dr. Smith", ""],
                    ["P005", "Michael Green", "19", "Male", "2025-05-09", "Dr. Davis", ""], ["P006", "Olivia Black", "50", "Female", "2025-05-13", "Dr. Lee", ""],
                ],
                columns: [
                    { title: "Patient ID" }, { title: "Name" }, { title: "Age" }, { title: "Gender" }, { title: "Last Visit" }, { title: "Assigned Doctor" },
                    { title: "Actions", render: function () { return `<button class="inline-flex p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-blue-500 hover:text-blue-600" title="View Details"><ion-icon name="eye-outline" class="text-lg"></ion-icon></button> <button class="inline-flex p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-green-500 hover:text-green-600" title="Edit"><ion-icon name="pencil-outline" class="text-lg"></ion-icon></button> <button class="inline-flex p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 text-red-500 hover:text-red-600" title="Delete"><ion-icon name="trash-outline" class="text-lg"></ion-icon></button>`; }, orderable: false, className: "text-center" }
                ],
                language: { search: "_INPUT_", searchPlaceholder: "Search patients...", lengthMenu: "Show _MENU_ entries" },
                drawCallback: function () { AOS.refreshHard(); }
            });
        }
    }
});