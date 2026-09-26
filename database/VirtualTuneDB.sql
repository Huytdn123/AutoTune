-- =========================================================================
-- VIRTUAL TUNE - B2B AUTOMOTIVE PERFORMANCE PLATFORM
-- COMPLETE DATABASE SCHEMA + SEED DATA (MICROSOFT SQL SERVER 2022)
-- Language: 100% English
-- Default password for all accounts: password123
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
-- 2. DROP EXISTING TABLES (reverse dependency order)
-- =========================================================================
IF OBJECT_ID('dbo.warranties',      'U') IS NOT NULL DROP TABLE dbo.warranties;
IF OBJECT_ID('dbo.work_orders',     'U') IS NOT NULL DROP TABLE dbo.work_orders;
IF OBJECT_ID('dbo.quotation_items', 'U') IS NOT NULL DROP TABLE dbo.quotation_items;
IF OBJECT_ID('dbo.quotations',      'U') IS NOT NULL DROP TABLE dbo.quotations;
IF OBJECT_ID('dbo.parts',           'U') IS NOT NULL DROP TABLE dbo.parts;
IF OBJECT_ID('dbo.cars',            'U') IS NOT NULL DROP TABLE dbo.cars;
IF OBJECT_ID('dbo.role_permissions','U') IS NOT NULL DROP TABLE dbo.role_permissions;
IF OBJECT_ID('dbo.permissions',     'U') IS NOT NULL DROP TABLE dbo.permissions;
IF OBJECT_ID('dbo.users',           'U') IS NOT NULL DROP TABLE dbo.users;
IF OBJECT_ID('dbo.roles',           'U') IS NOT NULL DROP TABLE dbo.roles;
IF OBJECT_ID('dbo.garages',         'U') IS NOT NULL DROP TABLE dbo.garages;
GO

-- =========================================================================
-- 3. SCHEMA
-- =========================================================================

-- 3.1 Garages
CREATE TABLE dbo.garages (
    garage_id             INT          IDENTITY(1,1) PRIMARY KEY,
    garage_code           VARCHAR(30)  UNIQUE NOT NULL,
    garage_name           NVARCHAR(150) NOT NULL,
    address               NVARCHAR(255) NOT NULL,
    city                  NVARCHAR(50)  DEFAULT 'Ho Chi Minh City',
    phone                 VARCHAR(20)  NOT NULL,
    email                 VARCHAR(100),
    total_bays            INT          DEFAULT 4,
    active_bays           INT          DEFAULT 3,
    monthly_revenue_vnd   BIGINT       DEFAULT 850000000,
    fitment_accuracy_rate DECIMAL(5,2) DEFAULT 99.98,
    rating                DECIMAL(3,2) DEFAULT 4.95,
    status                VARCHAR(20)  DEFAULT 'ACTIVE',
    created_at            DATETIME2    DEFAULT SYSUTCDATETIME()
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
    permission_id   INT         IDENTITY(1,1) PRIMARY KEY,
    permission_code VARCHAR(50) UNIQUE NOT NULL,
    permission_name NVARCHAR(100) NOT NULL,
    module          VARCHAR(50) NOT NULL
);

CREATE TABLE dbo.role_permissions (
    role_id       INT NOT NULL,
    permission_id INT NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT FK_roleperm_role FOREIGN KEY (role_id)       REFERENCES dbo.roles(role_id)       ON DELETE CASCADE,
    CONSTRAINT FK_roleperm_perm FOREIGN KEY (permission_id) REFERENCES dbo.permissions(permission_id) ON DELETE CASCADE
);

-- 3.5 Cars (Vehicle CAD Staging Catalog)
CREATE TABLE dbo.cars (
    car_id               INT           IDENTITY(1,1) PRIMARY KEY,
    brand                NVARCHAR(50)  NOT NULL,
    model                NVARCHAR(100) NOT NULL,
    year_manufactured    INT           NOT NULL,
    body_type            VARCHAR(30)   NOT NULL,
    stock_bolt_pattern   VARCHAR(20)   NOT NULL,
    stock_wheel_size_inch DECIMAL(4,1) NOT NULL,
    curb_weight_kg       INT           NOT NULL,
    chassis_code         VARCHAR(30),
    engine_spec          NVARCHAR(100),
    horsepower           INT,
    status               VARCHAR(20)   DEFAULT 'READY_FOR_3D',
    model_3d_path        NVARCHAR(255)
);

