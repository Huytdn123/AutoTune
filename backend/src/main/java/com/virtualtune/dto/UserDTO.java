package com.virtualtune.dto;

import com.virtualtune.model.User;
import java.util.ArrayList;
import java.util.List;

public class UserDTO {
    private Long id;
    private String username;
    private String fullName;
    private String email;
    private String phone;
    private String role;
    private Integer garageId;
    private String garageName;
    private String avatar;
    private String status;
    private List<String> permissions = new ArrayList<>();

    public UserDTO() {}

    public UserDTO(Long id, String username, String fullName, String email, String phone,
                   String role, Integer garageId, String garageName, String avatar,
                   String status, List<String> permissions) {
        this.id = id;
        this.username = username;
        this.fullName = fullName;
        this.email = email;
        this.phone = phone;
        this.role = role;
        this.garageId = garageId;
        this.garageName = garageName;
        this.avatar = avatar;
        this.status = status;
        this.permissions = permissions != null ? permissions : new ArrayList<>();
    }

    public static UserDTO fromEntity(User user) {
        if (user == null) return null;
        List<String> perms = new ArrayList<>();
        if (user.getRole() != null && user.getRole().getPermissions() != null) {
            user.getRole().getPermissions().forEach(p -> perms.add(p.getPermissionCode()));
        }

        return new UserDTO(
                user.getUserId(),
                user.getUsername(),
                user.getFullName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole() != null ? user.getRole().getRoleCode() : "GUEST",
                user.getGarage() != null ? user.getGarage().getGarageId() : null,
                user.getGarage() != null ? user.getGarage().getGarageName() : null,
                user.getAvatarUrl(),
                user.getStatus(),
                perms
        );
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Integer getGarageId() { return garageId; }
    public void setGarageId(Integer garageId) { this.garageId = garageId; }

    public String getGarageName() { return garageName; }
    public void setGarageName(String garageName) { this.garageName = garageName; }

    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<String> getPermissions() { return permissions; }
    public void setPermissions(List<String> permissions) { this.permissions = permissions; }
}
