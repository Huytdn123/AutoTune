package com.virtualtune.controller;

import com.virtualtune.dto.AssignTechnicianRequest;
import com.virtualtune.dto.CreateWorkOrderRequest;
import com.virtualtune.dto.UpdateWorkOrderStatusRequest;
import com.virtualtune.dto.WorkOrderResponse;
import com.virtualtune.security.UserPrincipal;
import com.virtualtune.service.WorkOrderService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/work-orders")
public class WorkOrderController {

    private final WorkOrderService workOrderService;

    public WorkOrderController(WorkOrderService workOrderService) {
        this.workOrderService = workOrderService;
    }

    @PostMapping
    public ResponseEntity<WorkOrderResponse> createWorkOrder(
            @RequestBody CreateWorkOrderRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        WorkOrderResponse res = workOrderService.createWorkOrder(request, principal);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @PostMapping("/dispatch")
    public ResponseEntity<WorkOrderResponse> dispatchWorkOrder(
            @RequestBody CreateWorkOrderRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        WorkOrderResponse res = workOrderService.createWorkOrder(request, principal);
        return ResponseEntity.status(HttpStatus.CREATED).body(res);
    }

    @GetMapping
    public ResponseEntity<List<WorkOrderResponse>> getAllWorkOrders(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<WorkOrderResponse> list = workOrderService.getAllWorkOrders(principal);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/my")
    public ResponseEntity<List<WorkOrderResponse>> getMyWorkOrders(
            @AuthenticationPrincipal UserPrincipal principal) {
        List<WorkOrderResponse> list = workOrderService.getMyWorkOrders(principal);
        return ResponseEntity.ok(list);
    }

    @GetMapping("/{id}")
    public ResponseEntity<WorkOrderResponse> getWorkOrderById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        WorkOrderResponse res = workOrderService.getWorkOrderById(id, principal);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}/assign")
    public ResponseEntity<WorkOrderResponse> assignTechnician(
            @PathVariable Long id,
            @RequestBody AssignTechnicianRequest request,
            @AuthenticationPrincipal UserPrincipal principal) {
        WorkOrderResponse res = workOrderService.assignTechnician(
                id, request.getTechnicianId(), request.getBayNumber(), principal);
        return ResponseEntity.ok(res);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<WorkOrderResponse> updateStatus(
            @PathVariable Long id,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Integer progress,
            @RequestBody(required = false) UpdateWorkOrderStatusRequest body,
            @AuthenticationPrincipal UserPrincipal principal) {
        String effectiveStatus = status;
        Integer effectiveProgress = progress;
        String notes = null;

        if (body != null) {
            if (effectiveStatus == null) effectiveStatus = body.getStatus();
            if (effectiveProgress == null) effectiveProgress = body.getProgress();
            notes = body.getNotes();
        }

        WorkOrderResponse res = workOrderService.updateStatus(id, effectiveStatus, effectiveProgress, notes, principal);
        return ResponseEntity.ok(res);
    }
}
