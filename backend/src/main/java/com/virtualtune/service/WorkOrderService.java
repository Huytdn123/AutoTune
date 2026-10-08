package com.virtualtune.service;

import com.virtualtune.dto.CreateWorkOrderRequest;
import com.virtualtune.dto.WorkOrderResponse;
import com.virtualtune.security.UserPrincipal;

import java.util.List;

public interface WorkOrderService {
    WorkOrderResponse createWorkOrder(CreateWorkOrderRequest request, UserPrincipal principal);
    List<WorkOrderResponse> getAllWorkOrders(UserPrincipal principal);
    List<WorkOrderResponse> getMyWorkOrders(UserPrincipal principal);
    WorkOrderResponse getWorkOrderById(Long id, UserPrincipal principal);
    WorkOrderResponse assignTechnician(Long id, Long technicianId, String bayNumber, UserPrincipal principal);
    WorkOrderResponse updateStatus(Long id, String status, Integer progress, String notes, UserPrincipal principal);
}
