package com.virtualtune;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.virtualtune.dto.LoginRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
public class AuthVerificationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    @DisplayName("1. GARAGE_OWNER login successfully and returns valid JWT and role")
    void testGarageOwnerLogin() throws Exception {
        LoginRequest req = new LoginRequest("admin_garage", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.user.username", is("admin_garage")))
                .andExpect(jsonPath("$.user.role", is("GARAGE_OWNER")));
    }

    @Test
    @DisplayName("2. LEAD_TECHNICIAN login successfully and returns valid JWT and role")
    void testLeadTechnicianLogin() throws Exception {
        LoginRequest req = new LoginRequest("tech_lead", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.user.username", is("tech_lead")))
                .andExpect(jsonPath("$.user.role", is("LEAD_TECHNICIAN")));
    }

    @Test
    @DisplayName("3. CAR_OWNER login successfully and returns valid JWT and role")
    void testCarOwnerLogin() throws Exception {
        LoginRequest req = new LoginRequest("customer_vip", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success", is(true)))
                .andExpect(jsonPath("$.token", notNullValue()))
                .andExpect(jsonPath("$.user.username", is("customer_vip")))
                .andExpect(jsonPath("$.user.role", is("CAR_OWNER")));
    }

    @Test
    @DisplayName("4. Failed login with wrong password returns 401 Unauthorized")
    void testWrongPassword() throws Exception {
        LoginRequest req = new LoginRequest("admin_garage", "wrongpassword");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized())
                .andExpect(jsonPath("$.message", containsString("Invalid username or password")));
    }

    @Test
    @DisplayName("5. Failed login with unknown username returns 401 Unauthorized")
    void testUnknownUser() throws Exception {
        LoginRequest req = new LoginRequest("unknown_user_999", "password123");

        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("6. GET /api/auth/me without token returns 401 Unauthorized")
    void testGetMeWithoutToken() throws Exception {
        mockMvc.perform(get("/api/auth/me"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("7. GET /api/auth/me with valid Bearer token returns UserDTO")
    void testGetMeWithToken() throws Exception {
        LoginRequest req = new LoginRequest("admin_garage", "password123");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        String token = com.jayway.jsonpath.JsonPath.read(loginResult.getResponse().getContentAsString(), "$.token");

        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username", is("admin_garage")))
                .andExpect(jsonPath("$.fullName", is("Tuan Tran")))
                .andExpect(jsonPath("$.role", is("GARAGE_OWNER")));
    }

    @Test
    @DisplayName("8. RBAC enforcement: CAR_OWNER cannot access /api/auth/users (403 Forbidden)")
    void testCarOwnerCannotAccessTeamUsers() throws Exception {
        LoginRequest req = new LoginRequest("customer_vip", "password123");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        String token = com.jayway.jsonpath.JsonPath.read(loginResult.getResponse().getContentAsString(), "$.token");

        mockMvc.perform(get("/api/auth/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("9. RBAC enforcement: GARAGE_OWNER can access /api/auth/users (200 OK)")
    void testGarageOwnerCanAccessTeamUsers() throws Exception {
        LoginRequest req = new LoginRequest("admin_garage", "password123");
        MvcResult loginResult = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        String token = com.jayway.jsonpath.JsonPath.read(loginResult.getResponse().getContentAsString(), "$.token");

        mockMvc.perform(get("/api/auth/users")
                        .header("Authorization", "Bearer " + token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", is(not(empty()))));
    }

    @Test
    @DisplayName("10. Invalid token is rejected with 401 Unauthorized")
    void testInvalidToken() throws Exception {
        mockMvc.perform(get("/api/auth/me")
                        .header("Authorization", "Bearer invalid.fake.token.here"))
                .andExpect(status().isUnauthorized());
    }
}
