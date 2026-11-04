package com.virtualtune;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.options;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.header;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("prod")
public class DeploymentSecurityTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    @DisplayName("Production: /h2-console is blocked and not publicly accessible")
    void testH2ConsoleBlockedInProduction() throws Exception {
        mockMvc.perform(get("/h2-console"))
                .andExpect(status().is4xxClientError());
    }

    @Test
    @DisplayName("Production: CORS preflight allows vercel domain")
    void testCorsPreflightAllowsVercelDomain() throws Exception {
        mockMvc.perform(options("/api/cars")
                        .header("Origin", "https://virtual-tune.vercel.app")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().string("Access-Control-Allow-Origin", "https://virtual-tune.vercel.app"));
    }

    @Test
    @DisplayName("Production: CORS preflight rejects unauthorized unknown origin")
    void testCorsPreflightRejectsUnknownOrigin() throws Exception {
        mockMvc.perform(options("/api/cars")
                        .header("Origin", "https://malicious-attacker-site.com")
                        .header("Access-Control-Request-Method", "GET"))
                .andExpect(header().doesNotExist("Access-Control-Allow-Origin"));
    }
}

