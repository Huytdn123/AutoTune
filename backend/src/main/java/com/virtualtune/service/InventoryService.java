package com.virtualtune.service;

import com.virtualtune.dto.ProcureRequest;
import com.virtualtune.dto.ProcureResponse;

import java.util.Map;

public interface InventoryService {
    Map<String, Object> getInventoryOverview();
    ProcureResponse procureParts(ProcureRequest req);
}
