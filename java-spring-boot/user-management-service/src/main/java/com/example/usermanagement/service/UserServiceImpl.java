package com.example.usermanagement.service;

import com.example.usermanagement.dto.UserRequestDTO;
import com.example.usermanagement.dto.UserResponseDTO;
import com.example.usermanagement.entity.User;
import com.example.usermanagement.entity.FarmerProfile;
import com.example.usermanagement.entity.RetailerProfile;
import com.example.usermanagement.repository.UserRepository;
import com.example.usermanagement.repository.FarmerProfileRepository;
import com.example.usermanagement.repository.RetailerProfileRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final FarmerProfileRepository farmerProfileRepository;
    private final RetailerProfileRepository retailerProfileRepository;

    public UserServiceImpl(UserRepository userRepository,
                           FarmerProfileRepository farmerProfileRepository,
                           RetailerProfileRepository retailerProfileRepository) {
        this.userRepository = userRepository;
        this.farmerProfileRepository = farmerProfileRepository;
        this.retailerProfileRepository = retailerProfileRepository;
    }

    @Override
    public UserResponseDTO createUser(UserRequestDTO request) {

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(request.getPassword());
        user.setRole(request.getRole());

        User savedUser = userRepository.save(user);

        return new UserResponseDTO(savedUser);
    }

    @Override
    public UserResponseDTO registerFarmer(UserRequestDTO request) {

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(request.getPassword());
        user.setRole("FARMER");

        User savedUser = userRepository.save(user);

        FarmerProfile profile = new FarmerProfile();
        profile.setUserId(savedUser.getId());
        profile.setFarmName(request.getFarmName());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());
        profile.setState(request.getState());
        profile.setZip(request.getZip());
        profile.setVerificationStatus("PENDING");

        farmerProfileRepository.save(profile);

        return new UserResponseDTO(savedUser);
    }

    @Override
    public UserResponseDTO registerRetailer(UserRequestDTO request) {

        User user = new User();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPhone(request.getPhone());
        user.setPasswordHash(request.getPassword());
        user.setRole("RETAILER");

        User savedUser = userRepository.save(user);

        RetailerProfile profile = new RetailerProfile();
        profile.setUserId(savedUser.getId());
        profile.setBusinessName(request.getBusinessName());
        profile.setAddress(request.getAddress());
        profile.setCity(request.getCity());
        profile.setState(request.getState());
        profile.setZip(request.getZip());

        retailerProfileRepository.save(profile);

        return new UserResponseDTO(savedUser);
    }

    @Override
    public List<UserResponseDTO> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(UserResponseDTO::new)
                .collect(Collectors.toList());
    }

    @Override
    public UserResponseDTO getUserById(Long id) {

        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return new UserResponseDTO(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }
}