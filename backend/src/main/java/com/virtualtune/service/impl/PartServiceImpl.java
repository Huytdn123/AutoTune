package com.virtualtune.service.impl;

import com.virtualtune.service.*;

import com.virtualtune.exception.ResourceNotFoundException;
import com.virtualtune.model.Part;
import com.virtualtune.repository.PartRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class PartServiceImpl implements PartService {

    private final PartRepository partRepository;

    public PartServiceImpl(PartRepository partRepository) {
        this.partRepository = partRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<Part> getAllParts() {
        return partRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public List<Part> getPartsByCategory(String category) {
        if (category == null || category.isBlank()) {
            return partRepository.findAll();
        }
        return partRepository.findByCategoryIgnoreCase(category);
    }

    @Override
    @Transactional(readOnly = true)
    public Part getPartById(Long partId) {
        return partRepository.findById(partId)
                .orElseThrow(() -> new ResourceNotFoundException("Part not found with id: " + partId));
    }
}
