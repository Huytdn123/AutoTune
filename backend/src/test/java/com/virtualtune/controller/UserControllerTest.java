package com.virtualtune.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.virtualtune.dto.ChangePasswordRequest;
import com.virtualtune.dto.CreateBuildRequest;
import com.virtualtune.dto.LoginRequest;
import com.virtualtune.dto.RenameBuildRequest;
import com.virtualtune.dto.UpdateProfileRequest;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
class UserControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String obtainToken(String username, String password) throws Exception {
        LoginRequest req = new LoginRequest(username, password);
        MvcResult res = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();
        return objectMapper.readTree(res.getResponse().getContentAsString()).get("token").asText();
    }

    @Test
    @DisplayName("feat-010: Profile view, update, and password change lifecycle")
    void testUserProfileAndSecurityLifecycle() throws Exception {
        // 1. Unauthenticated profile access -> 401
        mockMvc.perform(get("/api/user/profile"))
                .andExpect(status().isUnauthorized());

        // 2. Authenticated profile view
        String customerToken = obtainToken("customer_vip", "password123");
        mockMvc.perform(get("/api/user/profile")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.username").value("customer_vip"))
                .andExpect(jsonPath("$.role").value("CAR_OWNER"));

        // 3. Update profile
        UpdateProfileRequest updateReq = new UpdateProfileRequest("VIP Tuner Renamed", "+84901234567", "/avatars/custom.png");
        mockMvc.perform(put("/api/user/profile")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updateReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("VIP Tuner Renamed"))
                .andExpect(jsonPath("$.phone").value("+84901234567"))
                .andExpect(jsonPath("$.avatar").value("/avatars/custom.png"));

        // 4. Change password with wrong current password -> 400
        ChangePasswordRequest wrongReq = new ChangePasswordRequest("wrongPass", "newSecret123", "newSecret123");
        mockMvc.perform(post("/api/user/change-password")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(wrongReq)))
                .andExpect(status().isBadRequest());

        // 5. Change password with mismatched confirmation -> 400
        ChangePasswordRequest mismatchReq = new ChangePasswordRequest("password123", "newSecret123", "differentSecret");
        mockMvc.perform(post("/api/user/change-password")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(mismatchReq)))
                .andExpect(status().isBadRequest());

        // 6. Valid password change -> 200
        ChangePasswordRequest validChange = new ChangePasswordRequest("password123", "superSecret999", "superSecret999");
        mockMvc.perform(post("/api/user/change-password")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validChange)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.success").value(true));

        // 7. Re-login with new password
        String updatedToken = obtainToken("customer_vip", "superSecret999");
        mockMvc.perform(get("/api/user/profile")
                        .header("Authorization", "Bearer " + updatedToken))
                .andExpect(status().isOk());

        // Restore password back to password123 for other tests
        ChangePasswordRequest restoreReq = new ChangePasswordRequest("superSecret999", "password123", "password123");
        mockMvc.perform(post("/api/user/change-password")
                        .header("Authorization", "Bearer " + updatedToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(restoreReq)))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("feat-010: Saved CarBuild rename and fork with ownership authorization")
    void testCarBuildRenameAndForkOwnership() throws Exception {
        String customerToken = obtainToken("customer_vip", "password123");
        String techToken = obtainToken("tech_lead", "password123");

        // 1. Customer creates a build
        CreateBuildRequest createReq = new CreateBuildRequest(
                "porsche-gt3-rs", "Initial Porsche Spec", "#00FF00", "Metallic", "#111111", "#000000", "[]", 240000L
        );
        createReq.setForceNew(true);
        MvcResult buildRes = mockMvc.perform(post("/api/builds")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(createReq)))
                .andExpect(status().isOk())
                .andReturn();

        String shareCode = objectMapper.readTree(buildRes.getResponse().getContentAsString()).get("shareCode").asText();

        // 2. Non-owner (tech_lead) attempts to rename customer's build -> 403 Forbidden
        RenameBuildRequest renameReq = new RenameBuildRequest("Hacked Spec Name");
        mockMvc.perform(patch("/api/builds/" + shareCode + "/rename")
                        .header("Authorization", "Bearer " + techToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(renameReq)))
                .andExpect(status().isForbidden());

        // 3. Owner renames own build -> 200 OK
        RenameBuildRequest ownerRename = new RenameBuildRequest("Track Ready GT3 RS");
        mockMvc.perform(patch("/api/builds/" + shareCode + "/rename")
                        .header("Authorization", "Bearer " + customerToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(ownerRename)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.buildName").value("Track Ready GT3 RS"));

        // 4. Owner forks build -> 200 OK with distinct shareCode
        MvcResult forkRes = mockMvc.perform(post("/api/builds/" + shareCode + "/fork")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.buildName").value("Track Ready GT3 RS (Fork)"))
                .andReturn();

        String forkedCode = objectMapper.readTree(forkRes.getResponse().getContentAsString()).get("shareCode").asText();
        org.junit.jupiter.api.Assertions.assertNotEquals(shareCode, forkedCode);

        // 5. Verify /api/builds/me alias returns both builds
        mockMvc.perform(get("/api/builds/me")
                        .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$").isArray());
    }
}
