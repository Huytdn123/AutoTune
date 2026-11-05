import React from 'react'
import { Link } from 'react-router-dom'

/**
 * HeroShowcaseSection - Cinematic hero section highlighting Virtual Tune 3D Studio,
 * zero-clearance fitment verification, and certified garage connectivity.
 */
export default function HeroShowcaseSection({ onLaunchConfigurator }) {
  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28 border-b border-[#D8DFEA] dark:border-[#282A3A] bg-gradient-to-b from-[#E8EDFF]/70 via-[#F3F5FA] to-[#F3F5FA] dark:from-[#121833]/60 dark:via-[#0B0C10] dark:to-[#0B0C10]">
      {/* Subtle engineering background mesh */}
      <div className="absolute inset-0 blueprint-grid opacity-20 dark:opacity-10 pointer-events-none"></div>
      <div className="absolute -top-32 right-0 w-[550px] h-[550px] bg-[#0213B2]/10 dark:bg-[#3B82F6]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        {/* Left Column: Core Value Proposition & Actionable CTAs */}
        <div className="lg:col-span-6 flex flex-col items-start z-10">
          {/* Status Pill */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white dark:bg-[#14151D] border border-[#CBD5E1] dark:border-[#282A3A] shadow-xs mb-6 animate-hero-pill" data-preserve-white="true">
            <span className="w-2.5 h-2.5 rounded-full bg-[#16A34A] animate-pulse"></span>
            <span className="text-xs font-['Montserrat'] font-bold text-[#0213B2] dark:text-[#60A5FA] uppercase tracking-wider">
              Virtual Tune 3D Studio & Workshop Network
            </span>
          </div>

          {/* Headline */}
          <h1 className="font-['Montserrat'] text-3xl sm:text-4xl lg:text-5xl font-black text-[#111827] dark:text-white tracking-tight leading-[1.15] mb-6 animate-hero-title">
            Precision 3D Customization. <br className="hidden sm:inline" />
            <span className="text-[#0213B2] dark:text-[#60A5FA]">Directly Connected</span> to Garages.
          </h1>

          {/* Description */}
          <p className="text-base sm:text-lg text-[#475569] dark:text-[#CBD5E1] leading-relaxed max-w-xl mb-8 animate-hero-desc">
            Visualize your bespoke sports car in interactive 3D: customize body paint finishes, forged wheels, and carbon aerodynamics with zero-clearance fitment verification before sending direct work orders to certified workshops.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-4 w-full sm:w-auto mb-10 animate-hero-cta">
            <button
              id="hero-launch-configurator-btn"
              onClick={() => onLaunchConfigurator()}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-xl bg-[#0213B2] hover:bg-[#0115BC] active:bg-[#06169B] text-white font-['Montserrat'] font-bold text-sm tracking-wider uppercase transition-all duration-150 shadow-lg shadow-[#0213B2]/25 active:scale-95 cursor-pointer"
            >
              <span className="material-symbols-outlined text-xl">view_in_ar</span>
              <span>Launch 3D Studio</span>
            </button>

            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-white dark:bg-[#14151D] hover:bg-slate-50 dark:hover:bg-[#1B1D28] border-2 border-[#CBD5E1] dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] text-[#111827] dark:text-white font-['Montserrat'] font-bold text-sm tracking-wider uppercase transition-all duration-150 active:scale-95 shadow-xs cursor-pointer"
              data-preserve-white="true"
            >
              <span className="material-symbols-outlined text-lg text-[#0213B2] dark:text-[#60A5FA]">storefront</span>
              <span>Browse Performance Parts</span>
            </Link>
          </div>

          {/* Feature Highlights Grid */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-[#D8DFEA] dark:border-[#282A3A] w-full text-left animate-hero-stats">
            <div>
              <p className="text-xs font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">Real-Time</p>
              <p className="text-xs sm:text-sm font-semibold text-[#111827] dark:text-white mt-0.5">3D Canvas 360°</p>
            </div>
            <div>
              <p className="text-xs font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">Sub-Millimeter</p>
              <p className="text-xs sm:text-sm font-semibold text-[#111827] dark:text-white mt-0.5">Fitment Engine</p>
            </div>
            <div>
              <p className="text-xs font-mono font-bold uppercase text-[#0213B2] dark:text-[#60A5FA]">100% Transparent</p>
              <p className="text-xs sm:text-sm font-semibold text-[#111827] dark:text-white mt-0.5">Automated Quotes</p>
            </div>
          </div>
        </div>

        {/* Right Column: Hero Visual Showcase */}
        <div className="lg:col-span-6 relative animate-hero-visual">
          <div className="relative rounded-2xl overflow-hidden border border-[#CBD5E1] dark:border-[#282A3A] bg-white dark:bg-[#14151D] shadow-2xl p-2.5 transition-all group" data-preserve-white="true">
            {/* Studio Window Bar */}
            <div className="flex items-center justify-between px-3 py-2 border-b border-[#E2E8F0] dark:border-[#282A3A] bg-[#F8FAFC] dark:bg-[#1A1D28] rounded-t-xl mb-2 text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]"></span>
                <span className="ml-2 font-bold text-[#0213B2] dark:text-[#60A5FA]">VirtualTune_Studio_3D</span>
              </div>
              <div className="flex items-center gap-2 text-[#64748B] dark:text-[#94A3B8]">
                <span className="w-2 h-2 rounded-full bg-[#16A34A]"></span>
                <span>Interactive Engine Ready</span>
              </div>
            </div>

            {/* Main Cinematic Visual */}
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-900 group">
              <img
                src="/images/cars/ferrari-458.webp"
                alt="Virtual Tune Ferrari 458 Spider High-Performance Supercar in 3D Showroom"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                loading="eager"
              />

              {/* Ambient vignette overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent pointer-events-none"></div>

              {/* Floating Interactive Badge */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-none">
                <div className="bg-slate-900/85 backdrop-blur-md border border-white/20 text-white px-3.5 py-2 rounded-xl text-xs font-mono">
                  <span className="text-[#60A5FA] font-bold">Ferrari 458 Spider</span> · Rosso Corsa · BBS LM 20"
                </div>
                <div className="hidden sm:inline-flex bg-[#0213B2]/90 backdrop-blur-md border border-white/25 text-white px-3 py-1.5 rounded-xl text-xs font-['Montserrat'] font-bold uppercase tracking-wider">
                  Ready for Staging
                </div>
              </div>
            </div>

            {/* Quick Launch Bottom Bar */}
            <div className="p-3 flex items-center justify-between text-xs text-[#475569] dark:text-[#94A3B8]">
              <span className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm text-[#0213B2] dark:text-[#60A5FA]">check_circle</span>
                <span>Full 360° orbit, custom paint matching, aero wings, and caliper clearances</span>
              </span>
              <button
                onClick={() => onLaunchConfigurator()}
                className="text-xs font-['Montserrat'] font-bold text-[#0213B2] dark:text-[#60A5FA] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>Open Full Studio</span>
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

