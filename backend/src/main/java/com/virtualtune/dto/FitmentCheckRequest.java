package com.virtualtune.dto;

public class FitmentCheckRequest {
    private Long carId;
    private String carSlug;
    private Long partId;
    private String partSku;

    public FitmentCheckRequest() {}

    public FitmentCheckRequest(Long carId, Long partId) {
        this.carId = carId;
        this.partId = partId;
    }

    public FitmentCheckRequest(Long carId, String carSlug, Long partId, String partSku) {
        this.carId = carId;
        this.carSlug = carSlug;
        this.partId = partId;
        this.partSku = partSku;
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
}
