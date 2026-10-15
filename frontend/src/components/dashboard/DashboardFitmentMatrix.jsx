import React from 'react'
import { Link } from 'react-router-dom'

/**
 * DashboardFitmentMatrix - Fitment Clearance Verification Matrix summary table
 */
export default function DashboardFitmentMatrix() {
  return (
    <section className="lg:col-span-7 bg-white dark:bg-[#14151D] rounded-2xl border border-slate-200 dark:border-[#282A3A] p-6 shadow-xs flex flex-col justify-between" data-preserve-white="true">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#282A3A] mb-4">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA]">fact_check</span>
            <h3 className="text-base font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC]">
              Fitment Clearance Verification Matrix
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">Bespoke Wheel & Suspension Specs</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse font-['Inter']">
            <thead>
              <tr className="border-b border-slate-200 dark:border-[#282A3A] text-slate-400 uppercase font-mono text-[10px]">
                <th className="py-2.5 px-3">Vehicle Profile</th>
                <th className="py-2.5 px-3">PCD / Center Bore</th>
                <th className="py-2.5 px-3">Axle Clearance</th>
                <th className="py-2.5 px-3">Brake Clearance</th>
                <th className="py-2.5 px-3 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-[#282A3A]">
              <tr className="hover:bg-slate-50 dark:hover:bg-[#1B1D28] transition-colors">
                <td className="py-3 px-3 font-semibold text-[#111827] dark:text-[#F8FAFC]">911 Carrera (991)</td>
                <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">5x130 (71.6mm)</td>
                <td className="py-3 px-3 text-slate-700 dark:text-slate-300">ET45 F / ET45 R</td>
                <td className="py-3 px-3 text-slate-500">OEM 330mm Disc</td>
                <td className="py-3 px-3 text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    Verified
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-[#1B1D28] transition-colors">
                <td className="py-3 px-3 font-semibold text-[#111827] dark:text-[#F8FAFC]">BMW Vision</td>
                <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">5x112 (72.6mm)</td>
                <td className="py-3 px-3 text-slate-700 dark:text-slate-300">ET25 F / ET22 R</td>
                <td className="py-3 px-3 text-slate-500">BMW Sport 360mm</td>
                <td className="py-3 px-3 text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    Verified
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-[#1B1D28] transition-colors">
                <td className="py-3 px-3 font-semibold text-[#111827] dark:text-[#F8FAFC]">RS6 Avant C8</td>
                <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">5x112 (66.5mm)</td>
                <td className="py-3 px-3 text-slate-700 dark:text-slate-300">ET22 F / ET19 R</td>
                <td className="py-3 px-3 text-slate-500">RS Steel 420mm</td>
                <td className="py-3 px-3 text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
                    <span className="material-symbols-outlined text-xs">info</span>
                    Spacer 3mm Req
                  </span>
                </td>
              </tr>
              <tr className="hover:bg-slate-50 dark:hover:bg-[#1B1D28] transition-colors">
                <td className="py-3 px-3 font-semibold text-[#111827] dark:text-[#F8FAFC]">AMG GT Black</td>
                <td className="py-3 px-3 font-mono text-slate-500 dark:text-slate-400">5x112 (66.6mm)</td>
                <td className="py-3 px-3 text-slate-700 dark:text-slate-300">ET30 F / ET24 R</td>
                <td className="py-3 px-3 text-slate-500">CCM Carbon 402mm</td>
                <td className="py-3 px-3 text-right">
                  <span className="inline-flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800">
                    <span className="material-symbols-outlined text-xs">check_circle</span>
                    Verified
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#282A3A] flex justify-between items-center text-xs font-mono">
        <span className="text-slate-400">TÜV Certificate Auto-generation enabled</span>
        <Link to="/fitment" className="text-[#0213B2] dark:text-[#60A5FA] hover:underline font-bold inline-flex items-center gap-1">
          <span>Inspect Full Fitment Matrix</span>
          <span className="material-symbols-outlined text-sm">arrow_forward</span>
        </Link>
      </div>
    </section>
  )
}
