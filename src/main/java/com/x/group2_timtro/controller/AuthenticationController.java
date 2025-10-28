package com.x.group2_timtro.controller;

import com.x.group2_timtro.dto.request.CreateUserRequest;
import com.x.group2_timtro.dto.request.LoginRequest;
import com.x.group2_timtro.dto.response.CreateUserResponse;
import com.x.group2_timtro.dto.response.LoginResponse;
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
}