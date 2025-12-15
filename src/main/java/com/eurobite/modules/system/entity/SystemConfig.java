package com.eurobite.modules.system.entity;

import com.eurobite.common.entity.BaseEntity;
import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "system_config")
public class SystemConfig extends BaseEntity {
    
    // Key name, e.g. "shop.name", "shop.status"
    private String variable;
    
    // Value, e.g. "EuroBite", "1"
    private String value;
    
    // Description for UI or internal use
    private String description;
}
