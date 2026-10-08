package com.virtualtune.service.impl;

import com.virtualtune.dto.ChangePasswordRequest;
import com.virtualtune.dto.UpdateProfileRequest;
import com.virtualtune.dto.UserDTO;
import com.virtualtune.exception.BadRequestException;
import com.virtualtune.exception.ResourceNotFoundException;
import com.virtualtune.model.User;
import com.virtualtune.repository.UserRepository;
import com.virtualtune.service.UserService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserServiceImpl(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getProfile(String username) {
        if (username == null || username.isBlank()) {
            throw new BadRequestException("Username is required");
        }
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return UserDTO.fromEntity(user);
    }

    @Override
    @Transactional
    public UserDTO updateProfile(String username, UpdateProfileRequest request) {
        if (username == null || username.isBlank()) {
            throw new BadRequestException("Username is required");
        }
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        if (request != null) {
            if (request.getFullName() != null && !request.getFullName().trim().isEmpty()) {
                user.setFullName(request.getFullName().trim());
            }
            if (request.getPhone() != null) {
                user.setPhone(request.getPhone().trim());
            }
            if (request.getAvatarUrl() != null) {
                user.setAvatarUrl(request.getAvatarUrl().trim());
            }
        }

        User saved = userRepository.save(user);
        return UserDTO.fromEntity(saved);
    }

    @Override
    @Transactional
    public void changePassword(String username, ChangePasswordRequest request) {
        if (username == null || username.isBlank()) {
            throw new BadRequestException("Username is required");
        }
        if (request == null || request.getCurrentPassword() == null || request.getNewPassword() == null) {
            throw new BadRequestException("Current password and new password are required");
        }

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));

        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            throw new BadRequestException("Current password is incorrect");
        }

        if (request.getNewPassword().length() < 6) {
            throw new BadRequestException("New password must be at least 6 characters in length");
        }

        if (request.getConfirmPassword() != null && !request.getNewPassword().equals(request.getConfirmPassword())) {
            throw new BadRequestException("New password and confirmation do not match");
        }

        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
    }
}
