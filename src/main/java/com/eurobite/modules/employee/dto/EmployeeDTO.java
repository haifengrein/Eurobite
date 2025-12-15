package com.eurobite.modules.employee.dto;

import java.time.LocalDateTime;

public record EmployeeDTO(
    Long id,
    String username,
    String name,
    String phone,
    String sex,
    Integer status,
    String role, // ADMIN, CHEF, STAFF
    LocalDateTime createTime,
    LocalDateTime updateTime
) {}
