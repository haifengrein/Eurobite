package com.eurobite.modules.employee.repository;

import com.eurobite.common.test.AbstractIntegrationTest;
import com.eurobite.modules.employee.entity.Employee;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import static org.assertj.core.api.Assertions.assertThat;

@Transactional // Rollback after each test
class EmployeeRepositoryTest extends AbstractIntegrationTest {

    @Autowired
    private EmployeeRepository employeeRepository;

    @Test
    void testSaveAndFind() {
        Employee employee = new Employee();
        employee.setUsername("admin");
        employee.setName("Admin User");
        employee.setPassword("123456");
        employee.setPhone("13800000000");
        employee.setSex("1");
        employee.setIdNumber("123456789012345678");
        employee.setStatus(1);

        employeeRepository.save(employee);

        // Flush to DB to trigger auditing
        employeeRepository.flush();

        Employee found = employeeRepository.findByUsername("admin").orElseThrow();
        
        assertThat(found.getName()).isEqualTo("Admin User");
        assertThat(found.getCreateTime()).isNotNull(); // Verify Auditing
        assertThat(found.getUpdateTime()).isNotNull();
    }
}
