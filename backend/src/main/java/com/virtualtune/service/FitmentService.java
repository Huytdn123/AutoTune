package com.virtualtune.service;

import com.virtualtune.dto.FitmentCheckRequest;
import com.virtualtune.dto.FitmentCheckResponse;
import com.virtualtune.dto.FitmentOverviewResponse;

public interface FitmentService {
    FitmentCheckResponse checkFitment(FitmentCheckRequest request);
    FitmentOverviewResponse getOverview();
}
