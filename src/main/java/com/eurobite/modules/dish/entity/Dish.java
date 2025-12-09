package com.eurobite.modules.dish.entity;

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
@Table(name = "dish")
public class Dish extends BaseEntity {

    private String name;
    private Long categoryId;
    private BigDecimal price;
    private String code;
    private String image;
    private String description;
    private Integer status;
    private Integer sort;

    @OneToMany(mappedBy = "dish", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DishFlavor> flavors = new ArrayList<>();
    
    // Helper to add flavor
    public void addFlavor(DishFlavor flavor) {
        flavors.add(flavor);
        flavor.setDish(this);
    }
}
