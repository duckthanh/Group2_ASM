package com.x.group2_timtro.service;

import com.x.group2_timtro.common.UserStatus;
import com.x.group2_timtro.dto.request.CreateUserRequest;
import com.x.group2_timtro.dto.response.CreateUserResponse;
import com.x.group2_timtro.entity.Role;
import com.x.group2_timtro.entity.User;
import com.x.group2_timtro.repository.RoleRepository;
import com.x.group2_timtro.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.List;

import static com.x.group2_timtro.common.UserType.USER;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public CreateUserResponse createUser(CreateUserRequest request) {
        //kiem tra email exist
        if(userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());

        PasswordEncoder passwordEncoder = new BCryptPasswordEncoder();
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setUsername(request.getUsername());
        user.setStatus(UserStatus.ACTIVE);

        Role role = roleRepository.findByName(USER)
                .orElseGet(() -> roleRepository.save(Role.builder()
                        .name(USER)
                        .build()));
        user.addRole(role);
        userRepository.save(user);

        return CreateUserResponse.builder()
                .email(user.getEmail())
                .username(user.getUsername())
                .build();
    }

@PreAuthorize("hasAuthority('USER')")
    public List<User> getUsers() {
        return userRepository.findAll();
}

}
