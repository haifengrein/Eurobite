package com.eurobite.modules.category.service;

import com.eurobite.common.test.AbstractIntegrationTest;
import com.eurobite.modules.category.entity.Category;
import com.eurobite.modules.category.repository.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

@Transactional
class CategoryServiceTest extends AbstractIntegrationTest {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private CategoryService categoryService;

    @Test
    void testSaveAndList() {
        Category c1 = new Category();
        c1.setName("Drinks");
        c1.setType(1);
        c1.setSort(1);
        categoryService.save(c1);

        List<Category> list = categoryRepository.findAll();
        assertThat(list).hasSize(1);
        assertThat(list.get(0).getName()).isEqualTo("Drinks");
    }

    @Test
    void testDelete() {
        Category c1 = new Category();
        c1.setName("Snacks");
        c1.setType(1);
        categoryRepository.save(c1);

        categoryService.remove(c1.getId());
        assertThat(categoryRepository.count()).isEqualTo(0);
    }
    
    // TODO: Test delete failure when linked to Dish/Setmeal (Phase 4/5)
}
