package com.virtualtune.seeder;

import com.virtualtune.model.Car;
import com.virtualtune.repository.CarRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
public class CarFleetSeeder {

    @Autowired
    private CarRepository carRepository;

    public void seed() {
        List<Car> initialCars = List.of(
            new Car(
                null,
                "ferrari-458",
                "Ferrari",
                "458 Spider",
                "2011–2015",
                "Supercar Spider",
                "4.5L V8 · 562hp · 0-100: 3.4s",
                "5x114.3",
                new BigDecimal("20.0"),
                1380,
                562,
                328000L,
                "Maranello, Italy",
                "#CC0000",
                "#CC0000",
                "#CCCCCC",
                "#C8D8F0",
                "/models/ferrari.glb",
                "READY_FOR_3D",
                "{\"performance\":[{\"label\":\"Engine\",\"value\":\"4.5L V8 Naturally Aspirated\"},{\"label\":\"Power\",\"value\":\"562 hp @ 9,000 rpm\"},{\"label\":\"Torque\",\"value\":\"398 lb-ft @ 6,000 rpm\"},{\"label\":\"0–100 km/h\",\"value\":\"3.4 seconds\"},{\"label\":\"Top Speed\",\"value\":\"325 km/h\"},{\"label\":\"Transmission\",\"value\":\"7-speed Dual Clutch\"},{\"label\":\"Weight\",\"value\":\"1,380 kg\"}],\"aerodynamics\":[{\"label\":\"Downforce\",\"value\":\"140 kg @ 200 km/h\"},{\"label\":\"Front Splitter\",\"value\":\"Carbon Fibre Fixed\"},{\"label\":\"Diffuser\",\"value\":\"Active Variable\"},{\"label\":\"Cd\",\"value\":\"0.33\"},{\"label\":\"Cl\",\"value\":\"-0.26\"}],\"suspension\":[{\"label\":\"Front\",\"value\":\"Double Wishbone MagneRide\"},{\"label\":\"Rear\",\"value\":\"Multi-Link Adaptive\"},{\"label\":\"Dampers\",\"value\":\"Magneto-rheological\"},{\"label\":\"Springs\",\"value\":\"Coilover Adjustable\"}]}"
            ),
            new Car(
                null,
                "lamborghini-aventador",
                "Lamborghini",
                "Aventador LP700",
                "2011–2021",
                "Supercar Coupé",
                "6.5L V12 · 700hp · 0-100: 2.9s",
                "5x112",
                new BigDecimal("20.0"),
                1575,
                700,
                393000L,
                "Sant'Agata Bolognese, Italy",
                "#F5C400",
                "#F5C400",
                "#1A1A1A",
                "#1A1A1A",
                "/models/lamborghini.glb",
                "READY_FOR_3D",
                "{\"performance\":[{\"label\":\"Engine\",\"value\":\"6.5L L539 60° V12\"},{\"label\":\"Power\",\"value\":\"700 hp @ 8,250 rpm\"},{\"label\":\"Torque\",\"value\":\"509 lb-ft @ 5,500 rpm\"},{\"label\":\"0–100 km/h\",\"value\":\"2.9 seconds\"},{\"label\":\"Top Speed\",\"value\":\"350 km/h\"},{\"label\":\"Transmission\",\"value\":\"7-speed ISR Independent Shifting\"},{\"label\":\"Weight\",\"value\":\"1,575 kg\"}],\"aerodynamics\":[{\"label\":\"Downforce\",\"value\":\"220 kg @ 250 km/h\"},{\"label\":\"Front Splitter\",\"value\":\"Carbon Aero Inlets\"},{\"label\":\"Rear Wing\",\"value\":\"Active 3-Position Electronically Managed\"},{\"label\":\"Cd\",\"value\":\"0.33\"},{\"label\":\"Cl\",\"value\":\"-0.35\"}],\"suspension\":[{\"label\":\"Front\",\"value\":\"Formula 1 Style Pushrod Magneto\"},{\"label\":\"Rear\",\"value\":\"Pushrod Horizontal Damper\"},{\"label\":\"Dampers\",\"value\":\"Magneto-rheological Pushrod\"},{\"label\":\"Springs\",\"value\":\"Öhlins Race Coilover\"}]}"
            ),
            new Car(
                null,
                "porsche-gt3",
                "Porsche",
                "911 Carrera (991)",
                "2012–2019",
                "Sports Coupé",
                "3.0L TT Flat-6 · 370hp · 0-100: 4.2s",
                "5x130",
                new BigDecimal("20.0"),
                1430,
                370,
                105000L,
                "Stuttgart-Zuffenhausen, Germany",
                "#0A1A6E",
                "#FAFAFA",
                "#CCCCCC",
                "#C8D8F0",
                "/models/porsche.glb",
                "READY_FOR_3D",
                "{\"performance\":[{\"label\":\"Engine\",\"value\":\"3.0L Twin-Turbo Flat-6 (991.2)\"},{\"label\":\"Power\",\"value\":\"370 hp @ 6,500 rpm\"},{\"label\":\"Torque\",\"value\":\"331 lb-ft @ 1,700–5,000 rpm\"},{\"label\":\"0–100 km/h\",\"value\":\"4.2 seconds\"},{\"label\":\"Top Speed\",\"value\":\"295 km/h\"},{\"label\":\"Transmission\",\"value\":\"7-speed PDK Dual-Clutch\"},{\"label\":\"Weight\",\"value\":\"1,430 kg\"}],\"aerodynamics\":[{\"label\":\"Downforce\",\"value\":\"45 kg @ 200 km/h\"},{\"label\":\"Active Spoiler\",\"value\":\"Electric Active Deployable Rear Spoiler\"},{\"label\":\"Air Inlets\",\"value\":\"Active Cooling Air Flaps\"},{\"label\":\"Cd\",\"value\":\"0.29\"},{\"label\":\"Cl\",\"value\":\"-0.08\"}],\"suspension\":[{\"label\":\"Front\",\"value\":\"MacPherson Strut with Anti-Roll Bar\"},{\"label\":\"Rear\",\"value\":\"Multi-Link LSA Axle\"},{\"label\":\"Dampers\",\"value\":\"PASM Porsche Active Suspension\"},{\"label\":\"Springs\",\"value\":\"Sport-Tuned Progressive Coil Springs\"}]}"
            ),
            new Car(
                null,
                "mclaren-720s",
                "McLaren",
                "720S",
                "2017–2023",
                "Supercar Coupé",
                "4.0L TT V8 · 720hp · 0-100: 2.8s",
                "5x112",
                new BigDecimal("19.0"),
                1332,
                720,
                312000L,
                "Woking, United Kingdom",
                "#FF6B00",
                "#FF6B00",
                "#CCCCCC",
                "#1A1A1A",
                "/models/mclaren.glb",
                "READY_FOR_3D",
                "{\"performance\":[{\"label\":\"Engine\",\"value\":\"4.0L Twin-Turbo V8 M840T\"},{\"label\":\"Power\",\"value\":\"720 hp @ 7,500 rpm\"},{\"label\":\"Torque\",\"value\":\"568 lb-ft @ 5,500 rpm\"},{\"label\":\"0–100 km/h\",\"value\":\"2.8 seconds\"},{\"label\":\"Top Speed\",\"value\":\"341 km/h\"},{\"label\":\"Transmission\",\"value\":\"7-speed SSG Dual Clutch\"},{\"label\":\"Weight\",\"value\":\"1,332 kg\"}],\"aerodynamics\":[{\"label\":\"Downforce\",\"value\":\"1,000+ kg @ 250 km/h\"},{\"label\":\"Active Wing\",\"value\":\"Integrated Active Airbrake\"},{\"label\":\"Front\",\"value\":\"Carbon MonoCell II Front Sub\"},{\"label\":\"Cd\",\"value\":\"0.32\"},{\"label\":\"Cl\",\"value\":\"-0.46\"}],\"suspension\":[{\"label\":\"Front\",\"value\":\"Proactive Chassis Control II\"},{\"label\":\"Rear\",\"value\":\"Wishbone Hydraulic Interconnect\"},{\"label\":\"Dampers\",\"value\":\"3-Stage Variable PCC II\"},{\"label\":\"Springs\",\"value\":\"High-Performance GTR Race\"}]}"
            ),
            new Car(
                null,
                "bmw-m4-csl",
                "BMW",
                "Vision ConnectedDrive",
                "2011 Concept",
                "Concept Roadster",
                "Electric / TT Hybrid · Concept Roadster · 0-100: 4.5s",
                "5x112",
                new BigDecimal("20.0"),
                1450,
                340,
                120000L,
                "Munich, Bavaria, Germany",
                "#0066CC",
                "#1A1A1A",
                "#CCCCCC",
                "#C8D8F0",
                "/models/bmw.glb",
                "READY_FOR_3D",
                "{\"performance\":[{\"label\":\"Engine\",\"value\":\"Electric / TwinPower Turbo Hybrid Concept\"},{\"label\":\"Power\",\"value\":\"340 hp equivalent\"},{\"label\":\"Torque\",\"value\":\"369 lb-ft equivalent\"},{\"label\":\"0–100 km/h\",\"value\":\"4.5 seconds\"},{\"label\":\"Top Speed\",\"value\":\"250 km/h\"},{\"label\":\"Transmission\",\"value\":\"Single-Speed Direct Drive\"},{\"label\":\"Weight\",\"value\":\"1,450 kg\"}],\"aerodynamics\":[{\"label\":\"Downforce\",\"value\":\"50 kg @ 200 km/h\"},{\"label\":\"Active Grille\",\"value\":\"Adaptive Kidney Grille Shutter\"},{\"label\":\"Fairings\",\"value\":\"Streamlined Speedster Fairings\"},{\"label\":\"Cd\",\"value\":\"0.26\"},{\"label\":\"Cl\",\"value\":\"-0.12\"}],\"suspension\":[{\"label\":\"Front\",\"value\":\"Double Wishbone Lightweight Aluminum\"},{\"label\":\"Rear\",\"value\":\"Multi-Link Dynamic Suspension\"},{\"label\":\"Dampers\",\"value\":\"BMW Dynamic Damper Control\"},{\"label\":\"Springs\",\"value\":\"M Performance Progressive Springs\"}]}"
            ),
            new Car(
                null,
                "vinfast-vf3",
                "VinFast",
                "VF3 Plus",
                "2026",
                "Electric Mini SUV",
                "Single Motor · 43hp · City EV · 210km Range",
                "4x100",
                new BigDecimal("16.0"),
                857,
                43,
                13000L,
                "White Edition · City EV",
                "#0068FF",
                "#FAFAFA",
                "#1A1A1A",
                "#C8D8F0",
                "/models/vinfast/vf3-plus-2026/vinfast_vf3_plus_2026.glb",
                "READY_FOR_3D",
                "{\"performance\":[{\"label\":\"Motor\",\"value\":\"Permanent Magnet Synchronous (Rear Axle)\"},{\"label\":\"Power\",\"value\":\"43 hp (32 kW)\"},{\"label\":\"Torque\",\"value\":\"110 Nm\"},{\"label\":\"0–50 km/h\",\"value\":\"5.3 seconds\"},{\"label\":\"0–100 km/h\",\"value\":\"19.5 seconds\"},{\"label\":\"Top Speed\",\"value\":\"100 km/h\"},{\"label\":\"Battery\",\"value\":\"18.64 kWh LFP (Liquid Cooled)\"},{\"label\":\"Range (NEDC)\",\"value\":\"210 km per charge\"},{\"label\":\"Charging (10-70%)\",\"value\":\"36 minutes (DC Fast Charging)\"},{\"label\":\"Weight\",\"value\":\"857 kg\"}],\"aerodynamics\":[{\"label\":\"Body Style\",\"value\":\"2-Door 4-Seater Mini SUV\"},{\"label\":\"Ground Clearance\",\"value\":\"191 mm\"},{\"label\":\"Approach Angle\",\"value\":\"25.0°\"},{\"label\":\"Departure Angle\",\"value\":\"32.0°\"},{\"label\":\"Turning Radius\",\"value\":\"4.0 m\"},{\"label\":\"Cd\",\"value\":\"0.36\"}],\"suspension\":[{\"label\":\"Front\",\"value\":\"MacPherson Strut with Coil Springs\"},{\"label\":\"Rear\",\"value\":\"Trailing Arm Rigid Axle with Coil Springs\"},{\"label\":\"Brakes\",\"value\":\"Front Disc / Rear Drum with Regenerative Braking\"},{\"label\":\"Steering\",\"value\":\"Electric Power Steering (EPS)\"}]}"
            )
        );

        initialCars.forEach(car -> {
            if ("ferrari-458".equals(car.getSlug())) {
                car.setStockWheelWidthInch(new BigDecimal("9.0"));
                car.setStockOffsetEt(45);
                car.setStockCenterBoreMm(new BigDecimal("67.1"));
                car.setStockBrakeDiscMm(398);
            } else if ("lamborghini-aventador".equals(car.getSlug())) {
                car.setStockWheelWidthInch(new BigDecimal("9.0"));
                car.setStockOffsetEt(35);
                car.setStockCenterBoreMm(new BigDecimal("66.6"));
                car.setStockBrakeDiscMm(400);
            } else if ("porsche-gt3".equals(car.getSlug())) {
                car.setStockWheelWidthInch(new BigDecimal("10.0"));
                car.setStockOffsetEt(45);
                car.setStockCenterBoreMm(new BigDecimal("71.6"));
                car.setStockBrakeDiscMm(330);
            } else if ("mclaren-720s".equals(car.getSlug())) {
                car.setStockWheelWidthInch(new BigDecimal("9.0"));
                car.setStockOffsetEt(38);
                car.setStockCenterBoreMm(new BigDecimal("66.6"));
                car.setStockBrakeDiscMm(390);
            } else if ("bmw-m4-csl".equals(car.getSlug())) {
                car.setStockWheelWidthInch(new BigDecimal("9.5"));
                car.setStockOffsetEt(25);
                car.setStockCenterBoreMm(new BigDecimal("72.6"));
                car.setStockBrakeDiscMm(360);
            } else if ("vinfast-vf3".equals(car.getSlug())) {
                car.setStockWheelWidthInch(new BigDecimal("6.0"));
                car.setStockOffsetEt(40);
                car.setStockCenterBoreMm(new BigDecimal("54.1"));
                car.setStockBrakeDiscMm(260);
            }

            carRepository.findBySlug(car.getSlug()).ifPresentOrElse(
                existing -> {
                    existing.setBrand(car.getBrand());
                    existing.setModel(car.getModel());
                    existing.setYearManufactured(car.getYearManufactured());
                    existing.setBodyType(car.getBodyType());
                    existing.setTagline(car.getTagline());
                    existing.setStockBoltPattern(car.getStockBoltPattern());
                    existing.setStockWheelSizeInch(car.getStockWheelSizeInch());
                    existing.setStockWheelWidthInch(car.getStockWheelWidthInch());
                    existing.setStockOffsetEt(car.getStockOffsetEt());
                    existing.setStockCenterBoreMm(car.getStockCenterBoreMm());
                    existing.setStockBrakeDiscMm(car.getStockBrakeDiscMm());
                    existing.setCurbWeightKg(car.getCurbWeightKg());
                    existing.setHorsepower(car.getHorsepower());
                    existing.setPriceUsd(car.getPriceUsd());
                    existing.setBadge(car.getBadge());
                    existing.setAccentColor(car.getAccentColor());
                    existing.setDefaultBodyColor(car.getDefaultBodyColor());
                    existing.setDefaultRimColor(car.getDefaultRimColor());
                    existing.setDefaultGlassColor(car.getDefaultGlassColor());
                    existing.setModel3dPath(car.getModel3dPath());
                    existing.setStatus(car.getStatus());
                    existing.setSpecsJson(car.getSpecsJson());
                    carRepository.save(existing);
                },
                () -> carRepository.save(car)
            );
        });
    }
}

