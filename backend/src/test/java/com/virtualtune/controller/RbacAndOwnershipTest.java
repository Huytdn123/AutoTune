package com.virtualtune.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.virtualtune.dto.CreateBuildRequest;
import com.virtualtune.dto.LoginRequest;
import com.virtualtune.dto.ProcureRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class RbacAndOwnershipTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    private String loginAndGetToken(String username, String password) throws Exception {
        LoginRequest req = new LoginRequest(username, password);
        MvcResult res = mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();

        Map<?, ?> map = objectMapper.readValue(res.getResponse().getContentAsString(), Map.class);
        return (String) map.get("token");
    }

    @Test
    public void testInventoryRoleBasedAccessControl() throws Exception {
        String customerToken = loginAndGetToken("customer_vip", "password123");
        String garageOwnerToken = loginAndGetToken("admin_garage", "password123");
        String adminToken = loginAndGetToken("admin", "password123");

        // 1. Unauthenticated request to /api/inventory -> 401
        mockMvc.perform(get("/api/inventory"))
                .andExpect(status().isUnauthorized());

        // 2. Customer VIP attempting to access garage inventory -> 403 Forbidden
        mockMvc.perform(get("/api/inventory")
                .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        // 3. Garage Owner accessing inventory -> 200 OK
        mockMvc.perform(get("/api/inventory")
                .header("Authorization", "Bearer " + garageOwnerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalSKUs", greaterThanOrEqualTo(6)));

        // 4. Admin accessing inventory -> 200 OK
        mockMvc.perform(get("/api/inventory")
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());

        // 5. Customer VIP attempting to procure parts -> 403 Forbidden
        ProcureRequest procure = new ProcureRequest();
        procure.setSku("BBS-FIR-992-TITAN");
        procure.setQuantity(5);
        procure.setNotes("Customer unauthorized attempt");
        mockMvc.perform(post("/api/inventory/procure")
                .header("Authorization", "Bearer " + customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(procure)))
                .andExpect(status().isForbidden());

        // 6. Garage Owner procuring parts -> 200 OK
        mockMvc.perform(post("/api/inventory/procure")
                .header("Authorization", "Bearer " + garageOwnerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(procure)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderNumber", notNullValue()));
    }

    @Test
    public void testCarBuildOwnershipAndProtection() throws Exception {
        String customerToken = loginAndGetToken("customer_vip", "password123");
        String otherUserToken = loginAndGetToken("tech_lead", "password123");
        String adminToken = loginAndGetToken("admin", "password123");

        // 1. Unauthenticated access to /api/builds/my -> 401
        mockMvc.perform(get("/api/builds/my"))
                .andExpect(status().isUnauthorized());

        // 2. Customer creates a private build
        CreateBuildRequest req = new CreateBuildRequest();
        req.setCarSlug("ferrari-458");
        req.setBuildName("Customer Ownership Test Build");
        req.setBodyColor("#123456");
        req.setBodyFinish("SATIN");
        req.setRimColor("#FFFFFF");
        req.setGlassColor("#000000");
        req.setSelectedPartsJson("[]");
        req.setTotalEstimatedCost(200000000L);

        MvcResult createRes = mockMvc.perform(post("/api/builds")
                .header("Authorization", "Bearer " + customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.user.username", is("customer_vip")))
                .andReturn();

        Map<?, ?> buildData = objectMapper.readValue(createRes.getResponse().getContentAsString(), Map.class);
        String shareCode = (String) buildData.get("shareCode");

        // 3. Customer retrieves /api/builds/my -> contains the new build
        mockMvc.perform(get("/api/builds/my")
                .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[?(@.shareCode == '" + shareCode + "')]", hasSize(1)));

        // 4. Other user (tech_lead) attempts to delete customer's build -> 403 Forbidden (Ownership protection!)
        mockMvc.perform(delete("/api/builds/" + shareCode)
                .header("Authorization", "Bearer " + otherUserToken))
                .andExpect(status().isForbidden());

        // 5. Unauthenticated delete attempt -> 401 Unauthorized
        mockMvc.perform(delete("/api/builds/" + shareCode))
                .andExpect(status().isUnauthorized());

        // 6. Owner (customer_vip) deletes their own build -> 204 No Content
        mockMvc.perform(delete("/api/builds/" + shareCode)
                .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isNoContent());

        // 7. Verify build is now gone
        mockMvc.perform(get("/api/builds/" + shareCode))
                .andExpect(status().isNotFound());

        // 8. Admin override test: Create another build by customer, admin deletes it
        req.setBuildName("Admin Override Test Build");
        MvcResult secondBuildRes = mockMvc.perform(post("/api/builds")
                .header("Authorization", "Bearer " + customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andReturn();
        String secondCode = (String) objectMapper.readValue(secondBuildRes.getResponse().getContentAsString(), Map.class).get("shareCode");

        mockMvc.perform(delete("/api/builds/" + secondCode)
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isNoContent());
    }
}
