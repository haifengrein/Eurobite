package com.eurobite.modules.user.entity;

import com.eurobite.common.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "users") // 'user' is reserved in Postgres
public class User extends BaseEntity {
    private String username;
    private String phone;
    private String sex;
    private String idNumber;
    private String avatar;
    private Integer status;
}
