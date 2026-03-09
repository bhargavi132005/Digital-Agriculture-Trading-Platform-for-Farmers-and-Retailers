package com.example.usermanagement.controller;

import com.example.usermanagement.dto.UserRequestDTO;
import com.example.usermanagement.dto.UserResponseDTO;
import com.example.usermanagement.service.UserService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UserService userService;

    public AuthController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/register/farmer")
    public UserResponseDTO registerFarmer(@Valid @RequestBody UserRequestDTO request) {
        return userService.registerFarmer(request);
    }

    @PostMapping("/register/retailer")
    public UserResponseDTO registerRetailer(@Valid @RequestBody UserRequestDTO request) {
        return userService.registerRetailer(request);
    }
    @GetMapping("/users/{id}")
public UserResponseDTO getUserById(@PathVariable Long id) {
    return userService.getUserById(id);
}
}