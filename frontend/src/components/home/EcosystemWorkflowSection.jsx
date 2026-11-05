import React from 'react'
import { Link } from 'react-router-dom'

/**
 * EcosystemWorkflowSection - Explains the 3-step operational workflow
 * and two-sided value proposition for Car Owners & Tuning Workshops.
 */
export default function EcosystemWorkflowSection() {
  return (
    <>
      {/* ── SECTION 4: PLATFORM WORKFLOW: HOW IT WORKS ──────────────────────── */}
      <section className="py-24 border-b border-[#D8DFEA] dark:border-[#282A3A] bg-[#FFFFFF] dark:bg-[#10121A]" id="how-it-works" data-preserve-white="true">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="text-center max-w-3xl mx-auto mb-16 reveal-on-scroll">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EDFF] dark:bg-[#1E254A] border border-[#0213B2]/30 dark:border-[#384580] mb-3">
              <span className="text-xs font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">Standardized Platform Architecture</span>
            </div>
            <h2 className="font-['Montserrat'] text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] dark:text-white uppercase tracking-tight">
              From Virtual Conception to Workshop Floor
            </h2>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#CBD5E1] mt-2">
              Virtual Tune bridges customer aspiration with engineering reality through a seamless three-stage operational workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="rounded-2xl border border-[#CBD5E1] dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] bg-[#F8FAFC] dark:bg-[#14151D] p-8 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative reveal-on-scroll stagger-1">
              <div className="w-12 h-12 rounded-xl bg-[#E8EDFF] dark:bg-[#1E254A] border border-[#0213B2]/30 dark:border-[#384580] text-[#0213B2] dark:text-[#60A5FA] flex items-center justify-center font-['Montserrat'] font-black text-lg mb-6">
                01
              </div>
              <div>
                <h3 className="font-['Montserrat'] text-lg font-bold text-[#111827] dark:text-white mb-2">
                  Interactive 3D Configuration
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
                  Select your base vehicle, rotate 360°, test bespoke color shades (Gloss, Satin, Metallic), and swap authentic forged wheels, spoilers, and aero kits.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-[#282A3A] text-xs font-mono text-[#0213B2] dark:text-[#60A5FA] font-bold">
                Real-Time 360° Studio
              </div>
            </div>

            {/* Step 2 */}
            <div className="rounded-2xl border-2 border-[#0213B2] dark:border-[#60A5FA] bg-[#F8FAFC] dark:bg-[#14151D] p-8 flex flex-col justify-between shadow-md hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative reveal-on-scroll stagger-2">
              <div className="w-12 h-12 rounded-xl bg-[#0213B2] text-white flex items-center justify-center font-['Montserrat'] font-black text-lg mb-6 shadow-sm">
                02
              </div>
              <div>
                <h3 className="font-['Montserrat'] text-lg font-bold text-[#0213B2] dark:text-[#60A5FA] mb-2">
                  Mechanical Fitment Verification
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
                  The automated Fitment Engine cross-references axle clearances, brake caliper profiles, bolt circle diameters, and tire stance before ordering.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#0213B2]/20 dark:border-[#60A5FA]/20 text-xs font-mono text-[#0213B2] dark:text-[#60A5FA] font-bold">
                Zero Scrap & Clearance Checked
              </div>
            </div>

            {/* Step 3 */}
            <div className="rounded-2xl border border-[#CBD5E1] dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] bg-[#F8FAFC] dark:bg-[#14151D] p-8 flex flex-col justify-between shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative reveal-on-scroll stagger-3">
              <div className="w-12 h-12 rounded-xl bg-[#E8EDFF] dark:bg-[#1E254A] border border-[#0213B2]/30 dark:border-[#384580] text-[#0213B2] dark:text-[#60A5FA] flex items-center justify-center font-['Montserrat'] font-black text-lg mb-6">
                03
              </div>
              <div>
                <h3 className="font-['Montserrat'] text-lg font-bold text-[#111827] dark:text-white mb-2">
                  Transparent Quotes & Work Orders
                </h3>
                <p className="text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
                  Generate instant itemized bills of materials with transparent part pricing and installation labor, dispatching directly to partner garages for scheduling.
                </p>
              </div>
              <div className="mt-6 pt-4 border-t border-[#E2E8F0] dark:border-[#282A3A] text-xs font-mono text-[#0213B2] dark:text-[#60A5FA] font-bold">
                Direct Garage Work Orders
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SECTION 5: FOR CAR OWNERS & CERTIFIED GARAGES ──────────────────── */}
      <section className="py-24 border-b border-[#D8DFEA] dark:border-[#282A3A] bg-[#F3F5FA] dark:bg-[#0B0C10]" id="value-ecosystem">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12">
          <div className="max-w-3xl mb-16 reveal-on-scroll">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E8EDFF] dark:bg-[#1E254A] border border-[#0213B2]/30 dark:border-[#384580] mb-3">
              <span className="text-xs font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">Two-Sided Platform Value</span>
            </div>
            <h2 className="font-['Montserrat'] text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] dark:text-white uppercase tracking-tight">
              Engineered for Drivers & Tuning Workshops
            </h2>
            <p className="text-sm sm:text-base text-[#475569] dark:text-[#CBD5E1] mt-2">
              Virtual Tune bridges customer vision with engineering execution, eliminating miscommunication and delivering build perfection.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
            {/* Card 1: For Car Owners */}
            <div className="rounded-2xl border border-[#CBD5E1] dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] bg-white dark:bg-[#14151D] p-8 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between reveal-on-scroll stagger-1" data-preserve-white="true">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#E8EDFF] dark:bg-[#1E254A] text-[#0213B2] dark:text-[#60A5FA] flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">person</span>
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">For Car Enthusiasts</span>
                    <h3 className="font-['Montserrat'] text-xl font-bold text-[#111827] dark:text-white">Drivers & Car Owners</h3>
                  </div>
                </div>

                <ul className="space-y-4 text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1]">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#16A34A] text-lg mt-0.5">check_circle</span>
                    <span><strong>Visual Peace of Mind:</strong> See exactly how your performance build looks under studio lighting before committing substantial funds.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#16A34A] text-lg mt-0.5">check_circle</span>
                    <span><strong>Zero Compatibility Guesswork:</strong> Avoid buying incompatible parts that rub fenders or hit oversized multi-piston calipers.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#16A34A] text-lg mt-0.5">check_circle</span>
                    <span><strong>Transparent Cost Breakdown:</strong> Receive instant itemized BOM quotations for parts and certified bay installation labor.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#16A34A] text-lg mt-0.5">check_circle</span>
                    <span><strong>Digital Vehicle Passport:</strong> Access your verified modification history and QR digital warranty certificates anytime.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E2E8F0] dark:border-[#282A3A]">
                <Link
                  to="/configurator"
                  className="w-full py-3 px-4 rounded-xl bg-[#0213B2] hover:bg-[#0115BC] text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm"
                >
                  <span className="material-symbols-outlined text-sm">tune</span>
                  <span>Start Customizing Your Supercar</span>
                </Link>
              </div>
            </div>

            {/* Card 2: For Garages */}
            <div className="rounded-2xl border border-[#CBD5E1] dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] bg-white dark:bg-[#14151D] p-8 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between reveal-on-scroll stagger-2" data-preserve-white="true">
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-12 h-12 rounded-xl bg-[#E8EDFF] dark:bg-[#1E254A] text-[#0213B2] dark:text-[#60A5FA] flex items-center justify-center">
                    <span className="material-symbols-outlined text-2xl">precision_manufacturing</span>
                  </div>
                  <div>
                    <span className="text-xs font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">For Certified Partners</span>
                    <h3 className="font-['Montserrat'] text-xl font-bold text-[#111827] dark:text-white">Tuning Garages & Workshops</h3>
                  </div>
                </div>

                <ul className="space-y-4 text-xs sm:text-sm text-[#475569] dark:text-[#CBD5E1]">
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-lg mt-0.5">check_circle</span>
                    <span><strong>Higher Sales Conversions:</strong> Leverage the Showroom Sales consultation mode to visually present builds and close client packages faster.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-lg mt-0.5">check_circle</span>
                    <span><strong>Eliminate Bay Downtime:</strong> Verify clearance specifications before parts arrive, preventing cars from sitting idle on service lifts.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-lg mt-0.5">check_circle</span>
                    <span><strong>Professional Bay Operations:</strong> Assign lead technicians, manage bay numbers, track build stages, and monitor wholesale inventory.</span>
                  </li>
                  <li className="flex items-start gap-3">
                    <span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-lg mt-0.5">check_circle</span>
                    <span><strong>One-Click Commercial Invoicing:</strong> Generate formal quotations with configurable shop margins and printable work order documentation.</span>
                  </li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-[#E2E8F0] dark:border-[#282A3A]">
                <Link
                  to="/sales"
                  className="w-full py-3 px-4 rounded-xl bg-white dark:bg-[#1E254A] hover:bg-slate-50 dark:hover:bg-[#23348C] border-2 border-[#CBD5E1] dark:border-[#384580] hover:border-[#0213B2] dark:hover:border-[#60A5FA] text-[#0213B2] dark:text-[#60A5FA] font-['Montserrat'] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs"
                  data-preserve-white="true"
                >
                  <span className="material-symbols-outlined text-sm">tablet_mac</span>
                  <span>Explore Showroom Sales Mode</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

