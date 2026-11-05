import client, { ENABLE_MOCK } from './client/httpClient'

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
          regulation: 'Safety Circular 30/2026/TT-BXD',
          message: 'Vehicle configuration fully compliant with safety inspection regulations'
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

