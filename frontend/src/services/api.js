import axios from 'axios'

const API_BASE = '/api'
const ENABLE_MOCK = true

const client = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Attach Bearer JWT token automatically to every outgoing request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem('vt_auth_token')
  if (token && !token.startsWith('VT-TOKEN-OFFLINE-')) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Handle 401 Unauthorized globally
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Optional: dispatch event or handle token expiration
    }
    return Promise.reject(error)
  }
)

export const carApi = {
  getAll: async () => {
    try {
      const res = await client.get('/cars')
      return res.data
    } catch (err) {
      if (ENABLE_MOCK) return []
      throw err
    }
  },
  getById: async (id) => {
    try {
      const res = await client.get(`/cars/${id}`)
      return res.data
    } catch (err) {
      if (ENABLE_MOCK) return null
      throw err
    }
  }
}

const ENGLISH_PARTS_SPEC = {
  'BBS-FIR-992-TITAN': {
    name: 'BBS FI-R Forged Monoblock Wheel Set 20"/21"',
    brand: 'BBS Germany',
    category: 'Wheels & Rims',
    spec: 'Ultra-lightweight aerospace forged aluminum • PCD 5x112 / ET35 • 7.8 kg/wheel',
    priceVnd: 215000000,
    priceUsd: 8600,
    stockQuantity: 8
  },
  'RAYS-TE37-ULTRA-20': {
    name: 'Volk Racing TE37 Ultra M-Spec Forged 20"',
    brand: 'Rays Japan',
    category: 'Wheels & Rims',
    spec: 'Motorsport-grade forged monoblock • PCD 5x114.3 • Bronze Anodized finish',
    priceVnd: 185000000,
    priceUsd: 7400,
    stockQuantity: 6
  },
  'AKR-EVO-TITAN-992': {
    name: 'Akrapovič Evolution Line Titanium Exhaust System',
    brand: 'Akrapovič',
    category: 'Exhaust Systems',
    spec: 'Full Titanium construction • Bluetooth active flap control • -11.4 kg weight savings',
    priceVnd: 185000000,
    priceUsd: 7400,
    stockQuantity: 3
  },
  'KW-35271842-V4CS': {
    name: 'KW Suspensions V4 Clubsport 3-Way Coilover Kit',
    brand: 'KW Automotive',
    category: 'Coilovers & Shocks',
    spec: '16-click rebound & independent high/low speed compression • Uniball camber plates',
    priceVnd: 123000000,
    priceUsd: 4920,
    stockQuantity: 4
  },
  'BRM-1N1.9042A2': {
    name: 'Brembo GT-S 6-Piston Big Brake Kit 380x34mm',
    brand: 'Brembo Racing',
    category: 'Brake Systems',
    spec: 'Radial monoblock caliper • 2-piece Type 3 slotted disc • 800°C thermal endurance',
    priceVnd: 96250000,
    priceUsd: 3850,
    stockQuantity: 5
  },
  'VOR-CF-AERO-992': {
    name: 'Vorsteiner Aero Carbon Wing & Rear Diffuser Package',
    brand: 'Vorsteiner USA',
    category: 'Carbon Aero Kits',
    spec: 'Pre-preg 2x2 weave vacuum autoclave carbon • Aerodynamic downforce profile',
    priceVnd: 145000000,
    priceUsd: 5800,
    stockQuantity: 2
  }
}

export const normalizePart = (p) => {
  if (!p) return p
  const mapped = ENGLISH_PARTS_SPEC[p.sku]
  const vnd = p.priceVnd || p.price || mapped?.priceVnd || 38500000
  const usd = mapped?.priceUsd || Math.round(vnd / 25000)
  if (mapped) {
    return {
      ...p,
      partName: mapped.name,
      brand: mapped.brand || p.brand,
      category: mapped.category || p.category,
      specifications: mapped.spec,
      priceVnd: vnd,
      priceUsd: usd
    }
  }
  let cleanName = (p.partName || '')
    .replace(/^Mâm\s+/i, '')
    .replace(/^Phanh G\?m\s+/i, 'Carbon Ceramic Brakes ')
    .replace(/^\?ng X\?\s+/i, 'Exhaust ')
    .replace(/^Phu\?c Tinh Ch\?nh\s+/i, 'Coilover Kit ')
  return {
    ...p,
    partName: cleanName || p.partName,
    priceVnd: vnd,
    priceUsd: usd
  }
}

export const partApi = {
  getAll: async (category = '') => {
    try {
      const res = await client.get('/parts', { params: { category } })
      const raw = Array.isArray(res.data) ? res.data : (res.data?.data || [])
      return raw.map(normalizePart)
    } catch (err) {
      if (ENABLE_MOCK) return Object.values(ENGLISH_PARTS_SPEC).map((spec, idx) => ({
        partId: idx + 1,
        sku: Object.keys(ENGLISH_PARTS_SPEC)[idx],
        partName: spec.name,
        brand: spec.brand,
        category: spec.category,
        specifications: spec.spec,
        priceVnd: spec.priceVnd,
        priceUsd: spec.priceUsd,
        stockQuantity: 5 + idx
      }))
      throw err
    }
  },
  getById: async (id) => {
    try {
      const res = await client.get(`/parts/${id}`)
      return normalizePart(res.data)
    } catch (err) {
      if (ENABLE_MOCK) return null
      throw err
    }
  }
}

