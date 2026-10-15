import { useMemo } from 'react'

/**
 * Custom hook to calculate vehicle build pricing, options totals, and currency conversions
 * accurately according to Virtual Tune commercial guidelines.
 *
 * @param {Object} activeCar - The current vehicle entity from backend database
 * @param {Array} selectedParts - Array of selected performance & aero parts
 * @returns {Object} Calculated pricing metrics
 */
export function useBuildPricing(activeCar, selectedParts = []) {
  return useMemo(() => {
    const parts = Array.isArray(selectedParts) ? selectedParts : []
    
    // Sum of aftermarket & tuning options in USD
    const optionsTotal = parts.reduce((sum, p) => sum + (p.priceUsd || 0), 0)
    
    // Sum of options in VND (fallback to standard USD * 25,000 exchange rate)
    const optionsTotalVnd = parts.reduce(
      (sum, p) => sum + (p.priceVnd || ((p.priceUsd || 0) * 25000)),
      0
    )

    const basePrice = activeCar?.price || 0
    const basePriceVnd = activeCar?.priceVnd || (basePrice * 25000)

    const totalEstimatedCost = basePrice + optionsTotal
    const totalEstimatedCostVnd = basePriceVnd + optionsTotalVnd

    return {
      basePrice,
      basePriceVnd,
      optionsTotal,
      optionsTotalVnd,
      totalEstimatedCost,
      totalEstimatedCostVnd,
      formattedTotalUsd: `$${totalEstimatedCost.toLocaleString()}`,
      formattedTotalVnd: `${totalEstimatedCostVnd.toLocaleString('vi-VN')} ₫`,
      formattedBaseUsd: `$${basePrice.toLocaleString()}`,
      formattedOptionsUsd: `$${optionsTotal.toLocaleString()}`
    }
  }, [activeCar, selectedParts])
}
