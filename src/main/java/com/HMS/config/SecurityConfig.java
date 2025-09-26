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

@Configuration
@EnableWebSecurity
public class SecurityConfig {

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
        http.authorizeHttpRequests(authorize -> authorize
                .requestMatchers("/", "/index", "/login", "/api/register", "/static/**", "/forms/**", "/perform_login").permitAll()
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
                .successHandler((request, response, authentication) -> {
                    String role = authentication.getAuthorities().iterator().next().getAuthority();
                    String redirectUrl = switch (role) {
                        case "ROLE_ADMIN" -> "/admin/dashboard";
                        case "ROLE_DOCTOR" -> "/doctor/dashboard";
                        case "ROLE_PATIENT" -> "/patient/dashboard";
                        case "ROLE_STAFF" -> "/staff/dashboard";
                        case "ROLE_PHARMACY" -> "/pharmacy/dashboard";
                        default -> "/";
                    };
                    response.sendRedirect(redirectUrl);
                })
                .failureHandler((_, response, _) -> {
                    response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                    response.getWriter().write("{\"success\": false, \"message\": \"Invalid credentials\"}");
                    response.setContentType("application/json");
                })
                .permitAll()
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/")
                .invalidateHttpSession(true)
                .deleteCookies("JSESSIONID")
            )
            .csrf(csrf -> csrf
                .ignoringRequestMatchers("/static/**", "/api/register", "/perform_login")
            )
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()));

        return http.build();
    }
}