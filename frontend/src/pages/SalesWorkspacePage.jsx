import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

/**
 * SalesWorkspacePage - Showroom Sales Consultation Workspace
 * Virtual Tune Automotive Precision System
 */
export default function SalesWorkspacePage() {
  const navigate = useNavigate()

  return (
    <div className="bg-[#F3F5FA] text-[#111827] font-sans antialiased min-h-[calc(100vh-4rem)] flex flex-col selection:bg-[#0213B2]/20 selection:text-[#0213B2] flex-1 w-full">
      <main className="flex-1 max-w-[1920px] w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-4rem)]">

        {/* LEFT ASIDE: Client & Vehicle Dossier */}
        <aside className="lg:col-span-3 flex flex-col gap-5 overflow-y-auto pr-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Client & Vehicle Dossier</h2>
            <span className="text-[11px] text-[#64748B] font-mono">#VT-CS-8921</span>
          </div>

          <div className="bg-[#E8EDFF] border border-[#BCC7D8] shadow-sm rounded-2xl p-5 space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-[#0213B2] text-white flex items-center justify-center font-bold font-display text-sm shadow-sm">
                AB
              </div>
              <div>
                <h3 className="font-display font-bold text-[#111827] text-base leading-tight">Alexander von Berg</h3>
                <p className="text-xs text-[#475569] mt-0.5">Munich, Germany</p>
              </div>
            </div>
            <div className="pt-2 border-t border-[#BCC7D8] flex items-center justify-between text-xs text-[#334155]">
              <span>Client Tier</span>
              <span className="text-[#0213B2] font-semibold flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">verified</span> Private Collector
              </span>
            </div>
          </div>

          <div className="bg-[#E5E8F0] dark:bg-[#14151D] border border-[#CBD5E1] dark:border-[#282A3A] shadow-sm rounded-2xl p-5 space-y-4">
            <div>
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">Staged Vehicle</span>
              <h4 className="font-display font-bold text-[#111827] dark:text-[#F8FAFC] text-lg mt-1">Porsche 911 Carrera (991)</h4>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5">Generation 991 • Agate Gray Metallic</p>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-white dark:bg-[#1B1D28] p-3 rounded-xl border border-[#CBD5E1] dark:border-[#282A3A]" data-preserve-bg="true">
                <span className="text-[10px] uppercase text-[#475569] dark:text-[#94A3B8] block">Powertrain</span>
                <span className="text-xs font-semibold text-[#111827] dark:text-[#F8FAFC] mt-0.5 block">370 HP • 3.0L TT</span>
              </div>
              <div className="bg-white dark:bg-[#1B1D28] p-3 rounded-xl border border-[#CBD5E1] dark:border-[#282A3A]" data-preserve-bg="true">
                <span className="text-[10px] uppercase text-[#475569] dark:text-[#94A3B8] block">Baseline Weight</span>
                <span className="text-xs font-semibold text-[#111827] dark:text-[#F8FAFC] mt-0.5 block">1,430 kg</span>
              </div>
            </div>
          </div>

          <div className="bg-[#E5E8F0] dark:bg-[#14151D] border border-[#CBD5E1] dark:border-[#282A3A] shadow-sm rounded-2xl p-5 space-y-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#475569] dark:text-[#94A3B8]">Consultation Objective</span>
            <div className="flex items-center gap-2 text-[#111827] dark:text-[#F8FAFC] font-medium text-sm">
              <span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-base">speed</span>
              <span>Track Pace & Weight Reduction</span>
            </div>
            <p className="text-xs text-[#475569] dark:text-[#CBD5E1] leading-relaxed">
              Optimized for aerodynamic stability and unsprung weight reduction on circuit configurations.
            </p>
          </div>

          <div className="bg-[#E8EDFF] border border-[#BCC7D8] shadow-sm rounded-2xl p-5 space-y-3 mt-auto">
            <div className="flex justify-between items-baseline">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-[#06169B]">Allocated Budget</span>
              <span className="font-display font-bold text-[#111827] text-sm">€25,000 – €35,000</span>
            </div>
            <div className="w-full bg-[#CBD5E1] h-2 rounded-full overflow-hidden p-0.5">
              <div className="bg-[#0213B2] h-full rounded-full" style={{ width: "68%" }}></div>
            </div>
            <div className="flex justify-between text-xs text-[#475569]">
              <span>Staged Build Total</span>
              <span className="text-[#0213B2] font-bold">€23,401.35</span>
            </div>
          </div>
        </aside>

        {/* CENTER VIEWPORT: Showcase CAD / Staging */}
        <section className="lg:col-span-6 flex flex-col bg-[#E5E8F0] dark:bg-[#14151D] border border-[#CBD5E1] dark:border-[#282A3A] rounded-2xl overflow-hidden relative shadow-sm">
          <div className="p-4 flex items-center justify-between border-b border-[#CBD5E1] dark:border-[#282A3A] z-10 bg-[#E5E8F0]/95 dark:bg-[#14151D]/95 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#475569] dark:text-[#CBD5E1]">Perspective:</span>
              <div className="flex items-center bg-white dark:bg-[#1B1D28] p-1 rounded-xl border border-[#CBD5E1] dark:border-[#282A3A]" data-preserve-bg="true">
                <button className="px-3 py-1 rounded-lg text-xs font-medium bg-[#0213B2] text-white shadow-sm cursor-pointer">Front 3/4</button>
                <button className="px-3 py-1 rounded-lg text-xs font-medium text-[#475569] hover:text-[#0213B2] hover:bg-white transition cursor-pointer">Side Profile</button>
                <button className="px-3 py-1 rounded-lg text-xs font-medium text-[#475569] hover:text-[#0213B2] hover:bg-white transition cursor-pointer">Rear Aero</button>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs text-[#64748B]">
              <Link to="/configurator" className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-[#EEF2FF] hover:bg-[#0213B2] hover:text-white text-xs font-mono text-[#0213B2] border border-[#0213B2]/20 transition-all cursor-pointer">
                <span className="material-symbols-outlined text-sm">view_in_ar</span>
                <span>3D CAD Studio Mode</span>
              </Link>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                <span className="text-[#475569]">Showroom Presentation</span>
              </div>
            </div>
          </div>

          <div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#0F172A]">
            <img className="w-full h-full object-cover select-none" data-alt="Configured Porsche 911 Carrera (991) with aero pack" src="/images/sales-porsche-gt3.jpg" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/70 via-transparent to-transparent pointer-events-none"></div>

            <div className="absolute top-[44%] left-[22%] z-20 group cursor-pointer">
              <div className="relative flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0213B2] opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#0213B2] text-white text-[10px] font-bold items-center justify-center shadow-lg">1</span>
                </span>
                <div className="bg-white/95 backdrop-blur-md border border-[#E2E8F0] px-3 py-2 rounded-xl shadow-lg">
                  <div className="text-xs font-semibold text-[#111827]">Dry Carbon Aero Package</div>
                  <div className="text-[11px] text-[#0213B2] font-mono mt-0.5">+28kg downforce @ 200 km/h</div>
                </div>
              </div>
            </div>

            <div className="absolute bottom-[28%] right-[28%] z-20 group cursor-pointer">
              <div className="relative flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#0213B2] opacity-60"></span>
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-[#0213B2] text-white text-[10px] font-bold items-center justify-center shadow-lg">2</span>
                </span>
                <div className="bg-white/95 backdrop-blur-md border border-[#E2E8F0] px-3 py-2 rounded-xl shadow-lg">
                  <div className="text-xs font-semibold text-[#111827]">Apex Sprint Forged 20"/21"</div>
                  <div className="text-[11px] text-[#16A34A] font-mono mt-0.5">-15.2 kg unsprung mass</div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 bg-white border-t border-[#E2E8F0] flex items-center justify-center">
            <div className="flex items-center gap-4 bg-[#F8FAFC] px-6 py-2.5 rounded-full border border-[#E2E8F0]">
              <span className="text-xs font-medium text-[#64748B]">Stock Baseline</span>
              <input className="w-48 h-1.5 bg-[#CBD5E1] rounded-lg appearance-none cursor-pointer accent-[#0213B2]" max="100" min="0" type="range" defaultValue="65" />
              <span className="text-xs font-bold text-[#0213B2]">Track Pac Stage 1</span>
            </div>
          </div>
        </section>

        {/* RIGHT ASIDE: Active Build & Quotation */}
        <aside className="lg:col-span-3 flex flex-col gap-5 overflow-y-auto pl-1">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-[#64748B]">Active Build & Quotation</h2>
            <span className="px-2 py-0.5 rounded-md bg-[#DCFCE7] text-[#16A34A] text-[10px] font-semibold border border-[#16A34A]/20">Active</span>
          </div>

          <div className="bg-[#E8EDFF] border-2 border-[#0213B2]/30 rounded-2xl p-5 space-y-1 relative overflow-hidden shadow-sm">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#0213B2]">Selected Bundle</span>
            <h3 className="font-display font-bold text-[#111827] text-lg">Track Pac Stage 1</h3>
            <p className="text-xs text-[#475569]">Complete aerodynamic and lightweight wheel homologation</p>
          </div>

          <div className="space-y-2.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#64748B]">Configured Components</span>
            <div className="space-y-2">
              <div className="p-3.5 rounded-xl bg-white dark:bg-[#1B1D28] border border-[#CBD5E1] dark:border-[#282A3A] flex items-center justify-between shadow-xs" data-preserve-bg="true">
                <div>
                  <div className="text-xs font-semibold text-[#111827] dark:text-[#F8FAFC]">Dry Carbon Aero Splitter</div>
                  <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] mt-0.5">Dual front dive planes</div>
                </div>
                <span className="text-xs font-bold font-mono text-[#111827] dark:text-[#F8FAFC]">€2,450</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#1B1D28] border border-[#CBD5E1] dark:border-[#282A3A] flex items-center justify-between shadow-xs" data-preserve-bg="true">
                <div>
                  <div className="text-xs font-semibold text-[#111827] dark:text-[#F8FAFC]">GT3 Swan-Neck Wing</div>
                  <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] mt-0.5">Carbon fiber high-downforce blade</div>
                </div>
                <span className="text-xs font-bold font-mono text-[#111827] dark:text-[#F8FAFC]">€3,800</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#1B1D28] border border-[#CBD5E1] dark:border-[#282A3A] flex items-center justify-between shadow-xs" data-preserve-bg="true">
                <div>
                  <div className="text-xs font-semibold text-[#111827] dark:text-[#F8FAFC]">Apex Forged Sprint Wheels</div>
                  <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] mt-0.5">20" / 21" Centerlock fitment</div>
                </div>
                <span className="text-xs font-bold font-mono text-[#111827] dark:text-[#F8FAFC]">€4,600</span>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-[#1B1D28] border border-[#CBD5E1] dark:border-[#282A3A] flex items-center justify-between shadow-xs" data-preserve-bg="true">
                <div>
                  <div className="text-xs font-semibold text-[#111827] dark:text-[#F8FAFC]">Michelin Pilot Sport Cup 2 R</div>
                  <div className="text-[11px] text-[#475569] dark:text-[#94A3B8] mt-0.5">Complete track compound set</div>
                </div>
                <span className="text-xs font-bold font-mono text-[#111827] dark:text-[#F8FAFC]">€2,150</span>
              </div>
            </div>
          </div>

          <div className="bg-[#E5E8F0] dark:bg-[#14151D] border border-[#CBD5E1] dark:border-[#282A3A] rounded-2xl p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] shadow-sm"></span>
              <span className="text-xs font-medium text-[#111827] dark:text-[#F8FAFC]">TÜV Approved</span>
            </div>
            <span className="text-xs font-semibold text-[#16A34A]">Road Legal</span>
          </div>

          <div className="bg-[#D7E1FF] border border-[#BCC7D8] rounded-2xl p-5 space-y-4 mt-auto shadow-md">
            <div className="flex items-baseline justify-between">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#06169B] block">Total Investment</span>
                <span className="text-[10px] text-[#475569]">Incl. installation, setup & VAT</span>
              </div>
              <div className="font-display font-extrabold text-2xl text-[#06169B] font-mono tracking-tight">
                €23,401.35
              </div>
            </div>
            <button
              type="button"
              onClick={() => navigate('/quotation')}
              className="w-full py-3 px-4 rounded-xl bg-[#0213B2] hover:bg-[#0115BC] active:bg-[#06169B] text-white font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-150 shadow-md shadow-[#0213B2]/20 cursor-pointer"
            >
              <span className="material-symbols-outlined text-base font-bold">request_quote</span>
              <span>Generate Customer Quote</span>
            </button>
          </div>
        </aside>
      </main>
      <div id="snapdom-sandbox" data-snapdom-sandbox="true" aria-hidden="true" style={{ position: "absolute", left: "-9999px", top: "-9999px", width: "0px", height: "0px", overflow: "hidden" }}></div>
    </div>
  )
}
