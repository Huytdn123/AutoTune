package com.virtualtune.service.impl;

import com.virtualtune.service.*;

import com.virtualtune.dto.ProcureRequest;
import com.virtualtune.dto.ProcureResponse;
import com.virtualtune.exception.ForbiddenException;
import com.virtualtune.exception.UnauthorizedException;
import com.virtualtune.model.Part;
import com.virtualtune.repository.PartRepository;
import com.virtualtune.security.SecurityUtils;
import com.virtualtune.security.UserPrincipal;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class InventoryServiceImpl implements InventoryService {

    private final PartRepository partRepository;

    public InventoryServiceImpl(PartRepository partRepository) {
        this.partRepository = partRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public Map<String, Object> getInventoryOverview() {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new UnauthorizedException("Full authentication is required");
        }

        // CAR_OWNER cannot access internal inventory
        if ("CAR_OWNER".equalsIgnoreCase(currentUser.getRole())) {
            throw new ForbiddenException("End customers do not have permission to access internal garage inventory");
        }

        List<Part> parts = partRepository.findAll();

        List<Map<String, Object>> inventoryItems = parts.stream().map(p -> {
            Map<String, Object> item = new HashMap<>();
            item.put("sku", p.getSku());
            item.put("partName", p.getPartName());
            item.put("category", p.getCategory());
            item.put("stockQuantity", p.getStockQuantity());
            item.put("minThreshold", 3);
            item.put("unitCostVnd", (long) (p.getPriceVnd() * 0.75));
            item.put("retailPriceVnd", p.getPriceVnd());
            item.put("supplier", p.getBrand());
            item.put("status", p.getStockQuantity() != null && p.getStockQuantity() > 3 ? "IN_STOCK" : "LOW_STOCK");
            return item;
        }).collect(Collectors.toList());

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("totalSKUs", inventoryItems.size());
        res.put("inStockCount", inventoryItems.stream().filter(i -> "IN_STOCK".equals(i.get("status"))).count());
        res.put("data", inventoryItems);

        return res;
    }

    @Override
    @Transactional
    public ProcureResponse procureParts(ProcureRequest req) {
        UserPrincipal currentUser = SecurityUtils.getCurrentUser();
        if (currentUser == null) {
            throw new UnauthorizedException("Full authentication is required");
        }

        if (!"GARAGE_OWNER".equalsIgnoreCase(currentUser.getRole())
                && !"ADMIN".equalsIgnoreCase(currentUser.getRole())) {
            throw new ForbiddenException("Only Garage Owners can initiate procurement orders");
        }

        if (req != null && req.getSku() != null) {
            Optional<Part> partOpt = partRepository.findBySku(req.getSku());
            if (partOpt.isPresent()) {
                Part part = partOpt.get();
                int qtyToAdd = req.getQuantity() != null ? req.getQuantity() : 4;
                part.setStockQuantity((part.getStockQuantity() != null ? part.getStockQuantity() : 0) + qtyToAdd);
                partRepository.save(part);
            }
        }

        String orderNumber = "PO-" + (System.currentTimeMillis() % 100000);
        return new ProcureResponse(true, "Đã gửi đơn đặt hàng tự động tới nhà cung cấp B2B!", orderNumber);
    }
}
