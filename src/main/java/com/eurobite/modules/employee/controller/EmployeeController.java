package com.eurobite.modules.employee.controller;

import com.eurobite.common.model.R;
import com.eurobite.modules.employee.dto.EmployeeDTO;
import com.eurobite.modules.employee.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
@Tag(name = "Employee Management", description = "CRUD for Employees")
public class EmployeeController {

    private final EmployeeService employeeService;

    @PostMapping
    @Operation(summary = "Add Employee")
    public R<String> save(@RequestBody EmployeeDTO employeeDTO) {
        employeeService.save(employeeDTO);
        return R.success("Employee added successfully");
    }

    @GetMapping("/page")
    @Operation(summary = "Page Query")
    public R<Page<EmployeeDTO>> page(int page, int pageSize, String name) {
        return R.success(employeeService.pageQuery(page, pageSize, name));
    }

    @PutMapping
    @Operation(summary = "Update Employee")
    public R<String> update(@RequestBody EmployeeDTO employeeDTO) {
        employeeService.update(employeeDTO);
        return R.success("Employee updated successfully");
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get By ID")
    public R<EmployeeDTO> getById(@PathVariable Long id) {
        return R.success(employeeService.getById(id));
    }
}
