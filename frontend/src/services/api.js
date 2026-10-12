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

export const normalizeCar = (c) => {
  if (!c) return c
  let parsedSpecs = c.specs
  if (typeof c.specsJson === 'string') {
    try {
      parsedSpecs = JSON.parse(c.specsJson)
    } catch {
      parsedSpecs = {}
    }
  }
  return {
    id: c.slug || c.id,
    slug: c.slug || c.id,
    carId: c.carId,
    brand: c.brand,
    model: c.model,
    modelPath: c.model3dPath || c.modelPath,
    year: c.yearManufactured || c.year,
    tagline: c.tagline,
    accentColor: c.accentColor || '#CC0000',
    defaultBody: c.defaultBodyColor || c.defaultBody || '#CC0000',
    defaultRim: c.defaultRimColor || c.defaultRim || '#CCCCCC',
    defaultGlass: c.defaultGlassColor || c.defaultGlass || '#C8D8F0',
    price: c.priceUsd || c.price || 250000,
    badge: c.badge || '',
    specs: parsedSpecs || c.specs || {},
    stockBoltPattern: c.stockBoltPattern,
    stockWheelSizeInch: c.stockWheelSizeInch,
    curbWeightKg: c.curbWeightKg,
    horsepower: c.horsepower
  }
}

export const carApi = {
  getAll: async () => {
    const res = await client.get('/cars')
    const data = Array.isArray(res.data) ? res.data : []
    return data.map(normalizeCar)
  },
  getById: async (id) => {
    const res = await client.get(`/cars/${id}`)
    return res.data ? normalizeCar(res.data) : null
  }
}

const SKU_DEFAULT_IMAGES = {
  'BBS-FIR-992-TITAN': '/images/bbs-fi-r-wheel.jpg',
  'RAYS-TE37-ULTRA-20': '/images/rays-te37-ultra.jpg',
  'WORK-VSXX-19-F458': '/images/work-vs-xx-wheel.jpg',
  'GEN-GTWING-F458': '/images/carbon-gt-wing.jpg',
  'CARB-AERO-F458': '/images/carbon-aero-package.jpg',
  'AKR-EVO-TITAN-992': '/images/akrapovic-evolution-line.jpg',
  'KW-35271842-V4CS': '/images/kw-v4-clubsport.jpg',
  'BRM-1N1.9042A2': '/images/brembo-gt-brake-kit.jpg',
  'VOR-CF-AERO-992': '/images/vorsteiner-carbon-aero.jpg'
}

export const normalizePart = (p) => {
  if (!p) return p
  const vnd = p.priceVnd || p.price || 0
  const usd = p.priceUsd || Math.round(vnd / 25000)
  const img = SKU_DEFAULT_IMAGES[p.sku] || p.imageUrl || p.image || '/images/bbs-fi-r-wheel.jpg'
  const compatible = p.compatibleVehicles || p.compatible || 'Universal Supercar Fitment'
  const rating = p.rating ? Number(p.rating) : 4.9
  const badge = p.badge || 'HOT / BESTSELLER'

  return {
    ...p,
    id: p.partId || p.id,
    partId: p.partId || p.id,
    sku: p.sku,
    name: p.partName || p.name,
    partName: p.partName || p.name,
    brand: p.brand,
    category: p.category,
    specifications: p.specifications || p.spec || '',
    priceVnd: vnd,
    priceUsd: usd,
    imageUrl: img,
    image: img,
    compatibleVehicles: compatible,
    compatible: compatible,
    rating,
    badge,
    assetUrl: p.assetUrl || p.model3dPath || null,
    material: p.material || 'Carbon Fiber / Aerospace Alloy',
    stockQuantity: p.stockQuantity ?? p.stock ?? 0,
    stock: p.stockQuantity ?? p.stock ?? 0,
    legalComplianceStatus: p.legalComplianceStatus || 'PASS'
  }
}

export const partApi = {
  getAll: async (category = '') => {
    const res = await client.get('/parts', { params: category ? { category } : {} })
    const raw = Array.isArray(res.data) ? res.data : (res.data?.data || [])
    return raw.map(normalizePart)
  },
  getById: async (id) => {
    const res = await client.get(`/parts/${id}`)
    return res.data ? normalizePart(res.data) : null
  }
}

export const fitmentApi = {
  getOverview: async () => {
    const res = await client.get('/fitment')
    return res.data
  },
  check: async (payload) => {
    const res = await client.post('/fitment/check', payload)
    return res.data
  }
}

