package com.eurobite.common.util;

import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
        // In a real app, these would be injected via @Value
        jwtUtil.setSecret("mySuperSecretKeyForJwtTestingPurposeOnly123456");
        jwtUtil.setExpiration(3600000L); // 1 hour
    }

    @Test
    void testGenerateAndParseToken() {
        Long userId = 100L;
        String username = "testUser";

        String token = jwtUtil.generateToken(userId, username);
        assertNotNull(token);

        Claims claims = jwtUtil.extractClaims(token);
        assertEquals(username, claims.getSubject());
        assertEquals(userId.toString(), claims.get("userId").toString());
    }

    @Test
    void testTokenValidation() {
        String token = jwtUtil.generateToken(1L, "validUser");
        assertTrue(jwtUtil.validateToken(token, "validUser"));
        assertFalse(jwtUtil.validateToken(token, "invalidUser"));
    }
}
