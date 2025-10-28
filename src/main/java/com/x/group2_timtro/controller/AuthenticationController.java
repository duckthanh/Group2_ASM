package com.x.group2_timtro.controller;

import com.x.group2_timtro.dto.request.CreateUserRequest;
import com.x.group2_timtro.dto.request.DisableMfaRequest;
import com.x.group2_timtro.dto.request.EnableMfaRequest;
import com.x.group2_timtro.dto.request.LoginRequest;
import com.x.group2_timtro.dto.request.VerifyMfaRequest;
import com.x.group2_timtro.dto.response.CreateUserResponse;
import com.x.group2_timtro.dto.response.LoginResponse;
import com.x.group2_timtro.dto.response.MfaSetupResponse;
import com.x.group2_timtro.entity.User;
import com.x.group2_timtro.service.AuthenticationService;
import com.x.group2_timtro.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class AuthenticationController {

    private final AuthenticationService authenticationService;
    private final UserService userService;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        log.info("Login attempt for email: {}", request.email());
        try {
            LoginResponse response = authenticationService.login(request);
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("Login failed: {}", e.getMessage());
            throw e;
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<Void> logout(@RequestHeader("Authorization") String authHeader) {
        log.info("Logout attempt");
        try {
            String token = authHeader.replace("Bearer ", "");
            authenticationService.logout(token);
            return ResponseEntity.ok().build();
        } catch (ParseException e) {
            log.error("Logout failed: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/register")
    public ResponseEntity<CreateUserResponse> register(@RequestBody CreateUserRequest request) {
        log.info("Registration attempt for email: {}", request.getEmail());
        CreateUserResponse response = userService.createUser(request);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @PostMapping("/create-admin")
    public ResponseEntity<String> createAdmin(@RequestBody CreateUserRequest request) {
        log.info("Creating admin account: {}", request.getEmail());
        try {
            userService.createAdmin(request);
            return ResponseEntity.ok("Admin account created successfully! Email: " + request.getEmail() + ", Username: " + request.getUsername());
        } catch (Exception e) {
            log.error("Failed to create admin: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Failed to create admin: " + e.getMessage());
        }
    }

    @GetMapping("/mfa/setup")
    public ResponseEntity<MfaSetupResponse> initiateMfaSetup() {
        log.info("MFA setup initiation");
        try {
            User currentUser = userService.getCurrentUser();
            String appName = "Tim Tro App"; // Tên ứng dụng của bạn

            // Gọi service để tạo secret và mã QR
            MfaSetupResponse mfaSetup = authenticationService.generateMfaSetup(currentUser.getEmail(), appName);

            // Trả về JSON chứa secret và data URI của mã QR
            return ResponseEntity.ok(mfaSetup);
        } catch (Exception e) {
            log.error("MFA setup failed: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @PostMapping("/mfa/enable")
    public ResponseEntity<String> enableMfa(@RequestBody EnableMfaRequest request) {
        log.info("Enabling 2FA for user");
        try {
            User currentUser = userService.getCurrentUser();
            authenticationService.enableMfa(currentUser, request.getSecret(), request.getCode());
            return ResponseEntity.ok("2FA đã được bật thành công");
        } catch (RuntimeException e) {
            log.error("Failed to enable 2FA: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/mfa/disable")
    public ResponseEntity<String> disableMfa(@RequestBody DisableMfaRequest request) {
        log.info("Disabling 2FA for user");
        try {
            User currentUser = userService.getCurrentUser();
            authenticationService.disableMfa(currentUser, request.getCode());
            return ResponseEntity.ok("2FA đã được tắt thành công");
        } catch (RuntimeException e) {
            log.error("Failed to disable 2FA: {}", e.getMessage());
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/mfa/verify")
    public ResponseEntity<LoginResponse> verifyMfa(@RequestBody VerifyMfaRequest request) {
        log.info("Verifying 2FA code for email: {}", request.getEmail());
        try {
            LoginResponse response = authenticationService.verifyMfaAndLogin(request.getEmail(), request.getCode());
            return ResponseEntity.ok(response);
        } catch (RuntimeException e) {
            log.error("2FA verification failed: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping("/mfa/status")
    public ResponseEntity<Boolean> getMfaStatus() {
        try {
            User currentUser = userService.getCurrentUser();
            return ResponseEntity.ok(currentUser.isMfaEnabled());
        } catch (Exception e) {
            log.error("Failed to get MFA status: {}", e.getMessage());
            return ResponseEntity.badRequest().build();
        }
    }

    // DEBUG endpoint - Xóa sau khi deploy production!
    @PostMapping("/mfa/test-verify")
    public ResponseEntity<String> testVerifyCode(@RequestBody EnableMfaRequest request) {
        log.info("Testing MFA code verification");
        try {
            boolean isValid = authenticationService.verifyMfaCode(request.getSecret(), request.getCode());
            return ResponseEntity.ok("Code verification result: " + isValid);
        } catch (Exception e) {
            log.error("Test verification failed: {}", e.getMessage());
            return ResponseEntity.badRequest().body("Error: " + e.getMessage());
        }
    }
}


