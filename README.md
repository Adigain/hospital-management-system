# Hospital Management System (HMS)

A comprehensive web-based Hospital Management System built with Spring Boot and modern web technologies. This system helps hospitals digitize and streamline their operations including patient management, appointments, billing, and pharmacy services.

## Features

- **Multi-Role Access**
  - Admin Dashboard
  - Doctor Portal
  - Patient Portal
  - General Staff Interface
  - Pharmacy Staff Portal

- **Core Functionalities**
  - Patient Registration and Management
  - Appointment Scheduling
  - Medical Records Management
  - Billing and Invoicing
  - Pharmacy Management
  - Staff Management
  - Real-time Analytics Dashboard

## Tech Stack

- **Backend**
  - Java 17
  - Spring Boot
  - Spring Security
  - Spring MVC
  - JPA/Hibernate
  - MySQL Database

- **Frontend**
  - HTML5/CSS3
  - JavaScript
  - Chart.js for Analytics
  - FullCalendar for Appointments
  - DataTables for Data Management
  - Tailwind CSS for Styling

## Prerequisites

- JDK 17 or higher
- Maven 3.6+
- MySQL 8.0+
- Modern web browser (Chrome, Firefox, Safari, Edge)

## Setup and Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Adigain/hospital-management-system.git
   cd hospital-management-system
   ```

2. **Configure Database**
   - Create a MySQL database
   - Update `src/main/resources/application.properties` with your database credentials

3. **Build and Run**

   There are multiple ways to run this application:

   **Using Maven Wrapper (Recommended)**
   ```bash
   # Build the project
   ./mvnw clean install

   # Run the application
   ./mvnw spring-boot:run
   ```

   
4. **Access the Application**
   - Open `http://localhost:8080` in your web browser
   - Default admin credentials:
     - Username: none
     - Password: none

## Project Structure

```
src/
├── main/
│   ├── java/com/hms/
│   │   ├── config/        # Configuration classes
│   │   ├── controller/    # MVC Controllers
│   │   ├── model/         # Entity classes
│   │   ├── repository/    # Data access layer
│   │   └── service/       # Business logic
│   └── resources/
│       ├── static/        # CSS, JS, and other assets
│       └── templates/     # HTML templates
```

## Key Features in Detail

### 1. Dashboard

- Real-time statistics and analytics
- Patient admission trends
- Department-wise distribution
- Quick access to key functions

### 2. Patient Management

- Complete patient history
- Medical records management
- Appointment tracking
- Billing history

### 3. Appointment System

- Interactive calendar interface
- Multiple view options (day/week/month)
- Quick appointment scheduling
- Conflict detection

### 4. Billing System

- Generate invoices
- Payment tracking
- Insurance integration
- Financial reporting

### 5. Pharmacy Management

- Inventory tracking
- Prescription management
- Stock alerts
- Sales reporting

## Security

The application implements comprehensive security measures:

- Role-based access control
- Password encryption
- Session management
- CSRF protection
- Secure communication

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Spring Boot team for the excellent framework
- Contributors and testers
- Open source community for various tools and libraries used

## Support

For support and queries, please open an issue in the GitHub repository or contact the maintainers directly.