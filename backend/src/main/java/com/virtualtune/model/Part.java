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

    @Column(name = "bolt_pattern", length = 30)
    private String boltPattern;

    @Column(name = "wheel_diameter_inch", precision = 4, scale = 1)
    private BigDecimal wheelDiameterInch;

    @Column(name = "wheel_width_inch", precision = 4, scale = 1)
    private BigDecimal wheelWidthInch;

    @Column(name = "offset_et")
    private Integer offsetEt;

    @Column(name = "center_bore_mm", precision = 4, scale = 1)
    private BigDecimal centerBoreMm;

    @Column(name = "min_wheel_diameter_inch", precision = 4, scale = 1)
    private BigDecimal minWheelDiameterInch;

    @Column(name = "brake_disc_diameter_mm")
    private Integer brakeDiscDiameterMm;

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

    public String getBoltPattern() { return boltPattern; }
    public void setBoltPattern(String boltPattern) { this.boltPattern = boltPattern; }

    public BigDecimal getWheelDiameterInch() { return wheelDiameterInch; }
    public void setWheelDiameterInch(BigDecimal wheelDiameterInch) { this.wheelDiameterInch = wheelDiameterInch; }

    public BigDecimal getWheelWidthInch() { return wheelWidthInch; }
    public void setWheelWidthInch(BigDecimal wheelWidthInch) { this.wheelWidthInch = wheelWidthInch; }

    public Integer getOffsetEt() { return offsetEt; }
    public void setOffsetEt(Integer offsetEt) { this.offsetEt = offsetEt; }

    public BigDecimal getCenterBoreMm() { return centerBoreMm; }
    public void setCenterBoreMm(BigDecimal centerBoreMm) { this.centerBoreMm = centerBoreMm; }

    public BigDecimal getMinWheelDiameterInch() { return minWheelDiameterInch; }
    public void setMinWheelDiameterInch(BigDecimal minWheelDiameterInch) { this.minWheelDiameterInch = minWheelDiameterInch; }

    public Integer getBrakeDiscDiameterMm() { return brakeDiscDiameterMm; }
    public void setBrakeDiscDiameterMm(Integer brakeDiscDiameterMm) { this.brakeDiscDiameterMm = brakeDiscDiameterMm; }
}
