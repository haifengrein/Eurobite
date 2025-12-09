package com.eurobite.modules.dish.mapper;

import com.eurobite.modules.dish.dto.DishDTO;
import com.eurobite.modules.dish.dto.DishFlavorDTO;
import com.eurobite.modules.dish.entity.Dish;
import com.eurobite.modules.dish.entity.DishFlavor;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingConstants;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface DishMapper {
    Dish toEntity(DishDTO dto);
    DishDTO toDTO(Dish entity);
    
    DishFlavor toFlavorEntity(DishFlavorDTO dto);
    DishFlavorDTO toFlavorDTO(DishFlavor entity);

    @Mapping(target = "flavors", ignore = true)
    void updateDishFromDTO(DishDTO dto, @MappingTarget Dish entity);
}
