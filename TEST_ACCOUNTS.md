# 🔑 Test Accounts & Demo Credentials

Tài liệu danh sách các tài khoản kiểm thử (Demo / Test Accounts) phục vụ quá trình đánh giá, chấm điểm và trải nghiệm các phân hệ của **VIRTUAL TUNE**.

---

## 📋 Danh Sách Tài Khoản Kiểm Thử

| STT | Username | Password | Role | Mô Tả Quyền Hạn & Phạm Vi Truy Cập |
|:---:|:---|:---|:---|:---|
| 1 | `admin_garage` | `password123` | **GARAGE_OWNER** | **Chủ Garage (Toàn quyền):** Quản lý toàn bộ hệ thống, phụ tùng, báo cáo doanh thu, nhân sự và đơn hàng. |
| 2 | `tech_lead` | `password123` | **LEAD_TECHNICIAN** | **Kỹ thuật trưởng:** Dashboard kỹ thuật, kiểm tra tương thích phụ tùng (Fitment Check), điều phối lệnh làm việc (Work Orders), quản lý kho. |
| 3 | `tech_junior` | `password123` | **LEAD_TECHNICIAN** | **Kỹ thuật viên:** Cập nhật tiến độ Work Order, tra cứu kho phụ tùng và thông số kỹ thuật xe. |
| 4 | `customer_vip` | `password123` | **CAR_OWNER** | **Chủ xe / Khách hàng:** Trải nghiệm 3D Car Tuning Studio, giỏ hàng, đặt lịch độ xe, quản lý bảo hành. |
| 5 | *(Không cần đăng nhập)* | *(None)* | **GUEST** | **Khách vãng lai:** Xem trang chủ, trải nghiệm 3D Configurator cơ bản, tra cứu cẩm nang độ xe. |

---

## 🛡️ Phân Quyền Theo Vai Trò (Role-Based Access Control)

| Phân Hệ / Chức Năng | GARAGE_OWNER | LEAD_TECHNICIAN | CAR_OWNER | GUEST |
|:---|:---:|:---:|:---:|:---:|
| **3D Car Tuning Studio (Cá nhân hóa xe 3D)** | ✅ Toàn quyền | ✅ Trợ giúp kỹ thuật | ✅ Trải nghiệm & Lưu mẫu | ✅ Thử nghiệm cơ bản |
| **Kiểm Tra Độ Tương Thích (Fitment Engine)** | ✅ Quản lý quy tắc | ✅ Kiểm tra & Duyệt | ✅ Tra cứu tương thích | ✅ Tra cứu tương thích |
| **Quản Lý Lệnh Độ Xe (Work Order Management)**| ✅ Phân công & Giám sát | ✅ Cập nhật tiến độ | ❌ Không có quyền | ❌ Không có quyền |
| **Quản Lý Kho Phụ Tùng & Nhà Cung Cấp** | ✅ Toàn quyền | ✅ Cập nhật số lượng | ❌ Không có quyền | ❌ Không có quyền |
| **Báo Cáo Doanh Thu & Quản Trị Hệ Thống** | ✅ Xem báo cáo & KPI | ❌ Không có quyền | ❌ Không có quyền | ❌ Không có quyền |
| **Giỏ Hàng, Đặt Lịch & Theo Dõi Bảo Hành** | ✅ Quản trị | ❌ Không có quyền | ✅ Đặt & Theo dõi | ❌ Không có quyền |

---

> 💡 **Lưu ý kiểm thử:**
> - Mật khẩu mặc định cho tất cả tài khoản kiểm thử: `password123`.
> - Khi backend chạy với chế độ `ddl-auto=create`, cơ sở dữ liệu sẽ tự động nạp sẵn các tài khoản mẫu trên.
