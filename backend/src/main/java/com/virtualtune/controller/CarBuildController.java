package com.virtualtune.controller;

import com.virtualtune.dto.CreateBuildRequest;
import com.virtualtune.model.CarBuild;
import com.virtualtune.service.CarBuildService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/builds")
public class CarBuildController {

    private final CarBuildService carBuildService;

    public CarBuildController(CarBuildService carBuildService) {
        this.carBuildService = carBuildService;
    }

    @PostMapping
    public ResponseEntity<CarBuild> createBuild(@RequestBody CreateBuildRequest request, Authentication authentication) {
        String username = authentication != null ? authentication.getName() : null;
        CarBuild build = carBuildService.createBuild(request, username);
        return ResponseEntity.ok(build);
    }

    @GetMapping("/{shareCode}")
    public ResponseEntity<CarBuild> getBuildByCode(@PathVariable String shareCode) {
        CarBuild build = carBuildService.getBuildByShareCode(shareCode);
        return ResponseEntity.ok(build);
    }

    @GetMapping("/recent")
    public ResponseEntity<List<CarBuild>> getRecentBuilds() {
        return ResponseEntity.ok(carBuildService.getRecentBuilds());
    }

    @GetMapping("/my")
    public ResponseEntity<List<CarBuild>> getMyBuilds(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(carBuildService.getUserBuilds(authentication.getName()));
    }
}
