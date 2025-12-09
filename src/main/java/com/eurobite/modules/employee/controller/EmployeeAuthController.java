package com.eurobite.modules.employee.controller;

import com.eurobite.common.model.R;
import com.eurobite.modules.employee.dto.LoginDTO;
import com.eurobite.modules.employee.service.EmployeeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/employee")
@RequiredArgsConstructor
@Tag(name = "Employee Auth", description = "Login/Logout")
public class EmployeeAuthController {

    private final EmployeeService employeeService;

    @PostMapping("/login")
    @Operation(summary = "Login")
    public R<Map<String, Object>> login(@RequestBody LoginDTO loginDTO) {
        Map<String, Object> data = employeeService.login(loginDTO);
        return R.success(data);
    }
    
    @PostMapping("/logout")
    public R<String> logout() {
        return R.success("Logout success");
    }
}
