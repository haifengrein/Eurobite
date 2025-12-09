package com.eurobite.modules.category.controller;

import com.eurobite.common.model.R;
import com.eurobite.modules.category.entity.Category;
import com.eurobite.modules.category.service.CategoryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/category")
@RequiredArgsConstructor
@Tag(name = "Category Management")
public class CategoryController {

    private final CategoryService categoryService;

    @PostMapping
    @Operation(summary = "Add Category")
    public R<String> save(@RequestBody Category category) {
        categoryService.save(category);
        return R.success("Category added");
    }

    @DeleteMapping
    @Operation(summary = "Delete Category")
    public R<String> delete(Long id) {
        categoryService.remove(id);
        return R.success("Category deleted");
    }

    @GetMapping("/list")
    @Operation(summary = "List Categories")
    public R<List<Category>> list(Integer type) {
        return R.success(categoryService.list(type));
    }
    
    @PutMapping
    @Operation(summary = "Update Category")
    public R<String> update(@RequestBody Category category) {
        categoryService.update(category);
        return R.success("Category updated");
    }
}
