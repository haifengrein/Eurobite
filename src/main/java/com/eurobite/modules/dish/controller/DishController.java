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

    @PostMapping
    @Operation(summary = "Add Dish")
    public R<String> save(@RequestBody DishDTO dishDTO) {
        dishService.saveWithFlavor(dishDTO);
        return R.success("Dish added successfully");
    }

    @GetMapping("/page")
    @Operation(summary = "Page Query")
    public R<org.springframework.data.domain.Page<DishDTO>> page(int page, int pageSize, String name) {
        return R.success(dishService.pageQuery(page, pageSize, name));
    }

    @PutMapping
    @Operation(summary = "Update Dish")
    public R<String> update(@RequestBody DishDTO dishDTO) {
        dishService.updateWithFlavor(dishDTO);
        return R.success("Dish updated successfully");
    }

    @DeleteMapping
    @Operation(summary = "Delete Dish")
    public R<String> delete(@RequestParam List<Long> ids) {
        dishService.deleteBatch(ids);
        return R.success("Dish deleted successfully");
    }

    @PostMapping("/status/{status}")
    @Operation(summary = "Update Status")
    public R<String> status(@PathVariable Integer status, @RequestParam List<Long> ids) {
        dishService.updateStatus(status, ids);
        return R.success("Status updated successfully");
    }

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
