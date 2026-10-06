package com.virtualtune.service.impl;

import com.virtualtune.dto.CreateBuildRequest;
import com.virtualtune.exception.ResourceNotFoundException;
import com.virtualtune.model.Car;
import com.virtualtune.model.CarBuild;
import com.virtualtune.model.User;
import com.virtualtune.repository.CarBuildRepository;
import com.virtualtune.repository.CarRepository;
import com.virtualtune.repository.UserRepository;
import com.virtualtune.service.CarBuildService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Locale;

@Service
public class CarBuildServiceImpl implements CarBuildService {

    private final CarBuildRepository carBuildRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final SecureRandom random = new SecureRandom();

    public CarBuildServiceImpl(CarBuildRepository carBuildRepository,
                               CarRepository carRepository,
                               UserRepository userRepository) {
        this.carBuildRepository = carBuildRepository;
        this.carRepository = carRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public CarBuild createBuild(CreateBuildRequest request, String username) {
        String carSlug = request.getCarSlug() != null ? request.getCarSlug().trim() : "ferrari-458";
        Car car = carRepository.findBySlug(carSlug)
                .orElseGet(() -> carRepository.findAll().stream().findFirst()
                        .orElseThrow(() -> new ResourceNotFoundException("No vehicle model available in catalog")));

        User user = null;
        if (username != null && !username.isBlank()) {
            user = userRepository.findByUsername(username).orElse(null);
        }

        String targetBody = request.getBodyColor() != null ? request.getBodyColor() : car.getDefaultBodyColor();
        String targetRim = request.getRimColor() != null ? request.getRimColor() : car.getDefaultRimColor();
        String targetGlass = request.getGlassColor() != null ? request.getGlassColor() : car.getDefaultGlassColor();

        // Reuse existing build if identical configuration and forceNew is not requested
        if (!Boolean.TRUE.equals(request.getForceNew())) {
            List<CarBuild> existingList = carBuildRepository
                    .findByCar_SlugAndBodyColorIgnoreCaseAndRimColorIgnoreCaseAndGlassColorIgnoreCaseOrderByCreatedAtDesc(
                            car.getSlug(), targetBody, targetRim, targetGlass
                    );

            if (user != null) {
                Long uid = user.getUserId();
                CarBuild userExisting = existingList.stream()
                        .filter(b -> b.getUser() != null && b.getUser().getUserId().equals(uid))
                        .findFirst()
                        .orElse(null);
                if (userExisting != null) {
                    return userExisting;
                }
            } else if (!existingList.isEmpty()) {
                String targetName = request.getBuildName() != null ? request.getBuildName().trim() : "";
                CarBuild identical = existingList.stream()
                        .filter(b -> targetName.isEmpty() || b.getBuildName().equalsIgnoreCase(targetName))
                        .findFirst()
                        .orElse(null);
                if (identical != null) {
                    return identical;
                }
            }
        }

        String shareCode = generateUniqueShareCode(car.getSlug());

        CarBuild build = new CarBuild();
        build.setShareCode(shareCode);
        build.setBuildName(request.getBuildName() != null && !request.getBuildName().isBlank()
                ? request.getBuildName().trim()
                : car.getBrand() + " " + car.getModel() + " Custom");
        build.setCar(car);
        build.setUser(user);
        build.setBodyColor(targetBody);
        build.setBodyFinish(request.getBodyFinish() != null ? request.getBodyFinish() : "Metallic");
        build.setRimColor(targetRim);
        build.setGlassColor(targetGlass);
        build.setSelectedPartsJson(request.getSelectedPartsJson() != null ? request.getSelectedPartsJson() : "[]");
        build.setTotalEstimatedCost(request.getTotalEstimatedCost() != null ? request.getTotalEstimatedCost() : car.getPriceUsd());
        build.setCreatedAt(LocalDateTime.now());

        return carBuildRepository.save(build);
    }

    @Override
    @Transactional(readOnly = true)
    public CarBuild getBuildByShareCode(String shareCode) {
        return carBuildRepository.findByShareCode(shareCode)
                .orElseThrow(() -> new ResourceNotFoundException("Build not found for share code: " + shareCode));
    }

    @Override
    @Transactional(readOnly = true)
    public List<CarBuild> getRecentBuilds() {
        return carBuildRepository.findTop10ByOrderByCreatedAtDesc();
    }

    @Override
    @Transactional(readOnly = true)
    public List<CarBuild> getUserBuilds(String username) {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + username));
        return carBuildRepository.findByUser_UserIdOrderByCreatedAtDesc(user.getUserId());
    }

    private String generateUniqueShareCode(String carSlug) {
        String prefix = "BUILD";
        if (carSlug != null) {
            if (carSlug.contains("ferrari")) prefix = "F458";
            else if (carSlug.contains("lamborghini")) prefix = "AVENT";
            else if (carSlug.contains("porsche")) prefix = "GT3RS";
            else if (carSlug.contains("mclaren")) prefix = "720S";
            else if (carSlug.contains("nissan") || carSlug.contains("gtr")) prefix = "GTR35";
            else if (carSlug.contains("bmw") || carSlug.contains("m4")) prefix = "M4CSL";
        }

        String chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
        for (int attempt = 0; attempt < 10; attempt++) {
            StringBuilder sb = new StringBuilder();
            sb.append("VT-").append(prefix).append("-");
            for (int i = 0; i < 4; i++) {
                sb.append(chars.charAt(random.nextInt(chars.length())));
            }
            String code = sb.toString();
            if (carBuildRepository.findByShareCode(code).isEmpty()) {
                return code;
            }
        }
        return "VT-" + prefix + "-" + System.currentTimeMillis() % 100000;
    }
}
