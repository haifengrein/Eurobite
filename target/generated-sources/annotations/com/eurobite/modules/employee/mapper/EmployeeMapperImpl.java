package com.eurobite.modules.employee.mapper;

import com.eurobite.modules.employee.dto.EmployeeDTO;
import com.eurobite.modules.employee.entity.Employee;
import java.time.LocalDateTime;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-12-09T15:52:06+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 22.0.1 (Oracle Corporation)"
)
@Component
public class EmployeeMapperImpl implements EmployeeMapper {

    @Override
    public Employee toEntity(EmployeeDTO dto) {
        if ( dto == null ) {
            return null;
        }

        Employee employee = new Employee();

        employee.setId( dto.id() );
        employee.setCreateTime( dto.createTime() );
        employee.setUpdateTime( dto.updateTime() );
        employee.setUsername( dto.username() );
        employee.setName( dto.name() );
        employee.setPhone( dto.phone() );
        employee.setSex( dto.sex() );
        employee.setIdNumber( dto.idNumber() );
        employee.setStatus( dto.status() );

        return employee;
    }

    @Override
    public EmployeeDTO toDTO(Employee entity) {
        if ( entity == null ) {
            return null;
        }

        Long id = null;
        String username = null;
        String name = null;
        String phone = null;
        String sex = null;
        String idNumber = null;
        Integer status = null;
        LocalDateTime createTime = null;
        LocalDateTime updateTime = null;

        id = entity.getId();
        username = entity.getUsername();
        name = entity.getName();
        phone = entity.getPhone();
        sex = entity.getSex();
        idNumber = entity.getIdNumber();
        status = entity.getStatus();
        createTime = entity.getCreateTime();
        updateTime = entity.getUpdateTime();

        EmployeeDTO employeeDTO = new EmployeeDTO( id, username, name, phone, sex, idNumber, status, createTime, updateTime );

        return employeeDTO;
    }
}
