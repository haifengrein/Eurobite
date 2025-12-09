package com.eurobite.modules.dish.api;

import com.eurobite.common.exception.CustomException;
import com.eurobite.modules.dish.entity.Dish;
import com.eurobite.modules.dish.repository.DishRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
@RequiredArgsConstructor
public class DishModuleApiImpl implements DishModuleApi {

    private final DishRepository dishRepository;

    @Override
    public BigDecimal getCurrentPrice(Long dishId) {
        Dish dish = dishRepository.findById(dishId)
                .orElseThrow(() -> new CustomException("Dish not found"));
        if (dish.getStatus() != null && dish.getStatus() == 0) {
            throw new CustomException("Dish is not on sale");
        }
        return dish.getPrice();
    }
}

