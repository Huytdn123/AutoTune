package com.virtualtune.dto;

public class RenameBuildRequest {
    private String buildName;

    public RenameBuildRequest() {}

    public RenameBuildRequest(String buildName) {
        this.buildName = buildName;
    }

    public String getBuildName() {
        return buildName;
    }

    public void setBuildName(String buildName) {
        this.buildName = buildName;
    }
}
