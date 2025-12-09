package com.eurobite.modules.user.service;

import com.eurobite.common.exception.CustomException;
import com.eurobite.common.util.JwtUtil;
import com.eurobite.modules.user.dto.UserLoginDTO;
import com.eurobite.modules.user.entity.User;
import com.eurobite.modules.user.repository.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.data.redis.core.ValueOperations;

import java.util.Map;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private StringRedisTemplate redisTemplate;

    @Mock
    private ValueOperations<String, String> valueOperations;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private UserService userService;

    @Test
    void testSendMsg_Success() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        
        userService.sendMsg("13800000000");

        // Verify that a code was generated and saved to Redis
        verify(valueOperations, times(1)).set(eq("LOGIN:13800000000"), anyString(), eq(5L), eq(TimeUnit.MINUTES));
    }

    @Test
    void testLogin_Success_NewUser() {
        String phone = "13800000001";
        String code = "123456";
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("LOGIN:" + phone)).thenReturn(code);
        when(userRepository.findByPhone(phone)).thenReturn(Optional.empty()); // New User
        when(jwtUtil.generateToken(any(), any())).thenReturn("token_xxx");

        // Mock save to return an entity with ID
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User u = invocation.getArgument(0);
            u.setId(1L);
            return u;
        });

        Map<String, Object> result = userService.login(new UserLoginDTO(phone, code));

        assertNotNull(result.get("token"));
        verify(userRepository, times(1)).save(any(User.class)); // Should save new user
        verify(redisTemplate, times(1)).delete("LOGIN:" + phone); // Should clear code
    }

    @Test
    void testLogin_Success_ExistingUser() {
        String phone = "13800000002";
        String code = "123456";
        User existingUser = new User();
        existingUser.setId(2L);
        existingUser.setPhone(phone);
        existingUser.setStatus(1);

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("LOGIN:" + phone)).thenReturn(code);
        when(userRepository.findByPhone(phone)).thenReturn(Optional.of(existingUser)); // Existing
        when(jwtUtil.generateToken(2L, phone)).thenReturn("token_yyy");

        Map<String, Object> result = userService.login(new UserLoginDTO(phone, code));

        assertEquals("token_yyy", result.get("token"));
        verify(userRepository, never()).save(any(User.class)); // Should NOT save
    }

    @Test
    void testLogin_Fail_WrongCode() {
        String phone = "13800000003";
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("LOGIN:" + phone)).thenReturn("123456"); // Real code

        assertThrows(CustomException.class, () -> {
            userService.login(new UserLoginDTO(phone, "654321")); // Wrong input
        });
    }

    @Test
    void testLogin_Fail_CodeExpired() {
        String phone = "13800000004";
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("LOGIN:" + phone)).thenReturn(null); // Code expired (null)

        assertThrows(CustomException.class, () -> {
            userService.login(new UserLoginDTO(phone, "123456"));
        });
    }

    @Test
    void testLogin_Fail_DisabledUser() {
        String phone = "13800000005";
        String code = "123456";
        User disabled = new User();
        disabled.setId(5L);
        disabled.setPhone(phone);
        disabled.setStatus(0); // disabled

        when(redisTemplate.opsForValue()).thenReturn(valueOperations);
        when(valueOperations.get("LOGIN:" + phone)).thenReturn(code);
        when(userRepository.findByPhone(phone)).thenReturn(Optional.of(disabled));

        assertThrows(CustomException.class, () -> {
            userService.login(new UserLoginDTO(phone, code));
        });
    }

    @Test
    void testSendMsg_MultiplePhones_IsolatedKeys() {
        when(redisTemplate.opsForValue()).thenReturn(valueOperations);

        userService.sendMsg("13800000010");
        userService.sendMsg("13800000011");

        verify(valueOperations, times(1)).set(eq("LOGIN:13800000010"), anyString(), eq(5L), eq(TimeUnit.MINUTES));
        verify(valueOperations, times(1)).set(eq("LOGIN:13800000011"), anyString(), eq(5L), eq(TimeUnit.MINUTES));
    }
}
