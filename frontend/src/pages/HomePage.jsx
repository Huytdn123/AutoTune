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
      



<section className="relative bg-primary-container text-on-surface pt-12 pb-20 overflow-hidden border-b border-outline-variant/30">

<div className="absolute inset-0 blueprint-grid opacity-20 pointer-events-none"></div>
<div className="absolute -top-40 -left-40 w-96 h-96 bg-tertiary/10 rounded-full blur-3xl pointer-events-none"></div>
<div className="relative max-w-7xl mx-auto px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

<div className="lg:col-span-6 flex flex-col items-start z-10">

<div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-surface-container/80 border border-primary/40 mb-6 backdrop-blur-sm">
<span className="w-2 h-2 rounded-full bg-primary animate-pulse"></span>
<span className="font-label-sm text-primary tracking-widest uppercase">NEXT-GEN B2B WORKSHOP PLATFORM</span>
</div>

<h1 className="font-display text-display text-on-surface tracking-tight mb-6">
          Visualize Your Build. Fast. Accurate. Safe.
        </h1>

<p className="font-body-lg text-body-lg text-on-surface-variant max-w-xl mb-8 leading-relaxed">Empowering garages to sell customization ideas through interactive 3D visualization, automated quotation, and technical verification.</p>

<div className="flex flex-wrap items-center gap-4 mb-12 w-full sm:w-auto">
<a className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded bg-tertiary text-on-tertiary font-label-lg tracking-wider uppercase transition-all duration-150 hover:bg-tertiary-fixed active:scale-95 shadow-md" href="#demo">
<span className="">Request Demo</span>
<span className="material-symbols-outlined text-lg" data-icon="arrow_forward">arrow_forward</span>
</a>
<a className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded bg-transparent border border-secondary text-secondary-fixed font-label-lg tracking-wider uppercase transition-all duration-150 hover:border-primary hover:text-primary active:scale-95" href="#configurator">
<span className="material-symbols-outlined text-lg" data-icon="view_in_ar">view_in_ar</span>
<span className="">Try Configurator</span>
</a>
</div><div className="flex flex-wrap gap-2 mb-8"><span className="px-2 py-0.5 rounded bg-surface-container border border-primary/40 text-primary text-[10px] font-mono">[3D Configuration Saved]</span><span className="px-2 py-0.5 rounded bg-surface-container border border-primary/40 text-primary text-[10px] font-mono">[Quote Generated]</span><span className="px-2 py-0.5 rounded bg-surface-container border border-primary/40 text-primary text-[10px] font-mono">[Compatibility Verified]</span><span className="px-2 py-0.5 rounded bg-surface-container border border-primary/40 text-primary text-[10px] font-mono">[Warranty Tracked]</span><span className="px-2 py-0.5 rounded bg-surface-container border border-primary/40 text-primary text-[10px] font-mono">[Work Order Ready]</span><span className="px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant/30 text-on-surface-variant text-[10px] font-mono">[360° Preview]</span><span className="px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant/30 text-on-surface-variant text-[10px] font-mono">[Real-time 3D]</span><span className="px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant/30 text-on-surface-variant text-[10px] font-mono">[Auto-Quote Ready]</span><span className="px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant/30 text-on-surface-variant text-[10px] font-mono">[Legal-Check Passed]</span></div>

<div className="w-full pt-6 border-t border-outline-variant/30 flex flex-wrap items-center justify-between gap-4 font-label-sm text-on-surface-variant">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-base" data-icon="verified">verified</span>
<span className="font-headline-sm text-on-surface">1,200+</span>
<span className="text-body-sm text-on-surface-variant">Certified Garages</span>
</div>
<div className="h-4 w-px bg-outline-variant/40 hidden sm:block"></div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-base" data-icon="precision_manufacturing">precision_manufacturing</span>
<span className="font-headline-sm text-on-surface">99.98%</span>
<span className="text-body-sm text-on-surface-variant">Fitment Accuracy</span>
</div>
<div className="h-4 w-px bg-outline-variant/40 hidden sm:block"></div>
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary text-base" data-icon="gavel">gavel</span>
<span className="font-headline-sm text-on-surface">TÜV & DOT</span>
<span className="text-body-sm text-on-surface-variant">Approved Workflows</span>
</div>
</div>
</div>

