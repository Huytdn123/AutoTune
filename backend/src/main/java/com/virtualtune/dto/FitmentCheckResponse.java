package com.virtualtune.dto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

public class FitmentCheckResponse {
    private String status; // "PASS", "WARNING", "FAIL"
    private Boolean compatible;
    private BigDecimal toleranceMm;
    private Boolean pcdMatch;
    private String caliperGap;
    private String regulation;
    private String message;
    private List<String> reasons = new ArrayList<>();
    private List<FitmentGateCheck> checks = new ArrayList<>();

    // Vehicle metadata
    private Long carId;
    private String carSlug;
    private String carModel;
    private String carBrand;
    private String carBoltPattern;
    private BigDecimal carWheelSizeInch;
    private BigDecimal carWheelWidthInch;
    private Integer carStockOffsetEt;
    private BigDecimal carCenterBoreMm;
    private Integer carBrakeDiscMm;

    // Component metadata
    private Long partId;
    private String partSku;
    private String partName;
    private String partCategory;
    private String partBrand;
    private String partBoltPattern;
    private BigDecimal partWheelDiameterInch;
    private BigDecimal partWheelWidthInch;
    private Integer partOffsetEt;
    private BigDecimal partCenterBoreMm;

    public FitmentCheckResponse() {}

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Boolean getCompatible() {
        return compatible;
    }

    public void setCompatible(Boolean compatible) {
        this.compatible = compatible;
    }

    public BigDecimal getToleranceMm() {
        return toleranceMm;
    }

    public void setToleranceMm(BigDecimal toleranceMm) {
        this.toleranceMm = toleranceMm;
    }

    public Boolean getPcdMatch() {
        return pcdMatch;
    }

    public void setPcdMatch(Boolean pcdMatch) {
        this.pcdMatch = pcdMatch;
    }

    public String getCaliperGap() {
        return caliperGap;
    }

    public void setCaliperGap(String caliperGap) {
        this.caliperGap = caliperGap;
    }

    public String getRegulation() {
        return regulation;
    }

    public void setRegulation(String regulation) {
        this.regulation = regulation;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<String> getReasons() {
        return reasons;
    }

    public void setReasons(List<String> reasons) {
        this.reasons = reasons;
    }

    public List<FitmentGateCheck> getChecks() {
        return checks;
    }

    public void setChecks(List<FitmentGateCheck> checks) {
        this.checks = checks;
    }

    public Long getCarId() {
        return carId;
    }

    public void setCarId(Long carId) {
        this.carId = carId;
    }

    public String getCarSlug() {
        return carSlug;
    }

    public void setCarSlug(String carSlug) {
        this.carSlug = carSlug;
    }

    public String getCarModel() {
        return carModel;
    }

    public void setCarModel(String carModel) {
        this.carModel = carModel;
    }

    public String getCarBrand() {
        return carBrand;
    }

    public void setCarBrand(String carBrand) {
        this.carBrand = carBrand;
    }

    public String getCarBoltPattern() {
        return carBoltPattern;
    }

    public void setCarBoltPattern(String carBoltPattern) {
        this.carBoltPattern = carBoltPattern;
    }

    public BigDecimal getCarWheelSizeInch() {
        return carWheelSizeInch;
    }

    public void setCarWheelSizeInch(BigDecimal carWheelSizeInch) {
        this.carWheelSizeInch = carWheelSizeInch;
    }

    public BigDecimal getCarWheelWidthInch() {
        return carWheelWidthInch;
    }

    public void setCarWheelWidthInch(BigDecimal carWheelWidthInch) {
        this.carWheelWidthInch = carWheelWidthInch;
    }

    public Integer getCarStockOffsetEt() {
        return carStockOffsetEt;
    }

    public void setCarStockOffsetEt(Integer carStockOffsetEt) {
        this.carStockOffsetEt = carStockOffsetEt;
    }

    public BigDecimal getCarCenterBoreMm() {
        return carCenterBoreMm;
    }

    public void setCarCenterBoreMm(BigDecimal carCenterBoreMm) {
        this.carCenterBoreMm = carCenterBoreMm;
    }

    public Integer getCarBrakeDiscMm() {
        return carBrakeDiscMm;
    }

    public void setCarBrakeDiscMm(Integer carBrakeDiscMm) {
        this.carBrakeDiscMm = carBrakeDiscMm;
    }

    public Long getPartId() {
        return partId;
    }

    public void setPartId(Long partId) {
        this.partId = partId;
    }

    public String getPartSku() {
        return partSku;
    }

    public void setPartSku(String partSku) {
        this.partSku = partSku;
    }

    public String getPartName() {
        return partName;
    }

    public void setPartName(String partName) {
        this.partName = partName;
    }

    public String getPartCategory() {
        return partCategory;
    }

    public void setPartCategory(String partCategory) {
        this.partCategory = partCategory;
    }

    public String getPartBrand() {
        return partBrand;
    }

    public void setPartBrand(String partBrand) {
        this.partBrand = partBrand;
    }

    public String getPartBoltPattern() {
        return partBoltPattern;
    }

    public void setPartBoltPattern(String partBoltPattern) {
        this.partBoltPattern = partBoltPattern;
    }

    public BigDecimal getPartWheelDiameterInch() {
        return partWheelDiameterInch;
    }

    public void setPartWheelDiameterInch(BigDecimal partWheelDiameterInch) {
        this.partWheelDiameterInch = partWheelDiameterInch;
    }

    public BigDecimal getPartWheelWidthInch() {
        return partWheelWidthInch;
    }

    public void setPartWheelWidthInch(BigDecimal partWheelWidthInch) {
        this.partWheelWidthInch = partWheelWidthInch;
    }

    public Integer getPartOffsetEt() {
        return partOffsetEt;
    }

    public void setPartOffsetEt(Integer partOffsetEt) {
        this.partOffsetEt = partOffsetEt;
    }

    public BigDecimal getPartCenterBoreMm() {
        return partCenterBoreMm;
    }

    public void setPartCenterBoreMm(BigDecimal partCenterBoreMm) {
        this.partCenterBoreMm = partCenterBoreMm;
    }
}
