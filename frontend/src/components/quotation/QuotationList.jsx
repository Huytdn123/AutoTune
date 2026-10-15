import React from 'react'

/**
 * QuotationList - List, filter, and search commercial quotations
 */
export default function QuotationList({
  quotations = [],
  currentQuote = null,
  onSelectQuote,
  quoteFilter = 'ALL',
  onFilterChange,
  searchQuery = '',
  onSearchChange,
  loading = false,
  formatUsd,
  renderStatusBadge,
}) {
  const filteredQuotes = quotations.filter((q) => {
    const matchesFilter = quoteFilter === 'ALL' || q.status === quoteFilter
    if (!matchesFilter) return false

    if (!searchQuery.trim()) return true
    const query = searchQuery.toLowerCase()
    return (
      (q.quotationNumber && q.quotationNumber.toLowerCase().includes(query)) ||
      (q.carModel && q.carModel.toLowerCase().includes(query)) ||
      (q.customerName && q.customerName.toLowerCase().includes(query))
    )
  })

  return (
    <div className="lg:col-span-4 space-y-4">
      <div className="bg-[#E5E8F0] dark:bg-[#14151D] rounded-2xl p-4 border border-[#CBD5E1] dark:border-[#282A3A] shadow-sm space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-[#CBD5E1] dark:border-[#282A3A]">
          <h2 className="font-['Montserrat'] text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC] flex items-center gap-1.5">
            <span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-base">
              format_list_bulleted
            </span>
            <span>All Quotations</span>
          </h2>
          <span className="text-[11px] font-mono text-[#475569] dark:text-[#94A3B8] font-semibold">
            {filteredQuotes.length} Records
          </span>
        </div>

        {/* Search input */}
        <div className="relative">
          <span className="material-symbols-outlined absolute left-2.5 top-1/2 -translate-y-1/2 text-sm text-[#64748B] dark:text-[#94A3B8] pointer-events-none">
            search
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search quote #, vehicle, or client..."
            className="w-full pl-8 pr-3 py-1.5 bg-white dark:bg-[#1B1D28] border border-[#CBD5E1] dark:border-[#282A3A] rounded-lg text-xs font-mono text-[#111827] dark:text-[#F8FAFC] placeholder-[#94A3B8] focus:border-[#0213B2] dark:focus:border-[#60A5FA] focus:outline-none transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-[#94A3B8] hover:text-[#111827] dark:hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 text-[11px] font-mono overflow-x-auto pb-1 scrollbar-none">
          {['ALL', 'APPROVED', 'SENT', 'DRAFT', 'REJECTED'].map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => onFilterChange(st)}
              data-preserve-bg={quoteFilter !== st ? 'true' : undefined}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                quoteFilter === st
                  ? 'bg-[#0213B2] text-white font-bold shadow-xs'
                  : 'bg-white dark:bg-[#1B1D28] text-[#475569] dark:text-[#CBD5E1] border border-[#CBD5E1] dark:border-[#282A3A] hover:bg-[#D7E1FF] dark:hover:bg-[#1A224D] hover:text-[#0213B2] dark:hover:text-[#60A5FA] shadow-2xs'
              }`}
            >
              {st}
            </button>
          ))}
        </div>

        {/* List items */}
        {loading ? (
          <div className="py-12 text-center text-xs font-mono text-[#64748B] dark:text-[#94A3B8] flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-[#0213B2] dark:border-[#60A5FA] border-t-transparent rounded-full animate-spin" />
            <span>Loading quotations...</span>
          </div>
        ) : filteredQuotes.length === 0 ? (
          <div className="py-12 text-center text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
            No quotations found {searchQuery ? `matching "${searchQuery}"` : `for "${quoteFilter}"`}
          </div>
        ) : (
          <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
            {filteredQuotes.map((q) => {
              const isSelected = currentQuote?.id === q.id
              return (
                <div
                  key={q.id}
                  onClick={() => onSelectQuote(q)}
                  data-preserve-bg="true"
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? 'bg-gradient-to-r from-[#D7E1FF] via-[#E2EBFF] to-[#EDF3FF] dark:from-[#1A224D] dark:via-[#161D3F] dark:to-[#121733] border-2 border-[#0213B2] dark:border-[#60A5FA] border-l-[6px] border-l-[#0213B2] dark:border-l-[#60A5FA] shadow-md shadow-[#0213B2]/15 dark:shadow-blue-950/60'
                      : 'bg-white dark:bg-[#1B1D28] border border-[#CBD5E1] dark:border-[#282A3A] hover:border-[#0213B2]/50 dark:hover:border-[#60A5FA]/50 hover:bg-[#F8FAFC] dark:hover:bg-[#222533] shadow-xs hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      {isSelected && (
                        <span className="w-2 h-2 rounded-full bg-[#0213B2] dark:bg-[#60A5FA] animate-pulse shrink-0" />
                      )}
                      <span
                        className={`font-mono text-xs ${
                          isSelected
                            ? 'font-black text-[#0213B2] dark:text-[#60A5FA]'
                            : 'font-bold text-[#111827] dark:text-[#F8FAFC]'
                        }`}
                      >
                        {q.quotationNumber}
                      </span>
                    </div>
                    {renderStatusBadge(q.status)}
                  </div>
                  <p
                    className={`text-xs font-semibold truncate ${
                      isSelected
                        ? 'text-[#0B1538] dark:text-white font-bold'
                        : 'text-[#334155] dark:text-[#CBD5E1]'
                    }`}
                  >
                    {q.carModel}
                  </p>
                  <div
                    className={`flex items-center justify-between mt-2 pt-2 border-t text-[11px] font-mono ${
                      isSelected
                        ? 'border-[#0213B2]/20 dark:border-[#60A5FA]/25'
                        : 'border-[#CBD5E1] dark:border-[#282A3A]'
                    }`}
                  >
                    <span
                      className={`${
                        isSelected
                          ? 'text-[#1E293B] dark:text-[#CBD5E1] font-semibold'
                          : 'text-[#475569] dark:text-[#94A3B8]'
                      } truncate`}
                    >
                      {q.customerName}
                    </span>
                    <span
                      className={`font-black text-xs ${
                        isSelected
                          ? 'text-[#0213B2] dark:text-[#60A5FA] text-sm'
                          : 'text-[#0213B2] dark:text-[#60A5FA]'
                      }`}
                    >
                      {formatUsd(q.finalTotal)}
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
