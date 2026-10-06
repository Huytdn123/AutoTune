package com.virtualtune.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import static org.hamcrest.Matchers.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
public class CarControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Test
    public void testGetAllCars() throws Exception {
        mockMvc.perform(get("/api/cars")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(greaterThanOrEqualTo(6))))
                .andExpect(jsonPath("$[?(@.slug == 'ferrari-458')].brand", contains("Ferrari")))
                .andExpect(jsonPath("$[?(@.slug == 'porsche-gt3')].model", contains("911 GT3 RS")));
    }

    @Test
    public void testGetCarBySlug() throws Exception {
        mockMvc.perform(get("/api/cars/ferrari-458")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.brand", is("Ferrari")))
                .andExpect(jsonPath("$.model", is("458 Italia")))
                .andExpect(jsonPath("$.model3dPath", is("/models/ferrari.glb")))
                .andExpect(jsonPath("$.stockBoltPattern", is("5x114.3")))
                .andExpect(jsonPath("$.priceUsd", is(328000)));
    }
}
