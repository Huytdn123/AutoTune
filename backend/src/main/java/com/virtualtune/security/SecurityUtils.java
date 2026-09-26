package com.virtualtune.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Component
public class SecurityUtils {

    public static UserPrincipal getCurrentUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth != null && auth.getPrincipal() instanceof UserPrincipal userPrincipal) {
            return userPrincipal;
        }
        return null;
    }

    public static Long getCurrentUserId() {
        UserPrincipal user = getCurrentUser();
        return user != null ? user.getUserId() : null;
    }

    public static Integer getCurrentGarageId() {
        UserPrincipal user = getCurrentUser();
        return user != null ? user.getGarageId() : null;
    }

    public static String getCurrentRole() {
        UserPrincipal user = getCurrentUser();
        return user != null ? user.getRole() : null;
    }

    public static boolean isGarageOwner() {
        return "GARAGE_OWNER".equalsIgnoreCase(getCurrentRole());
    }

    public static boolean isLeadTech() {
        return "LEAD_TECHNICIAN".equalsIgnoreCase(getCurrentRole());
    }

    public static boolean isCarOwner() {
        return "CAR_OWNER".equalsIgnoreCase(getCurrentRole());
    }

    public static boolean isAdmin() {
        return "ADMIN".equalsIgnoreCase(getCurrentRole());
    }
}
