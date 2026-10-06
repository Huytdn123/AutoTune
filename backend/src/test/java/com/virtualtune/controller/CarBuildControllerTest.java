package com.virtualtune.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.virtualtune.dto.CreateBuildRequest;
import com.virtualtune.dto.LoginRequest;
import com.virtualtune.model.CarBuild;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.*;
import static org.junit.jupiter.api.Assertions.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class CarBuildControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testCreateAndGetBuild() throws Exception {
        CreateBuildRequest req = new CreateBuildRequest(
                "ferrari-458",
                "Custom Test Ferrari",
                "#F5C400",
                "Metallic",
                "#1A1A1A",
                "#1A1A1A",
                "[\"BBS-FIR-992-TITAN\"]",
                345000L
        );

        MvcResult result = mockMvc.perform(post("/api/builds")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shareCode", startsWith("VT-F458-")))
                .andExpect(jsonPath("$.buildName", is("Custom Test Ferrari")))
                .andExpect(jsonPath("$.bodyColor", is("#F5C400")))
                .andReturn();

        CarBuild created = objectMapper.readValue(result.getResponse().getContentAsString(), CarBuild.class);

        mockMvc.perform(get("/api/builds/" + created.getShareCode())
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.shareCode", is(created.getShareCode())))
                .andExpect(jsonPath("$.car.brand", is("Ferrari")))
                .andExpect(jsonPath("$.bodyColor", is("#F5C400")))
                .andExpect(jsonPath("$.rimColor", is("#1A1A1A")));
    }

    @Test
    public void testAuthenticatedUserOptionBReuseAndFork() throws Exception {
        // 1. Authenticate customer_vip
        LoginRequest loginReq = new LoginRequest("customer_vip", "password123");
        MvcResult loginRes = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(loginReq)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode loginJson = objectMapper.readTree(loginRes.getResponse().getContentAsString());
        String token = loginJson.get("token").asText();

        // 2. Initial build creation
        CreateBuildRequest req1 = new CreateBuildRequest(
                "porsche-gt3",
                "VIP Track Porsche",
                "#0A1A6E",
                "Metallic",
                "#CCCCCC",
                "#C8D8F0",
                "[\"AKR-EVO-TITAN-992\"]",
                250000L
        );

        MvcResult res1 = mockMvc.perform(post("/api/builds")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req1)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.username", is("customer_vip")))
                .andReturn();

        JsonNode build1 = objectMapper.readTree(res1.getResponse().getContentAsString());
        String code1 = build1.get("shareCode").asText();
        assertNotNull(code1);

        // 3. Option B smart reuse: same user saves identical config without forceNew -> reuses code1
        MvcResult res2 = mockMvc.perform(post("/api/builds")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req1)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode build2 = objectMapper.readTree(res2.getResponse().getContentAsString());
        String code2 = build2.get("shareCode").asText();
        assertEquals(code1, code2, "Identical configuration for same user should reuse existing share code");

        // 4. ForceNew fork: same config with forceNew=true -> generates a brand new code
        CreateBuildRequest reqForce = new CreateBuildRequest(
                "porsche-gt3",
                "VIP Track Porsche Fork",
                "#0A1A6E",
                "Metallic",
                "#CCCCCC",
                "#C8D8F0",
                "[\"AKR-EVO-TITAN-992\"]",
                250000L
        );
        reqForce.setForceNew(true);

        MvcResult res3 = mockMvc.perform(post("/api/builds")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqForce)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode build3 = objectMapper.readTree(res3.getResponse().getContentAsString());
        String code3 = build3.get("shareCode").asText();
        assertNotEquals(code1, code3, "forceNew must generate a new unique share code");

        // 5. Config change: different body color -> generates a brand new code
        CreateBuildRequest reqMod = new CreateBuildRequest(
                "porsche-gt3",
                "VIP Track Porsche Green",
                "#1B4D1B",
                "Metallic",
                "#CCCCCC",
                "#C8D8F0",
                "[\"AKR-EVO-TITAN-992\"]",
                250000L
        );

        MvcResult res4 = mockMvc.perform(post("/api/builds")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(reqMod)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode build4 = objectMapper.readTree(res4.getResponse().getContentAsString());
        String code4 = build4.get("shareCode").asText();
        assertNotEquals(code1, code4, "Modified configuration must generate a new unique share code");

        // 6. Verify user builds endpoint /api/builds/my
        mockMvc.perform(get("/api/builds/my")
                .header("Authorization", "Bearer " + token)
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(3))));
    }
}
