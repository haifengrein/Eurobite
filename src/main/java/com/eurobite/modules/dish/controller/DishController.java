package com.eurobite.modules.dish.controller;

import com.eurobite.common.model.R;
import com.eurobite.modules.dish.dto.DishDTO;
import com.eurobite.modules.dish.service.DishService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/dish")
@RequiredArgsConstructor
@Tag(name = "Dish Management")
public class DishController {

    private final DishService dishService;

    @GetMapping("/list")
    @Operation(summary = "List Dishes By Category")
    public R<List<DishDTO>> list(@RequestParam(required = false) Long categoryId) {
        return R.success(dishService.listByCategory(categoryId));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Dish By ID")
    public R<DishDTO> getById(@PathVariable Long id) {
        return R.success(dishService.getById(id));
    }
}
