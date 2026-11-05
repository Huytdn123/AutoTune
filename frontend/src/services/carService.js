import client from './client/httpClient'

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
    bodyType: c.bodyType || 'Electric Mini SUV',
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

