package com.eurobite.modules.user.controller;

import com.eurobite.common.model.R;
import com.eurobite.modules.user.dto.UserExportDTO;
import com.eurobite.modules.user.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user/me")
@RequiredArgsConstructor
@Tag(name = "User GDPR", description = "Data export & deletion for current user")
public class UserMeController {

    private final UserService userService;

    @GetMapping("/export")
    @Operation(summary = "Export current user data")
    public R<UserExportDTO> exportMe() {
        return R.success(userService.exportMe());
    }

    @DeleteMapping
    @Operation(summary = "Delete current user (GDPR)")
    public R<String> deleteMe() {
        userService.deleteMe();
        return R.success("User data deleted");
    }
}

