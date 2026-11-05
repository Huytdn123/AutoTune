import React from 'react'
import { Link } from 'react-router-dom'

// 4 Verified Mechanical Domains with real database parts & specifications
export const CUSTOMIZATION_CATEGORIES = [
  {
    id: 'wheels',
    title: 'Forged Monoblock & Modular Wheels',
    subtitle: 'Track-Tuned Lightweight Rims',
    desc: 'BBS LM Forged Monoblock, WORK VS-XX. Drastically lowers unsprung rotational mass for razor-sharp steering feedback.',
    image: '/images/bbs-fi-r-wheel.jpg',
    specs: ['PCD 5x114.3 / 5x130 Bolt Patterns', 'Aerospace 6061-T6 Forged Aluminum', 'Unsprung Mass Reduction up to -18.4%'],
    actionLabel: 'Browse Wheels in Store',
    link: '/shop'
  },
  {
    id: 'aero',
    title: 'Pre-Preg Carbon Fiber Aerodynamics',
    subtitle: 'Wind-Tunnel Tested Downforce',
    desc: 'Carbon GT Wings, front splitter extensions, and rear diffusers. Balances aerodynamic drag with real downforce under high-speed cornering.',
    image: '/images/carbon-aero-package.jpg',
    specs: ['Autoclaved Pre-preg 3K Carbon Fiber', 'Adds up to +140 kg Downforce @ 200 km/h', 'Computational Fluid Dynamics Verified'],
    actionLabel: 'Explore Aero Packages',
    link: '/shop'
  },
  {
    id: 'brakes',
    title: 'Competition Big Brake Systems',
    subtitle: 'Monobloc Calipers & 380mm Rotors',
    desc: 'Brembo GT-S 6-piston monobloc radial calipers paired with 2-piece slotted discs. Rigorously checked for inner-wheel barrel and spoke clearance.',
    image: '/images/brembo-gt-brake-kit.jpg',
    specs: ['Radial Monobloc 6-Piston Architecture', '800°C Thermal Fade Resistance', 'Dynamic Caliper-to-Spoke Sweep Checked'],
    actionLabel: 'Inspect Brake Kits',
    link: '/shop'
  },
  {
    id: 'suspension',
    title: 'Track Suspension & Titanium Exhaust',
    subtitle: '3-Way Adjustable Coilovers & Pipes',
    desc: 'KW V4 Clubsport 3-way adjustable dampers with Akrapovič Evolution titanium exhaust systems for maximum mechanical grip and acoustic excellence.',
    image: '/images/kw-v4-clubsport.jpg',
    specs: ['Independent High/Low Speed Bump & Rebound', 'Lowers Ride Height 20mm to 45mm', 'Ultra-Lightweight Titanium Acoustic Valving'],
    actionLabel: 'View Coilovers & Exhaust',
    link: '/shop'
  }
]

/**
 * CustomizationShowcaseSection - 4 engineered mechanical customization domains.
 */
export default function CustomizationShowcaseSection() {
  return (
    <section className="py-24 border-b border-[#D8DFEA] dark:border-[#282A3A] bg-[#F3F5FA] dark:bg-[#0B0C10]" id="customization">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
        <div className="max-w-3xl mb-16 reveal-on-scroll">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EDFF] dark:bg-[#1E254A] border border-[#0213B2]/30 dark:border-[#384580] mb-3">
            <span className="text-xs font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">Precision Hardware</span>
          </div>
          <h2 className="font-['Montserrat'] text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] dark:text-white uppercase tracking-tight">
            4 Engineered Customization Domains
          </h2>
          <p className="text-sm sm:text-base text-[#475569] dark:text-[#CBD5E1] mt-2">
            Every aftermarket component in our catalog is mathematically cross-referenced against OEM laser scans to ensure perfect zero-clearance fitment upon shop floor arrival.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {CUSTOMIZATION_CATEGORIES.map((cat, index) => (
            <div
              key={cat.id}
              className={`rounded-2xl border border-[#CBD5E1] dark:border-[#282A3A] bg-white dark:bg-[#14151D] hover:border-[#0213B2] dark:hover:border-[#60A5FA] overflow-hidden flex flex-col sm:flex-row shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 reveal-on-scroll stagger-${(index % 2) + 1}`}
              data-preserve-white="true"
            >
              {/* Part Image Frame */}
              <div className="w-full sm:w-5/12 aspect-square sm:aspect-auto relative bg-slate-100 dark:bg-[#181A24] p-4 flex items-center justify-center border-b sm:border-b-0 sm:border-r border-[#E2E8F0] dark:border-[#282A3A]">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="max-w-full max-h-48 sm:max-h-full object-contain"
                  loading="lazy"
                />
              </div>

              {/* Part Details & Specs */}
              <div className="w-full sm:w-7/12 p-6 flex flex-col justify-between">
                <div>
                  <span className="text-[11px] font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">
                    {cat.subtitle}
                  </span>
                  <h3 className="font-['Montserrat'] text-base sm:text-lg font-bold text-[#111827] dark:text-white mt-1 mb-2">
                    {cat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed mb-4">
                    {cat.desc}
                  </p>

                  <ul className="space-y-1.5 text-xs font-mono text-[#334155] dark:text-[#CBD5E1]">
                    {cat.specs.map((spec, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#0213B2] dark:bg-[#60A5FA]"></span>
                        <span>{spec}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 mt-6 border-t border-[#E2E8F0] dark:border-[#282A3A]">
                  <Link
                    to={cat.link}
                    className="inline-flex items-center gap-1.5 text-xs font-['Montserrat'] font-bold text-[#0213B2] dark:text-[#60A5FA] hover:text-[#0115BC] dark:hover:text-white uppercase tracking-wider transition-colors cursor-pointer"
                  >
                    <span>{cat.actionLabel}</span>
                    <span className="material-symbols-outlined text-sm">arrow_forward</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

