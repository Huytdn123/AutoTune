/**
 * ─── CONFIGURATOR COLOR & FINISH PRESETS ─────────────────────────────────────
 * Precision CAD Fitment & Automotive Customization Platform
 */

// Exterior colors: based on actual OEM paint catalogs
export const BODY_COLORS = [
  // Ferrari palette
  { hex: '#CC0000', name: 'Rosso Corsa', finish: 'Metallic' },
  { hex: '#1A1A1A', name: 'Nero Daytona', finish: 'Solid' },
  { hex: '#F5C400', name: 'Giallo Modena', finish: 'Metallic' },
  { hex: '#FAFAFA', name: 'Bianco Italia', finish: 'Pearl' },
  { hex: '#B87A2A', name: 'Bronzo Fiorano', finish: 'Metallic' },
  // Multi-brand palette
  { hex: '#FF6B00', name: 'McLaren Papaya Orange', finish: 'Metallic' },
  { hex: '#1B4D8E', name: 'Le Mans Blue', finish: 'Metallic' },
  { hex: '#2D5A27', name: 'British Racing Green', finish: 'Satin' },
  { hex: '#7A7A7A', name: 'Grigio Silverstone', finish: 'Metallic' },
  { hex: '#0A1A6E', name: 'Blu Tour de France', finish: 'Metallic' },
]

// Rim finish: material-based color swap on rim meshes of the native model
export const RIM_COLORS = [
  { hex: '#CCCCCC', name: 'Argento (Silver)' },
  { hex: '#1A1A1A', name: 'Nero Lucido (Gloss Black)' },
  { hex: '#B87A2A', name: 'Oro Spazzolato (Brushed Gold)' },
  { hex: '#4A4A4A', name: 'Grigio Antracite (Anthracite)' },
  { hex: '#2D2D2D', name: 'Gunmetal Dark' },
  { hex: '#8C6A3A', name: 'Bronze Satin' },
  { hex: '#5C5C5C', name: 'Titanium Matte' },
]

// Automotive Glass: realistic tint tones (preventing blowout/reflection corruption)
export const GLASS_COLORS = [
  { hex: '#161c24', name: 'OEM Clear (Light Tint)' },
  { hex: '#0a0d12', name: 'Nero Privacy Tint' },
  { hex: '#142218', name: 'European Green Acoustic' },
  { hex: '#1c2432', name: 'Smoked Blue Polarized' },
]

// Interior upholstery & leather tones
export const INTERIOR_COLORS = [
  { hex: '#1A1A1A', name: 'Nero', finish: 'Full Grain Leather' },
  { hex: '#8B0000', name: 'Rosso', finish: 'Semi-Aniline Leather' },
  { hex: '#8B5A2B', name: 'Cuoio', finish: 'Poltrona Frau Leather' },
  { hex: '#E6DAC8', name: 'Crema', finish: 'Alcantara & Nappa' },
]

export const DEFAULT_CAR_SLUG = 'ferrari-458'
