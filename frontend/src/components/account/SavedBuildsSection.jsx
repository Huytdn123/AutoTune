import React from 'react'

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
          <h2 className="text-lg font-bold text-[#111827] flex items-center gap-2">
            <span>Custom Builds Library</span>
            <span className="text-xs font-mono text-[#0213B2]">({builds.length} Active Configurations)</span>
          </h2>
          <p className="text-xs text-[#475569]">
            All bespoke 3D vehicle configurations created by your account. Stored securely in database.
          </p>
        </div>

        <button
          onClick={() => navigate('/configurator')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#0213B2] text-white hover:bg-[#0115BC] transition-all shadow-sm self-start sm:self-auto cursor-pointer"
        >
          <span className="material-symbols-outlined text-sm">add_circle</span>
          <span>New 3D Build</span>
        </button>
      </div>

      {buildsLoading ? (
        <div className="p-12 text-center rounded-2xl bg-white border border-[#E2E8F0] space-y-3">
          <span className="material-symbols-outlined text-3xl text-[#0213B2] animate-spin">refresh</span>
          <p className="text-sm text-[#475569] font-mono">Fetching saved builds from database...</p>
        </div>
      ) : builds.length === 0 ? (
        <div 
          className="p-12 text-center rounded-2xl border border-dashed border-[#CBD5E1] bg-white space-y-4"
        >
          <div className="w-14 h-14 rounded-full bg-[#EEF2FF] border border-[#CBD5E1] flex items-center justify-center mx-auto text-[#0213B2] shadow-sm">
            <span className="material-symbols-outlined text-2xl">directions_car</span>
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="text-base font-bold text-[#111827]">No Saved Builds Yet</h3>
            <p className="text-xs text-[#475569]">
              Launch the 3D Configurator to tune suspension, paint finishes, rims, and aerodynamic components, then save your setup here.
            </p>
          </div>
          <button
            onClick={() => navigate('/configurator')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#0213B2] text-white hover:bg-[#0115BC] transition-all shadow-md cursor-pointer"
          >
            <span className="material-symbols-outlined text-sm">view_in_ar</span>
            <span>Launch 3D Configurator</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {builds.map((build) => {
            const car = build.car || {}
            const isRenaming = renamingCode === build.shareCode

            return (
              <div 
                key={build.shareCode}
                className="rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 bg-white border border-[#E2E8F0] shadow-sm hover:border-[#0213B2] hover:shadow-md group"
              >
                <div className="space-y-3">
                  {/* Build Header */}
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      {isRenaming ? (
                        <div className="flex items-center gap-1.5">
                          <input
                            type="text"
                            value={renameInput}
                            onChange={(e) => setRenameInput(e.target.value)}
                            className="w-full text-xs font-bold bg-[#E5E8F0] dark:bg-[#14151D] border border-[#0213B2] dark:border-[#60A5FA] rounded px-2 py-1 text-[#111827] dark:text-[#F8FAFC] outline-none"
                            autoFocus
                          />
                          <button
                            onClick={() => handleSaveRename(build.shareCode)}
                            className="p-1 rounded bg-[#16A34A] text-white hover:brightness-110 cursor-pointer"
                            title="Save Name"
                          >
                            <span className="material-symbols-outlined text-xs">check</span>
                          </button>
                          <button
                            onClick={() => setRenamingCode(null)}
                            className="p-1 rounded bg-[#F1F5F9] text-[#475569] hover:bg-[#E2E8F0] cursor-pointer"
                            title="Cancel"
                          >
                            <span className="material-symbols-outlined text-xs">close</span>
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-[#111827] truncate" title={build.buildName}>
                            {build.buildName || 'Custom 3D Build'}
                          </h3>
                          <button
                            onClick={() => handleStartRename(build)}
                            className="opacity-0 group-hover:opacity-100 text-[#475569] hover:text-[#0213B2] transition-opacity cursor-pointer p-0.5"
                            title="Rename Build"
                          >
                            <span className="material-symbols-outlined text-xs">edit</span>
                          </button>
                        </div>
                      )}

                      <p className="text-xs text-[#0213B2] font-semibold mt-0.5">
                        {car.brand ? `${car.brand} ${car.model}` : 'Performance Supercar'}
                      </p>
                    </div>

                    {/* Share Code Badge */}
                    <button
                      onClick={() => handleCopyShare(build.shareCode)}
                      className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono font-bold bg-[#EEF2FF] border border-[#CBD5E1] text-[#0213B2] hover:bg-[#E0E7FF] transition-colors cursor-pointer"
                      title="Click to copy share code"
                    >
                      <span>{build.shareCode}</span>
                      <span className="material-symbols-outlined text-[12px]">content_copy</span>
                    </button>
                  </div>

                  {/* Specs Palette Preview */}
                  <div className="p-3 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-2">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#475569]">Custom Finishes:</span>
                      <div className="flex items-center gap-1.5">
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: build.bodyColor || '#CC0000' }}
                          title={`Body: ${build.bodyColor}`}
                        />
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: build.rimColor || '#CCCCCC' }}
                          title={`Rims: ${build.rimColor}`}
                        />
                        <span 
                          className="w-3.5 h-3.5 rounded-full border border-black/10 shadow-sm"
                          style={{ backgroundColor: build.glassColor || '#C8D8F0' }}
                          title={`Glass: ${build.glassColor}`}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-[#475569]">Finish Type:</span>
                      <span className="text-[#111827] font-medium">{build.bodyFinish || 'Metallic'}</span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] pt-1 border-t border-[#E2E8F0]">
                      <span className="text-[#475569]">Estimated Cost:</span>
                      <span className="text-[#16A34A] font-bold font-mono">
                        ${(build.totalEstimatedCost || 250000).toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="pt-4 mt-3 border-t border-[#E2E8F0] flex items-center justify-between gap-1.5">
                  <button
                    onClick={() => navigate(`/configurator?build=${build.shareCode}`)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-[#0213B2] text-white text-xs font-bold hover:bg-[#0115BC] transition-all cursor-pointer shadow-sm"
                    title="Open in 3D Configurator"
                  >
                    <span className="material-symbols-outlined text-xs">view_in_ar</span>
                    <span>Launch</span>
                  </button>

                  <button
                    onClick={() => handleForkBuild(build.shareCode)}
                    className="p-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0213B2] transition-colors cursor-pointer"
                    title="Duplicate / Fork Build"
                  >
                    <span className="material-symbols-outlined text-sm">content_copy</span>
                  </button>

                  <button
                    onClick={() => handleCopyShare(build.shareCode)}
                    className="p-1.5 rounded-lg bg-[#F8FAFC] border border-[#E2E8F0] text-[#475569] hover:bg-[#F1F5F9] hover:text-[#0213B2] transition-colors cursor-pointer"
                    title="Copy Share Link"
                  >
                    <span className="material-symbols-outlined text-sm">share</span>
                  </button>

                  <button
                    onClick={() => handleDeleteBuild(build.shareCode, build.buildName)}
                    className="p-1.5 rounded-lg bg-[#FEE2E2] border border-[#FCA5A5] text-[#DC2626] hover:bg-[#FECACA] transition-colors cursor-pointer"
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
