package com.eurobite.modules.setmeal.dto;

import java.math.BigDecimal;

public record SetmealDishDTO(
    Long dishId,
    String name,
    BigDecimal price,
    Integer copies
) {}
