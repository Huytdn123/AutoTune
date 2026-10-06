package com.virtualtune.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

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

    @Column(name = "image_url", length = 255)
    private String imageUrl;

    @Column(name = "compatible_vehicles", length = 255)
    private String compatibleVehicles;

    @Column(name = "rating", precision = 3, scale = 2)
    private BigDecimal rating = new BigDecimal("4.90");

    @Column(name = "badge", length = 50)
    private String badge;

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

    public Part(Long partId, String sku, String partName, String category, String brand,
                String specifications, Long priceVnd, Integer stockQuantity, String legalComplianceStatus,
                String imageUrl, String compatibleVehicles, BigDecimal rating, String badge) {
        this.partId = partId;
        this.sku = sku;
        this.partName = partName;
        this.category = category;
        this.brand = brand;
        this.specifications = specifications;
        this.priceVnd = priceVnd;
        this.stockQuantity = stockQuantity;
        this.legalComplianceStatus = legalComplianceStatus;
        this.imageUrl = imageUrl;
        this.compatibleVehicles = compatibleVehicles;
        this.rating = rating;
        this.badge = badge;
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

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getCompatibleVehicles() { return compatibleVehicles; }
    public void setCompatibleVehicles(String compatibleVehicles) { this.compatibleVehicles = compatibleVehicles; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }
}
