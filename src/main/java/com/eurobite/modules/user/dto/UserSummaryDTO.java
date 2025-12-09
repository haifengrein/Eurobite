package com.eurobite.modules.user.dto;

public record UserSummaryDTO(
    Long id,
    String username,
    String phone,
    Integer status
) {}

