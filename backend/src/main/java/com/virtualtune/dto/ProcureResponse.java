package com.virtualtune.dto;

public class ProcureResponse {
    private boolean success;
    private String message;
    private String orderNumber;

    public ProcureResponse() {}

    public ProcureResponse(boolean success, String message, String orderNumber) {
        this.success = success;
        this.message = message;
        this.orderNumber = orderNumber;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getOrderNumber() { return orderNumber; }
    public void setOrderNumber(String orderNumber) { this.orderNumber = orderNumber; }
}
