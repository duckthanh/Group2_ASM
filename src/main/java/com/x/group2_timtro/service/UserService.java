package com.x.group2_timtro.service;

import com.x.group2_timtro.common.UserStatus;
import com.x.group2_timtro.dto.request.ChangePasswordRequest;
import com.x.group2_timtro.dto.request.CreateUserRequest;
import com.x.group2_timtro.dto.request.UpdateUserRequest;
import com.x.group2_timtro.dto.response.CreateUserResponse;
import com.x.group2_timtro.dto.response.UserResponse;
import com.x.group2_timtro.entity.User;
import com.x.group2_timtro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
@SuppressWarnings("null")
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    // Lấy user hiện tại từ SecurityContext
    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("User chưa đăng nhập");
        }
        
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User không tồn tại"));
    }

    public CreateUserResponse createUser(CreateUserRequest request) {
        //kiem tra email exist
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUsername(request.getUsername());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setAddress(request.getAddress());
        user.setRole("USER");
        user.setStatus(UserStatus.ACTIVE);

        userRepository.save(user);

        return CreateUserResponse.builder()
                .id(user.getId())
                .username(user.getName())  // Use getName() to get actual username
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .role(user.getRole())
                .message("User created successfully")
                .build();
    }

    public UserResponse getUserById(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToUserResponse(user);
    }

    public UserResponse updateUser(Long userId, UpdateUserRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getPhoneNumber() != null) {
            user.setPhoneNumber(request.getPhoneNumber());
        }
        if (request.getAddress() != null) {
            user.setAddress(request.getAddress());
        }

        User updatedUser = userRepository.save(user);
        return mapToUserResponse(updatedUser);
    }

    public void changePassword(Long userId, ChangePasswordRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        log.info("Changing password for user: {}", userId);
        log.debug("Current password hash in DB starts with: {}", 
            user.getPassword() != null && user.getPassword().length() > 10 
                ? user.getPassword().substring(0, 10) : "null");
        
        // Kiểm tra mật khẩu hiện tại
        // Hỗ trợ cả mật khẩu đã mã hóa và chưa mã hóa (legacy users)
        boolean passwordMatches = false;
        
        try {
            // Thử so sánh với BCrypt (mật khẩu đã mã hóa)
            passwordMatches = passwordEncoder.matches(request.getCurrentPassword(), user.getPassword());
            log.debug("BCrypt match result: {}", passwordMatches);
        } catch (Exception e) {
            log.warn("BCrypt match failed: {}", e.getMessage());
            // Nếu lỗi, có thể là mật khẩu plain text
            passwordMatches = request.getCurrentPassword().equals(user.getPassword());
            log.debug("Plain text match result: {}", passwordMatches);
        }
        
        // Nếu vẫn không khớp, thử so sánh plain text
        if (!passwordMatches) {
            passwordMatches = request.getCurrentPassword().equals(user.getPassword());
            log.debug("Second plain text match attempt: {}", passwordMatches);
        }
        
        if (!passwordMatches) {
            log.error("Password verification failed for user: {}", userId);
            throw new RuntimeException("Mật khẩu hiện tại không đúng");
        }

        log.info("Password verified successfully, updating to new password");
        // Cập nhật mật khẩu mới (luôn mã hóa)
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        log.info("Password changed successfully for user: {}", userId);
    }

    public CreateUserResponse createAdmin(CreateUserRequest request) {
        // Kiểm tra xem email đã tồn tại chưa (bất kỳ user nào)
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }

        System.out.println("Creating admin account for email: " + request.getEmail());

        User admin = new User();
        admin.setUsername(request.getUsername());
        admin.setEmail(request.getEmail());
        admin.setPassword(passwordEncoder.encode(request.getPassword()));
        admin.setPhoneNumber(request.getPhoneNumber());
        admin.setAddress(request.getAddress());
        admin.setRole("ADMIN"); // Set role là ADMIN
        admin.setStatus(UserStatus.ACTIVE);

        User savedAdmin = userRepository.save(admin);

        return CreateUserResponse.builder()
                .id(savedAdmin.getId())
                .username(savedAdmin.getName())  // Use getName() to get actual username
                .email(savedAdmin.getEmail())
                .phoneNumber(savedAdmin.getPhoneNumber())
                .address(savedAdmin.getAddress())
                .role(savedAdmin.getRole())
                .message("Admin account created successfully")
                .build();
    }

    // Admin methods for user management
    public List<UserResponse> getAllUsers(Long adminId) {
        // Kiểm tra quyền admin
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        
        if (!"ADMIN".equals(admin.getRole())) {
            throw new RuntimeException("Only admin can access this resource");
        }
        
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::mapToUserResponse)
                .collect(java.util.stream.Collectors.toList());
    }

    public void deleteUser(Long userId, Long adminId) {
        // Kiểm tra quyền admin
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        
        if (!"ADMIN".equals(admin.getRole())) {
            throw new RuntimeException("Only admin can delete users");
        }
        
        // Không cho phép admin xóa chính mình
        if (userId.equals(adminId)) {
            throw new RuntimeException("Admin cannot delete themselves");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        userRepository.delete(user);
        log.info("User {} deleted by admin {}", userId, adminId);
    }

    public UserResponse updateUserRole(Long userId, String newRole, Long adminId) {
        // Kiểm tra quyền admin
        User admin = userRepository.findById(adminId)
                .orElseThrow(() -> new RuntimeException("Admin not found"));
        
        if (!"ADMIN".equals(admin.getRole())) {
            throw new RuntimeException("Only admin can update user roles");
        }
        
        // Validate role
        if (!"USER".equals(newRole) && !"ADMIN".equals(newRole)) {
            throw new RuntimeException("Invalid role. Must be USER or ADMIN");
        }
        
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        user.setRole(newRole);
        User updatedUser = userRepository.save(user);
        
        log.info("User {} role updated to {} by admin {}", userId, newRole, adminId);
        return mapToUserResponse(updatedUser);
    }

    private UserResponse mapToUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .username(user.getName())  // Use getName() to get actual username
                .email(user.getEmail())
                .phoneNumber(user.getPhoneNumber())
                .address(user.getAddress())
                .role(user.getRole())
                .build();
    }

}
