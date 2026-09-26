package com.virtualtune.repository;

import com.virtualtune.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    List<User> findByGarage_GarageId(Integer garageId);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
}
