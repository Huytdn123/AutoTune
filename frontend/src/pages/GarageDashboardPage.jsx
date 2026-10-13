import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { garageApi, workOrderApi, quotationApi, carApi } from '../services/api'

/**
 * GarageDashboardPage - Garage Operations & Executive Dashboard
 * Virtual Tune Automotive Precision System
 */
export default function GarageDashboardPage() {
  const navigate = useNavigate()
  const { currentUser, role } = useAuth()
  const [metrics, setMetrics] = useState(null)
  const [workOrders, setWorkOrders] = useState([])
  const [quotations, setQuotations] = useState([])
  const [cars, setCars] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchDashboardData = async () => {
    setLoading(true)
    setError(null)
    try {
      const [metricsData, woData, quoteData, carsData] = await Promise.allSettled([
        garageApi.getMetrics(),
        workOrderApi.getAll(),
        quotationApi.getAll(),
        carApi.getAll()
      ])

      if (metricsData.status === 'fulfilled') setMetrics(metricsData.value)
      if (woData.status === 'fulfilled') {
        const data = woData.value
        setWorkOrders(Array.isArray(data) ? data : (data?.data || []))
      }
      if (quoteData.status === 'fulfilled') {
        const data = quoteData.value
        setQuotations(Array.isArray(data) ? data : (data?.data || []))
      }
      if (carsData.status === 'fulfilled') {
        const data = carsData.value
        setCars(Array.isArray(data) ? data : (data?.data || []))
      }
    } catch (err) {
      setError('Unable to load all data from server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const formatVnd = (num) => {
    if (!num) return '0 ₫'
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(num)
  }

  return (
    <div className="bg-background text-on-surface antialiased min-min-h-[calc(100vh-4rem)] flex flex-col font-body-md text-body-md overflow-x-hidden selection:bg-primary-container selection:text-primary min-h-[calc(100vh-4rem)] flex flex-col flex-1 w-full">
      



<main className="flex-1 overflow-y-auto custom-scroll p-4 md:p-6 lg:p-8 space-y-6">

<div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 p-6 bg-[#E8EDFF] rounded-2xl border border-[#BCC7D8] shadow-xs">
<div>
<div className="flex items-center gap-2 mb-1">
<span className="px-2 py-0.5 rounded bg-white text-[#0213B2] text-label-sm font-label-sm uppercase font-bold tracking-wider border border-[#0213B2]/20 shadow-xs">Operational Overview</span>
<span className="text-[#0213B2] text-body-sm font-bold">•</span>
<span className="text-[#334155] text-body-sm font-body-sm font-medium">Real-time sync: Active</span>
</div>
<h1 className="font-headline-lg text-headline-lg text-[#06169B] tracking-tight font-extrabold">Garage Operations Dashboard</h1>
<p className="font-body-md text-body-md text-[#334155] mt-0.5">High-precision overview of ongoing vehicle builds, stage completions, and client pipelines.</p>
</div>

<div className="flex flex-wrap items-center gap-2.5">
<button className="inline-flex items-center gap-2 px-3.5 py-2 bg-[#0213B2] text-white font-label-lg rounded-xl shadow hover:bg-[#0115BC] active:bg-[#06169B] transition-all active:scale-[0.98] cursor-pointer">
<span className="material-symbols-outlined text-lg" data-icon="assignment_add">assignment_add</span>
<span>New Work Order</span>
</button>
<button className="inline-flex items-center gap-2 px-3.5 py-2 bg-white text-[#0213B2] border border-[#CBD5E1] hover:border-[#0213B2] hover:bg-[#EEF2FF] font-label-md rounded-xl transition-all active:scale-[0.98] shadow-xs cursor-pointer">
<span className="material-symbols-outlined text-lg" data-icon="view_in_ar">view_in_ar</span>
<span>Launch 3D Configurator</span>
</button>
<button className="inline-flex items-center gap-2 px-3.5 py-2 bg-white text-[#111827] border border-[#CBD5E1] hover:border-[#0213B2] hover:text-[#0213B2] hover:bg-[#EEF2FF] font-label-md rounded-xl transition-all active:scale-[0.98] shadow-xs cursor-pointer">
<span className="material-symbols-outlined text-lg" data-icon="fact_check">fact_check</span>
<span>Run Fitment Check</span>
</button>
<button className="inline-flex items-center gap-2 px-3 py-2 bg-white text-[#475569] hover:text-[#111827] border border-[#CBD5E1] hover:border-[#94A3B8] hover:bg-[#F8FAFC] rounded-xl font-label-md transition-all active:scale-[0.98] shadow-xs cursor-pointer">
<span className="material-symbols-outlined text-lg" data-icon="file_download">file_download</span>
<span>Export P&L Report</span>
</button>
</div>
</div>

<section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">

<div className="bg-[#E8EDFF] p-5 rounded-xl border-2 border-[#0213B2]/30 relative overflow-hidden flex flex-col justify-between shadow-sm">
<div className="flex items-center justify-between text-[#06169B] mb-2">
<span className="font-label-md text-label-md uppercase tracking-wider font-bold">Monthly Revenue</span>
<div className="w-8 h-8 rounded-xl bg-[#D7E1FF] border border-[#0213B2]/30 flex items-center justify-center text-[#0213B2]">
<span className="material-symbols-outlined text-base" data-icon="payments">payments</span>
</div>
</div>
<div>
<div className="flex items-baseline gap-2">
<span className="font-headline-lg text-headline-lg font-bold text-[#06169B]">
  {formatVnd(metrics?.monthlyRevenueVnd || 845000000)}
</span>
</div>
<div className="flex items-center gap-1.5 mt-2">
<span className="inline-flex items-center text-label-sm font-label-sm text-[#0213B2] px-1.5 py-0.5 rounded bg-white border border-[#0213B2]/20 font-bold">
<span className="material-symbols-outlined text-xs mr-0.5" data-icon="trending_up">trending_up</span>
                +18.4%
              </span>
<span className="text-body-sm font-body-sm text-[#334155]">September 2026</span>
</div>
</div>
<div className="w-full bg-[#D7E1FF] h-1.5 rounded-full mt-4 overflow-hidden">
<div className="bg-[#0213B2] h-full rounded-full" style={{ width: "82%" }}></div>
</div>
</div>

<div className="bg-white p-5 rounded-xl border border-[#D8DFEA] relative overflow-hidden flex flex-col justify-between shadow-xs">
<div className="flex items-center justify-between text-[#475569] mb-2">
<span className="font-label-md text-label-md uppercase tracking-wider text-[#64748B]">Work Bays</span>
<div className="w-8 h-8 rounded-xl bg-[#E8EDFF] flex items-center justify-center text-[#0213B2]">
<span className="material-symbols-outlined text-base" data-icon="car_repair">car_repair</span>
</div>
</div>
<div>
<div className="flex items-baseline gap-2">
<span className="font-headline-lg text-headline-lg font-bold text-on-surface">
  {metrics?.baysOccupied || 3} <span className="text-headline-md font-headline-md text-outline">/ {metrics?.totalBays || 4}</span>
</span>
<span className="font-label-sm text-label-sm text-tertiary px-2 py-0.5 rounded-DEFAULT bg-tertiary-container/40">
  {metrics ? Math.round((metrics.baysOccupied / metrics.totalBays) * 100) : 75}% Capacity
</span>
</div>
<p className="text-body-sm font-body-sm text-on-surface-variant mt-2">
  {(metrics?.totalBays || 4) - (metrics?.baysOccupied || 3)} bays available for intake
</p>
</div>
<div className="flex gap-1.5 mt-4">
<div className="h-1.5 flex-1 bg-primary rounded-full"></div>
<div className="h-1.5 flex-1 bg-primary rounded-full"></div>
<div className="h-1.5 flex-1 bg-primary rounded-full"></div>
<div className="h-1.5 flex-1 bg-primary rounded-full"></div>
<div className="h-1.5 flex-1 bg-primary rounded-full"></div>
<div className="h-1.5 flex-1 bg-primary rounded-full"></div>
<div className="h-1.5 flex-1 bg-surface-container-highest rounded-full"></div>
<div className="h-1.5 flex-1 bg-surface-container-highest rounded-full"></div>
</div>
</div>

<div className="bg-surface-container-low p-5 rounded-xl border border-outline-variant/30 relative overflow-hidden flex flex-col justify-between">
<div className="flex items-center justify-between text-on-surface-variant mb-2">
<span className="font-label-md text-label-md uppercase tracking-wider text-outline">Pending Quotations</span>
<div className="w-8 h-8 rounded-xl bg-surface-container-high flex items-center justify-center text-on-surface">
<span className="material-symbols-outlined text-base" data-icon="description">description</span>
</div>
</div>
<div>
<div className="flex items-baseline gap-2">
<span className="font-headline-lg text-headline-lg font-bold text-on-surface">14</span>
<span className="font-body-sm font-body-sm text-outline">Awaiting Sign-off</span>
</div>
<p className="text-body-sm font-body-sm text-on-surface-variant mt-2">Est. potential pipeline: <strong className="text-on-surface font-medium">$86,400</strong></p>
</div>
<div className="w-full bg-surface-container-highest h-1 rounded-full mt-4 overflow-hidden">
<div className="bg-tertiary h-full rounded-full" style={{ width: "58%" }}></div>
</div>
</div>

<div className="bg-[#E8EDFF] p-5 rounded-xl border-2 border-[#0213B2]/30 relative overflow-hidden flex flex-col justify-between shadow-sm">
<div className="flex items-center justify-between text-[#06169B] mb-2">
<span className="font-label-md text-label-md uppercase tracking-wider font-bold">Parts Procurement</span>
<div className="w-8 h-8 rounded-xl bg-[#D7E1FF] border border-[#0213B2]/30 flex items-center justify-center text-[#0213B2]">
<span className="material-symbols-outlined text-base" data-icon="local_shipping">local_shipping</span>
</div>
</div>
<div>
<div className="flex items-baseline gap-2">
<span className="font-headline-lg text-headline-lg font-bold text-[#06169B]">$42,100</span>
<span className="font-label-sm text-label-sm text-[#0213B2] px-1.5 py-0.5 rounded bg-white border border-[#0213B2]/20 font-bold">In Transit</span>
</div>
<p className="text-body-sm font-body-sm text-[#334155] mt-2">9 deliveries scheduled this week</p>
</div>
<div className="w-full bg-[#D7E1FF] h-1.5 rounded-full mt-4 overflow-hidden">
<div className="bg-[#0213B2] h-full rounded-full" style={{ width: "70%" }}></div>
</div>
</div>
</section>

<section className="space-y-4">
<div className="flex items-center justify-between">
<div className="flex items-center gap-3">
<span className="material-symbols-outlined text-primary text-2xl" data-icon="precision_manufacturing">precision_manufacturing</span>
<div>
<h2 className="font-headline-md text-headline-md text-on-surface">Active Workshop Floor Status</h2>
<p className="font-body-sm text-body-sm text-on-surface-variant">Real-time telemetry and build progress across designated technician stations</p>
</div>
</div>
<div className="flex items-center gap-2">
<span className="text-label-sm font-label-sm text-outline uppercase tracking-wider">Live View</span>
<button className="p-1.5 bg-white rounded-xl border border-[#CBD5E1] text-[#111827] hover:text-[#0213B2] hover:border-[#0213B2] hover:bg-[#EEF2FF] transition-all cursor-pointer shadow-xs">
<span className="material-symbols-outlined text-lg" data-icon="refresh">refresh</span>
</button>
</div>
</div>

<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">

<div className="bg-surface-container-low rounded-xl border border-outline-variant/30 p-5 flex flex-col justify-between hover:border-primary/50 transition-colors">
<div>

<div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
<span className="font-label-lg text-label-lg text-primary tracking-wider uppercase">Bay 01</span>
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-DEFAULT text-label-sm font-label-sm uppercase bg-primary-container/40 text-primary border border-primary/30">
<span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse"></span>
                  In-Progress
                </span>
</div>

<div className="mt-4">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Porsche 911 Carrera (991)</h3>
<p className="font-body-sm text-body-sm text-outline mt-0.5">Forged Wheel Fitment & Suspension Alignment</p>
</div>

<div className="mt-4 space-y-2 bg-surface-container p-3 rounded-xl border border-outline-variant/20">
<div className="flex justify-between items-center text-body-sm font-body-sm">
<span className="text-outline">Service Advisor:</span>
<span className="text-on-surface font-medium">Marcus Vance</span>
</div>
<div className="flex justify-between items-center text-body-sm font-body-sm">
<span className="text-outline">Technician Lead:</span>
<span className="text-primary font-medium flex items-center gap-1">
<span className="material-symbols-outlined text-xs" data-icon="build">build</span>
                    Torben Müller
                  </span>
</div>
</div>
</div>

<div className="mt-5 pt-3 border-t border-outline-variant/20">
<div className="flex justify-between text-body-sm font-body-sm mb-1.5">
<span className="text-on-surface-variant font-medium">Stage 3: Caliper Clearance Check</span>
<span className="font-label-sm text-label-sm text-primary">65%</span>
</div>
<div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: "65%" }}></div>
</div>
<div className="flex justify-between items-center mt-3 text-body-sm font-body-sm">
<span className="text-outline">ETA to Test Dyno:</span>
<span className="text-on-surface font-mono">14:30 Today</span>
</div>
</div>
</div>

<div className="bg-surface-container-low rounded-xl border border-outline-variant/30 p-5 flex flex-col justify-between hover:border-primary/50 transition-colors">
<div>

<div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
<span className="font-label-lg text-label-lg text-tertiary tracking-wider uppercase">Bay 02</span>
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-DEFAULT text-label-sm font-label-sm uppercase bg-tertiary-container/40 text-tertiary border border-tertiary/30">
<span className="w-1.5 h-1.5 rounded-full bg-tertiary animate-pulse"></span>
                  Dyno Staging
                </span>
</div>

<div className="mt-4">
<h3 className="font-headline-sm text-headline-sm text-on-surface">BMW Vision ConnectedDrive</h3>
<p className="font-body-sm text-body-sm text-outline mt-0.5">Full Carbon Aero Kit & Dyno Tune Remap</p>
</div>

<div className="mt-4 space-y-2 bg-surface-container p-3 rounded-xl border border-outline-variant/20">
<div className="flex justify-between items-center text-body-sm font-body-sm">
<span className="text-outline">Service Advisor:</span>
<span className="text-on-surface font-medium">Sarah Jenkins</span>
</div>
<div className="flex justify-between items-center text-body-sm font-body-sm">
<span className="text-outline">Technician Lead:</span>
<span className="text-primary font-medium flex items-center gap-1">
<span className="material-symbols-outlined text-xs" data-icon="build">build</span>
                    David Zhao
                  </span>
</div>
</div>
</div>

<div className="mt-5 pt-3 border-t border-outline-variant/20">
<div className="flex justify-between text-body-sm font-body-sm mb-1.5">
<span className="text-on-surface-variant font-medium">Stage 4: ECU Flash & Power Map</span>
<span className="font-label-sm text-label-sm text-tertiary">85%</span>
</div>
<div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
<div className="bg-tertiary h-full rounded-full transition-all duration-500" style={{ width: "85%" }}></div>
</div>
<div className="flex justify-between items-center mt-3 text-body-sm font-body-sm">
<span className="text-outline">ETA to Test Dyno:</span>
<span className="text-on-surface font-mono">16:15 Today</span>
</div>
</div>
</div>

<div className="bg-surface-container-low rounded-xl border border-outline-variant/30 p-5 flex flex-col justify-between hover:border-primary/50 transition-colors">
<div>

<div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
<span className="font-label-lg text-label-lg text-on-surface-variant tracking-wider uppercase">Bay 03</span>
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-DEFAULT text-label-sm font-label-sm uppercase bg-surface-container-high text-on-surface border border-outline-variant/40">
<span className="w-1.5 h-1.5 rounded-full bg-outline"></span>
                  Assembly
                </span>
</div>

<div className="mt-4">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Audi RS6 Avant (C8)</h3>
<p className="font-body-sm text-body-sm text-outline mt-0.5">Akrapovič Titanium Exhaust & Downpipes</p>
</div>

<div className="mt-4 space-y-2 bg-surface-container p-3 rounded-xl border border-outline-variant/20">
<div className="flex justify-between items-center text-body-sm font-body-sm">
<span className="text-outline">Service Advisor:</span>
<span className="text-on-surface font-medium">Marcus Vance</span>
</div>
<div className="flex justify-between items-center text-body-sm font-body-sm">
<span className="text-outline">Technician Lead:</span>
<span className="text-primary font-medium flex items-center gap-1">
<span className="material-symbols-outlined text-xs" data-icon="build">build</span>
                    Mateo Rossi
                  </span>
</div>
</div>
</div>

<div className="mt-5 pt-3 border-t border-outline-variant/20">
<div className="flex justify-between text-body-sm font-body-sm mb-1.5">
<span className="text-on-surface-variant font-medium">Stage 2: Header Alignment</span>
<span className="font-label-sm text-label-sm text-on-surface">40%</span>
</div>
<div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
<div className="bg-on-surface h-full rounded-full transition-all duration-500" style={{ width: "40%" }}></div>
</div>
<div className="flex justify-between items-center mt-3 text-body-sm font-body-sm">
<span className="text-outline">ETA to Test Dyno:</span>
<span className="text-on-surface font-mono">11:00 Tomorrow</span>
</div>
</div>
</div>

<div className="bg-surface-container-low rounded-xl border border-outline-variant/30 p-5 flex flex-col justify-between hover:border-primary/50 transition-colors">
<div>

<div className="flex items-center justify-between pb-3 border-b border-outline-variant/20">
<span className="font-label-lg text-label-lg text-primary tracking-wider uppercase">Bay 04</span>
<span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-DEFAULT text-label-sm font-label-sm uppercase bg-primary-container/40 text-primary border border-primary/30">
<span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  Verification
                </span>
</div>

<div className="mt-4">
<h3 className="font-headline-sm text-headline-sm text-on-surface">Mercedes-AMG GT Black</h3>
<p className="font-body-sm text-body-sm text-outline mt-0.5">Ceramic Brake Upgrade & Brake Bleeding</p>
</div>

<div className="mt-4 space-y-2 bg-surface-container p-3 rounded-xl border border-outline-variant/20">
<div className="flex justify-between items-center text-body-sm font-body-sm">
<span className="text-outline">Service Advisor:</span>
<span className="text-on-surface font-medium">Elena Rostova</span>
</div>
<div className="flex justify-between items-center text-body-sm font-body-sm">
<span className="text-outline">Technician Lead:</span>
<span className="text-primary font-medium flex items-center gap-1">
<span className="material-symbols-outlined text-xs" data-icon="build">build</span>
                    Alex Chen
                  </span>
</div>
</div>
</div>

<div className="mt-5 pt-3 border-t border-outline-variant/20">
<div className="flex justify-between text-body-sm font-body-sm mb-1.5">
<span className="text-on-surface-variant font-medium">Stage 5: Final Pressure Check</span>
<span className="font-label-sm text-label-sm text-primary">92%</span>
</div>
<div className="w-full bg-surface-container-highest h-2 rounded-full overflow-hidden">
<div className="bg-primary h-full rounded-full transition-all duration-500" style={{ width: "92%" }}></div>
</div>
<div className="flex justify-between items-center mt-3 text-body-sm font-body-sm">
<span className="text-outline">ETA to Test Dyno:</span>
<span className="text-on-surface font-mono">12:30 Today</span>
</div>
</div>
</div>
</div>
</section>

<div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

<section className="lg:col-span-7 bg-surface-container-low rounded-xl border border-outline-variant/30 p-5 flex flex-col justify-between">
<div>
<div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-primary" data-icon="fact_check">fact_check</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Fitment Clearance Verification Matrix</h3>
</div>
<span className="font-body-sm text-body-sm text-outline">Bespoke Wheel & Suspension Specs</span>
</div>

<div className="overflow-x-auto">
<table className="w-full text-left font-body-sm text-body-sm border-collapse">
<thead>
<tr className="border-b border-outline-variant/30 text-outline uppercase font-label-sm text-label-sm">
<th className="py-2 px-3">Vehicle Profile</th>
<th className="py-2 px-3">PCD / Center Bore</th>
<th className="py-2 px-3">Axle Clearance</th>
<th className="py-2 px-3">Brake Clearance</th>
<th className="py-2 px-3 text-right">Status</th>
</tr>
</thead>
<tbody className="divide-y divide-outline-variant/20">
<tr className="hover:bg-surface-container transition-colors">
<td className="py-3 px-3 font-medium text-on-surface">911 Carrera (991)</td>
<td className="py-3 px-3 font-mono text-outline">5x130 (71.6mm)</td>
<td className="py-3 px-3 text-on-surface">ET45 F / ET45 R</td>
<td className="py-3 px-3">OEM 330mm Disc</td>
<td className="py-3 px-3 text-right">
<span className="inline-flex items-center gap-1 text-label-sm font-label-sm text-primary px-2 py-0.5 rounded-DEFAULT bg-primary-container/40">
<span className="material-symbols-outlined text-xs" data-icon="check_circle">check_circle</span>
                        Verified
                      </span>
</td>
</tr>
<tr className="hover:bg-surface-container transition-colors">
<td className="py-3 px-3 font-medium text-on-surface">BMW Vision</td>
<td className="py-3 px-3 font-mono text-outline">5x112 (72.6mm)</td>
<td className="py-3 px-3 text-on-surface">ET25 F / ET22 R</td>
<td className="py-3 px-3">BMW Sport 360mm</td>
<td className="py-3 px-3 text-right">
<span className="inline-flex items-center gap-1 text-label-sm font-label-sm text-primary px-2 py-0.5 rounded-DEFAULT bg-primary-container/40">
<span className="material-symbols-outlined text-xs" data-icon="check_circle">check_circle</span>
                        Verified
                      </span>
</td>
</tr>
<tr className="hover:bg-surface-container transition-colors">
<td className="py-3 px-3 font-medium text-on-surface">RS6 Avant C8</td>
<td className="py-3 px-3 font-mono text-outline">5x112 (66.5mm)</td>
<td className="py-3 px-3 text-on-surface">ET22 F / ET19 R</td>
<td className="py-3 px-3">RS Steel 420mm</td>
<td className="py-3 px-3 text-right">
<span className="inline-flex items-center gap-1 text-label-sm font-label-sm text-tertiary px-2 py-0.5 rounded-DEFAULT bg-tertiary-container/30">
<span className="material-symbols-outlined text-xs" data-icon="info">info</span>
                        Spacer 3mm Req
                      </span>
</td>
</tr>
<tr className="hover:bg-surface-container transition-colors">
<td className="py-3 px-3 font-medium text-on-surface">AMG GT Black</td>
<td className="py-3 px-3 font-mono text-outline">5x112 (66.6mm)</td>
<td className="py-3 px-3 text-on-surface">ET30 F / ET24 R</td>
<td className="py-3 px-3">CCM Carbon 402mm</td>
<td className="py-3 px-3 text-right">
<span className="inline-flex items-center gap-1 text-label-sm font-label-sm text-primary px-2 py-0.5 rounded-DEFAULT bg-primary-container/40">
<span className="material-symbols-outlined text-xs" data-icon="check_circle">check_circle</span>
                        Verified
                      </span>
</td>
</tr>
</tbody>
</table>
</div>
</div>
<div className="mt-4 pt-3 border-t border-outline-variant/20 flex justify-between items-center text-body-sm">
<span className="text-outline">TÜV Certificate Auto-generation is enabled</span>
<a className="text-primary hover:underline font-label-md inline-flex items-center gap-1" href="#">
<span>Inspect Full Fitment Database</span>
<span className="material-symbols-outlined text-sm" data-icon="arrow_forward">arrow_forward</span>
</a>
</div>
</section>

<section className="lg:col-span-5 bg-surface-container-low rounded-xl border border-outline-variant/30 p-5 flex flex-col justify-between">
<div>
<div className="flex items-center justify-between pb-3 border-b border-outline-variant/20 mb-4">
<div className="flex items-center gap-2">
<span className="material-symbols-outlined text-tertiary" data-icon="calendar_month">calendar_month</span>
<h3 className="font-headline-sm text-headline-sm text-on-surface">Upcoming Consultations</h3>
</div>
<span className="font-label-sm text-label-sm text-outline">3 Today</span>
</div>

<div className="space-y-3">

<div className="p-3 bg-surface-container rounded-xl border border-outline-variant/20 hover:border-outline-variant/50 transition-colors">
<div className="flex justify-between items-start">
<div>
<h4 className="font-headline-sm text-headline-sm text-on-surface">Harrison Sterling</h4>
<p className="font-body-sm text-body-sm text-outline">Aston Martin Vantage V8 (2023)</p>
</div>
<span className="inline-flex items-center px-2 py-0.5 rounded-DEFAULT text-label-sm font-label-sm uppercase bg-primary-container/40 text-primary border border-primary/30">
                    Confirmed
                  </span>
</div>
<div className="flex justify-between items-center mt-3 pt-2 border-t border-outline-variant/10 text-body-sm font-body-sm">
<span className="text-outline flex items-center gap-1">
<span className="material-symbols-outlined text-xs" data-icon="schedule">schedule</span>
                    13:00 - 13:45
                  </span>
<span className="text-on-surface font-semibold">Est. Value: <span className="text-primary font-mono">$34,500</span></span>
</div>
</div>

<div className="p-3 bg-surface-container rounded-xl border border-outline-variant/20 hover:border-outline-variant/50 transition-colors">
<div className="flex justify-between items-start">
<div>
<h4 className="font-headline-sm text-headline-sm text-on-surface">Julian De Vries</h4>
<p className="font-body-sm text-body-sm text-outline">Ferrari F8 Tributo</p>
</div>
<span className="inline-flex items-center px-2 py-0.5 rounded-DEFAULT text-label-sm font-label-sm uppercase bg-tertiary-container/40 text-tertiary border border-tertiary/30">
                    In Waiting Lounge
                  </span>
</div>
<div className="flex justify-between items-center mt-3 pt-2 border-t border-outline-variant/10 text-body-sm font-body-sm">
<span className="text-outline flex items-center gap-1">
<span className="material-symbols-outlined text-xs" data-icon="schedule">schedule</span>
                    14:30 - 15:30
                  </span>
<span className="text-on-surface font-semibold">Est. Value: <span className="text-primary font-mono">$58,000</span></span>
</div>
</div>

<div className="p-3 bg-surface-container rounded-xl border border-outline-variant/20 hover:border-outline-variant/50 transition-colors">
<div className="flex justify-between items-start">
<div>
<h4 className="font-headline-sm text-headline-sm text-on-surface">Clara Lindqvist</h4>
<p className="font-body-sm text-body-sm text-outline">McLaren 720S Performance</p>
</div>
<span className="inline-flex items-center px-2 py-0.5 rounded-DEFAULT text-label-sm font-label-sm uppercase bg-surface-container-high text-on-surface-variant border border-outline-variant/30">
                    Rescheduled 16:00
                  </span>
</div>
<div className="flex justify-between items-center mt-3 pt-2 border-t border-outline-variant/10 text-body-sm font-body-sm">
<span className="text-outline flex items-center gap-1">
<span className="material-symbols-outlined text-xs" data-icon="schedule">schedule</span>
                    16:00 - 17:00
                  </span>
<span className="text-on-surface font-semibold">Est. Value: <span className="text-primary font-mono">$29,200</span></span>
</div>
</div>
</div>
</div>
<div className="mt-4 pt-3 border-t border-outline-variant/20 flex justify-between items-center text-body-sm">
<span className="text-outline">Assigned Advisor: Marcus Vance</span>
<button className="text-tertiary hover:underline font-label-md inline-flex items-center gap-1">
<span>View Full Calendar</span>
<span className="material-symbols-outlined text-sm" data-icon="chevron_right">chevron_right</span>
</button>
</div>
</section>
</div>
</main>
    </div>
  )
}
