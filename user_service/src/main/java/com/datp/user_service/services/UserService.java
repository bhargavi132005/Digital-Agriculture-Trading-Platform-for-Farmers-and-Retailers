package  com.datp.user_service.services;

import com.datp.user_service.dtos.*;



import java.util.List;

import com.datp.user_service.dtos.CreateUserRequestDTO;


public interface UserService {

    UserResponseDTO createUser(CreateUserRequestDTO request);

    List<UserResponseDTO> getAllUsers();

    UserResponseDTO getUserById(Long id);

     UserResponseDTO updateUser(Long id, UpdateUserRequestDTO request);

    void deleteUser(Long id);
}