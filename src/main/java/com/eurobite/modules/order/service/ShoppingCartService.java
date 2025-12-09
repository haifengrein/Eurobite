package com.eurobite.modules.order.service;

import com.eurobite.common.context.BaseContext;
import com.eurobite.modules.dish.entity.Dish;
import com.eurobite.modules.dish.repository.DishRepository;
import com.eurobite.modules.order.entity.ShoppingCart;
import com.eurobite.modules.order.repository.ShoppingCartRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ShoppingCartService {

    private final ShoppingCartRepository shoppingCartRepository;
    private final DishRepository dishRepository;

    public ShoppingCart add(ShoppingCart cart) {
        Long userId = BaseContext.getCurrentId();
        // 为匿名用户设置默认用户ID（生产环境应该要求登录）
        if (userId == null) {
            userId = 1L; // 默认测试用户ID
        }
        cart.setUserId(userId);

        // Check if exists (Dish or Setmeal)
        // Simplified query: find all for user and filter in memory, or use Example.
        // Real implementation should use specific query for atomicity or lock.
        // For this demo, we iterate.
        List<ShoppingCart> list = shoppingCartRepository.findByUserId(userId);

        for (ShoppingCart item : list) {
            if (item.getDishId() != null && item.getDishId().equals(cart.getDishId())) {
                // Same dish, increment
                item.setNumber(item.getNumber() + 1);
                // Update amount based on current price
                if (item.getDishId() != null) {
                    Dish dish = dishRepository.findById(item.getDishId()).orElse(null);
                    if (dish != null) {
                        item.setAmount(dish.getPrice());
                    }
                }
                return shoppingCartRepository.save(item);
            }
            if (item.getSetmealId() != null && item.getSetmealId().equals(cart.getSetmealId())) {
                item.setNumber(item.getNumber() + 1);
                return shoppingCartRepository.save(item);
            }
        }

        // Not exists, add new - fetch dish details first
        cart.setNumber(1);
        if (cart.getDishId() != null) {
            Dish dish = dishRepository.findById(cart.getDishId())
                    .orElseThrow(() -> new RuntimeException("Dish not found: " + cart.getDishId()));
            cart.setName(dish.getName());
            cart.setImage(dish.getImage());
            cart.setAmount(dish.getPrice());
        }
        // For setmeal, we would need similar logic to fetch setmeal details
        // For now, assuming setmeal details are provided in the cart object

        return shoppingCartRepository.save(cart);
    }

    @Transactional
    public void decrease(Long id) {
        ShoppingCart cart = shoppingCartRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Item not found"));
        
        if (cart.getNumber() > 1) {
            cart.setNumber(cart.getNumber() - 1);
            shoppingCartRepository.save(cart);
        } else {
            shoppingCartRepository.deleteById(id);
        }
    }

    @Transactional
    public void remove(Long id) {
        shoppingCartRepository.deleteById(id);
    }

    @Transactional
    public void clean() {
        Long userId = BaseContext.getCurrentId();
        if (userId == null) {
            userId = 1L; // 默认测试用户ID
        }
        shoppingCartRepository.deleteByUserId(userId);
    }

    public List<ShoppingCart> list() {
        Long userId = BaseContext.getCurrentId();
        if (userId == null) {
            userId = 1L; // 默认测试用户ID
        }
        return shoppingCartRepository.findByUserId(userId);
    }
}
