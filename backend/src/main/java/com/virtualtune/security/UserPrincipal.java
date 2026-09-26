package com.virtualtune.security;

import com.virtualtune.model.User;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;

public class UserPrincipal implements UserDetails {

    private static final long serialVersionUID = 1L;
    private final Long userId;
    private final String username;
    private final String password;
    private final String fullName;
    private final String email;
    private final String role;
    private final Integer garageId;
    private final String garageName;
    private final String avatarUrl;
    private final Collection<? extends GrantedAuthority> authorities;
    private final List<String> permissions;

    public UserPrincipal(Long userId, String username, String password, String fullName,
            String email, String role, Integer garageId, String garageName,
            String avatarUrl, Collection<? extends GrantedAuthority> authorities,
            List<String> permissions) {
        this.userId = userId;
        this.username = username;
        this.password = password;
        this.fullName = fullName;
        this.email = email;
        this.role = role;
        this.garageId = garageId;
        this.garageName = garageName;
        this.avatarUrl = avatarUrl;
        this.authorities = authorities;
        this.permissions = permissions;
    }

    public static UserPrincipal create(User user) {
        List<GrantedAuthority> authorities = new ArrayList<>();
        List<String> permCodes = new ArrayList<>();

        if (user.getRole() != null) {
            String roleCode = user.getRole().getRoleCode();
            authorities.add(new SimpleGrantedAuthority("ROLE_" + roleCode));

            if (user.getRole().getPermissions() != null) {
                user.getRole().getPermissions().forEach(p -> {
                    authorities.add(new SimpleGrantedAuthority(p.getPermissionCode()));
                    permCodes.add(p.getPermissionCode());
                });
            }
        }

        Integer gId = user.getGarage() != null ? user.getGarage().getGarageId() : null;
        String gName = user.getGarage() != null ? user.getGarage().getGarageName() : null;

        return new UserPrincipal(
                user.getUserId(),
                user.getUsername(),
                user.getPasswordHash(),
                user.getFullName(),
                user.getEmail(),
                user.getRole() != null ? user.getRole().getRoleCode() : "GUEST",
                gId,
                gName,
                user.getAvatarUrl(),
                authorities,
                permCodes);
    }

    public Long getUserId() {
        return userId;
    }

    public String getFullName() {
        return fullName;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public Integer getGarageId() {
        return garageId;
    }

    public String getGarageName() {
        return garageName;
    }

    public String getAvatarUrl() {
        return avatarUrl;
    }

    public List<String> getPermissions() {
        return permissions;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return authorities;
    }

    @Override
    public String getPassword() {
        return password;
    }

    @Override
    public String getUsername() {
        return username;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
