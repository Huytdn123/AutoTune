package com.virtualtune.repository;

import com.virtualtune.model.Quotation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuotationRepository extends JpaRepository<Quotation, Long> {
    Optional<Quotation> findByQuotationNumber(String quotationNumber);
    List<Quotation> findAllByOrderByCreatedAtDesc();
    List<Quotation> findByCustomer_UserIdOrderByCreatedAtDesc(Long userId);
    List<Quotation> findByStatusOrderByCreatedAtDesc(String status);
    Optional<Quotation> findByCarBuild_BuildId(Long buildId);
    Optional<Quotation> findByCarBuild_ShareCode(String shareCode);
}
