package com.virtualtune.dto;

import java.util.List;

public class CreateQuotationRequest {
    private String shareCode;
    private Long carId;
    private String carModel;
    private String customerName;
    private String customerPhone;
    private Long laborFee;
    private Long discountAmount;
    private Long taxAmount;
    private String notes;
    private List<Long> partIds;
    private List<QuotationItemDto> items;

    public static class QuotationItemDto {
        private Long partId;
        private String partName;
        private String partSku;
        private String category;
        private Integer quantity;
        private Long unitPriceVnd;

        public QuotationItemDto() {}

        public QuotationItemDto(Long partId, String partName, String partSku, String category, Integer quantity, Long unitPriceVnd) {
            this.partId = partId;
            this.partName = partName;
            this.partSku = partSku;
            this.category = category;
            this.quantity = quantity;
            this.unitPriceVnd = unitPriceVnd;
        }

        public Long getPartId() {
            return partId;
        }

        public void setPartId(Long partId) {
            this.partId = partId;
        }

        public String getPartName() {
            return partName;
        }

        public void setPartName(String partName) {
            this.partName = partName;
        }

        public String getPartSku() {
            return partSku;
        }

        public void setPartSku(String partSku) {
            this.partSku = partSku;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }

        public Long getUnitPriceVnd() {
            return unitPriceVnd;
        }

        public void setUnitPriceVnd(Long unitPriceVnd) {
            this.unitPriceVnd = unitPriceVnd;
        }
    }

    public CreateQuotationRequest() {}

    public String getShareCode() {
        return shareCode;
    }

    public void setShareCode(String shareCode) {
        this.shareCode = shareCode;
    }

    public Long getCarId() {
        return carId;
    }

    public void setCarId(Long carId) {
        this.carId = carId;
    }

    public String getCarModel() {
        return carModel;
    }

    public void setCarModel(String carModel) {
        this.carModel = carModel;
    }

    public String getCustomerName() {
        return customerName;
    }

    public void setCustomerName(String customerName) {
        this.customerName = customerName;
    }

    public String getCustomerPhone() {
        return customerPhone;
    }

    public void setCustomerPhone(String customerPhone) {
        this.customerPhone = customerPhone;
    }

    public Long getLaborFee() {
        return laborFee;
    }

    public void setLaborFee(Long laborFee) {
        this.laborFee = laborFee;
    }

    public Long getDiscountAmount() {
        return discountAmount;
    }

    public void setDiscountAmount(Long discountAmount) {
        this.discountAmount = discountAmount;
    }

    public Long getTaxAmount() {
        return taxAmount;
    }

    public void setTaxAmount(Long taxAmount) {
        this.taxAmount = taxAmount;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<Long> getPartIds() {
        return partIds;
    }

    public void setPartIds(List<Long> partIds) {
        this.partIds = partIds;
    }

    public List<QuotationItemDto> getItems() {
        return items;
    }

    public void setItems(List<QuotationItemDto> items) {
        this.items = items;
    }
}
