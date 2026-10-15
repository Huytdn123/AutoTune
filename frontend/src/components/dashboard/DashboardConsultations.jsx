import React from 'react'

/**
 * DashboardConsultations - Scheduled client consultations queue
 */
export default function DashboardConsultations({ onShowToast }) {
  return (
    <section className="lg:col-span-5 bg-white dark:bg-[#14151D] rounded-2xl border border-slate-200 dark:border-[#282A3A] p-6 shadow-xs flex flex-col justify-between" data-preserve-white="true">
      <div>
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-[#282A3A] mb-4">
          <div className="flex items-center gap-2.5">
            <span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA]">calendar_month</span>
            <h3 className="text-base font-bold font-['Montserrat'] text-[#111827] dark:text-[#F8FAFC]">
              Upcoming Consultations
            </h3>
          </div>
          <span className="text-xs font-mono text-slate-400">3 Scheduled Today</span>
        </div>

        <div className="space-y-3">
          <div className="p-3.5 bg-slate-50 dark:bg-[#1B1D28] rounded-xl border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2]/40 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-[#111827] dark:text-[#F8FAFC] font-['Montserrat']">
                  Harrison Sterling
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">Aston Martin Vantage V8 (2023)</p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800">
                Confirmed
              </span>
            </div>
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-200/60 dark:border-[#282A3A] text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">schedule</span>
                13:00 - 13:45
              </span>
              <span className="text-[#111827] dark:text-[#F8FAFC] font-semibold">Est: <span className="text-[#0213B2] dark:text-[#60A5FA]">$34,500</span></span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-[#1B1D28] rounded-xl border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2]/40 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-[#111827] dark:text-[#F8FAFC] font-['Montserrat']">
                  Julian De Vries
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">Ferrari F8 Tributo</p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-800">
                In Lounge
              </span>
            </div>
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-200/60 dark:border-[#282A3A] text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">schedule</span>
                14:30 - 15:30
              </span>
              <span className="text-[#111827] dark:text-[#F8FAFC] font-semibold">Est: <span className="text-[#0213B2] dark:text-[#60A5FA]">$58,000</span></span>
            </div>
          </div>

          <div className="p-3.5 bg-slate-50 dark:bg-[#1B1D28] rounded-xl border border-slate-200 dark:border-[#282A3A] hover:border-[#0213B2]/40 transition-colors">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-bold text-sm text-[#111827] dark:text-[#F8FAFC] font-['Montserrat']">
                  Clara Lindqvist
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono mt-0.5">McLaren 720S Performance</p>
              </div>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-100 dark:bg-[#282A3A] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-[#383A4E]">
                Rescheduled
              </span>
            </div>
            <div className="flex justify-between items-center mt-3 pt-2 border-t border-slate-200/60 dark:border-[#282A3A] text-xs font-mono">
              <span className="text-slate-400 flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">schedule</span>
                16:00 - 17:00
              </span>
              <span className="text-[#111827] dark:text-[#F8FAFC] font-semibold">Est: <span className="text-[#0213B2] dark:text-[#60A5FA]">$29,200</span></span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-[#282A3A] flex justify-between items-center text-xs font-mono">
        <span className="text-slate-400">Assigned Advisor: Marcus Vance</span>
        <button 
          onClick={() => onShowToast('Opening showroom appointment calendar...')}
          className="text-[#0213B2] dark:text-[#60A5FA] hover:underline font-bold inline-flex items-center gap-1 cursor-pointer"
        >
          <span>View Full Schedule</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </button>
      </div>
    </section>
  )
}
