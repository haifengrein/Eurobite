package com.eurobite.modules.dish.service;

import com.eurobite.modules.dish.dto.DishDTO;
import com.eurobite.modules.dish.entity.Dish;
import com.eurobite.modules.dish.entity.DishFlavor;
import com.eurobite.modules.dish.mapper.DishMapper;
import com.eurobite.modules.dish.repository.DishRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DishService {

    private final DishRepository dishRepository;
    private final DishMapper dishMapper;

    @Transactional
    @CacheEvict(cacheNames = "menu", allEntries = true)
    public void saveWithFlavor(DishDTO dishDTO) {
        Dish dish = dishMapper.toEntity(dishDTO);

        if (dishDTO.flavors() != null) {
            List<DishFlavor> flavors = dishDTO.flavors().stream()
                    .map(dishMapper::toFlavorEntity)
                    .peek(flavor -> flavor.setDish(dish))
                    .collect(Collectors.toList());
            dish.setFlavors(flavors);
        }

        dishRepository.save(dish);
    }

    @Transactional
    @CacheEvict(cacheNames = {"menu", "dish"}, allEntries = true)
    public void updateWithFlavor(DishDTO dishDTO) {
        Dish dish = dishRepository.findById(dishDTO.id())
                .orElseThrow(() -> new IllegalArgumentException("Dish not found"));

        dishMapper.updateDishFromDTO(dishDTO, dish);

        dish.getFlavors().clear();
        if (dishDTO.flavors() != null) {
            List<DishFlavor> newFlavors = dishDTO.flavors().stream()
                    .map(dishMapper::toFlavorEntity)
                    .peek(flavor -> flavor.setDish(dish))
                    .collect(Collectors.toList());
            dish.getFlavors().addAll(newFlavors);
        }
        
        dishRepository.save(dish);
    }

    @Transactional(readOnly = true)
    public org.springframework.data.domain.Page<DishDTO> pageQuery(int page, int pageSize, String name) {
        org.springframework.data.domain.Pageable pageable = org.springframework.data.domain.PageRequest.of(page - 1, pageSize, org.springframework.data.domain.Sort.by("updateTime").descending());
        // Simple findAll for now. Ideally use Specification for name filter
        org.springframework.data.domain.Page<Dish> result = dishRepository.findAll(pageable); 
        return result.map(dishMapper::toDTO);
    }

    @Transactional
    @CacheEvict(cacheNames = {"menu", "dish", "dishList"}, allEntries = true)
    public void deleteBatch(List<Long> ids) {
        // TODO: Check if dish is in a setmeal
        dishRepository.deleteAllById(ids);
    }

    @Transactional
    @CacheEvict(cacheNames = {"menu", "dish", "dishList"}, allEntries = true)
    public void updateStatus(Integer status, List<Long> ids) {
        List<Dish> dishes = dishRepository.findAllById(ids);
        dishes.forEach(dish -> dish.setStatus(status));
        dishRepository.saveAll(dishes);
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "dish", key = "#id")
    public DishDTO getById(Long id) {
        Dish dish = dishRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Dish not found"));
        return dishMapper.toDTO(dish);
    }

    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "dishList", key = "#categoryId")
    public List<DishDTO> listByCategory(Long categoryId) {
        List<Dish> dishes;
        if (categoryId != null) {
            dishes = dishRepository.findByCategoryId(categoryId);
        } else {
            dishes = dishRepository.findAll();
        }
        return dishes.stream()
                .map(dishMapper::toDTO)
                .collect(Collectors.toList());
    }
}
