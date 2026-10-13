-- =========================================================================
-- VIRTUAL TUNE - B2B AUTOMOTIVE PERFORMANCE PLATFORM
-- COMPLETE DATABASE SCHEMA + SEED DATA (MICROSOFT SQL SERVER 2022)
-- Language: 100% English
-- Default password for all test accounts: password123
-- Bcrypt hash: $2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.
-- =========================================================================

-- 1. CREATE DATABASE IF NOT EXISTS
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'VirtualTuneDB')
BEGIN
    CREATE DATABASE VirtualTuneDB COLLATE SQL_Latin1_General_CP1_CI_AS;
END
GO

USE VirtualTuneDB;
GO

-- =========================================================================
-- 2. DROP EXISTING TABLES (Reverse Dependency Order)
-- =========================================================================
IF OBJECT_ID('dbo.warranties',       'U') IS NOT NULL DROP TABLE dbo.warranties;
IF OBJECT_ID('dbo.work_orders',      'U') IS NOT NULL DROP TABLE dbo.work_orders;
IF OBJECT_ID('dbo.quotation_items',  'U') IS NOT NULL DROP TABLE dbo.quotation_items;
IF OBJECT_ID('dbo.quotations',       'U') IS NOT NULL DROP TABLE dbo.quotations;
IF OBJECT_ID('dbo.car_builds',       'U') IS NOT NULL DROP TABLE dbo.car_builds;
IF OBJECT_ID('dbo.parts',            'U') IS NOT NULL DROP TABLE dbo.parts;
IF OBJECT_ID('dbo.cars',             'U') IS NOT NULL DROP TABLE dbo.cars;
IF OBJECT_ID('dbo.role_permissions', 'U') IS NOT NULL DROP TABLE dbo.role_permissions;
IF OBJECT_ID('dbo.permissions',      'U') IS NOT NULL DROP TABLE dbo.permissions;
IF OBJECT_ID('dbo.users',            'U') IS NOT NULL DROP TABLE dbo.users;
IF OBJECT_ID('dbo.roles',            'U') IS NOT NULL DROP TABLE dbo.roles;
IF OBJECT_ID('dbo.garages',          'U') IS NOT NULL DROP TABLE dbo.garages;
GO

-- =========================================================================
-- 3. SCHEMA DEFINITION (100% Aligned with Backend Spring Boot JPA Entities)
-- =========================================================================

-- 3.1 Garages
CREATE TABLE dbo.garages (
    garage_id             INT           IDENTITY(1,1) PRIMARY KEY,
    garage_code           VARCHAR(30)   UNIQUE NOT NULL,
    garage_name           NVARCHAR(150) NOT NULL,
    address               NVARCHAR(255) NOT NULL,
    city                  NVARCHAR(50)  DEFAULT 'Ho Chi Minh City',
    phone                 VARCHAR(20)   NOT NULL,
    email                 VARCHAR(100),
    total_bays            INT           DEFAULT 4,
    active_bays           INT           DEFAULT 3,
    monthly_revenue_vnd   BIGINT        DEFAULT 850000000,
    fitment_accuracy_rate DECIMAL(5,2)  DEFAULT 99.98,
    rating                DECIMAL(3,2)  DEFAULT 4.95,
    status                VARCHAR(20)   DEFAULT 'ACTIVE',
    created_at            DATETIME2     DEFAULT SYSUTCDATETIME()
);

-- 3.2 Roles
CREATE TABLE dbo.roles (
    role_id     INT           IDENTITY(1,1) PRIMARY KEY,
    role_code   VARCHAR(30)   UNIQUE NOT NULL,
    role_name   NVARCHAR(100) NOT NULL,
    description NVARCHAR(255),
    badge_color VARCHAR(20)   DEFAULT '#6091C3'
);

-- 3.3 Users
CREATE TABLE dbo.users (
    user_id       BIGINT        IDENTITY(1,1) PRIMARY KEY,
    username      VARCHAR(50)   UNIQUE NOT NULL,
    password_hash VARCHAR(255)  NOT NULL,
    full_name     NVARCHAR(100) NOT NULL,
    email         VARCHAR(100)  UNIQUE NOT NULL,
    phone         VARCHAR(20),
    role_id       INT           NOT NULL,
    garage_id     INT           NULL,
    avatar_url    NVARCHAR(500),
    status        VARCHAR(20)   DEFAULT 'ACTIVE',
    last_login    DATETIME2     NULL,
    created_at    DATETIME2     DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_users_roles   FOREIGN KEY (role_id)   REFERENCES dbo.roles(role_id),
    CONSTRAINT FK_users_garages FOREIGN KEY (garage_id) REFERENCES dbo.garages(garage_id)
);

-- 3.4 Permissions & Role Mappings
CREATE TABLE dbo.permissions (
    permission_id   INT          IDENTITY(1,1) PRIMARY KEY,
    permission_code VARCHAR(50)  UNIQUE NOT NULL,
    permission_name NVARCHAR(100) NOT NULL,
    module          VARCHAR(50)  NOT NULL
);

