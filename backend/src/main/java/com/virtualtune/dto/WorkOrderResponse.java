package com.virtualtune.dto;

import java.time.LocalDateTime;

public class WorkOrderResponse {
    private Long id;
    private String workOrderNumber;
    private Long quotationId;
    private String quotationNumber;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private Long technicianId;
    private String technicianName;
    private String technicianRole;
    private Long carBuildId;
    private String carBuildShareCode;
    private String vehicleModel;
    private Integer garageId;
    private String garageName;
    private String bayNumber;
    private String status;
    private Integer progress;
    private String priority;
    private String notes;
    private Long partsTotal;
    private Long laborTotal;
    private Long finalTotal;
    private LocalDateTime startedAt;
    private LocalDateTime completedAt;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public WorkOrderResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getWorkOrderNumber() { return workOrderNumber; }
    public void setWorkOrderNumber(String workOrderNumber) { this.workOrderNumber = workOrderNumber; }
    public Long getQuotationId() { return quotationId; }
    public void setQuotationId(Long quotationId) { this.quotationId = quotationId; }
    public String getQuotationNumber() { return quotationNumber; }
    public void setQuotationNumber(String quotationNumber) { this.quotationNumber = quotationNumber; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    public Long getTechnicianId() { return technicianId; }
    public void setTechnicianId(Long technicianId) { this.technicianId = technicianId; }
    public String getTechnicianName() { return technicianName; }
    public void setTechnicianName(String technicianName) { this.technicianName = technicianName; }
    public String getTechnicianRole() { return technicianRole; }
    public void setTechnicianRole(String technicianRole) { this.technicianRole = technicianRole; }
    public Long getCarBuildId() { return carBuildId; }
    public void setCarBuildId(Long carBuildId) { this.carBuildId = carBuildId; }
    public String getCarBuildShareCode() { return carBuildShareCode; }
    public void setCarBuildShareCode(String carBuildShareCode) { this.carBuildShareCode = carBuildShareCode; }
    public String getVehicleModel() { return vehicleModel; }
    public void setVehicleModel(String vehicleModel) { this.vehicleModel = vehicleModel; }
    public Integer getGarageId() { return garageId; }
    public void setGarageId(Integer garageId) { this.garageId = garageId; }
    public String getGarageName() { return garageName; }
    public void setGarageName(String garageName) { this.garageName = garageName; }
    public String getBayNumber() { return bayNumber; }
    public void setBayNumber(String bayNumber) { this.bayNumber = bayNumber; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Long getPartsTotal() { return partsTotal; }
    public void setPartsTotal(Long partsTotal) { this.partsTotal = partsTotal; }
    public Long getLaborTotal() { return laborTotal; }
    public void setLaborTotal(Long laborTotal) { this.laborTotal = laborTotal; }
    public Long getFinalTotal() { return finalTotal; }
    public void setFinalTotal(Long finalTotal) { this.finalTotal = finalTotal; }
    public LocalDateTime getStartedAt() { return startedAt; }
    public void setStartedAt(LocalDateTime startedAt) { this.startedAt = startedAt; }
    public LocalDateTime getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDateTime completedAt) { this.completedAt = completedAt; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
