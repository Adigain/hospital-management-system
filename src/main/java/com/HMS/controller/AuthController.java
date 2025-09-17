package com.hms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.hms.model.User;
import com.hms.repository.UserRepository;

@Controller
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/register")
    public String showRegisterPage() {
        return "forms/patient-register";
    }
    
    // Add controller methods for different dashboards
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


    @PostMapping("/register")
    public String registerUser(@RequestParam String email, @RequestParam String password, @RequestParam String role) {
        if (userRepository.findByEmail(email) != null) {
            return "redirect:/register?error=email-exists";
        }
        
        User newUser = new User();
        newUser.setEmail(email);
        newUser.setPassword(passwordEncoder.encode(password));
        newUser.setRole(role.toUpperCase()); // Store roles in uppercase
        userRepository.save(newUser);
        
        return "redirect:/login"; // Redirect to login page after successful registration
    }
}