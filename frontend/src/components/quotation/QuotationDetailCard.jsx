import React from 'react'

/**
 * QuotationDetailCard - Quotation breakdown, materials, labor costs, and approval/dispatch actions
 */
export default function QuotationDetailCard({
  currentQuote,
  onUpdateStatus,
  onCreateWorkOrder,
  onViewWorkOrder,
  onOpenInvoice,
  formatUsd,
  formatVnd,
  renderStatusBadge,
}) {
  if (!currentQuote) {
    return (
      <div className="lg:col-span-8 bg-[#E5E8F0] dark:bg-[#14151D] rounded-2xl p-12 text-center text-xs font-mono text-[#475569] dark:text-[#CBD5E1] border border-[#CBD5E1] dark:border-[#282A3A]">
        Please select a quotation from the list on the left to view details.
      </div>
    )
  }

  return (
    <div className="lg:col-span-8 space-y-6">
      {/* Quotation Header & Actions Bar */}
      <div className="bg-[#E5E8F0] dark:bg-[#14151D] rounded-2xl p-5 border border-[#CBD5E1] dark:border-[#282A3A] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-sm font-bold text-[#0213B2] dark:text-[#60A5FA]">
              {currentQuote.quotationNumber}
            </span>
            {renderStatusBadge(currentQuote.status)}
            {currentQuote.hasWorkOrder && (
              <span className="px-2.5 py-0.5 rounded text-[11px] font-mono font-bold bg-[#DCFCE7] dark:bg-[#16A34A]/20 border border-[#16A34A]/40 text-[#16A34A] dark:text-[#4ADE80] flex items-center gap-1">
                <span className="material-symbols-outlined text-xs">precision_manufacturing</span>
                <span>Dispatched: {currentQuote.workOrderNumber}</span>
              </span>
            )}
          </div>
          <h2 className="font-['Montserrat'] text-xl font-bold text-[#111827] dark:text-[#F8FAFC]">
            {currentQuote.carModel}
          </h2>
          <p className="text-xs text-[#475569] dark:text-[#CBD5E1] font-mono mt-0.5">
            Client:{' '}
            <strong className="text-[#111827] dark:text-[#F8FAFC]">
              {currentQuote.customerName}
            </strong>{' '}
            ({currentQuote.customerPhone || 'N/A'}) • {currentQuote.garageName}
          </p>
        </div>

        {/* Actions: Approve / Reject / Dispatch / Print Invoice */}
        <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
          {/* Customer or Owner: Approve / Reject */}
          {currentQuote.status === 'SENT' && (
            <>
              <button
                type="button"
                onClick={() => onUpdateStatus('APPROVED')}
                className="px-3.5 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg text-xs font-['Montserrat'] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">check_circle</span>
                <span>Approve Quote</span>
              </button>
              <button
                type="button"
                onClick={() => onUpdateStatus('REJECTED')}
                className="px-3.5 py-2 bg-[#DC2626] hover:bg-[#B91C1C] text-white rounded-lg text-xs font-['Montserrat'] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">cancel</span>
                <span>Reject</span>
              </button>
            </>
          )}

          {/* If APPROVED: Dispatch to Work Order */}
          {currentQuote.status === 'APPROVED' && !currentQuote.hasWorkOrder && (
            <button
              type="button"
              onClick={onCreateWorkOrder}
              className="px-4 py-2 bg-[#0213B2] hover:bg-[#0115BC] text-white rounded-lg text-xs font-['Montserrat'] font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-sm transition-all cursor-pointer"
            >
              <span className="material-symbols-outlined text-base">precision_manufacturing</span>
              <span>Dispatch & Create Work Order</span>
            </button>
          )}

          {/* If Work Order already exists: switch view */}
          {currentQuote.hasWorkOrder && (
            <button
              type="button"
              onClick={onViewWorkOrder}
              className="px-3.5 py-2 bg-[#EEF2FF] dark:bg-[#161C3B] border border-[#0213B2]/30 dark:border-[#60A5FA]/30 text-[#0213B2] dark:text-[#60A5FA] rounded-lg text-xs font-['Montserrat'] font-bold flex items-center gap-1.5 transition-all cursor-pointer hover:bg-[#EEF2FF]/80 shadow-xs"
            >
              <span className="material-symbols-outlined text-sm text-[#0213B2] dark:text-[#60A5FA]">
                visibility
              </span>
              <span>View Active Work Order</span>
            </button>
          )}

          {/* View / Print Official B2B Invoice */}
          {onOpenInvoice && (
            <button
              type="button"
              onClick={onOpenInvoice}
              className="px-3.5 py-2 bg-white dark:bg-[#1B1D28] border border-[#CBD5E1] dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] text-[#111827] dark:text-[#F8FAFC] rounded-lg text-xs font-['Montserrat'] font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-xs"
            >
              <span className="material-symbols-outlined text-sm text-[#0213B2] dark:text-[#60A5FA]">
                receipt_long
              </span>
              <span>Print / View Invoice</span>
            </button>
          )}
        </div>
      </div>

      {/* Quotation Line Items Table */}
      <div className="bg-[#E5E8F0] dark:bg-[#14151D] rounded-2xl p-5 border border-[#CBD5E1] dark:border-[#282A3A] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1] dark:border-[#282A3A]">
          <h3 className="font-['Montserrat'] text-sm font-bold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-base">
              tune
            </span>
            <span>Staged Performance Components & Hardware</span>
          </h3>
          <span className="text-xs font-mono text-[#475569] dark:text-[#94A3B8]">
            {currentQuote.items?.length || 0} Line Items
          </span>
        </div>

        <div className="divide-y divide-[#CBD5E1] dark:divide-[#282A3A]">
          {currentQuote.items && currentQuote.items.length > 0 ? (
            currentQuote.items.map((it, idx) => (
              <div key={it.itemId || idx} className="py-3 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-10 h-10 rounded-lg bg-white dark:bg-[#1B1D28] flex items-center justify-center text-[#0213B2] dark:text-[#60A5FA] shrink-0 border border-[#CBD5E1] dark:border-[#282A3A]"
                    data-preserve-bg="true"
                  >
                    <span className="material-symbols-outlined text-xl">
                      {it.category?.toLowerCase().includes('wheel')
                        ? 'adjust'
                        : it.category?.toLowerCase().includes('exhaust')
                        ? 'mode_fan'
                        : it.category?.toLowerCase().includes('brake')
                        ? 'album'
                        : it.category?.toLowerCase().includes('aero')
                        ? 'speed'
                        : 'settings'}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-['Montserrat'] text-sm font-bold text-[#111827] dark:text-[#F8FAFC]">
                      {it.partName}
                    </h4>
                    <p className="text-xs text-[#475569] dark:text-[#94A3B8] font-mono">
                      SKU: {it.partSku || 'OEM-SPEC'} • Qty: {it.quantity}
                    </p>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <span className="font-mono text-sm font-bold text-[#111827] dark:text-[#F8FAFC] block">
                    {formatUsd(it.totalPriceVnd)}
                  </span>
                  <span className="text-[11px] font-mono text-[#475569] dark:text-[#94A3B8]">
                    {formatVnd(it.totalPriceVnd)}
                  </span>
                </div>
              </div>
            ))
          ) : (
            <div className="py-6 text-center text-xs font-mono text-[#475569] dark:text-[#94A3B8]">
              Baseline OEM Performance Staging Package included
            </div>
          )}
        </div>
      </div>

      {/* Financial Summary Card */}
      <div className="bg-[#E5E8F0] dark:bg-[#14151D] rounded-2xl p-6 border border-[#CBD5E1] dark:border-[#282A3A] shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1] dark:border-[#282A3A]">
          <h3 className="font-['Montserrat'] font-bold text-sm text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2">
            <span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-lg">
              receipt_long
            </span>
            <span>Commercial Financial Breakdown</span>
          </h3>
          <span className="text-xs font-mono text-[#475569] dark:text-[#94A3B8]">
            TÜV & ECE Compliant Staging
          </span>
        </div>

        <div className="space-y-3 text-xs font-mono">
          <div className="flex justify-between items-center text-[#475569] dark:text-[#CBD5E1]">
            <span>Parts Subtotal (Authentic OEM Stock):</span>
            <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">
              {formatUsd(currentQuote.partsTotal)} ({formatVnd(currentQuote.partsTotal)})
            </span>
          </div>
          <div className="flex justify-between items-center text-[#475569] dark:text-[#CBD5E1]">
            <span>Installation, Calibration & Dyno Labor:</span>
            <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">
              {formatUsd(currentQuote.laborTotal)} ({formatVnd(currentQuote.laborTotal)})
            </span>
          </div>
          {currentQuote.discountAmount > 0 && (
            <div className="flex justify-between items-center text-[#16A34A] dark:text-[#4ADE80]">
              <span>Preferred Commercial VIP Discount:</span>
              <span className="font-bold">
                -{formatUsd(currentQuote.discountAmount)} (-{formatVnd(currentQuote.discountAmount)})
              </span>
            </div>
          )}
          {currentQuote.taxAmount > 0 && (
            <div className="flex justify-between items-center text-[#475569] dark:text-[#CBD5E1]">
              <span>Applicable VAT & Statutory Compliance Tax:</span>
              <span className="font-bold text-[#111827] dark:text-[#F8FAFC]">
                +{formatUsd(currentQuote.taxAmount)} (+{formatVnd(currentQuote.taxAmount)})
              </span>
            </div>
          )}
        </div>

        <div className="mt-4 p-4 rounded-xl bg-[#D7E1FF] dark:bg-[#1A224D] border border-[#BCC7D8] dark:border-[#282A3A] flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-[#06169B] block font-semibold">
              TOTAL ESTIMATED PAYABLE
            </span>
            <span className="text-[11px] text-[#06169B] mt-0.5 block font-mono font-medium">
              VAT Included • 24M Warranty Protection Included
            </span>
          </div>
          <div className="text-right">
            <span className="font-mono text-2xl font-extrabold text-[#06169B] block">
              {formatUsd(currentQuote.finalTotal)}
            </span>
            <span className="text-[11px] font-mono text-[#475569]">
              {formatVnd(currentQuote.finalTotal)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
