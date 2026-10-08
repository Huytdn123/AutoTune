package com.virtualtune.dto;

public class UpdateWorkOrderStatusRequest {
    private String status;
    private Integer progress;
    private String notes;

    public UpdateWorkOrderStatusRequest() {}

    public UpdateWorkOrderStatusRequest(String status, Integer progress, String notes) {
        this.status = status;
        this.progress = progress;
        this.notes = notes;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public Integer getProgress() { return progress; }
    public void setProgress(Integer progress) { this.progress = progress; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
