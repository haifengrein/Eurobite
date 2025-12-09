package com.eurobite.common.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@Configuration
@EnableJpaAuditing
public class JpaConfig {
    // We will add AuditorAware bean here later in Phase 2 when we have Security context
}
