package com.virtualtune.dto;

public class FitmentOverviewResponse {
    private long totalCars;
    private long totalParts;
    private long verifiedCombinations;
    private String accuracyRate;
    private String standardReference;

    public FitmentOverviewResponse() {}

    public FitmentOverviewResponse(long totalCars, long totalParts, long verifiedCombinations, String accuracyRate, String standardReference) {
        this.totalCars = totalCars;
        this.totalParts = totalParts;
        this.verifiedCombinations = verifiedCombinations;
        this.accuracyRate = accuracyRate;
        this.standardReference = standardReference;
    }

    public long getTotalCars() {
        return totalCars;
    }

    public void setTotalCars(long totalCars) {
        this.totalCars = totalCars;
    }

    public long getTotalParts() {
        return totalParts;
    }

    public void setTotalParts(long totalParts) {
        this.totalParts = totalParts;
    }

    public long getVerifiedCombinations() {
        return verifiedCombinations;
    }

    public void setVerifiedCombinations(long verifiedCombinations) {
        this.verifiedCombinations = verifiedCombinations;
    }

    public String getAccuracyRate() {
        return accuracyRate;
    }

    public void setAccuracyRate(String accuracyRate) {
        this.accuracyRate = accuracyRate;
    }

    public String getStandardReference() {
        return standardReference;
    }

    public void setStandardReference(String standardReference) {
        this.standardReference = standardReference;
    }
}
