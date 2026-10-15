import React, { useRef } from 'react'

/**
 * InvoiceModal - B2B Commercial Tax Invoice Modal with print / PDF export capability
 */
export default function InvoiceModal({
  isOpen,
  onClose,
  quote,
  formatUsd,
  formatVnd,
}) {
  const printRef = useRef(null)

  if (!isOpen || !quote) return null

  const handlePrint = () => {
    window.print()
  }

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-[#14151D] rounded-2xl shadow-2xl border border-[#CBD5E1] dark:border-[#282A3A] overflow-hidden my-8">
        {/* Modal Top Control Bar (Hidden during print) */}
        <div className="print:hidden flex items-center justify-between px-6 py-4 bg-[#E8EDFF] dark:bg-[#1A224D] border-b border-[#CBD5E1] dark:border-[#282A3A]">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA]">
              receipt_long
            </span>
            <span className="font-['Montserrat'] text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">
              B2B Commercial Tax Invoice Preview
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#DCFCE7] text-[#15803D] dark:bg-[#16A34A]/25 dark:text-[#4ADE80]">
              VERIFIED
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2 bg-[#0213B2] hover:bg-[#0115BC] text-white rounded-lg text-xs font-['Montserrat'] font-bold flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">print</span>
              <span>Print / Export PDF</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 text-[#64748B] hover:text-[#111827] dark:text-[#94A3B8] dark:hover:text-white rounded-lg hover:bg-black/5 dark:hover:bg-white/5 transition-all cursor-pointer"
              title="Close"
            >
              <span className="material-symbols-outlined text-lg">close</span>
            </button>
          </div>
        </div>

        {/* Printable Invoice Sheet */}
        <div
          ref={printRef}
          className="p-8 sm:p-10 space-y-8 bg-white dark:bg-[#14151D] text-[#111827] dark:text-[#F8FAFC] print:p-0 print:bg-white print:text-black"
        >
          {/* Header & Company Brand */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pb-6 border-b border-[#E2E8F0] dark:border-[#282A3A] print:border-black/20">
            <div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0213B2] flex items-center justify-center text-white font-black text-sm tracking-wider">
                  VT
                </div>
                <h1 className="font-['Montserrat'] text-2xl font-black tracking-tight text-[#0213B2] dark:text-[#60A5FA] print:text-black">
                  VIRTUAL TUNE
                </h1>
              </div>
              <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-mono mt-1 print:text-black/70">
                Commercial Automotive Engineering & 3D Prototyping
              </p>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono mt-0.5 print:text-black/60">
                128 Performance Highway, District 7, Ho Chi Minh City, Vietnam
              </p>
              <p className="text-[11px] text-[#64748B] dark:text-[#94A3B8] font-mono print:text-black/60">
                Tax ID / MST: 0314892019 • Hotline: +84 (0) 908 123 456
              </p>
            </div>

            <div className="text-left sm:text-right">
              <span className="inline-block px-3 py-1 rounded-md text-xs font-mono font-bold uppercase tracking-wider bg-[#EEF2FF] text-[#0213B2] border border-[#0213B2]/30 dark:bg-[#161C3B] dark:text-[#60A5FA] dark:border-[#60A5FA]/30 mb-2 print:border-black/20 print:bg-transparent print:text-black">
                COMMERCIAL INVOICE
              </span>
              <h2 className="font-mono text-xl font-black text-[#111827] dark:text-white print:text-black">
                INV-{quote.quotationNumber?.replace('QUO-', '') || '2026-001'}
              </h2>
              <div className="text-xs font-mono text-[#475569] dark:text-[#94A3B8] mt-1 space-y-0.5 print:text-black/70">
                <div>Date: <strong>{currentDate}</strong></div>
                <div>Status: <strong className="uppercase">{quote.status}</strong></div>
                <div>Ref Quote: <strong>{quote.quotationNumber}</strong></div>
              </div>
            </div>
          </div>

          {/* Client & Garage Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 p-4 rounded-xl bg-[#F8FAFC] dark:bg-[#1B1D28] border border-[#E2E8F0] dark:border-[#282A3A] print:bg-transparent print:border-black/20">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] block mb-1 print:text-black/60 font-semibold">
                Billed To (Client / Customer):
              </span>
              <p className="font-['Montserrat'] text-sm font-bold text-[#111827] dark:text-[#F8FAFC] print:text-black">
                {quote.customerName || 'Virtual Tune VIP Client'}
              </p>
              <p className="text-xs font-mono text-[#475569] dark:text-[#94A3B8] mt-0.5 print:text-black/70">
                Phone: {quote.customerPhone || '+84 (0) 908 123 456'}
              </p>
              <p className="text-xs font-mono text-[#475569] dark:text-[#94A3B8] print:text-black/70">
                Vehicle: <strong className="text-[#111827] dark:text-white print:text-black">{quote.carModel}</strong>
              </p>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#64748B] dark:text-[#94A3B8] block mb-1 print:text-black/60 font-semibold">
                Servicing Garage / Workshop:
              </span>
              <p className="font-['Montserrat'] text-sm font-bold text-[#111827] dark:text-[#F8FAFC] print:text-black">
                {quote.garageName || 'Virtual Tune Master Speed Shop'}
              </p>
              <p className="text-xs font-mono text-[#475569] dark:text-[#94A3B8] mt-0.5 print:text-black/70">
                Lead Bay: Dyno & Laser Kinematics (Bay 01)
              </p>
              <p className="text-xs font-mono text-[#475569] dark:text-[#94A3B8] print:text-black/70">
                Compliance: TÜV Rheinland & ECE Homologated
              </p>
            </div>
          </div>

          {/* Line Items Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b-2 border-[#CBD5E1] dark:border-[#282A3A] print:border-black text-[11px] font-mono uppercase tracking-wider text-[#475569] dark:text-[#94A3B8] print:text-black">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Performance Hardware / Component</th>
                  <th className="py-2.5 px-3">SKU / Spec</th>
                  <th className="py-2.5 px-3 text-center">Qty</th>
                  <th className="py-2.5 px-3 text-right">Unit Price</th>
                  <th className="py-2.5 px-3 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0] dark:divide-[#282A3A] print:divide-black/20 text-xs font-mono">
                {quote.items && quote.items.length > 0 ? (
                  quote.items.map((it, idx) => (
                    <tr key={it.itemId || idx} className="hover:bg-black/5 dark:hover:bg-white/5 print:hover:bg-transparent">
                      <td className="py-3 px-3 text-[#64748B] dark:text-[#94A3B8] print:text-black/60 font-medium">{idx + 1}</td>
                      <td className="py-3 px-3">
                        <div className="font-bold text-[#111827] dark:text-white print:text-black">{it.partName}</div>
                        <div className="text-[10px] text-[#64748B] dark:text-[#94A3B8] print:text-black/60">{it.category}</div>
                      </td>
                      <td className="py-3 px-3 text-[#475569] dark:text-[#CBD5E1] print:text-black/80">{it.partSku || 'OEM-SPEC'}</td>
                      <td className="py-3 px-3 text-center font-bold">{it.quantity || 1}</td>
                      <td className="py-3 px-3 text-right text-[#475569] dark:text-[#CBD5E1] print:text-black/80">
                        {formatUsd ? formatUsd(it.unitPriceVnd) : `$${(it.unitPriceVnd / 25000).toLocaleString()}`}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-[#111827] dark:text-white print:text-black">
                        {formatUsd ? formatUsd(it.totalPriceVnd) : `$${(it.totalPriceVnd / 25000).toLocaleString()}`}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-6 text-center text-xs text-[#64748B] dark:text-[#94A3B8] print:text-black/60">
                      Standard OEM Baseline Performance Calibration & Inspection Included
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Financial Breakdown & Totals */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-6 pt-4 border-t border-[#E2E8F0] dark:border-[#282A3A] print:border-black/20">
            {/* Payment notes & Guarantee */}
            <div className="space-y-2 text-xs font-mono text-[#64748B] dark:text-[#94A3B8] print:text-black/70 sm:max-w-md">
              <div className="font-bold text-[#111827] dark:text-white print:text-black uppercase text-[11px]">
                Payment Terms & Warranty
              </div>
              <p>• 100% Genuine OEM parts certified under European TÜV standard.</p>
              <p>• 24-Month or 40,000 km warranty on all hardware & calibration stages.</p>
              <p>• Wire Transfer: Vietcombank - 0071000999999 - VIRTUAL TUNE CO., LTD.</p>
            </div>

            {/* Calculations Box */}
            <div className="w-full sm:w-72 space-y-2 text-xs font-mono">
              <div className="flex justify-between text-[#475569] dark:text-[#CBD5E1] print:text-black/80">
                <span>Parts Subtotal:</span>
                <span className="font-bold text-[#111827] dark:text-white print:text-black">
                  {formatUsd ? formatUsd(quote.partsTotal) : `$${(quote.partsTotal / 25000).toLocaleString()}`}
                </span>
              </div>
              <div className="flex justify-between text-[#475569] dark:text-[#CBD5E1] print:text-black/80">
                <span>Labor & Calibration:</span>
                <span className="font-bold text-[#111827] dark:text-white print:text-black">
                  {formatUsd ? formatUsd(quote.laborTotal) : `$${(quote.laborTotal / 25000).toLocaleString()}`}
                </span>
              </div>
              {quote.discountAmount > 0 && (
                <div className="flex justify-between text-[#16A34A] dark:text-[#4ADE80] print:text-black">
                  <span>VIP Discount:</span>
                  <span className="font-bold">
                    -{formatUsd ? formatUsd(quote.discountAmount) : `$${(quote.discountAmount / 25000).toLocaleString()}`}
                  </span>
                </div>
              )}
              {quote.taxAmount > 0 && (
                <div className="flex justify-between text-[#475569] dark:text-[#CBD5E1] print:text-black/80">
                  <span>VAT & Statutory (10%):</span>
                  <span className="font-bold text-[#111827] dark:text-white print:text-black">
                    +{formatUsd ? formatUsd(quote.taxAmount) : `$${(quote.taxAmount / 25000).toLocaleString()}`}
                  </span>
                </div>
              )}

              <div className="pt-3 border-t-2 border-[#CBD5E1] dark:border-[#282A3A] print:border-black flex justify-between items-baseline">
                <span className="font-['Montserrat'] font-bold text-xs uppercase text-[#111827] dark:text-white print:text-black">
                  Total Payable:
                </span>
                <div className="text-right">
                  <span className="font-mono text-xl font-black text-[#0213B2] dark:text-[#60A5FA] print:text-black block">
                    {formatUsd ? formatUsd(quote.finalTotal) : `$${(quote.finalTotal / 25000).toLocaleString()}`}
                  </span>
                  <span className="text-[11px] font-mono text-[#64748B] dark:text-[#94A3B8] print:text-black/60">
                    {formatVnd ? formatVnd(quote.finalTotal) : `${(quote.finalTotal || 0).toLocaleString()} ₫`}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Digital Stamp & Signatures */}
          <div className="pt-8 border-t border-[#E2E8F0] dark:border-[#282A3A] print:border-black/20 grid grid-cols-2 gap-8 text-center text-xs font-mono">
            <div>
              <p className="text-[#64748B] dark:text-[#94A3B8] print:text-black/60 mb-12">Customer Representative</p>
              <div className="border-t border-dashed border-[#CBD5E1] dark:border-[#282A3A] print:border-black/40 pt-2 font-bold text-[#111827] dark:text-white print:text-black">
                {quote.customerName || 'Acknowledged & Signed'}
              </div>
            </div>
            <div>
              <p className="text-[#64748B] dark:text-[#94A3B8] print:text-black/60 mb-12">Virtual Tune Master Workshop</p>
              <div className="border-t border-dashed border-[#CBD5E1] dark:border-[#282A3A] print:border-black/40 pt-2 font-bold text-[#0213B2] dark:text-[#60A5FA] print:text-black">
                Official Workshop Seal & Stamp
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
