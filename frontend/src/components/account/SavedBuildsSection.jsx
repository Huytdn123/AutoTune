import React from 'react'

/**
 * SavedBuildsSection - 3D Configured Builds Library
 * Displays bespoke configurations saved by the user with launch, fork, share, and rename capabilities.
 */
export default function SavedBuildsSection({
  builds,
  buildsLoading,
  renamingCode,
  renameInput,
  setRenameInput,
  setRenamingCode,
  handleSaveRename,
  handleStartRename,
  handleDeleteBuild,
  handleForkBuild,
  handleCopyShare,
  navigate
}) {
  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
        <div>
          <h2 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2">
            <span>Custom Builds Library</span>
            <span className="text-xs font-mono text-[#0213B2] dark:text-[#60A5FA]">({builds.length} Active Configurations)</span>
          </h2>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            All bespoke 3D vehicle configurations created by your account. Stored securely in database.
          </p>
        </div>

        <button
          onClick={() => navigate('/configurator')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#0213B2] text-white hover:bg-[#0115BC] transition-all shadow-md shadow-[#0213B2]/20 self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          <span>New 3D Build</span>
        </button>
      </div>

      {buildsLoading ? (
        <div className="p-12 text-center rounded-2xl bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] space-y-3 shadow-sm" data-preserve-white="true">
          <span className="material-symbols-outlined text-3xl text-[#0213B2] dark:text-[#60A5FA] animate-spin">refresh</span>
          <p className="text-sm text-[#64748B] dark:text-[#94A3B8] font-mono">Fetching saved builds from database...</p>
        </div>
      ) : builds.length === 0 ? (
        <div 
          className="p-12 text-center rounded-2xl border-2 border-dashed border-slate-300 dark:border-[#282A3A] bg-white dark:bg-[#14151D] space-y-4 shadow-sm"
          data-preserve-white="true"
        >
          <div className="w-14 h-14 rounded-2xl bg-[#EEF2FF] dark:bg-[#1E293B] border border-[#0213B2]/20 dark:border-blue-900/40 flex items-center justify-center mx-auto text-[#0213B2] dark:text-[#60A5FA] shadow-xs">
            <span className="material-symbols-outlined text-2xl">directions_car</span>
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-[#111827] dark:text-[#F8FAFC]">No Saved Builds Yet</h3>
            <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
              Launch the 3D Configurator to tune suspension, paint finishes, rims, and aerodynamic components, then save your setup here.
            </p>
          </div>
          <button
            onClick={() => navigate('/configurator')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#0213B2] text-white hover:bg-[#0115BC] transition-all shadow-md shadow-[#0213B2]/20 cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">view_in_ar</span>
            <span>Launch 3D Configurator</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {builds.map((build) => {
            const car = build.car || {}
            const isRenaming = renamingCode === build.shareCode

            return (
              <div 
                key={build.shareCode}
                className="rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] shadow-sm hover:border-[#0213B2] dark:hover:border-[#60A5FA] hover:shadow-md group"
                data-preserve-white="true"
              >
                <div className="space-y-3.5">
                  {/* Build Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {isRenaming ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={renameInput}
                            onChange={(e) => setRenameInput(e.target.value)}
                            className="w-full text-xs font-bold bg-[#F8FAFC] dark:bg-[#1A1C26] border border-[#0213B2] dark:border-[#60A5FA] rounded-lg px-2.5 py-1 text-[#111827] dark:text-[#F8FAFC] outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveRename(build.shareCode)}
                            className="p-1 rounded bg-emerald-600 text-white hover:bg-emerald-700 cursor-pointer"
                            title="Save Name"
                          >
                            <span className="material-symbols-outlined text-xs">check</span>
                          </button>
                          <button
                            onClick={() => setRenamingCode(null)}
                            className="p-1 rounded bg-slate-200 dark:bg-slate-700 text-[#64748B] dark:text-[#94A3B8] hover:bg-slate-300 cursor-pointer"
                            title="Cancel"
                          >
                            <span className="material-symbols-outlined text-xs">close</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-[#111827] dark:text-[#F8FAFC] truncate" title={build.buildName}>
                            {build.buildName || 'Custom 3D Build'}
                          </h3>
                          <button
                            onClick={() => handleStartRename(build)}
                            className="opacity-0 group-hover:opacity-100 text-[#64748B] hover:text-[#0213B2] dark:text-[#94A3B8] dark:hover:text-[#60A5FA] transition-opacity cursor-pointer p-0.5"
                            title="Rename Build"
                          >
                            <span className="material-symbols-outlined text-xs">edit</span>
                          </button>
                        </div>
                      )}

                      <p className="text-xs text-[#0213B2] dark:text-[#60A5FA] font-semibold mt-0.5">
                        {car.brand ? `${car.brand} ${car.model}` : 'Performance Supercar'}
                      </p>
                    </div>

                    {/* Share Code Badge */}
                    <button
                      onClick={() => handleCopyShare(build.shareCode)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold bg-[#EEF2FF] dark:bg-[#1E293B] border border-[#0213B2]/20 dark:border-blue-900/40 text-[#0213B2] dark:text-[#60A5FA] hover:bg-[#D7E1FF] dark:hover:bg-[#1E293B]/80 transition-colors cursor-pointer"
                      title="Click to copy share code"
                    >
                      <span>{build.shareCode}</span>
                      <span className="material-symbols-outlined text-[12px]">content_copy</span>
                    </button>
                  </div>

                  {/* Specs Palette Preview */}
                  <div className="p-3.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1A1C26] border border-slate-200 dark:border-[#282A3A] space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#64748B] dark:text-[#94A3B8]">Custom Finishes:</span>
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/20 shadow-sm"
                          style={{ backgroundColor: build.bodyColor || '#CC0000' }}
                          title={`Body: ${build.bodyColor}`}
                        />
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/20 shadow-sm"
                          style={{ backgroundColor: build.rimColor || '#CCCCCC' }}
                          title={`Rims: ${build.rimColor}`}
                        />
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/10 dark:border-white/20 shadow-sm"
                          style={{ backgroundColor: build.glassColor || '#C8D8F0' }}
                          title={`Glass: ${build.glassColor}`}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#64748B] dark:text-[#94A3B8]">Finish Type:</span>
                      <span className="text-[#111827] dark:text-[#F8FAFC] font-medium">{build.bodyFinish || 'Metallic'}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1.5 border-t border-slate-200 dark:border-[#282A3A]">
                      <span className="text-[#64748B] dark:text-[#94A3B8]">Estimated Cost:</span>
                      <span className="text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                        ${(build.totalEstimatedCost || 250000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 mt-3 border-t border-slate-100 dark:border-[#282A3A] flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => navigate(`/configurator?build=${build.shareCode}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-xl bg-[#0213B2] text-white text-xs font-bold hover:bg-[#0115BC] transition-all cursor-pointer shadow-xs"
                    title="Open in 3D Configurator"
                  >
                    <span className="material-symbols-outlined text-xs">view_in_ar</span>
                    <span>Launch</span>
                  </button>

                  <button
                    onClick={() => handleForkBuild(build.shareCode)}
                    className="p-1.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1A1C26] border border-slate-200 dark:border-[#282A3A] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0213B2] dark:hover:text-white transition-colors cursor-pointer"
                    title="Duplicate / Fork Build"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                  </button>

                  <button
                    onClick={() => handleCopyShare(build.shareCode)}
                    className="p-1.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1A1C26] border border-slate-200 dark:border-[#282A3A] text-[#64748B] dark:text-[#94A3B8] hover:text-[#0213B2] dark:hover:text-white transition-colors cursor-pointer"
                    title="Copy Share Link"
                  >
                    <span className="material-symbols-outlined text-sm">share</span>
                  </button>

                  <button
                    onClick={() => handleDeleteBuild(build.shareCode, build.buildName)}
                    className="p-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/40 text-rose-600 dark:text-rose-400 hover:bg-rose-100 transition-colors cursor-pointer"
                    title="Delete Build"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
