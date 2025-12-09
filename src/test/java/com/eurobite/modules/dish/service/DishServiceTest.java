package com.eurobite.modules.dish.service;

import com.eurobite.common.test.AbstractIntegrationTest;
import com.eurobite.modules.dish.dto.DishDTO;
import com.eurobite.modules.dish.dto.DishFlavorDTO;
import com.eurobite.modules.dish.entity.Dish;
import com.eurobite.modules.dish.repository.DishFlavorRepository;
import com.eurobite.modules.dish.repository.DishRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Transactional
class DishServiceTest extends AbstractIntegrationTest {

    @Autowired
    private DishService dishService;

    @Autowired
    private DishRepository dishRepository;
    
    @Autowired
    private DishFlavorRepository dishFlavorRepository;

    @Test
    void testSaveWithFlavor() {
        DishFlavorDTO f1 = new DishFlavorDTO("Spicy", "High");
        DishDTO dishDTO = new DishDTO(
                null, "Spicy Burger", 1L, BigDecimal.valueOf(10.5),
                "code123", "img.jpg", "desc", 1, 1,
                List.of(f1)
        );

        dishService.saveWithFlavor(dishDTO);

        Dish saved = dishRepository.findAll().get(0);
        assertThat(saved.getName()).isEqualTo("Spicy Burger");
        assertThat(saved.getFlavors()).hasSize(1);
        assertThat(saved.getFlavors().get(0).getName()).isEqualTo("Spicy");
    }

    @Test
    void testSaveWithMultipleFlavors() {
        DishFlavorDTO f1 = new DishFlavorDTO("Spicy", "Medium");
        DishFlavorDTO f2 = new DishFlavorDTO("Salt", "Less");
        DishDTO dishDTO = new DishDTO(
                null, "Multi Flavor Dish", 2L, BigDecimal.valueOf(20),
                "code456", "img2.jpg", "desc2", 1, 2,
                List.of(f1, f2)
        );

        dishService.saveWithFlavor(dishDTO);

        Dish saved = dishRepository.findAll().get(0);
        assertThat(saved.getFlavors()).hasSize(2);
        assertThat(saved.getFlavors())
                .extracting("name")
                .containsExactlyInAnyOrder("Spicy", "Salt");
    }

    @Test
    void testGetByIdUsesMapping() {
        DishFlavorDTO f1 = new DishFlavorDTO("Spicy", "High");
        DishDTO dishDTO = new DishDTO(
                null, "Cached Dish", 3L, BigDecimal.valueOf(15),
                "code789", "img3.jpg", "desc3", 1, 3,
                List.of(f1)
        );
        dishService.saveWithFlavor(dishDTO);

        Long id = dishRepository.findAll().get(0).getId();
        DishDTO fetched = dishService.getById(id);

        assertThat(fetched.name()).isEqualTo("Cached Dish");
        assertThat(fetched.flavors()).hasSize(1);
    }

    @Test
    void testUpdateWithFlavor() {
        // 1. Prepare initial data
        DishFlavorDTO f1 = new DishFlavorDTO("Spicy", "High");
        DishDTO initialDTO = new DishDTO(
                null, "Original Dish", 4L, BigDecimal.valueOf(100),
                "codeUpdate", "imgOriginal.jpg", "descOriginal", 1, 4,
                List.of(f1)
        );
        dishService.saveWithFlavor(initialDTO);
        
        Dish savedDish = dishRepository.findAll().stream()
                .filter(d -> d.getName().equals("Original Dish"))
                .findFirst().orElseThrow();
        Long dishId = savedDish.getId();

        // 2. Prepare Update DTO (Change Name, Change Flavor)
        DishFlavorDTO fNew = new DishFlavorDTO("Sweet", "Less");
        DishDTO updateDTO = new DishDTO(
                dishId, "Updated Dish", 4L, BigDecimal.valueOf(150),
                "codeUpdate", "imgUpdated.jpg", "descUpdated", 1, 4,
                List.of(fNew)
        );

        // 3. Execute Update
        dishService.updateWithFlavor(updateDTO);

        // 4. Verify
        Dish updated = dishRepository.findById(dishId).orElseThrow();
        assertThat(updated.getName()).isEqualTo("Updated Dish");
        assertThat(updated.getPrice()).isEqualByComparingTo(BigDecimal.valueOf(150));
        
        // Verify Flavors replaced
        assertThat(updated.getFlavors()).hasSize(1);
        assertThat(updated.getFlavors().get(0).getName()).isEqualTo("Sweet");
    }
}
