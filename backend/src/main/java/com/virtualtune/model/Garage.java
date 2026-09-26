package com.virtualtune.model;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "Garages")
public class Garage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "garage_id")
    private Integer garageId;

    @Column(name = "garage_code", unique = true, nullable = false, length = 30)
    private String garageCode;

    @Column(name = "garage_name", nullable = false, length = 150)
    private String garageName;

    @Column(name = "address", nullable = false, length = 255)
    private String address;

    @Column(name = "city", length = 50)
    private String city;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @Column(name = "email", length = 100)
    private String email;

    @Column(name = "total_bays")
    private Integer totalBays = 4;

    @Column(name = "active_bays")
    private Integer activeBays = 3;

    @Column(name = "monthly_revenue_vnd")
    private Long monthlyRevenueVnd = 850000000L;

    @Column(name = "fitment_accuracy_rate", precision = 5, scale = 2)
    private BigDecimal fitmentAccuracyRate = new BigDecimal("99.98");

    @Column(name = "rating", precision = 3, scale = 2)
    private BigDecimal rating = new BigDecimal("4.95");

    @Column(name = "status", length = 20)
    private String status = "ACTIVE";

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public Garage() {}

    public Garage(Integer garageId, String garageCode, String garageName, String address, String city,
                  String phone, String email, Integer totalBays, Integer activeBays,
                  Long monthlyRevenueVnd, BigDecimal fitmentAccuracyRate, BigDecimal rating, String status) {
        this.garageId = garageId;
        this.garageCode = garageCode;
        this.garageName = garageName;
        this.address = address;
        this.city = city;
        this.phone = phone;
        this.email = email;
        this.totalBays = totalBays;
        this.activeBays = activeBays;
        this.monthlyRevenueVnd = monthlyRevenueVnd;
        this.fitmentAccuracyRate = fitmentAccuracyRate;
        this.rating = rating;
        this.status = status;
        this.createdAt = LocalDateTime.now();
    }

    public Integer getGarageId() { return garageId; }
    public void setGarageId(Integer garageId) { this.garageId = garageId; }

    public String getGarageCode() { return garageCode; }
    public void setGarageCode(String garageCode) { this.garageCode = garageCode; }

    public String getGarageName() { return garageName; }
    public void setGarageName(String garageName) { this.garageName = garageName; }

    public String getAddress() { return address; }
    public void setAddress(String address) { this.address = address; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public Integer getTotalBays() { return totalBays; }
    public void setTotalBays(Integer totalBays) { this.totalBays = totalBays; }

    public Integer getActiveBays() { return activeBays; }
    public void setActiveBays(Integer activeBays) { this.activeBays = activeBays; }

    public Long getMonthlyRevenueVnd() { return monthlyRevenueVnd; }
    public void setMonthlyRevenueVnd(Long monthlyRevenueVnd) { this.monthlyRevenueVnd = monthlyRevenueVnd; }

    public BigDecimal getFitmentAccuracyRate() { return fitmentAccuracyRate; }
    public void setFitmentAccuracyRate(BigDecimal fitmentAccuracyRate) { this.fitmentAccuracyRate = fitmentAccuracyRate; }

    public BigDecimal getRating() { return rating; }
    public void setRating(BigDecimal rating) { this.rating = rating; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
