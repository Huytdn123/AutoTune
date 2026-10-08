package com.virtualtune.service;

import com.virtualtune.dto.CreateBuildRequest;
import com.virtualtune.model.CarBuild;
import java.util.List;

public interface CarBuildService {
    CarBuild createBuild(CreateBuildRequest request, String username);
    CarBuild getBuildByShareCode(String shareCode);
    List<CarBuild> getRecentBuilds();
    List<CarBuild> getUserBuilds(String username);
    void deleteBuild(String shareCode, String username, boolean isAdminOrGarageOwner);
    CarBuild renameBuild(String shareCode, String newName, String username, boolean isAdminOrGarageOwner);
    CarBuild forkBuild(String shareCode, String username);
}
