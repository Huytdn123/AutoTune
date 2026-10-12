import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

/**
 * GarageProfilePage - Garage Profile & B2B Network Marketplace
 * Virtual Tune Automotive Precision System
 */
export default function GarageProfilePage() {
  const navigate = useNavigate()

  return (
    <div className="bg-[#F3F5FA] text-[#111827] antialiased min-h-[calc(100vh-4rem)] selection:bg-[#0213B2]/20 selection:text-[#0213B2] flex flex-col flex-1 w-full font-['Inter',sans-serif]">
      
      {/* Top Network Sub-bar */}
      <div className="border-b border-[#BCC7D8] bg-[#E8EDFF] py-2.5 px-6 lg:px-12 text-xs font-mono">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-[#475569]">
            <span>Global Tuner Network</span>
            <span className="text-[#CBD5E1]">/</span>
            <span>DACH Region</span>
            <span className="text-[#CBD5E1]">/</span>
            <span className="text-[#06169B] font-bold">Apex Dynamics Motorsport</span>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <span className="inline-flex items-center gap-1.5 text-[#0213B2] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#0213B2] animate-pulse"></span>
              6 Active CAD Bays Online
            </span>
            <span className="text-[#CBD5E1]">|</span>
            <span className="text-[#475569]">Latency: 18ms Telemetry Link</span>
          </div>
        </div>
      </div>

      {/* Hero Header Area */}
      <section className="relative bg-[#E8EDFF] border-b border-[#BCC7D8] py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-[#BCC7D8]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D7E1FF] border border-[#0213B2]/30 text-[#0213B2] text-xs font-bold mb-4 font-mono">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>TÜV Certified Bay • ISO 9001:2015</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] font-['Montserrat'] tracking-tight uppercase">
                Apex Dynamics Motorsport
              </h1>
              <p className="text-xs sm:text-sm text-[#475569] mt-2 flex flex-wrap items-center gap-2">
                <span className="material-symbols-outlined text-[#0213B2] text-[18px]">pin_drop</span>
                <span className="font-semibold text-[#111827]">Munich, Germany</span>
                <span className="text-[#CBD5E1]">•</span>
                <span>6 Dedicated CAD & Dyno Bays</span>
                <span className="text-[#CBD5E1]">•</span>
                <span>Laser Kinematic Alignment</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              <a 
                href="#consultation-form"
                className="px-6 py-3 rounded-xl bg-[#0213B2] hover:bg-[#0115BC] active:bg-[#06169B] text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-md shadow-[#0213B2]/20 inline-flex items-center gap-2 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[18px]">assignment_add</span>
                <span>Work Order Consultation</span>
              </a>
            </div>
          </div>

          {/* 4 Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
            <div className="p-5 rounded-xl bg-[#D7E1FF] border border-[#BCC7D8] shadow-xs">
              <div className="text-[11px] font-mono text-[#06169B] font-bold uppercase tracking-wider">Completed Builds</div>
              <div className="text-2xl lg:text-3xl font-extrabold font-['Montserrat'] text-[#06169B] mt-1">412+</div>
              <div className="text-xs text-[#0213B2] font-medium mt-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span>Verified Platform Logged</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#D7E1FF] border border-[#BCC7D8] shadow-xs">
              <div className="text-[11px] font-mono text-[#06169B] font-bold uppercase tracking-wider">Fitment Rate</div>
              <div className="text-2xl lg:text-3xl font-extrabold font-['Montserrat'] text-[#06169B] mt-1">99.9%</div>
              <div className="text-xs text-[#16A34A] font-semibold mt-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">check_circle</span>
                <span>Zero-Rub Kinematic Guarantee</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#D7E1FF] border border-[#BCC7D8] shadow-xs">
              <div className="text-[11px] font-mono text-[#06169B] font-bold uppercase tracking-wider">Volume</div>
              <div className="text-2xl lg:text-3xl font-extrabold font-['Montserrat'] text-[#06169B] mt-1">€2.4M</div>
              <div className="text-xs text-[#06169B] font-medium mt-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">account_balance</span>
                <span>Escrow Secured Pipeline</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-[#D7E1FF] border border-[#BCC7D8] shadow-xs">
              <div className="text-[11px] font-mono text-[#06169B] font-bold uppercase tracking-wider">Avg Turnaround</div>
              <div className="text-2xl lg:text-3xl font-extrabold font-['Montserrat'] text-[#06169B] mt-1">48h</div>
              <div className="text-xs text-[#475569] font-medium mt-1 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-[14px]">timer</span>
                <span>Staged Track Conversions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Specializations */}
      <section className="py-12 bg-[#F3F5FA]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-[#CBD5E1]">
            <div>
              <span className="text-xs text-[#0213B2] tracking-widest uppercase font-mono font-bold">Core Capabilities</span>
              <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] text-[#111827] uppercase mt-1">
                Workshop Specializations
              </h2>
            </div>
            <span className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#E8EDFF] text-xs font-mono text-[#0213B2] border border-[#0213B2]/20 font-bold">
              <span className="material-symbols-outlined text-[16px]">shield</span>
              <span>TÜV Teilegutachten Integration</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-[#CBD5E1] hover:border-[#0213B2] transition-all flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#D7E1FF] border border-[#0213B2]/30 flex items-center justify-center text-[#0213B2]">
                  <span className="material-symbols-outlined">car_repair</span>
                </div>
                <h3 className="text-sm font-bold font-['Montserrat'] text-[#111827] uppercase">Body Modification</h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Custom carbon widebody integration, aerodynamic CFD alignment, bespoke dry carbon splitters, and swan-neck wings.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#0213B2] font-semibold">
                <span>Laser Kinematic Fitting</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#CBD5E1] hover:border-[#0213B2] transition-all flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#D7E1FF] border border-[#0213B2]/30 flex items-center justify-center text-[#0213B2]">
                  <span className="material-symbols-outlined">speed</span>
                </div>
                <h3 className="text-sm font-bold font-['Montserrat'] text-[#111827] uppercase">Performance Upgrade</h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Stage 1-3 ECU/TCU dyno calibration, titanium exhaust architectures, KW coilover telemetry tuning, Brembo carbon ceramics.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#0213B2] font-semibold">
                <span>AWD Dyno Cell 1500HP</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#CBD5E1] hover:border-[#0213B2] transition-all flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#D7E1FF] border border-[#0213B2]/30 flex items-center justify-center text-[#0213B2]">
                  <span className="material-symbols-outlined">format_paint</span>
                </div>
                <h3 className="text-sm font-bold font-['Montserrat'] text-[#111827] uppercase">Wrap & Surface Protection</h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Full-vehicle stealth matte PPF, bespoke color-shift vinyl wraps, self-healing coatings, and multi-stage ceramic sealing.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#0213B2] font-semibold">
                <span>Dust-Free Climate Bay</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-xl border border-[#CBD5E1] hover:border-[#0213B2] transition-all flex flex-col justify-between shadow-xs">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-lg bg-[#D7E1FF] border border-[#0213B2]/30 flex items-center justify-center text-[#0213B2]">
                  <span className="material-symbols-outlined">inventory_2</span>
                </div>
                <h3 className="text-sm font-bold font-['Montserrat'] text-[#111827] uppercase">Premium Sourcing</h3>
                <p className="text-xs text-[#475569] leading-relaxed">
                  Apex Forged Wheels, BBS Motorsport, Akrapovič titanium systems, Recaro carbon buckets with TÜV homologation dossiers.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-[#E2E8F0] flex items-center justify-between text-xs text-[#0213B2] font-semibold">
                <span>Tier-1 Direct Supply</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Transformations */}
      <section className="py-12 bg-white border-y border-[#CBD5E1]">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-[#E2E8F0]">
            <div>
              <span className="text-xs text-[#0213B2] tracking-widest uppercase font-mono font-bold">Featured Transformations</span>
              <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] text-[#111827] uppercase mt-1">
                Before & After CAD Showcase
              </h2>
              <p className="text-xs sm:text-sm text-[#475569] mt-1">
                Real client vehicles modeled in Virtual Tune and assembled with zero fitment deviation.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#DCFCE7] text-xs font-mono text-[#16A34A] border border-[#16A34A]/30 font-bold">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                Real Photo Verification Confirmed
              </span>
            </div>
          </div>

          <div className="space-y-10">
            {/* Build 01 */}
            <div className="bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1] overflow-hidden shadow-sm hover:border-[#0213B2] transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 relative bg-[#CBD5E1] flex items-center justify-center p-3 border-b lg:border-b-0 lg:border-r border-[#CBD5E1]">
                  <div className="relative w-full overflow-hidden rounded-xl">
                    <img alt="Nissan GT-R Track Edition transformation before and after" className="w-full h-auto object-cover rounded-xl" src="/images/gtr-transformation.jpg" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-[#111827] border border-[#E2E8F0] font-mono font-bold">
                      TELEMETRY ID: #GTR-VR38-904
                    </div>
                    <div className="absolute bottom-3 right-3 bg-[#DCFCE7]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-[#16A34A] border border-[#16A34A]/30 font-mono font-bold">
                      100% CAD SWEPT MATCH
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#0213B2] mb-2 font-mono">
                      <span className="uppercase tracking-wider font-bold">Build 01 • Staged Conversion</span>
                      <span className="bg-[#DCFCE7] text-[#16A34A] px-2 py-0.5 rounded border border-[#16A34A]/30 font-bold">TÜV Approved</span>
                    </div>
                    <h3 className="font-['Montserrat'] text-base sm:text-lg font-bold text-[#111827] uppercase leading-tight">
                      Nissan GT-R Track Edition — Full Aero Widebody & Forged Wheel Conversion
                    </h3>
                    <div className="mt-5 space-y-2.5 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                      <div className="flex justify-between text-xs pb-2 border-b border-[#E2E8F0]">
                        <span className="text-[#64748B]">Aero Package:</span>
                        <span className="text-[#111827] font-semibold text-right">Pandem Widebody Kit + Carbon Hood</span>
                      </div>
                      <div className="flex justify-between text-xs pb-2 border-b border-[#E2E8F0]">
                        <span className="text-[#64748B]">Wheel Assembly:</span>
                        <span className="text-[#111827] font-semibold text-right">20" Forged Bronze Staggered (-15 Offset)</span>
                      </div>
                      <div className="flex justify-between text-xs pb-2 border-b border-[#E2E8F0]">
                        <span className="text-[#64748B]">Braking System:</span>
                        <span className="text-[#111827] font-semibold text-right">6-Pot Monobloc 400mm Carbon Ceramic</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[#64748B]">Kinematic Verification:</span>
                        <span className="text-[#16A34A] font-bold text-right">100% CAD Swept Clearance Validated</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-xs text-[#0213B2] font-mono font-bold">BOM TOTAL: €28,450.00</span>
                    <Link to="/configurator" className="px-4 py-2 rounded-lg bg-white hover:bg-[#EEF2FF] text-[#111827] hover:text-[#0213B2] text-xs font-['Montserrat'] font-bold transition-all border border-[#CBD5E1] hover:border-[#0213B2] inline-flex items-center gap-2 shadow-xs cursor-pointer">
                      <span className="material-symbols-outlined text-[16px] text-[#0213B2]">view_in_ar</span>
                      <span>Load CAD Telemetry</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Build 02 */}
            <div className="bg-[#F8FAFC] rounded-2xl border border-[#CBD5E1] overflow-hidden shadow-sm hover:border-[#0213B2] transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 relative bg-[#CBD5E1] flex items-center justify-center p-3 border-b lg:border-b-0 lg:border-r border-[#CBD5E1]">
                  <div className="relative w-full overflow-hidden rounded-xl">
                    <img alt="Audi R8 V10 Plus before and after transformation" className="w-full h-auto object-cover rounded-xl" src="/images/audi-r8-stealth.jpg" />
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-[#111827] border border-[#E2E8F0] font-mono font-bold">
                      TELEMETRY ID: #R8-V10-441
                    </div>
                    <div className="absolute bottom-3 right-3 bg-[#D7E1FF]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-[#0213B2] border border-[#0213B2]/30 font-mono font-bold">
                      SURFACE THICKNESS 8.5 MIL SPEC
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between bg-white">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#0213B2] mb-2 font-mono">
                      <span className="uppercase tracking-wider font-bold">Build 02 • Stealth Satin & Aero</span>
                      <span className="bg-[#EEF2FF] text-[#0213B2] px-2 py-0.5 rounded border border-[#0213B2]/20 font-bold">Completed in 3.5 Days</span>
                    </div>
                    <h3 className="font-['Montserrat'] text-base sm:text-lg font-bold text-[#111827] uppercase leading-tight">
                      Audi R8 V10 Plus — Custom Stealth Satin Navy Wrap & Aerodynamic Package
                    </h3>
                    <div className="mt-5 space-y-2.5 bg-[#F8FAFC] p-4 rounded-xl border border-[#E2E8F0]">
                      <div className="flex justify-between text-xs pb-2 border-b border-[#E2E8F0]">
                        <span className="text-[#64748B]">Finish & Coating:</span>
                        <span className="text-[#111827] font-semibold text-right">Satin Deep Navy PPF + 9H Ceramic Sealant</span>
                      </div>
                      <div className="flex justify-between text-xs pb-2 border-b border-[#E2E8F0]">
                        <span className="text-[#64748B]">Aero Components:</span>
                        <span className="text-[#111827] font-semibold text-right">Dry Carbon Front Splitter & Rear Diffuser</span>
                      </div>
                      <div className="flex justify-between text-xs pb-2 border-b border-[#E2E8F0]">
                        <span className="text-[#64748B]">Wheels & Stance:</span>
                        <span className="text-[#111827] font-semibold text-right">Gloss Black Monobloc Forged with H&R Lowering</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-[#64748B]">Surface Fit Tolerance:</span>
                        <span className="text-[#16A34A] font-bold text-right">±0.2mm Laser Trim Edge Alignment</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-[#E2E8F0] flex items-center justify-between">
                    <span className="text-xs text-[#0213B2] font-mono font-bold">BOM TOTAL: €14,890.00</span>
                    <Link to="/configurator" className="px-4 py-2 rounded-lg bg-white hover:bg-[#EEF2FF] text-[#111827] hover:text-[#0213B2] text-xs font-['Montserrat'] font-bold transition-all border border-[#CBD5E1] hover:border-[#0213B2] inline-flex items-center gap-2 shadow-xs cursor-pointer">
                      <span className="material-symbols-outlined text-[16px] text-[#0213B2]">layers</span>
                      <span>View Wrap Layers</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Consultation Request */}
      <section className="py-12 bg-[#E8EDFF] border-b border-[#BCC7D8]" id="consultation-form">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="p-8 lg:p-10 rounded-2xl bg-[#D7E1FF] border border-[#BCC7D8] flex flex-col md:flex-row items-center justify-between gap-8 shadow-sm">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/70 text-[#0213B2] text-xs font-bold mb-3 border border-[#0213B2]/20 font-mono">
                <span className="material-symbols-outlined text-[14px]">handshake</span>
                <span>Direct B2B Workshop Partnership</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] text-[#111827] uppercase">
                Dispatch Consultation or CAD Work Order to Apex Dynamics
              </h2>
              <p className="text-xs sm:text-sm text-[#334155] mt-2 leading-relaxed">
                Submit engineering work orders, CAD fitment packages, or homologation verification requests directly to Munich Bay specialists. Guaranteed 4-hour SLA response time.
              </p>
            </div>
            <div className="shrink-0 w-full md:w-auto">
              <button 
                onClick={() => navigate('/quotation')}
                className="w-full md:w-auto px-8 py-3.5 rounded-xl bg-[#0213B2] hover:bg-[#0115BC] active:bg-[#06169B] text-white font-['Montserrat'] font-bold text-xs uppercase tracking-wider transition-all duration-200 active:scale-95 shadow-md shadow-[#0213B2]/20 flex items-center justify-center gap-3 cursor-pointer"
              >
                <span className="material-symbols-outlined text-[20px]">send</span>
                <span>Submit Quotation Request</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-[#CBD5E1] py-8 px-6 lg:px-12">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-[#64748B]">
          <div>
            © 2025 Virtual Tune Automotive Technologies Inc. Precision CAD Fitment & Workshop Telemetry.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <a className="hover:text-[#0213B2] transition-colors" href="#">Fitment API</a>
            <a className="hover:text-[#0213B2] transition-colors" href="#">Telemetry Docs</a>
            <a className="hover:text-[#0213B2] transition-colors" href="#">Security & Compliance</a>
            <a className="hover:text-[#0213B2] transition-colors" href="#">B2B Terms</a>
          </div>
        </div>
      </footer>

    </div>
  )
}
