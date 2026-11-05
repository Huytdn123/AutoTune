package com.virtualtune.seeder;

import com.virtualtune.model.Part;
import com.virtualtune.repository.PartRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class PartCatalogSeeder {

    @Autowired
    private PartRepository partRepository;

    public void seed() {
        if (partRepository.count() == 0) {
            partRepository.save(new Part(null, "BBS-FIR-992-TITAN", "BBS LM Forged Monoblock 20\"", "Wheels & Rims", "BBS Germany", "Iconic BBS multi-spoke modular forged design • PCD 5x114.3 / 5x112 • Gold finish", 215000000L, 8, "PASS", "/images/bbs-lm-wheel.jpg", "Ferrari 458 Spider, Porsche 911 Carrera (991), BMW Vision ConnectedDrive", new BigDecimal("4.90"), "HOT / BESTSELLER"));
            partRepository.save(new Part(null, "AKR-EVO-TITAN-992", "Akrapovič Evolution Line Titanium Exhaust System", "Exhaust Systems", "Akrapovič", "Full Titanium construction • Bluetooth active flap control • -11.4 kg weight savings", 185000000L, 3, "PASS", "/images/akrapovic-evolution-line.jpg", "Porsche 911 Carrera (991), Carrera S", new BigDecimal("4.95"), "SIGNATURE SOUND"));
            partRepository.save(new Part(null, "KW-35271842-V4CS", "KW Suspensions V4 Clubsport 3-Way Coilover Kit", "Coilovers & Shocks", "KW Automotive", "16-click rebound & independent high/low speed compression • Uniball camber plates", 123000000L, 4, "PASS", "/images/kw-v4-clubsport.jpg", "BMW Vision ConnectedDrive, Porsche 911 Carrera (991), McLaren 720S", new BigDecimal("4.85"), "TRACK READY"));
            partRepository.save(new Part(null, "BRM-1N1.9042A2", "Brembo GT-S 6-Piston Big Brake Kit 380x34mm", "Brake Systems", "Brembo Racing", "Radial monoblock caliper • 2-piece Type 3 slotted disc • 800°C thermal endurance", 96250000L, 5, "PASS", "/images/brembo-gt-brake-kit.jpg", "Porsche 911 Carrera (991), Ferrari 458 Spider", new BigDecimal("4.98"), "RACING SPEC"));
            partRepository.save(new Part(null, "VOR-CF-AERO-992", "GT3 Carbon Aero Wing", "Carbon Aero Kits", "GT3 Aerodynamics", "Motorsport-grade swan-neck carbon wing • High-downforce profile • CNC aluminum uprights", 145000000L, 2, "PASS", "/images/gt3-carbon-wing.jpg", "Ferrari 458 Spider, Porsche 911 Carrera (991), McLaren 720S", new BigDecimal("4.92"), "TRACK SPEC"));
        }

        syncParts();
    }

    public void syncParts() {
        // Ensure official parts exist and match catalog with media
        List<Part> targetParts = List.of(
                new Part(null, "BBS-FIR-992-TITAN", "BBS LM Forged Monoblock 20\"", "Wheels & Rims", "BBS Germany", "Iconic BBS multi-spoke modular forged design • PCD 5x114.3 / 5x112 • Gold finish", 215000000L, 8, "PASS", "/images/bbs-lm-wheel.jpg", "Ferrari 458 Spider, Porsche 911 Carrera (991), BMW Vision ConnectedDrive", new BigDecimal("4.90"), "HOT / BESTSELLER"),
                new Part(null, "WORK-VSXX-19-F458", "WORK VS-XX 19\" Aftermarket Wheel", "Wheels & Rims", "WORK Wheels", "19-inch 3-piece modular forged construction • Classic mesh design • PCD 5x114.3", 105000000L, 8, "PASS", "/images/work-vs-xx-wheel.jpg", "Ferrari 458 Spider", new BigDecimal("4.95"), "CC BY 4.0 VERIFIED"),
                new Part(null, "GEN-GTWING-F458", "Carbon Aero GT Wing", "Rear Spoilers", "Track Aerodynamics", "Gloss carbon fiber airfoil blade • Twin CNC aluminum uprights • High-downforce track profile", 61250000L, 5, "PASS", "/images/carbon-gt-wing.jpg", "Ferrari 458 Spider", new BigDecimal("4.92"), "TRACK SPEC"),
                new Part(null, "CARB-AERO-F458", "Carbon Fiber Aerodynamics Package", "Carbon Aero Kits", "Track Aerodynamics", "Pre-preg carbon fiber front splitter extensions • Side skirts • Rear diffuser aero fins", 80000000L, 4, "PASS", "/images/carbon-aero-package.jpg", "Ferrari 458 Spider", new BigDecimal("4.93"), "TRACK SPEC"),
                new Part(null, "AKR-EVO-TITAN-992", "Akrapovič Evolution Line Titanium Exhaust System", "Exhaust Systems", "Akrapovič", "Full Titanium construction • Bluetooth active flap control • -11.4 kg weight savings", 185000000L, 3, "PASS", "/images/akrapovic-evolution-line.jpg", "Porsche 911 Carrera (991), Carrera S", new BigDecimal("4.95"), "SIGNATURE SOUND"),
                new Part(null, "KW-35271842-V4CS", "KW Suspensions V4 Clubsport 3-Way Coilover Kit", "Coilovers & Shocks", "KW Automotive", "16-click rebound & independent high/low speed compression • Uniball camber plates", 123000000L, 4, "PASS", "/images/kw-v4-clubsport.jpg", "BMW Vision ConnectedDrive, Porsche 911 Carrera (991), McLaren 720S", new BigDecimal("4.85"), "TRACK READY"),
                new Part(null, "BRM-1N1.9042A2", "Brembo GT-S 6-Piston Big Brake Kit 380x34mm", "Brake Systems", "Brembo Racing", "Radial monoblock caliper • 2-piece Type 3 slotted disc • 800°C thermal endurance", 96250000L, 5, "PASS", "/images/brembo-gt-brake-kit.jpg", "Porsche 911 Carrera (991), Ferrari 458 Spider", new BigDecimal("4.98"), "RACING SPEC"),
                new Part(null, "VOR-CF-AERO-992", "GT3 Carbon Aero Wing", "Carbon Aero Kits", "GT3 Aerodynamics", "Motorsport-grade swan-neck carbon wing • High-downforce profile • CNC aluminum uprights", 145000000L, 2, "PASS", "/images/gt3-carbon-wing.jpg", "Ferrari 458 Spider, Porsche 911 Carrera (991), McLaren 720S", new BigDecimal("4.92"), "TRACK SPEC")
        );

        // Clean up obsolete unverified parts
        List<String> obsoleteSkus = List.of("NOV-NF4-21-F458", "LB-WORKS-458-AERO-CFRP", "LB-458-GT-WING-CFRP", "LB-458-DUCKTAIL-CFRP", "RAYS-TE37-ULTRA-20");
        obsoleteSkus.forEach(sku -> partRepository.findBySku(sku).ifPresent(partRepository::delete));

        targetParts.forEach(tp -> {
            var existing = partRepository.findBySku(tp.getSku());
            Part p = existing.orElse(tp);
            p.setPartName(tp.getPartName());
            p.setCategory(tp.getCategory());
            p.setBrand(tp.getBrand());
            p.setSpecifications(tp.getSpecifications());
            p.setPriceVnd(tp.getPriceVnd());
            p.setStockQuantity(tp.getStockQuantity());
            p.setImageUrl(tp.getImageUrl());
            p.setCompatibleVehicles(tp.getCompatibleVehicles());
            p.setRating(tp.getRating());
            p.setBadge(tp.getBadge());

            // Engineering Fitment specifications & 3D Assets
            if ("BBS-FIR-992-TITAN".equals(tp.getSku())) {
                p.setAssetUrl("/models/parts/ferrari-458/wheels/bbs-lm.glb");
                p.setMaterial("Forged Monoblock Alloy");
                p.setBoltPattern("5x114.3");
                p.setWheelDiameterInch(new BigDecimal("20.0"));
                p.setWheelWidthInch(new BigDecimal("9.5"));
                p.setOffsetEt(35);
                p.setCenterBoreMm(new BigDecimal("67.1"));
            } else if ("WORK-VSXX-19-F458".equals(tp.getSku())) {
                p.setAssetUrl("/models/parts/ferrari-458/wheels/work-vs-xx.glb");
                p.setMaterial("3-Piece Modular Forged Alloy");
                p.setBoltPattern("5x114.3");
                p.setWheelDiameterInch(new BigDecimal("19.0"));
                p.setWheelWidthInch(new BigDecimal("10.0"));
                p.setOffsetEt(30);
                p.setCenterBoreMm(new BigDecimal("67.1"));
            } else if ("GEN-GTWING-F458".equals(tp.getSku())) {
                p.setAssetUrl("/models/parts/ferrari-458/spoilers/carbon-gt-wing.glb");
                p.setMaterial("Gloss Carbon Fiber & CNC Aluminum");
            } else if ("VOR-CF-AERO-992".equals(tp.getSku())) {
                p.setAssetUrl("/models/parts/ferrari-458/spoilers/free_gt3_spoiler_v01.fbx");
                p.setMaterial("Motorsport Carbon Fiber & CNC Swan Neck Uprights");
            } else if ("BRM-1N1.9042A2".equals(tp.getSku())) {
                p.setBoltPattern("Universal");
                p.setBrakeDiscDiameterMm(380);
                p.setMinWheelDiameterInch(new BigDecimal("19.0"));
            }
            partRepository.save(p);
        });
    }
}

