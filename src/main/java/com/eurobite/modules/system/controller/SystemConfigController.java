package com.eurobite.modules.system.controller;

import com.eurobite.common.model.R;
import com.eurobite.modules.system.service.SystemConfigService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/system/config")
@RequiredArgsConstructor
@Tag(name = "System Settings", description = "Shop and Business Configs")
public class SystemConfigController {

    private final SystemConfigService systemConfigService;

    @GetMapping
    @Operation(summary = "Get All Configs")
    public R<Map<String, String>> getAll() {
        return R.success(systemConfigService.getAllConfigs());
    }

    @PostMapping
    @Operation(summary = "Update Configs")
    public R<String> update(@RequestBody Map<String, String> configs) {
        systemConfigService.updateConfigs(configs);
        return R.success("Settings updated");
    }
}
