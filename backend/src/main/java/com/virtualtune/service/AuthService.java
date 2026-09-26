package com.virtualtune.service;

import com.virtualtune.dto.*;
import java.util.List;

public interface AuthService {
    LoginResponse login(LoginRequest request);

    UserDTO getMe();

    List<UserDTO> getAllUsers();

    UserDTO createUser(CreateUserRequest request);

    UserDTO updateUserRole(Long userId, UpdateRoleRequest request);

    void deleteUser(Long userId);
}
