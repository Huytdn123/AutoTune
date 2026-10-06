package com.virtualtune.model;

import jakarta.persistence.*;
import java.math.BigDecimal;

@Entity
@Table(name = "Cars")
public class Car {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "car_id")
    private Long carId;

    @Column(name = "slug", unique = true, nullable = false, length = 50)
    private String slug;

    @Column(name = "brand", nullable = false, length = 50)
    private String brand;

    @Column(name = "model", nullable = false, length = 100)
    private String model;

    @Column(name = "year_manufactured", length = 30)
    private String yearManufactured;

    @Column(name = "body_type", length = 30)
    private String bodyType = "Coupe";

    @Column(name = "tagline", length = 150)
    private String tagline;

    @Column(name = "stock_bolt_pattern", length = 20)
    private String stockBoltPattern = "5x114.3";

    @Column(name = "stock_wheel_size_inch", precision = 4, scale = 1)
    private BigDecimal stockWheelSizeInch = new BigDecimal("20.0");

    @Column(name = "curb_weight_kg")
    private Integer curbWeightKg;

    @Column(name = "horsepower")
    private Integer horsepower;

    @Column(name = "price_usd")
    private Long priceUsd;

    @Column(name = "badge", length = 100)
    private String badge;

    @Column(name = "accent_color", length = 20)
    private String accentColor = "#E60012";

    @Column(name = "default_body_color", length = 20)
    private String defaultBodyColor = "#CC0000";

    @Column(name = "default_rim_color", length = 20)
    private String defaultRimColor = "#CCCCCC";

    @Column(name = "default_glass_color", length = 20)
    private String defaultGlassColor = "#C8D8F0";

    @Column(name = "model_3d_path", length = 255)
    private String model3dPath;

    @Column(name = "status", length = 20)
    private String status = "READY_FOR_3D";

    @Column(name = "specs_json", columnDefinition = "TEXT")
    private String specsJson;

    public Car() {}

    public Car(Long carId, String slug, String brand, String model, String yearManufactured,
               String bodyType, String tagline, String stockBoltPattern, BigDecimal stockWheelSizeInch,
               Integer curbWeightKg, Integer horsepower, Long priceUsd, String badge,
               String accentColor, String defaultBodyColor, String defaultRimColor, String defaultGlassColor,
               String model3dPath, String status, String specsJson) {
        this.carId = carId;
        this.slug = slug;
        this.brand = brand;
        this.model = model;
        this.yearManufactured = yearManufactured;
        this.bodyType = bodyType;
        this.tagline = tagline;
        this.stockBoltPattern = stockBoltPattern;
        this.stockWheelSizeInch = stockWheelSizeInch;
        this.curbWeightKg = curbWeightKg;
        this.horsepower = horsepower;
        this.priceUsd = priceUsd;
        this.badge = badge;
        this.accentColor = accentColor;
        this.defaultBodyColor = defaultBodyColor;
        this.defaultRimColor = defaultRimColor;
        this.defaultGlassColor = defaultGlassColor;
        this.model3dPath = model3dPath;
        this.status = status;
        this.specsJson = specsJson;
    }

    public Long getCarId() { return carId; }
    public void setCarId(Long carId) { this.carId = carId; }

    public String getSlug() { return slug; }
    public void setSlug(String slug) { this.slug = slug; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getModel() { return model; }
    public void setModel(String model) { this.model = model; }

    public String getYearManufactured() { return yearManufactured; }
    public void setYearManufactured(String yearManufactured) { this.yearManufactured = yearManufactured; }

    public String getBodyType() { return bodyType; }
    public void setBodyType(String bodyType) { this.bodyType = bodyType; }

    public String getTagline() { return tagline; }
    public void setTagline(String tagline) { this.tagline = tagline; }

    public String getStockBoltPattern() { return stockBoltPattern; }
    public void setStockBoltPattern(String stockBoltPattern) { this.stockBoltPattern = stockBoltPattern; }

    public BigDecimal getStockWheelSizeInch() { return stockWheelSizeInch; }
    public void setStockWheelSizeInch(BigDecimal stockWheelSizeInch) { this.stockWheelSizeInch = stockWheelSizeInch; }

    public Integer getCurbWeightKg() { return curbWeightKg; }
    public void setCurbWeightKg(Integer curbWeightKg) { this.curbWeightKg = curbWeightKg; }

    public Integer getHorsepower() { return horsepower; }
    public void setHorsepower(Integer horsepower) { this.horsepower = horsepower; }

    public Long getPriceUsd() { return priceUsd; }
    public void setPriceUsd(Long priceUsd) { this.priceUsd = priceUsd; }

    public String getBadge() { return badge; }
    public void setBadge(String badge) { this.badge = badge; }

    public String getAccentColor() { return accentColor; }
    public void setAccentColor(String accentColor) { this.accentColor = accentColor; }

    public String getDefaultBodyColor() { return defaultBodyColor; }
    public void setDefaultBodyColor(String defaultBodyColor) { this.defaultBodyColor = defaultBodyColor; }

    public String getDefaultRimColor() { return defaultRimColor; }
    public void setDefaultRimColor(String defaultRimColor) { this.defaultRimColor = defaultRimColor; }

    public String getDefaultGlassColor() { return defaultGlassColor; }
    public void setDefaultGlassColor(String defaultGlassColor) { this.defaultGlassColor = defaultGlassColor; }

    public String getModel3dPath() { return model3dPath; }
    public void setModel3dPath(String model3dPath) { this.model3dPath = model3dPath; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getSpecsJson() { return specsJson; }
    public void setSpecsJson(String specsJson) { this.specsJson = specsJson; }
}
