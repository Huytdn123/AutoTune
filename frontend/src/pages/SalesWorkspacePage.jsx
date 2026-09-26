import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

/**
 * SalesWorkspacePage - Showroom Sales Consultation Workspace
 * Virtual Tune Automotive Precision System
 */
export default function SalesWorkspacePage() {
  const navigate = useNavigate()

  return (
    <div className="bg-[#090a0f] text-slate-100 font-sans antialiased min-min-h-[calc(100vh-4rem)] flex flex-col selection:bg-primary/20 selection:text-primary min-h-[calc(100vh-4rem)] flex flex-col flex-1 w-full">
      



<main className="flex-1 max-w-[1920px] w-full mx-auto p-6 grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-4rem)]">

<aside className="lg:col-span-3 flex flex-col gap-5 overflow-y-auto pr-1">

<div className="flex items-center justify-between">
<h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Client & Vehicle Dossier</h2>
<span className="text-[11px] text-slate-500 font-mono">#VT-CS-8921</span>
</div>

<div className="bg-[#151821] border border-[#202534] rounded-2xl p-5 space-y-3">
<div className="flex items-center gap-3.5">
<div className="w-11 h-11 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary font-bold font-display text-sm">
            AB
          </div>
<div>
<h3 className="font-display font-bold text-white text-base leading-tight">Alexander von Berg</h3>
<p className="text-xs text-slate-400 mt-0.5">Munich, Germany</p>
</div>
</div>
<div className="pt-2 border-t border-[#202534]/70 flex items-center justify-between text-xs text-slate-400">
<span>Client Tier</span>
<span className="text-primary font-medium flex items-center gap-1">
<span className="material-symbols-outlined text-sm">verified</span> Private Collector
          </span>
</div>
</div>

<div className="bg-[#151821] border border-[#202534] rounded-2xl p-5 space-y-4">
<div>
<span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Staged Vehicle</span>
<h4 className="font-display font-bold text-white text-lg mt-1">Porsche 911 GT3</h4>
<p className="text-xs text-slate-400 mt-0.5">Generation 992 • Agate Gray Metallic</p>
</div>
<div className="grid grid-cols-2 gap-3 pt-2">
<div className="bg-[#0f1118] p-3 rounded-xl border border-[#1b1f2c]">
<span className="text-[10px] uppercase text-slate-500 block">Powertrain</span>
<span className="text-xs font-semibold text-slate-200 mt-0.5 block">518 HP • 4.0L</span>
</div>
<div className="bg-[#0f1118] p-3 rounded-xl border border-[#1b1f2c]">
<span className="text-[10px] uppercase text-slate-500 block">Baseline Weight</span>
<span className="text-xs font-semibold text-slate-200 mt-0.5 block">1,435 kg</span>
</div>
</div>
</div>

<div className="bg-[#151821] border border-[#202534] rounded-2xl p-5 space-y-2.5">
<span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Consultation Objective</span>
<div className="flex items-center gap-2 text-white font-medium text-sm">
<span className="material-symbols-outlined text-primary text-base">speed</span>
<span>Track Pace & Weight Reduction</span>
</div>
<p className="text-xs text-slate-400 leading-relaxed">
          Optimized for aerodynamic stability and unsprung weight reduction on circuit configurations.
        </p>
</div>

<div className="bg-[#151821] border border-[#202534] rounded-2xl p-5 space-y-3 mt-auto">
<div className="flex justify-between items-baseline">
<span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Allocated Budget</span>
<span className="font-display font-bold text-white text-sm">€25,000 – €35,000</span>
</div>
<div className="w-full bg-[#0d0e12] h-2 rounded-full overflow-hidden p-0.5 border border-[#232838]">
<div className="bg-primary h-full rounded-full" style={{ width: "68%" }}></div>
</div>
<div className="flex justify-between text-xs text-slate-400">
<span>Staged Build Total</span>
<span className="text-primary font-semibold">€23,401.35</span>
</div>
</div>
</aside>

<section className="lg:col-span-6 flex flex-col bg-[#151821] border border-[#202534] rounded-2xl overflow-hidden relative shadow-2xl">

<div className="p-4 flex items-center justify-between border-b border-[#202534] z-10 bg-[#151821]/80 backdrop-blur-sm">
<div className="flex items-center gap-2">
<span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Perspective:</span>
<div className="flex items-center bg-[#0d0e12] p-1 rounded-xl border border-[#202534]">
<button className="px-3 py-1 rounded-lg text-xs font-medium bg-primary text-[#0d0e12] shadow-sm">Front 3/4</button>
<button className="px-3 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition">Side Profile</button>
<button className="px-3 py-1 rounded-lg text-xs font-medium text-slate-400 hover:text-slate-200 transition">Rear Aero</button>
</div>
</div>
<div className="flex items-center gap-2 text-xs text-slate-400">
<span className="w-2 h-2 rounded-full bg-emerald-400"></span>
<span>Photorealistic 3D Stage</span>
</div>
</div>

<div className="flex-1 relative overflow-hidden flex items-center justify-center bg-[#0d0e12]">
<img className="w-full h-full object-cover select-none" data-alt="Configured Porsche 911 GT3 with track pack" src="https://lh3.googleusercontent.com/aida/AEtjO1XEUaqiGLJebnm4MwCSEASCu9kl4c-lGRo79CWVoJJhd9ptRkw5gYuDEmH3sqqCQN2hoRKOPu2_32LnmETPK7bgVmhUBYrVAXz1ZJGDiMFc_hDOZF1Om9UYEWKeerUM3MbYrJwVuz3czadcwQrgJdVZJnw8KnAy_4pL9Y5LR9ktiZ73yc02Nx97r6UKEis8RiRQJO52RA8XSBiJ_txjRr7KSLsYDGV3HzR3ST59Px9CbaulYA7qs0a9lzg" />

<div className="absolute inset-0 bg-gradient-to-t from-[#0d0e12]/80 via-transparent to-transparent pointer-events-none"></div>

<div className="absolute top-[44%] left-[22%] z-20 group cursor-pointer">
<div className="relative flex items-center gap-2.5">
<span className="flex h-5 w-5 items-center justify-center">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
<span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[#0d0e12] text-[10px] font-bold items-center justify-center shadow-lg">1</span>
</span>
<div className="bg-[#151821]/90 backdrop-blur-md border border-[#2a3044] px-3 py-2 rounded-xl shadow-xl">
<div className="text-xs font-semibold text-white">Dry Carbon Aero Package</div>
<div className="text-[11px] text-primary font-mono mt-0.5">+28kg downforce @ 200 km/h</div>
</div>
</div>
</div>

<div className="absolute bottom-[28%] right-[28%] z-20 group cursor-pointer">
<div className="relative flex items-center gap-2.5">
<span className="flex h-5 w-5 items-center justify-center">
<span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-60"></span>
<span className="relative inline-flex rounded-full h-4 w-4 bg-primary text-[#0d0e12] text-[10px] font-bold items-center justify-center shadow-lg">2</span>
</span>
<div className="bg-[#151821]/90 backdrop-blur-md border border-[#2a3044] px-3 py-2 rounded-xl shadow-xl">
<div className="text-xs font-semibold text-white">Apex Sprint Forged 20"/21"</div>
<div className="text-[11px] text-emerald-400 font-mono mt-0.5">-15.2 kg unsprung mass</div>
</div>
</div>
</div>
</div>

<div className="p-4 bg-[#151821] border-t border-[#202534] flex items-center justify-center">
<div className="flex items-center gap-4 bg-[#0d0e12] px-6 py-2.5 rounded-full border border-[#202534]">
<span className="text-xs font-medium text-slate-400">Stock Baseline</span>
<input className="w-48 h-1.5 bg-[#252a3b] rounded-lg appearance-none cursor-pointer" max="100" min="0" type="range" value="65" />
<span className="text-xs font-bold text-primary">Track Pac Stage 1</span>
</div>
</div>
</section>

<aside className="lg:col-span-3 flex flex-col gap-5 overflow-y-auto pl-1">

<div className="flex items-center justify-between">
<h2 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Active Build & Quotation</h2>
<span className="px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 text-[10px] font-semibold border border-emerald-500/20">Active</span>
</div>

<div className="bg-[#151821] border border-primary/30 rounded-2xl p-5 space-y-1 relative overflow-hidden">
<div className="absolute -right-6 -bottom-6 w-24 h-24 bg-primary/5 rounded-full blur-xl pointer-events-none"></div>
<span className="text-[11px] font-semibold uppercase tracking-wider text-primary">Selected Bundle</span>
<h3 className="font-display font-bold text-white text-lg">Track Pac Stage 1</h3>
<p className="text-xs text-slate-400">Complete aerodynamic and lightweight wheel homologation</p>
</div>

<div className="space-y-2.5">
<span className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">Configured Components</span>
<div className="space-y-2">

<div className="p-3.5 rounded-xl bg-[#151821] border border-[#202534] flex items-center justify-between">
<div>
<div className="text-xs font-semibold text-slate-100">Dry Carbon Aero Splitter</div>
<div className="text-[11px] text-slate-400 mt-0.5">Dual front dive planes</div>
</div>
<span className="text-xs font-bold font-mono text-white">€2,450</span>
</div>

<div className="p-3.5 rounded-xl bg-[#151821] border border-[#202534] flex items-center justify-between">
<div>
<div className="text-xs font-semibold text-slate-100">GT3 Swan-Neck Wing</div>
<div className="text-[11px] text-slate-400 mt-0.5">Carbon fiber high-downforce blade</div>
</div>
<span className="text-xs font-bold font-mono text-white">€3,800</span>
</div>

<div className="p-3.5 rounded-xl bg-[#151821] border border-[#202534] flex items-center justify-between">
<div>
<div className="text-xs font-semibold text-slate-100">Apex Forged Sprint Wheels</div>
<div className="text-[11px] text-slate-400 mt-0.5">20" / 21" Centerlock fitment</div>
</div>
<span className="text-xs font-bold font-mono text-white">€4,600</span>
</div>

<div className="p-3.5 rounded-xl bg-[#151821] border border-[#202534] flex items-center justify-between">
<div>
<div className="text-xs font-semibold text-slate-100">Michelin Pilot Sport Cup 2 R</div>
<div className="text-[11px] text-slate-400 mt-0.5">Complete track compound set</div>
</div>
<span className="text-xs font-bold font-mono text-white">€2,150</span>
</div>
</div>
</div>

<div className="bg-[#151821] border border-[#202534] rounded-2xl p-4 flex items-center justify-between">
<div className="flex items-center gap-2.5">
<span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/50"></span>
<span className="text-xs font-medium text-slate-200">TÜV Approved</span>
</div>
<span className="text-xs font-semibold text-emerald-400">Road Legal</span>
</div>

<div className="bg-[#151821] border border-[#252b3d] rounded-2xl p-5 space-y-4 mt-auto">
<div className="flex items-baseline justify-between">
<div>
<span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">Total Investment</span>
<span className="text-[10px] text-slate-500">Incl. installation, setup & VAT</span>
</div>
<div className="font-display font-extrabold text-2xl text-primary font-mono tracking-tight">
            €23,401.35
          </div>
</div>
<button className="w-full py-3 px-4 rounded-xl bg-primary hover:bg-primary-hover text-[#0d0e12] font-semibold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition duration-150 shadow-lg shadow-primary/10">
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
