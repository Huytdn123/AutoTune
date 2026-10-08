package com.virtualtune.controller;

import com.virtualtune.dto.CreateQuotationRequest;
import com.virtualtune.dto.QuotationResponse;
import com.virtualtune.security.UserPrincipal;
import com.virtualtune.service.QuotationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quotations")
public class QuotationController {

    private final QuotationService quotationService;

    public QuotationController(QuotationService quotationService) {
        this.quotationService = quotationService;
    }

    @PostMapping
    public ResponseEntity<QuotationResponse> createQuotation(
            @RequestBody CreateQuotationRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        QuotationResponse res = quotationService.createQuotation(request, principal);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PostMapping("/calculate")
    public ResponseEntity<QuotationResponse> calculateEstimate(
            @RequestBody CreateQuotationRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        QuotationResponse res = quotationService.calculateEstimate(request, principal);
        return ResponseEntity.ok(res);
    }

    @GetMapping
    public ResponseEntity<List<QuotationResponse>> getAllQuotations(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<QuotationResponse> list = quotationService.getAllQuotations(principal);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/my")
    public ResponseEntity<List<QuotationResponse>> getMyQuotations(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<QuotationResponse> list = quotationService.getMyQuotations(principal);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<QuotationResponse> getQuotationById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        QuotationResponse res = quotationService.getQuotationById(id, principal);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<QuotationResponse> updateQuotationStatus(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestBody(required = false) CreateQuotationRequest bodyStatus,
            @AuthenticationPrincipal UserPrincipal principal) {
        String effectiveStatus = status;
        if (effectiveStatus == null && bodyStatus != null && bodyStatus.getNotes() != null) {
            effectiveStatus = bodyStatus.getNotes();
        }
        QuotationResponse res = quotationService.updateQuotationStatus(id, effectiveStatus, principal);
        return ResponseEntity.ok(res);
    }
}