CREATE TABLE dbo.role_permissions (
    role_id       INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT FK_roleperm_role FOREIGN KEY (role_id)       REFERENCES dbo.roles(role_id)       ON DELETE CASCADE,
    CONSTRAINT FK_roleperm_perm FOREIGN KEY (permission_id) REFERENCES dbo.permissions(permission_id) ON DELETE CASCADE
);

-- 3.5 Cars (Official Production 3D Supercars & Staging Engineering Specs)
CREATE TABLE dbo.cars (
    car_id                 BIGINT        IDENTITY(1,1) PRIMARY KEY,
    slug                   VARCHAR(50)   UNIQUE NOT NULL,
    brand                  NVARCHAR(50)  NOT NULL,
    model                  NVARCHAR(100) NOT NULL,
    year_manufactured      VARCHAR(30)   NOT NULL,
    body_type              VARCHAR(30)   NOT NULL,
    tagline                NVARCHAR(150),
    stock_bolt_pattern     VARCHAR(20)   NOT NULL,
    stock_wheel_size_inch  DECIMAL(4,1)  NOT NULL,
    stock_wheel_width_inch DECIMAL(4,1)  DEFAULT 9.0,
    stock_offset_et        INT           DEFAULT 45,
    stock_center_bore_mm   DECIMAL(5,1)  DEFAULT 67.1,
    stock_brake_disc_mm    INT           DEFAULT 380,
    curb_weight_kg         INT           NOT NULL,
    horsepower             INT           NOT NULL,
    price_usd              BIGINT        NOT NULL,
    badge                  VARCHAR(100)  DEFAULT 'OFFICIAL 3D CAD',
    accent_color           VARCHAR(30)   DEFAULT '#EF4444',
    default_body_color     VARCHAR(30)   DEFAULT '#CC0000',
    default_rim_color      VARCHAR(30)   DEFAULT '#CCCCCC',
    default_glass_color    VARCHAR(30)   DEFAULT '#C8D8F0',
    model_3d_path          NVARCHAR(255) NOT NULL,
    status                 VARCHAR(20)   DEFAULT 'READY_FOR_3D',
    specs_json             NVARCHAR(MAX)
);

-- 3.6 Parts (Performance Parts Catalog & Fitment Tolerance Specifications)
CREATE TABLE dbo.parts (
    part_id                 BIGINT        IDENTITY(1,1) PRIMARY KEY,
    sku                     VARCHAR(50)   UNIQUE NOT NULL,
    part_name               NVARCHAR(150) NOT NULL,
    category                VARCHAR(50)   NOT NULL,
    brand                   NVARCHAR(50)  NOT NULL,
    specifications          NVARCHAR(255),
    price_vnd               BIGINT        NOT NULL,
    price_usd               INT           NULL DEFAULT 0,
    image_url               NVARCHAR(500),
    compatible_vehicles     NVARCHAR(255),
    rating                  DECIMAL(3,2)  DEFAULT 4.90,
    badge                   VARCHAR(50)   DEFAULT 'OEM CERTIFIED',
    stock_quantity          INT           DEFAULT 10,
    legal_compliance_status VARCHAR(20)   DEFAULT 'PASS',
    bolt_pattern            VARCHAR(30),
    wheel_diameter_inch     DECIMAL(4,1),
    wheel_width_inch        DECIMAL(4,1),
    offset_et               INT,
    center_bore_mm          DECIMAL(5,1),
    brake_disc_diameter_mm  INT,
    min_wheel_diameter_inch DECIMAL(4,1),
    asset_url               NVARCHAR(255) NULL,
    material                NVARCHAR(100) NULL
);

-- 3.7 CarBuilds (Saved 3D Vehicle Configurations with Share Codes)
CREATE TABLE dbo.car_builds (
    build_id             BIGINT        IDENTITY(1,1) PRIMARY KEY,
    share_code           VARCHAR(60)   UNIQUE NOT NULL,
    build_name           NVARCHAR(100) NOT NULL DEFAULT 'Custom 3D Build',
    car_id               BIGINT        NOT NULL,
    user_id              BIGINT        NULL,
    body_color           VARCHAR(20)   NOT NULL DEFAULT '#CC0000',
    body_finish          VARCHAR(30)   DEFAULT 'Metallic',
    rim_color            VARCHAR(20)   NOT NULL DEFAULT '#CCCCCC',
    glass_color          VARCHAR(20)   NOT NULL DEFAULT '#C8D8F0',
    selected_parts_json  NVARCHAR(MAX) DEFAULT '[]',
    total_estimated_cost BIGINT        DEFAULT 0,
    created_at           DATETIME2     DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_carbuilds_cars  FOREIGN KEY (car_id)  REFERENCES dbo.cars(car_id),
    CONSTRAINT FK_carbuilds_users FOREIGN KEY (user_id) REFERENCES dbo.users(user_id)
);

