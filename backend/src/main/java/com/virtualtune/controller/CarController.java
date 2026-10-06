package com.virtualtune.controller;

import com.virtualtune.model.Car;
import com.virtualtune.service.CarService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cars")
public class CarController {

    private final CarService carService;

    public CarController(CarService carService) {
        this.carService = carService;
    }

    @GetMapping
    public ResponseEntity<List<Car>> getAllCars() {
        return ResponseEntity.ok(carService.getAllCars());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Car> getCarById(@PathVariable String id) {
        try {
            Long numericId = Long.parseLong(id);
            return ResponseEntity.ok(carService.getCarById(numericId));
        } catch (NumberFormatException e) {
            return ResponseEntity.ok(carService.getCarBySlug(id));
        }
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Car> getCarBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(carService.getCarBySlug(slug));
    }
}
