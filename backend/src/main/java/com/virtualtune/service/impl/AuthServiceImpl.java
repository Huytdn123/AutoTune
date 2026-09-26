package com.virtualtune.service.impl;

import com.virtualtune.service.*;

import com.virtualtune.dto.*;
import com.virtualtune.exception.BadRequestException;
import com.virtualtune.exception.ForbiddenException;
import com.virtualtune.exception.ResourceNotFoundException;
import com.virtualtune.exception.UnauthorizedException;
import com.virtualtune.model.Garage;
import com.virtualtune.model.Role;
import com.virtualtune.model.User;
import com.virtualtune.repository.GarageRepository;
import com.virtualtune.repository.RoleRepository;
import com.virtualtune.repository.UserRepository;
import com.virtualtune.security.JwtUtil;
import com.virtualtune.security.SecurityUtils;
import com.virtualtune.security.UserPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final GarageRepository garageRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthServiceImpl(UserRepository userRepository,
            RoleRepository roleRepository,
            GarageRepository garageRepository,
            PasswordEncoder passwordEncoder,
            JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.garageRepository = garageRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @Override
    @Transactional
    public LoginResponse login(LoginRequest request) {
        if (request == null || request.getUsername() == null || request.getPassword() == null) {
            throw new BadRequestException("Username and password are required");
        }

        User user = userRepository.findByUsername(request.getUsername().trim())
                .orElseThrow(() -> new UnauthorizedException("Invalid username or password"));

        boolean matches = passwordEncoder.matches(request.getPassword(), user.getPasswordHash());

        // Transparent BCrypt migration for legacy plaintext passwords
        if (!matches && request.getPassword().equals(user.getPasswordHash())) {
            String newHash = passwordEncoder.encode(request.getPassword());
            user.setPasswordHash(newHash);
            userRepository.save(user);
            matches = true;
        }

        if (!matches) {
            throw new UnauthorizedException("Invalid username or password");
        }

        if (!"ACTIVE".equalsIgnoreCase(user.getStatus())) {
            throw new ForbiddenException("Account is locked or inactive");
        }

        user.setLastLogin(LocalDateTime.now());
        userRepository.save(user);

        UserDTO userDTO = UserDTO.fromEntity(user);

        List<String> permissions = new ArrayList<>();
        if (user.getRole() != null && user.getRole().getPermissions() != null) {
            user.getRole().getPermissions().forEach(p -> permissions.add(p.getPermissionCode()));
        }

        Integer gId = user.getGarage() != null ? user.getGarage().getGarageId() : null;
        String roleCode = user.getRole() != null ? user.getRole().getRoleCode() : "GUEST";

        String token = jwtUtil.generateToken(user.getUserId(), user.getUsername(), roleCode, gId, permissions);

        return LoginResponse.success("Login successful", token, userDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public UserDTO getMe() {
        Long currentUserId = SecurityUtils.getCurrentUserId();
        if (currentUserId == null) {
            throw new UnauthorizedException("Full authentication is required");
        }

        User user = userRepository.findById(currentUserId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return UserDTO.fromEntity(user);
    }

    @Override
    @Transactional(readOnly = true)
    public List<UserDTO> getAllUsers() {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new UnauthorizedException("Full authentication is required");
        }

        String role = currentUser.getRole();
        Integer garageId = currentUser.getGarageId();

        if ("ADMIN".equalsIgnoreCase(role)) {
            return userRepository.findAll().stream()
                    .map(UserDTO::fromEntity)
                    .collect(Collectors.toList());
        }

        if ("GARAGE_OWNER".equalsIgnoreCase(role)) {
            if (garageId == null) {
                return List.of();
            }
            return userRepository.findByGarage_GarageId(garageId).stream()
                    .map(UserDTO::fromEntity)
                    .collect(Collectors.toList());
        }

        // LEAD_TECHNICIAN and CAR_OWNER are forbidden from managing or viewing team
        // accounts
        throw new ForbiddenException("You do not have permission to access team user accounts");
    }

    @Override
    @Transactional
    public UserDTO createUser(CreateUserRequest request) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new UnauthorizedException("Full authentication is required");
        }

        if (!"ADMIN".equalsIgnoreCase(currentUser.getRole())
                && !"GARAGE_OWNER".equalsIgnoreCase(currentUser.getRole())) {
            throw new ForbiddenException("Only Garage Owners or Admins can create team accounts");
        }

        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("Email already exists");
        }

        Role role = roleRepository.findByRoleCode(request.getRole() != null ? request.getRole() : "LEAD_TECHNICIAN")
                .orElseThrow(() -> new ResourceNotFoundException("Role not found"));

        Garage garage = null;
        if ("GARAGE_OWNER".equalsIgnoreCase(currentUser.getRole())) {
            garage = garageRepository.findById(currentUser.getGarageId())
                    .orElseThrow(() -> new ResourceNotFoundException("Garage not found"));
        } else if (request.getGarageId() != null) {
            garage = garageRepository.findById(request.getGarageId()).orElse(null);
        }

        User newUser = new User();
        newUser.setUsername(request.getUsername().trim());
        newUser.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        newUser.setFullName(request.getFullName());
        newUser.setEmail(request.getEmail().trim());
        newUser.setPhone(request.getPhone());
        newUser.setRole(role);
        newUser.setGarage(garage);
        newUser.setAvatarUrl(request.getAvatarUrl() != null ? request.getAvatarUrl()
                : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150");
        newUser.setStatus("ACTIVE");

        User saved = userRepository.save(newUser);
        return UserDTO.fromEntity(saved);
    }

    @Override
    @Transactional
    public UserDTO updateUserRole(Long userId, UpdateRoleRequest request) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new UnauthorizedException("Full authentication is required");
        }

        if (!"ADMIN".equalsIgnoreCase(currentUser.getRole())
                && !"GARAGE_OWNER".equalsIgnoreCase(currentUser.getRole())) {
            throw new ForbiddenException("Only Garage Owners or Admins can update team roles");
        }

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Garage Data Isolation check
        if ("GARAGE_OWNER".equalsIgnoreCase(currentUser.getRole())) {
            if (targetUser.getGarage() == null
                    || !targetUser.getGarage().getGarageId().equals(currentUser.getGarageId())) {
                throw new ForbiddenException("Cannot modify users outside your own garage");
            }
            if ("ADMIN".equalsIgnoreCase(request.getRole())) {
                throw new ForbiddenException("Cannot assign ADMIN role");
            }
        }

        Role newRole = roleRepository.findByRoleCode(request.getRole())
                .orElseThrow(() -> new ResourceNotFoundException("Role not found: " + request.getRole()));

        targetUser.setRole(newRole);
        User saved = userRepository.save(targetUser);
        return UserDTO.fromEntity(saved);
    }

    @Override
    @Transactional
    public void deleteUser(Long userId) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new UnauthorizedException("Full authentication is required");
        }

        if (!"ADMIN".equalsIgnoreCase(currentUser.getRole())
                && !"GARAGE_OWNER".equalsIgnoreCase(currentUser.getRole())) {
            throw new ForbiddenException("Only Garage Owners or Admins can delete accounts");
        }

        if (currentUser.getUserId().equals(userId)) {
            throw new BadRequestException("Cannot delete your own account");
        }

        User targetUser = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        if ("GARAGE_OWNER".equalsIgnoreCase(currentUser.getRole())) {
            if (targetUser.getGarage() == null
                    || !targetUser.getGarage().getGarageId().equals(currentUser.getGarageId())) {
                throw new ForbiddenException("Cannot delete users outside your own garage");
            }
        }

        userRepository.delete(targetUser);
    }
}
