package com.eurobite.modules.setmeal.entity;

import com.eurobite.common.entity.BaseEntity;
import jakarta.persistence.*;
import lombok.Data;
import lombok.EqualsAndHashCode;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@EqualsAndHashCode(callSuper = true)
@Data
@Entity
@Table(name = "setmeal")
public class Setmeal extends BaseEntity {

    private Long categoryId;
    private String name;
    private BigDecimal price;
    private Integer status;
    private String code;
    private String description;
    private String image;

    @OneToMany(mappedBy = "setmeal", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SetmealDish> setmealDishes = new ArrayList<>();
    
    public void addSetmealDish(SetmealDish item) {
        setmealDishes.add(item);
        item.setSetmeal(this);
    }
}
