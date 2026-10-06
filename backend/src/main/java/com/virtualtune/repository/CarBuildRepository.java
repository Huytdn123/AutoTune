package com.virtualtune.repository;

import com.virtualtune.model.CarBuild;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CarBuildRepository extends JpaRepository<CarBuild, Long> {
    Optional<CarBuild> findByShareCode(String shareCode);
    List<CarBuild> findByUser_UserIdOrderByCreatedAtDesc(Long userId);
    List<CarBuild> findTop10ByOrderByCreatedAtDesc();
    List<CarBuild> findByCar_SlugAndBodyColorIgnoreCaseAndRimColorIgnoreCaseAndGlassColorIgnoreCaseOrderByCreatedAtDesc(
            String carSlug, String bodyColor, String rimColor, String glassColor);
}
