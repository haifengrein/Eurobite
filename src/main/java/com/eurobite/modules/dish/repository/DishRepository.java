package com.eurobite.modules.dish.repository;

import com.eurobite.modules.dish.entity.Dish;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DishRepository extends JpaRepository<Dish, Long> {

    List<Dish> findByCategoryId(Long categoryId);
}
