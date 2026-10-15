import React from 'react'

/**
 * DashboardTelemetryMetrics - 4 Executive KPI telemetry cards
 */
export default function DashboardTelemetryMetrics({ metrics, formatVnd }) {
  return (
    <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* Metric 1: Monthly Revenue */}
      <div className="bg-white dark:bg-[#14151D] p-5 rounded-2xl border border-slate-200 dark:border-[#282A3A] shadow-xs hover:shadow-md transition-all flex flex-col justify-between" data-preserve-white="true">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Monthly Revenue</span>
          <div className="w-9 h-9 rounded-xl bg-[#0213B2]/10 dark:bg-[#0213B2]/30 border border-[#0213B2]/20 flex items-center justify-center text-[#0213B2] dark:text-[#60A5FA]">
            <span className="material-symbols-outlined text-lg">payments</span>
          </div>
        </div>
        <div>
          <div className="text-2xl font-extrabold font-mono text-[#0213B2] dark:text-[#60A5FA]">
            {formatVnd(metrics?.monthlyRevenueVnd || 845000000)}
          </div>
          <div className="flex items-center gap-2 mt-2">
            <span className="inline-flex items-center text-[10px] font-mono text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 font-bold">
              <span className="material-symbols-outlined text-xs mr-0.5">trending_up</span>
              +18.4%
            </span>
            <span className="text-[11px] font-mono text-slate-500 dark:text-slate-400">Target: 1.0B VND</span>
          </div>
        </div>
        <div className="w-full bg-slate-100 dark:bg-[#282A3A] h-1.5 rounded-full mt-4 overflow-hidden">
          <div className="bg-[#0213B2] dark:bg-[#60A5FA] h-full rounded-full" style={{ width: "84.5%" }}></div>
        </div>
      </div>

      {/* Metric 2: Work Bays */}
      <div className="bg-white dark:bg-[#14151D] p-5 rounded-2xl border border-slate-200 dark:border-[#282A3A] shadow-xs hover:shadow-md transition-all flex flex-col justify-between" data-preserve-white="true">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Workshop Bays</span>
          <div className="w-9 h-9 rounded-xl bg-[#0213B2]/10 dark:bg-[#0213B2]/30 border border-[#0213B2]/20 flex items-center justify-center text-[#0213B2] dark:text-[#60A5FA]">
            <span className="material-symbols-outlined text-lg">car_repair</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-display text-[#111827] dark:text-[#F8FAFC]">
              {metrics?.baysOccupied || 3} <span className="text-lg text-slate-400 font-mono">/ {metrics?.totalBays || 4}</span>
            </span>
            <span className="text-[10px] font-mono font-bold text-[#0213B2] dark:text-[#60A5FA] px-2 py-0.5 rounded-full bg-[#0213B2]/10 dark:bg-[#0213B2]/30 border border-[#0213B2]/20">
              {metrics ? Math.round((metrics.baysOccupied / metrics.totalBays) * 100) : 75}% Capacity
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-2">
            {(metrics?.totalBays || 4) - (metrics?.baysOccupied || 3)} bays available for vehicle intake
          </p>
        </div>
        <div className="flex gap-1.5 mt-4">
          <div className="h-1.5 flex-1 bg-[#0213B2] dark:bg-[#60A5FA] rounded-full"></div>
          <div className="h-1.5 flex-1 bg-[#0213B2] dark:bg-[#60A5FA] rounded-full"></div>
          <div className="h-1.5 flex-1 bg-[#0213B2] dark:bg-[#60A5FA] rounded-full"></div>
          <div className="h-1.5 flex-1 bg-slate-200 dark:bg-[#282A3A] rounded-full"></div>
        </div>
      </div>

      {/* Metric 3: Pending Quotations */}
      <div className="bg-white dark:bg-[#14151D] p-5 rounded-2xl border border-slate-200 dark:border-[#282A3A] shadow-xs hover:shadow-md transition-all flex flex-col justify-between" data-preserve-white="true">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Active Quotations</span>
          <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-amber-500/20 border border-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
            <span className="material-symbols-outlined text-lg">description</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-display text-[#111827] dark:text-[#F8FAFC]">14</span>
            <span className="text-xs font-mono text-slate-400">Awaiting Sign-off</span>
          </div>
          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-2">
            Potential pipeline: <strong className="text-[#111827] dark:text-[#F8FAFC] font-bold font-mono">$86,400 USD</strong>
          </p>
        </div>
        <div className="w-full bg-slate-100 dark:bg-[#282A3A] h-1.5 rounded-full mt-4 overflow-hidden">
          <div className="bg-amber-500 h-full rounded-full" style={{ width: "58%" }}></div>
        </div>
      </div>

      {/* Metric 4: Parts Procurement */}
      <div className="bg-white dark:bg-[#14151D] p-5 rounded-2xl border border-slate-200 dark:border-[#282A3A] shadow-xs hover:shadow-md transition-all flex flex-col justify-between" data-preserve-white="true">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400 uppercase tracking-wider font-bold">Procurement Inbound</span>
          <div className="w-9 h-9 rounded-xl bg-emerald-500/10 dark:bg-emerald-500/20 border border-emerald-500/20 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
            <span className="material-symbols-outlined text-lg">local_shipping</span>
          </div>
        </div>
        <div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-extrabold font-mono text-[#111827] dark:text-[#F8FAFC]">$42,100</span>
            <span className="text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
              In Transit
            </span>
          </div>
          <p className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-2">
            9 OEM deliveries scheduled this week
          </p>
        </div>
        <div className="w-full bg-slate-100 dark:bg-[#282A3A] h-1.5 rounded-full mt-4 overflow-hidden">
          <div className="bg-emerald-500 h-full rounded-full" style={{ width: "70%" }}></div>
        </div>
      </div>
    </section>
  )
}