-- 3.8 Quotations
CREATE TABLE dbo.quotations (
    quotation_id     BIGINT        IDENTITY(1,1) PRIMARY KEY,
    quotation_number VARCHAR(60)   UNIQUE NOT NULL,
    customer_id      BIGINT        NOT NULL,
    car_build_id     BIGINT        NULL,
    car_model        NVARCHAR(100) NOT NULL,
    customer_name    NVARCHAR(100),
    customer_phone   VARCHAR(30),
    garage_id        INT           NULL,
    garage_name      NVARCHAR(150) DEFAULT 'AutoTune Saigon Performance Hub',
    parts_total      BIGINT        NOT NULL DEFAULT 0,
    labor_total      BIGINT        NOT NULL DEFAULT 0,
    discount_amount  BIGINT        DEFAULT 0,
    tax_amount       BIGINT        DEFAULT 0,
    final_total      BIGINT        NOT NULL DEFAULT 0,
    status           VARCHAR(30)   NOT NULL DEFAULT 'DRAFT', -- DRAFT, SENT, APPROVED, REJECTED, EXPIRED
    legal_status     VARCHAR(30)   DEFAULT 'PASS',
    notes            NVARCHAR(MAX),
    created_at       DATETIME2     DEFAULT SYSUTCDATETIME(),
    updated_at       DATETIME2     DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_quotations_users    FOREIGN KEY (customer_id)  REFERENCES dbo.users(user_id),
    CONSTRAINT FK_quotations_builds   FOREIGN KEY (car_build_id) REFERENCES dbo.car_builds(build_id),
    CONSTRAINT FK_quotations_garages  FOREIGN KEY (garage_id)    REFERENCES dbo.garages(garage_id)
);

CREATE TABLE dbo.quotation_items (
    item_id         BIGINT        IDENTITY(1,1) PRIMARY KEY,
    quotation_id    BIGINT        NOT NULL,
    part_id         BIGINT        NULL,
    part_name       NVARCHAR(150) NOT NULL,
    part_sku        VARCHAR(50),
    category        VARCHAR(50),
    quantity        INT           NOT NULL DEFAULT 1,
    unit_price_vnd  BIGINT        NOT NULL DEFAULT 0,
    total_price_vnd BIGINT        NOT NULL DEFAULT 0,
    CONSTRAINT FK_quotitems_quotation FOREIGN KEY (quotation_id) REFERENCES dbo.quotations(quotation_id) ON DELETE CASCADE,
    CONSTRAINT FK_quotitems_part      FOREIGN KEY (part_id)      REFERENCES dbo.parts(part_id)
);

-- 3.9 Work Orders (Only Created From APPROVED Quotations)
CREATE TABLE dbo.work_orders (
    work_order_id     BIGINT        IDENTITY(1,1) PRIMARY KEY,
    work_order_number VARCHAR(60)   UNIQUE NOT NULL,
    quotation_id      BIGINT        UNIQUE NOT NULL,
    customer_id       BIGINT        NOT NULL,
    technician_id     BIGINT        NULL,
    car_build_id      BIGINT        NULL,
    vehicle_model     NVARCHAR(100) NOT NULL,
    garage_id         INT           NULL,
    bay_number        VARCHAR(60)   DEFAULT 'Bay 01 - Dyno & Tuning',
    status            VARCHAR(30)   NOT NULL DEFAULT 'PENDING', -- PENDING, IN_PROGRESS, COMPLETED, CANCELLED
    progress          INT           NOT NULL DEFAULT 0,         -- 0 - 100
    priority          VARCHAR(30)   DEFAULT 'NORMAL',           -- NORMAL, HIGH, URGENT
    notes             NVARCHAR(MAX),
    started_at        DATETIME2     NULL,
    completed_at      DATETIME2     NULL,
    created_at        DATETIME2     DEFAULT SYSUTCDATETIME(),
    updated_at        DATETIME2     DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_workorders_quotations  FOREIGN KEY (quotation_id)  REFERENCES dbo.quotations(quotation_id),
    CONSTRAINT FK_workorders_customer    FOREIGN KEY (customer_id)   REFERENCES dbo.users(user_id),
    CONSTRAINT FK_workorders_technician  FOREIGN KEY (technician_id) REFERENCES dbo.users(user_id),
    CONSTRAINT FK_workorders_builds      FOREIGN KEY (car_build_id)  REFERENCES dbo.car_builds(build_id),
    CONSTRAINT FK_workorders_garages     FOREIGN KEY (garage_id)     REFERENCES dbo.garages(garage_id)
);

-- 3.10 Warranties (Digital Warranty Passport)
CREATE TABLE dbo.warranties (
    warranty_id              BIGINT        IDENTITY(1,1) PRIMARY KEY,
    certificate_number       VARCHAR(50)   UNIQUE NOT NULL,
    work_order_id            BIGINT        NOT NULL,
    car_model                NVARCHAR(100) NOT NULL,
    customer_name            NVARCHAR(100) NOT NULL,
    customer_phone           VARCHAR(20),
    issue_date               DATETIME2     DEFAULT SYSUTCDATETIME(),
    expiry_date              DATETIME2     NOT NULL,
    legal_compliance_status  VARCHAR(50)   DEFAULT 'PASSED_COMPLIANCE_2026',
    qr_verification_token    VARCHAR(100)  UNIQUE NOT NULL,
    status                   VARCHAR(20)   DEFAULT 'ACTIVE',
    CONSTRAINT FK_warranties_workorders FOREIGN KEY (work_order_id) REFERENCES dbo.work_orders(work_order_id)
);
GO

