package com.virtualtune.dto;

public class AssignTechnicianRequest {
    private Long technicianId;
    private String bayNumber;
    private String priority;

    public AssignTechnicianRequest() {}

    public AssignTechnicianRequest(Long technicianId, String bayNumber, String priority) {
        this.technicianId = technicianId;
        this.bayNumber = bayNumber;
        this.priority = priority;
    }

    public Long getTechnicianId() { return technicianId; }
    public void setTechnicianId(Long technicianId) { this.technicianId = technicianId; }
    public String getBayNumber() { return bayNumber; }
    public void setBayNumber(String bayNumber) { this.bayNumber = bayNumber; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
}
