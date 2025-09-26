/**
 * Web Application Configuration
 * 
 * General web application settings:
 * - Configures caching behavior for static resources
 * - Sets up resource handlers for different asset types
 * - Manages form template access
 * - Controls resource caching periods
 * - Implements fine-grained resource path mapping
 * - Configures proper MIME type mappings
 */
package com.hms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.http.MediaType;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    
    @Override
    public void configureContentNegotiation(@NonNull ContentNegotiationConfigurer configurer) {
        configurer
            .favorParameter(false)
            .ignoreAcceptHeader(false)
            .defaultContentType(MediaType.APPLICATION_JSON)
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
                .setCachePeriod(0); // No caching for forms

        // Additional static resource paths for direct CSS/JS access
        registry.addResourceHandler("/js/**")
                .addResourceLocations("classpath:/static/js/")
                .setCachePeriod(3600);

        registry.addResourceHandler("/css/**")
                .addResourceLocations("classpath:/static/css/")
                .setCachePeriod(3600);
    }
}