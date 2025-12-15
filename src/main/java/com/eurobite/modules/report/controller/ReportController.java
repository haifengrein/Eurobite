package com.eurobite.modules.report.controller;

import com.eurobite.common.model.R;
import com.eurobite.modules.report.dto.DashboardDataDTO;
import com.eurobite.modules.report.service.ReportService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/report")
@RequiredArgsConstructor
@Tag(name = "Report Statistics", description = "Dashboard Data")
public class ReportController {

    private final ReportService reportService;

    @GetMapping("/dashboard")
    @Operation(summary = "Get Dashboard Data")
    public R<DashboardDataDTO> getDashboardData() {
        return R.success(reportService.getDashboardData());
    }
}
