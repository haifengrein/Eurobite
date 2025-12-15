package com.eurobite.modules.report.service;

import com.eurobite.modules.order.entity.Orders;
import com.eurobite.modules.order.repository.OrderRepository;
import com.eurobite.modules.report.dto.DashboardDataDTO;
import com.eurobite.modules.report.dto.RecentOrderDTO;
import com.eurobite.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReportService {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;

    @Transactional(readOnly = true)
    public DashboardDataDTO getDashboardData() {
        // Only count COMPLETED orders (status = 4)
        BigDecimal totalRevenue = orderRepository.sumTotalRevenue();
        if (totalRevenue == null) {
            totalRevenue = BigDecimal.ZERO;
        }

        long totalOrders = orderRepository.countCompletedOrders();
        long totalCustomers = userRepository.count();

        BigDecimal avgOrderValue = BigDecimal.ZERO;
        if (totalOrders > 0) {
            avgOrderValue = totalRevenue.divide(new BigDecimal(totalOrders), 2, RoundingMode.HALF_UP);
        }

        // Get 5 recent orders
        List<Orders> orders = orderRepository.findAll(
            PageRequest.of(0, 5, Sort.by(Sort.Direction.DESC, "orderTime"))
        ).getContent();

        List<RecentOrderDTO> recentOrders = orders.stream().map(o -> new RecentOrderDTO(
            o.getId(),
            o.getNumber(),
            o.getUserName(),
            o.getAmount(),
            o.getOrderTime(),
            o.getStatus()
        )).toList();

        return new DashboardDataDTO(
            totalRevenue,
            totalOrders,
            totalCustomers,
            avgOrderValue,
            recentOrders
        );
    }
}
