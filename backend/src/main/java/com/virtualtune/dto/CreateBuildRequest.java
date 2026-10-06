package com.virtualtune.dto;

public class CreateBuildRequest {

    private String carSlug;
    private String buildName;
    private String bodyColor;
    private String bodyFinish;
    private String rimColor;
    private String glassColor;
    private String selectedPartsJson;
    private Long totalEstimatedCost;

    public CreateBuildRequest() {}

    public CreateBuildRequest(String carSlug, String buildName, String bodyColor, String bodyFinish,
                              String rimColor, String glassColor, String selectedPartsJson, Long totalEstimatedCost) {
        this.carSlug = carSlug;
        this.buildName = buildName;
        this.bodyColor = bodyColor;
        this.bodyFinish = bodyFinish;
        this.rimColor = rimColor;
        this.glassColor = glassColor;
        this.selectedPartsJson = selectedPartsJson;
        this.totalEstimatedCost = totalEstimatedCost;
    }

    public String getCarSlug() { return carSlug; }
    public void setCarSlug(String carSlug) { this.carSlug = carSlug; }

    public String getBuildName() { return buildName; }
    public void setBuildName(String buildName) { this.buildName = buildName; }

    public String getBodyColor() { return bodyColor; }
    public void setBodyColor(String bodyColor) { this.bodyColor = bodyColor; }

    public String getBodyFinish() { return bodyFinish; }
    public void setBodyFinish(String bodyFinish) { this.bodyFinish = bodyFinish; }

    public String getRimColor() { return rimColor; }
    public void setRimColor(String rimColor) { this.rimColor = rimColor; }

    public String getGlassColor() { return glassColor; }
    public void setGlassColor(String glassColor) { this.glassColor = glassColor; }

    public String getSelectedPartsJson() { return selectedPartsJson; }
    public void setSelectedPartsJson(String selectedPartsJson) { this.selectedPartsJson = selectedPartsJson; }

    public Long getTotalEstimatedCost() { return totalEstimatedCost; }
    public void setTotalEstimatedCost(Long totalEstimatedCost) { this.totalEstimatedCost = totalEstimatedCost; }

    private Boolean forceNew;
    public Boolean getForceNew() { return forceNew; }
    public void setForceNew(Boolean forceNew) { this.forceNew = forceNew; }
}