export const fitmentApi = {
  getOverview: async () => {
    try {
      const res = await client.get('/fitment')
      return res.data
    } catch (err) {
      if (ENABLE_MOCK) return { totalCars: 5, totalParts: 6 }
      throw err
    }
  },
  check: async (payload) => {
    try {
      const res = await client.post('/fitment/check', payload)
      return res.data
    } catch (err) {
      if (ENABLE_MOCK) return { compatible: true, status: 'PASS', message: 'Tương thích' }
      throw err
    }
  }
}

export const quotationApi = {
  calculate: async (data) => {
    try {
      const res = await client.post('/quotations/calculate', data)
      return res.data
    } catch (err) {
      if (ENABLE_MOCK) {
        return {
          quotationNumber: 'VT-QTE-2026-ONLINE',
          workOrderNumber: 'WO-2026-001',
          partsTotal: 45000000,
          laborTotal: 3500000,
          discountAmount: 2000000,
          finalTotal: 46500000,
          legalStatus: 'PASS'
        }
      }
      throw err
    }
  },
  getAll: async () => {
    const res = await client.get('/quotations')
    return res.data
  },
  getById: async (id) => {
    const res = await client.get(`/quotations/${id}`)
    return res.data
  },
  updateStatus: async (id, status) => {
    const res = await client.put(`/quotations/${id}/status`, null, { params: { status } })
    return res.data
  }
}

export const legalCheckApi = {
  verify: async (config) => {
    try {
      const res = await client.post('/legal-check/verify', config)
      return res.data
    } catch (err) {
      if (ENABLE_MOCK) {
        return {
          status: 'PASS',
          regulation: 'Thông tư số 30/2026/TT-BXD',
          message: 'Cấu hình đạt chuẩn đăng kiểm theo quy định an toàn kỹ thuật'
        }
      }
      throw err
    }
  }
}

export const workOrderApi = {
  getAll: async () => {
    try {
      const res = await client.get('/work-orders')
      return res.data
    } catch (err) {
      if (ENABLE_MOCK) {
        return { success: true, totalBays: 4, activeWorkOrders: 0, data: [] }
      }
      throw err
    }
  },
  getById: async (id) => {
    const res = await client.get(`/work-orders/${id}`)
    return res.data
  },
  dispatch: async (req) => {
    const res = await client.post('/work-orders/dispatch', req)
    return res.data
  },
  updateStatus: async (id, status, progress) => {
    const res = await client.put(`/work-orders/${id}/status`, null, { params: { status, progress } })
    return res.data
  }
}

export const inventoryApi = {
  getAll: async () => {
    try {
      const res = await client.get('/inventory')
      return res.data
    } catch (err) {
      if (ENABLE_MOCK) {
        return { success: true, totalSKUs: 0, inStockCount: 0, data: [] }
      }
      throw err
    }
  },
  procure: async (req) => {
    const res = await client.post('/inventory/procure', req)
    return res.data
  }
}

export const warrantyApi = {
  getAll: async () => {
    try {
      const res = await client.get('/warranties')
      return res.data
    } catch (err) {
      if (ENABLE_MOCK) {
        return { success: true, totalIssuedCertificates: 0, data: [] }
      }
      throw err
    }
  },
  verify: async (token) => {
    const res = await client.get(`/warranties/verify/${token}`)
    return res.data
  }
}

export const garageApi = {
  getMetrics: async () => {
    try {
      const res = await client.get('/garage/metrics')
      return res.data
    } catch (err) {
      if (ENABLE_MOCK) {
        return {
          garageName: 'AutoTune Saigon Performance Hub',
          rating: 4.95,
          totalBays: 4,
          baysOccupied: 3,
          monthlyRevenueVnd: 845000000,
          fitmentAccuracyRate: '99.98%'
        }
      }
      throw err
    }
  }
}

export const authApi = {
  login: async (username, password) => {
    const res = await client.post('/auth/login', { username, password })
    return res.data
  },
  logout: async () => {
    try {
      const res = await client.post('/auth/logout')
      return res.data
    } catch {
      return { success: true }
    }
  },
  getMe: async () => {
    const res = await client.get('/auth/me')
    return res.data
  },
  getAllUsers: async () => {
    const res = await client.get('/auth/users')
    return res.data
  },
  createUser: async (payload) => {
    const res = await client.post('/auth/users', payload)
    return res.data
  },
  updateUserRole: async (id, role) => {
    const res = await client.put(`/auth/users/${id}/role`, { role })
    return res.data
  },
  deleteUser: async (id) => {
    const res = await client.delete(`/auth/users/${id}`)
    return res.data
  }
}

export default client
