package com.eurobite.modules.setmeal.dto;

import java.math.BigDecimal;
import java.util.List;

public record SetmealDTO(
    Long id,
    Long categoryId,
    String name,
    BigDecimal price,
    Integer status,
    String description,
    String image,
    List<SetmealDishDTO> setmealDishes
) {}
