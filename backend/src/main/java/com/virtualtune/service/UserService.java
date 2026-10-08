package com.virtualtune.service;

import com.virtualtune.dto.ChangePasswordRequest;
import com.virtualtune.dto.UpdateProfileRequest;
import com.virtualtune.dto.UserDTO;

public interface UserService {
    UserDTO getProfile(String username);
    UserDTO updateProfile(String username, UpdateProfileRequest request);
    void changePassword(String username, ChangePasswordRequest request);
}