<div className="lg:col-span-6 relative">
<div className="relative rounded-lg overflow-hidden border border-outline-variant/40 bg-surface-container-lowest/80 p-2 shadow-2xl backdrop-blur-md">

<div className="flex items-center justify-between px-3 py-2 border-b border-outline-variant/30 bg-surface-container-low mb-2 text-on-surface-variant font-label-sm">
<div className="flex items-center gap-2">
<span className="inline-block w-2.5 h-2.5 rounded-full bg-error"></span>
<span className="inline-block w-2.5 h-2.5 rounded-full bg-secondary-container"></span>
<span className="inline-block w-2.5 h-2.5 rounded-full bg-primary/40"></span>
<span className="ml-2 font-mono text-xs text-primary">CAD_STAGE_R7_SUPERCAR.VT</span>
</div>
<div className="flex items-center gap-3 font-mono text-xs">
<span className="text-on-surface-variant">XYZ: 421.4 / -12.0 / 890.1</span>
<span className="px-1.5 py-0.5 rounded bg-surface-container-high text-primary border border-outline-variant/30">60 FPS</span>
</div>
</div>

<div className="relative w-full aspect-video rounded overflow-hidden bg-surface-dim">
<img className="w-full h-full object-cover" data-alt="A cutting-edge hypercar in an atmospheric deep navy engineering hangar with an active holographic blue CAD telemetry wireframe overlay tracking fender wheel clearance and aerodynamic downforce lines, cinematic automotive studio lighting with metallic graphite body reflections." src="https://lh3.googleusercontent.com/aida-public/AB6AXuDGxkI9BFk9QA8-6anGIaia73A5flH0B6-mqiNayr5yS7oDfHjnlfYz3bEYppozbmiBA_g72z2ytV3mrH4ureMg68VxXXc2BDotF5tL78vU_rLwMqENhGmDv0wBbduFrVtTvx7WSIsiXJMyIeQx19g4tiySGXxdNYPpphIA95JaJcN48g8K34M7KZRzLUHxxc2akUbmF6ZrEAMygjtlMa6MRFfyO3KR6di166Qa4KyG_wbmpN-vXdLX" />

<div className="absolute inset-0 hud-scanner pointer-events-none opacity-40"></div>

<div className="absolute top-4 left-4 flex flex-col gap-2">
<div className="bg-surface-container-lowest/90 backdrop-blur-md border border-primary/60 px-3 py-1.5 rounded flex items-center gap-2 shadow-lg">
<span className="material-symbols-outlined text-primary text-sm" data-icon="check_circle">check_circle</span>
<span className="font-mono text-xs font-semibold text-primary">Wheel Clearance: +4.8mm PASS</span>
</div>
<div className="bg-surface-container-lowest/90 backdrop-blur-md border border-outline/40 px-3 py-1.5 rounded flex items-center gap-2 shadow-lg">
<span className="material-symbols-outlined text-on-surface-variant text-sm" data-icon="sensors">sensors</span>
<span className="font-mono text-xs text-on-surface">Camber Sweep: Dynamic Verified</span>
</div>
</div>
<div className="absolute bottom-4 right-4 flex flex-col gap-2 items-end">
<div className="bg-surface-container-lowest/90 backdrop-blur-md border border-outline/40 px-3 py-1.5 rounded flex items-center gap-2 shadow-lg">
<span className="material-symbols-outlined text-secondary text-sm" data-icon="hub">hub</span>
<span className="font-mono text-xs text-on-surface">Hub-Centric: 71.6mm Match</span>
</div>
<div className="bg-surface-container-lowest/90 backdrop-blur-md border border-primary/50 px-3 py-1.5 rounded flex items-center gap-2 shadow-lg">
<span className="material-symbols-outlined text-primary text-sm" data-icon="air">air</span>
<span className="font-mono text-xs font-semibold text-primary">Aero Downforce Delta: +42 kg</span>
</div>
</div>

<div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 pointer-events-none flex flex-col items-center">
<div className="w-8 h-8 border border-primary/60 rounded-full flex items-center justify-center">
<div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
</div>
<span className="font-mono text-[9px] bg-surface-container-lowest/80 text-primary px-1 mt-1 border border-primary/30">PCD 5x130</span>
</div>
</div>

