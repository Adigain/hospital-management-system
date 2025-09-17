package com.hms.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addResourceHandlers(@NonNull ResourceHandlerRegistry registry) {
        // Map static resources including forms
        registry
            .addResourceHandler("/**", "/static/**")
            .addResourceLocations("classpath:/static/")
            .setCachePeriod(0);
    }
}