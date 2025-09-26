/**
 * Security Configuration
 * 
 * Core security configuration for the Hospital Management System:
 * - Configures Spring Security
 * - Sets up authentication provider
 * - Defines URL-based security rules
 * - Manages password encoding
 * - Handles authorization for different user roles
 * - Configures CSRF protection
 * - Sets up login/logout behavior
 */
package com.hms.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.AuthenticationFailureHandler;
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private static final Logger logger = LoggerFactory.getLogger(SecurityConfig.class);

    @Autowired
    private UserDetailsService userDetailsService;

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        @SuppressWarnings("deprecation")
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService); // Deprecated, but required for compatibility
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http.authenticationProvider(authenticationProvider()) // Register the authentication provider
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/", "/index", "/login", "/api/register", "/css/**", "/js/**", "/images/**", "/static/**", "/forms/**", "/perform_login", "/error").permitAll()
                .requestMatchers("/style.css", "/dashboard.js", "/login-register.js").permitAll() // Added login-register.js
                .requestMatchers("/static/forms/**", "/static/css/**", "/static/js/**").permitAll() // Expanded static paths
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/doctor/**").hasRole("DOCTOR")
                .requestMatchers("/patient/**").hasRole("PATIENT")
                .requestMatchers("/staff/**").hasRole("STAFF")
                .requestMatchers("/pharmacy/**").hasRole("PHARMACY")
                .anyRequest().authenticated()
            )
            .formLogin(login -> login
                .loginPage("/")
                .loginProcessingUrl("/perform_login")
                .defaultSuccessUrl("/admin/admin-dashboard", false) // Set default success URL
                .successHandler((request, response, authentication) -> {
                    String role = authentication.getAuthorities().iterator().next().getAuthority();
                    String redirectUrl = switch (role) {
                        case "ROLE_ADMIN" -> "/admin/admin-dashboard";
                        case "ROLE_DOCTOR" -> "/doctor/dashboard";
                        case "ROLE_PATIENT" -> "/patient/dashboard";
                        case "ROLE_STAFF" -> "/staff/dashboard";
                        case "ROLE_PHARMACY" -> "/pharmacy/dashboard";
                        default -> "/";
                    };
                    response.sendRedirect(request.getContextPath() + redirectUrl);
                })
                .failureHandler((request, response, exception) -> {
                    // log exception details for debugging
                    logger.warn("Authentication failed: {}", exception.getMessage());
                    if (logger.isDebugEnabled()) {
                        logger.debug("Full authentication failure stacktrace", exception);
                    }
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.setContentType("application/json");
                    response.getWriter().write("{\"success\": false, \"message\": \"Invalid credentials\"}");
                })
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
                .invalidateHttpSession(true)
                .clearAuthentication(true)
                .deleteCookies("JSESSIONID")
            )
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/api/register", "/perform_login")
            )
            .headers(headers -> headers
                .frameOptions(frame -> frame.sameOrigin())
                .xssProtection(xss -> xss.disable()));

        return http.build();
    }
}