package com.sanjay.spring_boot_rest.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import java.net.URI;

@Configuration
@Profile("prod")
public class ProductionConfiguration {
    public ProductionConfiguration(@Value("${app.frontend-origin}") String origin,
                                   @Value("${spring.datasource.url}") String database) {
        URI uri=URI.create(origin);
        if (!"https".equals(uri.getScheme()) || uri.getHost()==null || !uri.getHost().endsWith(".vercel.app"))
            throw new IllegalArgumentException("Production FRONTEND_ORIGIN must be the corresponding HTTPS Vercel domain");
        if (!database.startsWith("jdbc:postgresql://") || database.matches("(?i).*[?&](user|password)=.*")
            || database.contains("@") || database.matches("(?i).*[?&]sslmode=(disable|allow|prefer|require)(?:&.*)?$"))
            throw new IllegalArgumentException("Use a credential-free PostgreSQL JDBC URL with verify-full TLS");
    }
}
