import client, { API_BASE, ENABLE_MOCK } from './client/httpClient'
import { carApi, normalizeCar } from './carService'
import { partApi, normalizePart, SKU_DEFAULT_IMAGES } from './partService'
import { buildApi } from './buildService'
import {
  quotationApi,
  workOrderApi,
  inventoryApi,
  warrantyApi,
  garageApi,
  fitmentApi,
  legalCheckApi,
} from './operationsService'
import { authApi, userApi } from './authService'

// Re-export all domain services and constants for 100% backward compatibility
export {
  API_BASE,
  ENABLE_MOCK,
  normalizeCar,
  carApi,
  SKU_DEFAULT_IMAGES,
  normalizePart,
  partApi,
  fitmentApi,
  quotationApi,
  legalCheckApi,
  workOrderApi,
  inventoryApi,
  warrantyApi,
  garageApi,
  authApi,
  buildApi,
  userApi,
}

export default client
