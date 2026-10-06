package com.virtualtune.service;

import com.virtualtune.dto.CreateBuildRequest;
import com.virtualtune.model.CarBuild;
import java.util.List;

public interface CarBuildService {
    CarBuild createBuild(CreateBuildRequest request, String username);
    CarBuild getBuildByShareCode(String shareCode);
    List<CarBuild> getRecentBuilds();
    List<CarBuild> getUserBuilds(String username);
}
