package com.eurobite.modules.system.repository;

import com.eurobite.modules.system.entity.SystemConfig;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SystemConfigRepository extends JpaRepository<SystemConfig, Long> {
    Optional<SystemConfig> findByVariable(String variable);
}
