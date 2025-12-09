package com.eurobite.modules.dish.api;

import com.eurobite.common.exception.CustomException;
import com.eurobite.modules.dish.entity.Dish;
import com.eurobite.modules.dish.repository.DishRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class DishModuleApiImplTest {

    @Mock
    private DishRepository dishRepository;

    @InjectMocks
    private DishModuleApiImpl dishModuleApi;

    @Test
    void testGetCurrentPrice_Success() {
        Dish dish = new Dish();
        dish.setId(1L);
        dish.setStatus(1);
        dish.setPrice(BigDecimal.valueOf(12.5));
        when(dishRepository.findById(1L)).thenReturn(Optional.of(dish));

        BigDecimal price = dishModuleApi.getCurrentPrice(1L);
        assertEquals(BigDecimal.valueOf(12.5), price);
    }

    @Test
    void testGetCurrentPrice_DishNotFound() {
        when(dishRepository.findById(99L)).thenReturn(Optional.empty());
        assertThrows(CustomException.class, () -> dishModuleApi.getCurrentPrice(99L));
    }

    @Test
    void testGetCurrentPrice_DishNotOnSale() {
        Dish dish = new Dish();
        dish.setId(2L);
        dish.setStatus(0); // off sale
        dish.setPrice(BigDecimal.TEN);
        when(dishRepository.findById(2L)).thenReturn(Optional.of(dish));

        assertThrows(CustomException.class, () -> dishModuleApi.getCurrentPrice(2L));
    }
}

