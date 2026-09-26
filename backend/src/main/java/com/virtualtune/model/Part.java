package com.virtualtune.model;

import jakarta.persistence.*;

@Entity
@Table(name = "Parts")
public class Part {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "part_id")
    private Long partId;

    @Column(name = "sku", unique = true, nullable = false, length = 50)
    private String sku;

    @Column(name = "part_name", nullable = false, length = 150)
    private String partName;

    @Column(name = "category", nullable = false, length = 50)
    private String category;

    @Column(name = "brand", nullable = false, length = 50)
    private String brand;

    @Column(name = "specifications", length = 255)
    private String specifications;

    @Column(name = "price_vnd", nullable = false)
    private Long priceVnd;

    @Column(name = "stock_quantity")
    private Integer stockQuantity = 10;

    @Column(name = "legal_compliance_status", length = 20)
    private String legalComplianceStatus = "PASS";

    public Part() {}

    public Part(Long partId, String sku, String partName, String category, String brand,
                String specifications, Long priceVnd, Integer stockQuantity, String legalComplianceStatus) {
        this.partId = partId;
        this.sku = sku;
        this.partName = partName;
        this.category = category;
        this.brand = brand;
        this.specifications = specifications;
        this.priceVnd = priceVnd;
        this.stockQuantity = stockQuantity;
        this.legalComplianceStatus = legalComplianceStatus;
    }

    public Long getPartId() { return partId; }
    public void setPartId(Long partId) { this.partId = partId; }

    public String getSku() { return sku; }
    public void setSku(String sku) { this.sku = sku; }

    public String getPartName() { return partName; }
    public void setPartName(String partName) { this.partName = partName; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getSpecifications() { return specifications; }
    public void setSpecifications(String specifications) { this.specifications = specifications; }

    public Long getPriceVnd() { return priceVnd; }
    public void setPriceVnd(Long priceVnd) { this.priceVnd = priceVnd; }

    public Integer getStockQuantity() { return stockQuantity; }
    public void setStockQuantity(Integer stockQuantity) { this.stockQuantity = stockQuantity; }

    public String getLegalComplianceStatus() { return legalComplianceStatus; }
    public void setLegalComplianceStatus(String legalComplianceStatus) { this.legalComplianceStatus = legalComplianceStatus; }
}
