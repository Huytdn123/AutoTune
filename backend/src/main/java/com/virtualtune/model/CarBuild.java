package com.virtualtune.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "CarBuilds")
public class CarBuild {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "build_id")
    private Long buildId;

    @Column(name = "share_code", unique = true, nullable = false, length = 60)
    private String shareCode;

    @Column(name = "build_name", nullable = false, length = 100)
    private String buildName = "Custom 3D Build";

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "car_id", nullable = false)
    private Car car;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "body_color", nullable = false, length = 20)
    private String bodyColor = "#CC0000";

    @Column(name = "body_finish", length = 30)
    private String bodyFinish = "Metallic";

    @Column(name = "rim_color", nullable = false, length = 20)
    private String rimColor = "#CCCCCC";

    @Column(name = "glass_color", nullable = false, length = 20)
    private String glassColor = "#C8D8F0";

    @Column(name = "selected_parts_json", columnDefinition = "TEXT")
    private String selectedPartsJson = "[]";

    @Column(name = "total_estimated_cost")
    private Long totalEstimatedCost = 0L;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public CarBuild() {}

    public CarBuild(Long buildId, String shareCode, String buildName, Car car, User user,
                    String bodyColor, String bodyFinish, String rimColor, String glassColor,
                    String selectedPartsJson, Long totalEstimatedCost) {
        this.buildId = buildId;
        this.shareCode = shareCode;
        this.buildName = buildName;
        this.car = car;
        this.user = user;
        this.bodyColor = bodyColor;
        this.bodyFinish = bodyFinish;
        this.rimColor = rimColor;
        this.glassColor = glassColor;
        this.selectedPartsJson = selectedPartsJson;
        this.totalEstimatedCost = totalEstimatedCost;
        this.createdAt = LocalDateTime.now();
    }

    public Long getBuildId() { return buildId; }
    public void setBuildId(Long buildId) { this.buildId = buildId; }

    public String getShareCode() { return shareCode; }
    public void setShareCode(String shareCode) { this.shareCode = shareCode; }

    public String getBuildName() { return buildName; }
    public void setBuildName(String buildName) { this.buildName = buildName; }

    public Car getCar() { return car; }
    public void setCar(Car car) { this.car = car; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

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

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}
