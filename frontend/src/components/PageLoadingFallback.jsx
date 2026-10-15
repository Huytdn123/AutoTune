import React from 'react'

/**
 * PageLoadingFallback - High-performance lightweight loading state for route suspense
 * Uses Virtual Tune cobalt accent and respects prefers-reduced-motion.
 */
export default function PageLoadingFallback() {
  return (
    <div className="flex-1 min-h-[calc(100vh-64px)] flex flex-col items-center justify-center p-6 bg-[#F3F5FA] dark:bg-[#0B0C10] transition-colors duration-200">
      <div className="relative flex items-center justify-center">
        {/* Subtle glowing halo */}
        <div className="absolute w-20 h-20 rounded-full bg-[#0213B2]/15 dark:bg-[#0213B2]/30 blur-xl animate-pulse" />
        
        {/* Spinner */}
        <div className="w-12 h-12 rounded-full border-2 border-slate-200 dark:border-[#282A3A] border-t-[#0213B2] dark:border-t-[#60A5FA] animate-spin" />
        
        {/* Center brand emblem icon */}
        <span className="material-symbols-outlined absolute text-[#0213B2] dark:text-[#60A5FA] text-lg select-none">
          tune
        </span>
      </div>

      <div className="mt-5 text-center select-none">
        <p className="text-xs font-mono font-bold uppercase tracking-widest text-slate-700 dark:text-slate-200">
          VIRTUAL TUNE
        </p>
        <p className="text-[11px] font-mono text-slate-400 dark:text-slate-500 mt-1">
          Loading precision telemetry...
        </p>
      </div>
    </div>
  )
}
