/**
 * Web Application Configuration
 * 
 * General web application settings:
 * - Configures caching behavior for static resources
 * - Sets up resource handlers for different asset types
 * - Manages form template access
 * - Controls resource caching periods
 * - Implements fine-grained resource path mapping
 */
package com.hms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Static resources (CSS, JS, images)
        registry
            .addResourceHandler("/static/**")
            .addResourceLocations("classpath:/static/")
            .setCachePeriod(0);

        // Form resources
        registry
            .addResourceHandler("/static/forms/**")
            .addResourceLocations("classpath:/static/forms/")
            .setCachePeriod(0);
    }
}