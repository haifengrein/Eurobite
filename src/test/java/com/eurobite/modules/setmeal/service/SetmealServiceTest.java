package com.eurobite.modules.setmeal.service;

import com.eurobite.common.test.AbstractIntegrationTest;
import com.eurobite.modules.setmeal.dto.SetmealDTO;
import com.eurobite.modules.setmeal.dto.SetmealDishDTO;
import com.eurobite.modules.setmeal.entity.Setmeal;
import com.eurobite.modules.setmeal.repository.SetmealRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Transactional
class SetmealServiceTest extends AbstractIntegrationTest {

    @Autowired
    private SetmealService setmealService;

    @Autowired
    private SetmealRepository setmealRepository;

    @Test
    void testSaveWithDish() {
        SetmealDishDTO d1 = new SetmealDishDTO(100L, "Burger", BigDecimal.valueOf(10), 1);
        SetmealDTO dto = new SetmealDTO(
                null, 1L, "Family Combo", BigDecimal.valueOf(50), 1, "desc", "img",
                List.of(d1)
        );

        setmealService.saveWithDish(dto);

        List<Setmeal> list = setmealRepository.findAll();
        assertThat(list).hasSize(1);
        assertThat(list.get(0).getSetmealDishes()).hasSize(1);
        assertThat(list.get(0).getSetmealDishes().get(0).getName()).isEqualTo("Burger");
    }

    @Test
    void testRemoveWithDish() {
        // 1. Prepare Data
        SetmealDishDTO d1 = new SetmealDishDTO(100L, "Burger", BigDecimal.valueOf(10), 1);
        SetmealDTO dto = new SetmealDTO(
                null, 1L, "Combo To Delete", BigDecimal.valueOf(20), 1, "desc", "img",
                List.of(d1)
        );
        setmealService.saveWithDish(dto);
        Long id = setmealRepository.findAll().get(0).getId();

        // 2. Execute Delete
        setmealService.removeWithDish(List.of(id));

        // 3. Verify
        assertThat(setmealRepository.findById(id)).isEmpty();
        // Ideally we check SetmealDish table too, but JPA cascade handles it. 
        // Since we use @Transactional, repo.count() might still see changes in persistence context cache?
        // But deleteById triggers flush usually.
        assertThat(setmealRepository.count()).isEqualTo(0);
    }

    @Test
    void testGetById() {
        SetmealDishDTO d1 = new SetmealDishDTO(100L, "Burger", BigDecimal.valueOf(10), 1);
        SetmealDTO dto = new SetmealDTO(
                null, 1L, "Combo-Get", BigDecimal.valueOf(30), 1, "desc", "img",
                List.of(d1)
        );
        setmealService.saveWithDish(dto);
        Long id = setmealRepository.findAll().get(0).getId();

        SetmealDTO fetched = setmealService.getById(id);
        assertThat(fetched.name()).isEqualTo("Combo-Get");
        assertThat(fetched.setmealDishes()).hasSize(1);
    }

    @Test
    void testUpdateWithDish_ReplacesDishes() {
        // 1. Save original
        SetmealDishDTO d1 = new SetmealDishDTO(100L, "Burger", BigDecimal.valueOf(10), 1);
        SetmealDTO dto = new SetmealDTO(
                null, 1L, "Combo-Update", BigDecimal.valueOf(20), 1, "desc", "img",
                List.of(d1)
        );
        setmealService.saveWithDish(dto);
        Long id = setmealRepository.findAll().get(0).getId();

        // 2. Update with different dishes
        SetmealDishDTO d2 = new SetmealDishDTO(200L, "Fries", BigDecimal.valueOf(5), 2);
        SetmealDTO updated = new SetmealDTO(
                id, 2L, "Combo-Updated", BigDecimal.valueOf(25), 0, "new-desc", "new-img",
                List.of(d2)
        );
        setmealService.updateWithDish(updated);

        Setmeal reloaded = setmealRepository.findById(id).orElseThrow();
        assertThat(reloaded.getName()).isEqualTo("Combo-Updated");
        assertThat(reloaded.getCategoryId()).isEqualTo(2L);
        assertThat(reloaded.getSetmealDishes()).hasSize(1);
        assertThat(reloaded.getSetmealDishes().get(0).getDishId()).isEqualTo(200L);
    }
}
