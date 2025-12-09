package com.eurobite.modules.setmeal.entity;

import com.eurobite.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "setmeal_dish")
public class SetmealDish extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "setmeal_id")
    private Setmeal setmeal;

    private Long dishId;
    private String name;
    private BigDecimal price;
    private Integer copies;
    private Integer sort;
}
