import React from 'react'
import { Link } from 'react-router-dom'

// High-resolution real automotive imagery mapped directly to verified car models
export const CAR_IMAGE_MAP = {
  'ferrari-458': '/images/cars/ferrari-458.webp',
  'porsche-gt3': '/images/cars/porsche-911-carrera.webp',
  'lamborghini-aventador': '/images/cars/lamborghini-aventador.webp',
  'bmw-m4-csl': '/images/cars/bmw-connecteddrive.webp',
  'mclaren-720s': '/images/cars/mclaren-720s.webp',
  'vinfast-vf3': '/images/cars/vinfast-vf3.webp',
  'vinfast-vf3-2026': '/images/cars/vinfast-vf3.webp'
}

/**
 * FeaturedFleetSection - Displays real database vehicles ready for 3D customization.
 */
export default function FeaturedFleetSection({
  cars,
  loadingCars,
  carError,
  onLaunchConfigurator,
}) {
  return (
    <section className="py-20 border-b border-[#D8DFEA] dark:border-[#282A3A] bg-[#FFFFFF] dark:bg-[#10121A]" id="featured-fleet" data-preserve-white="true">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4 reveal-on-scroll">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EDFF] dark:bg-[#1E254A] border border-[#0213B2]/30 dark:border-[#384580] mb-3">
              <span className="text-xs font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">Verified Database Fleet</span>
            </div>
            <h2 className="font-['Montserrat'] text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] dark:text-white uppercase tracking-tight">
              Production Fleet & EV Staging Ready for 3D Customization
            </h2>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#CBD5E1] mt-2 max-w-2xl">
              Select any vehicle below to launch directly into the 3D studio with authentic factory telemetry, curb weight, and hub bolt patterns.
            </p>
          </div>

          <Link
            to="/configurator"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-['Montserrat'] font-bold text-[#0213B2] dark:text-[#60A5FA] hover:text-[#0115BC] dark:hover:text-white transition-colors cursor-pointer whitespace-nowrap self-start md:self-end"
          >
            <span>Explore All in 3D Studio</span>
            <span className="material-symbols-outlined text-base">arrow_forward</span>
          </Link>
        </div>

        {/* Loading State */}
        {loadingCars && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map(n => (
              <div key={n} className="rounded-2xl border border-[#E2E8F0] dark:border-[#282A3A] bg-[#F8FAFC] dark:bg-[#14151D] p-5 space-y-4 animate-pulse">
                <div className="w-full aspect-[16/10] bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
                <div className="h-6 bg-slate-200 dark:bg-slate-800 rounded w-2/3"></div>
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-full"></div>
                <div className="h-10 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {!loadingCars && carError && (
          <div className="rounded-2xl border border-red-300 dark:border-red-900/60 bg-red-50 dark:bg-red-950/20 p-8 text-center max-w-xl mx-auto space-y-4">
            <span className="material-symbols-outlined text-red-600 dark:text-red-400 text-4xl">cloud_off</span>
            <p className="text-sm text-red-800 dark:text-red-300 font-medium">{carError}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-5 py-2.5 rounded-xl bg-red-600 text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider hover:bg-red-700 cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        )}

        {/* Empty State */}
        {!loadingCars && !carError && cars.length === 0 && (
          <div className="rounded-2xl border border-[#CBD5E1] dark:border-[#282A3A] bg-white dark:bg-[#14151D] p-10 text-center max-w-md mx-auto space-y-3" data-preserve-white="true">
            <span className="material-symbols-outlined text-4xl text-[#64748B]">directions_car</span>
            <h3 className="font-['Montserrat'] text-base font-bold text-[#111827] dark:text-white">No Vehicles Found</h3>
            <p className="text-xs text-[#475569] dark:text-[#94A3B8]">Please check that the backend server is running and retry.</p>
          </div>
        )}

        {/* Loaded Cars Grid */}
        {!loadingCars && !carError && cars.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cars.map((car, index) => {
              const carImage = CAR_IMAGE_MAP[car.slug] || CAR_IMAGE_MAP[car.id] || '/images/cars/ferrari-458.webp'
              const hp = car.horsepower || car.specs?.performance?.find(p => p.label?.toLowerCase().includes('power'))?.value || null
              const zeroToHundred = car.specs?.performance?.find(p => p.label?.includes('0–100') || p.label?.includes('0-100'))?.value || null
              const boltPattern = car.stockBoltPattern || null
              const staggerClass = `stagger-${(index % 3) + 1}`

              return (
                <div
                  key={car.id || car.slug}
                  className={`group rounded-2xl border border-[#CBD5E1] dark:border-[#282A3A] bg-white dark:bg-[#14151D] hover:border-[#0213B2] dark:hover:border-[#60A5FA] shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden reveal-on-scroll ${staggerClass}`}
                  data-preserve-white="true"
                >
                  <div>
                    {/* Vehicle Image Viewport */}
                    <div className="relative aspect-[16/10] overflow-hidden bg-slate-900 border-b border-[#E2E8F0] dark:border-[#282A3A]">
                      <img
                        src={carImage}
                        alt={`${car.brand} ${car.model}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                      <div className="absolute top-3 left-3 bg-black/65 backdrop-blur-md px-2.5 py-1 rounded-lg text-white font-mono text-[11px] font-bold border border-white/20">
                        {car.brand?.toUpperCase()}
                      </div>
                      {car.year && (
                        <div className="absolute top-3 right-3 bg-white/90 dark:bg-[#14151D]/90 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-mono font-semibold text-[#111827] dark:text-white border border-[#CBD5E1] dark:border-[#282A3A]">
                          {car.year}
                        </div>
                      )}
                    </div>

                    {/* Content & Specs */}
                    <div className="p-6">
                      <div className="flex items-baseline justify-between mb-2">
                        <h3 className="font-['Montserrat'] text-lg font-black text-[#111827] dark:text-white tracking-tight">
                          {car.brand} {car.model}
                        </h3>
                      </div>

                      {car.tagline && (
                        <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-medium mb-4 line-clamp-1">
                          {car.tagline}
                        </p>
                      )}

                      {/* Verified Technical Badges */}
                      <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E2E8F0] dark:border-[#282A3A] text-xs font-mono">
                        {hp && (
                          <div className="bg-[#F8FAFC] dark:bg-[#1B1D28] p-2 rounded-lg border border-[#E2E8F0] dark:border-[#282A3A]">
                            <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] block">Horsepower</span>
                            <span className="font-bold text-[#111827] dark:text-white">{typeof hp === 'number' ? `${hp} HP` : hp}</span>
                          </div>
                        )}

                        {zeroToHundred && (
                          <div className="bg-[#F8FAFC] dark:bg-[#1B1D28] p-2 rounded-lg border border-[#E2E8F0] dark:border-[#282A3A]">
                            <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] block">0–100 km/h</span>
                            <span className="font-bold text-[#0213B2] dark:text-[#60A5FA]">{zeroToHundred}</span>
                          </div>
                        )}

                        {boltPattern && (
                          <div className="bg-[#F8FAFC] dark:bg-[#1B1D28] p-2 rounded-lg border border-[#E2E8F0] dark:border-[#282A3A]">
                            <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] block">Bolt Pattern</span>
                            <span className="font-bold text-[#111827] dark:text-white">{boltPattern}</span>
                          </div>
                        )}

                        {car.curbWeightKg && (
                          <div className="bg-[#F8FAFC] dark:bg-[#1B1D28] p-2 rounded-lg border border-[#E2E8F0] dark:border-[#282A3A]">
                            <span className="text-[10px] text-[#64748B] dark:text-[#94A3B8] block">Curb Weight</span>
                            <span className="font-bold text-[#111827] dark:text-white">{car.curbWeightKg} kg</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Action Footer */}
                  <div className="p-6 pt-0">
                    <button
                      onClick={() => onLaunchConfigurator(car.slug || car.id)}
                      className="w-full py-3 px-4 rounded-xl bg-[#0213B2] hover:bg-[#0115BC] text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all duration-150 shadow-sm cursor-pointer group-hover:shadow-md"
                    >
                      <span className="material-symbols-outlined text-base">tune</span>
                      <span>Customize in 3D</span>
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

