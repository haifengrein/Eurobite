package com.eurobite.modules.dish.api;

import java.math.BigDecimal;

/**
 * Public interface for other modules to interact with Dish module.
 * Other modules should NOT access DishRepository directly.
 */
public interface DishModuleApi {

    /**
     * 获取当前菜品价格（用于结算等场景）
     * @param dishId 菜品 ID
     * @return 当前价格，如果菜品不存在或不可售可以抛出业务异常
     */
    BigDecimal getCurrentPrice(Long dishId);
}

