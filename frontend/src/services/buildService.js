import client from './client/httpClient'

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

