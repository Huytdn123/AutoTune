package com.virtualtune.dto;

/**
 * LoginResponse DTO - Kết quả trả về sau khi xác thực danh tính
 */
public class LoginResponse {

    private boolean success;
    private String message;
    private String token;
    private UserDTO user;

    public LoginResponse() {}

    public LoginResponse(boolean success, String message, String token, UserDTO user) {
        this.success = success;
        this.message = message;
        this.token = token;
        this.user = user;
    }

    public static LoginResponse failure(String message) {
        return new LoginResponse(false, message, null, null);
    }

    public static LoginResponse success(String message, String token, UserDTO user) {
        return new LoginResponse(true, message, token, user);
    }

    // Getters and Setters
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public UserDTO getUser() { return user; }
    public void setUser(UserDTO user) { this.user = user; }
}
