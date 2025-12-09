package com.eurobite.modules.setmeal.mapper;

import com.eurobite.modules.setmeal.dto.SetmealDTO;
import com.eurobite.modules.setmeal.dto.SetmealDishDTO;
import com.eurobite.modules.setmeal.entity.Setmeal;
import com.eurobite.modules.setmeal.entity.SetmealDish;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface SetmealMapper {
    Setmeal toEntity(SetmealDTO dto);
    SetmealDTO toDTO(Setmeal entity);
    
    SetmealDish toDishEntity(SetmealDishDTO dto);
    SetmealDishDTO toDishDTO(SetmealDish entity);
}
