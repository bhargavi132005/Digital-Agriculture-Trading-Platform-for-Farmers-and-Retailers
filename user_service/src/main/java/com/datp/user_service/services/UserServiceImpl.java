package com.datp.user_service.services;

import com.datp.user_service.dtos.*;
import com.datp.user_service.entities.User;
import com.datp.user_service.exceptions.UserNotFoundException;
import com.datp.user_service.repositories.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    
    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public UserResponseDTO createUser(CreateUserRequestDTO request) {

        User user = User.builder()
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword())) // 🔐 Encode password
                .role(request.getRole())
                .active(true)
                .build();

        User savedUser = repository.save(user);
        return mapToResponse(savedUser);
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {
        return repository.findAll()
                .stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDTO getUserById(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> 
                    new UserNotFoundException("User not found with id: " + id)
                );
        return mapToResponse(user);
    }

    @Override
    public UserResponseDTO updateUser(Long id, UpdateUserRequestDTO request) {

        User user = repository.findById(id)
                .orElseThrow(() -> 
                    new UserNotFoundException("User not found with id: " + id)
                );

        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setRole(request.getRole());

        User updatedUser = repository.save(user);
        return mapToResponse(updatedUser);
    }

    @Override
    public void deleteUser(Long id) {
        User user = repository.findById(id)
                .orElseThrow(() -> 
                    new UserNotFoundException("User not found with id: " + id)
                );

        repository.delete(user);
    }

    private UserResponseDTO mapToResponse(User user) {
        return UserResponseDTO.builder()
                .id(user.getId())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .email(user.getEmail())
                .role(user.getRole())
                .active(user.isActive())
                .createdAt(user.getCreatedAt())
                .build();
    }
}