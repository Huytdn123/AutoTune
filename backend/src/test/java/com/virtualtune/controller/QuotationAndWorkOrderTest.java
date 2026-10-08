package com.virtualtune.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.virtualtune.dto.AssignTechnicianRequest;
import com.virtualtune.dto.CreateQuotationRequest;
import com.virtualtune.dto.CreateWorkOrderRequest;
import com.virtualtune.dto.LoginRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.List;
import java.util.Map;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class QuotationAndWorkOrderTest {

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
    public void testCreateQuotationAndCalculateTotals() throws Exception {
        String customerToken = loginAndGetToken("customer_vip", "password123");

        CreateQuotationRequest req = new CreateQuotationRequest();
        req.setCarModel("Porsche 911 GT3 RS");
        req.setLaborFee(15000000L);
        req.setDiscountAmount(20000000L);
        req.setTaxAmount(5000000L);
        req.setNotes("Track performance package staging");

        CreateQuotationRequest.QuotationItemDto item1 = new CreateQuotationRequest.QuotationItemDto(
                null, "BBS FI-R Titan Wheels", "BBS-FIR-992-TITAN", "Wheels", 1, 185000000L);
        CreateQuotationRequest.QuotationItemDto item2 = new CreateQuotationRequest.QuotationItemDto(
                null, "Akrapovic Evolution Line Titanium Exhaust", "AKR-EVO-TITAN-992", "Exhaust", 1, 160000000L);
        req.setItems(List.of(item1, item2));

        // 1. Calculate estimate endpoint (public/authenticated)
        mockMvc.perform(post("/api/quotations/calculate")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.partsTotal", is(345000000)))
                .andExpect(jsonPath("$.laborTotal", is(15000000)))
                .andExpect(jsonPath("$.discountAmount", is(20000000)))
                .andExpect(jsonPath("$.taxAmount", is(5000000)))
                .andExpect(jsonPath("$.finalTotal", is(345000000 + 15000000 - 20000000 + 5000000)));

        // 2. Create actual quotation in database
        MvcResult createRes = mockMvc.perform(post("/api/quotations")
                .header("Authorization", "Bearer " + customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.quotationNumber", startsWith("VT-QTE-")))
                .andExpect(jsonPath("$.status", is("SENT")))
                .andExpect(jsonPath("$.partsTotal", is(345000000)))
                .andExpect(jsonPath("$.finalTotal", is(345000000 + 15000000 - 20000000 + 5000000)))
                .andExpect(jsonPath("$.items", hasSize(2)))
                .andReturn();

        Map<?, ?> created = objectMapper.readValue(createRes.getResponse().getContentAsString(), Map.class);
        Number quoteId = (Number) created.get("id");

        // 3. Customer can view their newly created quotation
        mockMvc.perform(get("/api/quotations/" + quoteId)
                .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(quoteId.intValue())))
                .andExpect(jsonPath("$.carModel", is("Porsche 911 GT3 RS")));
    }

    @Test
    public void testCustomerOwnershipSecurityOnQuotation() throws Exception {
        String customerToken = loginAndGetToken("customer_vip", "password123");
        String adminToken = loginAndGetToken("admin", "password123");

        // 1. Unauthenticated request to /api/quotations -> 401 Unauthorized
        mockMvc.perform(get("/api/quotations"))
                .andExpect(status().isUnauthorized());

        // 2. Admin creates a private quotation for Admin
        CreateQuotationRequest adminReq = new CreateQuotationRequest();
        adminReq.setCarModel("McLaren 720S");
        adminReq.setLaborFee(25000000L);
        adminReq.setDiscountAmount(0L);

        MvcResult adminRes = mockMvc.perform(post("/api/quotations")
                .header("Authorization", "Bearer " + adminToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(adminReq)))
                .andExpect(status().isCreated())
                .andReturn();

        Map<?, ?> adminQuote = objectMapper.readValue(adminRes.getResponse().getContentAsString(), Map.class);
        Number adminQuoteId = (Number) adminQuote.get("id");

        // 3. Customer VIP tries to access Admin's quotation -> 403 Forbidden
        mockMvc.perform(get("/api/quotations/" + adminQuoteId)
                .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isForbidden());

        // 4. Admin can view the quotation -> 200 OK
        mockMvc.perform(get("/api/quotations/" + adminQuoteId)
                .header("Authorization", "Bearer " + adminToken))
                .andExpect(status().isOk());
    }

    @Test
    public void testCannotCreateWorkOrderFromUnapprovedQuotation() throws Exception {
        String customerToken = loginAndGetToken("customer_vip", "password123");
        String garageOwnerToken = loginAndGetToken("admin_garage", "password123");

        // 1. Create a quotation in SENT status
        CreateQuotationRequest req = new CreateQuotationRequest();
        req.setCarModel("Ferrari 458 Italia");
        req.setLaborFee(10000000L);

        MvcResult quoteRes = mockMvc.perform(post("/api/quotations")
                .header("Authorization", "Bearer " + customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();

        Map<?, ?> quoteMap = objectMapper.readValue(quoteRes.getResponse().getContentAsString(), Map.class);
        Number quoteId = (Number) quoteMap.get("id");

        // 2. Attempt to create a Work Order from the non-approved quotation -> 400 Bad Request
        CreateWorkOrderRequest woReq = new CreateWorkOrderRequest();
        woReq.setQuotationId(quoteId.longValue());
        woReq.setNotes("Early attempt before approval");

        mockMvc.perform(post("/api/work-orders")
                .header("Authorization", "Bearer " + garageOwnerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(woReq)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message", containsString("not APPROVED")));
    }

    @Test
    public void testWorkOrderLifecycleFromApprovedQuote() throws Exception {
        String customerToken = loginAndGetToken("customer_vip", "password123");
        String garageOwnerToken = loginAndGetToken("admin_garage", "password123");
        String techLeadToken = loginAndGetToken("tech_lead", "password123");

        // 1. Create quote
        CreateQuotationRequest req = new CreateQuotationRequest();
        req.setCarModel("BMW M4 Competition");
        req.setLaborFee(12000000L);

        MvcResult quoteRes = mockMvc.perform(post("/api/quotations")
                .header("Authorization", "Bearer " + customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isCreated())
                .andReturn();

        Map<?, ?> quoteMap = objectMapper.readValue(quoteRes.getResponse().getContentAsString(), Map.class);
        Number quoteId = (Number) quoteMap.get("id");

        // 2. Customer approves the quotation
        mockMvc.perform(put("/api/quotations/" + quoteId + "/status?status=APPROVED")
                .header("Authorization", "Bearer " + customerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("APPROVED")));

        // 3. Create Work Order from approved quotation
        CreateWorkOrderRequest woReq = new CreateWorkOrderRequest();
        woReq.setQuotationId(quoteId.longValue());
        woReq.setBayNumber("Bay 03 - Laser Kinematics");
        woReq.setPriority("HIGH");
        woReq.setNotes("BMW M4 suspension & camber alignment");

        MvcResult woRes = mockMvc.perform(post("/api/work-orders")
                .header("Authorization", "Bearer " + garageOwnerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(woReq)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.workOrderNumber", startsWith("WO-2026-")))
                .andExpect(jsonPath("$.status", is("PENDING")))
                .andExpect(jsonPath("$.vehicleModel", is("BMW M4 Competition")))
                .andReturn();

        Map<?, ?> woMap = objectMapper.readValue(woRes.getResponse().getContentAsString(), Map.class);
        Number woId = (Number) woMap.get("id");

        // 4. Prevent duplicate Work Order for the same quotation -> 409 Conflict
        mockMvc.perform(post("/api/work-orders")
                .header("Authorization", "Bearer " + garageOwnerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(woReq)))
                .andExpect(status().isConflict());

        // 5. Customer cannot assign technician -> 403 Forbidden
        AssignTechnicianRequest assignReq = new AssignTechnicianRequest();
        assignReq.setTechnicianId(3L); // tech_lead
        mockMvc.perform(put("/api/work-orders/" + woId + "/assign")
                .header("Authorization", "Bearer " + customerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(assignReq)))
                .andExpect(status().isForbidden());

        // 6. Garage Owner assigns technician -> 200 OK, status transitions to IN_PROGRESS
        mockMvc.perform(put("/api/work-orders/" + woId + "/assign")
                .header("Authorization", "Bearer " + garageOwnerToken)
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(assignReq)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("IN_PROGRESS")))
                .andExpect(jsonPath("$.technicianName", is("Long Nguyen")));

        // 7. Technician updates execution status to COMPLETED with 100% progress
        mockMvc.perform(put("/api/work-orders/" + woId + "/status?status=COMPLETED&progress=100")
                .header("Authorization", "Bearer " + techLeadToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("COMPLETED")))
                .andExpect(jsonPath("$.progress", is(100)));
    }
}
