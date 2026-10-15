import React from 'react'

/**
 * DashboardActiveBays - Workshop floor active bays 01-04 status and live telemetry
 */
export default function DashboardActiveBays({ onRefresh }) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0213B2]/10 dark:bg-[#0213B2]/30 border border-[#0213B2]/20 flex items-center justify-center text-[#0213B2] dark:text-[#60A5FA]">
            <span className="material-symbols-outlined text-xl">precision_manufacturing</span>
          </div>
          <div>
            <h2 className="text-lg font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC]">
              Active Workshop Floor Status
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Real-time telemetry and build progress across designated technician stations
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider hidden sm:inline">Live Sync</span>
          <button 
            onClick={onRefresh}
            className="p-2 bg-white dark:bg-[#14151D] rounded-xl border border-slate-200 dark:border-[#282A3A] text-slate-600 dark:text-slate-300 hover:text-[#0213B2] dark:hover:text-[#60A5FA] hover:border-[#0213B2] transition-all cursor-pointer shadow-xs"
            title="Refresh dashboard data"
          >
            <span className="material-symbols-outlined text-base">refresh</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

        {/* Bay 01 */}
        <div className="bg-white dark:bg-[#14151D] rounded-2xl border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2]/50 p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all" data-preserve-white="true">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#282A3A]">
              <span className="text-xs font-mono font-bold text-[#0213B2] dark:text-[#60A5FA] tracking-wider uppercase">
                Bay 01
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-[#0213B2]/10 dark:bg-[#0213B2]/30 text-[#0213B2] dark:text-[#60A5FA] border border-[#0213B2]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#0213B2] dark:bg-[#60A5FA] animate-pulse"></span>
                In-Progress
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC]">
                Porsche 911 Carrera (991)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Forged Wheel Fitment & Alignment
              </p>
            </div>

            <div className="mt-4 space-y-2 bg-slate-50 dark:bg-[#1B1D28] p-3 rounded-xl border border-slate-100 dark:border-[#282A3A] text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Advisor:</span>
                <span className="text-[#111827] dark:text-[#F8FAFC] font-medium">Marcus Vance</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Lead Tech:</span>
                <span className="text-[#0213B2] dark:text-[#60A5FA] font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">build</span>
                  Torben Müller
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#282A3A]">
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Stage 3: Caliper Clearance</span>
              <span className="text-[#0213B2] dark:text-[#60A5FA] font-bold">65%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#282A3A] h-2 rounded-full overflow-hidden">
              <div className="bg-[#0213B2] dark:bg-[#60A5FA] h-full rounded-full transition-all duration-500" style={{ width: "65%" }}></div>
            </div>
            <div className="flex justify-between items-center mt-3 text-xs font-mono">
              <span className="text-slate-400">ETA to Dyno:</span>
              <span className="text-[#111827] dark:text-[#F8FAFC] font-semibold">14:30 Today</span>
            </div>
          </div>
        </div>

        {/* Bay 02 */}
        <div className="bg-white dark:bg-[#14151D] rounded-2xl border border-slate-200 dark:border-[#282A3A] hover:border-amber-500/50 p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all" data-preserve-white="true">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#282A3A]">
              <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 tracking-wider uppercase">
                Bay 02
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
                Dyno Staging
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC]">
                BMW Vision ConnectedDrive
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Carbon Aero Kit & Power Remap
              </p>
            </div>

            <div className="mt-4 space-y-2 bg-slate-50 dark:bg-[#1B1D28] p-3 rounded-xl border border-slate-100 dark:border-[#282A3A] text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Advisor:</span>
                <span className="text-[#111827] dark:text-[#F8FAFC] font-medium">Sarah Jenkins</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Lead Tech:</span>
                <span className="text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">build</span>
                  David Zhao
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#282A3A]">
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Stage 4: ECU Flash Map</span>
              <span className="text-amber-600 dark:text-amber-400 font-bold">85%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#282A3A] h-2 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full transition-all duration-500" style={{ width: "85%" }}></div>
            </div>
            <div className="flex justify-between items-center mt-3 text-xs font-mono">
              <span className="text-slate-400">ETA to Dyno:</span>
              <span className="text-[#111827] dark:text-[#F8FAFC] font-semibold">16:15 Today</span>
            </div>
          </div>
        </div>

        {/* Bay 03 */}
        <div className="bg-white dark:bg-[#14151D] rounded-2xl border border-slate-200 dark:border-[#282A3A] hover:border-slate-400 p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all" data-preserve-white="true">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#282A3A]">
              <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 tracking-wider uppercase">
                Bay 03
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-slate-100 dark:bg-[#1B1D28] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#282A3A]">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400"></span>
                Assembly
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC]">
                Audi RS6 Avant (C8)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Akrapovič Titanium Downpipes
              </p>
            </div>

            <div className="mt-4 space-y-2 bg-slate-50 dark:bg-[#1B1D28] p-3 rounded-xl border border-slate-100 dark:border-[#282A3A] text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Advisor:</span>
                <span className="text-[#111827] dark:text-[#F8FAFC] font-medium">Marcus Vance</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Lead Tech:</span>
                <span className="text-slate-700 dark:text-slate-300 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">build</span>
                  Mateo Rossi
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#282A3A]">
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Stage 2: Header Alignment</span>
              <span className="text-slate-700 dark:text-slate-300 font-bold">40%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#282A3A] h-2 rounded-full overflow-hidden">
              <div className="bg-slate-400 h-full rounded-full transition-all duration-500" style={{ width: "40%" }}></div>
            </div>
            <div className="flex justify-between items-center mt-3 text-xs font-mono">
              <span className="text-slate-400">ETA to Dyno:</span>
              <span className="text-[#111827] dark:text-[#F8FAFC] font-semibold">11:00 Tomorrow</span>
            </div>
          </div>
        </div>

        {/* Bay 04 */}
        <div className="bg-white dark:bg-[#14151D] rounded-2xl border border-slate-200 dark:border-[#282A3A] hover:border-emerald-500/50 p-5 flex flex-col justify-between shadow-xs hover:shadow-md transition-all" data-preserve-white="true">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-[#282A3A]">
              <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-wider uppercase">
                Bay 04
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Verification
              </span>
            </div>

            <div className="mt-4">
              <h3 className="text-sm font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC]">
                Mercedes-AMG GT Black
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Ceramic Brake Upgrade & Bleed
              </p>
            </div>

            <div className="mt-4 space-y-2 bg-slate-50 dark:bg-[#1B1D28] p-3 rounded-xl border border-slate-100 dark:border-[#282A3A] text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Advisor:</span>
                <span className="text-[#111827] dark:text-[#F8FAFC] font-medium">Elena Rostova</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Lead Tech:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                  <span className="material-symbols-outlined text-xs">build</span>
                  Alex Chen
                </span>
              </div>
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-[#282A3A]">
            <div className="flex justify-between text-xs font-mono mb-1.5">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Stage 5: Pressure Testing</span>
              <span className="text-emerald-600 dark:text-emerald-400 font-bold">92%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-[#282A3A] h-2 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: "92%" }}></div>
            </div>
            <div className="flex justify-between items-center mt-3 text-xs font-mono">
              <span className="text-slate-400">ETA to Dyno:</span>
              <span className="text-[#111827] dark:text-[#F8FAFC] font-semibold">12:30 Today</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  )
}
