package com.virtualtune.service.impl;

import com.virtualtune.dto.CreateWorkOrderRequest;
import com.virtualtune.dto.WorkOrderResponse;
import com.virtualtune.exception.BadRequestException;
import com.virtualtune.exception.ConflictException;
import com.virtualtune.exception.ForbiddenException;
import com.virtualtune.exception.ResourceNotFoundException;
import com.virtualtune.model.Quotation;
import com.virtualtune.model.User;
import com.virtualtune.model.WorkOrder;
import com.virtualtune.repository.QuotationRepository;
import com.virtualtune.repository.UserRepository;
import com.virtualtune.repository.WorkOrderRepository;
import com.virtualtune.security.UserPrincipal;
import com.virtualtune.service.WorkOrderService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WorkOrderServiceImpl implements WorkOrderService {

    private final WorkOrderRepository workOrderRepository;
    private final QuotationRepository quotationRepository;
    private final UserRepository userRepository;

    public WorkOrderServiceImpl(WorkOrderRepository workOrderRepository,
                                QuotationRepository quotationRepository,
                                UserRepository userRepository) {
        this.workOrderRepository = workOrderRepository;
        this.quotationRepository = quotationRepository;
        this.userRepository = userRepository;
    }

    @Override
    public WorkOrderResponse createWorkOrder(CreateWorkOrderRequest request, UserPrincipal principal) {
        if (request.getQuotationId() == null) {
            throw new BadRequestException("quotationId is required to create a Work Order");
        }

        Quotation quotation = quotationRepository.findById(request.getQuotationId())
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found with id: " + request.getQuotationId()));

        // CRITICAL CONSTRAINT: Work order can ONLY be created from an APPROVED quotation
        if (!"APPROVED".equalsIgnoreCase(quotation.getStatus())) {
            throw new BadRequestException("Cannot create work order from quotation that is not APPROVED. Current quotation status: " + quotation.getStatus());
        }

        // Prevent duplicate work order creation for the same quotation
        if (workOrderRepository.existsByQuotation_QuotationId(quotation.getQuotationId())) {
            throw new ConflictException("A work order has already been dispatched for quotation: " + quotation.getQuotationNumber());
        }

        // Role check: Customer can only create work order for their own approved quotation
        if (isCustomerOnly(principal) && !quotation.getCustomer().getUserId().equals(principal.getUserId())) {
            throw new ForbiddenException("You cannot create a work order for another customer's quotation");
        }

        User technician = null;
        if (request.getTechnicianId() != null) {
            technician = userRepository.findById(request.getTechnicianId())
                    .orElseThrow(() -> new ResourceNotFoundException("Technician not found with id: " + request.getTechnicianId()));
        }

        long woSeq = workOrderRepository.count() + 101;
        String woNumber = "WO-2026-" + String.format("%03d", woSeq);

        WorkOrder wo = new WorkOrder();
        wo.setWorkOrderNumber(woNumber);
        wo.setQuotation(quotation);
        wo.setCustomer(quotation.getCustomer());
        wo.setTechnician(technician);
        wo.setCarBuild(quotation.getCarBuild());
        wo.setVehicleModel(quotation.getCarModel());
        wo.setGarage(quotation.getGarage());
        wo.setBayNumber(request.getBayNumber() != null ? request.getBayNumber() : "Bay 01 - Dyno & Performance Alignment");
        wo.setStatus(technician != null ? "IN_PROGRESS" : "PENDING");
        wo.setProgress(technician != null ? 15 : 0);
        wo.setPriority(request.getPriority() != null ? request.getPriority() : "NORMAL");
        wo.setNotes(request.getNotes() != null ? request.getNotes() : quotation.getNotes());

        if ("IN_PROGRESS".equalsIgnoreCase(wo.getStatus())) {
            wo.setStartedAt(LocalDateTime.now());
        }

        WorkOrder saved = workOrderRepository.save(wo);
        return mapToResponse(saved);
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkOrderResponse> getAllWorkOrders(UserPrincipal principal) {
        if (isCustomerOnly(principal)) {
            return workOrderRepository.findByCustomer_UserIdOrderByCreatedAtDesc(principal.getUserId())
                    .stream().map(this::mapToResponse).collect(Collectors.toList());
        }
        return workOrderRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<WorkOrderResponse> getMyWorkOrders(UserPrincipal principal) {
        if (isCustomerOnly(principal)) {
            return workOrderRepository.findByCustomer_UserIdOrderByCreatedAtDesc(principal.getUserId())
                    .stream().map(this::mapToResponse).collect(Collectors.toList());
        } else if (isTechnician(principal)) {
            return workOrderRepository.findByTechnician_UserIdOrderByCreatedAtDesc(principal.getUserId())
                    .stream().map(this::mapToResponse).collect(Collectors.toList());
        }
        return workOrderRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public WorkOrderResponse getWorkOrderById(Long id, UserPrincipal principal) {
        WorkOrder wo = workOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with id: " + id));

        // Ownership access control
        if (isCustomerOnly(principal) && !wo.getCustomer().getUserId().equals(principal.getUserId())) {
            throw new ForbiddenException("You do not have permission to view another customer's work order");
        }

        return mapToResponse(wo);
    }

    @Override
    public WorkOrderResponse assignTechnician(Long id, Long technicianId, String bayNumber, UserPrincipal principal) {
        // Only Garage Owner or Admin can assign technicians
        if (!isGarageOwnerOrAdmin(principal)) {
            throw new ForbiddenException("Only Garage Owner or Admin can assign technicians to work orders");
        }

        WorkOrder wo = workOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with id: " + id));

        User technician = userRepository.findById(technicianId)
                .orElseThrow(() -> new ResourceNotFoundException("Technician not found with id: " + technicianId));

        wo.setTechnician(technician);
        if (bayNumber != null && !bayNumber.trim().isEmpty()) {
            wo.setBayNumber(bayNumber.trim());
        }
        if ("PENDING".equalsIgnoreCase(wo.getStatus())) {
            wo.setStatus("IN_PROGRESS");
            if (wo.getProgress() == 0) {
                wo.setProgress(20);
            }
            if (wo.getStartedAt() == null) {
                wo.setStartedAt(LocalDateTime.now());
            }
        }
        wo.setUpdatedAt(LocalDateTime.now());

        WorkOrder saved = workOrderRepository.save(wo);
        return mapToResponse(saved);
    }

    @Override
    public WorkOrderResponse updateStatus(Long id, String status, Integer progress, String notes, UserPrincipal principal) {
        WorkOrder wo = workOrderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Work order not found with id: " + id));

        // Customers cannot modify work order execution status
        if (isCustomerOnly(principal)) {
            throw new ForbiddenException("Customers cannot modify work order operational execution status");
        }

        String targetStatus = status != null ? status.trim().toUpperCase() : wo.getStatus();
        if (!List.of("PENDING", "IN_PROGRESS", "COMPLETED", "CANCELLED").contains(targetStatus)) {
            throw new BadRequestException("Invalid work order status: " + status + ". Allowed: PENDING, IN_PROGRESS, COMPLETED, CANCELLED");
        }

        wo.setStatus(targetStatus);
        if (progress != null) {
            wo.setProgress(progress);
        } else if ("COMPLETED".equalsIgnoreCase(targetStatus)) {
            wo.setProgress(100);
        }
        if (notes != null) {
            wo.setNotes(notes);
        }
        wo.setUpdatedAt(LocalDateTime.now());

        WorkOrder saved = workOrderRepository.save(wo);
        return mapToResponse(saved);
    }

    private boolean isCustomerOnly(UserPrincipal principal) {
        if (principal == null) return true;
        String role = principal.getRole() != null ? principal.getRole().toUpperCase() : "";
        return "CUSTOMER".equals(role) || "CAR_OWNER".equals(role);
    }

    private boolean isTechnician(UserPrincipal principal) {
        if (principal == null) return false;
        String role = principal.getRole() != null ? principal.getRole().toUpperCase() : "";
        return "TECHNICIAN".equals(role) || "LEAD_TECHNICIAN".equals(role);
    }

    private boolean isGarageOwnerOrAdmin(UserPrincipal principal) {
        if (principal == null) return false;
        String role = principal.getRole() != null ? principal.getRole().toUpperCase() : "";
        return "GARAGE_OWNER".equals(role) || "ADMIN".equals(role);
    }

    private WorkOrderResponse mapToResponse(WorkOrder wo) {
        WorkOrderResponse dto = new WorkOrderResponse();
        dto.setId(wo.getWorkOrderId());
        dto.setWorkOrderNumber(wo.getWorkOrderNumber());
        if (wo.getQuotation() != null) {
            dto.setQuotationId(wo.getQuotation().getQuotationId());
            dto.setQuotationNumber(wo.getQuotation().getQuotationNumber());
            dto.setPartsTotal(wo.getQuotation().getPartsTotal());
            dto.setLaborTotal(wo.getQuotation().getLaborTotal());
            dto.setFinalTotal(wo.getQuotation().getFinalTotal());
        }
        if (wo.getCustomer() != null) {
            dto.setCustomerId(wo.getCustomer().getUserId());
            dto.setCustomerName(wo.getCustomer().getFullName());
            dto.setCustomerPhone(wo.getCustomer().getPhone());
        }
        if (wo.getTechnician() != null) {
            dto.setTechnicianId(wo.getTechnician().getUserId());
            dto.setTechnicianName(wo.getTechnician().getFullName());
            if (wo.getTechnician().getRole() != null) {
                dto.setTechnicianRole(wo.getTechnician().getRole().getRoleName());
            }
        }
        if (wo.getCarBuild() != null) {
            dto.setCarBuildId(wo.getCarBuild().getBuildId());
            dto.setCarBuildShareCode(wo.getCarBuild().getShareCode());
        }
        dto.setVehicleModel(wo.getVehicleModel());
        if (wo.getGarage() != null) {
            dto.setGarageId(wo.getGarage().getGarageId());
            dto.setGarageName(wo.getGarage().getGarageName());
        }
        dto.setBayNumber(wo.getBayNumber());
        dto.setStatus(wo.getStatus());
        dto.setProgress(wo.getProgress());
        dto.setPriority(wo.getPriority());
        dto.setNotes(wo.getNotes());
        dto.setStartedAt(wo.getStartedAt());
        dto.setCompletedAt(wo.getCompletedAt());
        dto.setCreatedAt(wo.getCreatedAt());
        dto.setUpdatedAt(wo.getUpdatedAt());
        return dto;
    }
}
