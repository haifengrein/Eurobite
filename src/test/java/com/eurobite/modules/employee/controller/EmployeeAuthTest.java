package com.eurobite.modules.employee.controller;

import com.eurobite.common.test.AbstractIntegrationTest;
import com.eurobite.modules.employee.dto.LoginDTO;
import com.eurobite.modules.employee.entity.Employee;
import com.eurobite.modules.employee.repository.EmployeeRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@AutoConfigureMockMvc
class EmployeeAuthTest extends AbstractIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private EmployeeRepository employeeRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @BeforeEach
    void setUp() {
        employeeRepository.deleteAll();
        Employee admin = new Employee();
        admin.setUsername("admin");
        admin.setName("Administrator");
        admin.setPassword(passwordEncoder.encode("123456"));
        admin.setStatus(1);
        employeeRepository.save(admin);
    }

    @Test
    void loginSuccess() throws Exception {
        LoginDTO loginDTO = new LoginDTO("admin", "123456");

        mockMvc.perform(post("/api/auth/employee/login") // This path is open
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(0))
                .andExpect(jsonPath("$.data.token").exists());
    }

    @Test
    void accessProtectedResource_WithoutToken_ShouldFail() throws Exception {
        mockMvc.perform(get("/api/employee/page")) // This path is protected
                .andExpect(status().isForbidden());
    }

    @Test
    void loginFail_WrongPassword() throws Exception {
        LoginDTO loginDTO = new LoginDTO("admin", "wrong");

        mockMvc.perform(post("/api/auth/employee/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(loginDTO)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.code").value(1));
    }
}
