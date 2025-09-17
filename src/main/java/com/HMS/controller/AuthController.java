/**
 * Authentication Controller
 * 
 * This controller handles user authentication and registration functionality:
 * - User registration for all roles (Admin, Doctor, Patient, Staff, Pharmacy)
 * - Handles registration form submissions
 * - Validates user credentials
 * - Manages user creation in the database
 * - Provides REST endpoints for authentication operations
 */
package com.hms.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

import com.hms.model.User;
import com.hms.repository.UserRepository;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;



    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestParam String email, 
                                        @RequestParam String password,
                                        @RequestParam String name,
                                        @RequestParam String role) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (userRepository.findByEmail(email) != null) {
                response.put("success", false);
                response.put("message", "Email already exists");
                return ResponseEntity.badRequest().body(response);
            }
            
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setPassword(passwordEncoder.encode(password));
            newUser.setFullName(name);
            newUser.setRole(role.toUpperCase()); // Store roles in uppercase
            userRepository.save(newUser);
            
            response.put("success", true);
            response.put("message", "Registration successful");
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "Registration failed: " + e.getMessage());
            return ResponseEntity.internalServerError().body(response);
        }
    }
}