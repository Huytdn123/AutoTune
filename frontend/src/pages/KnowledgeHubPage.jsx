import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

/**
 * KnowledgeHubPage - Technical Knowledge & Engineering Support Hub
 * Virtual Tune Automotive Precision System
 * Redesigned with complete dark/light mode tokens, interactive topic cards, telemetry bulletin, and tolerance tables.
 */
export default function KnowledgeHubPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-[#F3F5FA] dark:bg-[#0B0C10] text-[#111827] dark:text-[#F8FAFC] antialiased overflow-x-hidden selection:bg-[#0213B2]/20 selection:text-[#0213B2] min-h-[calc(100vh-4rem)] flex flex-col flex-1 w-full font-sans transition-colors duration-200">
      
      {/* Top Banner */}
      <section className="bg-white dark:bg-[#14151D] border-b border-slate-200 dark:border-[#282A3A] px-4 md:px-8 py-8 shadow-xs" data-preserve-white="true">
        <div className="max-w-6xl mx-auto space-y-2.5">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EEF2FF] dark:bg-[#1E293B] border border-[#0213B2]/20 dark:border-blue-900/40 text-[#0213B2] dark:text-[#60A5FA] text-xs font-semibold">
            <span className="material-symbols-outlined text-[15px]">verified</span>
            <span>Engineering & Compliance Documentation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F8FAFC] font-display tracking-tight">
            Technical Knowledge Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] max-w-2xl leading-relaxed">
            Verified engineering guidelines, fitment standards, kinematics analysis, and homologation protocols across all supported automotive platforms.
          </p>
        </div>
      </section>

      <main className="flex-1 p-4 md:p-8 max-w-6xl mx-auto w-full space-y-8">
        
        {/* Knowledge Topic Cards */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <div className="p-5 rounded-2xl bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group shadow-sm" data-preserve-white="true">
              <div className="mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] dark:bg-[#1E293B] border border-[#0213B2]/20 dark:border-blue-900/40 flex items-center justify-center text-[#0213B2] dark:text-[#60A5FA] mb-3">
                  <span className="material-symbols-outlined text-xl">speed</span>
                </div>
                <h3 className="font-display text-sm text-[#111827] dark:text-[#F8FAFC] font-bold mb-1">Automotive Upgrade Guides</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">148 Stage 1-3 dyno & ECU protocols</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#282A3A]">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#EEF2FF] dark:bg-[#1E293B] text-[#0213B2] dark:text-[#60A5FA] font-semibold">148 Guides</span>
                <span className="material-symbols-outlined text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#0213B2] dark:group-hover:text-white transition-colors text-[18px]">arrow_forward</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group shadow-sm" data-preserve-white="true">
              <div className="mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] dark:bg-[#1E293B] border border-[#0213B2]/20 dark:border-blue-900/40 flex items-center justify-center text-[#0213B2] dark:text-[#60A5FA] mb-3">
                  <span className="material-symbols-outlined text-xl">fact_check</span>
                </div>
                <h3 className="font-display text-sm text-[#111827] dark:text-[#F8FAFC] font-bold mb-1">Fitment & Kinematics</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">Scrub radius, PCD tolerances, offset clearance</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#282A3A]">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#EEF2FF] dark:bg-[#1E293B] text-[#0213B2] dark:text-[#60A5FA] font-semibold">2,400+ Specs</span>
                <span className="material-symbols-outlined text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#0213B2] dark:group-hover:text-white transition-colors text-[18px]">arrow_forward</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group shadow-sm" data-preserve-white="true">
              <div className="mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] dark:bg-[#1E293B] border border-[#0213B2]/20 dark:border-blue-900/40 flex items-center justify-center text-[#0213B2] dark:text-[#60A5FA] mb-3">
                  <span className="material-symbols-outlined text-xl">build</span>
                </div>
                <h3 className="font-display text-sm text-[#111827] dark:text-[#F8FAFC] font-bold mb-1">Installation SOPs</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">18 torque sequences, sensor recalibration</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#282A3A]">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#EEF2FF] dark:bg-[#1E293B] text-[#0213B2] dark:text-[#60A5FA] font-semibold">18 SOPs</span>
                <span className="material-symbols-outlined text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#0213B2] dark:group-hover:text-white transition-colors text-[18px]">arrow_forward</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group shadow-sm" data-preserve-white="true">
              <div className="mb-4">
                <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] dark:bg-[#1E293B] border border-[#0213B2]/20 dark:border-blue-900/40 flex items-center justify-center text-[#0213B2] dark:text-[#60A5FA] mb-3">
                  <span className="material-symbols-outlined text-xl">verified_user</span>
                </div>
                <h3 className="font-display text-sm text-[#111827] dark:text-[#F8FAFC] font-bold mb-1">TÜV & Legal Regulations</h3>
                <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">ECE R124, §19.3 road legal guidelines</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-[#282A3A]">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#EEF2FF] dark:bg-[#1E293B] text-[#0213B2] dark:text-[#60A5FA] font-semibold">360+ Certs</span>
                <span className="material-symbols-outlined text-[#64748B] dark:text-[#94A3B8] group-hover:text-[#0213B2] dark:group-hover:text-white transition-colors text-[18px]">arrow_forward</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Technical Bulletin */}
        <section className="rounded-2xl bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] overflow-hidden shadow-sm" data-preserve-white="true">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 relative min-h-[260px] bg-[#0F172A] overflow-hidden">
              <img alt="Dynamic Camber & Thermal Analysis" className="w-full h-full object-cover object-center" src="/images/cars/porsche-911-carrera.webp" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-4 left-4 text-white font-mono text-[10px] bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                CAD Dynamic Stress Analysis
              </div>
            </div>
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded-md text-[11px] font-mono uppercase bg-[#EEF2FF] dark:bg-[#1E293B] text-[#0213B2] dark:text-[#60A5FA] font-bold border border-[#0213B2]/20 dark:border-blue-900/40">
                    Featured Technical Bulletin
                  </span>
                  <span className="text-[#64748B] dark:text-[#94A3B8] text-xs font-mono">TB-2025-088</span>
                </div>
                <h2 className="font-display text-lg sm:text-xl text-[#111827] dark:text-[#F8FAFC] font-bold">
                  Dynamic Camber Gain & Caliper Thermal Dissipation under Nürburgring Curb Load
                </h2>
                <p className="text-xs sm:text-sm text-[#64748B] dark:text-[#94A3B8] leading-relaxed">
                  Comprehensive telemetry assessment of monobloc 6-piston carbon-ceramic caliper radial expansion under sustained 1.8G lateral curb strikes. Includes kinematic multi-link deflection tables and ET offset correction protocols for track setups.
                </p>
              </div>
              <div className="flex items-center justify-between pt-5 border-t border-slate-100 dark:border-[#282A3A] mt-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#EEF2FF] dark:bg-[#1E293B] border border-[#0213B2]/20 dark:border-blue-900/40 flex items-center justify-center font-mono text-[11px] text-[#0213B2] dark:text-[#60A5FA] font-bold">
                    MV
                  </div>
                  <span className="text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">Dr.-Ing. M. Voss (Apex Dynamics R&D)</span>
                </div>
                <Link to="/fitment" className="inline-flex items-center gap-1.5 text-[#0213B2] dark:text-[#60A5FA] hover:underline font-bold text-xs transition-colors cursor-pointer">
                  <span>Verify Fitment Matrix</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Common Platform Tolerances Table */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-sm sm:text-base text-[#111827] dark:text-[#F8FAFC] font-bold">
              Common Platform Tolerances
            </h2>
            <span className="text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8]">
              Reference: Engineering Fitment Verification (PCD • Offset • Clearance)
            </span>
          </div>
          <div className="rounded-2xl bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] overflow-hidden shadow-sm" data-preserve-white="true">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-[#282A3A] text-[#0213B2] dark:text-[#60A5FA] text-[11px] uppercase tracking-wider bg-[#F8FAFC] dark:bg-[#1A1C26]">
                    <th className="py-3.5 px-6 font-bold">Platform / Chassis</th>
                    <th className="py-3.5 px-6 font-bold">Wheel Dimension</th>
                    <th className="py-3.5 px-6 font-bold">Offset Target</th>
                    <th className="py-3.5 px-6 text-right font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-[#282A3A] text-[#475569] dark:text-[#CBD5E1]">
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Porsche 911 Carrera (991)</span>
                    </td>
                    <td className="py-3.5 px-6 text-[#64748B] dark:text-[#94A3B8]">20x8.5J (F) / 20x11.5J (R)</td>
                    <td className="py-3.5 px-6 text-[#64748B] dark:text-[#94A3B8]">ET45 / ET45</td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold uppercase">Verified</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Ferrari 458 Italia</span>
                    </td>
                    <td className="py-3.5 px-6 text-[#64748B] dark:text-[#94A3B8]">20x9.0J (F) / 21x12.0J (R)</td>
                    <td className="py-3.5 px-6 text-[#64748B] dark:text-[#94A3B8]">ET25 / ET22</td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold uppercase">Verified</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Lamborghini Aventador LP700</span>
                    </td>
                    <td className="py-3.5 px-6 text-[#64748B] dark:text-[#94A3B8]">19x9.0J (F) / 20x12.0J (R)</td>
                    <td className="py-3.5 px-6 text-[#64748B] dark:text-[#94A3B8]">ET38 / ET35</td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold uppercase">Verified</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                      <span>Nissan GT-R R35 Nismo</span>
                    </td>
                    <td className="py-3.5 px-6 text-[#64748B] dark:text-[#94A3B8]">20x10.0J (F) / 20x12.0J (R)</td>
                    <td className="py-3.5 px-6 text-[#64748B] dark:text-[#94A3B8]">ET41 / ET25</td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 font-bold uppercase">Verified</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <footer className="pt-6 pb-10 border-t border-slate-200 dark:border-[#282A3A] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#64748B] dark:text-[#94A3B8] font-mono text-xs">
          <div>Virtual Tune OS © 2026 Automotive Technologies Inc.</div>
          <div className="flex items-center gap-6">
            <a className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors" href="#">ISO 9001:2015</a>
            <a className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors" href="#">TÜV Rheinland Partner</a>
            <Link to="/fitment" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">CAD Fitment API</Link>
          </div>
        </footer>

      </main>
    </div>
  )
}
