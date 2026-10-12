import React from 'react'

/**
 * SaveBuildModal - Presentational component for Save & Share 3D Build modal
 * Modal dialog for naming, saving, generating share links, and requesting official quotes
 * All persistence logic, API calls, and state remain in ConfiguratorPage parent
 */
export default function SaveBuildModal({
  isOpen,
  onClose,
  activeCar,
  savedBuildData,
  buildNameInput,
  onBuildNameChange,
  onSaveBuild,
  savingBuild,
  totalEstimatedCost = 0,
  bodyColor,
  selectedBody,
  interiorColor,
  selectedInterior,
  selectedWheel,
  selectedSpoiler,
  copiedLink,
  onCopyShareLink,
  isCurrentConfigSaved,
  onCreateNewCode,
  onRequestQuote,
}) {
  if (!isOpen || !activeCar) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="bg-[#12121a] border border-white/15 rounded-2xl w-full max-w-md overflow-hidden shadow-2xl relative text-left">
        {/* Modal Header */}
        <div className="px-5 py-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-[#0213B2] flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-lg">tune</span>
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide uppercase">Save & Share 3D Build</h3>
              <p className="text-[10px] text-slate-300">{activeCar.name || `${activeCar.brand} ${activeCar.model}`} · Virtual Tune Database</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-white/5 hover:bg-white/10 text-white/60 hover:text-white flex items-center justify-center transition-all"
          >
            <span className="material-symbols-outlined text-base">close</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4">
          {!savedBuildData ? (
            <form onSubmit={onSaveBuild} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-white/70 mb-1.5 uppercase tracking-wider">
                  Build Configuration Name
                </label>
                <input
                  type="text"
                  value={buildNameInput}
                  onChange={(e) => onBuildNameChange && onBuildNameChange(e.target.value)}
                  placeholder="e.g. Ferrari 458 Track Spec Edition"
                  maxLength={60}
                  className="w-full px-3.5 py-2.5 rounded-lg bg-white/5 border border-white/15 focus:border-primary text-white text-xs outline-none transition-all placeholder:text-white/30"
                  autoFocus
                />
              </div>

              {/* Build Spec Summary Badges */}
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/8 space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-white/40">3D Build Specifications</p>
                  <span className="text-[11px] font-mono font-bold text-emerald-400">${totalEstimatedCost.toLocaleString()}</span>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-white/30 shrink-0" style={{ backgroundColor: bodyColor }} />
                    <div className="min-w-0">
                      <span className="text-[8px] text-white/40 block leading-none">Paint</span>
                      <span className="text-[10px] font-bold text-white truncate block mt-0.5">{selectedBody?.name}</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                    <div className="w-4 h-4 rounded-full border border-white/30 shrink-0" style={{ backgroundColor: interiorColor }} />
                    <div className="min-w-0">
                      <span className="text-[8px] text-white/40 block leading-none">Interior</span>
                      <span className="text-[10px] font-bold text-white truncate block mt-0.5">{selectedInterior?.name}</span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#6091C3] shrink-0">adjust</span>
                    <div className="min-w-0">
                      <span className="text-[8px] text-slate-400 block leading-none">Wheels</span>
                      <span className="text-[10px] font-bold text-white truncate block mt-0.5">
                        {selectedWheel ? 'WORK VS-XX 19"' : 'Ferrari OEM 20"'}
                      </span>
                    </div>
                  </div>
                  <div className="p-2 rounded-lg bg-white/5 border border-white/5 flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm text-[#6091C3] shrink-0">air</span>
                    <div className="min-w-0">
                      <span className="text-[8px] text-slate-400 block leading-none">Aero & Wing</span>
                      <span className="text-[10px] font-bold text-white truncate block mt-0.5">
                        {selectedSpoiler ? 'Carbon Aero GT Wing' : 'OEM Clean Decklid'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-[11px] text-white/40 leading-relaxed">
                This custom build is permanently stored in the database. You can share this link to reproduce this exact 3D specification.
              </p>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={savingBuild}
                  className="flex-1 py-2.5 px-3 rounded-lg bg-primary hover:bg-primary/90 text-on-primary text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-primary/25 disabled:opacity-50"
                >
                  {savingBuild ? (
                    <>
                      <span className="material-symbols-outlined text-sm animate-spin">progress_activity</span>
                      Saving to DB...
                    </>
                  ) : (
                    <>
                      <span className="material-symbols-outlined text-sm">cloud_upload</span>
                      Save & Generate Link
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              {/* Success Alert */}
              <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-lg">check_circle</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-emerald-300">Build Saved Successfully!</p>
                  <p className="text-[10px] text-emerald-400/70">{savedBuildData.buildName}</p>
                </div>
              </div>

              {/* Share Code Card */}
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 space-y-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/40 block">
                  Permanent Share Code
                </span>
                <div className="flex items-center justify-between bg-black/40 px-3 py-2 rounded-lg border border-white/10">
                  <span className="text-base font-black font-mono tracking-wider text-[#93C5FD]">
                    {savedBuildData.shareCode}
                  </span>
                  <span className="text-[10px] text-slate-400 uppercase">Database Verified</span>
                </div>
              </div>

              {/* Share Link Input */}
              <div>
                <label className="block text-[10px] font-bold text-slate-300 mb-1.5 uppercase tracking-wider">
                  Shareable 3D Build URL
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={`${window.location.origin}/configurator?share=${savedBuildData.shareCode}`}
                    className="flex-1 px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-white text-[11px] font-mono select-all outline-none"
                  />
                  <button
                    onClick={onCopyShareLink}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold flex items-center gap-1 transition-all ${
                      copiedLink
                        ? 'bg-emerald-500 text-white'
                        : 'bg-[#0213B2] hover:bg-[#0115BC] text-white shadow-sm'
                    }`}
                  >
                    <span className="material-symbols-outlined text-sm">
                      {copiedLink ? 'check' : 'content_copy'}
                    </span>
                    {copiedLink ? 'Copied' : 'Copy Link'}
                  </button>
                </div>
              </div>

              {/* Reuse Indicator and Fork button */}
              <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/[0.04] border border-white/8 text-[11px]">
                <span className="text-emerald-400 font-medium flex items-center gap-1.5">
                  <span className="material-symbols-outlined text-sm">verified</span>
                  {isCurrentConfigSaved ? 'Current build link active' : 'Build registered in DB'}
                </span>
                <button
                  type="button"
                  onClick={onCreateNewCode}
                  className="text-[#93C5FD] hover:text-white font-bold hover:underline transition-all"
                >
                  Create new code →
                </button>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-1">
                <button
                  onClick={() => onRequestQuote && onRequestQuote(savedBuildData.shareCode)}
                  className="flex-1 py-2 px-3 rounded-lg bg-white/8 hover:bg-white/15 border border-white/15 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all"
                >
                  <span className="material-symbols-outlined text-sm">request_quote</span>
                  Request Official Quote
                </button>
                <button
                  onClick={onClose}
                  className="py-2 px-4 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 text-xs font-semibold transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
