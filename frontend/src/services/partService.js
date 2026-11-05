import client from './client/httpClient'

export const SKU_DEFAULT_IMAGES = {
  'BBS-FIR-992-TITAN': '/images/bbs-fi-r-wheel.jpg',
  'RAYS-TE37-ULTRA-20': '/images/rays-te37-ultra.jpg',
  'WORK-VSXX-19-F458': '/images/work-vs-xx-wheel.jpg',
  'GEN-GTWING-F458': '/images/carbon-gt-wing.jpg',
  'CARB-AERO-F458': '/images/carbon-aero-package.jpg',
  'AKR-EVO-TITAN-992': '/images/akrapovic-evolution-line.jpg',
  'KW-35271842-V4CS': '/images/kw-v4-clubsport.jpg',
  'BRM-1N1.9042A2': '/images/brembo-gt-brake-kit.jpg',
  'VOR-CF-AERO-992': '/images/gt3-carbon-wing.jpg'
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