-- 3.6 Parts (Performance Parts Catalog & Inventory)
CREATE TABLE dbo.parts (
    part_id                  INT           IDENTITY(1,1) PRIMARY KEY,
    sku                      VARCHAR(50)   UNIQUE NOT NULL,
    part_name                NVARCHAR(150) NOT NULL,
    category                 VARCHAR(50)   NOT NULL,
    brand                    NVARCHAR(50)  NOT NULL,
    specifications           NVARCHAR(255),
    price_vnd                BIGINT        NOT NULL,
    stock_quantity           INT           DEFAULT 0,
    legal_compliance_status  VARCHAR(20)   DEFAULT 'PASS'
);

-- 3.7 Quotations
CREATE TABLE dbo.quotations (
    quotation_id     BIGINT       IDENTITY(1,1) PRIMARY KEY,
    quotation_number VARCHAR(30)  UNIQUE NOT NULL,
    user_id          BIGINT       NOT NULL,
    garage_id        INT          NOT NULL,
    car_id           INT          NOT NULL,
    parts_total      BIGINT       NOT NULL,
    labor_total      BIGINT       NOT NULL,
    discount_amount  BIGINT       DEFAULT 0,
    final_total      BIGINT       NOT NULL,
    legal_status     VARCHAR(20)  DEFAULT 'PASS',
    status           VARCHAR(30)  DEFAULT 'DRAFT',
    created_at       DATETIME2    DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_quotations_users   FOREIGN KEY (user_id)   REFERENCES dbo.users(user_id),
    CONSTRAINT FK_quotations_garages FOREIGN KEY (garage_id) REFERENCES dbo.garages(garage_id),
    CONSTRAINT FK_quotations_cars    FOREIGN KEY (car_id)    REFERENCES dbo.cars(car_id)
);

CREATE TABLE dbo.quotation_items (
    item_id      BIGINT IDENTITY(1,1) PRIMARY KEY,
    quotation_id BIGINT NOT NULL,
    part_id      INT    NOT NULL,
    quantity     INT    DEFAULT 1,
    unit_price   BIGINT NOT NULL,
    labor_fee    BIGINT DEFAULT 0,
    CONSTRAINT FK_quotitems_quotation FOREIGN KEY (quotation_id) REFERENCES dbo.quotations(quotation_id) ON DELETE CASCADE,
    CONSTRAINT FK_quotitems_part      FOREIGN KEY (part_id)      REFERENCES dbo.parts(part_id)
);

-- 3.8 Work Orders
CREATE TABLE dbo.work_orders (
    work_order_id        BIGINT        IDENTITY(1,1) PRIMARY KEY,
    work_order_number    VARCHAR(30)   UNIQUE NOT NULL,
    quotation_id         BIGINT        NOT NULL,
    bay_number           INT           NOT NULL,
    assigned_tech_id     BIGINT        NOT NULL,
    stage                NVARCHAR(150) NOT NULL,
    progress_percent     INT           DEFAULT 0,
    status               VARCHAR(20)   DEFAULT 'QUEUED',
    estimated_completion DATETIME2,
    created_at           DATETIME2     DEFAULT SYSUTCDATETIME(),
    CONSTRAINT FK_workorders_quotations FOREIGN KEY (quotation_id)    REFERENCES dbo.quotations(quotation_id),
    CONSTRAINT FK_workorders_users      FOREIGN KEY (assigned_tech_id) REFERENCES dbo.users(user_id)
);

-- 3.9 Warranties (Digital Warranty Passport)
CREATE TABLE dbo.warranties (
    warranty_id              BIGINT       IDENTITY(1,1) PRIMARY KEY,
    certificate_number       VARCHAR(50)  UNIQUE NOT NULL,
    work_order_id            BIGINT       NOT NULL,
    car_model                NVARCHAR(100) NOT NULL,
    customer_name            NVARCHAR(100) NOT NULL,
    customer_phone           VARCHAR(20),
    issue_date               DATETIME2    DEFAULT SYSUTCDATETIME(),
    expiry_date              DATETIME2    NOT NULL,
    legal_compliance_status  VARCHAR(50)  DEFAULT 'PASSED_COMPLIANCE_2026',
    qr_verification_token    VARCHAR(100) UNIQUE NOT NULL,
    status                   VARCHAR(20)  DEFAULT 'ACTIVE',
    CONSTRAINT FK_warranties_workorders FOREIGN KEY (work_order_id) REFERENCES dbo.work_orders(work_order_id)
);
GO

-- =========================================================================
-- 4. SEED DATA  (100% English)
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
(1, 'GARAGE_OWNER',    'Garage Owner (B2B)',    'Executive management, bay dispatch, financial approvals, staff administration', '#6091C3'),
(2, 'LEAD_TECHNICIAN', 'Master Technician',     'Work order execution, kinematic alignment, 3D CAD fitment & tolerance appraisal', '#10B981'),
(3, 'CAR_OWNER',       'VIP Client (Car Owner)','3D exterior studio staging, instant quotation request, digital warranty passport', '#F59E0B');
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

