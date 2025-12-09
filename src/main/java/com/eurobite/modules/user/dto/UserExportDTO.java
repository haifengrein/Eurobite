package com.eurobite.modules.user.dto;

import java.util.List;

public record UserExportDTO(
    UserSummaryDTO user,
    List<UserExportDTO.AddressDTO> addresses
) {
    public record AddressDTO(
        Long id,
        String consignee,
        String phone,
        String detail,
        Boolean isDefault
    ) {}
}

