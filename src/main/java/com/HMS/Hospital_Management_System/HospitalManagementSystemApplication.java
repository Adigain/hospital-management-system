/**
 * Main Application Entry Point
 * 
 * Core application configuration and bootstrap:
 * - Spring Boot application entry point
 * - Component scanning configuration
 * - JPA repository enablement
 * - Entity scanning setup
 * - Application startup and initialization
 */
package com.hms.hospital_management_system;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@SpringBootApplication
@ComponentScan(basePackages = "com.hms")
@EntityScan(basePackages = "com.hms.model")
@EnableJpaRepositories(basePackages = "com.hms.repository")
public class HospitalManagementSystemApplication {

	public static void main(String[] args) {
		SpringApplication.run(HospitalManagementSystemApplication.class, args);
	}

}
