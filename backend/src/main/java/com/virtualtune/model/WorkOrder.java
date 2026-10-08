package com.virtualtune.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "WorkOrders")
public class WorkOrder {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "work_order_id")
    private Long workOrderId;

    @Column(name = "work_order_number", unique = true, nullable = false, length = 60)
    private String workOrderNumber;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "quotation_id", unique = true, nullable = false)
    private Quotation quotation;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "customer_id", nullable = false)
    private User customer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "technician_id")
    private User technician;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "car_build_id")
    private CarBuild carBuild;

    @Column(name = "vehicle_model", nullable = false, length = 100)
    private String vehicleModel;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "garage_id")
    private Garage garage;

    @Column(name = "bay_number", length = 60)
    private String bayNumber = "Bay 01 - Dyno & Tuning";

    @Column(name = "status", nullable = false, length = 30)
    private String status = "PENDING"; // PENDING, IN_PROGRESS, COMPLETED, CANCELLED

    @Column(name = "progress", nullable = false)
    private Integer progress = 0; // 0 - 100

    @Column(name = "priority", length = 30)
    private String priority = "NORMAL"; // NORMAL, HIGH, URGENT

    @Column(name = "notes", columnDefinition = "TEXT")
    private String notes;

    @Column(name = "started_at")
    private LocalDateTime startedAt;

    @Column(name = "completed_at")
    private LocalDateTime completedAt;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    public WorkOrder() {}

    public WorkOrder(Long workOrderId, String workOrderNumber, Quotation quotation, User customer,
                     User technician, CarBuild carBuild, String vehicleModel, Garage garage,
                     String bayNumber, String status, Integer progress, String priority, String notes) {
        this.workOrderId = workOrderId;
        this.workOrderNumber = workOrderNumber;
        this.quotation = quotation;
        this.customer = customer;
        this.technician = technician;
        this.carBuild = carBuild;
        this.vehicleModel = vehicleModel;
        this.garage = garage;
        this.bayNumber = bayNumber != null ? bayNumber : "Bay 01 - Dyno & Tuning";
        this.status = status != null ? status : "PENDING";
        this.progress = progress != null ? progress : 0;
        this.priority = priority != null ? priority : "NORMAL";
        this.notes = notes;
    }

    public Long getWorkOrderId() {
        return workOrderId;
    }

    public void setWorkOrderId(Long workOrderId) {
        this.workOrderId = workOrderId;
    }

    public String getWorkOrderNumber() {
        return workOrderNumber;
    }

    public void setWorkOrderNumber(String workOrderNumber) {
        this.workOrderNumber = workOrderNumber;
    }

    public Quotation getQuotation() {
        return quotation;
    }

    public void setQuotation(Quotation quotation) {
        this.quotation = quotation;
    }

    public User getCustomer() {
        return customer;
    }

    public void setCustomer(User customer) {
        this.customer = customer;
    }

    public User getTechnician() {
        return technician;
    }

    public void setTechnician(User technician) {
        this.technician = technician;
        this.updatedAt = LocalDateTime.now();
    }

    public CarBuild getCarBuild() {
        return carBuild;
    }

    public void setCarBuild(CarBuild carBuild) {
        this.carBuild = carBuild;
    }

    public String getVehicleModel() {
        return vehicleModel;
    }

    public void setVehicleModel(String vehicleModel) {
        this.vehicleModel = vehicleModel;
    }

    public Garage getGarage() {
        return garage;
    }

    public void setGarage(Garage garage) {
        this.garage = garage;
    }

    public String getBayNumber() {
        return bayNumber;
    }

    public void setBayNumber(String bayNumber) {
        this.bayNumber = bayNumber;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
        this.updatedAt = LocalDateTime.now();
        if ("IN_PROGRESS".equalsIgnoreCase(status) && this.startedAt == null) {
            this.startedAt = LocalDateTime.now();
        } else if ("COMPLETED".equalsIgnoreCase(status)) {
            this.progress = 100;
            if (this.completedAt == null) {
                this.completedAt = LocalDateTime.now();
            }
        }
    }

    public Integer getProgress() {
        return progress;
    }

    public void setProgress(Integer progress) {
        this.progress = progress != null ? Math.min(100, Math.max(0, progress)) : 0;
        this.updatedAt = LocalDateTime.now();
        if (this.progress == 100 && !"COMPLETED".equalsIgnoreCase(this.status)) {
            this.status = "COMPLETED";
            if (this.completedAt == null) {
                this.completedAt = LocalDateTime.now();
            }
        }
    }

    public String getPriority() {
        return priority;
    }

    public void setPriority(String priority) {
        this.priority = priority;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public LocalDateTime getStartedAt() {
        return startedAt;
    }

    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }

    public LocalDateTime getCompletedAt() {
        return completedAt;
    }

    public void setCompletedAt(LocalDateTime completedAt) {
        this.completedAt = completedAt;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
