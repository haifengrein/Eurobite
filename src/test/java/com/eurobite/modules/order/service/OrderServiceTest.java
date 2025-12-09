package com.eurobite.modules.order.service;

import com.eurobite.common.context.BaseContext;
import com.eurobite.common.exception.CustomException;
import com.eurobite.common.test.AbstractIntegrationTest;
import com.eurobite.modules.order.dto.SubmitOrderDTO;
import com.eurobite.modules.order.entity.OrderDetail;
import com.eurobite.modules.order.entity.Orders;
import com.eurobite.modules.order.entity.ShoppingCart;
import com.eurobite.modules.order.repository.OrderDetailRepository;
import com.eurobite.modules.order.repository.OrderRepository;
import com.eurobite.modules.order.repository.ShoppingCartRepository;
import com.eurobite.modules.user.entity.AddressBook;
import com.eurobite.modules.user.entity.User;
import com.eurobite.modules.user.repository.AddressBookRepository;
import com.eurobite.modules.user.repository.UserRepository;
import com.eurobite.modules.dish.entity.Dish;
import com.eurobite.modules.dish.repository.DishRepository;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.assertThrows;

@Transactional
class OrderServiceTest extends AbstractIntegrationTest {

    @Autowired
    private OrderService orderService;

    @Autowired
    private ShoppingCartRepository shoppingCartRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderDetailRepository orderDetailRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AddressBookRepository addressBookRepository;

    @Autowired
    private DishRepository dishRepository;

    @AfterEach
    void tearDown() {
        BaseContext.removeCurrentId();
    }

    @Test
    void submitSuccess_CreatesOrderAndClearsCart() {
        // 1. Prepare User & Address
        User user = new User();
        user.setPhone("13800000020");
        user.setStatus(1);
        user = userRepository.save(user);
        Long userId = user.getId();

        AddressBook address = new AddressBook();
        address.setUserId(userId);
        address.setConsignee("Alice");
        address.setPhone("13800000020");
        address = addressBookRepository.save(address);

        // 2. Prepare Dish
        Dish dish = new Dish();
        dish.setName("Order Dish");
        dish.setCategoryId(1L);
        dish.setPrice(BigDecimal.valueOf(10));
        dish.setStatus(1);
        dish = dishRepository.save(dish);

        // 3. Prepare Cart
        ShoppingCart cart = new ShoppingCart();
        cart.setUserId(userId);
        cart.setDishId(dish.getId());
        cart.setName("Order Dish");
        cart.setNumber(2);
        cart.setAmount(BigDecimal.valueOf(10));
        shoppingCartRepository.save(cart);

        BaseContext.setCurrentId(userId);

        SubmitOrderDTO dto = new SubmitOrderDTO(address.getId(), 1, "remark");

        orderService.submit(dto);

        List<Orders> orders = orderRepository.findAll();
        assertThat(orders).hasSize(1);
        Orders order = orders.get(0);
        assertThat(order.getUserId()).isEqualTo(userId);
        assertThat(order.getAmount()).isEqualByComparingTo(BigDecimal.valueOf(20));

        List<OrderDetail> details = orderDetailRepository.findAll();
        assertThat(details).hasSize(1);
        assertThat(details.get(0).getDishId()).isEqualTo(dish.getId());
        assertThat(details.get(0).getNumber()).isEqualTo(2);

        assertThat(shoppingCartRepository.findByUserId(userId)).isEmpty();
    }

    @Test
    void submitFail_EmptyCartThrows() {
        User user = new User();
        user.setPhone("13800000021");
        user.setStatus(1);
        user = userRepository.save(user);
        Long userId = user.getId();

        AddressBook address = new AddressBook();
        address.setUserId(userId);
        address.setConsignee("Bob");
        address.setPhone("13800000021");
        address = addressBookRepository.save(address);

        BaseContext.setCurrentId(userId);

        SubmitOrderDTO dto = new SubmitOrderDTO(address.getId(), 1, "remark");

        assertThrows(CustomException.class, () -> orderService.submit(dto));
    }

    @Test
    void submitFail_AddressError() {
        User user = new User();
        user.setPhone("13800000022");
        user.setStatus(1);
        user = userRepository.save(user);
        Long userId = user.getId();

        // prepare cart but no address
        ShoppingCart cart = new ShoppingCart();
        cart.setUserId(userId);
        cart.setName("No Address Dish");
        cart.setNumber(1);
        cart.setAmount(BigDecimal.TEN);
        shoppingCartRepository.save(cart);

        BaseContext.setCurrentId(userId);

        SubmitOrderDTO dto = new SubmitOrderDTO(999L, 1, "remark");

        assertThrows(CustomException.class, () -> orderService.submit(dto));
    }
}

