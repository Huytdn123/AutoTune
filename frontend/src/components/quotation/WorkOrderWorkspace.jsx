import React from 'react'

/**
 * WorkOrderWorkspace - Service bay coordination, technician assignment, and milestone telemetry
 */
export default function WorkOrderWorkspace({
  workOrders = [],
  currentWorkOrder = null,
  onSelectWorkOrder,
  workOrderFilter = 'ALL',
  onFilterChange,
  loading = false,
  isGarageStaff = false,
  isOwnerOrAdmin = false,
  selectedTechId = '',
  setSelectedTechId,
  selectedBay = '',
  setSelectedBay,
  techNotes = '',
  setTechNotes,
  handleAssignTechnician,
  handleUpdateWorkOrderStatus,
  renderStatusBadge,
}) {
  const filteredWorkOrders = workOrders.filter((w) => {
    if (workOrderFilter === 'ALL') return true
    return w.status === workOrderFilter
  })

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* LEFT: Work Orders List */}
      <div className="lg:col-span-4 space-y-4">
        <div className="bg-[#E5E8F0] dark:bg-[#14151D] rounded-2xl p-4 border border-[#CBD5E1] dark:border-[#282A3A] shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-[#CBD5E1] dark:border-[#282A3A]">
            <h2 className="font-['Montserrat'] text-xs font-bold uppercase tracking-wider text-[#111827] dark:text-[#F8FAFC] flex items-center gap-1.5">
              <span className="material-symbols-outlined text-[#16A34A] dark:text-[#4ADE80] text-base">
                precision_manufacturing
              </span>
              <span>Service Bay Work Orders</span>
            </h2>
            <span className="text-[11px] font-mono text-[#475569] dark:text-[#94A3B8] font-semibold">
              {filteredWorkOrders.length} Orders
            </span>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono overflow-x-auto pb-1 scrollbar-none">
            {['ALL', 'IN_PROGRESS', 'PENDING', 'COMPLETED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                type="button"
                onClick={() => onFilterChange(st)}
                data-preserve-bg={workOrderFilter !== st ? 'true' : undefined}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  workOrderFilter === st
                    ? 'bg-[#16A34A] text-white font-bold shadow-xs'
                    : 'bg-white dark:bg-[#1B1D28] text-[#475569] dark:text-[#CBD5E1] border border-[#CBD5E1] dark:border-[#282A3A] hover:bg-[#DCFCE7] dark:hover:bg-[#16A34A]/20 hover:text-[#16A34A] dark:hover:text-[#4ADE80] shadow-2xs'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* List items */}
          {loading ? (
            <div className="py-12 text-center text-xs font-mono text-[#64748B] dark:text-[#94A3B8] flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-[#16A34A] border-t-transparent rounded-full animate-spin" />
              <span>Loading work orders...</span>
            </div>
          ) : filteredWorkOrders.length === 0 ? (
            <div className="py-12 text-center text-xs font-mono text-[#64748B] dark:text-[#94A3B8]">
              No work orders found for "{workOrderFilter}"
            </div>
          ) : (
            <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
              {filteredWorkOrders.map((wo) => {
                const isSelected = currentWorkOrder?.id === wo.id
                return (
                  <div
                    key={wo.id}
                    onClick={() => onSelectWorkOrder(wo)}
                    data-preserve-bg="true"
                    className={`p-3.5 rounded-xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'bg-gradient-to-r from-[#DCFCE7] via-[#E7FBF0] to-[#F2FCF6] dark:from-[#064E3B]/60 dark:via-[#043E2E]/60 dark:to-[#022A1E]/60 border-2 border-[#16A34A] dark:border-[#4ADE80] border-l-[6px] border-l-[#16A34A] dark:border-l-[#4ADE80] shadow-md shadow-emerald-500/10 dark:shadow-emerald-950/50'
                        : 'bg-white dark:bg-[#1B1D28] border border-[#CBD5E1] dark:border-[#282A3A] hover:border-[#16A34A]/50 dark:hover:border-[#4ADE80]/50 hover:bg-[#F8FAFC] dark:hover:bg-[#222533] shadow-xs hover:shadow-sm'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-1.5">
                        {isSelected && (
                          <span className="w-2 h-2 rounded-full bg-[#16A34A] dark:bg-[#4ADE80] animate-pulse shrink-0" />
                        )}
                        <span
                          className={`font-mono text-xs ${
                            isSelected
                              ? 'font-black text-[#16A34A] dark:text-[#4ADE80]'
                              : 'font-bold text-[#111827] dark:text-[#F8FAFC]'
                          }`}
                        >
                          {wo.workOrderNumber}
                        </span>
                      </div>
                      {renderStatusBadge(wo.status)}
                    </div>
                    <p
                      className={`text-xs font-semibold truncate ${
                        isSelected
                          ? 'text-[#06391A] dark:text-white font-bold'
                          : 'text-[#334155] dark:text-[#CBD5E1]'
                      }`}
                    >
                      {wo.vehicleModel}
                    </p>
                    <div className="mt-2 space-y-1">
                      <div className="flex items-center justify-between text-[11px] font-mono text-[#475569] dark:text-[#CBD5E1]">
                        <span>Progress:</span>
                        <span className="text-[#16A34A] dark:text-[#4ADE80] font-bold">
                          {wo.progress}%
                        </span>
                      </div>
                      <div className="w-full bg-[#CBD5E1] dark:bg-[#282A3A] h-1.5 rounded-full overflow-hidden">
                        <div
                          className="bg-[#16A34A] dark:bg-[#22C55E] h-full rounded-full transition-all duration-300"
                          style={{ width: `${wo.progress}%` }}
                        />
                      </div>
                    </div>
                    <div
                      className={`flex items-center justify-between mt-2 pt-2 border-t text-[10px] font-mono ${
                        isSelected
                          ? 'border-[#16A34A]/20 dark:border-[#4ADE80]/25'
                          : 'border-[#CBD5E1] dark:border-[#282A3A]'
                      } text-[#475569] dark:text-[#CBD5E1]`}
                    >
                      <span>
                        Tech:{' '}
                        <strong className="text-[#111827] dark:text-[#F8FAFC]">
                          {wo.technicianName || 'Unassigned'}
                        </strong>
                      </span>
                      <span>{wo.bayNumber?.split('-')[0] || 'Bay 01'}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT: Active Work Order Bay Execution Console */}
      {currentWorkOrder ? (
        <div className="lg:col-span-8 space-y-6">
          {/* Work Order Header */}
          <div className="bg-[#E5E8F0] dark:bg-[#14151D] rounded-2xl p-5 border border-[#CBD5E1] dark:border-[#282A3A] shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-sm font-bold text-[#16A34A] dark:text-[#4ADE80]">
                  {currentWorkOrder.workOrderNumber}
                </span>
                {renderStatusBadge(currentWorkOrder.status)}
                <span className="px-2 py-0.5 rounded text-[10px] font-mono text-[#475569] dark:text-[#94A3B8] border border-[#CBD5E1] dark:border-[#282A3A]">
                  Linked Quote: {currentWorkOrder.quotationNumber}
                </span>
              </div>
              <h2 className="font-['Montserrat'] text-xl font-bold text-[#111827] dark:text-[#F8FAFC]">
                {currentWorkOrder.vehicleModel}
              </h2>
              <p className="text-xs text-[#475569] dark:text-[#CBD5E1] font-mono mt-0.5">
                Client:{' '}
                <strong className="text-[#111827] dark:text-[#F8FAFC]">
                  {currentWorkOrder.customerName}
                </strong>{' '}
                • {currentWorkOrder.bayNumber}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 rounded-lg bg-[#DCFCE7] dark:bg-[#16A34A]/20 border border-[#16A34A]/30 text-xs font-mono text-[#16A34A] dark:text-[#4ADE80] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#16A34A] dark:bg-[#22C55E] animate-ping" />
                <span>Bay Active</span>
              </span>
            </div>
          </div>

          {/* Progress Bar & Stage Controls */}
          <div className="bg-[#E5E8F0] dark:bg-[#14151D] rounded-2xl p-5 border border-[#CBD5E1] dark:border-[#282A3A] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-['Montserrat'] text-sm font-bold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#16A34A] dark:text-[#4ADE80] text-base">
                    speed
                  </span>
                  <span>Service Bay Execution Progress</span>
                </h3>
                <p className="text-xs text-[#475569] dark:text-[#CBD5E1] font-mono mt-0.5">
                  Real-time workshop bay telemetry & staging checkpoints
                </p>
              </div>
              <span className="font-mono text-2xl font-extrabold text-[#16A34A] dark:text-[#4ADE80]">
                {currentWorkOrder.progress}%
              </span>
            </div>

            {/* Visual Progress Bar */}
            <div className="w-full bg-[#CBD5E1] dark:bg-[#282A3A] h-3 rounded-full overflow-hidden shadow-inner">
              <div
                className="bg-gradient-to-r from-[#0213B2] to-[#16A34A] h-full rounded-full transition-all duration-500"
                style={{ width: `${currentWorkOrder.progress}%` }}
              />
            </div>

            {/* Quick Stage Progression Buttons (For Technicians / Garage Staff) */}
            {isGarageStaff && (
              <div className="pt-2">
                <span className="text-[11px] font-mono uppercase text-[#475569] dark:text-[#CBD5E1] block mb-2">
                  Execution Milestones:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleUpdateWorkOrderStatus('IN_PROGRESS', 25)}
                    data-preserve-bg="true"
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1B1D28] border border-[#CBD5E1] dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] text-xs font-mono text-left transition-all cursor-pointer shadow-2xs"
                  >
                    <span className="text-[10px] text-[#0213B2] dark:text-[#60A5FA] block font-bold">
                      25%
                    </span>
                    <span className="text-[#111827] dark:text-[#F8FAFC] text-[11px] truncate block font-semibold">
                      Pre-Check & Alignment
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateWorkOrderStatus('IN_PROGRESS', 50)}
                    data-preserve-bg="true"
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1B1D28] border border-[#CBD5E1] dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] text-xs font-mono text-left transition-all cursor-pointer shadow-2xs"
                  >
                    <span className="text-[10px] text-[#0213B2] dark:text-[#60A5FA] block font-bold">
                      50%
                    </span>
                    <span className="text-[#111827] dark:text-[#F8FAFC] text-[11px] truncate block font-semibold">
                      Hardware Staging
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateWorkOrderStatus('IN_PROGRESS', 75)}
                    data-preserve-bg="true"
                    className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-[#1B1D28] border border-[#CBD5E1] dark:border-[#282A3A] hover:border-[#0213B2] dark:hover:border-[#60A5FA] text-xs font-mono text-left transition-all cursor-pointer shadow-2xs"
                  >
                    <span className="text-[10px] text-[#0213B2] dark:text-[#60A5FA] block font-bold">
                      75%
                    </span>
                    <span className="text-[#111827] dark:text-[#F8FAFC] text-[11px] truncate block font-semibold">
                      Dyno Calibration
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleUpdateWorkOrderStatus('COMPLETED', 100)}
                    data-preserve-bg="true"
                    className="px-2.5 py-1.5 rounded-lg bg-[#DCFCE7] dark:bg-[#16A34A]/20 border border-[#16A34A]/40 hover:bg-[#DCFCE7]/80 text-xs font-mono text-left transition-all cursor-pointer shadow-2xs"
                  >
                    <span className="text-[10px] text-[#16A34A] dark:text-[#4ADE80] block font-bold">
                      100%
                    </span>
                    <span className="text-[#16A34A] dark:text-[#4ADE80] text-[11px] truncate block font-bold">
                      Final QC & Complete
                    </span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Technician Assignment & Operations Console (Staff Only) */}
          {isGarageStaff && (
            <div className="bg-[#E5E8F0] dark:bg-[#14151D] rounded-2xl p-5 border border-[#CBD5E1] dark:border-[#282A3A] shadow-sm space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-[#CBD5E1] dark:border-[#282A3A]">
                <h3 className="font-['Montserrat'] text-sm font-bold text-[#111827] dark:text-[#F8FAFC] flex items-center gap-2">
                  <span className="material-symbols-outlined text-[#0213B2] dark:text-[#60A5FA] text-base">
                    engineering
                  </span>
                  <span>Technician Assignment & Bay Dispatch</span>
                </h3>
                <span className="text-xs font-mono text-[#64748B]">
                  Garage Owner / Manager Control
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Technician Selector */}
                <div>
                  <label className="text-xs font-mono text-[#64748B] block mb-1.5">
                    Assign Lead Technician:
                  </label>
                  <select
                    value={selectedTechId}
                    onChange={(e) => setSelectedTechId(e.target.value)}
                    disabled={!isOwnerOrAdmin}
                    data-preserve-bg="true"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1B1D28] border border-[#CBD5E1] dark:border-[#282A3A] text-xs font-mono text-[#111827] dark:text-[#F8FAFC] focus:border-[#0213B2] dark:focus:border-[#60A5FA] focus:ring-1 focus:ring-[#0213B2] dark:focus:ring-[#60A5FA] focus:outline-none"
                  >
                    <option value="">-- Select Certified Technician --</option>
                    <option value="3">Long Nguyen (Master Technician - Lead)</option>
                    <option value="4">Duc Vu (Service Technician - Junior)</option>
                    <option value="2">Tuan Tran (Garage Owner & Shop Foreman)</option>
                  </select>
                </div>

                {/* Bay Selector */}
                <div>
                  <label className="text-xs font-mono text-[#475569] dark:text-[#CBD5E1] block mb-1.5">
                    Service Bay Location:
                  </label>
                  <select
                    value={selectedBay}
                    onChange={(e) => setSelectedBay(e.target.value)}
                    disabled={!isOwnerOrAdmin}
                    data-preserve-bg="true"
                    className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1B1D28] border border-[#CBD5E1] dark:border-[#282A3A] text-xs font-mono text-[#111827] dark:text-[#F8FAFC] focus:border-[#0213B2] dark:focus:border-[#60A5FA] focus:ring-1 focus:ring-[#0213B2] dark:focus:ring-[#60A5FA] focus:outline-none"
                  >
                    <option value="Bay 01 - Dyno & Performance Alignment">
                      Bay 01 - Dyno & Performance Alignment
                    </option>
                    <option value="Bay 02 - Suspension & Clubsport Lift">
                      Bay 02 - Suspension & Clubsport Lift
                    </option>
                    <option value="Bay 03 - Laser Kinematics & BBK Clearance">
                      Bay 03 - Laser Kinematics & BBK Clearance
                    </option>
                    <option value="Bay 04 - Aero Staging & Bodywork">
                      Bay 04 - Aero Staging & Bodywork
                    </option>
                  </select>
                </div>
              </div>

              {/* Operational Notes */}
              <div>
                <label className="text-xs font-mono text-[#475569] dark:text-[#CBD5E1] block mb-1.5">
                  Execution Notes / Diagnostic Log:
                </label>
                <textarea
                  rows={2}
                  value={techNotes}
                  onChange={(e) => setTechNotes(e.target.value)}
                  placeholder="Add bay notes, torque specifications, sensor readings..."
                  data-preserve-bg="true"
                  className="w-full px-3 py-2 rounded-lg bg-white dark:bg-[#1B1D28] border border-[#CBD5E1] dark:border-[#282A3A] text-xs font-mono text-[#111827] dark:text-[#F8FAFC] placeholder-[#94A3B8] focus:border-[#0213B2] dark:focus:border-[#60A5FA] focus:ring-1 focus:ring-[#0213B2] dark:focus:ring-[#60A5FA] focus:outline-none"
                />
              </div>

              {/* Submit Assignment Buttons */}
              <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
                {isOwnerOrAdmin && (
                  <button
                    type="button"
                    onClick={handleAssignTechnician}
                    className="px-4 py-2 bg-[#0213B2] hover:bg-[#0115BC] text-white rounded-lg text-xs font-['Montserrat'] font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">badge</span>
                    <span>Save Bay & Technician Assignment</span>
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleUpdateWorkOrderStatus()}
                  className="px-4 py-2 bg-[#16A34A] hover:bg-[#15803D] text-white rounded-lg text-xs font-['Montserrat'] font-bold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                >
                  <span className="material-symbols-outlined text-sm">save</span>
                  <span>Save Status & Notes</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="lg:col-span-8 bg-[#E5E8F0] dark:bg-[#14151D] rounded-2xl p-12 text-center text-xs font-mono text-[#475569] dark:text-[#CBD5E1] border border-[#CBD5E1] dark:border-[#282A3A]">
          Please select a work order from the list on the left to monitor or manage bay execution.
        </div>
      )}
    </div>
  )
}