-- 4.4 Role-Permission mappings
-- GARAGE_OWNER: all 9 permissions
INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES
(1,1),(1,2),(1,3),(1,4),(1,5),(1,6),(1,7),(1,8),(1,9);
-- LEAD_TECHNICIAN: dashboard, dispatch, execute, fitment, 3d, warranty
INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES
(2,1),(2,3),(2,5),(2,6),(2,7),(2,9);
-- CAR_OWNER: 3d, quote, warranty
INSERT INTO dbo.role_permissions (role_id, permission_id) VALUES
(3,7),(3,8),(3,9);

-- 4.5 Users  (password = password123)
SET IDENTITY_INSERT dbo.users ON;
INSERT INTO dbo.users (user_id, username, password_hash, full_name, email, phone, role_id, garage_id, avatar_url, status, last_login)
VALUES
(1, 'admin_garage',  '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.',
   'Tuan Tran',  'tuan.tran@autotune-saigon.vn',  '+84 908 112 345', 1, 1,
   'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150', 'ACTIVE', SYSUTCDATETIME()),
(2, 'tech_lead',     '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.',
   'Long Nguyen','long.tech@autotune-saigon.vn',  '+84 912 345 678', 2, 1,
   'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150', 'ACTIVE', SYSUTCDATETIME()),
(3, 'customer_vip',  '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.',
   'Khoi Dang', 'khoi.dang@gmail.com',            '+84 988 776 655', 3, NULL,
   'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150', 'ACTIVE', SYSUTCDATETIME()),
(4, 'tech_junior',   '$2a$10$EblZqNptyYvcLm/VwDCVAuBjzZOI7khzdyGPBr08PpIi0na624b8.',
   'Duc Vu',    'duc.vu@autotune-saigon.vn',      '+84 933 889 900', 2, 1,
   'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150', 'ACTIVE', SYSUTCDATETIME());
SET IDENTITY_INSERT dbo.users OFF;

-- 4.6 Cars
SET IDENTITY_INSERT dbo.cars ON;
INSERT INTO dbo.cars (car_id, brand, model, year_manufactured, body_type, stock_bolt_pattern, stock_wheel_size_inch, curb_weight_kg, chassis_code, engine_spec, horsepower, status, model_3d_path)
VALUES
(1, 'Ferrari', '458 Italia',     2015, 'Supercar',    '5x114.3', 20.0, 1380, 'F142-ITALIA',    '4.5L V8 Naturally Aspirated', 562, 'READY_FOR_3D', '/models/ferrari.glb'),
(2, 'VinFast', 'VF8 Plus',       2024, 'Electric SUV','5x114.3', 20.0, 2540, 'VF8-PLUS-EV',    'Dual Motor AWD',              402, 'READY_FOR_3D', '/models/ferrari.glb'),
(3, 'Mazda',   'Mazda 3 Sport',  2024, 'Hatchback',   '5x114.3', 18.0, 1380, 'BP5P-SKYACTIV',  '2.0L SkyActiv-G',            153, 'READY_FOR_3D', '/models/ferrari.glb'),
(4, 'Ford',    'Ranger Wildtrak',2025, 'Pickup',       '6x139.7', 18.0, 2280, 'P703-BI-TURBO',  '2.0L Bi-Turbo Diesel',       210, 'READY_FOR_3D', '/models/ferrari.glb'),
(5, 'Honda',   'Civic RS',       2024, 'Sedan',        '5x114.3', 18.0, 1320, 'FE1-VTEC-TURBO', '1.5L VTEC Turbo',            176, 'READY_FOR_3D', '/models/ferrari.glb');
SET IDENTITY_INSERT dbo.cars OFF;

