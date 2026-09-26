package com.virtualtune.service;

import com.virtualtune.model.Part;
import java.util.List;

public interface PartService {
    List<Part> getAllParts();
    List<Part> getPartsByCategory(String category);
    Part getPartById(Long partId);
}
