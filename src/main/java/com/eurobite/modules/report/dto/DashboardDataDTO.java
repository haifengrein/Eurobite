package com.eurobite.modules.report.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;
import java.util.List;

public record DashboardDataDTO(
    @JsonProperty("totalRevenue") BigDecimal totalRevenue,
    @JsonProperty("totalOrders") long totalOrders,
    @JsonProperty("totalCustomers") long totalCustomers,
    @JsonProperty("avgOrderValue") BigDecimal avgOrderValue,
    @JsonProperty("recentOrders") List<RecentOrderDTO> recentOrders
) {}
