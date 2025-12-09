package com.eurobite.modules.setmeal.controller;

import com.eurobite.common.model.R;
import com.eurobite.modules.setmeal.dto.SetmealDTO;
import com.eurobite.modules.setmeal.service.SetmealService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/setmeal")
@RequiredArgsConstructor
@Tag(name = "Setmeal Management")
public class SetmealController {

    private final SetmealService setmealService;

    @PostMapping
    @Operation(summary = "Save Setmeal")
    public R<String> save(@RequestBody SetmealDTO dto) {
        setmealService.saveWithDish(dto);
        return R.success("Setmeal added");
    }

    @PutMapping
    @Operation(summary = "Update Setmeal")
    public R<String> update(@RequestBody SetmealDTO dto) {
        setmealService.updateWithDish(dto);
        return R.success("Setmeal updated");
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get Setmeal By ID")
    public R<SetmealDTO> getById(@PathVariable Long id) {
        return R.success(setmealService.getById(id));
    }

    @GetMapping("/list")
    @Operation(summary = "List Setmeals By Category")
    public R<List<SetmealDTO>> list(@RequestParam(required = false) Long categoryId) {
        return R.success(setmealService.listByCategory(categoryId));
    }

    @DeleteMapping
    @Operation(summary = "Delete Setmeal")
    public R<String> delete(@RequestParam List<Long> ids) {
        setmealService.removeWithDish(ids);
        return R.success("Setmeal deleted");
    }
}