<div className="flex items-center justify-between pt-2 px-1 text-on-surface-variant font-label-sm">
<span className="text-xs">Tire Stance: 325/30 R20 Michelin Pilot Sport Cup 2</span>
<div className="flex items-center gap-2">
<button className="px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant/30 text-xs hover:text-primary transition-colors">Iso View</button>
<button className="px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant/30 text-xs hover:text-primary transition-colors">Mesh View</button>
<button className="px-2 py-0.5 rounded bg-surface-container-high border border-outline-variant/30 text-xs hover:text-primary transition-colors">Stress Map</button>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="py-10 bg-surface-container-lowest border-b border-outline-variant/20">
<div className="max-w-7xl mx-auto px-6 lg:px-12">
<p className="font-label-sm text-center uppercase tracking-widest text-outline mb-6">
        Trusted by High-Performance Garages & OEM Component Manufacturers
      </p>
<div className="flex flex-wrap items-center justify-center md:justify-between gap-8 opacity-75 grayscale hover:grayscale-0 transition-all">
<div className="flex items-center gap-2 font-headline-sm uppercase tracking-wider text-secondary">
<span className="material-symbols-outlined text-primary text-xl" data-icon="sports_motorsports">sports_motorsports</span>
<span className="">Apex Dynamics</span>
</div>
<div className="flex items-center gap-2 font-headline-sm uppercase tracking-wider text-secondary">
<span className="material-symbols-outlined text-primary text-xl" data-icon="build_circle">build_circle</span>
<span className="">Brembo Tech</span>
</div>
<div className="flex items-center gap-2 font-headline-sm uppercase tracking-wider text-secondary">
<span className="material-symbols-outlined text-primary text-xl" data-icon="height">height</span>
<span className="">KW Suspension</span>
</div>
<div className="flex items-center gap-2 font-headline-sm uppercase tracking-wider text-secondary">
<span className="material-symbols-outlined text-primary text-xl" data-icon="oil_barrel">oil_barrel</span>
<span className="">Motul Labs</span>
</div>
<div className="flex items-center gap-2 font-headline-sm uppercase tracking-wider text-secondary">
<span className="material-symbols-outlined text-primary text-xl" data-icon="album">album</span>
<span className="">BBS Motorsport</span>
</div>
</div>
</div>
</section>

<section className="py-24 bg-surface border-b border-outline-variant/30" id="platform">
<div className="max-w-7xl mx-auto px-6 lg:px-12">
<div className="mb-16">
<div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-surface-container border border-outline-variant/40 mb-3">
<span className="font-label-sm text-primary uppercase tracking-wider">Engineered Architecture</span>
</div>
<h2 className="font-headline-lg text-headline-lg text-on-surface uppercase tracking-tight">
          Precision Customization Modules
        </h2>
<p className="font-body-md text-body-md text-on-surface-variant max-w-2xl mt-2">
          Replace physical test-fit guesswork with aerospace-grade CAD verification and instant wholesale quoting.
        </p>
