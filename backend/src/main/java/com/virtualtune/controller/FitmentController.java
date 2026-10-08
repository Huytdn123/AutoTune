package com.virtualtune.controller;

import com.virtualtune.dto.FitmentCheckRequest;
import com.virtualtune.dto.FitmentCheckResponse;
import com.virtualtune.dto.FitmentOverviewResponse;
import com.virtualtune.service.FitmentService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/fitment")
public class FitmentController {

    private final FitmentService fitmentService;

    public FitmentController(FitmentService fitmentService) {
        this.fitmentService = fitmentService;
    }

    @GetMapping
    public ResponseEntity<FitmentOverviewResponse> getOverview() {
        return ResponseEntity.ok(fitmentService.getOverview());
    }

    @PostMapping("/check")
    public ResponseEntity<FitmentCheckResponse> checkFitmentPost(@RequestBody(required = false) FitmentCheckRequest request) {
        FitmentCheckRequest safeRequest = request != null ? request : new FitmentCheckRequest();
        return ResponseEntity.ok(fitmentService.checkFitment(safeRequest));
    }

    @GetMapping("/check")
    public ResponseEntity<FitmentCheckResponse> checkFitmentGet(
            @RequestParam(required = false) Long carId,
            @RequestParam(required = false) Long partId,
            @RequestParam(required = false) String carSlug,
            @RequestParam(required = false) String partSku
    ) {
        FitmentCheckRequest request = new FitmentCheckRequest(carId, carSlug, partId, partSku);
        return ResponseEntity.ok(fitmentService.checkFitment(request));
    }
}