-- =========================================================================
-- 4. SEED DATA (Canonical Roles, Exact Real Car Models, Precision Fitment)
-- =========================================================================

-- 4.1 Garages
SET IDENTITY_INSERT dbo.garages ON;
INSERT INTO dbo.garages (garage_id, garage_code, garage_name, address, city, phone, email, total_bays, active_bays, monthly_revenue_vnd, fitment_accuracy_rate, rating, status)
VALUES (1, 'GARAGE-SGN-01', 'AutoTune Saigon Performance Hub',
        '12 Sala Boulevard, An Loi Dong, Thu Duc City',
        'Ho Chi Minh City', '+84 28 3888 9999', 'contact@autotune-saigon.vn',
        4, 3, 845000000, 99.98, 4.95, 'ACTIVE');
SET IDENTITY_INSERT dbo.garages OFF;

-- 4.2 Roles
SET IDENTITY_INSERT dbo.roles ON;
INSERT INTO dbo.roles (role_id, role_code, role_name, description, badge_color) VALUES
(1, 'ADMIN',           'System Administrator',   'Platform-wide administration, security override, audit logs', '#EF4444'),
(2, 'GARAGE_OWNER',    'Garage Owner (B2B)',     'Executive management, bay dispatch, financial approvals, team administration', '#6091C3'),
(3, 'LEAD_TECHNICIAN', 'Master Technician',      'Work order execution, kinematic alignment, 3D CAD fitment & tolerance appraisal', '#10B981'),
(4, 'TECHNICIAN',      'Service Technician',     'Bay execution, component mounting, diagnostic dyno calibration', '#3B82F6'),
(5, 'CAR_OWNER',       'VIP Client (Car Owner)', '3D exterior studio staging, instant quotation request, digital warranty passport', '#F59E0B'),
(6, 'CUSTOMER',        'Registered Customer',    'Client vehicle configuration, quote tracking, and warranty verification', '#F59E0B');
SET IDENTITY_INSERT dbo.roles OFF;

-- 4.3 Permissions
SET IDENTITY_INSERT dbo.permissions ON;
INSERT INTO dbo.permissions (permission_id, permission_code, permission_name, module) VALUES
(1, 'VIEW_DASHBOARD',    'Executive Operations Dashboard',     'DASHBOARD'),
(2, 'MANAGE_FINANCE',    'Financial & Revenue Management',     'FINANCE'),
(3, 'DISPATCH_BAY',      'Service Bay Dispatch & Scheduling',  'WORK_ORDER'),
(4, 'MANAGE_TEAM',       'Staff & User Administration',        'ACCOUNTS'),
(5, 'EXECUTE_WORK_ORDER','Work Order Execution & Updates',     'WORK_ORDER'),
(6, 'VALIDATE_FITMENT',  'Fitment Tolerance Verification',     'FITMENT'),
(7, 'CUSTOMIZE_3D',      '3D CAD Studio Configurator',         'STUDIO'),
(8, 'REQUEST_QUOTE',     'Commercial Quotation Request',       'QUOTATION'),
(9, 'VIEW_WARRANTY',     'Digital Warranty Passport',          'WARRANTY');
SET IDENTITY_INSERT dbo.permissions OFF;

-- 4.4 Role-Permission Mappings
-- ADMIN & GARAGE_OWNER: All permissions
INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9),
(2,1),(2,2),(2,3),(2,4),(2,5),(2,6),(2,7),(2,8),(2,9);
-- LEAD_TECHNICIAN & TECHNICIAN
INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES
(3,1),(3,3),(3,5),(3,6),(3,7),(3,9),
(4,1),(4,3),(4,5),(4,6),(4,7),(4,9);
-- CAR_OWNER & CUSTOMER
INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES
(5,7),(5,8),(5,9),
(6,7),(6,8),(6,9);

-- 4.5 Users (password = password123 for all accounts)
SET IDENTITY_INSERT dbo.users ON;
INSERT INTO dbo.users (user_id, username, password_hash, full_name, email, phone, role_id, garage_id, avatar_url, status, last_login)
VALUES
(1, 'admin',         '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.',
   'System Administrator', 'admin@virtualtune.com',        '+84 901 000 001', 1, 1,
   'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150', 'ACTIVE', SYSUTCDATETIME()),
