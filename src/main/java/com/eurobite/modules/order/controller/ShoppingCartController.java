package com.eurobite.modules.order.controller;

import com.eurobite.common.model.R;
import com.eurobite.modules.order.entity.ShoppingCart;
import com.eurobite.modules.order.service.ShoppingCartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@Tag(name = "Shopping Cart", description = "Cart Management")
public class ShoppingCartController {

    private final ShoppingCartService shoppingCartService;

    @GetMapping
    @Operation(summary = "List Cart Items")
    public R<List<ShoppingCart>> list() {
        return R.success(shoppingCartService.list());
    }

    @PostMapping("/items")
    @Operation(summary = "Add Item")
    public R<ShoppingCart> add(@RequestBody ShoppingCart cart) {
        return R.success(shoppingCartService.add(cart));
    }

    @PatchMapping("/items/{id}/decrease")
    @Operation(summary = "Decrease Item Quantity")
    public R<String> decrease(@PathVariable Long id) {
        shoppingCartService.decrease(id);
        return R.success("Item quantity decreased");
    }

    @DeleteMapping("/items/{id}")
    @Operation(summary = "Remove Item")
    public R<String> remove(@PathVariable Long id) {
        shoppingCartService.remove(id);
        return R.success("Item removed");
    }

    @DeleteMapping
    @Operation(summary = "Clear Cart")
    public R<String> clean() {
        shoppingCartService.clean();
        return R.success("Cart cleared");
    }
}
