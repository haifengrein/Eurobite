package com.eurobite.modules.order.dto;

import com.eurobite.modules.order.entity.OrderDetail;
import com.eurobite.modules.order.entity.Orders;
import java.util.List;

public record OrderWithDetailDTO(
    Orders order,
    List<OrderDetail> items
) {}
