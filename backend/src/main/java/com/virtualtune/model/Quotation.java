package com.virtualtune.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Quotations")
public class Quotation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "quotation_id")
    private Long quotationId;

    @Column(name = "quotation_number", unique = true, nullable = false, length = 60)
    private String quotationNumber;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "car_build_id")
    private CarBuild carBuild;

    @Column(name = "car_model", nullable = false, length = 100)
    private String carModel;

    @Column(name = "customer_name", length = 100)
    private String customerName;

    @Column(name = "customer_phone", length = 30)
    private String customerPhone;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "garage_id")
    private Garage garage;

    @Column(name = "garage_name", length = 150)
    private String garageName = "AutoTune Saigon Performance Hub";

    @Column(name = "parts_total", nullable = false)
    private Long partsTotal = 0L;

    @Column(name = "labor_total", nullable = false)
    private Long laborTotal = 0L;

    @Column(name = "discount_amount")
    private Long discountAmount = 0L;

    @Column(name = "tax_amount")
    private Long taxAmount = 0L;

    @Column(name = "final_total", nullable = false)
    private Long finalTotal = 0L;

    @Column(name = "status", nullable = false, length = 30)
    private String status = "DRAFT"; // DRAFT, SENT, APPROVED, REJECTED, EXPIRED

    @Column(name = "legal_status", length = 30)
    private String legalStatus = "PASS"; // PASS, REVIEW, FAIL

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @OneToMany(mappedBy = "quotation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private List<QuotationItem> items = new ArrayList<>();

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public Quotation() {}

    public Quotation(Long quotationId, String quotationNumber, User customer, CarBuild carBuild,
                     String carModel, String customerName, String customerPhone, Garage garage,
                     String garageName, Long partsTotal, Long laborTotal, Long discountAmount,
                     Long taxAmount, Long finalTotal, String status, String legalStatus, String notes) {
        this.quotationId = quotationId;
        this.quotationNumber = quotationNumber;
        this.customer = customer;
        this.carBuild = carBuild;
        this.carModel = carModel;
        this.customerName = customerName;
        this.customerPhone = customerPhone;
        this.garage = garage;
        this.garageName = garageName != null ? garageName : "AutoTune Saigon Performance Hub";
        this.partsTotal = partsTotal != null ? partsTotal : 0L;
        this.laborTotal = laborTotal != null ? laborTotal : 0L;
        this.discountAmount = discountAmount != null ? discountAmount : 0L;
        this.taxAmount = taxAmount != null ? taxAmount : 0L;
        this.finalTotal = finalTotal != null ? finalTotal : (this.partsTotal + this.laborTotal - this.discountAmount + this.taxAmount);
        this.status = status != null ? status : "DRAFT";
        this.legalStatus = legalStatus != null ? legalStatus : "PASS";
        this.notes = notes;
    }

    public void recalculateTotals() {
        long itemsSum = 0L;
        if (items != null) {
            for (QuotationItem it : items) {
                if (it.getTotalPriceVnd() != null) {
                    itemsSum += it.getTotalPriceVnd();
                }
            }
        }
        if (itemsSum > 0) {
            this.partsTotal = itemsSum;
        }
        long pTotal = this.partsTotal != null ? this.partsTotal : 0L;
        long lTotal = this.laborTotal != null ? this.laborTotal : 0L;
        long disc = this.discountAmount != null ? this.discountAmount : 0L;
        long tax = this.taxAmount != null ? this.taxAmount : 0L;
        this.finalTotal = Math.max(0L, pTotal + lTotal - disc + tax);
        this.updatedAt = LocalDateTime.now();
    }

    public void addItem(QuotationItem item) {
        items.add(item);
        item.setQuotation(this);
    }

    public Long getQuotationId() {
        return quotationId;
    }

    public void setQuotationId(Long quotationId) {
        this.quotationId = quotationId;
    }

    public String getQuotationNumber() {
        return quotationNumber;
    }

    public void setQuotationNumber(String quotationNumber) {
        this.quotationNumber = quotationNumber;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public CarBuild getCarBuild() {
        return carBuild;
    }

    public void setCarBuild(CarBuild carBuild) {
        this.carBuild = carBuild;
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

    public Garage getGarage() {
        return garage;
    }

    public void setGarage(Garage garage) {
        this.garage = garage;
    }

    public String getGarageName() {
        return garageName;
    }

    public void setGarageName(String garageName) {
        this.garageName = garageName;
    }

    public Long getPartsTotal() {
        return partsTotal;
    }

    public void setPartsTotal(Long partsTotal) {
        this.partsTotal = partsTotal;
    }

    public Long getLaborTotal() {
        return laborTotal;
    }

    public void setLaborTotal(Long laborTotal) {
        this.laborTotal = laborTotal;
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

    public Long getFinalTotal() {
        return finalTotal;
    }

    public void setFinalTotal(Long finalTotal) {
        this.finalTotal = finalTotal;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
    }

    public String getLegalStatus() {
        return legalStatus;
    }

    public void setLegalStatus(String legalStatus) {
        this.legalStatus = legalStatus;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public List<QuotationItem> getItems() {
        return items;
    }

    public void setItems(List<QuotationItem> items) {
        this.items = items;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
