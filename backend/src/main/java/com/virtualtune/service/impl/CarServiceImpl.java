package com.virtualtune.service.impl;

import com.virtualtune.exception.ResourceNotFoundException;
import com.virtualtune.model.Car;
import com.virtualtune.repository.CarRepository;
import com.virtualtune.service.CarService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CarServiceImpl implements CarService {

    private final CarRepository carRepository;

    public CarServiceImpl(CarRepository carRepository) {
        this.carRepository = carRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Car> getAllCars() {
        return carRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Car getCarById(Long id) {
        return carRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + id));
    }

    @Override
    @Transactional(readOnly = true)
    public Car getCarBySlug(String slug) {
        return carRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Car not found with slug: " + slug));
    }

    @Override
    @Transactional
    public Car saveCar(Car car) {
        return carRepository.save(car);
    }
}
