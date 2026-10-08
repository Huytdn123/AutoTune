package com.virtualtune.service;

import com.virtualtune.dto.CreateQuotationRequest;
import com.virtualtune.dto.QuotationResponse;
import com.virtualtune.security.UserPrincipal;

import java.util.List;

public interface QuotationService {
    QuotationResponse createQuotation(CreateQuotationRequest request, UserPrincipal principal);
    QuotationResponse calculateEstimate(CreateQuotationRequest request, UserPrincipal principal);
    List<QuotationResponse> getAllQuotations(UserPrincipal principal);
    List<QuotationResponse> getMyQuotations(UserPrincipal principal);
    QuotationResponse getQuotationById(Long id, UserPrincipal principal);
    QuotationResponse updateQuotationStatus(Long id, String status, UserPrincipal principal);
}
