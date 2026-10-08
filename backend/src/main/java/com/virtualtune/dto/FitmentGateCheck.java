package com.virtualtune.dto;

public class FitmentGateCheck {
    private Integer gateId;
    private String gateName;
    private String status; // PASS, WARNING, FAIL
    private String value;
    private String message;
    private String tolerance;

    public FitmentGateCheck() {}

    public FitmentGateCheck(Integer gateId, String gateName, String status, String value, String message, String tolerance) {
        this.gateId = gateId;
        this.gateName = gateName;
        this.status = status;
        this.value = value;
        this.message = message;
        this.tolerance = tolerance;
    }

    public Integer getGateId() {
        return gateId;
    }

    public void setGateId(Integer gateId) {
        this.gateId = gateId;
    }

    public String getGateName() {
        return gateName;
    }

    public void setGateName(String gateName) {
        this.gateName = gateName;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getValue() {
        return value;
    }

    public void setValue(String value) {
        this.value = value;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getTolerance() {
        return tolerance;
    }

    public void setTolerance(String tolerance) {
        this.tolerance = tolerance;
    }
}
