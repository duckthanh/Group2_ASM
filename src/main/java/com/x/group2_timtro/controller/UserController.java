package com.x.group2_timtro.controller;

import com.x.group2_timtro.dto.request.CreateUserRequest;
import com.x.group2_timtro.dto.response.CreateUserResponse;
import com.x.group2_timtro.entity.User;
import com.x.group2_timtro.repository.UserRepository;
import com.x.group2_timtro.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
public class UserController {

    private final UserService userService;

    @PostMapping("/users")
    public CreateUserResponse createUser(@RequestBody CreateUserRequest request) {

        return userService.createUser(request);
    }

    @GetMapping("/users")
    public List<User> createUsers() {
        return userService.getUsers();
    }

}
