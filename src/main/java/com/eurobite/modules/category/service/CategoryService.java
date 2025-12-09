package com.eurobite.modules.category.service;

import com.eurobite.modules.category.entity.Category;
import com.eurobite.modules.category.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public void save(Category category) {
        categoryRepository.save(category);
    }

    @Transactional
    public void remove(Long id) {
        // TODO: Check if category is used by Dish or Setmeal
        categoryRepository.deleteById(id);
    }

    public List<Category> list(Integer type) {
        // If type is null, find all
        if (type != null) {
            // Since we don't have findByType in repo yet, let's add it or use Example
            // For now, just return all and filter (inefficient but ok for small list)
            // Better: Add method to Repo
            return categoryRepository.findAll().stream()
                    .filter(c -> c.getType().equals(type))
                    .toList();
        }
        return categoryRepository.findAll(Sort.by("sort").ascending());
    }
    
    public void update(Category category) {
        categoryRepository.save(category);
    }
}
