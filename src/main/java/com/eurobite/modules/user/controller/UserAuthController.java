package com.eurobite.modules.user.controller;

import com.eurobite.common.model.R;
import com.eurobite.modules.user.dto.UserLoginDTO;
import com.eurobite.modules.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/auth/user")
@RequiredArgsConstructor
@Tag(name = "User Auth (C-End)", description = "Mobile Login")
public class UserAuthController {

    private final UserService userService;

    @PostMapping("/sendMsg")
    @Operation(summary = "Send SMS Code")
    public R<String> sendMsg(@RequestBody UserLoginDTO dto) {
        // Only phone needed
        userService.sendMsg(dto.phone());
        return R.success("Code sent");
    }

    @PostMapping("/login")
    @Operation(summary = "Login")
    public R<Map<String, Object>> login(@RequestBody UserLoginDTO dto) {
        Map<String, Object> data = userService.login(dto);
        return R.success(data);
    }
}
