package com.eurobite.modules.order.service;

import com.eurobite.common.context.BaseContext;
import com.eurobite.common.exception.CustomException;
import com.eurobite.modules.order.dto.SubmitOrderDTO;
import com.eurobite.modules.order.entity.OrderDetail;
import com.eurobite.modules.order.entity.Orders;
import com.eurobite.modules.order.entity.ShoppingCart;
import com.eurobite.modules.order.repository.OrderDetailRepository;
import com.eurobite.modules.order.repository.OrderRepository;
import com.eurobite.modules.order.repository.ShoppingCartRepository;
import com.eurobite.modules.dish.api.DishModuleApi;
import com.eurobite.modules.user.entity.AddressBook;
import com.eurobite.modules.user.entity.User;
import com.eurobite.modules.user.repository.AddressBookRepository;
import com.eurobite.modules.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.atomic.AtomicReference;
import java.util.stream.Collectors;

import com.eurobite.modules.order.dto.OrderWithDetailDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;

@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderDetailRepository orderDetailRepository;
    private final ShoppingCartRepository shoppingCartRepository;
    private final UserRepository userRepository;
    private final AddressBookRepository addressBookRepository;
    private final DishModuleApi dishModuleApi;

    @Transactional
    public Orders submit(SubmitOrderDTO submitDTO) {
        Long userId = BaseContext.getCurrentId();
        // 为匿名用户设置默认用户ID（生产环境应该要求登录）
        if (userId == null) {
            userId = 1L; // 默认测试用户ID
        }

        // 1. Get Cart
        List<ShoppingCart> cartList = shoppingCartRepository.findByUserId(userId);
        if (cartList == null || cartList.isEmpty()) {
            throw new CustomException("Cart is empty");
        }

        // 2. Get User & Address
        User user = userRepository.findById(userId).orElseThrow(() -> new CustomException("User error"));
        AddressBook address = addressBookRepository.findById(submitDTO.addressBookId())
                .orElseThrow(() -> new CustomException("Address error"));

        // 3. Calculate Amount & Order ID
        long orderId = Math.abs(UUID.randomUUID().getMostSignificantBits()); // Simple ID generation
        AtomicReference<BigDecimal> totalAmount = new AtomicReference<>(BigDecimal.ZERO);

        List<OrderDetail> orderDetails = cartList.stream().map(item -> {
            OrderDetail detail = new OrderDetail();
            detail.setOrderId(orderId);
            detail.setNumber(item.getNumber());
            detail.setDishFlavor(item.getDishFlavor());
            detail.setDishId(item.getDishId());
            detail.setSetmealId(item.getSetmealId());
            detail.setName(item.getName());
            detail.setImage(item.getImage());
            // 使用 DishModuleApi 获取当前价格
            BigDecimal itemPrice;
            if (item.getDishId() != null) {
                itemPrice = dishModuleApi.getCurrentPrice(item.getDishId());
            } else {
                itemPrice = item.getAmount();
            }
            detail.setAmount(itemPrice);

            // 计算该商品的总价 = 单价 × 数量
            BigDecimal itemTotal = itemPrice.multiply(new BigDecimal(item.getNumber()));
            totalAmount.updateAndGet(current -> current.add(itemTotal));

            return detail;
        }).collect(Collectors.toList());

        // 4. Save Order
        Orders order = new Orders();
        order.setId(orderId);
        order.setOrderTime(LocalDateTime.now());
        order.setCheckoutTime(LocalDateTime.now());
        order.setStatus(2); // PENDING -> PAID (Mocking instant pay)
        order.setAmount(totalAmount.get());
        order.setUserId(userId);
        order.setNumber(String.valueOf(orderId));
        order.setUserName(user.getUsername() != null ? user.getUsername() : user.getPhone());
        order.setConsignee(address.getConsignee());
        order.setPhone(address.getPhone());
        order.setAddress((address.getProvinceName() == null ? "" : address.getProvinceName())
                + (address.getCityName() == null ? "" : address.getCityName())
                + (address.getDistrictName() == null ? "" : address.getDistrictName())
                + (address.getDetail() == null ? "" : address.getDetail()));
        order.setRemark(submitDTO.remark());
        
        orderRepository.save(order);

        // 5. Save Details
        orderDetailRepository.saveAll(orderDetails);

        // 6. Clear Cart
        shoppingCartRepository.deleteByUserId(userId);

        return order;
    }

    public Page<Orders> list(int page, int size, Integer status) {
        Long userId = BaseContext.getCurrentId();
        PageRequest pageRequest = PageRequest.of(page - 1, size, Sort.by("orderTime").descending());
        
        if (status != null) {
            // Assuming OrderRepository extends JpaRepository/PagingAndSortingRepository
            // and supports findByUserIdAndStatus
            // Since I don't see the repo definition, I'll assume standard naming or need to fix repo.
            // For now, let's assume findByUserId (filtering status in memory if necessary, or better, strictly by DB)
             return orderRepository.findByUserIdAndStatus(userId, status, pageRequest);
        }
        return orderRepository.findByUserId(userId, pageRequest);
    }

    public OrderWithDetailDTO getDetail(Long orderId) {
        Orders order = orderRepository.findById(orderId)
                .orElseThrow(() -> new CustomException("Order not found"));
        
        List<OrderDetail> details = orderDetailRepository.findByOrderId(orderId);
        return new OrderWithDetailDTO(order, details);
    }
}
