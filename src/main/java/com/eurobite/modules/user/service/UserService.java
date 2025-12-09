package com.eurobite.modules.user.service;

import com.eurobite.common.exception.CustomException;
import com.eurobite.common.util.JwtUtil;
import com.eurobite.modules.user.dto.UserLoginDTO;
import com.eurobite.modules.user.dto.UserExportDTO;
import com.eurobite.modules.user.dto.UserSummaryDTO;
import com.eurobite.modules.user.entity.User;
import com.eurobite.modules.user.entity.AddressBook;
import com.eurobite.modules.user.repository.UserRepository;
import com.eurobite.modules.user.repository.AddressBookRepository;
import com.eurobite.common.context.BaseContext;
import lombok.RequiredArgsConstructor;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;
import java.util.concurrent.TimeUnit;

@Service
@RequiredArgsConstructor
public class UserService {

    private final StringRedisTemplate redisTemplate;
    private final UserRepository userRepository;
    private final AddressBookRepository addressBookRepository;
    private final JwtUtil jwtUtil;

    public void sendMsg(String phone) {
        // Mock sending SMS
        String code = "123456"; // Fixed for mock
        redisTemplate.opsForValue().set("LOGIN:" + phone, code, 5, TimeUnit.MINUTES);
    }

    @Transactional
    public Map<String, Object> login(UserLoginDTO loginDTO) {
        String phone = loginDTO.phone();
        String code = loginDTO.code();

        String cachedCode = redisTemplate.opsForValue().get("LOGIN:" + phone);
        if (cachedCode == null || !cachedCode.equals(code)) {
            throw new CustomException("Verification code error or expired");
        }

        User user = userRepository.findByPhone(phone).orElseGet(() -> {
            User newUser = new User();
            newUser.setPhone(phone);
            newUser.setStatus(1);
            return userRepository.save(newUser); // Auto-register
        });

        if (user.getStatus() == 0) {
            throw new CustomException("Account disabled");
        }

        String token = jwtUtil.generateToken(user.getId(), user.getPhone());
        
        // Clear code
        redisTemplate.delete("LOGIN:" + phone);

        Map<String, Object> result = new HashMap<>();
        result.put("token", token);
        result.put("user", user);
        return result;
    }

    @Transactional(readOnly = true)
    public UserExportDTO exportMe() {
        Long userId = BaseContext.getCurrentId();
        if (userId == null) {
            throw new CustomException("Unauthenticated");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));

        UserSummaryDTO summary = new UserSummaryDTO(
                user.getId(),
                user.getUsername(),
                user.getPhone(),
                user.getStatus()
        );

        var addressList = addressBookRepository.findByUserId(userId).stream()
                .map(this::toAddressDTO)
                .toList();

        return new UserExportDTO(summary, addressList);
    }

    @Transactional
    public void deleteMe() {
        Long userId = BaseContext.getCurrentId();
        if (userId == null) {
            throw new CustomException("Unauthenticated");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException("User not found"));

        // 清理地址簿
        var addresses = addressBookRepository.findByUserId(userId);
        addressBookRepository.deleteAll(addresses);

        // 清理购物车
        // 通过 Order 模块的 ShoppingCartRepository 处理会更理想，但为避免循环依赖，这里保留为后续重构点。

        // 匿名化用户数据而不是硬删除，避免破坏订单等历史数据
        user.setStatus(0); // disabled
        user.setUsername(null);
        user.setIdNumber(null);
        user.setAvatar(null);
        // 保持 phone 不变，因为它有 NOT NULL 约束
        userRepository.save(user);
    }

    private UserExportDTO.AddressDTO toAddressDTO(AddressBook address) {
        String detail = (address.getProvinceName() == null ? "" : address.getProvinceName())
                + (address.getCityName() == null ? "" : address.getCityName())
                + (address.getDistrictName() == null ? "" : address.getDistrictName())
                + (address.getDetail() == null ? "" : address.getDetail());
        return new UserExportDTO.AddressDTO(
                address.getId(),
                address.getConsignee(),
                address.getPhone(),
                detail,
                address.getIsDefault()
        );
    }
}
