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
import org.springframework.web.bind.annotation.RequestHeader;


@Controller
public class ViewController {

    @GetMapping("/register")
    public String showRegisterPage() {
        return "forms/patient-register";
    }

    @GetMapping({ "/admin/admin-dashboard"})
    public String adminDashboard() {
        return "admin/admin-dashboard";
    }

    @GetMapping("/admin/patients")
    public String adminPatientsPage(@RequestHeader(value = "X-Requested-With", required = false) String requestedWith) {
        if ("XMLHttpRequest".equals(requestedWith)) {
            return "admin/patients :: #patients";
        }
        return "admin/admin-dashboard";
    }

    @GetMapping("/admin/doctors")
    public String adminDoctorsPage(@RequestHeader(value = "X-Requested-With", required = false) String requestedWith) {
        if ("XMLHttpRequest".equals(requestedWith)) {
            return "admin/doctors :: #doctors";
        }
        return "admin/admin-dashboard";
    }

    @GetMapping("/admin/appointments")
    public String adminAppointmentsPage(@RequestHeader(value = "X-Requested-With", required = false) String requestedWith) {
        if ("XMLHttpRequest".equals(requestedWith)) {
            return "admin/appointments :: #appointments";
        }
        return "admin/admin-dashboard";
    }

    @GetMapping("/admin/billing")
    public String adminBillingPage(@RequestHeader(value = "X-Requested-With", required = false) String requestedWith) {
        if ("XMLHttpRequest".equals(requestedWith)) {
            return "admin/billing :: #billing";
        }
        return "admin/admin-dashboard";
    }

    @GetMapping("/admin/pharmacy")
    public String adminPharmacyPage(@RequestHeader(value = "X-Requested-With", required = false) String requestedWith) {
        if ("XMLHttpRequest".equals(requestedWith)) {
            return "admin/pharmacy :: #pharmacy";
        }
        return "admin/admin-dashboard";
    }

    @GetMapping("/admin/records")
    public String adminRecordsPage(@RequestHeader(value = "X-Requested-With", required = false) String requestedWith) {
        if ("XMLHttpRequest".equals(requestedWith)) {
            return "admin/records :: #records";
        }
        return "admin/admin-dashboard";
    }

    @GetMapping("/admin/staff")
    public String adminStaffPage(@RequestHeader(value = "X-Requested-With", required = false) String requestedWith) {
        if ("XMLHttpRequest".equals(requestedWith)) {
            return "admin/staff :: #staff";
        }
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
    
    @GetMapping("/staff/dashboard")
    public String staffDashboard() {
        return "general-staff/staff-index";
    }
    
    @GetMapping("/pharmacy/dashboard")
    public String pharmacyDashboard() {
        return "pharmacy-staff/pharmacy-staff-index";
    }
}