-- 4.7 Parts
SET IDENTITY_INSERT dbo.parts ON;
INSERT INTO dbo.parts (part_id, sku, part_name, category, brand, specifications, price_vnd, stock_quantity, legal_compliance_status)
VALUES
(1, 'BBS-FIR-992-TITAN', 'BBS FI-R Forged Monoblock Wheel Set 20"/21"', 'Wheels & Rims',    'BBS Germany',   'Ultra-lightweight aerospace forged aluminum • PCD 5x112 / ET35 • 7.8 kg/wheel', 215000000, 8, 'PASS'),
(2, 'RAYS-TE37-ULTRA-20', 'Volk Racing TE37 Ultra M-Spec Forged 20"',   'Wheels & Rims',    'Rays Japan',    'Motorsport-grade forged monoblock • PCD 5x114.3 • Bronze Anodized finish',      185000000, 6, 'PASS'),
(3, 'AKR-EVO-TITAN-992',  'Akrapovic Evolution Line Titanium Exhaust System', 'Exhaust Systems', 'Akrapovic', 'Full Titanium construction • Bluetooth active flap control • -11.4 kg weight savings', 185000000, 3, 'PASS'),
(4, 'KW-35271842-V4CS',   'KW Suspensions V4 Clubsport 3-Way Coilover Kit',   'Coilovers & Shocks', 'KW Automotive', '16-click rebound & independent high/low speed compression • Uniball camber plates', 123000000, 4, 'PASS'),
(5, 'BRM-1N1.9042A2',     'Brembo GT-S 6-Piston Big Brake Kit 380x34mm',      'Brake Systems',      'Brembo Racing', 'Radial monoblock caliper • 2-piece Type 3 slotted disc • 800°C thermal endurance', 96250000, 5, 'PASS'),
(6, 'VOR-CF-AERO-992',    'Vorsteiner Aero Carbon Wing & Rear Diffuser Package', 'Carbon Aero Kits', 'Vorsteiner USA', 'Pre-preg 2x2 weave vacuum autoclave carbon • Aerodynamic downforce profile', 145000000, 2, 'PASS');
SET IDENTITY_INSERT dbo.parts OFF;

-- 4.8 Quotations
SET IDENTITY_INSERT dbo.quotations ON;
INSERT INTO dbo.quotations (quotation_id, quotation_number, user_id, garage_id, car_id, parts_total, labor_total, discount_amount, final_total, legal_status, status)
VALUES
(1, 'VT-QTE-2026-0089', 3, 1, 1, 312000000, 16000000, 10000000, 318000000, 'PASS', 'APPROVED'),
(2, 'VT-QTE-2026-0090', 3, 1, 2,  83500000,  6500000,  3000000,  87000000, 'PASS', 'APPROVED');
SET IDENTITY_INSERT dbo.quotations OFF;

SET IDENTITY_INSERT dbo.quotation_items ON;
INSERT INTO dbo.quotation_items (item_id, quotation_id, part_id, quantity, unit_price, labor_fee)
VALUES
(1, 1, 3, 1, 145000000, 5000000),
(2, 1, 4, 1,  89000000, 4000000),
(3, 1, 6, 1,  78000000, 7000000),
(4, 2, 1, 1,  38500000, 2500000);
SET IDENTITY_INSERT dbo.quotation_items OFF;

-- 4.9 Work Orders
SET IDENTITY_INSERT dbo.work_orders ON;
INSERT INTO dbo.work_orders (work_order_id, work_order_number, quotation_id, bay_number, assigned_tech_id, stage, progress_percent, status, estimated_completion)
VALUES
(1, 'WO-2026-001', 1, 1, 2, 'Brembo Brake Assembly & Laser Kinematic Alignment',          75, 'IN_PROGRESS', DATEADD(HOUR, 4,  SYSUTCDATETIME())),
(2, 'WO-2026-002', 2, 2, 4, 'Hunter High-Speed Wheel Balancing & Clearance Inspection',   90, 'IN_PROGRESS', DATEADD(HOUR, 1,  SYSUTCDATETIME()));
SET IDENTITY_INSERT dbo.work_orders OFF;

-- 4.10 Warranties
SET IDENTITY_INSERT dbo.warranties ON;
INSERT INTO dbo.warranties (warranty_id, certificate_number, work_order_id, car_model, customer_name, customer_phone, issue_date, expiry_date, legal_compliance_status, qr_verification_token, status)
VALUES
(1, 'CERT-VT-2026-8801', 1, 'Ferrari 458 Italia', 'Khoi Dang', '+84 988 776 655',
   DATEADD(DAY, -5, SYSUTCDATETIME()), DATEADD(YEAR, 2, SYSUTCDATETIME()),
   'PASSED_COMPLIANCE_2026', 'QR-VT-F458-VIP999', 'ACTIVE'),
(2, 'CERT-VT-2026-9011', 2, 'VinFast VF8 Plus',   'Khoi Dang', '+84 988 776 655',
   DATEADD(DAY, -3, SYSUTCDATETIME()), DATEADD(YEAR, 1, SYSUTCDATETIME()),
   'PASSED_COMPLIANCE_2026', 'QR-VT-VF8-EV2026',  'ACTIVE');
SET IDENTITY_INSERT dbo.warranties OFF;
GO

PRINT '>>> VirtualTuneDB deployed successfully - 100% English data';
PRINT '>>> Accounts: admin_garage | tech_lead | customer_vip | tech_junior';
PRINT '>>> Default password: password123';
GO
