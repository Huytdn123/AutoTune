package com.virtualtune.controller;

import com.virtualtune.model.Part;
import com.virtualtune.service.PartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/parts")
public class PartController {

    private final PartService partService;

    public PartController(PartService partService) {
        this.partService = partService;
    }

    @GetMapping
    public ResponseEntity<List<Part>> getAllParts(@RequestParam(required = false) String category) {
        return ResponseEntity.ok(partService.getPartsByCategory(category));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Part> getPartById(@PathVariable Long id) {
        Part part = partService.getPartById(id);
        return ResponseEntity.ok(part);
    }
}
