package com.eurobite.modules.employee.dto;

import java.time.LocalDateTime;

public record EmployeeDTO(
    Long id,
    String username,
    String name,
    String phone,
    String sex,
    String idNumber,
    Integer status,
    LocalDateTime createTime,
    LocalDateTime updateTime
) {}
