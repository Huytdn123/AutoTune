package com.virtualtune.config;

import com.virtualtune.model.Car;
import com.virtualtune.model.Garage;
import com.virtualtune.model.Part;
import com.virtualtune.model.Permission;
import com.virtualtune.model.Quotation;
import com.virtualtune.model.QuotationItem;
import com.virtualtune.model.Role;
import com.virtualtune.model.User;
import com.virtualtune.model.WorkOrder;
import com.virtualtune.repository.CarBuildRepository;
import com.virtualtune.repository.CarRepository;
import com.virtualtune.repository.GarageRepository;
import com.virtualtune.repository.PartRepository;
import com.virtualtune.repository.PermissionRepository;
import com.virtualtune.repository.QuotationRepository;
import com.virtualtune.repository.RoleRepository;
import com.virtualtune.repository.UserRepository;
import com.virtualtune.repository.WorkOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private GarageRepository garageRepository;

    @Autowired
    private PartRepository partRepository;

    @Autowired
    private CarRepository carRepository;

    @Autowired
    private CarBuildRepository carBuildRepository;

    @Autowired
    private PermissionRepository permissionRepository;

    @Autowired
    private QuotationRepository quotationRepository;

    @Autowired
    private WorkOrderRepository workOrderRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            seedDatabase();
            seedCars();
            syncTestAccounts();
            seedQuotationsAndWorkOrders();
        } catch (Exception e) {
            System.err.println(">>> DataInitializer notice: " + e.getMessage());
        }
    }

    private void seedDatabase() {
        // 1. Garage
        Garage garage;
        if (garageRepository.count() == 0) {
            garage = garageRepository.save(new Garage(
                    null,
                    "GARAGE-SGN-01",
                    "AutoTune Saigon Performance Hub",
                    "12 Sala Boulevard, An Loi Dong, Thu Duc City",
                    "Ho Chi Minh City",
                    "+84 28 3888 9999",
                    "contact@autotune-saigon.vn",
                    4, 3, 845000000L,
                    new BigDecimal("99.98"), new BigDecimal("4.95"), "ACTIVE"
            ));
        } else {
            garage = garageRepository.findAll().get(0);
        }

        // 2. Permissions
        if (permissionRepository.count() == 0) {
            permissionRepository.save(new Permission(null, "VIEW_DASHBOARD", "Executive Operations Dashboard", "DASHBOARD"));
            permissionRepository.save(new Permission(null, "MANAGE_FINANCE", "Financial & Revenue Management", "FINANCE"));
            permissionRepository.save(new Permission(null, "DISPATCH_BAY", "Service Bay Dispatch & Scheduling", "WORK_ORDER"));
            permissionRepository.save(new Permission(null, "MANAGE_TEAM", "Staff & User Administration", "ACCOUNTS"));
            permissionRepository.save(new Permission(null, "EXECUTE_WORK_ORDER", "Work Order Execution & Updates", "WORK_ORDER"));
            permissionRepository.save(new Permission(null, "VALIDATE_FITMENT", "Fitment Tolerance Verification", "FITMENT"));
            permissionRepository.save(new Permission(null, "CUSTOMIZE_3D", "3D CAD Studio Configurator", "STUDIO"));
            permissionRepository.save(new Permission(null, "REQUEST_QUOTE", "Commercial Quotation Request", "QUOTATION"));
            permissionRepository.save(new Permission(null, "VIEW_WARRANTY", "Digital Warranty Passport", "WARRANTY"));
        }

        List<Permission> allPerms = permissionRepository.findAll();

        // 3. Roles
        Role adminRole = roleRepository.findByRoleCode("ADMIN").orElseGet(() -> {
            Role r = new Role(null, "ADMIN", "System Administrator", "Full system access, audit, security and multi-tenant management", "#EF4444");
            r.setPermissions(new HashSet<>(allPerms));
            return roleRepository.save(r);
        });

        Role garageOwnerRole = roleRepository.findByRoleCode("GARAGE_OWNER").orElseGet(() -> {
            Role r = new Role(null, "GARAGE_OWNER", "Garage Owner (B2B)", "Executive management, bay dispatch, quotation approvals, team administration", "#6091C3");
            r.setPermissions(new HashSet<>(allPerms));
            return roleRepository.save(r);
        });

        Role techLeadRole = roleRepository.findByRoleCode("LEAD_TECHNICIAN").orElseGet(() -> {
            Role r = new Role(null, "LEAD_TECHNICIAN", "Master Technician", "Work order execution, kinematic alignment, 3D CAD fitment & tolerance appraisal", "#10B981");
            Set<Permission> techPerms = new HashSet<>();
            allPerms.forEach(p -> {
                if (p.getPermissionCode().equals("VIEW_DASHBOARD") ||
                    p.getPermissionCode().equals("DISPATCH_BAY") ||
                    p.getPermissionCode().equals("EXECUTE_WORK_ORDER") ||
                    p.getPermissionCode().equals("VALIDATE_FITMENT") ||
                    p.getPermissionCode().equals("CUSTOMIZE_3D") ||
                    p.getPermissionCode().equals("VIEW_WARRANTY")) {
                    techPerms.add(p);
                }
            });
            r.setPermissions(techPerms);
            return roleRepository.save(r);
        });

        roleRepository.findByRoleCode("TECHNICIAN").orElseGet(() -> {
            Role r = new Role(null, "TECHNICIAN", "Service Technician", "Work order execution, kinematic alignment, fitment inspection", "#10B981");
            Set<Permission> techPerms = new HashSet<>();
            allPerms.forEach(p -> {
                if (p.getPermissionCode().equals("VIEW_DASHBOARD") ||
                    p.getPermissionCode().equals("DISPATCH_BAY") ||
                    p.getPermissionCode().equals("EXECUTE_WORK_ORDER") ||
                    p.getPermissionCode().equals("VALIDATE_FITMENT") ||
                    p.getPermissionCode().equals("CUSTOMIZE_3D") ||
                    p.getPermissionCode().equals("VIEW_WARRANTY")) {
                    techPerms.add(p);
                }
            });
            r.setPermissions(techPerms);
            return roleRepository.save(r);
        });

        Role carOwnerRole = roleRepository.findByRoleCode("CAR_OWNER").orElseGet(() -> {
            Role r = new Role(null, "CAR_OWNER", "VIP Client (Car Owner)", "3D exterior studio staging, instant quotation request, digital warranty passport", "#F59E0B");
            Set<Permission> carPerms = new HashSet<>();
            allPerms.forEach(p -> {
                if (p.getPermissionCode().equals("CUSTOMIZE_3D") ||
                    p.getPermissionCode().equals("REQUEST_QUOTE") ||
                    p.getPermissionCode().equals("VIEW_WARRANTY")) {
                    carPerms.add(p);
                }
            });
            r.setPermissions(carPerms);
            return roleRepository.save(r);
        });

        roleRepository.findByRoleCode("CUSTOMER").orElseGet(() -> {
            Role r = new Role(null, "CUSTOMER", "Customer", "3D exterior studio staging, instant quotation request, digital warranty passport", "#F59E0B");
            Set<Permission> carPerms = new HashSet<>();
            allPerms.forEach(p -> {
                if (p.getPermissionCode().equals("CUSTOMIZE_3D") ||
                    p.getPermissionCode().equals("REQUEST_QUOTE") ||
                    p.getPermissionCode().equals("VIEW_WARRANTY")) {
                    carPerms.add(p);
                }
            });
            r.setPermissions(carPerms);
            return roleRepository.save(r);
        });

        // 4. Users
        String defaultBcrypt = passwordEncoder.encode("password123");

        if (userRepository.findByUsername("admin").isEmpty()) {
            userRepository.save(new User(
                    null,
                    "admin",
                    defaultBcrypt,
                    "System Administrator",
                    "admin@virtualtune.com",
                    "+84 901 000 001",
                    adminRole,
                    garage,
                    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150",
                    "ACTIVE"
            ));
        }

        if (userRepository.findByUsername("admin_garage").isEmpty()) {
            userRepository.save(new User(
                    null,
                    "admin_garage",
                    defaultBcrypt,
                    "Tuan Tran",
                    "tuan.tran@autotune-saigon.vn",
                    "+84 908 112 345",
                    garageOwnerRole,
                    garage,
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150",
                    "ACTIVE"
            ));
        }

        if (userRepository.findByUsername("tech_lead").isEmpty()) {
            userRepository.save(new User(
                    null,
                    "tech_lead",
                    defaultBcrypt,
                    "Long Nguyen",
                    "long.tech@autotune-saigon.vn",
                    "+84 912 345 678",
                    techLeadRole,
                    garage,
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150",
                    "ACTIVE"
            ));
        }

        if (userRepository.findByUsername("customer_vip").isEmpty()) {
            userRepository.save(new User(
                    null,
                    "customer_vip",
                    defaultBcrypt,
                    "Khoi Dang",
                    "khoi.dang@gmail.com",
                    "+84 988 776 655",
                    carOwnerRole,
                    null,
                    "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150",
                    "ACTIVE"
            ));
        }

        if (userRepository.findByUsername("tech_junior").isEmpty()) {
            userRepository.save(new User(
                    null,
                    "tech_junior",
                    defaultBcrypt,
                    "Duc Vu",
                    "duc.vu@autotune-saigon.vn",
                    "+84 933 889 900",
                    techLeadRole,
                    garage,
                    "https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150",
                    "ACTIVE"
            ));
        }

        // 5. Parts (Wheels & Rims, Brake Systems, Exhaust Systems, Coilovers & Shocks, Carbon Aero Kits)
        if (partRepository.count() == 0) {
            partRepository.save(new Part(null, "BBS-FIR-992-TITAN", "BBS FI-R Forged Monoblock Wheel Set 20\"/21\"", "Wheels & Rims", "BBS Germany", "Ultra-lightweight aerospace forged aluminum • PCD 5x112 / ET35 • 7.8 kg/wheel", 215000000L, 8, "PASS", "/images/bbs-fi-r-wheel.jpg", "Porsche 911 Carrera (991), BMW Vision ConnectedDrive", new BigDecimal("4.90"), "HOT / BESTSELLER"));
            partRepository.save(new Part(null, "RAYS-TE37-ULTRA-20", "Volk Racing TE37 Ultra M-Spec Forged 20\"", "Wheels & Rims", "Rays Japan", "Motorsport-grade forged monoblock • PCD 5x114.3 • Bronze Anodized finish", 185000000L, 6, "PASS", "/images/rays-te37-ultra.jpg", "Ferrari 458, Honda Civic Type R", new BigDecimal("5.00"), "TRACK LEGEND"));
            partRepository.save(new Part(null, "AKR-EVO-TITAN-992", "Akrapovič Evolution Line Titanium Exhaust System", "Exhaust Systems", "Akrapovič", "Full Titanium construction • Bluetooth active flap control • -11.4 kg weight savings", 185000000L, 3, "PASS", "/images/akrapovic-evolution-line.jpg", "Porsche 911 Carrera (991), Carrera S", new BigDecimal("4.95"), "SIGNATURE SOUND"));
            partRepository.save(new Part(null, "KW-35271842-V4CS", "KW Suspensions V4 Clubsport 3-Way Coilover Kit", "Coilovers & Shocks", "KW Automotive", "16-click rebound & independent high/low speed compression • Uniball camber plates", 123000000L, 4, "PASS", "/images/kw-v4-clubsport.jpg", "BMW Vision ConnectedDrive, Porsche 911 Carrera (991), McLaren 720S", new BigDecimal("4.85"), "TRACK READY"));
            partRepository.save(new Part(null, "BRM-1N1.9042A2", "Brembo GT-S 6-Piston Big Brake Kit 380x34mm", "Brake Systems", "Brembo Racing", "Radial monoblock caliper • 2-piece Type 3 slotted disc • 800°C thermal endurance", 96250000L, 5, "PASS", "/images/brembo-gt-brake-kit.jpg", "Porsche 911 Carrera (991), Ferrari 458", new BigDecimal("4.98"), "RACING SPEC"));
            partRepository.save(new Part(null, "VOR-CF-AERO-992", "Vorsteiner Aero Carbon Wing & Rear Diffuser Package", "Carbon Aero Kits", "Vorsteiner USA", "Pre-preg 2x2 weave vacuum autoclave carbon • Aerodynamic downforce profile", 145000000L, 2, "PASS", "/images/vorsteiner-carbon-aero.jpg", "Porsche 911 Carrera (991), McLaren 720S, BMW Vision ConnectedDrive", new BigDecimal("4.90"), "ULTRA LIGHTWEIGHT"));
        }
    }

    private void syncTestAccounts() {
        Map<String, String> englishNames = Map.of(
                "admin", "System Administrator",
                "admin_garage", "Tuan Tran",
                "tech_lead", "Long Nguyen",
                "customer_vip", "Khoi Dang",
                "tech_junior", "Duc Vu"
        );

        englishNames.forEach((username, cleanName) -> {
            userRepository.findByUsername(username).ifPresent(u -> {
                boolean needsSave = false;
                if (!passwordEncoder.matches("password123", u.getPasswordHash())) {
                    u.setPasswordHash(passwordEncoder.encode("password123"));
                    needsSave = true;
                }
                if (u.getFullName() == null || !u.getFullName().equals(cleanName)) {
                    u.setFullName(cleanName);
                    needsSave = true;
                }
                if (needsSave) {
                    userRepository.save(u);
                }
            });
        });

        // Ensure official parts exist and match catalog with media
        List<Part> targetParts = List.of(
                new Part(null, "BBS-FIR-992-TITAN", "BBS FI-R Forged Monoblock Wheel Set 20\"/21\"", "Wheels & Rims", "BBS Germany", "Ultra-lightweight aerospace forged aluminum • PCD 5x112 / ET35 • 7.8 kg/wheel", 215000000L, 8, "PASS", "/images/bbs-fi-r-wheel.jpg", "Porsche 911 Carrera (991), BMW Vision ConnectedDrive", new BigDecimal("4.90"), "HOT / BESTSELLER"),
                new Part(null, "RAYS-TE37-ULTRA-20", "Volk Racing TE37 Ultra M-Spec Forged 20\"", "Wheels & Rims", "Rays Japan", "Motorsport-grade forged monoblock • PCD 5x114.3 • Bronze Anodized finish", 185000000L, 6, "PASS", "/images/rays-te37-ultra.jpg", "Ferrari 458, Honda Civic Type R", new BigDecimal("5.00"), "TRACK LEGEND"),
                new Part(null, "WORK-VSXX-19-F458", "WORK VS-XX 19\" Aftermarket Wheel", "Wheels & Rims", "WORK Wheels", "19-inch 3-piece modular forged construction • Classic mesh design • PCD 5x114.3", 105000000L, 8, "PASS", "/images/work-vs-xx-wheel.jpg", "Ferrari 458 Italia, Ferrari 458 Spider", new BigDecimal("4.95"), "CC BY 4.0 VERIFIED"),
                new Part(null, "GEN-GTWING-F458", "Carbon Aero GT Wing", "Rear Spoilers", "Track Aerodynamics", "Gloss carbon fiber airfoil blade • Twin CNC aluminum uprights • High-downforce track profile", 61250000L, 5, "PASS", "/images/carbon-gt-wing.jpg", "Ferrari 458 Italia, Ferrari 458 Spider", new BigDecimal("4.92"), "TRACK SPEC"),
                new Part(null, "CARB-AERO-F458", "Carbon Fiber Aerodynamics Package", "Carbon Aero Kits", "Track Aerodynamics", "Pre-preg carbon fiber front splitter extensions • Side skirts • Rear diffuser aero fins", 80000000L, 4, "PASS", "/images/carbon-aero-package.jpg", "Ferrari 458 Italia, Ferrari 458 Spider", new BigDecimal("4.93"), "TRACK SPEC"),
                new Part(null, "AKR-EVO-TITAN-992", "Akrapovič Evolution Line Titanium Exhaust System", "Exhaust Systems", "Akrapovič", "Full Titanium construction • Bluetooth active flap control • -11.4 kg weight savings", 185000000L, 3, "PASS", "/images/akrapovic-evolution-line.jpg", "Porsche 911 Carrera (991), Carrera S", new BigDecimal("4.95"), "SIGNATURE SOUND"),
                new Part(null, "KW-35271842-V4CS", "KW Suspensions V4 Clubsport 3-Way Coilover Kit", "Coilovers & Shocks", "KW Automotive", "16-click rebound & independent high/low speed compression • Uniball camber plates", 123000000L, 4, "PASS", "/images/kw-v4-clubsport.jpg", "BMW Vision ConnectedDrive, Porsche 911 Carrera (991), McLaren 720S", new BigDecimal("4.85"), "TRACK READY"),
                new Part(null, "BRM-1N1.9042A2", "Brembo GT-S 6-Piston Big Brake Kit 380x34mm", "Brake Systems", "Brembo Racing", "Radial monoblock caliper • 2-piece Type 3 slotted disc • 800°C thermal endurance", 96250000L, 5, "PASS", "/images/brembo-gt-brake-kit.jpg", "Porsche 911 Carrera (991), Ferrari 458", new BigDecimal("4.98"), "RACING SPEC"),
                new Part(null, "VOR-CF-AERO-992", "Vorsteiner Aero Carbon Wing & Rear Diffuser Package", "Carbon Aero Kits", "Vorsteiner USA", "Pre-preg 2x2 weave vacuum autoclave carbon • Aerodynamic downforce profile", 145000000L, 2, "PASS", "/images/vorsteiner-carbon-aero.jpg", "Porsche 911 Carrera (991), McLaren 720S, BMW Vision ConnectedDrive", new BigDecimal("4.90"), "ULTRA LIGHTWEIGHT")
        );

        // Clean up obsolete unverified parts
        List<String> obsoleteSkus = List.of("NOV-NF4-21-F458", "LB-WORKS-458-AERO-CFRP", "LB-458-GT-WING-CFRP", "LB-458-DUCKTAIL-CFRP");
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
                p.setBoltPattern("5x112");
                p.setWheelDiameterInch(new BigDecimal("20.0"));
                p.setWheelWidthInch(new BigDecimal("9.5"));
                p.setOffsetEt(35);
                p.setCenterBoreMm(new BigDecimal("66.6"));
            } else if ("RAYS-TE37-ULTRA-20".equals(tp.getSku())) {
                p.setBoltPattern("5x114.3");
                p.setWheelDiameterInch(new BigDecimal("20.0"));
                p.setWheelWidthInch(new BigDecimal("10.0"));
                p.setOffsetEt(30);
                p.setCenterBoreMm(new BigDecimal("66.1"));
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
            } else if ("BRM-1N1.9042A2".equals(tp.getSku())) {
                p.setBoltPattern("Universal");
                p.setBrakeDiscDiameterMm(380);
                p.setMinWheelDiameterInch(new BigDecimal("19.0"));
            }
            partRepository.save(p);
        });
    }

    private void seedCars() {
        List<Car> initialCars = List.of(
            new Car(
                null,
                "ferrari-458",
                "Ferrari",
                "458 Italia",
                "2009–2015",
                "Supercar Coupé",
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

    private void seedQuotationsAndWorkOrders() {
        if (quotationRepository.count() > 0) {
            return;
        }

        User customer = userRepository.findByUsername("customer_vip").orElse(null);
        User techLead = userRepository.findByUsername("tech_lead").orElse(null);
        Garage garage = garageRepository.findAll().stream().findFirst().orElse(null);

        if (customer == null || garage == null) {
            return;
        }

        // Quotation 1: Approved quote with active work order
        Quotation q1 = new Quotation();
        q1.setQuotationNumber("VT-QTE-2026-089");
        q1.setCustomer(customer);
        q1.setCarModel("Porsche 911 Carrera (991)");
        q1.setCustomerName(customer.getFullName());
        q1.setCustomerPhone(customer.getPhone());
        q1.setGarage(garage);
        q1.setGarageName(garage.getGarageName());
        q1.setPartsTotal(345000000L);
        q1.setLaborTotal(15000000L);
        q1.setDiscountAmount(20000000L);
        q1.setTaxAmount(0L);
        q1.setFinalTotal(340000000L);
        q1.setStatus("APPROVED");
        q1.setLegalStatus("PASS");
        q1.setNotes("High-downforce aero pack + BBS Forged Titanium wheels & Akrapovič Evolution Line exhaust");

        List<QuotationItem> q1Items = new ArrayList<>();
        QuotationItem item1 = new QuotationItem(null, q1, null, "BBS FI-R Forged Titanium Wheels (Set of 4)", "BBS-FIR-992-TITAN", "Wheels", 1, 185000000L, 185000000L);
        QuotationItem item2 = new QuotationItem(null, q1, null, "Akrapovič Evolution Line Titanium Exhaust", "AKR-EVO-TITAN-992", "Exhaust", 1, 160000000L, 160000000L);
        q1Items.add(item1);
        q1Items.add(item2);
        q1.setItems(q1Items);

        Quotation savedQ1 = quotationRepository.save(q1);

        // WorkOrder 1: Dispatched from approved Quotation 1
        WorkOrder wo1 = new WorkOrder();
        wo1.setWorkOrderNumber("WO-2026-001");
        wo1.setQuotation(savedQ1);
        wo1.setCustomer(customer);
        wo1.setTechnician(techLead);
        wo1.setVehicleModel("Porsche 911 Carrera (991)");
        wo1.setGarage(garage);
        wo1.setBayNumber("Bay 02 - Dyno & Performance Alignment");
        wo1.setStatus("IN_PROGRESS");
        wo1.setProgress(65);
        wo1.setPriority("HIGH");
        wo1.setNotes("BBS wheel balance & fitment inspection completed. Akrapovič titanium exhaust fitment in progress on lift 2.");
        wo1.setStartedAt(LocalDateTime.now().minusHours(4));
        workOrderRepository.save(wo1);

        // Quotation 2: Pending Sent quotation
        Quotation q2 = new Quotation();
        q2.setQuotationNumber("VT-QTE-2026-092");
        q2.setCustomer(customer);
        q2.setCarModel("Ferrari 458 Italia");
        q2.setCustomerName(customer.getFullName());
        q2.setCustomerPhone(customer.getPhone());
        q2.setGarage(garage);
        q2.setGarageName(garage.getGarageName());
        q2.setPartsTotal(145000000L);
        q2.setLaborTotal(10000000L);
        q2.setDiscountAmount(5000000L);
        q2.setTaxAmount(0L);
        q2.setFinalTotal(150000000L);
        q2.setStatus("SENT");
        q2.setLegalStatus("PASS");
        q2.setNotes("Brembo GT Big Brake Kit conversion package with 6-piston monobloc calipers");

        List<QuotationItem> q2Items = new ArrayList<>();
        QuotationItem item3 = new QuotationItem(null, q2, null, "Brembo GT 6-Piston BBK Monobloc Front Kit", "BRM-1N1.9042A2", "Brakes", 1, 145000000L, 145000000L);
        q2Items.add(item3);
        q2.setItems(q2Items);

        quotationRepository.save(q2);
    }
}
