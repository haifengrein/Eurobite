package com.eurobite.modules.order.repository;

import com.eurobite.modules.order.entity.Orders;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderRepository extends JpaRepository<Orders, Long> {
    Page<Orders> findByUserId(Long userId, Pageable pageable);
    Page<Orders> findByUserIdAndStatus(Long userId, Integer status, Pageable pageable);

    @org.springframework.data.jpa.repository.Query("SELECT SUM(o.amount) FROM Orders o WHERE o.status IN (4, 5)") // Status 4 = COMPLETED, 5 = CANCELLED
    java.math.BigDecimal sumTotalRevenue();

    @org.springframework.data.jpa.repository.Query("SELECT COUNT(*) FROM Orders o WHERE o.status IN (4, 5)") // Status 4 = COMPLETED, 5 = CANCELLED
    Integer countCompletedOrders();

    long count();
}