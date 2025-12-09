package com.eurobite.modules.dish.repository;

import com.eurobite.modules.dish.entity.DishFlavor;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DishFlavorRepository extends JpaRepository<DishFlavor, Long> {
}