export const quotationApi = {
  calculate: async (data) => {
    const res = await client.post('/quotations/calculate', data)
    return res.data
  },
  create: async (data) => {
    const res = await client.post('/quotations', data)
    return res.data
  },
  getAll: async () => {
    const res = await client.get('/quotations')
    return res.data
  },
  getMy: async () => {
    const res = await client.get('/quotations/my')
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
    const res = await client.get('/work-orders')
    return res.data
  },
  getMy: async () => {
    const res = await client.get('/work-orders/my')
    return res.data
  },
  getById: async (id) => {
    const res = await client.get(`/work-orders/${id}`)
    return res.data
  },
  create: async (req) => {
    const res = await client.post('/work-orders', req)
    return res.data
  },
  dispatch: async (req) => {
    const res = await client.post('/work-orders/dispatch', req)
    return res.data
  },
  assignTechnician: async (id, technicianId, bayNumber) => {
    const res = await client.put(`/work-orders/${id}/assign`, { technicianId, bayNumber })
    return res.data
  },
  updateStatus: async (id, status, progress, notes) => {
    const res = await client.put(`/work-orders/${id}/status`, { status, progress, notes }, { params: { status, progress } })
    return res.data
  }
}

export const inventoryApi = {
  getAll: async () => {
    const res = await client.get('/inventory')
    return res.data
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

export const buildApi = {
  create: async (data) => {
    try {
      const res = await client.post('/builds', data)
      if (res.data) {
        try {
          localStorage.setItem(`vt_build_${res.data.shareCode}`, JSON.stringify(res.data))
          const existingList = JSON.parse(localStorage.getItem('vt_recent_builds') || '[]')
          const updatedList = [res.data, ...existingList.filter(b => b.shareCode !== res.data.shareCode)].slice(0, 20)
          localStorage.setItem('vt_recent_builds', JSON.stringify(updatedList))
        } catch {}
        return res.data
      }
    } catch (err) {
      console.warn('Backend buildApi.create failed, using localStorage fallback:', err)
      const cleanSlug = (data.carSlug || 'CAR').replace(/[^a-zA-Z0-9]/g, '').toUpperCase().slice(0, 4)
      const randomPart = Math.random().toString(36).substring(2, 6).toUpperCase()
      const fallbackCode = `VT-${cleanSlug}-${randomPart}`
      const localBuild = {
        buildId: Date.now(),
        shareCode: fallbackCode,
        buildName: data.buildName || 'Custom 3D Build',
        car: {
          slug: data.carSlug,
          name: data.carName || data.carSlug
        },
        bodyColor: data.bodyColor,
        bodyFinish: data.bodyFinish || 'OEM',
        rimColor: data.rimColor,
        glassColor: data.glassColor,
        selectedPartsJson: data.selectedPartsJson,
        totalEstimatedCost: data.totalEstimatedCost,
        createdAt: new Date().toISOString()
      }
      try {
        localStorage.setItem(`vt_build_${fallbackCode}`, JSON.stringify(localBuild))
        const existingList = JSON.parse(localStorage.getItem('vt_recent_builds') || '[]')
        const updatedList = [localBuild, ...existingList.filter(b => b.shareCode !== fallbackCode)].slice(0, 20)
        localStorage.setItem('vt_recent_builds', JSON.stringify(updatedList))
      } catch {}
      return localBuild
    }
  },
  getByCode: async (shareCode) => {
    if (!shareCode) return null
    // 1. Try querying backend first
    try {
      const res = await client.get(`/builds/${shareCode}`)
      if (res.data) {
        try {
          localStorage.setItem(`vt_build_${shareCode}`, JSON.stringify(res.data))
        } catch {}
        return res.data
      }
    } catch (err) {
      console.warn(`Backend build lookup for ${shareCode} failed, checking local cache:`, err)
    }

    // 2. Check localStorage cache
    try {
      const cached = localStorage.getItem(`vt_build_${shareCode}`)
      if (cached) {
        return JSON.parse(cached)
      }
    } catch {}

    return null
  },
  getRecent: async () => {
    try {
      const res = await client.get('/builds/recent')
      if (Array.isArray(res.data) && res.data.length > 0) {
        return res.data
      }
    } catch {}
    try {
      return JSON.parse(localStorage.getItem('vt_recent_builds') || '[]')
    } catch {
      return []
    }
  },
  getMyBuilds: async () => {
    try {
      const res = await client.get('/builds/my')
      if (Array.isArray(res.data)) {
        return res.data
      }
    } catch (err) {
      console.warn('Failed to fetch user builds from backend:', err)
    }
    return []
  },
  rename: async (shareCode, buildName) => {
    const res = await client.patch(`/builds/${shareCode}/rename`, { buildName })
    return res.data
  },
  fork: async (shareCode) => {
    const res = await client.post(`/builds/${shareCode}/fork`)
    return res.data
  },
  delete: async (shareCode) => {
    const res = await client.delete(`/builds/${shareCode}`)
    return res.data
  }
}

export const userApi = {
  getProfile: async () => {
    const res = await client.get('/user/profile')
    return res.data
  },
  updateProfile: async (data) => {
    const res = await client.put('/user/profile', data)
    return res.data
  },
  changePassword: async (data) => {
    const res = await client.post('/user/change-password', data)
    return res.data
  }
}

export default client
