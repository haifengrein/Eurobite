package com.eurobite.modules.employee.mapper;

import com.eurobite.modules.employee.dto.EmployeeDTO;
import com.eurobite.modules.employee.entity.Employee;
import org.mapstruct.Mapper;
import org.mapstruct.MappingConstants;

@Mapper(componentModel = MappingConstants.ComponentModel.SPRING)
public interface EmployeeMapper {
    Employee toEntity(EmployeeDTO dto);
    EmployeeDTO toDTO(Employee entity);
}