</div>
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"><div className="bg-surface-container-low border border-outline-variant/30 rounded p-6 hover:border-primary/60 transition-all duration-200 flex flex-col justify-between group"><div><div className="w-12 h-12 rounded bg-surface-container-high border border-outline-variant/40 flex items-center justify-center mb-6 group-hover:border-primary"><span className="material-symbols-outlined text-primary text-2xl" data-icon="view_in_ar">view_in_ar</span></div><div className="flex items-center gap-2 mb-1"><span className="font-mono text-xs text-primary/80 uppercase tracking-wider">Core Triad // 01</span><span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">[Real-time 3D]</span></div><h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 mb-3">Interactive 3D Configurator</h3><p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Ray-traced CAD mesh rendering, 360° vehicle preview, live paint matching, bespoke wheel and aero package staging with sub-millimeter precision.</p></div><div className="pt-6 mt-6 border-t border-outline-variant/20 flex items-center justify-between font-label-sm text-primary"><span className="">[3D Configuration Saved]</span><span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span></div></div><div className="bg-surface-container-low border border-outline-variant/30 rounded p-6 hover:border-primary/60 transition-all duration-200 flex flex-col justify-between group"><div><div className="w-12 h-12 rounded bg-surface-container-high border border-outline-variant/40 flex items-center justify-center mb-6 group-hover:border-primary"><span className="material-symbols-outlined text-primary text-2xl" data-icon="request_quote">request_quote</span></div><div className="flex items-center gap-2 mb-1"><span className="font-mono text-xs text-primary/80 uppercase tracking-wider">Core Triad // 02</span><span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">[Auto-Quote Ready]</span></div><h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 mb-3">Automated Quotation & Margin Engine</h3><p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Instant wholesale part acquisition calculations, shop bay labor matrix staging, live supplier ERP sync, and one-click work order compilation.</p></div><div className="pt-6 mt-6 border-t border-outline-variant/20 flex items-center justify-between font-label-sm text-primary"><span className="">[Quote Generated] & [Work Order Ready]</span><span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span></div></div><div className="bg-surface-container-low border border-outline-variant/30 rounded p-6 hover:border-primary/60 transition-all duration-200 flex flex-col justify-between group"><div><div className="w-12 h-12 rounded bg-surface-container-high border border-outline-variant/40 flex items-center justify-center mb-6 group-hover:border-primary"><span className="material-symbols-outlined text-primary text-2xl" data-icon="sensors">sensors</span></div><div className="flex items-center gap-2 mb-1"><span className="font-mono text-xs text-primary/80 uppercase tracking-wider">Core Triad // 03</span><span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">[Compatibility Verified]</span></div><h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 mb-3">Smart Data Mapping & Technical Verification</h3><p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Real-time kinematic sweep checks for strut & caliper clearance, dynamic scrub radius telemetry, fender roll detection, and zero-scrap assurance.</p></div><div className="pt-6 mt-6 border-t border-outline-variant/20 flex items-center justify-between font-label-sm text-primary"><span className="">Zero Scrap Guarantee</span><span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span></div></div><div className="bg-surface-container-low border border-outline-variant/30 rounded p-6 hover:border-primary/60 transition-all duration-200 flex flex-col justify-between group"><div><div className="w-12 h-12 rounded bg-surface-container-high border border-outline-variant/40 flex items-center justify-center mb-6 group-hover:border-primary"><span className="material-symbols-outlined text-primary text-2xl" data-icon="verified_user">verified_user</span></div><div className="flex items-center gap-2 mb-1"><span className="font-mono text-xs text-primary/80 uppercase tracking-wider">Module // 04</span><span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/30">[Legal-Check Passed]</span></div><h3 className="font-headline-sm text-headline-sm text-on-surface mt-1 mb-3">Legal & TÜV Homologation Engine</h3><p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">Automated compliance paperwork generation, wheel track delta analysis, OEM parts warranty tracking, and tamper-proof digital vehicle build passports.</p></div><div className="pt-6 mt-6 border-t border-outline-variant/20 flex items-center justify-between font-label-sm text-primary"><span className="">[Warranty Tracked] Homologation</span><span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span></div></div></div>
</div>
</section>

<section className="py-24 bg-surface-container-lowest border-b border-outline-variant/30" id="fitment-engine">
<div className="max-w-7xl mx-auto px-6 lg:px-12">
<div className="text-center max-w-3xl mx-auto mb-16">
<span className="font-label-sm text-primary uppercase tracking-widest">Operational Comparison</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface uppercase mt-2">
          From Trial-and-Error to Digital Pre-Assembly
        </h2>
<p className="font-body-md text-on-surface-variant mt-2">
          Eliminate bay downtime and customer disputes with instant mathematical fitment modeling.
        </p>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">

<div className="bg-surface-container-low border border-outline-variant/20 rounded p-8 flex flex-col justify-between">
<div>
<div className="flex items-center justify-between pb-4 border-b border-outline-variant/20 mb-6">
<span className="font-headline-sm text-error uppercase">Traditional Manual Fitment</span>
<span className="px-2 py-0.5 rounded bg-error-container text-error text-xs font-mono">High Risk</span>
</div>
<ul className="space-y-4 font-body-sm text-on-surface-variant">
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-error text-base mt-0.5" data-icon="close">close</span>
<span className="">Unbox custom wheels and mount tires prior to verifying brake caliper inner-bell spacing.</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-error text-base mt-0.5" data-icon="close">close</span>
<span className="">Unplanned fender rubbing under full suspension compression discovered during road test.</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-error text-base mt-0.5" data-icon="close">close</span>
<span className="">4.5 hours average bay downtime waiting for wheel spacers or emergency hub rings.</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-error text-base mt-0.5" data-icon="close">close</span>
<span className="">High wholesale restocking fees (15-25%) for scratched or mounted returns.</span>
</li>
</ul>
</div>
<div className="mt-8 pt-4 border-t border-outline-variant/20">
<div className="flex justify-between text-xs font-mono text-outline">
<span className="">Estimated Bay Loss / Car:</span>
<span className="text-error font-semibold">$380 - $750</span>
</div>
</div>
</div>

