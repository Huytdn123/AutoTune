import React from 'react'
import { Link, useNavigate } from 'react-router-dom'

/**
 * HomePage - SaaS Marketing Platform Landing
 * Virtual Tune Automotive Precision System
 */
export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div className="bg-background text-on-surface font-body-md antialiased selection:bg-tertiary selection:text-on-tertiary min-h-[calc(100vh-4rem)] flex flex-col flex-1 w-full">
      



<section className="relative bg-[#E8EDFF] text-[#111827] pt-12 pb-20 overflow-hidden border-b border-[#BCC7D8]">

<div className="absolute inset-0 blueprint-grid opacity-25 pointer-events-none"></div>
<div className="absolute -top-24 right-0 w-[550px] h-[550px] bg-gradient-to-br from-[#0213B2]/15 to-transparent rounded-full blur-3xl pointer-events-none"></div>
<div className="relative max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

<div className="lg:col-span-6 flex flex-col items-start z-10">

<div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E5E8F0]/90 border border-[#0213B2]/40 mb-6 backdrop-blur-sm shadow-xs">
<span className="w-2 h-2 rounded-full bg-[#0213B2] animate-pulse"></span>
<span className="font-label-sm text-[#0213B2] font-bold tracking-widest uppercase">NEXT-GEN B2B WORKSHOP PLATFORM</span>
</div>

<h1 className="font-display text-display text-[#111827] tracking-tight mb-6">
          Visualize Your Build. Fast. Accurate. Safe.
        </h1>

<p className="font-body-lg text-body-lg text-[#334155] max-w-xl mb-8 leading-relaxed font-medium">Empowering garages to sell customization ideas through interactive 3D visualization, automated quotation, and technical verification.</p>

<div className="flex flex-wrap items-center gap-4 mb-10 w-full sm:w-auto">
<a className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#0213B2] hover:bg-[#0115BC] active:bg-[#06169B] text-white font-['Montserrat'] font-bold text-xs tracking-wider uppercase transition-all duration-150 active:scale-95 shadow-md shadow-[#0213B2]/25 cursor-pointer" href="#demo">
<span className="">Request Demo</span>
<span className="material-symbols-outlined text-lg" data-icon="arrow_forward">arrow_forward</span>
</a>
<Link className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#E5E8F0] hover:bg-[#D7E1FF] border-2 border-[#0213B2] text-[#0213B2] hover:text-[#0115BC] hover:border-[#0115BC] font-['Montserrat'] font-bold text-xs tracking-wider uppercase transition-all duration-150 active:scale-95 shadow-xs cursor-pointer" to="/configurator">
<span className="material-symbols-outlined text-lg text-[#0213B2]" data-icon="view_in_ar">view_in_ar</span>
<span className="">Try Configurator</span>
</Link>
</div><div className="flex flex-wrap gap-2 mb-8"><span className="px-2 py-0.5 rounded bg-[#E5E8F0] border border-[#0213B2]/40 text-[#0213B2] text-[10px] font-mono font-semibold">[3D Configuration Saved]</span><span className="px-2 py-0.5 rounded bg-[#E5E8F0] border border-[#0213B2]/40 text-[#0213B2] text-[10px] font-mono font-semibold">[Quote Generated]</span><span className="px-2 py-0.5 rounded bg-[#E5E8F0] border border-[#0213B2]/40 text-[#0213B2] text-[10px] font-mono font-semibold">[Compatibility Verified]</span><span className="px-2 py-0.5 rounded bg-[#E5E8F0] border border-[#0213B2]/40 text-[#0213B2] text-[10px] font-mono font-semibold">[Warranty Tracked]</span><span className="px-2 py-0.5 rounded bg-[#E5E8F0] border border-[#0213B2]/40 text-[#0213B2] text-[10px] font-mono font-semibold">[Work Order Ready]</span><span className="px-2 py-0.5 rounded bg-[#D7E1FF] border border-[#BCC7D8] text-[#06169B] text-[10px] font-mono font-semibold">[360° Preview]</span><span className="px-2 py-0.5 rounded bg-[#D7E1FF] border border-[#BCC7D8] text-[#06169B] text-[10px] font-mono font-semibold">[Real-time 3D]</span><span className="px-2 py-0.5 rounded bg-[#D7E1FF] border border-[#BCC7D8] text-[#06169B] text-[10px] font-mono font-semibold">[Auto-Quote Ready]</span><span className="px-2 py-0.5 rounded bg-[#D7E1FF] border border-[#BCC7D8] text-[#06169B] text-[10px] font-mono font-semibold">[Legal-Check Passed]</span></div>

<div className="w-full pt-6 border-t border-[#BCC7D8] flex flex-wrap items-center justify-between gap-4 font-label-sm text-[#334155]">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[#0213B2] text-base" data-icon="verified">verified</span>
<span className="font-headline-sm text-[#111827] font-bold">1,200+</span>
<span className="text-body-sm text-[#475569]">Certified Garages</span>
</div>
<div className="h-4 w-px bg-[#BCC7D8] hidden sm:block"></div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[#0213B2] text-base" data-icon="precision_manufacturing">precision_manufacturing</span>
<span className="font-headline-sm text-[#111827] font-bold">99.98%</span>
<span className="text-body-sm text-[#475569]">Fitment Accuracy</span>
</div>
<div className="h-4 w-px bg-[#BCC7D8] hidden sm:block"></div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-[#0213B2] text-base" data-icon="gavel">gavel</span>
<span className="font-headline-sm text-[#111827] font-bold">TÜV & DOT</span>
<span className="text-body-sm text-[#475569]">Approved Workflows</span>
</div>
</div>
</div>

<div className="lg:col-span-6 relative">
<div className="relative rounded-xl overflow-hidden border border-[#BCC7D8] bg-[#E5E8F0] p-2.5 shadow-2xl">

<div className="flex items-center justify-between px-3 py-2 border-b border-[#D8DFEA] bg-[#E8EDFF] mb-2 text-[#475569] font-label-sm">
<div className="flex items-center gap-2">
<span className="inline-block w-2.5 h-2.5 rounded-full bg-[#DC2626]"></span>
<span className="inline-block w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
<span className="inline-block w-2.5 h-2.5 rounded-full bg-[#16A34A]"></span>
<span className="ml-2 font-mono text-xs text-[#0213B2] font-semibold">CAD_STAGE_R7_SUPERCAR.VT</span>
</div>
<div className="flex items-center gap-3 font-mono text-xs">
<span className="text-[#64748B]">XYZ: 421.4 / -12.0 / 890.1</span>
<span className="px-1.5 py-0.5 rounded bg-[#D7E1FF] text-[#0213B2] font-bold border border-[#BCC7D8]">60 FPS</span>
</div>
</div>

<div className="relative w-full aspect-video rounded overflow-hidden bg-slate-900">
<img className="w-full h-full object-cover" data-alt="A cutting-edge hypercar in an atmospheric deep navy engineering hangar with an active holographic blue CAD telemetry wireframe overlay tracking fender wheel clearance and aerodynamic downforce lines, cinematic automotive studio lighting with metallic graphite body reflections." src="/images/hero-car.jpg" />

<div className="absolute inset-0 hud-scanner pointer-events-none opacity-40"></div>

<div className="absolute top-4 left-4 flex flex-col gap-2">
<div className="bg-[#E5E8F0]/95 backdrop-blur-md border border-[#0213B2]/50 px-3 py-1.5 rounded flex items-center gap-2 shadow-lg">
<span className="material-symbols-outlined text-[#0213B2] text-sm" data-icon="check_circle">check_circle</span>
<span className="font-mono text-xs font-semibold text-[#0213B2]">Wheel Clearance: +4.8mm PASS</span>
</div>
<div className="bg-[#E5E8F0]/95 backdrop-blur-md border border-[#D8DFEA] px-3 py-1.5 rounded flex items-center gap-2 shadow-lg">
<span className="material-symbols-outlined text-[#475569] text-sm" data-icon="sensors">sensors</span>
<span className="font-mono text-xs text-[#111827]">Camber Sweep: Dynamic Verified</span>
</div>
</div>
<div className="absolute bottom-4 right-4 flex flex-col gap-2 items-end">
<div className="bg-[#E5E8F0]/95 backdrop-blur-md border border-[#D8DFEA] px-3 py-1.5 rounded flex items-center gap-2 shadow-lg">
<span className="material-symbols-outlined text-[#0213B2] text-sm" data-icon="hub">hub</span>
<span className="font-mono text-xs text-[#111827]">Hub-Centric: 71.6mm Match</span>
</div>
<div className="bg-[#E5E8F0]/95 backdrop-blur-md border border-[#0213B2]/50 px-3 py-1.5 rounded flex items-center gap-2 shadow-lg">
<span className="material-symbols-outlined text-[#0213B2] text-sm" data-icon="air">air</span>
<span className="font-mono text-xs font-semibold text-[#0213B2]">Aero Downforce Delta: +42 kg</span>
</div>
</div>

<div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
<div className="w-8 h-8 border border-[#0213B2]/60 rounded-full flex items-center justify-center">
<div className="w-1.5 h-1.5 bg-[#0213B2] rounded-full"></div>
</div>
<span className="font-mono text-[9px] bg-[#E5E8F0] text-[#0213B2] px-1 mt-1 border border-[#0213B2]/40 rounded font-bold">PCD 5x130</span>
</div>
</div>

<div className="flex items-center justify-between pt-2 px-1 text-[#475569] font-label-sm">
<span className="text-xs">Tire Stance: 325/30 R20 Michelin Pilot Sport Cup 2</span>
<div className="flex items-center gap-2">
<button className="px-2.5 py-1 rounded bg-[#E8EDFF] hover:bg-[#D7E1FF] border border-[#BCC7D8] hover:border-[#0213B2] text-xs font-mono text-[#06169B] hover:text-[#0213B2] transition-colors cursor-pointer shadow-xs">Iso View</button>
<button className="px-2.5 py-1 rounded bg-[#E8EDFF] hover:bg-[#D7E1FF] border border-[#BCC7D8] hover:border-[#0213B2] text-xs font-mono text-[#06169B] hover:text-[#0213B2] transition-colors cursor-pointer shadow-xs">Mesh View</button>
<button className="px-2.5 py-1 rounded bg-[#E8EDFF] hover:bg-[#D7E1FF] border border-[#BCC7D8] hover:border-[#0213B2] text-xs font-mono text-[#06169B] hover:text-[#0213B2] transition-colors cursor-pointer shadow-xs">Stress Map</button>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="py-7 bg-[#D7E1FF] dark:bg-[#121833] border-b border-[#BCC7D8] dark:border-[#282A3A]">
<div className="max-w-7xl mx-auto px-6 lg:px-12">
<p className="font-label-sm text-center uppercase tracking-widest text-[#06169B] dark:text-[#93C5FD] font-bold mb-5 text-xs">
        Trusted by High-Performance Garages & OEM Component Manufacturers
      </p>
<div className="flex flex-wrap items-center justify-center md:justify-between gap-8 text-[#06169B] dark:text-[#93C5FD]">
<div className="flex items-center gap-2.5 font-headline-sm uppercase tracking-wider text-[#06169B] dark:text-[#93C5FD] hover:text-[#0213B2] dark:hover:text-white transition-colors">
<span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-2xl" data-icon="sports_motorsports">sports_motorsports</span>
<span className="font-bold text-sm sm:text-base">Apex Dynamics</span>
</div>
<div className="flex items-center gap-2.5 font-headline-sm uppercase tracking-wider text-[#06169B] dark:text-[#93C5FD] hover:text-[#0213B2] dark:hover:text-white transition-colors">
<span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-2xl" data-icon="build_circle">build_circle</span>
<span className="font-bold text-sm sm:text-base">Brembo Tech</span>
</div>
<div className="flex items-center gap-2.5 font-headline-sm uppercase tracking-wider text-[#06169B] dark:text-[#93C5FD] hover:text-[#0213B2] dark:hover:text-white transition-colors">
<span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-2xl" data-icon="height">height</span>
<span className="font-bold text-sm sm:text-base">KW Suspension</span>
</div>
<div className="flex items-center gap-2.5 font-headline-sm uppercase tracking-wider text-[#06169B] dark:text-[#93C5FD] hover:text-[#0213B2] dark:hover:text-white transition-colors">
<span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-2xl" data-icon="oil_barrel">oil_barrel</span>
<span className="font-bold text-sm sm:text-base">Motul Labs</span>
</div>
<div className="flex items-center gap-2.5 font-headline-sm uppercase tracking-wider text-[#06169B] dark:text-[#93C5FD] hover:text-[#0213B2] dark:hover:text-white transition-colors">
<span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-2xl" data-icon="album">album</span>
<span className="font-bold text-sm sm:text-base">BBS Motorsport</span>
</div>
</div>
</div>
</section>

<section className="py-24 bg-[#E5E8F0] dark:bg-[#0B0C10] border-b border-[#D8DFEA] dark:border-[#282A3A]" id="platform">
  <div className="max-w-7xl mx-auto px-6 lg:px-12">
    <div className="mb-16">
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[#E8EDFF] dark:bg-[#1E254A] border border-[#0213B2]/30 dark:border-[#384580] mb-3">
        <span className="font-mono text-xs feature-module-tag font-bold uppercase tracking-wider">Engineered Architecture</span>
      </div>
      <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] dark:text-white uppercase tracking-tight">
        Precision Customization Modules
      </h2>
      <p className="text-sm sm:text-base text-[#475569] dark:text-[#E2E8F0] max-w-2xl mt-2 leading-relaxed">
        Replace physical test-fit guesswork with aerospace-grade CAD verification and instant wholesale quoting.
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Card 1 */}
      <div className="feature-module-card bg-[#F8FAFC] dark:bg-[#14151D] border border-[#D8DFEA] dark:border-[#282A3A] rounded-xl p-6 hover:border-[#0213B2] dark:hover:border-[#60A5FA] transition-all duration-200 flex flex-col justify-between group shadow-xs hover:shadow-md">
        <div>
          <div className="feature-module-icon w-12 h-12 rounded-xl bg-[#E8EDFF] dark:bg-[#1E254A] border border-[#BCC7D8] dark:border-[#384580] flex items-center justify-center mb-6 group-hover:border-[#0213B2] dark:group-hover:border-[#60A5FA] transition-colors">
            <span className="material-symbols-outlined text-[#0213B2] dark:text-[#93C5FD] text-2xl">view_in_ar</span>
          </div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="feature-module-tag font-mono text-xs font-bold uppercase tracking-wider">Core Triad // 01</span>
            <span className="feature-module-badge text-[10px] font-mono font-bold px-2 py-0.5 rounded border whitespace-nowrap">[Real-time 3D]</span>
          </div>
          <h3 className="feature-module-title font-display text-base font-bold mt-1 mb-2">Interactive 3D Configurator</h3>
          <p className="feature-module-desc text-xs sm:text-sm leading-relaxed">
            Ray-traced CAD mesh rendering, 360° vehicle preview, live paint matching, bespoke wheel and aero package staging with sub-millimeter precision.
          </p>
        </div>
        <div className="pt-5 mt-5 border-t border-[#D8DFEA] dark:border-[#282A3A] flex items-center justify-between text-xs font-mono font-bold feature-module-link group-hover:text-[#0115BC] dark:group-hover:text-[#93C5FD]">
          <span>[3D Configuration Saved]</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </div>
      </div>

      {/* Card 2 */}
      <div className="feature-module-card bg-[#F8FAFC] dark:bg-[#14151D] border border-[#D8DFEA] dark:border-[#282A3A] rounded-xl p-6 hover:border-[#0213B2] dark:hover:border-[#60A5FA] transition-all duration-200 flex flex-col justify-between group shadow-xs hover:shadow-md">
        <div>
          <div className="feature-module-icon w-12 h-12 rounded-xl bg-[#E8EDFF] dark:bg-[#1E254A] border border-[#BCC7D8] dark:border-[#384580] flex items-center justify-center mb-6 group-hover:border-[#0213B2] dark:group-hover:border-[#60A5FA] transition-colors">
            <span className="material-symbols-outlined text-[#0213B2] dark:text-[#93C5FD] text-2xl">request_quote</span>
          </div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="feature-module-tag font-mono text-xs font-bold uppercase tracking-wider">Core Triad // 02</span>
            <span className="feature-module-badge text-[10px] font-mono font-bold px-2 py-0.5 rounded border whitespace-nowrap">[Auto-Quote Ready]</span>
          </div>
          <h3 className="feature-module-title font-display text-base font-bold mt-1 mb-2">Automated Quotation & Margin Engine</h3>
          <p className="feature-module-desc text-xs sm:text-sm leading-relaxed">
            Instant wholesale part acquisition calculations, shop bay labor matrix staging, live supplier ERP sync, and one-click work order compilation.
          </p>
        </div>
        <div className="pt-5 mt-5 border-t border-[#D8DFEA] dark:border-[#282A3A] flex items-center justify-between text-xs font-mono font-bold feature-module-link group-hover:text-[#0115BC] dark:group-hover:text-[#93C5FD]">
          <span>[Quote Generated] & [Work Order Ready]</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </div>
      </div>

      {/* Card 3 */}
      <div className="feature-module-card bg-[#F8FAFC] dark:bg-[#14151D] border border-[#D8DFEA] dark:border-[#282A3A] rounded-xl p-6 hover:border-[#0213B2] dark:hover:border-[#60A5FA] transition-all duration-200 flex flex-col justify-between group shadow-xs hover:shadow-md">
        <div>
          <div className="feature-module-icon w-12 h-12 rounded-xl bg-[#E8EDFF] dark:bg-[#1E254A] border border-[#BCC7D8] dark:border-[#384580] flex items-center justify-center mb-6 group-hover:border-[#0213B2] dark:group-hover:border-[#60A5FA] transition-colors">
            <span className="material-symbols-outlined text-[#0213B2] dark:text-[#93C5FD] text-2xl">sensors</span>
          </div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="feature-module-tag font-mono text-xs font-bold uppercase tracking-wider">Core Triad // 03</span>
            <span className="feature-module-badge text-[10px] font-mono font-bold px-2 py-0.5 rounded border whitespace-nowrap">[Compatibility Verified]</span>
          </div>
          <h3 className="feature-module-title font-display text-base font-bold mt-1 mb-2">Smart Data Mapping & Technical Verification</h3>
          <p className="feature-module-desc text-xs sm:text-sm leading-relaxed">
            Real-time kinematic sweep checks for strut & caliper clearance, dynamic scrub radius telemetry, fender roll detection, and zero-scrap assurance.
          </p>
        </div>
        <div className="pt-5 mt-5 border-t border-[#D8DFEA] dark:border-[#282A3A] flex items-center justify-between text-xs font-mono font-bold feature-module-link group-hover:text-[#0115BC] dark:group-hover:text-[#93C5FD]">
          <span>Zero Scrap Guarantee</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </div>
      </div>

      {/* Card 4 */}
      <div className="feature-module-card bg-[#F8FAFC] dark:bg-[#14151D] border border-[#D8DFEA] dark:border-[#282A3A] rounded-xl p-6 hover:border-[#0213B2] dark:hover:border-[#60A5FA] transition-all duration-200 flex flex-col justify-between group shadow-xs hover:shadow-md">
        <div>
          <div className="feature-module-icon w-12 h-12 rounded-xl bg-[#E8EDFF] dark:bg-[#1E254A] border border-[#BCC7D8] dark:border-[#384580] flex items-center justify-center mb-6 group-hover:border-[#0213B2] dark:group-hover:border-[#60A5FA] transition-colors">
            <span className="material-symbols-outlined text-[#0213B2] dark:text-[#93C5FD] text-2xl">verified_user</span>
          </div>
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="feature-module-tag font-mono text-xs font-bold uppercase tracking-wider">Module // 04</span>
            <span className="feature-module-badge text-[10px] font-mono font-bold px-2 py-0.5 rounded border whitespace-nowrap">[Legal-Check Passed]</span>
          </div>
          <h3 className="feature-module-title font-display text-base font-bold mt-1 mb-2">Legal & TÜV Homologation Engine</h3>
          <p className="feature-module-desc text-xs sm:text-sm leading-relaxed">
            Automated compliance paperwork generation, wheel track delta analysis, OEM parts warranty tracking, and tamper-proof digital vehicle build passports.
          </p>
        </div>
        <div className="pt-5 mt-5 border-t border-[#D8DFEA] dark:border-[#282A3A] flex items-center justify-between text-xs font-mono font-bold feature-module-link group-hover:text-[#0115BC] dark:group-hover:text-[#93C5FD]">
          <span>[Warranty Tracked] Homologation</span>
          <span className="material-symbols-outlined text-sm">chevron_right</span>
        </div>
      </div>
    </div>
  </div>
</section>

<section className="py-20 bg-[#F3F5FA] dark:bg-[#0B0C10] border-b border-[#D8DFEA] dark:border-[#282A3A]" id="fitment-engine">
<div className="max-w-7xl mx-auto px-6 lg:px-12">
<div className="text-center max-w-3xl mx-auto mb-16">
<span className="font-mono text-xs text-[#0213B2] dark:text-[#93C5FD] font-bold uppercase tracking-widest">Operational Comparison</span>
<h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] dark:text-white uppercase mt-2">
          From Trial-and-Error to Digital Pre-Assembly
        </h2>
<p className="text-sm sm:text-base text-[#475569] dark:text-[#CBD5E1] mt-2">
          Eliminate bay downtime and customer disputes with instant mathematical fitment modeling.
        </p>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

<div className="bg-white dark:bg-[#14151D] border border-[#D8DFEA] dark:border-[#282A3A] rounded-xl p-8 shadow-sm flex flex-col justify-between">
<div>
<div className="flex items-center justify-between pb-4 border-b border-[#D8DFEA] dark:border-[#282A3A] mb-6">
<span className="font-display text-base font-bold text-red-600 dark:text-[#F87171] uppercase">Traditional Manual Fitment</span>
<span className="px-2.5 py-0.5 rounded bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-[#F87171] text-xs font-mono font-semibold border border-red-200 dark:border-red-900/50">High Risk</span>
</div>
<ul className="space-y-4 text-xs sm:text-sm text-[#475569] dark:text-[#E2E8F0]">
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-red-600 dark:text-[#F87171] text-base mt-0.5" data-icon="close">close</span>
<span className="">Unbox custom wheels and mount tires prior to verifying brake caliper inner-bell spacing.</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-red-600 dark:text-[#F87171] text-base mt-0.5" data-icon="close">close</span>
<span className="">Unplanned fender rubbing under full suspension compression discovered during road test.</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-red-600 dark:text-[#F87171] text-base mt-0.5" data-icon="close">close</span>
<span className="">4.5 hours average bay downtime waiting for wheel spacers or emergency hub rings.</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-red-600 dark:text-[#F87171] text-base mt-0.5" data-icon="close">close</span>
<span className="">High wholesale restocking fees (15-25%) for scratched or mounted returns.</span>
</li>
</ul>
</div>
<div className="mt-8 pt-4 border-t border-[#D8DFEA] dark:border-[#282A3A]">
<div className="flex justify-between text-xs font-mono text-[#64748B] dark:text-[#CBD5E1]">
<span className="">Estimated Bay Loss / Car:</span>
<span className="text-red-600 dark:text-[#F87171] font-bold">$380 - $750</span>
</div>
</div>
</div>

<div className="bg-white dark:bg-[#14151D] border-2 border-[#0213B2] dark:border-[#60A5FA] rounded-xl p-8 shadow-md flex flex-col justify-between relative overflow-hidden">
<div className="absolute -right-12 -top-12 w-48 h-48 bg-[#0213B2]/10 dark:bg-[#60A5FA]/10 rounded-full blur-2xl"></div>
<div>
<div className="flex items-center justify-between pb-4 border-b border-[#0213B2]/20 dark:border-[#60A5FA]/20 mb-6">
<span className="font-display text-base font-bold text-[#0213B2] dark:text-[#60A5FA] uppercase">Virtual Tune Engine</span>
<span className="px-2.5 py-0.5 rounded bg-[#E8EDFF] dark:bg-[#1E293B] text-[#0213B2] dark:text-[#38BDF8] text-xs font-mono font-bold border border-[#0213B2]/30 dark:border-[#475569]">Verified Safe</span>
</div>
<ul className="space-y-4 text-xs sm:text-sm text-[#111827] dark:text-[#F8FAFC]">
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-base mt-0.5" data-icon="check">check</span>
<span className="">Optical OEM 3D laser scan alignment with exact barrel and caliper offset tolerance matrix.</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-base mt-0.5" data-icon="check">check</span>
<span className="">Dynamic scrub radius and suspension articulation simulated under peak G-load.</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-base mt-0.5" data-icon="check">check</span>
<span className="">Automated bill-of-materials and wholesale inventory allocation locked before unboxing.</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-base mt-0.5" data-icon="check">check</span>
<span className="">Zero returns on matched components with automated workshop fitment certificate.</span>
</li>
</ul>
</div>
<div className="mt-8 pt-4 border-t border-[#0213B2]/20 dark:border-[#60A5FA]/20">
<div className="flex justify-between text-xs font-mono text-[#0213B2] dark:text-[#38BDF8]">
<span className="font-medium">Labor Saved / Car:</span>
<span className="font-bold">+4.2 Workshop Hours</span>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="py-24 bg-[#E5E8F0] dark:bg-[#0B0C10] border-b border-[#D8DFEA] dark:border-[#282A3A]">
<div className="max-w-7xl mx-auto px-6 lg:px-12">
<div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
<div>
<span className="font-mono text-xs text-[#0213B2] dark:text-[#38BDF8] font-bold uppercase tracking-widest">Hardware Telemetry</span>
<h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#111827] dark:text-white uppercase mt-2">Modular Fitment Verification</h2>
<p className="text-sm sm:text-base text-[#475569] dark:text-[#E2E8F0] max-w-xl mt-1">Cross-reference aftermarket forged wheels, oversized rotor calipers, and suspension geometry in real time.</p>
</div>
<div className="mt-4 md:mt-0 flex gap-2">
<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F8FAFC] dark:bg-[#14151D] rounded-lg border border-[#D8DFEA] dark:border-[#282A3A] font-mono text-xs text-[#111827] dark:text-white">
<span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
            Telemetry Feed: ACTIVE
          </span>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

<div className="bg-[#F8FAFC] dark:bg-[#14151D] border border-[#D8DFEA] dark:border-[#282A3A] rounded-xl overflow-hidden flex flex-col md:flex-row shadow-xs">
<div className="w-full md:w-1/2 aspect-square relative bg-[#E5E8F0] dark:bg-[#181A24] p-3 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#D8DFEA] dark:border-[#282A3A]">
<div className="w-full h-full bg-white rounded-lg p-2 flex items-center justify-center shadow-xs" data-preserve-white="true">
  <img alt="Titanium forged lightweight racing wheel rim with motorsport tire" className="max-w-full max-h-full object-contain" src="/images/bbs-fi-r-wheel.jpg" />
</div>
<div className="absolute bottom-4 left-4 bg-slate-900/85 text-white backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700/60">
  SPEC: 20x11J ET48
</div>
</div>
<div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-2">
<span className="font-mono text-xs font-bold text-[#0213B2] dark:text-[#38BDF8] uppercase">Forged Series</span>
<span className="text-xs px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/40 text-emerald-700 dark:text-[#4ADE80] font-mono font-bold">PASSED</span>
</div>
<h3 className="font-display text-base font-bold text-[#111827] dark:text-white uppercase mb-3">Titanium Centerlock Lightweight Mesh</h3>
<div className="space-y-2 text-xs font-mono text-[#475569] dark:text-[#E2E8F0]">
<div className="flex justify-between border-b border-[#D8DFEA] dark:border-[#282A3A] py-1">
<span className="text-[#64748B] dark:text-[#CBD5E1]">PCD / Center Bore:</span>
<span className="text-[#111827] dark:text-white font-bold">Central Lock / 71.6mm</span>
</div>
<div className="flex justify-between border-b border-[#D8DFEA] dark:border-[#282A3A] py-1">
<span className="text-[#64748B] dark:text-[#CBD5E1]">Rotational Inertia:</span>
<span className="text-[#111827] dark:text-white font-bold">-18.4% vs Cast OEM</span>
</div>
<div className="flex justify-between border-b border-[#D8DFEA] dark:border-[#282A3A] py-1">
<span className="text-[#64748B] dark:text-[#CBD5E1]">Fender Arch Delta:</span>
<span className="text-[#0213B2] dark:text-[#38BDF8] font-bold">+3.2mm (Safe Flush)</span>
</div>
</div>
</div>
<button className="mt-6 w-full py-2.5 bg-white dark:bg-[#1E254A] hover:bg-[#EEF2FF] dark:hover:bg-[#23348C] border border-[#CBD5E1] dark:border-[#384580] hover:border-[#0213B2] text-[#111827] dark:text-[#93C5FD] hover:text-[#0213B2] dark:hover:text-white text-xs font-['Montserrat'] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs">
<span className="material-symbols-outlined text-sm" data-icon="tune">tune</span>
<span className="">Test Caliper Spacing</span>
</button>
</div>
</div>

<div className="bg-[#F8FAFC] dark:bg-[#14151D] border border-[#D8DFEA] dark:border-[#282A3A] rounded-xl overflow-hidden flex flex-col md:flex-row shadow-xs">
<div className="w-full md:w-1/2 aspect-square relative bg-[#E5E8F0] dark:bg-[#181A24] p-3 flex items-center justify-center border-b md:border-b-0 md:border-r border-[#D8DFEA] dark:border-[#282A3A]">
<div className="w-full h-full bg-white rounded-lg p-2 flex items-center justify-center shadow-xs" data-preserve-white="true">
  <img alt="High-performance carbon ceramic brake rotor and blue Brembo caliper assembly" className="max-w-full max-h-full object-contain" src="/images/brembo-gt-brake-kit.jpg" />
</div>
<div className="absolute bottom-4 left-4 bg-slate-900/85 text-white backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-mono border border-slate-700/60">
  ROTOR: 410mm Carbon-Ceramic
</div>
</div>
<div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-2">
<span className="font-mono text-xs font-bold text-[#0213B2] dark:text-[#38BDF8] uppercase">Braking Engine</span>
<span className="text-xs px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-800/40 text-emerald-700 dark:text-[#4ADE80] font-mono font-bold">PASSED</span>
</div>
<h3 className="font-display text-base font-bold text-[#111827] dark:text-white uppercase mb-3">Monobloc 6-Piston Caliper + 410mm Disc</h3>
<div className="space-y-2 text-xs font-mono text-[#475569] dark:text-[#E2E8F0]">
<div className="flex justify-between border-b border-[#D8DFEA] dark:border-[#282A3A] py-1">
<span className="text-[#64748B] dark:text-[#CBD5E1]">Axial Radial Depth:</span>
<span className="text-[#111827] dark:text-white font-bold">62.8mm Clearance</span>
</div>
<div className="flex justify-between border-b border-[#D8DFEA] dark:border-[#282A3A] py-1">
<span className="text-[#64748B] dark:text-[#CBD5E1]">Spoke Inset Margin:</span>
<span className="text-[#0213B2] dark:text-[#38BDF8] font-bold">+5.2mm (No Spacer)</span>
</div>
<div className="flex justify-between border-b border-[#D8DFEA] dark:border-[#282A3A] py-1">
<span className="text-[#64748B] dark:text-[#CBD5E1]">Thermal Dissipation:</span>
<span className="text-[#111827] dark:text-white font-bold">Class GT-Pro 850°C</span>
</div>
</div>
</div>
<button className="mt-6 w-full py-2.5 bg-white dark:bg-[#1E254A] hover:bg-[#EEF2FF] dark:hover:bg-[#23348C] border border-[#CBD5E1] dark:border-[#384580] hover:border-[#0213B2] text-[#111827] dark:text-[#93C5FD] hover:text-[#0213B2] dark:hover:text-white text-xs font-['Montserrat'] font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs">
<span className="material-symbols-outlined text-sm" data-icon="calculate">calculate</span>
<span className="">Inspect Hub Offset</span>
</button>
</div>
</div>
</div>
</div>
</section>

<section className="py-20 bg-[#E8EDFF] dark:bg-[#121833] border-b border-[#BCC7D8] dark:border-[#282A3A] relative">
<div className="max-w-4xl mx-auto px-6 text-center">
<div className="w-12 h-12 mx-auto rounded-full bg-[#D7E1FF] dark:bg-[#1E254A] flex items-center justify-center border border-[#0213B2]/30 dark:border-[#384580] mb-6 text-[#0213B2] dark:text-[#93C5FD] shadow-sm">
<span className="material-symbols-outlined text-2xl" data-icon="format_quote">format_quote</span>
</div>
<blockquote className="font-headline-md text-headline-md text-[#111827] dark:text-white leading-snug mb-8 font-semibold">
        "Virtual Tune reduced test-fit labor hours by 4.2 hours per build while eliminating parts return risk. Our technicians configure bespoke suspension and wheel packages with absolute zero mechanical hesitation."
      </blockquote>
<div className="flex flex-col items-center">
<span className="font-headline-sm text-[#06169B] dark:text-[#93C5FD] font-bold uppercase tracking-wide">Marcus Vance</span>
<span className="font-body-sm text-[#334155] dark:text-[#CBD5E1]">Lead Dyno & Performance Engineer, Apex Performance Munich</span>
</div>
</div>
</section>

<section className="py-16 bg-[#D7E1FF] dark:bg-[#10152B] border-t border-b border-[#BCC7D8] dark:border-[#282A3A] relative overflow-hidden" id="demo">
<div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none"></div>
<div className="absolute -top-24 right-0 w-96 h-96 bg-[#0213B2]/10 dark:bg-[#60A5FA]/10 rounded-full blur-3xl pointer-events-none"></div>
<div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
<div>
<span className="font-label-sm text-[#0213B2] dark:text-[#38BDF8] font-bold uppercase tracking-widest">Enterprise Rollout</span>
<h2 className="font-headline-lg text-headline-lg text-[#06169B] dark:text-white uppercase mt-1 font-black">Ready to modernize your performance workshop?</h2>
<p className="font-body-md text-[#1E293B] dark:text-[#CBD5E1] max-w-xl mt-2 font-medium">Deploy the CAD configuration and automated fitment engine across your workshop bays in under 48 hours.</p>
</div>
<div className="flex flex-wrap items-center gap-4">
<button className="px-6 py-3.5 rounded-xl bg-[#0213B2] hover:bg-[#0115BC] active:bg-[#06169B] text-white font-['Montserrat'] font-bold text-xs tracking-wider uppercase transition-all duration-150 shadow-md shadow-[#0213B2]/30 active:scale-95 cursor-pointer">
  Schedule Live Demo
</button>
<button className="px-6 py-3.5 rounded-xl bg-[#E5E8F0] dark:bg-[#1E254A] hover:bg-[#E8EDFF] dark:hover:bg-[#23348C] border-2 border-[#0213B2] dark:border-[#384580] text-[#0213B2] dark:text-[#93C5FD] hover:text-[#0115BC] dark:hover:text-white hover:border-[#0115BC] font-['Montserrat'] font-bold text-xs tracking-wider uppercase transition-all duration-150 active:scale-95 shadow-xs cursor-pointer">
  Calculate ROI
</button>
</div>
</div>
</section>

<footer className="bg-[#E5E8F0] dark:bg-[#0B0C10] border-t border-[#D8DFEA] dark:border-[#282A3A]">
<div className="w-full py-10 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
<div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded bg-[#E8EDFF] dark:bg-[#1E254A] flex items-center justify-center border border-[#0213B2]/30 dark:border-[#384580]">
<span className="material-symbols-outlined text-[#0213B2] dark:text-[#93C5FD] text-sm" data-icon="tune">tune</span>
</div>
<span className="text-headline-sm font-headline-sm font-bold text-[#111827] dark:text-white uppercase">Virtual Tune</span>
</div>
<span className="hidden md:inline text-[#D8DFEA] dark:text-[#282A3A]">|</span>
<span className="text-[#64748B] dark:text-[#CBD5E1] font-body-sm">
          © 2025 Virtual Tune Automotive Technologies Inc. Precision CAD Fitment & Workshop Telemetry. All rights reserved.
        </span>
</div>
<div className="flex flex-wrap items-center justify-center gap-6 text-xs font-medium">
<a className="text-[#475569] dark:text-[#CBD5E1] hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors" href="#fitment-api">Fitment API</a>
<a className="text-[#475569] dark:text-[#CBD5E1] hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors" href="#telemetry-docs">Telemetry Docs</a>
<a className="text-[#475569] dark:text-[#CBD5E1] hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors" href="#security">Security & Compliance</a>
<a className="text-[#475569] dark:text-[#CBD5E1] hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors" href="#terms">B2B Terms</a>
<a className="text-[#475569] dark:text-[#CBD5E1] hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors" href="#privacy">Privacy Policy</a>
<a className="text-[#475569] dark:text-[#CBD5E1] hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors" href="#status">Status</a>
</div>
</div>
</footer>



    </div>
  )
}
