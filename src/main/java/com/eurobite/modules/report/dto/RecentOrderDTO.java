package com.eurobite.modules.report.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record RecentOrderDTO(
    Long id,
    String orderNumber,
    String userName,
    BigDecimal amount,
    LocalDateTime orderTime,
    Integer status
) {}
