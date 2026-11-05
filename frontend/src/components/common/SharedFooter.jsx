import React from 'react'
import { Link } from 'react-router-dom'

/**
 * SharedFooter - Standardized comprehensive footer for Virtual Tune platform.
 */
export default function SharedFooter() {
  return (
    <footer className="bg-[#E5E8F0] dark:bg-[#08090D] border-t border-[#D8DFEA] dark:border-[#282A3A] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 py-16">
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0213B2] text-white flex items-center justify-center shadow-xs">
                <span className="material-symbols-outlined text-lg">tune</span>
              </div>
              <span className="font-['Montserrat'] text-lg font-black text-[#111827] dark:text-white uppercase tracking-tight">
                Virtual Tune
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#475569] dark:text-[#94A3B8] leading-relaxed max-w-sm">
              Next-generation 3D vehicle customization platform and certified workshop operational network. Real-time visual staging, fitment validation, and automated margin quoting.
            </p>
            <div className="flex items-center gap-2 pt-2 text-xs font-mono text-[#16A34A]">
              <span className="w-2 h-2 rounded-full bg-[#16A34A] animate-pulse"></span>
              <span>System Operational · 3D Engine Active</span>
            </div>
          </div>

          {/* Navigation Group 1 */}
          <div>
            <p className="text-xs font-['Montserrat'] font-bold uppercase tracking-wider text-[#111827] dark:text-white mb-4">
              3D & Studio
            </p>
            <ul className="space-y-2.5 text-xs text-[#475569] dark:text-[#CBD5E1]">
              <li><Link to="/configurator" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">3D CAD Configurator</Link></li>
              <li><Link to="/sales" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Showroom Sales</Link></li>
              <li><Link to="/account" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Saved Build Gallery</Link></li>
            </ul>
          </div>

          {/* Navigation Group 2 */}
          <div>
            <p className="text-xs font-['Montserrat'] font-bold uppercase tracking-wider text-[#111827] dark:text-white mb-4">
              Engineering & Depot
            </p>
            <ul className="space-y-2.5 text-xs text-[#475569] dark:text-[#CBD5E1]">
              <li><Link to="/fitment" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Fitment Check</Link></li>
              <li><Link to="/shop" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Performance Store</Link></li>
              <li><Link to="/inventory" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Warehouse Inventory</Link></li>
              <li><Link to="/knowledge" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Technical Knowledge Hub</Link></li>
            </ul>
          </div>

          {/* Navigation Group 3 */}
          <div>
            <p className="text-xs font-['Montserrat'] font-bold uppercase tracking-wider text-[#111827] dark:text-white mb-4">
              Operations & Warranty
            </p>
            <ul className="space-y-2.5 text-xs text-[#475569] dark:text-[#CBD5E1]">
              <li><Link to="/quotation" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Quotes & Margin</Link></li>
              <li><Link to="/warranty" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Digital Warranty QR</Link></li>
              <li><Link to="/dashboard" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Garage Dashboard</Link></li>
              <li><Link to="/profile" className="hover:text-[#0213B2] dark:hover:text-[#60A5FA] transition-colors">Workshop Profile</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-[#D8DFEA] dark:border-[#282A3A] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#64748B] dark:text-[#94A3B8]">
          <p>© 2026 Virtual Tune Automotive Precision Systems. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="hover:text-[#0213B2] dark:hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span className="hover:text-[#0213B2] dark:hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span className="hover:text-[#0213B2] dark:hover:text-white transition-colors cursor-pointer">Engineering Compliance</span>
          </div>
        </div>

      </div>
    </footer>
  )
}

