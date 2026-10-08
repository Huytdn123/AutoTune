package com.virtualtune.service.impl;

import com.virtualtune.dto.CreateQuotationRequest;
import com.virtualtune.dto.QuotationResponse;
import com.virtualtune.exception.BadRequestException;
import com.virtualtune.exception.ForbiddenException;
import com.virtualtune.exception.ResourceNotFoundException;
import com.virtualtune.model.*;
import com.virtualtune.repository.*;
import com.virtualtune.security.UserPrincipal;
import com.virtualtune.service.QuotationService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class QuotationServiceImpl implements QuotationService {

    private final QuotationRepository quotationRepository;
    private final UserRepository userRepository;
    private final CarBuildRepository carBuildRepository;
    private final PartRepository partRepository;
    private final GarageRepository garageRepository;
    private final WorkOrderRepository workOrderRepository;

    public QuotationServiceImpl(QuotationRepository quotationRepository,
                                UserRepository userRepository,
                                CarBuildRepository carBuildRepository,
                                PartRepository partRepository,
                                GarageRepository garageRepository,
                                WorkOrderRepository workOrderRepository) {
        this.quotationRepository = quotationRepository;
        this.userRepository = userRepository;
        this.carBuildRepository = carBuildRepository;
        this.partRepository = partRepository;
        this.garageRepository = garageRepository;
        this.workOrderRepository = workOrderRepository;
    }

    @Override
    public QuotationResponse createQuotation(CreateQuotationRequest request, UserPrincipal principal) {
        User customer = userRepository.findById(principal.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + principal.getUserId()));

        CarBuild carBuild = null;
        String carModel = request.getCarModel();

        if (request.getShareCode() != null && !request.getShareCode().trim().isEmpty()) {
            Optional<CarBuild> buildOpt = carBuildRepository.findByShareCode(request.getShareCode().trim());
            if (buildOpt.isPresent()) {
                carBuild = buildOpt.get();
                if (carModel == null || carModel.trim().isEmpty()) {
                    carModel = carBuild.getCar().getBrand() + " " + carBuild.getCar().getModel();
                }
            }
        }

        if (carModel == null || carModel.trim().isEmpty()) {
            carModel = "Custom Supercar Staging";
        }

        Garage garage = customer.getGarage();
        if (garage == null) {
            garage = garageRepository.findAll().stream().findFirst().orElse(null);
        }
        String garageName = garage != null ? garage.getGarageName() : "AutoTune Saigon Performance Hub";

        Quotation quotation = new Quotation();
        quotation.setCustomer(customer);
        quotation.setCarBuild(carBuild);
        quotation.setCarModel(carModel);
        quotation.setCustomerName(request.getCustomerName() != null ? request.getCustomerName() : customer.getFullName());
        quotation.setCustomerPhone(request.getCustomerPhone() != null ? request.getCustomerPhone() : customer.getPhone());
        quotation.setGarage(garage);
        quotation.setGarageName(garageName);
        quotation.setNotes(request.getNotes());
        quotation.setStatus("SENT");
        quotation.setLegalStatus("PASS");

        long quoteSeq = quotationRepository.count() + 101;
        quotation.setQuotationNumber("VT-QTE-2026-" + String.format("%03d", quoteSeq));

        // Process Parts & Items
        long partsTotal = 0L;
        List<QuotationItem> items = new ArrayList<>();

        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (CreateQuotationRequest.QuotationItemDto itemDto : request.getItems()) {
                QuotationItem item = new QuotationItem();
                item.setQuotation(quotation);
                item.setPartName(itemDto.getPartName() != null ? itemDto.getPartName() : "Performance Component");
                item.setPartSku(itemDto.getPartSku());
                item.setCategory(itemDto.getCategory() != null ? itemDto.getCategory() : "Component");
                item.setQuantity(itemDto.getQuantity() != null ? itemDto.getQuantity() : 1);
                item.setUnitPriceVnd(itemDto.getUnitPriceVnd() != null ? itemDto.getUnitPriceVnd() : 0L);
                item.setTotalPriceVnd(item.getUnitPriceVnd() * item.getQuantity());

                if (itemDto.getPartId() != null) {
                    partRepository.findById(itemDto.getPartId()).ifPresent(item::setPart);
                }

                items.add(item);
                partsTotal += item.getTotalPriceVnd();
            }
        } else if (request.getPartIds() != null && !request.getPartIds().isEmpty()) {
            List<Part> parts = partRepository.findAllById(request.getPartIds());
            for (Part part : parts) {
                QuotationItem item = new QuotationItem();
                item.setQuotation(quotation);
                item.setPart(part);
                item.setPartName(part.getPartName());
                item.setPartSku(part.getSku());
                item.setCategory(part.getCategory());
                item.setQuantity(1);
                item.setUnitPriceVnd(part.getPriceVnd() != null ? part.getPriceVnd() : 0L);
                item.setTotalPriceVnd(item.getUnitPriceVnd());

                items.add(item);
                partsTotal += item.getTotalPriceVnd();
            }
        } else if (carBuild != null && carBuild.getTotalEstimatedCost() != null && carBuild.getTotalEstimatedCost() > 0) {
            partsTotal = carBuild.getTotalEstimatedCost();
            QuotationItem item = new QuotationItem();
            item.setQuotation(quotation);
            item.setPartName(carBuild.getBuildName() + " Parts Package");
            item.setPartSku("BUILD-" + carBuild.getShareCode());
            item.setCategory("Package");
            item.setQuantity(1);
            item.setUnitPriceVnd(partsTotal);
            item.setTotalPriceVnd(partsTotal);
            items.add(item);
        } else {
            // Default baseline configuration package
            partsTotal = 345000000L;
            QuotationItem item = new QuotationItem();
            item.setQuotation(quotation);
            item.setPartName("OEM Performance Spec Package");
            item.setPartSku("VT-OEM-SPEC");
            item.setCategory("Package");
            item.setQuantity(1);
            item.setUnitPriceVnd(partsTotal);
            item.setTotalPriceVnd(partsTotal);
            items.add(item);
        }

        quotation.setPartsTotal(partsTotal);
        quotation.setLaborTotal(request.getLaborFee() != null ? request.getLaborFee() : 15000000L);
        quotation.setDiscountAmount(request.getDiscountAmount() != null ? request.getDiscountAmount() : 0L);
        quotation.setTaxAmount(request.getTaxAmount() != null ? request.getTaxAmount() : 0L);
        quotation.setFinalTotal(Math.max(0L, quotation.getPartsTotal() + quotation.getLaborTotal() - quotation.getDiscountAmount() + quotation.getTaxAmount()));
        quotation.setItems(items);

        Quotation saved = quotationRepository.save(quotation);
        return mapToResponse(saved);
    }

    @Override
    public QuotationResponse calculateEstimate(CreateQuotationRequest request, UserPrincipal principal) {
        long partsTotal = 0L;
        if (request.getItems() != null && !request.getItems().isEmpty()) {
            for (CreateQuotationRequest.QuotationItemDto itemDto : request.getItems()) {
                long unitPrice = itemDto.getUnitPriceVnd() != null ? itemDto.getUnitPriceVnd() : 0L;
                int qty = itemDto.getQuantity() != null ? itemDto.getQuantity() : 1;
                partsTotal += (unitPrice * qty);
            }
        } else if (request.getPartIds() != null && !request.getPartIds().isEmpty()) {
            List<Part> parts = partRepository.findAllById(request.getPartIds());
            for (Part part : parts) {
                partsTotal += (part.getPriceVnd() != null ? part.getPriceVnd() : 0L);
            }
        } else if (request.getShareCode() != null) {
            Optional<CarBuild> buildOpt = carBuildRepository.findByShareCode(request.getShareCode().trim());
            if (buildOpt.isPresent() && buildOpt.get().getTotalEstimatedCost() != null) {
                partsTotal = buildOpt.get().getTotalEstimatedCost();
            }
        }

        if (partsTotal == 0L) {
            partsTotal = 345000000L;
        }

        long labor = request.getLaborFee() != null ? request.getLaborFee() : 15000000L;
        long discount = request.getDiscountAmount() != null ? request.getDiscountAmount() : 0L;
        long tax = request.getTaxAmount() != null ? request.getTaxAmount() : 0L;
        long finalTotal = Math.max(0L, partsTotal + labor - discount + tax);

        QuotationResponse res = new QuotationResponse();
        res.setQuotationNumber("VT-QTE-ESTIMATE");
        res.setCarModel(request.getCarModel() != null ? request.getCarModel() : "Vehicle Configuration");
        res.setPartsTotal(partsTotal);
        res.setLaborTotal(labor);
        res.setDiscountAmount(discount);
        res.setTaxAmount(tax);
        res.setFinalTotal(finalTotal);
        res.setStatus("DRAFT");
        res.setLegalStatus("PASS");
        return res;
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuotationResponse> getAllQuotations(UserPrincipal principal) {
        if (isCustomerOnly(principal)) {
            return quotationRepository.findByCustomer_UserIdOrderByCreatedAtDesc(principal.getUserId())
                    .stream().map(this::mapToResponse).collect(Collectors.toList());
        }
        return quotationRepository.findAllByOrderByCreatedAtDesc()
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public List<QuotationResponse> getMyQuotations(UserPrincipal principal) {
        return quotationRepository.findByCustomer_UserIdOrderByCreatedAtDesc(principal.getUserId())
                .stream().map(this::mapToResponse).collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public QuotationResponse getQuotationById(Long id, UserPrincipal principal) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found with id: " + id));

        // Ownership authorization check
        if (isCustomerOnly(principal) && !quotation.getCustomer().getUserId().equals(principal.getUserId())) {
            throw new ForbiddenException("You do not have permission to access another customer's quotation");
        }

        return mapToResponse(quotation);
    }

    @Override
    public QuotationResponse updateQuotationStatus(Long id, String status, UserPrincipal principal) {
        Quotation quotation = quotationRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Quotation not found with id: " + id));

        String targetStatus = status != null ? status.trim().toUpperCase() : "";
        if (!List.of("DRAFT", "SENT", "APPROVED", "REJECTED", "EXPIRED").contains(targetStatus)) {
            throw new BadRequestException("Invalid quotation status: " + status + ". Allowed: DRAFT, SENT, APPROVED, REJECTED, EXPIRED");
        }

        // Ownership and Role Check
        if (isCustomerOnly(principal)) {
            if (!quotation.getCustomer().getUserId().equals(principal.getUserId())) {
                throw new ForbiddenException("You cannot modify status of another customer's quotation");
            }
            // Customer can only choose to APPROVE or REJECT
            if (!List.of("APPROVED", "REJECTED").contains(targetStatus)) {
                throw new ForbiddenException("Customers can only APPROVE or REJECT a quotation");
            }
        }

        quotation.setStatus(targetStatus);
        quotation.setUpdatedAt(LocalDateTime.now());
        Quotation saved = quotationRepository.save(quotation);
        return mapToResponse(saved);
    }

    private boolean isCustomerOnly(UserPrincipal principal) {
        if (principal == null) return true;
        String role = principal.getRole() != null ? principal.getRole().toUpperCase() : "";
        return "CUSTOMER".equals(role) || "CAR_OWNER".equals(role);
    }

    private QuotationResponse mapToResponse(Quotation q) {
        QuotationResponse dto = new QuotationResponse();
        dto.setId(q.getQuotationId());
        dto.setQuotationNumber(q.getQuotationNumber());
        if (q.getCustomer() != null) {
            dto.setCustomerId(q.getCustomer().getUserId());
            dto.setCustomerName(q.getCustomerName() != null ? q.getCustomerName() : q.getCustomer().getFullName());
            dto.setCustomerPhone(q.getCustomerPhone() != null ? q.getCustomerPhone() : q.getCustomer().getPhone());
            dto.setCustomerEmail(q.getCustomer().getEmail());
        }
        if (q.getCarBuild() != null) {
            dto.setCarBuildId(q.getCarBuild().getBuildId());
            dto.setCarBuildShareCode(q.getCarBuild().getShareCode());
        }
        dto.setCarModel(q.getCarModel());
        if (q.getGarage() != null) {
            dto.setGarageId(q.getGarage().getGarageId());
        }
        dto.setGarageName(q.getGarageName());
        dto.setPartsTotal(q.getPartsTotal());
        dto.setLaborTotal(q.getLaborTotal());
        dto.setDiscountAmount(q.getDiscountAmount());
        dto.setTaxAmount(q.getTaxAmount());
        dto.setFinalTotal(q.getFinalTotal());
        dto.setStatus(q.getStatus());
        dto.setLegalStatus(q.getLegalStatus());
        dto.setNotes(q.getNotes());
        dto.setCreatedAt(q.getCreatedAt());
        dto.setUpdatedAt(q.getUpdatedAt());

        // Check if work order exists
        Optional<WorkOrder> woOpt = workOrderRepository.findByQuotation_QuotationId(q.getQuotationId());
        if (woOpt.isPresent()) {
            dto.setHasWorkOrder(true);
            dto.setWorkOrderNumber(woOpt.get().getWorkOrderNumber());
            dto.setWorkOrderId(woOpt.get().getWorkOrderId());
        } else {
            dto.setHasWorkOrder(false);
        }

        if (q.getItems() != null) {
            dto.setItems(q.getItems().stream().map(it -> new QuotationResponse.ItemDto(
                    it.getItemId(),
                    it.getPart() != null ? it.getPart().getPartId() : null,
                    it.getPartName(),
                    it.getPartSku(),
                    it.getCategory(),
                    it.getQuantity(),
                    it.getUnitPriceVnd(),
                    it.getTotalPriceVnd()
            )).collect(Collectors.toList()));
        }

        return dto;
    }
}
