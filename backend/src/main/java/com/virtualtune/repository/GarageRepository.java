package com.virtualtune.repository;

import com.virtualtune.model.Garage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface GarageRepository extends JpaRepository<Garage, Integer> {
    Optional<Garage> findByGarageCode(String garageCode);
}