(2, 'admin_garage',  '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.',
   'Tuan Tran',            'tuan.tran@autotune-saigon.vn', '+84 908 112 345', 2, 1,
   'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'ACTIVE', SYSUTCDATETIME()),
(3, 'tech_lead',     '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.',
   'Long Nguyen',          'long.tech@autotune-saigon.vn', '+84 912 345 678', 3, 1,
   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'ACTIVE', SYSUTCDATETIME()),
(4, 'tech_junior',   '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.',
   'Duc Vu',               'duc.vu@autotune-saigon.vn',     '+84 933 889 900', 4, 1,
   'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', 'ACTIVE', SYSUTCDATETIME()),
(5, 'customer_vip',  '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.',
   'Khoi Dang',            'khoi.dang@gmail.com',           '+84 988 776 655', 5, NULL,
   'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'ACTIVE', SYSUTCDATETIME());
SET IDENTITY_INSERT dbo.users OFF;

-- 4.6 Cars (6 Official 3D Supercars matching public/models/*.glb & CarScene3D.jsx exactly)
SET IDENTITY_INSERT dbo.cars ON;
INSERT INTO dbo.cars (car_id, slug, brand, model, year_manufactured, body_type, tagline, stock_bolt_pattern, stock_wheel_size_inch, stock_wheel_width_inch, stock_offset_et, stock_center_bore_mm, stock_brake_disc_mm, curb_weight_kg, horsepower, price_usd, badge, accent_color, default_body_color, default_rim_color, default_glass_color, model_3d_path, status, specs_json)
VALUES
(1, 'ferrari-458', 'Ferrari', '458 Italia', '2009–2015', 'Supercar Coupé', '4.5L V8 · 562hp · 0-100: 3.4s', '5x114.3', 20.0, 9.0, 45, 67.1, 398, 1380, 562, 328000, 'Maranello, Italy', '#CC0000', '#CC0000', '#CCCCCC', '#C8D8F0', '/models/ferrari.glb', 'READY_FOR_3D',
 '{"performance":[{"label":"Engine","value":"4.5L V8 Naturally Aspirated"},{"label":"Power","value":"562 hp @ 9,000 rpm"},{"label":"Torque","value":"398 lb-ft @ 6,000 rpm"},{"label":"0–100 km/h","value":"3.4 seconds"},{"label":"Top Speed","value":"325 km/h"},{"label":"Transmission","value":"7-speed Dual Clutch"},{"label":"Weight","value":"1,380 kg"}],"aerodynamics":[{"label":"Downforce","value":"140 kg @ 200 km/h"},{"label":"Front Splitter","value":"Carbon Fibre Fixed"},{"label":"Diffuser","value":"Active Variable"},{"label":"Cd","value":"0.33"},{"label":"Cl","value":"-0.26"}],"suspension":[{"label":"Front","value":"Double Wishbone MagneRide"},{"label":"Rear","value":"Multi-Link Adaptive"},{"label":"Dampers","value":"Magneto-rheological"},{"label":"Springs","value":"Coilover Adjustable"}]}'),

(2, 'lamborghini-aventador', 'Lamborghini', 'Aventador LP700', '2011–2021', 'Supercar Coupé', '6.5L V12 · 700hp · 0-100: 2.9s', '5x112', 20.0, 9.5, 40, 57.1, 400, 1575, 700, 393000, 'Sant''Agata Bolognese, Italy', '#F5C400', '#F5C400', '#1A1A1A', '#1A1A1A', '/models/lamborghini.glb', 'READY_FOR_3D',
 '{"performance":[{"label":"Engine","value":"6.5L L539 60° V12"},{"label":"Power","value":"700 hp @ 8,250 rpm"},{"label":"Torque","value":"509 lb-ft @ 5,500 rpm"},{"label":"0–100 km/h","value":"2.9 seconds"},{"label":"Top Speed","value":"350 km/h"},{"label":"Transmission","value":"7-speed ISR Independent Shifting"},{"label":"Weight","value":"1,575 kg"}],"aerodynamics":[{"label":"Downforce","value":"220 kg @ 250 km/h"},{"label":"Front Splitter","value":"Carbon Aero Inlets"},{"label":"Rear Wing","value":"Active 3-Position Electronically Managed"},{"label":"Cd","value":"0.33"},{"label":"Cl","value":"-0.35"}],"suspension":[{"label":"Front","value":"Formula 1 Style Pushrod Magneto"},{"label":"Rear","value":"Pushrod Horizontal Damper"},{"label":"Dampers","value":"Magneto-rheological Pushrod"},{"label":"Springs","value":"Öhlins Race Coilover"}]}'),

(3, 'porsche-gt3', 'Porsche', '911 Carrera (991)', '2012–2019', 'Sports Coupé', '3.0L TT Flat-6 · 370hp · 0-100: 4.2s', '5x130', 20.0, 10.0, 45, 71.6, 330, 1430, 370, 105000, 'Stuttgart-Zuffenhausen, Germany', '#0A1A6E', '#FAFAFA', '#CCCCCC', '#C8D8F0', '/models/porsche.glb', 'READY_FOR_3D',
 '{"performance":[{"label":"Engine","value":"3.0L Twin-Turbo Flat-6 (991.2)"},{"label":"Power","value":"370 hp @ 6,500 rpm"},{"label":"Torque","value":"331 lb-ft @ 1,700–5,000 rpm"},{"label":"0–100 km/h","value":"4.2 seconds"},{"label":"Top Speed","value":"295 km/h"},{"label":"Transmission","value":"7-speed PDK Dual-Clutch"},{"label":"Weight","value":"1,430 kg"}],"aerodynamics":[{"label":"Downforce","value":"45 kg @ 200 km/h"},{"label":"Active Spoiler","value":"Electric Active Deployable Rear Spoiler"},{"label":"Air Inlets","value":"Active Cooling Air Flaps"},{"label":"Cd","value":"0.29"},{"label":"Cl","value":"-0.08"}],"suspension":[{"label":"Front","value":"MacPherson Strut with Anti-Roll Bar"},{"label":"Rear","value":"Multi-Link LSA Axle"},{"label":"Dampers","value":"PASM Porsche Active Suspension"},{"label":"Springs","value":"Sport-Tuned Progressive Coil Springs"}]}'),

(4, 'mclaren-720s', 'McLaren', '720S', '2017–2023', 'Supercar Coupé', '4.0L TT V8 · 720hp · 0-100: 2.8s', '5x112', 19.0, 9.0, 38, 66.6, 390, 1332, 720, 312000, 'Woking, United Kingdom', '#FF6B00', '#FF6B00', '#CCCCCC', '#1A1A1A', '/models/mclaren.glb', 'READY_FOR_3D',
 '{"performance":[{"label":"Engine","value":"4.0L Twin-Turbo V8 M840T"},{"label":"Power","value":"720 hp @ 7,500 rpm"},{"label":"Torque","value":"568 lb-ft @ 5,500 rpm"},{"label":"0–100 km/h","value":"2.8 seconds"},{"label":"Top Speed","value":"341 km/h"},{"label":"Transmission","value":"7-speed SSG Dual Clutch"},{"label":"Weight","value":"1,332 kg"}],"aerodynamics":[{"label":"Downforce","value":"1,000+ kg @ 250 km/h"},{"label":"Active Wing","value":"Integrated Active Airbrake"},{"label":"Front","value":"Carbon MonoCell II Front Sub"},{"label":"Cd","value":"0.32"},{"label":"Cl","value":"-0.46"}],"suspension":[{"label":"Front","value":"Proactive Chassis Control II"},{"label":"Rear","value":"Wishbone Hydraulic Interconnect"},{"label":"Dampers","value":"3-Stage Variable PCC II"},{"label":"Springs","value":"High-Performance GTR Race"}]}'),

(5, 'bmw-m4-csl', 'BMW', 'Vision ConnectedDrive', '2011 Concept', 'Concept Roadster', 'Electric / TT Hybrid · Concept Roadster · 0-100: 4.5s', '5x112', 20.0, 9.5, 25, 72.6, 360, 1450, 340, 120000, 'Munich, Bavaria, Germany', '#0066CC', '#1A1A1A', '#CCCCCC', '#1A1A1A', '/models/bmw.glb', 'READY_FOR_3D',
 '{"performance":[{"label":"Engine","value":"Electric / TwinPower Turbo Hybrid Concept"},{"label":"Power","value":"340 hp equivalent"},{"label":"Torque","value":"369 lb-ft equivalent"},{"label":"0–100 km/h","value":"4.5 seconds"},{"label":"Top Speed","value":"250 km/h"},{"label":"Transmission","value":"Single-Speed Direct Drive"},{"label":"Weight","value":"1,450 kg"}],"aerodynamics":[{"label":"Downforce","value":"50 kg @ 200 km/h"},{"label":"Active Grille","value":"Adaptive Kidney Grille Shutter"},{"label":"Fairings","value":"Streamlined Speedster Fairings"},{"label":"Cd","value":"0.26"},{"label":"Cl","value":"-0.12"}],"suspension":[{"label":"Front","value":"Double Wishbone Lightweight Aluminum"},{"label":"Rear","value":"Multi-Link Dynamic Suspension"},{"label":"Dampers","value":"BMW Dynamic Damper Control"},{"label":"Springs","value":"M Performance Progressive Springs"}]}');
SET IDENTITY_INSERT dbo.cars OFF;

-- 4.7 Parts (6 Official Performance Parts Catalog with CAD & Fitment Specs)
SET IDENTITY_INSERT dbo.parts ON;
INSERT INTO dbo.parts (part_id, sku, part_name, category, brand, specifications, price_vnd, price_usd, image_url, compatible_vehicles, rating, badge, stock_quantity, legal_compliance_status, bolt_pattern, wheel_diameter_inch, wheel_width_inch, offset_et, center_bore_mm, brake_disc_diameter_mm, min_wheel_diameter_inch, asset_url, material)
VALUES
(1, 'BBS-FIR-992-TITAN', 'BBS FI-R Forged Monoblock Wheel Set 20"/21"', 'Wheels & Rims', 'BBS Germany',
    'Ultra-lightweight aerospace forged aluminum • PCD 5x112 / ET35 • 7.8 kg/wheel',
    215000000, 8600, '/images/bbs-fi-r-wheel.jpg', 'Porsche 911 Carrera (991), BMW Vision ConnectedDrive, McLaren 720S',
    4.90, 'HOT / BESTSELLER', 8, 'PASS', '5x112', 20.0, 9.5, 35, 66.6, NULL, NULL, NULL, 'Aerospace Forged Aluminum'),

(2, 'RAYS-TE37-ULTRA-20', 'Volk Racing TE37 Ultra M-Spec Forged 20"', 'Wheels & Rims', 'Rays Japan',
    'Motorsport-grade forged monoblock • PCD 5x114.3 • Bronze Anodized finish',
    185000000, 7400, '/images/rays-te37-ultra.jpg', 'Ferrari 458 Italia',
    5.00, 'TRACK LEGEND', 6, 'PASS', '5x114.3', 20.0, 10.0, 30, 66.1, NULL, NULL, NULL, 'Motorsport Forged Monoblock'),

(3, 'WORK-VSXX-19-F458', 'WORK VS-XX 19" Aftermarket Wheel', 'Wheels & Rims', 'WORK Wheels',
    '19-inch 3-piece modular forged construction • Classic mesh design • PCD 5x114.3',
    105000000, 4200, '/images/work-vs-xx-wheel.jpg', 'Ferrari 458 Italia, Ferrari 458 Spider',
    4.95, 'CC BY 4.0 VERIFIED', 8, 'PASS', '5x114.3', 19.0, 10.0, 30, 67.1, NULL, NULL,
    '/models/parts/ferrari-458/wheels/work-vs-xx.glb', '3-Piece Modular Forged Alloy'),

(4, 'GEN-GTWING-F458', 'Carbon Aero GT Wing', 'Rear Spoilers', 'Track Aerodynamics',
    'Gloss carbon fiber airfoil blade • Twin CNC aluminum uprights • High-downforce track profile',
    61250000, 2450, '/images/carbon-gt-wing.jpg', 'Ferrari 458 Italia, Ferrari 458 Spider',
    4.92, 'TRACK SPEC', 5, 'PASS', NULL, NULL, NULL, NULL, NULL, NULL, NULL,
    '/models/parts/ferrari-458/spoilers/carbon-gt-wing.glb', 'Gloss Carbon Fiber & CNC Aluminum'),

(5, 'CARB-AERO-F458', 'Carbon Fiber Aerodynamics Package', 'Carbon Aero Kits', 'Track Aerodynamics',
    'Pre-preg carbon fiber front splitter extensions • Side skirts • Rear diffuser aero fins',
    80000000, 3200, '/images/carbon-aero-package.jpg', 'Ferrari 458 Italia, Ferrari 458 Spider',
    4.93, 'TRACK SPEC', 4, 'PASS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pre-preg 2x2 Carbon Fiber'),

(7, 'AKR-EVO-TITAN-992', 'Akrapovic Evolution Line Titanium Exhaust System', 'Exhaust Systems', 'Akrapovic',
    'Full Titanium construction • Bluetooth active flap control • -11.4 kg weight savings',
    185000000, 7400, '/images/akrapovic-evolution-line.jpg', 'Porsche 911 Carrera (991), Ferrari 458 Italia',
    4.95, 'SIGNATURE SOUND', 3, 'PASS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Grade 5 Titanium'),

(8, 'KW-35271842-V4CS', 'KW Suspensions V4 Clubsport 3-Way Coilover Kit', 'Coilovers & Shocks', 'KW Automotive',
    '16-click rebound & independent high/low speed compression • Uniball camber plates',
    123000000, 4920, '/images/kw-v4-clubsport.jpg', 'BMW Vision ConnectedDrive, Porsche 911 Carrera (991), McLaren 720S',
    4.85, 'TRACK READY', 4, 'PASS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Stainless Steel & Anodized Alloy'),

(9, 'BRM-1N1.9042A2', 'Brembo GT-S 6-Piston Big Brake Kit 380x34mm', 'Brake Systems', 'Brembo Racing',
    'Radial monoblock caliper • 2-piece Type 3 slotted disc • 800°C thermal endurance',
    96250000, 3850, '/images/brembo-gt-brake-kit.jpg', 'Universal Supercar Hubs (Ferrari 458, Porsche 911, McLaren 720S)',
    4.98, 'RACING SPEC', 5, 'PASS', 'Universal', NULL, NULL, NULL, NULL, 380, 19.0, NULL, 'Forged Monoblock Aluminum'),

(10, 'VOR-CF-AERO-992', 'Vorsteiner Aero Carbon Wing & Rear Diffuser Package', 'Carbon Aero Kits', 'Vorsteiner USA',
    'Pre-preg 2x2 weave vacuum autoclave carbon • Aerodynamic downforce profile',
    145000000, 5800, '/images/vorsteiner-carbon-aero.jpg', 'Porsche 911 Carrera (991), McLaren 720S, BMW Vision ConnectedDrive',
    4.90, 'ULTRA LIGHTWEIGHT', 2, 'PASS', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'Pre-preg Autoclave Carbon');
SET IDENTITY_INSERT dbo.parts OFF;

-- 4.8 CarBuilds (Saved 3D Builds with Valid Share Codes)
SET IDENTITY_INSERT dbo.car_builds ON;
INSERT INTO dbo.car_builds (build_id, share_code, build_name, car_id, user_id, body_color, body_finish, rim_color, glass_color, selected_parts_json, total_estimated_cost)
VALUES
(1, 'VT-F458-TRACK99', 'Khoi Dang Stealth F458 Track Edition', 1, 5, '#CC0000', 'Metallic', '#CCCCCC', '#C8D8F0',
 '[{"partId":2,"sku":"RAYS-TE37-ULTRA-20","name":"Volk Racing TE37 Ultra M-Spec Forged 20\""},{"partId":3,"sku":"AKR-EVO-TITAN-992","name":"Akrapovic Evolution Line Titanium Exhaust System"}]', 370000000),

(2, 'VT-GT3-WEISSACH', 'Porsche 911 Carrera (991) Aero Edition', 3, 5, '#FAFAFA', 'Pearl', '#CCCCCC', '#C8D8F0',
 '[{"partId":1,"sku":"BBS-FIR-992-TITAN","name":"BBS FI-R Forged Monoblock Wheel Set"},{"partId":6,"sku":"VOR-CF-AERO-992","name":"Vorsteiner Aero Carbon Wing Package"}]', 360000000),

(3, 'VT-AVENTADOR-V12', 'Lamborghini Aventador LP700 Giallo Edition', 2, 5, '#F5C400', 'Metallic', '#1A1A1A', '#1A1A1A',
 '[]', 0);
SET IDENTITY_INSERT dbo.car_builds OFF;

-- 4.9 Quotations
SET IDENTITY_INSERT dbo.quotations ON;
INSERT INTO dbo.quotations (quotation_id, quotation_number, customer_id, car_build_id, car_model, customer_name, customer_phone, garage_id, garage_name, parts_total, labor_total, discount_amount, tax_amount, final_total, status, legal_status, notes)
VALUES
(1, 'VT-QTE-2026-089', 5, 2, 'Porsche 911 Carrera (991)', 'Khoi Dang', '+84 988 776 655', 1, 'AutoTune Saigon Performance Hub', 345000000, 15000000, 20000000, 0, 340000000, 'APPROVED', 'PASS', 'High-downforce aero pack + BBS Forged Titanium wheels & Akrapovic Evolution Line exhaust'),
(2, 'VT-QTE-2026-092', 5, 1, 'Ferrari 458 Italia', 'Khoi Dang', '+84 988 776 655', 1, 'AutoTune Saigon Performance Hub', 145000000, 10000000,  5000000, 0, 150000000, 'SENT',     'PASS', 'Brembo GT Big Brake Kit conversion package with 6-piston monobloc calipers');
SET IDENTITY_INSERT dbo.quotations OFF;

SET IDENTITY_INSERT dbo.quotation_items ON;
INSERT INTO dbo.quotation_items (item_id, quotation_id, part_id, part_name, part_sku, category, quantity, unit_price_vnd, total_price_vnd)
VALUES
(1, 1, 1, 'BBS FI-R Forged Titanium Wheels (Set of 4)', 'BBS-FIR-992-TITAN', 'Wheels & Rims',   1, 185000000, 185000000),
(2, 1, 3, 'Akrapovic Evolution Line Titanium Exhaust',  'AKR-EVO-TITAN-992',  'Exhaust Systems', 1, 160000000, 160000000),
(3, 2, 5, 'Brembo GT-S 6-Piston Big Brake Kit 380mm',   'BRM-1N1.9042A2',     'Brake Systems',   1, 145000000, 145000000);
SET IDENTITY_INSERT dbo.quotation_items OFF;

-- 4.10 Work Orders (Only Created From APPROVED Quotations)
SET IDENTITY_INSERT dbo.work_orders ON;
INSERT INTO dbo.work_orders (work_order_id, work_order_number, quotation_id, customer_id, technician_id, car_build_id, vehicle_model, garage_id, bay_number, status, progress, priority, notes, started_at)
VALUES
(1, 'WO-2026-001', 1, 5, 3, 2, 'Porsche 911 Carrera (991)', 1, 'Bay 02 - Dyno & Performance Alignment', 'IN_PROGRESS', 65, 'HIGH',
 'BBS wheel balance & fitment inspection completed. Akrapovic titanium exhaust fitment in progress on lift 2.', DATEADD(HOUR, -4, SYSUTCDATETIME()));
SET IDENTITY_INSERT dbo.work_orders OFF;

-- 4.11 Warranties (Digital Warranty Passport)
SET IDENTITY_INSERT dbo.warranties ON;
INSERT INTO dbo.warranties (warranty_id, certificate_number, work_order_id, car_model, customer_name, customer_phone, issue_date, expiry_date, legal_compliance_status, qr_verification_token, status)
VALUES
(1, 'CERT-VT-2026-8801', 1, 'Porsche 911 Carrera (991)', 'Khoi Dang', '+84 988 776 655',
 DATEADD(DAY, -2, SYSUTCDATETIME()), DATEADD(YEAR, 2, SYSUTCDATETIME()),
 'PASSED_COMPLIANCE_2026', 'QR-VT-GT3-VIP999', 'ACTIVE');
SET IDENTITY_INSERT dbo.warranties OFF;
GO

PRINT '>>> VirtualTuneDB schema and seed data deployed successfully (100% English)';
PRINT '>>> 5 Official Supercars: Ferrari 458 Italia | Lamborghini Aventador LP700 | Porsche 911 Carrera (991) | McLaren 720S | BMW Vision ConnectedDrive';
PRINT '>>> Accounts: admin | admin_garage | tech_lead | tech_junior | customer_vip';
PRINT '>>> Default password: password123';
GO
