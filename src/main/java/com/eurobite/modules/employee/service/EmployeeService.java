package com.eurobite.modules.employee.service;

import com.eurobite.common.exception.CustomException;
import com.eurobite.common.util.JwtUtil;
import com.eurobite.modules.employee.dto.EmployeeDTO;
import com.eurobite.modules.employee.dto.LoginDTO;
import com.eurobite.modules.employee.entity.Employee;
import com.eurobite.modules.employee.mapper.EmployeeMapper;
import com.eurobite.modules.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.DigestUtils;

import java.util.HashMap;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final EmployeeMapper employeeMapper;

    public Map<String, Object> login(LoginDTO loginDTO) {
        Employee employee = employeeRepository.findByUsername(loginDTO.username())
                .orElseThrow(() -> new CustomException("Username or password error"));

        if (!passwordEncoder.matches(loginDTO.password(), employee.getPassword())) {
            throw new CustomException("Username or password error");
        }

        if (employee.getStatus() == 0) {
            throw new CustomException("Account is locked");
        }

        String token = jwtUtil.generateToken(employee.getId(), employee.getUsername());

        // Convert to DTO to avoid sending sensitive data
        EmployeeDTO employeeDTO = employeeMapper.toDTO(employee);

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("employee", employeeDTO);
        return result;
    }

    @Transactional
    public void save(EmployeeDTO employeeDTO) {
        Employee employee = employeeMapper.toEntity(employeeDTO);
        // Set default password (MD5 or BCrypt, here we use BCrypt)
        // Original Reggie used MD5, we upgrade to BCrypt.
        // Default: 123456
        employee.setPassword(passwordEncoder.encode("123456"));
        employee.setStatus(1); // Enabled by default
        // Set default role to STAFF if not provided
        if (employee.getRole() == null || employee.getRole().isEmpty()) {
            employee.setRole("STAFF");
        }
        employeeRepository.save(employee);
    }

    public Page<EmployeeDTO> pageQuery(int page, int pageSize, String name) {
        Pageable pageable = PageRequest.of(page - 1, pageSize, Sort.by("updateTime").descending());
        // Simple implementation: findAll for now, or use Specification/QueryDSL for name search later
        // For now, let's just return all
        Page<Employee> pageResult = employeeRepository.findAll(pageable);
        return pageResult.map(employeeMapper::toDTO);
    }

    @Transactional
    public void update(EmployeeDTO employeeDTO) {
        Employee employee = employeeRepository.findById(employeeDTO.id())
                .orElseThrow(() -> new CustomException("Employee not found"));

        // Manual mapping for update to avoid overwriting nulls if MapStruct is not configured for ignoring nulls
        // Or just map fields we allow to update
        employee.setName(employeeDTO.name());
        employee.setPhone(employeeDTO.phone());
        employee.setSex(employeeDTO.sex());
        employee.setStatus(employeeDTO.status());
        employee.setRole(employeeDTO.role());
        // Password update usually separate

        employeeRepository.save(employee);
    }
    
    public EmployeeDTO getById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new CustomException("Employee not found"));
        return employeeMapper.toDTO(employee);
    }
}