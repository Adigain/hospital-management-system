/**
 * Spring MVC Configuration
 * 
 * Configures Spring MVC behavior:
 * - Sets up static resource handling
 * - Maps resource paths to physical locations
 * - Configures access to template files
 * - Manages static asset serving (CSS, JS, images)
 * - Implements WebMvcConfigurer for custom MVC configuration
 */
package com.hms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/templates/**")
                .addResourceLocations("classpath:/templates/");
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/");
    }
}