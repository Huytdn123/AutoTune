package com.virtualtune.dto;

public class CreateWorkOrderRequest {
    private Long quotationId;
    private Long technicianId;
    private String bayNumber;
    private String priority;
    private String notes;

    public CreateWorkOrderRequest() {}

    public CreateWorkOrderRequest(Long quotationId, Long technicianId, String bayNumber, String priority, String notes) {
        this.quotationId = quotationId;
        this.technicianId = technicianId;
        this.bayNumber = bayNumber;
        this.priority = priority;
        this.notes = notes;
    }

    public Long getQuotationId() { return quotationId; }
    public void setQuotationId(Long quotationId) { this.quotationId = quotationId; }
    public Long getTechnicianId() { return technicianId; }
    public void setTechnicianId(Long technicianId) { this.technicianId = technicianId; }
    public String getBayNumber() { return bayNumber; }
    public void setBayNumber(String bayNumber) { this.bayNumber = bayNumber; }
    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
}
