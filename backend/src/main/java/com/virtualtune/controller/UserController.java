package com.virtualtune.controller;

import com.virtualtune.dto.ChangePasswordRequest;
import com.virtualtune.dto.UpdateProfileRequest;
import com.virtualtune.dto.UserDTO;
import com.virtualtune.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<UserDTO> getProfile(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        UserDTO profile = userService.getProfile(authentication.getName());
        return ResponseEntity.ok(profile);
    }

    @PutMapping("/profile")
    public ResponseEntity<UserDTO> updateProfile(@RequestBody UpdateProfileRequest request, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        UserDTO updated = userService.updateProfile(authentication.getName(), request);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/change-password")
    public ResponseEntity<Map<String, Object>> changePassword(@RequestBody ChangePasswordRequest request, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        userService.changePassword(authentication.getName(), request);
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "Password changed successfully"
        ));
    }
}
