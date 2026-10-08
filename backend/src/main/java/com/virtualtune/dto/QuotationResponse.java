package com.virtualtune.dto;

import java.time.LocalDateTime;
import java.util.List;

public class QuotationResponse {
    private Long id;
    private String quotationNumber;
    private Long customerId;
    private String customerName;
    private String customerPhone;
    private String customerEmail;
    private Long carBuildId;
    private String carBuildShareCode;
    private String carModel;
    private Integer garageId;
    private String garageName;
    private Long partsTotal;
    private Long laborTotal;
    private Long discountAmount;
    private Long taxAmount;
    private Long finalTotal;
    private String status;
    private String legalStatus;
    private String notes;
    private List<ItemDto> items;
    private Boolean hasWorkOrder;
    private String workOrderNumber;
    private Long workOrderId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public static class ItemDto {
        private Long itemId;
        private Long partId;
        private String partName;
        private String partSku;
        private String category;
        private Integer quantity;
        private Long unitPriceVnd;
        private Long totalPriceVnd;

        public ItemDto() {}

        public ItemDto(Long itemId, Long partId, String partName, String partSku, String category,
                       Integer quantity, Long unitPriceVnd, Long totalPriceVnd) {
            this.itemId = itemId;
            this.partId = partId;
            this.partName = partName;
            this.partSku = partSku;
            this.category = category;
            this.quantity = quantity;
            this.unitPriceVnd = unitPriceVnd;
            this.totalPriceVnd = totalPriceVnd;
        }

        public Long getItemId() { return itemId; }
        public void setItemId(Long itemId) { this.itemId = itemId; }
        public Long getPartId() { return partId; }
        public void setPartId(Long partId) { this.partId = partId; }
        public String getPartName() { return partName; }
        public void setPartName(String partName) { this.partName = partName; }
        public String getPartSku() { return partSku; }
        public void setPartSku(String partSku) { this.partSku = partSku; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
        public Integer getQuantity() { return quantity; }
        public void setQuantity(Integer quantity) { this.quantity = quantity; }
        public Long getUnitPriceVnd() { return unitPriceVnd; }
        public void setUnitPriceVnd(Long unitPriceVnd) { this.unitPriceVnd = unitPriceVnd; }
        public Long getTotalPriceVnd() { return totalPriceVnd; }
        public void setTotalPriceVnd(Long totalPriceVnd) { this.totalPriceVnd = totalPriceVnd; }
    }

    public QuotationResponse() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getQuotationNumber() { return quotationNumber; }
    public void setQuotationNumber(String quotationNumber) { this.quotationNumber = quotationNumber; }
    public Long getCustomerId() { return customerId; }
    public void setCustomerId(Long customerId) { this.customerId = customerId; }
    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }
    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }
    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }
    public Long getCarBuildId() { return carBuildId; }
    public void setCarBuildId(Long carBuildId) { this.carBuildId = carBuildId; }
    public String getCarBuildShareCode() { return carBuildShareCode; }
    public void setCarBuildShareCode(String carBuildShareCode) { this.carBuildShareCode = carBuildShareCode; }
    public String getCarModel() { return carModel; }
    public void setCarModel(String carModel) { this.carModel = carModel; }
    public Integer getGarageId() { return garageId; }
    public void setGarageId(Integer garageId) { this.garageId = garageId; }
    public String getGarageName() { return garageName; }
    public void setGarageName(String garageName) { this.garageName = garageName; }
    public Long getPartsTotal() { return partsTotal; }
    public void setPartsTotal(Long partsTotal) { this.partsTotal = partsTotal; }
    public Long getLaborTotal() { return laborTotal; }
    public void setLaborTotal(Long laborTotal) { this.laborTotal = laborTotal; }
    public Long getDiscountAmount() { return discountAmount; }
    public void setDiscountAmount(Long discountAmount) { this.discountAmount = discountAmount; }
    public Long getTaxAmount() { return taxAmount; }
    public void setTaxAmount(Long taxAmount) { this.taxAmount = taxAmount; }
    public Long getFinalTotal() { return finalTotal; }
    public void setFinalTotal(Long finalTotal) { this.finalTotal = finalTotal; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getLegalStatus() { return legalStatus; }
    public void setLegalStatus(String legalStatus) { this.legalStatus = legalStatus; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public List<ItemDto> getItems() { return items; }
    public void setItems(List<ItemDto> items) { this.items = items; }
    public Boolean getHasWorkOrder() { return hasWorkOrder; }
    public void setHasWorkOrder(Boolean hasWorkOrder) { this.hasWorkOrder = hasWorkOrder; }
    public String getWorkOrderNumber() { return workOrderNumber; }
    public void setWorkOrderNumber(String workOrderNumber) { this.workOrderNumber = workOrderNumber; }
    public Long getWorkOrderId() { return workOrderId; }
    public void setWorkOrderId(Long workOrderId) { this.workOrderId = workOrderId; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
