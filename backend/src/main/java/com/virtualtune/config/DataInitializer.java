package com.virtualtune.config;

import com.virtualtune.model.Garage;
import com.virtualtune.model.Part;
import com.virtualtune.model.Permission;
import com.virtualtune.model.Role;
import com.virtualtune.model.User;
import com.virtualtune.repository.GarageRepository;
import com.virtualtune.repository.PartRepository;
import com.virtualtune.repository.PermissionRepository;
import com.virtualtune.repository.RoleRepository;
import com.virtualtune.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
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
    private PermissionRepository permissionRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        try {
            seedDatabase();
            syncTestAccounts();
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

        // 4. Users
        String defaultBcrypt = passwordEncoder.encode("password123");

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
            partRepository.save(new Part(null, "BBS-FIR-992-TITAN", "BBS FI-R Forged Monoblock Wheel Set 20\"/21\"", "Wheels & Rims", "BBS Germany", "Ultra-lightweight aerospace forged aluminum • PCD 5x112 / ET35 • 7.8 kg/wheel", 215000000L, 8, "PASS"));
            partRepository.save(new Part(null, "RAYS-TE37-ULTRA-20", "Volk Racing TE37 Ultra M-Spec Forged 20\"", "Wheels & Rims", "Rays Japan", "Motorsport-grade forged monoblock • PCD 5x114.3 • Bronze Anodized finish", 185000000L, 6, "PASS"));
            partRepository.save(new Part(null, "AKR-EVO-TITAN-992", "Akrapovič Evolution Line Titanium Exhaust System", "Exhaust Systems", "Akrapovič", "Full Titanium construction • Bluetooth active flap control • -11.4 kg weight savings", 185000000L, 3, "PASS"));
            partRepository.save(new Part(null, "KW-35271842-V4CS", "KW Suspensions V4 Clubsport 3-Way Coilover Kit", "Coilovers & Shocks", "KW Automotive", "16-click rebound & independent high/low speed compression • Uniball camber plates", 123000000L, 4, "PASS"));
            partRepository.save(new Part(null, "BRM-1N1.9042A2", "Brembo GT-S 6-Piston Big Brake Kit 380x34mm", "Brake Systems", "Brembo Racing", "Radial monoblock caliper • 2-piece Type 3 slotted disc • 800°C thermal endurance", 96250000L, 5, "PASS"));
            partRepository.save(new Part(null, "VOR-CF-AERO-992", "Vorsteiner Aero Carbon Wing & Rear Diffuser Package", "Carbon Aero Kits", "Vorsteiner USA", "Pre-preg 2x2 weave vacuum autoclave carbon • Aerodynamic downforce profile", 145000000L, 2, "PASS"));
        }
    }

    private void syncTestAccounts() {
        Map<String, String> englishNames = Map.of(
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

        // Ensure 6 official parts exist and match Image 1
        List<Part> targetParts = List.of(
                new Part(null, "BBS-FIR-992-TITAN", "BBS FI-R Forged Monoblock Wheel Set 20\"/21\"", "Wheels & Rims", "BBS Germany", "Ultra-lightweight aerospace forged aluminum • PCD 5x112 / ET35 • 7.8 kg/wheel", 215000000L, 8, "PASS"),
                new Part(null, "RAYS-TE37-ULTRA-20", "Volk Racing TE37 Ultra M-Spec Forged 20\"", "Wheels & Rims", "Rays Japan", "Motorsport-grade forged monoblock • PCD 5x114.3 • Bronze Anodized finish", 185000000L, 6, "PASS"),
                new Part(null, "AKR-EVO-TITAN-992", "Akrapovič Evolution Line Titanium Exhaust System", "Exhaust Systems", "Akrapovič", "Full Titanium construction • Bluetooth active flap control • -11.4 kg weight savings", 185000000L, 3, "PASS"),
                new Part(null, "KW-35271842-V4CS", "KW Suspensions V4 Clubsport 3-Way Coilover Kit", "Coilovers & Shocks", "KW Automotive", "16-click rebound & independent high/low speed compression • Uniball camber plates", 123000000L, 4, "PASS"),
                new Part(null, "BRM-1N1.9042A2", "Brembo GT-S 6-Piston Big Brake Kit 380x34mm", "Brake Systems", "Brembo Racing", "Radial monoblock caliper • 2-piece Type 3 slotted disc • 800°C thermal endurance", 96250000L, 5, "PASS"),
                new Part(null, "VOR-CF-AERO-992", "Vorsteiner Aero Carbon Wing & Rear Diffuser Package", "Carbon Aero Kits", "Vorsteiner USA", "Pre-preg 2x2 weave vacuum autoclave carbon • Aerodynamic downforce profile", 145000000L, 2, "PASS")
        );

        targetParts.forEach(tp -> {
            var existing = partRepository.findBySku(tp.getSku());
            if (existing.isPresent()) {
                Part p = existing.get();
                p.setPartName(tp.getPartName());
                p.setCategory(tp.getCategory());
                p.setBrand(tp.getBrand());
                p.setSpecifications(tp.getSpecifications());
                p.setPriceVnd(tp.getPriceVnd());
                p.setStockQuantity(tp.getStockQuantity());
                partRepository.save(p);
            } else {
                partRepository.save(tp);
            }
        });
    }
}
