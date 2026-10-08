package com.virtualtune.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.virtualtune.dto.FitmentCheckRequest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class FitmentControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void testGetFitmentOverview() throws Exception {
        mockMvc.perform(get("/api/fitment")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.totalCars", greaterThanOrEqualTo(6)))
                .andExpect(jsonPath("$.totalParts", greaterThanOrEqualTo(6)))
                .andExpect(jsonPath("$.accuracyRate", is("99.98%")))
                .andExpect(jsonPath("$.standardReference", containsString("DIN 70020")));
    }

    @Test
    public void testFitmentCheckMatchingDirectFitPass() throws Exception {
        FitmentCheckRequest req = new FitmentCheckRequest(null, "lamborghini-aventador", null, "BBS-FIR-992-TITAN");

        mockMvc.perform(post("/api/fitment/check")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("PASS")))
                .andExpect(jsonPath("$.compatible", is(true)))
                .andExpect(jsonPath("$.pcdMatch", is(true)))
                .andExpect(jsonPath("$.checks", hasSize(4)))
                .andExpect(jsonPath("$.checks[0].status", is("PASS")))
                .andExpect(jsonPath("$.checks[1].status", is("PASS")))
                .andExpect(jsonPath("$.checks[2].status", is("PASS")))
                .andExpect(jsonPath("$.checks[3].status", is("PASS")));
    }

    @Test
    public void testFitmentCheckPcdMismatchFail() throws Exception {
        // BBS FI-R is PCD 5x112, Porsche GT3 hub is 5x130
        FitmentCheckRequest req = new FitmentCheckRequest(null, "porsche-gt3", null, "BBS-FIR-992-TITAN");

        mockMvc.perform(post("/api/fitment/check")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("FAIL")))
                .andExpect(jsonPath("$.compatible", is(false)))
                .andExpect(jsonPath("$.pcdMatch", is(false)))
                .andExpect(jsonPath("$.checks[0].status", is("FAIL")))
                .andExpect(jsonPath("$.reasons[0]", containsString("PCD bolt pattern mismatch")));
    }

    @Test
    public void testFitmentCheckCenterBoreMismatchFail() throws Exception {
        // Volk TE37 has CB 66.1mm, Ferrari 458 has hub CB 67.1mm (smaller wheel bore cannot fit)
        FitmentCheckRequest req = new FitmentCheckRequest(null, "ferrari-458", null, "RAYS-TE37-ULTRA-20");

        mockMvc.perform(post("/api/fitment/check")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("FAIL")))
                .andExpect(jsonPath("$.compatible", is(false)))
                .andExpect(jsonPath("$.checks[3].status", is("FAIL")))
                .andExpect(jsonPath("$.checks[3].value", is("Bore Incompatible")));
    }

    @Test
    public void testFitmentCheckUniversalBrakeKitPass() throws Exception {
        // Brembo BBK 380mm requires min 19.0" wheel, BMW M4 stock wheel is 20.0"
        FitmentCheckRequest req = new FitmentCheckRequest(null, "bmw-m4-csl", null, "BRM-1N1.9042A2");

        mockMvc.perform(post("/api/fitment/check")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(req)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status", is("PASS")))
                .andExpect(jsonPath("$.compatible", is(true)))
                .andExpect(jsonPath("$.checks[1].status", is("PASS")))
                .andExpect(jsonPath("$.checks[1].value", containsString("380mm")));
    }

    @Test
    public void testFitmentCheckViaGetRequest() throws Exception {
        mockMvc.perform(get("/api/fitment/check")
                .param("carSlug", "bmw-m4-csl")
                .param("partSku", "BBS-FIR-992-TITAN")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.carSlug", is("bmw-m4-csl")))
                .andExpect(jsonPath("$.partSku", is("BBS-FIR-992-TITAN")))
                .andExpect(jsonPath("$.checks", hasSize(4)));
    }
}
