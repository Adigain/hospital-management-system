/**
 * View Controller
 * 
 * Handles view-related operations:
 * - Maps URLs to view templates
 * - Manages page navigation
 * - Renders role-specific dashboards
 * - Handles view-specific logic
 * - Controls access to different UI pages
 */
package com.hms.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {

    @GetMapping("/register")
    public String showRegisterPage() {
        return "forms/patient-register";
    }
    
    @GetMapping("/admin/dashboard")
    public String adminDashboard() {
        return "admin/admin-dashboard";
    }
    
    @GetMapping("/doctor/dashboard")
    public String doctorDashboard() {
        return "doctor/doctor-index";
    }
    
    @GetMapping("/patient/dashboard")
    public String patientDashboard() {
        return "patient/patient-index";
    }
    
    @GetMapping("/general-staff/dashboard")
    public String staffDashboard() {
        return "generel-staff/staff-index";
    }
    
    @GetMapping("/pharmacy-staff/dashboard")
    public String pharmacyDashboard() {
        return "pharmacy-staff/pharmacy-staff-index";
    }
}