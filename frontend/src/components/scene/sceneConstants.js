// ─── Supported 3D Real-Life Car Models ─────────────────────────────────────────
export const CAR_MODEL_FILES = {
  'ferrari-458':           '/models/ferrari.glb',
  'lamborghini-aventador': '/models/lamborghini.glb',
  'porsche-gt3':           '/models/porsche.glb',
  'porsche-carrera-991':   '/models/porsche.glb',
  'mclaren-720s':          '/models/mclaren.glb',
  'bmw-m4-csl':            '/models/bmw.glb',
  'bmw-vision':            '/models/bmw.glb',
}

// ─── Official Real-Life Aftermarket 3D Part Assets ───────────────────────────
export const PART_MODEL_FILES = {
  'wheel-work-vsxx-19': '/models/parts/ferrari-458/wheels/work-vs-xx.glb',
  'spoiler-bcl-wing':   '/models/parts/ferrari-458/spoilers/big-country-labs-style-wing.glb',
  'brakes-brembo-gt':   '/models/parts/ferrari-458/brakes/brembo-gt-brakes.glb',
  'exhaust-akrapovic':  '/models/parts/ferrari-458/exhaust/akrapovic-exhaust-tips.glb',
}

// ─── Dynamic Aftermarket Wheel Finishes ───────────────────────────────────────
export const WHEEL_FINISH_PRESETS = {
  'GLOSS_BLACK': { id: 'GLOSS_BLACK', name: 'Gloss Black', hex: '#111111', metalness: 0.85, roughness: 0.15 },
  'SATIN_BLACK': { id: 'SATIN_BLACK', name: 'Satin Black', hex: '#222222', metalness: 0.60, roughness: 0.45 },
  'SILVER':      { id: 'SILVER',      name: 'Silver',      hex: '#d8d8d8', metalness: 0.90, roughness: 0.25 },
  'GUNMETAL':    { id: 'GUNMETAL',    name: 'Gunmetal',    hex: '#3e4146', metalness: 0.85, roughness: 0.30 },
}

export const DRACO_PATH = '/draco/gltf/'
export const FERRARI_AO = '/models/ferrari_ao.png'