<div className="bg-primary-container/40 border border-primary/50 rounded p-8 flex flex-col justify-between relative overflow-hidden">
<div className="absolute -right-12 -top-12 w-48 h-48 bg-primary/10 rounded-full blur-2xl"></div>
<div>
<div className="flex items-center justify-between pb-4 border-b border-primary/30 mb-6">
<span className="font-headline-sm text-primary uppercase">Virtual Tune Engine</span>
<span className="px-2 py-0.5 rounded bg-surface-container text-primary text-xs font-mono border border-primary/40">Verified Safe</span>
</div>
<ul className="space-y-4 font-body-sm text-on-surface">
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-primary text-base mt-0.5" data-icon="check">check</span>
<span className="">Optical OEM 3D laser scan alignment with exact barrel and caliper offset tolerance matrix.</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-primary text-base mt-0.5" data-icon="check">check</span>
<span className="">Dynamic scrub radius and suspension articulation simulated under peak G-load.</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-primary text-base mt-0.5" data-icon="check">check</span>
<span className="">Automated bill-of-materials and wholesale inventory allocation locked before unboxing.</span>
</li>
<li className="flex items-start gap-3">
<span className="material-symbols-outlined text-primary text-base mt-0.5" data-icon="check">check</span>
<span className="">Zero returns on matched components with automated workshop fitment certificate.</span>
</li>
</ul>
</div>
<div className="mt-8 pt-4 border-t border-primary/30">
<div className="flex justify-between text-xs font-mono text-primary">
<span className="">Labor Saved / Car:</span>
<span className="font-bold">+4.2 Workshop Hours</span>
</div>
</div>
</div>
</div>
</div>
</section>

<section className="py-24 bg-surface border-b border-outline-variant/30">
<div className="max-w-7xl mx-auto px-6 lg:px-12">
<div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
<div>
<span className="font-label-sm text-primary uppercase tracking-widest">Hardware Telemetry</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface uppercase mt-2">Modular Fitment Verification</h2>
<p className="font-body-md text-on-surface-variant max-w-xl mt-1">Cross-reference aftermarket forged wheels, oversized rotor calipers, and suspension geometry in real time.</p>
</div>
<div className="mt-4 md:mt-0 flex gap-2">
<span className="inline-flex items-center gap-1.5 px-3 py-1 bg-surface-container rounded border border-outline-variant/30 font-mono text-xs text-on-surface">
<span className="w-2 h-2 rounded-full bg-primary"></span>
            Telemetry Feed: ACTIVE
          </span>
</div>
</div>
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

<div className="bg-surface-container-low border border-outline-variant/40 rounded overflow-hidden flex flex-col md:flex-row">
<div className="w-full md:w-1/2 aspect-square relative bg-surface-container-lowest">
<img alt="Titanium forged lightweight racing wheel rim with motorsport tire" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1V0K7BJ_Lv7bOtZRfFvohsQLg02F0V-BMVUU4Dp4CjLvL58cvlKmNMZtlUrZ3F3Ph3V2z-2ZVZHpBUwFa4k2ue3IM3a_HeGhOIWk297-JJb7Muex5B7NuHYuTmIWxzsPkQ55nJBx82nFgaRBuUvPnbp-jHOZnJtKek7kSR9Pb5mLyU10KJPfgLIUWG2qSLAxvYRpHODzy9mBfYrjQnPVADHpEEGyjBxvftjNC1UgLSVHcj9WSJlSbxn2zo" />
<div className="absolute bottom-2 left-2 bg-surface-container-lowest/90 px-2 py-0.5 rounded text-[10px] font-mono text-primary border border-outline-variant/30">
              SPEC: 20x11J ET48
            </div>
