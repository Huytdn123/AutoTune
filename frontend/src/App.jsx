import React from 'react'
import { Car, Wrench, ShieldAlert, FileText, CheckCircle2 } from 'lucide-react'

export default function App() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', padding: '2rem 3rem' }}>
      {/* Top Header */}
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, letterSpacing: '0.05em', color: '#38bdf8' }}>
            VIRTUAL TUNE
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '0.95rem' }}>
            B2B 3D Automotive Customization Platform • EXE101 Group 1
          </p>
        </div>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{
            fontSize: '0.8rem',
            padding: '0.4rem 0.8rem',
            borderRadius: '9999px',
            backgroundColor: 'rgba(6, 182, 212, 0.15)',
            color: '#22d3ee',
            border: '1px solid rgba(6, 182, 212, 0.3)'
          }}>
            Java 25 • Spring Boot 3.4 • React 19 • Vite 6
          </span>
        </div>
      </header>

      {/* Main Grid Content */}
      <main style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        flex: 1
      }}>
        {/* Module 1 */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Car color="#38bdf8" size={26} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>1. 3D Car Configurator</h2>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Trình trực quan hóa 3D WebGL (Three.js) trên trình duyệt tablet/PC showroom, cho phép khách hàng đổi màu sơn, mâm xe, bodykit và xoay 360 độ.
          </p>
        </div>

        {/* Module 2 */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <Wrench color="#f59e0b" size={26} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>2. Smart Data Mapping</h2>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Động cơ kiểm tra tương thích kỹ thuật giữa mẫu xe và linh kiện độ (PCD mâm, kích thước hốc bánh, cản trước/sau).
          </p>
        </div>

        {/* Module 3 */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <ShieldAlert color="#ef4444" size={26} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>3. Legal-Check Module</h2>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Tự động gắn tag cảnh báo đăng kiểm theo Thông tư 30/2026/TT-BXD đối với từng chi tiết độ (mâm vượt size, thay đổi kích thước cản).
          </p>
        </div>

        {/* Module 4 */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <FileText color="#10b981" size={26} />
            <h2 style={{ fontSize: '1.2rem', fontWeight: 600 }}>4. Quotation & Work Order</h2>
          </div>
          <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: 1.6 }}>
            Tự động tổng hợp chi phí linh kiện và tiền công thợ của garage, xuất báo giá chuyên nghiệp và tạo lệnh thi công (Work Order).
          </p>
        </div>
      </main>

      {/* Footer Instructions */}
      <footer className="glass-panel" style={{ marginTop: '2rem', padding: '1.25rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <CheckCircle2 color="#22c55e" size={20} />
        <span style={{ fontSize: '0.9rem', color: '#cbd5e1' }}>
          Cấu trúc khung thư mục đã sẵn sàng! Các thành viên có thể chia nhánh Git và bắt đầu code vào các folder tương ứng.
        </span>
      </footer>
    </div>
  )
}
