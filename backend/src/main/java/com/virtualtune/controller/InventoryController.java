package com.virtualtune.controller;

import com.virtualtune.dto.ProcureRequest;
import com.virtualtune.dto.ProcureResponse;
import com.virtualtune.service.InventoryService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService inventoryService;

    public InventoryController(InventoryService inventoryService) {
        this.inventoryService = inventoryService;
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('GARAGE_OWNER', 'LEAD_TECHNICIAN', 'ADMIN')")
    public ResponseEntity<Map<String, Object>> getInventory() {
        return ResponseEntity.ok(inventoryService.getInventoryOverview());
    }

    @PostMapping("/procure")
    @PreAuthorize("hasAnyRole('GARAGE_OWNER', 'ADMIN')")
    public ResponseEntity<ProcureResponse> procureParts(@RequestBody ProcureRequest req) {
        return ResponseEntity.ok(inventoryService.procureParts(req));
    }
}