</div>
<div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-2">
<span className="font-label-sm text-primary uppercase">Forged Series</span>
<span className="text-xs px-2 py-0.5 rounded bg-surface-container border border-primary/40 text-primary">PASSED</span>
</div>
<h3 className="font-headline-sm text-on-surface uppercase mb-3">Titanium Centerlock Lightweight Mesh</h3>
<div className="space-y-2 text-xs font-mono text-on-surface-variant">
<div className="flex justify-between border-b border-outline-variant/20 py-1">
<span className="">PCD / Center Bore:</span>
<span className="text-on-surface">Central Lock / 71.6mm</span>
</div>
<div className="flex justify-between border-b border-outline-variant/20 py-1">
<span className="">Rotational Inertia:</span>
<span className="text-on-surface">-18.4% vs Cast OEM</span>
</div>
<div className="flex justify-between border-b border-outline-variant/20 py-1">
<span className="">Fender Arch Delta:</span>
<span className="text-on-surface">+3.2mm (Safe Flush)</span>
</div>
</div>
</div>
<button className="mt-6 w-full py-2 bg-surface-container-high hover:bg-surface-bright border border-outline-variant/40 text-on-surface text-xs font-label-md uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-sm" data-icon="tune">tune</span>
<span className="">Test Caliper Spacing</span>
</button>
</div>
</div>

<div className="bg-surface-container-low border border-outline-variant/40 rounded overflow-hidden flex flex-col md:flex-row">
<div className="w-full md:w-1/2 aspect-square relative bg-surface-container-lowest">
<img alt="High-performance carbon ceramic brake rotor and blue Brembo caliper assembly" className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida/AEtjO1UDmA90fePaJuCj9HjvF1tZ0O2HGdMc_XYeAJOKbgIaA2_iPw-ufTR_J9UcGqibWAk6OcT1TJ1dOjUq3Hgfv4CuZnVn5_wZfNxooHBKE_jXnHXgTnfXyCZiQnnDpM7-vO_TiIToWPfRyMomxPBEX5EEnTcbNlcrxZsXTwR5k575vwJhJ6gEPkzFz4QGKZltazWy9gn7eIW5fL5I_PwsGaLaeOgREtODCQ-yQ1ON0WpqJnnZLOT59IF_SAQ" />
<div className="absolute bottom-2 left-2 bg-surface-container-lowest/90 px-2 py-0.5 rounded text-[10px] font-mono text-primary border border-outline-variant/30">
              ROTOR: 410mm Carbon-Ceramic
            </div>
</div>
<div className="w-full md:w-1/2 p-6 flex flex-col justify-between">
<div>
<div className="flex items-center justify-between mb-2">
<span className="font-label-sm text-primary uppercase">Braking Engine</span>
<span className="text-xs px-2 py-0.5 rounded bg-surface-container border border-primary/40 text-primary">PASSED</span>
</div>
<h3 className="font-headline-sm text-on-surface uppercase mb-3">Monobloc 6-Piston Caliper + 410mm Disc</h3>
<div className="space-y-2 text-xs font-mono text-on-surface-variant">
<div className="flex justify-between border-b border-outline-variant/20 py-1">
<span className="">Axial Radial Depth:</span>
<span className="text-on-surface">62.8mm Clearance</span>
</div>
<div className="flex justify-between border-b border-outline-variant/20 py-1">
<span className="">Spoke Inset Margin:</span>
<span className="text-primary font-bold">+5.2mm (No Spacer)</span>
</div>
<div className="flex justify-between border-b border-outline-variant/20 py-1">
<span className="">Thermal Dissipation:</span>
<span className="text-on-surface">Class GT-Pro 850°C</span>
</div>
</div>
</div>
<button className="mt-6 w-full py-2 bg-surface-container-high hover:bg-surface-bright border border-outline-variant/40 text-on-surface text-xs font-label-md uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2">
<span className="material-symbols-outlined text-sm" data-icon="calculate">calculate</span>
<span className="">Inspect Hub Offset</span>
</button>
</div>
</div>
</div>
</div>
</section>

