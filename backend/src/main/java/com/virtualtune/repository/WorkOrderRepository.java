package com.virtualtune.repository;

import com.virtualtune.model.WorkOrder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkOrderRepository extends JpaRepository<WorkOrder, Long> {
    Optional<WorkOrder> findByWorkOrderNumber(String workOrderNumber);
    Optional<WorkOrder> findByQuotation_QuotationId(Long quotationId);
    boolean existsByQuotation_QuotationId(Long quotationId);
    List<WorkOrder> findAllByOrderByCreatedAtDesc();
    List<WorkOrder> findByCustomer_UserIdOrderByCreatedAtDesc(Long userId);
    List<WorkOrder> findByTechnician_UserIdOrderByCreatedAtDesc(Long userId);
    List<WorkOrder> findByStatusOrderByCreatedAtDesc(String status);
}
