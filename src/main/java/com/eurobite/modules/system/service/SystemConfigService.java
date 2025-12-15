package com.eurobite.modules.system.service;

import com.eurobite.modules.system.entity.SystemConfig;
import com.eurobite.modules.system.repository.SystemConfigRepository;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class SystemConfigService {

    private final SystemConfigRepository systemConfigRepository;

    @PostConstruct
    public void initDefaults() {
        // Initialize default settings if not exists
        initSetting("shop.name", "EuroBite Restaurant", "Shop Name");
        initSetting("shop.phone", "13800138000", "Contact Phone");
        initSetting("shop.address", "123 Food Street, Delicious City", "Shop Address");
        initSetting("shop.logo", "", "Shop Logo URL");
        initSetting("shop.description", "Best food in town!", "Shop Description");
        
        initSetting("business.status", "1", "1: Open, 0: Closed");
        initSetting("business.hours", "09:00 - 22:00", "Operating Hours");
        initSetting("delivery.fee", "5.00", "Delivery Fee");
        initSetting("delivery.minOrder", "20.00", "Minimum Order Amount");
        initSetting("delivery.time", "30", "Estimated Delivery Time (mins)");
    }

    private void initSetting(String variable, String defaultValue, String desc) {
        if (systemConfigRepository.findByVariable(variable).isEmpty()) {
            SystemConfig config = new SystemConfig();
            config.setVariable(variable);
            config.setValue(defaultValue);
            config.setDescription(desc);
            systemConfigRepository.save(config);
        }
    }

    public Map<String, String> getAllConfigs() {
        List<SystemConfig> list = systemConfigRepository.findAll();
        Map<String, String> map = new HashMap<>();
        list.forEach(config -> map.put(config.getVariable(), config.getValue()));
        return map;
    }

    @Transactional
    public void updateConfigs(Map<String, String> configs) {
        configs.forEach((key, value) -> {
            systemConfigRepository.findByVariable(key).ifPresent(config -> {
                config.setValue(value);
                systemConfigRepository.save(config);
            });
        });
    }
}
