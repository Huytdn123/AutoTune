# 🚗 VIRTUAL TUNE - 3D Car Tuning SaaS Platform

<div align="center">

![Java](https://img.shields.io/badge/Java-25.0.1-orange?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.0-brightgreen?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r170-black?style=for-the-badge&logo=threedotjs&logoColor=white)
![MS SQL Server](https://img.shields.io/badge/MSSQL_Server-2022-CC292B?style=for-the-badge&logo=microsoftsqlserver&logoColor=white)
![Security](https://img.shields.io/badge/Security-Spring_Security_6_%2B_JWT-blue?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**Nền tảng B2B SaaS hỗ trợ cá nhân hóa, mô phỏng 3D độ xe tương tác thời gian thực & quản lý vận hành xưởng độ xe chuyên nghiệp.**  
*Đồ án môn học EXE101 - Trường Đại học FPT*

[📖 Giới Thiệu](#-giới-thiệu-overview) • [✨ Tính Năng](#-tính-năng-nổi-bật-key-features) • [🛠️ Công Nghệ](#-công-nghệ-sử-dụng-tech-stack) • [⚡ Khởi Chạy Dự Án](#-khởi-chạy-dự-án) • [🔑 Tài Khoản Test](TEST_ACCOUNTS.md)

</div>

---

## 📖 Giới Thiệu (Overview)

**Virtual Tune** là giải pháp kết hợp giữa **đồ họa 3D Web tương tác (WebGL/Three.js)** và **hệ thống quản trị xưởng độ xe (Garage ERP)**:
- **3D Tuning Trực Quan:** Giúp khách hàng xem trước bản độ 360°, đổi màu sơn, mâm vỏ, bodykit và kiểm tra tự động độ tương thích kỹ thuật (Fitment Check) trước khi thi công.
- **Quản Trị Vận Hành:** Hỗ trợ Garage tối ưu hóa quy trình từ tư vấn báo giá, tiếp nhận xe, điều phối lệnh làm việc (Work Orders) cho kỹ thuật viên đến quản lý kho phụ tùng.

---

## ✨ Tính Năng Nổi Bật (Key Features)

- **3D Car Tuning Studio:** Tương tác mô hình xe 3D thời gian thực trên Three.js & React Three Fiber (đổi sơn, mâm vỏ, hạ gầm, spoiler...).
- **Fitment Engine:** Tự động kiểm tra thông số kỹ thuật (PCD, Offset ET, Center Bore) đảm bảo phụ tùng tương thích với xe.
- **Work Order Management:** Điều phối, giao việc và theo dõi tiến độ thi công xe theo từng giai đoạn.
- **Kho & Phụ Tùng:** Quản lý danh mục phụ tùng, tồn kho, nhà cung cấp và giỏ hàng báo giá.
- **RBAC & Bảo Mật:** Phân quyền 4 vai trò (`GARAGE_OWNER`, `LEAD_TECHNICIAN`, `CAR_OWNER`, `GUEST`) bằng Spring Security 6 & JWT.

---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### 🖥️ Frontend
| Thành Phần | Công Nghệ | Phiên Bản | Ghi Chú |
|:---|:---|:---:|:---|
| **Framework** | React | 19.x | Component-based, Hooks |
| **Build Tool** | Vite | 6.x | Fast HMR, tối ưu bundle |
| **3D Engine** | Three.js + `@react-three/fiber` | ^0.170.x | Render mô hình 3D WebGL trực tiếp |
| **3D Helpers** | `@react-three/drei` | Latest | Controls, Environment & Lighting |
| **HTTP Client** | Axios | Latest | Xử lý REST API & JWT Interceptors |
| **Icons** | Material Symbols | CDN | Google Fonts Icons |

### ⚙️ Backend
| Thành Phần | Công Nghệ | Phiên Bản | Ghi Chú |
|:---|:---|:---:|:---|
| **Ngôn ngữ** | Java (OpenJDK) | 25.0.1 | Hiệu năng cao |
| **Framework** | Spring Boot | 3.5.0 | RESTful API |
| **Bảo mật** | Spring Security 6 | 6.x | Stateless, BCrypt |
| **Xác thực** | JJWT (Java JWT) | 0.12.6 | JWT Token-based Authentication |
| **ORM** | Spring Data JPA + Hibernate | 6.x | Quản lý Entity & Database |
| **Build Tool** | Maven Wrapper (`mvnw`) | 3.14.0 | Build độc lập môi trường |

### 🗄️ Database
| Thành Phần | Công Nghệ | Chi Tiết |
|:---|:---|:---|
| **DBMS** | Microsoft SQL Server | 2022 |
| **Driver** | `mssql-jdbc` | 12.8.1.jre11 |
| **Cổng mặc định** | `1433` | `localhost:1433` |
| **Tên DB** | `VirtualTuneDB` | Bảng quan hệ chuẩn hóa |
| **Cơ chế Schema** | `ddl-auto=create` | Tự động sinh bảng và nạp dữ liệu mẫu khi backend khởi chạy |

---

## ⚡ Khởi Chạy Dự Án

### 1. Khởi Chạy Nhanh 1-Click (Khuyên Dùng)
Nhấp đúp vào file **[`start-dev.bat`](start-dev.bat)** tại thư mục gốc để tự động mở cả 2 dịch vụ:
- **Backend API (Spring Boot - Java 25):** `http://localhost:8080`
- **Frontend App (React 19 Vite):** `http://localhost:5173`

---

### 2. Khởi Chạy Thủ Công (Tùy Chọn)
*(Yêu cầu: Java 25, Node.js v20+, SQL Server 2022 trên port 1433)*

* **Backend:**
  ```powershell
  cd backend
  $env:JAVA_HOME = "C:\Program Files\Java\jdk-25"
  .\mvnw.cmd clean spring-boot:run
  ```
* **Frontend:**
  ```bash
  cd frontend
  npm install
  npm run dev
  ```
* **Reset Database (khi cần):**
  ```bash
  sqlcmd -S localhost -U sa -P 123 -C -i "database\VirtualTuneDB.sql"
  ```

---

## 🔑 Tài Khoản Kiểm Thử (Test Accounts)

> ⚠️ Toàn bộ danh sách tài khoản demo, mật khẩu và ma trận phân quyền chi tiết được lưu trữ tại:  
👉 **[`TEST_ACCOUNTS.md`](TEST_ACCOUNTS.md)**

---

## 📂 Cấu Trúc Thư Mục (Project Structure)

```text
VIRTUAL TUNE/
├── ⚡ start-dev.bat           # Script 1-click khởi chạy đồng thời Backend & Frontend
├── 🔑 TEST_ACCOUNTS.md        # Danh sách tài khoản kiểm thử & phân quyền
├── 📖 README.md               # Tài liệu tổng quan & hướng dẫn dự án
├── backend/                   # Source code Backend Spring Boot 3.5 (Java 25)
│   ├── src/main/java/         # Controllers, Services, Security, Models
│   ├── src/main/resources/    # application.properties
│   └── pom.xml                # Dependencies Maven
├── frontend/                  # Source code Frontend React 19 + Vite 6
│   ├── src/                   # Components, Pages, 3D Studio, Assets
│   └── package.json           # Dependencies npm
├── database/                  # File script SQL VirtualTuneDB.sql
├── docs/                      # Tài liệu thiết kế & SRS
└── scripts/                   # Scripts hỗ trợ
```

---

## 📄 Bản Quyền (License)

Dự án phát triển phục vụ môn học **EXE101 - Khởi nghiệp công nghệ** tại Trường Đại học FPT.  
Bản quyền thuộc về nhóm phát triển **VIRTUAL TUNE**.
