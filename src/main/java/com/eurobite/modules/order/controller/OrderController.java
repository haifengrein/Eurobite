package com.eurobite.modules.order.controller;

import com.eurobite.common.model.R;
import com.eurobite.modules.order.dto.OrderWithDetailDTO;
import com.eurobite.modules.order.dto.SubmitOrderDTO;
import com.eurobite.modules.order.entity.Orders;
import com.eurobite.modules.order.service.OrderService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
@Tag(name = "Order Management", description = "C-End Orders")
public class OrderController {

    private final OrderService orderService;

    @PostMapping
    @Operation(summary = "Submit Order")
    public R<Orders> submit(@RequestBody SubmitOrderDTO submitDTO) {
        return R.success(orderService.submit(submitDTO));
    }

    @GetMapping("/me")
    @Operation(summary = "My Orders")
    public R<Page<Orders>> list(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(required = false) Integer status) {
        return R.success(orderService.list(page, size, status));
    }

    @GetMapping("/{orderId}")
    @Operation(summary = "Order Detail")
    public R<OrderWithDetailDTO> getDetail(@PathVariable Long orderId) {
        return R.success(orderService.getDetail(orderId));
    }
}
