# 🚗 VIRTUAL TUNE - 3D Car Tuning SaaS Platform

<div align="center">

![Java](https://img.shields.io/badge/Java-25.0.1-orange?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5.0-brightgreen?style=for-the-badge&logo=springboot&logoColor=white)
![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Three.js](https://img.shields.io/badge/Three.js-r170-black?style=for-the-badge&logo=threedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwindcss&logoColor=white)
![H2 Database](https://img.shields.io/badge/Database-H2_In--Memory_(Zero_Install)-006699?style=for-the-badge&logo=databricks&logoColor=white)
![Security](https://img.shields.io/badge/Security-Spring_Security_6_%2B_JWT-blue?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

**Nền tảng B2B SaaS hỗ trợ cá nhân hóa, mô phỏng 3D độ xe tương tác thời gian thực & quản lý vận hành xưởng độ xe chuyên nghiệp.**  
*Đồ án môn học EXE101 - Khởi nghiệp công nghệ | Trường Đại học FPT*

[📖 Giới Thiệu](#-giới-thiệu-overview) • [✨ Tính Năng](#-tính-năng-nổi-bật-key-features) • [🛠️ Công Nghệ](#-công-nghệ-sử-dụng-tech-stack) • [⚡ Khởi Chạy](#-khởi-chạy-dự-án)

</div>

---

## 📖 Giới Thiệu (Overview)

**Virtual Tune** là giải pháp toàn diện kết hợp giữa **công nghệ đồ họa 3D Web tương tác (WebGL / Three.js / React Three Fiber)** và **hệ thống quản trị xưởng độ xe chuyên nghiệp (Garage ERP)**:

- **3D Tuning Studio Trực Quan:** Cho phép khách hàng và kỹ thuật viên tương tác 360°, đổi màu sơn đa tầng (Metallic, Pearl, Satin), độ mâm thể thao, cánh gió GT Wing khí động học, kính cách nhiệt riêng tư và kiểm tra tự động độ tương thích kỹ thuật trước khi thi công thực tế.
- **Dark Mode Hiện Đại Mặc Định:** Giao diện Dark Mode tối ưu cho xưởng độ xe và phòng thiết kế, tích hợp cơ chế chống chớp sáng (Anti-FOUC) và lưu giữ tùy chọn cá nhân.
- **Hệ Thống Quản Trị Vận Hành (ERP):** Tối ưu hóa toàn bộ luồng nghiệp vụ từ tư vấn báo giá trực tuyến, tiếp nhận xe, điều phối lệnh làm việc (Work Orders) cho kỹ thuật viên đến quản lý kho phụ tùng và cấp hộ chiếu bảo hành số.

---

## ✨ Tính Năng Nổi Bật (Key Features)

1. **3D Real-time Car Tuning Studio:**
   - Dựng hình xe 3D tương tác thời gian thực với hệ thống ánh sáng studio và bản đồ phản chiếu môi trường (Environment HDR).
   - Tùy biến màu sơn PBR chuyên nghiệp (Metallic, Solid, Pearl, Satin) với lớp phủ bóng trong suốt (Clearcoat).
   - Hoán đổi mâm xe Aftermarket (BBS LM, WORK VS-XX) và cánh gió thể thao (Big Country Labs Style GT Wing, GT3 Carbon Aero Wing).
   - Góc nhìn camera định sẵn (3/4 Front, Side Profile, Rear Wing, Wheel Close-up) cùng chế độ xoay tự động 360°.

2. **Fitment Engine (Kiểm Tra Tương Thích CAD):**
   - Tự động đối chiếu thông số cơ khí: mẫu ốc trục bánh (PCD), độ lệch trục bánh (Offset ET), đường kính lỗ định tâm (Center Bore) và đường kính đĩa phanh để cảnh báo sớm nguy cơ cạ vè hoặc kẹt cùm phanh.

3. **Work Order & Garage Operations:**
   - Điều phối lệnh độ xe, phân bổ kỹ thuật viên trưởng và kỹ thuật viên thực thi.
   - Quản lý trạng thái theo thời gian thực: *Tiếp nhận xe ➔ Thi công ➔ Kiểm tra an toàn (TÜV / ECE) ➔ Bàn giao*.

4. **Báo Giá & Hộ Chiếu Bảo Hành Số:**
   - Tự động tính toán tổng chi phí phụ tùng và nhân công lắp đặt.
   - Xuất mã QR Token xác thực chứng chỉ bảo hành điện tử độc bản cho từng cấu hình độ xe.

5. **Bảo Mật Phân Quyền Đa Tầng (RBAC):**
   - Phân quyền chặt chẽ bằng Spring Security 6 và JWT Stateless Authentication qua 4 vai trò độc lập.


---

## 🛠️ Công Nghệ Sử Dụng (Tech Stack)

### 🖥️ Frontend
- **Framework & Runtime:** React 19 + Vite 6 (HMR cực nhanh, code-splitting tối ưu).
- **3D Graphics:** Three.js (r170) + `@react-three/fiber` + `@react-three/drei`.
- **Styling & Theme:** Tailwind CSS 3.4 (Hệ thống Design Tokens chuẩn xác, Dark Mode mặc định, chống FOUC).
- **HTTP Client:** Axios (Tự động đính kèm JWT Bearer token và xử lý lỗi đồng bộ).
- **Icons & Typography:** Google Material Symbols Outlined, Montserrat, Inter, JetBrains Mono.

### ⚙️ Backend
- **Ngôn ngữ:** Java 25.0.1 (Oracle OpenJDK) với Virtual Threads.
- **Framework:** Spring Boot 3.5.0 (RESTful Architecture).
- **Bảo mật:** Spring Security 6 (Stateless JWT Filter, CORS phân tách dev/prod, PasswordEncoder BCrypt).
- **Xác thực:** JJWT (Java JWT) 0.12.6.
- **ORM & Data:** Spring Data JPA + Hibernate ORM 6.6.
- **Build Tool:** Maven Wrapper (`mvnw`).

### 🗄️ Database
- **Mặc Định (Zero-Install):** **H2 In-Memory Database** — Tự động khởi tạo trong RAM khi bật ứng dụng, nạp sẵn 6 mẫu xe, phụ tùng và tài khoản kiểm thử. Không yêu cầu cài đặt phần mềm database bên ngoài.
- **H2 Console:** Truy cập kiểm tra trực quan tại `http://localhost:8080/h2-console` *(chỉ mở trong môi trường dev)*.
- **Tùy Chọn Mở Rộng:** Tương thích Microsoft SQL Server 2022 (file script `database/VirtualTuneDB.sql`).

---

## ⚡ Khởi Chạy Dự Án

### 1. Khởi Chạy Nhanh 1-Click (Khuyên Dùng)
Nhấp đúp chuột vào tệp **[`start-dev.bat`](start-dev.bat)** tại thư mục gốc:
- Tự động kiểm tra cài đặt Java 25 & Node.js trên máy.
- Tự động chạy `npm install` nếu chưa có `node_modules`.
- Đồng thời mở 2 tiến trình độc lập:
  - **Backend API:** `http://localhost:8080`
  - **Frontend Application:** `http://localhost:5173`
- Quản trị DB H2 tại: `http://localhost:8080/h2-console`  
  *(JDBC URL: `jdbc:h2:mem:VirtualTuneDB` | User: `sa` | Password: để trống)*

---

### 2. Khởi Chạy Thủ Công (Manual Setup)

#### Bước 1: Khởi động Backend
```powershell
cd backend
.\mvnw.cmd clean test spring-boot:run
```
*Backend sẽ lắng nghe tại cổng `8080` (hoặc cổng cấu hình qua biến môi trường `PORT`).*

#### Bước 2: Khởi động Frontend
```powershell
cd frontend
npm install
npm run dev
```
*Truy cập giao diện tại `http://localhost:5173`.*

#### Bước 3: Đóng gói kiểm tra sản xuất
```powershell
# Kiểm thử Frontend
cd frontend
npm run build

# Kiểm thử Backend
cd ../backend
.\mvnw.cmd test
```

---

## 📂 Cấu Trúc Thư Mục (Project Structure)

```text
VIRTUAL TUNE/
├── ⚡ start-dev.bat           # Script 1-click tự động kiểm tra môi trường & chạy đồng thời
├── 📖 README.md               # Tài liệu tổng quan và hướng dẫn khởi chạy dự án
├── Dockerfile                 # Đóng gói container Docker (multi-stage Java 25)
├── backend/                   # Source code Backend Spring Boot 3.5 (Java 25)
│   ├── src/main/java/         # Controllers, Services, Security, Models, DataInitializer
│   ├── src/main/resources/    # application.properties (dev/prod profiles)
│   ├── src/test/java/         # Unit & Integration Tests (Auth, Security, Fleet)
│   └── pom.xml                # Quản lý thư viện Maven
├── frontend/                  # Source code Frontend React 19 + Vite 6
│   ├── public/                # Static assets, hình ảnh xe, models 3D (.glb)
│   │   ├── images/            # Hình ảnh xe (.webp), mâm xe, phụ tùng
│   │   └── models/            # Mô hình GLB xe (vinfast, ferrari, lambo,...) và phụ tùng
│   ├── src/                   # Components, Pages, 3D Studio Scene, Contexts
│   │   ├── components/scene/  # VehicleModel3D, StudioLights, ShowroomFloor
│   │   ├── contexts/          # ThemeContext (Dark Mode mặc định)
│   │   └── services/          # api.js (Axios client)
│   ├── package.json           # Quản lý dependencies npm
│   └── vercel.json            # Cấu hình routing deploy Vercel
└── database/                  # Script VirtualTuneDB.sql cho MSSQL (tùy chọn)
```

---

## 📄 Bản Quyền & Tác Quyền (License)

Dự án phát triển phục vụ môn học **EXE101 - Khởi nghiệp công nghệ** tại Trường Đại học FPT.  
Bản quyền thuộc về nhóm phát triển **VIRTUAL TUNE**. Mọi quyền được bảo lưu.
