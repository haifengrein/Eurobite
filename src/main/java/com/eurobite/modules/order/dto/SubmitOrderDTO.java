package com.eurobite.modules.order.dto;

import com.fasterxml.jackson.annotation.JsonAlias;

public record SubmitOrderDTO(
    @JsonAlias("addressId")
    Long addressBookId,
    Integer payMethod,
    String remark
) {}