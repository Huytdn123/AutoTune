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

    @GetMapping("/me")
    public ResponseEntity<List<CarBuild>> getMyBuildsAlias(Authentication authentication) {
        return getMyBuilds(authentication);
    }

    @PatchMapping("/{shareCode}/rename")
    public ResponseEntity<CarBuild> renameBuild(@PathVariable String shareCode,
                                                @RequestBody com.virtualtune.dto.RenameBuildRequest request,
                                                Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        boolean isAdminOrGarageOwner = authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()) || "ROLE_GARAGE_OWNER".equals(a.getAuthority()));
        CarBuild updated = carBuildService.renameBuild(shareCode,
                request != null ? request.getBuildName() : null,
                authentication.getName(),
                isAdminOrGarageOwner);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/{shareCode}/fork")
    public ResponseEntity<CarBuild> forkBuild(@PathVariable String shareCode, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        CarBuild forked = carBuildService.forkBuild(shareCode, authentication.getName());
        return ResponseEntity.ok(forked);
    }

    @DeleteMapping("/{shareCode}")
    public ResponseEntity<Void> deleteBuild(@PathVariable String shareCode, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(401).build();
        }
        boolean isAdminOrGarageOwner = authentication.getAuthorities().stream()
                .anyMatch(a -> "ROLE_ADMIN".equals(a.getAuthority()) || "ROLE_GARAGE_OWNER".equals(a.getAuthority()));
        carBuildService.deleteBuild(shareCode, authentication.getName(), isAdminOrGarageOwner);
        return ResponseEntity.noContent().build();
    }
}
