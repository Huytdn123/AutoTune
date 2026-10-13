import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

/**
 * KnowledgeHubPage - Technical Knowledge & Support Hub
 * Virtual Tune Automotive Precision System
 */
export default function KnowledgeHubPage() {
  const navigate = useNavigate()

  return (
    <div className="bg-[#F3F5FA] text-[#111827] antialiased overflow-x-hidden selection:bg-[#0213B2]/20 selection:text-[#0213B2] min-h-[calc(100vh-4rem)] flex flex-col flex-1 w-full font-['Inter',sans-serif]">
      
      {/* Top Banner */}
      <section className="bg-[#E8EDFF] border-b border-[#BCC7D8] px-6 py-8">
        <div className="max-w-6xl mx-auto space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D7E1FF] border border-[#0213B2]/30 text-[#0213B2] text-xs font-semibold">
            <span className="material-symbols-outlined text-[15px]">verified</span>
            <span>Engineering & Compliance Documentation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] font-['Montserrat'] tracking-tight">
            Technical Knowledge Hub
          </h1>
          <p className="text-xs sm:text-sm text-[#334155] max-w-2xl leading-relaxed">
            Verified engineering guidelines, fitment standards, kinematics analysis, and homologation protocols.
          </p>
        </div>
      </section>

      <main className="flex-1 p-6 md:p-8 max-w-6xl mx-auto w-full space-y-8">
        
        {/* Knowledge Topic Cards */}
        <section>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            <div className="p-5 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#0213B2] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group shadow-xs">
              <div className="mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#D7E1FF] border border-[#0213B2]/30 flex items-center justify-center text-[#0213B2] mb-3">
                  <span className="material-symbols-outlined text-xl">speed</span>
                </div>
                <h3 className="font-['Montserrat'] text-sm text-[#111827] font-bold mb-1">Automotive Upgrade Guides</h3>
                <p className="text-xs text-[#475569]">148 Stage 1-3 dyno & ECU protocols</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#E8EDFF] text-[#0213B2] font-semibold">148 Guides</span>
                <span className="material-symbols-outlined text-[#64748B] group-hover:text-[#0213B2] transition-colors text-[18px]">arrow_forward</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#0213B2] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group shadow-xs">
              <div className="mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#D7E1FF] border border-[#0213B2]/30 flex items-center justify-center text-[#0213B2] mb-3">
                  <span className="material-symbols-outlined text-xl">fact_check</span>
                </div>
                <h3 className="font-['Montserrat'] text-sm text-[#111827] font-bold mb-1">Fitment & Kinematics</h3>
                <p className="text-xs text-[#475569]">Scrub radius, PCD tolerances, offset clearance</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#E8EDFF] text-[#0213B2] font-semibold">2,400+ Specs</span>
                <span className="material-symbols-outlined text-[#64748B] group-hover:text-[#0213B2] transition-colors text-[18px]">arrow_forward</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#0213B2] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group shadow-xs">
              <div className="mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#D7E1FF] border border-[#0213B2]/30 flex items-center justify-center text-[#0213B2] mb-3">
                  <span className="material-symbols-outlined text-xl">build</span>
                </div>
                <h3 className="font-['Montserrat'] text-sm text-[#111827] font-bold mb-1">Installation SOPs</h3>
                <p className="text-xs text-[#475569]">18 torque sequences, sensor recalibration</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#E8EDFF] text-[#0213B2] font-semibold">18 SOPs</span>
                <span className="material-symbols-outlined text-[#64748B] group-hover:text-[#0213B2] transition-colors text-[18px]">arrow_forward</span>
              </div>
            </div>

            <div className="p-5 rounded-xl bg-white border border-[#CBD5E1] hover:border-[#0213B2] hover:shadow-md cursor-pointer transition-all flex flex-col justify-between group shadow-xs">
              <div className="mb-4">
                <div className="w-10 h-10 rounded-lg bg-[#D7E1FF] border border-[#0213B2]/30 flex items-center justify-center text-[#0213B2] mb-3">
                  <span className="material-symbols-outlined text-xl">verified_user</span>
                </div>
                <h3 className="font-['Montserrat'] text-sm text-[#111827] font-bold mb-1">TÜV & Legal Regulations</h3>
                <p className="text-xs text-[#475569]">ECE R124, §19.3 road legal guidelines</p>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-[#E2E8F0]">
                <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-[#E8EDFF] text-[#0213B2] font-semibold">360+ Certs</span>
                <span className="material-symbols-outlined text-[#64748B] group-hover:text-[#0213B2] transition-colors text-[18px]">arrow_forward</span>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Technical Bulletin */}
        <section className="rounded-2xl bg-[#E8EDFF] border border-[#BCC7D8] overflow-hidden shadow-sm">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            <div className="lg:col-span-5 relative min-h-[260px] bg-[#CBD5E1]">
              <img alt="Dynamic Camber & Thermal Analysis" className="w-full h-full object-cover object-center" src="/images/camber-thermal-telemetry.jpg" />
            </div>
            <div className="lg:col-span-7 p-6 sm:p-8 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="px-2.5 py-0.5 rounded text-[11px] font-mono uppercase bg-[#D7E1FF] text-[#06169B] font-bold border border-[#0213B2]/30">
                    Featured Technical Bulletin
                  </span>
                  <span className="text-[#64748B] text-xs font-mono">TB-2025-088</span>
                </div>
                <h2 className="font-['Montserrat'] text-lg sm:text-xl text-[#111827] font-bold">
                  Dynamic Camber Gain & Caliper Thermal Dissipation under Nürburgring Curb Load
                </h2>
                <p className="text-xs sm:text-sm text-[#334155] leading-relaxed">
                  Comprehensive telemetry assessment of monobloc 6-piston carbon-ceramic caliper radial expansion under sustained 1.8G lateral curb strikes. Includes kinematic multi-link deflection tables and ET offset correction protocols for track setups.
                </p>
              </div>
              <div className="flex items-center justify-between pt-5 border-t border-[#BCC7D8] mt-5">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[#D7E1FF] border border-[#0213B2]/30 flex items-center justify-center font-mono text-[11px] text-[#0213B2] font-bold">
                    MV
                  </div>
                  <span className="text-xs font-mono text-[#475569]">Dr.-Ing. M. Voss (Apex Dynamics R&D)</span>
                </div>
                <a className="inline-flex items-center gap-1.5 text-[#0213B2] hover:text-[#0115BC] hover:underline font-bold text-xs transition-colors cursor-pointer" href="#">
                  <span>Read Guide</span>
                  <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Common Platform Tolerances Table */}
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-['Montserrat'] text-sm sm:text-base text-[#111827] font-bold">
              Common Platform Tolerances
            </h2>
            <span className="text-[11px] font-mono text-[#64748B]">
              Reference: Engineering Fitment Verification (PCD • Offset • Clearance)
            </span>
          </div>
          <div className="rounded-xl bg-white border border-[#CBD5E1] overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#CBD5E1] text-[#06169B] text-[11px] uppercase tracking-wider bg-[#E8EDFF]">
                    <th className="py-3.5 px-6 font-bold">Platform / Chassis</th>
                    <th className="py-3.5 px-6 font-bold">Wheel Dimension</th>
                    <th className="py-3.5 px-6 font-bold">Offset Target</th>
                    <th className="py-3.5 px-6 text-right font-bold">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E2E8F0] text-[#334155]">
                  <tr className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-[#111827] flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                      <span>Porsche 911 Carrera (991)</span>
                    </td>
                    <td className="py-3.5 px-6 text-[#475569]">20x8.5J (F) / 20x11.5J (R)</td>
                    <td className="py-3.5 px-6 text-[#475569]">ET45 / ET45</td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] bg-[#DCFCE7] border border-[#16A34A]/30 text-[#16A34A] font-bold uppercase">Verified</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-[#111827] flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                      <span>BMW Vision ConnectedDrive</span>
                    </td>
                    <td className="py-3.5 px-6 text-[#475569]">20x9.0J (F) / 20x10.0J (R)</td>
                    <td className="py-3.5 px-6 text-[#475569]">ET25 / ET22</td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] bg-[#DCFCE7] border border-[#16A34A]/30 text-[#16A34A] font-bold uppercase">Verified</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-[#111827] flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                      <span>McLaren 720S</span>
                    </td>
                    <td className="py-3.5 px-6 text-[#475569]">19x9.0J (F) / 20x11.0J (R)</td>
                    <td className="py-3.5 px-6 text-[#475569]">ET38 / ET35</td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] bg-[#DCFCE7] border border-[#16A34A]/30 text-[#16A34A] font-bold uppercase">Verified</span>
                    </td>
                  </tr>
                  <tr className="hover:bg-[#F8FAFC] transition-colors">
                    <td className="py-3.5 px-6 font-semibold text-[#111827] flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                      <span>Mercedes-AMG GT-R Pro</span>
                    </td>
                    <td className="py-3.5 px-6 text-[#475569]">19x10.0J (F) / 20x12.0J (R)</td>
                    <td className="py-3.5 px-6 text-[#475569]">ET56 / ET52</td>
                    <td className="py-3.5 px-6 text-right">
                      <span className="inline-block px-2.5 py-0.5 rounded text-[10px] bg-[#DCFCE7] border border-[#16A34A]/30 text-[#16A34A] font-bold uppercase">Verified</span>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <footer className="pt-6 pb-10 border-t border-[#CBD5E1] flex flex-col sm:flex-row items-center justify-between gap-4 text-[#64748B] font-mono text-xs">
          <div>Virtual Tune OS © 2025 Automotive Technologies Inc.</div>
          <div className="flex items-center gap-6">
            <a className="hover:text-[#0213B2] transition-colors" href="#">ISO 9001:2015</a>
            <a className="hover:text-[#0213B2] transition-colors" href="#">TÜV Rheinland Partner</a>
            <a className="hover:text-[#0213B2] transition-colors" href="#">API Documentation</a>
          </div>
        </footer>

      </main>
    </div>
  )
}