<section className="py-20 bg-surface-container-lowest border-b border-outline-variant/20 relative">
<div className="max-w-4xl mx-auto px-6 text-center">
<div className="w-12 h-12 mx-auto rounded-full bg-surface-container flex items-center justify-center border border-primary/40 mb-6 text-primary">
<span className="material-symbols-outlined text-2xl" data-icon="format_quote">format_quote</span>
</div>
<blockquote className="font-headline-md text-headline-md text-on-surface leading-snug mb-8">
        "Virtual Tune reduced test-fit labor hours by 4.2 hours per build while eliminating parts return risk. Our technicians configure bespoke suspension and wheel packages with absolute zero mechanical hesitation."
      </blockquote>
<div className="flex flex-col items-center">
<span className="font-headline-sm text-primary uppercase tracking-wide">Marcus Vance</span>
<span className="font-body-sm text-on-surface-variant">Lead Dyno & Performance Engineer, Apex Performance Munich</span>
</div>
</div>
</section>

<section className="py-20 bg-primary-container relative overflow-hidden" id="demo">
<div className="absolute inset-0 blueprint-grid opacity-15 pointer-events-none"></div>
<div className="relative max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
<div>
<span className="font-label-sm text-primary uppercase tracking-widest">Enterprise Rollout</span>
<h2 className="font-headline-lg text-headline-lg text-on-surface uppercase mt-1">Ready to modernize your performance workshop?</h2>
<p className="font-body-md text-on-surface-variant max-w-xl mt-2">Deploy the CAD configuration and automated fitment engine across your workshop bays in under 48 hours.</p>
</div>
<div className="flex flex-wrap items-center gap-4">
<button className="px-6 py-3.5 rounded bg-tertiary text-on-tertiary font-label-lg tracking-wider uppercase transition-all duration-150 hover:bg-tertiary-fixed shadow-md active:scale-95">
          Schedule Live Demo
        </button>
<button className="px-6 py-3.5 rounded bg-transparent border border-outline text-on-surface font-label-lg tracking-wider uppercase transition-all duration-150 hover:border-primary hover:text-primary active:scale-95">
          Calculate ROI
        </button>
</div>
</div>
</section>

<footer className="bg-surface-container-lowest dark:bg-surface-container-lowest docked full-width bottom border-t border-outline-variant/20 flat no shadows">
<div className="w-full py-12 px-6 lg:px-12 max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
<div className="flex flex-col md:flex-row items-center gap-4 text-center md:text-left">
<div className="flex items-center gap-2">
<div className="w-6 h-6 rounded bg-primary-container flex items-center justify-center border border-primary/40">
<span className="material-symbols-outlined text-primary text-sm" data-icon="tune">tune</span>
</div>
<span className="text-headline-sm font-headline-sm font-bold text-on-surface dark:text-on-surface uppercase">Virtual Tune</span>
</div>
<span className="hidden md:inline text-outline-variant">|</span>
<span className="text-on-surface-variant dark:text-on-surface-variant font-body-sm">
          © 2025 Virtual Tune Automotive Technologies Inc. Precision CAD Fitment & Workshop Telemetry. All rights reserved.
        </span>
</div>
<div className="flex flex-wrap items-center justify-center gap-6 text-label-sm font-label-sm">
<a className="text-on-surface-variant dark:text-on-surface-variant font-body-sm hover:text-primary dark:hover:text-primary transition-colors" href="#fitment-api">Fitment API</a>
<a className="text-on-surface-variant dark:text-on-surface-variant font-body-sm hover:text-primary dark:hover:text-primary transition-colors" href="#telemetry-docs">Telemetry Docs</a>
<a className="text-on-surface-variant dark:text-on-surface-variant font-body-sm hover:text-primary dark:hover:text-primary transition-colors" href="#security">Security & Compliance</a>
<a className="text-on-surface-variant dark:text-on-surface-variant font-body-sm hover:text-primary dark:hover:text-primary transition-colors" href="#terms">B2B Terms</a>
<a className="text-on-surface-variant dark:text-on-surface-variant font-body-sm hover:text-primary dark:hover:text-primary transition-colors" href="#privacy">Privacy Policy</a>
<a className="text-on-surface-variant dark:text-on-surface-variant font-body-sm hover:text-primary dark:hover:text-primary transition-colors" href="#status">Status</a>
</div>
</div>
</footer>



    </div>
  )
}
