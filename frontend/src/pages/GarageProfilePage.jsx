import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

/**
 * GarageProfilePage - Garage Profile & B2B Network Marketplace
 * Virtual Tune Automotive Precision System
 */
export default function GarageProfilePage() {
  const navigate = useNavigate()

  return (
    <div className="bg-[#F3F5FA] dark:bg-[#0B0C10] text-[#111827] dark:text-[#F8FAFC] antialiased min-h-[calc(100vh-64px)] selection:bg-[#0213B2]/20 selection:text-[#0213B2] flex flex-col flex-1 w-full font-['Inter',sans-serif] transition-colors duration-200">
      
      {/* Top Network Sub-bar */}
      <div className="border-b border-slate-200 dark:border-[#282A3A] bg-[#E8EDFF] dark:bg-[#121833] py-2.5 px-6 lg:px-12 text-xs font-mono transition-colors">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-2 text-slate-600 dark:text-slate-400">
            <span>Global Tuner Network</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span>DACH Region</span>
            <span className="text-slate-300 dark:text-slate-600">/</span>
            <span className="text-[#0213B2] dark:text-[#60A5FA] font-bold">Apex Dynamics Motorsport</span>
          </div>
          <div className="hidden sm:flex items-center space-x-4">
            <span className="inline-flex items-center gap-1.5 text-[#0213B2] dark:text-[#60A5FA] font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#0213B2] dark:bg-[#60A5FA] animate-pulse"></span>
              6 Active CAD Bays Online
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-slate-500 dark:text-slate-400">Latency: 18ms Telemetry Link</span>
          </div>
        </div>
      </div>

      {/* Hero Header Area */}
      <section className="relative bg-gradient-to-r from-[#E8EDFF] via-[#EEF2FF] to-[#D7E1FF] dark:from-[#121833] dark:via-[#14151D] dark:to-[#0B0C10] border-b border-slate-200 dark:border-[#282A3A] py-8 lg:py-12 transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-200/80 dark:border-[#282A3A]">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-[#1B1D28] border border-slate-200 dark:border-[#282A3A] text-[#0213B2] dark:text-[#60A5FA] text-xs font-bold mb-4 font-mono shadow-xs">
                <span className="material-symbols-outlined text-[16px]">verified</span>
                <span>TÜV Certified Bay • ISO 9001:2015</span>
              </div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] dark:text-[#F8FAFC] font-['Montserrat'] tracking-tight uppercase">
                Apex Dynamics Motorsport
              </h1>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 flex flex-wrap items-center gap-2">
                <span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-[18px]">pin_drop</span>
                <span className="font-semibold text-[#111827] dark:text-[#F8FAFC]">Munich, Germany</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
                <span>6 Dedicated CAD & Dyno Bays</span>
                <span className="text-slate-300 dark:text-slate-600">•</span>
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
            <div className="p-5 rounded-2xl bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] shadow-xs" data-preserve-white="true">
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Completed Builds</div>
              <div className="text-2xl lg:text-3xl font-extrabold font-['Montserrat'] text-[#0213B2] dark:text-[#60A5FA] mt-1">412+</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#0213B2] dark:text-[#60A5FA]">verified</span>
                <span>Verified Platform Logged</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] shadow-xs" data-preserve-white="true">
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Fitment Rate</div>
              <div className="text-2xl lg:text-3xl font-extrabold font-['Montserrat'] text-emerald-600 dark:text-emerald-400 mt-1">99.9%</div>
              <div className="text-xs text-emerald-700 dark:text-emerald-400 font-semibold mt-1.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Zero-Rub Kinematic Guarantee</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] shadow-xs" data-preserve-white="true">
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Volume Transacted</div>
              <div className="text-2xl lg:text-3xl font-extrabold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC] mt-1">€2.4M</div>
              <div className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#0213B2] dark:text-[#60A5FA]">account_balance</span>
                <span>Escrow Secured Pipeline</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] shadow-xs" data-preserve-white="true">
              <div className="text-[10px] font-mono text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Avg Turnaround</div>
              <div className="text-2xl lg:text-3xl font-extrabold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC] mt-1">48h</div>
              <div className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1.5 flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-slate-400">timer</span>
                <span>Staged Track Conversions</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Workshop Specializations */}
      <section className="py-12 bg-[#F3F5FA] dark:bg-[#0B0C10] transition-colors">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex items-center justify-between mb-8 pb-3 border-b border-slate-200 dark:border-[#282A3A]">
            <div>
              <span className="text-xs text-[#0213B2] dark:text-[#60A5FA] tracking-widest uppercase font-mono font-bold">Core Capabilities</span>
              <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC] uppercase mt-1">
                Workshop Specializations
              </h2>
            </div>
            <span className="hidden md:inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0213B2]/10 dark:bg-[#0213B2]/30 text-xs font-mono text-[#0213B2] dark:text-[#60A5FA] border border-[#0213B2]/20 font-bold">
              <span className="material-symbols-outlined text-[16px]">shield</span>
              <span>TÜV Teilegutachten Integration</span>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white dark:bg-[#14151D] p-6 rounded-2xl border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] transition-all flex flex-col justify-between shadow-xs hover:shadow-md" data-preserve-white="true">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0213B2]/10 dark:bg-[#0213B2]/30 border border-[#0213B2]/20 flex items-center justify-center text-[#0213B2] dark:text-[#60A5FA]">
                  <span className="material-symbols-outlined">car_repair</span>
                </div>
                <h3 className="text-sm font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC] uppercase">Body Modification</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Custom carbon widebody integration, aerodynamic CFD alignment, bespoke dry carbon splitters, and swan-neck wings.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#282A3A] flex items-center justify-between text-xs text-[#0213B2] dark:text-[#60A5FA] font-semibold">
                <span>Laser Kinematic Fitting</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#14151D] p-6 rounded-2xl border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] transition-all flex flex-col justify-between shadow-xs hover:shadow-md" data-preserve-white="true">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0213B2]/10 dark:bg-[#0213B2]/30 border border-[#0213B2]/20 flex items-center justify-center text-[#0213B2] dark:text-[#60A5FA]">
                  <span className="material-symbols-outlined">speed</span>
                </div>
                <h3 className="text-sm font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC] uppercase">Performance Upgrade</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Stage 1-3 ECU/TCU dyno calibration, titanium exhaust architectures, KW coilover telemetry tuning, Brembo carbon ceramics.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#282A3A] flex items-center justify-between text-xs text-[#0213B2] dark:text-[#60A5FA] font-semibold">
                <span>AWD Dyno Cell 1500HP</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#14151D] p-6 rounded-2xl border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] transition-all flex flex-col justify-between shadow-xs hover:shadow-md" data-preserve-white="true">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0213B2]/10 dark:bg-[#0213B2]/30 border border-[#0213B2]/20 flex items-center justify-center text-[#0213B2] dark:text-[#60A5FA]">
                  <span className="material-symbols-outlined">format_paint</span>
                </div>
                <h3 className="text-sm font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC] uppercase">Wrap & Surface Protection</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Full-vehicle stealth matte PPF, bespoke color-shift vinyl wraps, self-healing coatings, and multi-stage ceramic sealing.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#282A3A] flex items-center justify-between text-xs text-[#0213B2] dark:text-[#60A5FA] font-semibold">
                <span>Dust-Free Climate Bay</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>

            <div className="bg-white dark:bg-[#14151D] p-6 rounded-2xl border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] transition-all flex flex-col justify-between shadow-xs hover:shadow-md" data-preserve-white="true">
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#0213B2]/10 dark:bg-[#0213B2]/30 border border-[#0213B2]/20 flex items-center justify-center text-[#0213B2] dark:text-[#60A5FA]">
                  <span className="material-symbols-outlined">inventory_2</span>
                </div>
                <h3 className="text-sm font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC] uppercase">Premium Sourcing</h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                  Apex Forged Wheels, BBS Motorsport, Akrapovič titanium systems, Recaro carbon buckets with TÜV homologation dossiers.
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-slate-100 dark:border-[#282A3A] flex items-center justify-between text-xs text-[#0213B2] dark:text-[#60A5FA] font-semibold">
                <span>Tier-1 Direct Supply</span>
                <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Transformations */}
      <section className="py-12 bg-white dark:bg-[#0B0C10] border-y border-slate-200 dark:border-[#282A3A] transition-colors" data-preserve-white="true">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 pb-4 border-b border-slate-100 dark:border-[#282A3A]">
            <div>
              <span className="text-xs text-[#0213B2] dark:text-[#60A5FA] tracking-widest uppercase font-mono font-bold">Featured Transformations</span>
              <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC] uppercase mt-1">
                Before & After CAD Showcase
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">
                Real client vehicles modeled in Virtual Tune and assembled with zero fitment deviation.
              </p>
            </div>
            <div className="mt-4 md:mt-0 flex items-center gap-3">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-xs font-mono text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-bold">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                Real Photo Verification Confirmed
              </span>
            </div>
          </div>

          <div className="space-y-8">
            {/* Build 01 */}
            <div className="bg-slate-50 dark:bg-[#14151D] rounded-2xl border border-slate-200 dark:border-[#282A3A] overflow-hidden shadow-xs hover:border-[#0213B2]/50 dark:hover:border-[#60A5FA]/50 transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 relative bg-slate-100 dark:bg-[#10121A] flex items-center justify-center p-3 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-[#282A3A]">
                  <div className="relative w-full overflow-hidden rounded-xl">
                    <img alt="Porsche 911 Carrera (991) transformation before and after" className="w-full h-auto object-cover rounded-xl" src="/images/cars/porsche-911-carrera.webp" loading="lazy" />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#0B0C10]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-[#111827] dark:text-[#F8FAFC] border border-slate-200 dark:border-[#282A3A] font-mono font-bold">
                      TELEMETRY ID: #CARRERA-991-718
                    </div>
                    <div className="absolute bottom-3 right-3 bg-emerald-500/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-white font-mono font-bold shadow-xs">
                      100% CAD SWEPT MATCH
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between bg-white dark:bg-[#14151D]" data-preserve-white="true">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#0213B2] dark:text-[#60A5FA] mb-2 font-mono">
                      <span className="uppercase tracking-wider font-bold">Build 01 • Staged Conversion</span>
                      <span className="bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800 font-bold">TÜV Approved</span>
                    </div>
                    <h3 className="font-['Montserrat'] text-base sm:text-lg font-bold text-[#111827] dark:text-[#F8FAFC] uppercase leading-tight">
                      Porsche 911 Carrera (991) — Carbon Aero & Forged Wheels
                    </h3>
                    <div className="mt-5 space-y-2.5 bg-slate-50 dark:bg-[#1B1D28] p-4 rounded-xl border border-slate-200 dark:border-[#282A3A] font-mono text-xs">
                      <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-[#282A3A]">
                        <span className="text-slate-500 dark:text-slate-400">Aero Package:</span>
                        <span className="text-[#111827] dark:text-[#F8FAFC] font-semibold text-right">Manthey Carbon Aero + Active Wing</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-[#282A3A]">
                        <span className="text-slate-500 dark:text-slate-400">Wheel Assembly:</span>
                        <span className="text-[#111827] dark:text-[#F8FAFC] font-semibold text-right">20"/21" Centerlock Forged</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-[#282A3A]">
                        <span className="text-slate-500 dark:text-slate-400">Braking System:</span>
                        <span className="text-[#111827] dark:text-[#F8FAFC] font-semibold text-right">PCCB 410mm Carbon Ceramic</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Kinematic Verification:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-right">100% CAD Swept Clearance Validated</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#282A3A] flex items-center justify-between">
                    <span className="text-xs text-[#0213B2] dark:text-[#60A5FA] font-mono font-bold">BOM TOTAL: €28,450.00</span>
                    <Link to="/configurator" className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#1B1D28] hover:bg-[#EEF2FF] dark:hover:bg-[#262938] text-slate-700 dark:text-slate-200 hover:text-[#0213B2] dark:hover:text-[#60A5FA] text-xs font-['Montserrat'] font-bold transition-all border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2] inline-flex items-center gap-2 shadow-xs cursor-pointer">
                      <span className="material-symbols-outlined text-[16px] text-[#0213B2] dark:text-[#60A5FA]">view_in_ar</span>
                      <span>Load CAD Telemetry</span>
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            {/* Build 02 */}
            <div className="bg-slate-50 dark:bg-[#14151D] rounded-2xl border border-slate-200 dark:border-[#282A3A] overflow-hidden shadow-xs hover:border-[#0213B2]/50 dark:hover:border-[#60A5FA]/50 transition-all">
              <div className="grid grid-cols-1 lg:grid-cols-12">
                <div className="lg:col-span-7 relative bg-slate-100 dark:bg-[#10121A] flex items-center justify-center p-3 border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-[#282A3A]">
                  <div className="relative w-full overflow-hidden rounded-xl">
                    <img alt="Lamborghini Aventador LP700 transformation" className="w-full h-auto object-cover rounded-xl" src="/images/cars/lamborghini-aventador.webp" loading="lazy" />
                    <div className="absolute top-3 left-3 bg-white/90 dark:bg-[#0B0C10]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-[#111827] dark:text-[#F8FAFC] border border-slate-200 dark:border-[#282A3A] font-mono font-bold">
                      TELEMETRY ID: #AVENTADOR-LP700-4
                    </div>
                    <div className="absolute bottom-3 right-3 bg-[#0213B2]/90 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-white font-mono font-bold shadow-xs">
                      SURFACE THICKNESS 8.5 MIL SPEC
                    </div>
                  </div>
                </div>
                <div className="lg:col-span-5 p-6 lg:p-8 flex flex-col justify-between bg-white dark:bg-[#14151D]" data-preserve-white="true">
                  <div>
                    <div className="flex items-center justify-between text-xs text-[#0213B2] dark:text-[#60A5FA] mb-2 font-mono">
                      <span className="uppercase tracking-wider font-bold">Build 02 • Stealth Satin & Aero</span>
                      <span className="bg-[#0213B2]/10 dark:bg-[#0213B2]/30 text-[#0213B2] dark:text-[#60A5FA] px-2 py-0.5 rounded-full border border-[#0213B2]/20 font-bold">Completed in 3.5 Days</span>
                    </div>
                    <h3 className="font-['Montserrat'] text-base sm:text-lg font-bold text-[#111827] dark:text-[#F8FAFC] uppercase leading-tight">
                      Lamborghini Aventador LP700-4 — Stealth Satin & Aero
                    </h3>
                    <div className="mt-5 space-y-2.5 bg-slate-50 dark:bg-[#1B1D28] p-4 rounded-xl border border-slate-200 dark:border-[#282A3A] font-mono text-xs">
                      <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-[#282A3A]">
                        <span className="text-slate-500 dark:text-slate-400">Finish & Coating:</span>
                        <span className="text-[#111827] dark:text-[#F8FAFC] font-semibold text-right">Satin Deep Navy PPF + 9H Ceramic</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-[#282A3A]">
                        <span className="text-slate-500 dark:text-slate-400">Aero Components:</span>
                        <span className="text-[#111827] dark:text-[#F8FAFC] font-semibold text-right">Dry Carbon Splitter & Diffuser</span>
                      </div>
                      <div className="flex justify-between pb-2 border-b border-slate-200 dark:border-[#282A3A]">
                        <span className="text-slate-500 dark:text-slate-400">Wheels & Stance:</span>
                        <span className="text-[#111827] dark:text-[#F8FAFC] font-semibold text-right">Gloss Black Monobloc + H&R Lowering</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500 dark:text-slate-400">Surface Fit Tolerance:</span>
                        <span className="text-emerald-600 dark:text-emerald-400 font-bold text-right">±0.2mm Laser Trim Edge Alignment</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 pt-4 border-t border-slate-100 dark:border-[#282A3A] flex items-center justify-between">
                    <span className="text-xs text-[#0213B2] dark:text-[#60A5FA] font-mono font-bold">BOM TOTAL: €14,890.00</span>
                    <Link to="/configurator" className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-[#1B1D28] hover:bg-[#EEF2FF] dark:hover:bg-[#262938] text-slate-700 dark:text-slate-200 hover:text-[#0213B2] dark:hover:text-[#60A5FA] text-xs font-['Montserrat'] font-bold transition-all border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2] inline-flex items-center gap-2 shadow-xs cursor-pointer">
                      <span className="material-symbols-outlined text-[16px] text-[#0213B2] dark:text-[#60A5FA]">layers</span>
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
      <section className="py-12 bg-slate-50 dark:bg-[#0B0C10] border-b border-slate-200 dark:border-[#282A3A]" id="consultation-form">
        <div className="max-w-7xl mx-auto px-6 lg:px-12">
          <div className="p-8 lg:p-10 rounded-2xl bg-gradient-to-r from-[#E8EDFF] via-[#EEF2FF] to-[#D7E1FF] dark:from-[#121833] dark:via-[#14151D] dark:to-[#1B1D28] border border-slate-200 dark:border-[#282A3A] flex flex-col md:flex-row items-center justify-between gap-8 shadow-xs">
            <div className="max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-[#1B1D28] text-[#0213B2] dark:text-[#60A5FA] text-xs font-bold mb-3 border border-slate-200 dark:border-[#282A3A] font-mono shadow-xs">
                <span className="material-symbols-outlined text-[14px]">handshake</span>
                <span>Direct B2B Workshop Partnership</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC] uppercase tracking-tight">
                Dispatch Consultation or CAD Work Order to Apex Dynamics
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
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
      <footer className="bg-white dark:bg-[#0B0C10] border-t border-slate-200 dark:border-[#282A3A] py-8 px-6 lg:px-12 transition-colors">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-mono text-slate-500 dark:text-slate-400">
          <div>
            © 2025 Virtual Tune Automotive Technologies Inc. Precision CAD Fitment & Workshop Telemetry.
          </div>
          <div className="flex flex-wrap items-center gap-6">
            <Link to="/fitment" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Fitment API</Link>
            <Link to="/knowledge" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Telemetry Docs</Link>
            <Link to="/warranty" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Security & Compliance</Link>
            <Link to="/shop" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">B2B Terms</Link>
          </div>
        </div>
      </footer>

    </div>
  )
}

