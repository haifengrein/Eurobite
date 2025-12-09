package com.eurobite.modules.dish.dto;

import java.math.BigDecimal;
import java.util.List;

public record DishDTO(
    Long id,
    String name,
    Long categoryId,
    BigDecimal price,
    String code,
    String image,
    String description,
    Integer status,
    Integer sort,
    List<DishFlavorDTO> flavors
) {}
