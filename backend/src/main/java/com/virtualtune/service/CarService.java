package com.virtualtune.service;

import com.virtualtune.model.Car;
import java.util.List;

public interface CarService {
    List<Car> getAllCars();
    Car getCarById(Long id);
    Car getCarBySlug(String slug);
    Car saveCar(Car car);
}
