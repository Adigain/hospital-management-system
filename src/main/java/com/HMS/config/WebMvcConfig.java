/**
 * Spring MVC Configuration
 * 
 * Configures Spring MVC behavior:
 * - Sets up static resource handling
 * - Maps resource paths to physical locations
 * - Configures access to template files
 * - Manages static asset serving (CSS, JS, images)
 * - Implements WebMvcConfigurer for custom MVC configuration
 * - Handles proper MIME type configuration
 * - Configures Spring Security Thymeleaf integration
 */
package com.hms.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.lang.NonNull;
import org.thymeleaf.extras.springsecurity6.dialect.SpringSecurityDialect;

@Configuration
public class WebMvcConfig implements WebMvcConfigurer {

    @Bean
    public SpringSecurityDialect springSecurityDialect() {
        return new SpringSecurityDialect();
    }

    @Override
    public void configureContentNegotiation(@NonNull ContentNegotiationConfigurer configurer) {
        configurer
            .favorParameter(false)
            .ignoreAcceptHeader(false)
            .defaultContentType(MediaType.TEXT_HTML)
            .mediaType("html", MediaType.TEXT_HTML)
            .mediaType("js", MediaType.valueOf("application/javascript"))
            .mediaType("css", MediaType.valueOf("text/css"))
            .mediaType("json", MediaType.APPLICATION_JSON);
    }

        @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Static resources (CSS, JS, images)
        registry.addResourceHandler("/static/**")
                .addResourceLocations("classpath:/static/")
                .setCachePeriod(3600); // 1 hour cache

        // Form resources with specific handling
        registry.addResourceHandler("/static/forms/**")
                .addResourceLocations("classpath:/static/forms/")
                .setCachePeriod(0) // No caching for forms
                .resourceChain(false); // Disable resource chain to allow direct access

        // CSS and JS specific handlers
        registry.addResourceHandler("/css/**", "/js/**")
                .addResourceLocations("classpath:/static/css/", "classpath:/static/js/")
                .setCachePeriod(3600);

        registry.addResourceHandler("/images/**")
                .addResourceLocations("classpath:/static/images/")
                .setCachePeriod(3600);
}
}