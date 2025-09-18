package com.example.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * Database configuration for JPA and transaction management.
 * Enables JPA auditing for automatic timestamp management and transaction support.
 */
@Configuration
@EnableJpaAuditing
@EnableTransactionManagement
public class DatabaseConfig {
    
    // Additional database configuration can be added here if needed
    // For example: custom data source configuration, connection pooling, etc.
}
