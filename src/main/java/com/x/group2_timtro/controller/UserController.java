package com.x.group2_timtro.controller;

import com.x.group2_timtro.dto.request.ChangePasswordRequest;
import com.x.group2_timtro.dto.request.CreateUserRequest;
import com.x.group2_timtro.dto.request.UpdateUserRequest;
import com.x.group2_timtro.dto.request.UpdateUserRoleRequest;
import com.x.group2_timtro.dto.response.CreateUserResponse;

import com.x.group2_timtro.dto.response.UserResponse;
import com.x.group2_timtro.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    @PostMapping
    public CreateUserResponse createUser(@RequestBody CreateUserRequest request) {
        return userService.createUser(request);
    }

    @GetMapping("/{userId}")
    public ResponseEntity<UserResponse> getUserById(@PathVariable Long userId) {
        log.info("Getting user: {}", userId);
        UserResponse response = userService.getUserById(userId);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}")
    public ResponseEntity<UserResponse> updateUser(
            @PathVariable Long userId,
            @RequestBody UpdateUserRequest request,
            @RequestHeader("X-User-Id") Long currentUserId) {
        log.info("Updating user: {} by user: {}", userId, currentUserId);
        
        if (!userId.equals(currentUserId)) {
            throw new RuntimeException("You don't have permission to update this user");
        }
        
        UserResponse response = userService.updateUser(userId, request);
        return ResponseEntity.ok(response);
    }

    @PutMapping("/{userId}/change-password")
    public ResponseEntity<String> changePassword(
            @PathVariable Long userId,
            @RequestBody ChangePasswordRequest request,
            @RequestHeader("X-User-Id") Long currentUserId) {
        log.info("Changing password for user: {}", userId);

        if (!userId.equals(currentUserId)) {
            throw new RuntimeException("You don't have permission to change password");
        }

        userService.changePassword(userId, request);
        return ResponseEntity.ok("Password changed successfully");
    }

    // Admin endpoints for user management
    @GetMapping
    public ResponseEntity<List<UserResponse>> getAllUsers(@RequestHeader("X-User-Id") Long currentUserId) {
        log.info("Getting all users by admin: {}", currentUserId);
        List<UserResponse> users = userService.getAllUsers(currentUserId);
        return ResponseEntity.ok(users);
    }

    @DeleteMapping("/{userId}")
    public ResponseEntity<String> deleteUser(
            @PathVariable Long userId,
            @RequestHeader("X-User-Id") Long currentUserId) {
        log.info("Deleting user: {} by admin: {}", userId, currentUserId);
        userService.deleteUser(userId, currentUserId);
        return ResponseEntity.ok("User deleted successfully");
    }

    @PutMapping("/{userId}/role")
    public ResponseEntity<UserResponse> updateUserRole(
            @PathVariable Long userId,
            @RequestBody UpdateUserRoleRequest request,
            @RequestHeader("X-User-Id") Long currentUserId) {
        log.info("Updating role for user: {} by admin: {}", userId, currentUserId);
        UserResponse response = userService.updateUserRole(userId, request.getRole(), currentUserId);
        return ResponseEntity.ok(response);
    }
}
