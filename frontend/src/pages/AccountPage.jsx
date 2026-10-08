import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { userApi, buildApi } from '../services/api'

export default function AccountPage() {
  const navigate = useNavigate()
  const { currentUser, role, updateCurrentUser } = useAuth()

  const [activeTab, setActiveTab] = useState('builds') // 'builds' | 'profile' | 'security'
  const [loading, setLoading] = useState(false)
  const [toast, setToast] = useState(null)

  // Profile Form State
  const [profileForm, setProfileForm] = useState({
    fullName: '',
    phone: '',
    avatarUrl: ''
  })
  const [profileSaving, setProfileSaving] = useState(false)

  // Security Form State
  const [securityForm, setSecurityForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })
  const [passwordSaving, setPasswordSaving] = useState(false)

  // Saved Builds State
  const [builds, setBuilds] = useState([])
  const [buildsLoading, setBuildsLoading] = useState(true)
  const [renamingCode, setRenamingCode] = useState(null)
  const [renameInput, setRenameInput] = useState('')

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  // Load initial profile and builds
  useEffect(() => {
    if (currentUser) {
      setProfileForm({
        fullName: currentUser.fullName || '',
        phone: currentUser.phone || '',
        avatarUrl: currentUser.avatar || currentUser.avatarUrl || ''
      })
      loadMyBuilds()
    }
  }, [currentUser])

  const loadMyBuilds = async () => {
    setBuildsLoading(true)
    try {
      const data = await buildApi.getMyBuilds()
      setBuilds(Array.isArray(data) ? data : [])
    } catch (err) {
      console.error('Failed to load builds:', err)
      showToast('Could not load saved builds from server', 'error')
    } finally {
      setBuildsLoading(false)
    }
  }

  // Handle Profile Update
  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    if (!profileForm.fullName.trim()) {
      showToast('Full name is required', 'error')
      return
    }

    setProfileSaving(true)
    try {
      const updated = await userApi.updateProfile({
        fullName: profileForm.fullName.trim(),
        phone: profileForm.phone.trim(),
        avatarUrl: profileForm.avatarUrl.trim()
      })
      updateCurrentUser(updated)
      showToast('Profile information successfully updated!')
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to update profile'
      showToast(msg, 'error')
    } finally {
      setProfileSaving(false)
    }
  }

  // Handle Password Change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    if (!securityForm.currentPassword) {
      showToast('Please enter your current password', 'error')
      return
    }
    if (securityForm.newPassword.length < 6) {
      showToast('New password must be at least 6 characters', 'error')
      return
    }
    if (securityForm.newPassword !== securityForm.confirmPassword) {
      showToast('New passwords do not match', 'error')
      return
    }

    setPasswordSaving(true)
    try {
      await userApi.changePassword({
        currentPassword: securityForm.currentPassword,
        newPassword: securityForm.newPassword,
        confirmPassword: securityForm.confirmPassword
      })
      showToast('Security credentials updated successfully!')
      setSecurityForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      const msg = err.response?.data?.message || 'Incorrect password or update failed'
      showToast(msg, 'error')
    } finally {
      setPasswordSaving(false)
    }
  }

  // Handle Build Deletion
  const handleDeleteBuild = async (shareCode, buildName) => {
    if (!window.confirm(`Are you sure you want to permanently delete "${buildName}" (${shareCode})?`)) {
      return
    }

    try {
      await buildApi.delete(shareCode)
      setBuilds(prev => prev.filter(b => b.shareCode !== shareCode))
      showToast(`Build ${shareCode} permanently removed`)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to delete build. Ownership required.'
      showToast(msg, 'error')
    }
  }

  // Handle Build Rename
  const handleStartRename = (build) => {
    setRenamingCode(build.shareCode)
    setRenameInput(build.buildName || '')
  }

  const handleSaveRename = async (shareCode) => {
    if (!renameInput.trim()) {
      showToast('Build name cannot be empty', 'error')
      return
    }

    try {
      const updated = await buildApi.rename(shareCode, renameInput.trim())
      setBuilds(prev => prev.map(b => b.shareCode === shareCode ? { ...b, buildName: updated.buildName } : b))
      setRenamingCode(null)
      showToast(`Renamed to "${updated.buildName}"`)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to rename build'
      showToast(msg, 'error')
    }
  }

  // Handle Build Fork
  const handleForkBuild = async (shareCode) => {
    try {
      const forked = await buildApi.fork(shareCode)
      setBuilds(prev => [forked, ...prev])
      showToast(`Duplicated into new build: ${forked.shareCode}`)
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to duplicate build'
      showToast(msg, 'error')
    }
  }

  // Handle Share Link Copy
  const handleCopyShare = (shareCode) => {
    const url = `${window.location.origin}/configurator?share=${shareCode}`
    navigator.clipboard.writeText(url)
    showToast(`Share link copied to clipboard! (${shareCode})`)
  }

  // Role Color Matrix
  const roleBadgeColors = {
    GARAGE_OWNER: { bg: 'rgba(96,145,195,0.15)', border: 'rgba(96,145,195,0.4)', text: '#6091C3', label: 'Garage Owner (B2B)' },
    LEAD_TECHNICIAN: { bg: 'rgba(16,185,129,0.15)', border: 'rgba(16,185,129,0.4)', text: '#10B981', label: 'Master Technician' },
    CAR_OWNER: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', text: '#F59E0B', label: 'Verified Car Owner' },
    CUSTOMER: { bg: 'rgba(245,158,11,0.15)', border: 'rgba(245,158,11,0.4)', text: '#F59E0B', label: 'Verified Car Owner' },
    ADMIN: { bg: 'rgba(168,85,247,0.15)', border: 'rgba(168,85,247,0.4)', text: '#A855F7', label: 'System Administrator' }
  }

  const currentBadge = roleBadgeColors[role] || roleBadgeColors.CAR_OWNER

  return (
    <div className="min-h-screen bg-[#0d131f] text-[#e3e8f5] py-8 px-4 sm:px-6 lg:px-8">
      {/* Toast Feedback */}
      {toast && (
        <div 
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-lg shadow-2xl flex items-center gap-2.5 animate-in fade-in"
          style={{
            backgroundColor: toast.type === 'error' ? '#3B1219' : '#1f2f57',
            border: `1.5px solid ${toast.type === 'error' ? '#EF4444' : '#6091c3'}`,
            color: '#dae2ff'
          }}
        >
          <span className="material-symbols-outlined text-base" style={{ color: toast.type === 'error' ? '#EF4444' : '#6091c3' }}>
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* User Hero Header Card */}
        <div 
          className="rounded-2xl p-6 sm:p-8 relative overflow-hidden backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(22, 36, 71, 0.75)',
            border: '1px solid rgba(96, 145, 195, 0.25)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
          }}
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar Preview */}
            <div className="relative group">
              <div 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex items-center justify-center font-bold text-3xl shadow-xl border-2"
                style={{
                  backgroundColor: '#1f2f57',
                  borderColor: currentBadge.text,
                  color: '#dae2ff'
                }}
              >
                {currentUser?.avatar || profileForm.avatarUrl ? (
                  <img 
                    src={profileForm.avatarUrl || currentUser?.avatar} 
                    alt={currentUser?.fullName || 'User'} 
                    className="w-full h-full object-cover"
                    onError={(e) => { e.target.style.display = 'none' }}
                  />
                ) : (
                  <span>{currentUser?.fullName?.charAt(0) || 'U'}</span>
                )}
              </div>
              <div 
                className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase shadow"
                style={{ backgroundColor: currentBadge.bg, color: currentBadge.text, border: `1px solid ${currentBadge.border}` }}
              >
                {role}
              </div>
            </div>

            {/* User Meta */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                    {currentUser?.fullName || currentUser?.username}
                  </h1>
                  <p className="text-sm text-[#8fa2c7] font-mono">
                    @{currentUser?.username} • {currentUser?.email}
                  </p>
                </div>

                {/* Role & Access Badge */}
                <div 
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase self-center sm:self-start"
                  style={{
                    backgroundColor: currentBadge.bg,
                    border: `1px solid ${currentBadge.border}`,
                    color: currentBadge.text
                  }}
                >
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  <span>{currentBadge.label}</span>
                </div>
              </div>

              {currentUser?.garageName && (
                <div className="inline-flex items-center gap-1.5 text-xs text-[#a6b8de] pt-1">
                  <span className="material-symbols-outlined text-sm text-[#6091c3]">domain</span>
                  <span>Affiliated Workshop: <strong className="text-white">{currentUser.garageName}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 border-t border-white/10 pt-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('builds')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === 'builds'
                  ? 'bg-[#6091c3] text-[#0d131f] shadow-lg'
                  : 'text-[#8fa2c7] hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-sm">directions_car</span>
              <span>My Saved Builds</span>
              <span 
                className="px-1.5 py-0.2 rounded-full text-[10px] font-mono"
                style={{
                  backgroundColor: activeTab === 'builds' ? '#0d131f' : 'rgba(96,145,195,0.2)',
                  color: activeTab === 'builds' ? '#dae2ff' : '#6091c3'
                }}
              >
                {builds.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#6091c3] text-[#0d131f] shadow-lg'
                  : 'text-[#8fa2c7] hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-sm">person</span>
              <span>Profile Information</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-[#6091c3] text-[#0d131f] shadow-lg'
                  : 'text-[#8fa2c7] hover:text-white hover:bg-white/5'
              }`}
            >
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>Security & Password</span>
            </button>
          </div>
        </div>

        {/* TAB 1: MY SAVED BUILDS */}
        {activeTab === 'builds' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 px-1">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>Custom Builds Library</span>
                  <span className="text-xs font-mono text-[#6091c3]">({builds.length} Active Configurations)</span>
                </h2>
                <p className="text-xs text-[#8fa2c7]">
                  All bespoke 3D vehicle configurations created by your account. Stored securely in database.
                </p>
              </div>

              <button
                onClick={() => navigate('/configurator')}
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#6091c3] text-[#0d131f] hover:brightness-110 transition-all shadow-md self-start sm:self-auto cursor-pointer"
              >
                <span className="material-symbols-outlined text-sm">add_circle</span>
                <span>New 3D Build</span>
              </button>
            </div>

            {buildsLoading ? (
              <div className="p-12 text-center rounded-2xl bg-[#162447]/50 border border-white/10 space-y-3">
                <span className="material-symbols-outlined text-3xl text-[#6091c3] animate-spin">refresh</span>
                <p className="text-sm text-[#8fa2c7] font-mono">Fetching saved builds from database...</p>
              </div>
            ) : builds.length === 0 ? (
              <div 
                className="p-12 text-center rounded-2xl border border-dashed border-white/15 space-y-4"
                style={{ backgroundColor: 'rgba(22, 36, 71, 0.4)' }}
              >
                <div className="w-14 h-14 rounded-full bg-[#1f2f57] flex items-center justify-center mx-auto text-[#6091c3]">
                  <span className="material-symbols-outlined text-2xl">directions_car</span>
                </div>
                <div className="max-w-md mx-auto space-y-1">
                  <h3 className="text-base font-bold text-white">No Saved Builds Yet</h3>
                  <p className="text-xs text-[#8fa2c7]">
                    Launch the 3D Configurator to tune suspension, paint finishes, rims, and aerodynamic components, then save your setup here.
                  </p>
                </div>
                <button
                  onClick={() => navigate('/configurator')}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#6091c3] text-[#0d131f] hover:brightness-110 transition-all shadow-lg cursor-pointer"
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
                      className="rounded-2xl p-5 flex flex-col justify-between transition-all duration-200 hover:border-[#6091c3]/50 hover:shadow-xl group"
                      style={{
                        backgroundColor: 'rgba(22, 36, 71, 0.65)',
                        border: '1px solid rgba(96, 145, 195, 0.2)',
                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)'
                      }}
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
                                  className="w-full text-xs font-bold bg-[#0d131f] border border-[#6091c3] rounded px-2 py-1 text-white outline-none"
                                  autoFocus
                                />
                                <button
                                  onClick={() => handleSaveRename(build.shareCode)}
                                  className="p-1 rounded bg-[#10b981] text-[#0d131f] hover:brightness-110"
                                  title="Save Name"
                                >
                                  <span className="material-symbols-outlined text-xs">check</span>
                                </button>
                                <button
                                  onClick={() => setRenamingCode(null)}
                                  className="p-1 rounded bg-white/10 text-white/70 hover:bg-white/20"
                                  title="Cancel"
                                >
                                  <span className="material-symbols-outlined text-xs">close</span>
                                </button>
                              </div>
                            ) : (
                              <div className="flex items-center gap-1.5">
                                <h3 className="text-sm font-bold text-white truncate" title={build.buildName}>
                                  {build.buildName || 'Custom 3D Build'}
                                </h3>
                                <button
                                  onClick={() => handleStartRename(build)}
                                  className="opacity-0 group-hover:opacity-100 text-[#8fa2c7] hover:text-[#6091c3] transition-opacity cursor-pointer p-0.5"
                                  title="Rename Build"
                                >
                                  <span className="material-symbols-outlined text-xs">edit</span>
                                </button>
                              </div>
                            )}

                            <p className="text-xs text-[#6091c3] font-semibold mt-0.5">
                              {car.brand ? `${car.brand} ${car.model}` : 'Performance Supercar'}
                            </p>
                          </div>

                          {/* Share Code Badge */}
                          <button
                            onClick={() => handleCopyShare(build.shareCode)}
                            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-mono font-bold bg-[#1f2f57] border border-[#6091c3]/40 text-[#dae2ff] hover:bg-[#6091c3]/20 transition-colors cursor-pointer"
                            title="Click to copy share code"
                          >
                            <span>{build.shareCode}</span>
                            <span className="material-symbols-outlined text-[12px]">content_copy</span>
                          </button>
                        </div>

                        {/* Specs Palette Preview */}
                        <div className="p-3 rounded-xl bg-[#0d131f]/70 border border-white/5 space-y-2">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[#8fa2c7]">Custom Finishes:</span>
                            <div className="flex items-center gap-1.5">
                              <span 
                                className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm"
                                style={{ backgroundColor: build.bodyColor || '#CC0000' }}
                                title={`Body: ${build.bodyColor}`}
                              />
                              <span 
                                className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm"
                                style={{ backgroundColor: build.rimColor || '#CCCCCC' }}
                                title={`Rims: ${build.rimColor}`}
                              />
                              <span 
                                className="w-3.5 h-3.5 rounded-full border border-white/30 shadow-sm"
                                style={{ backgroundColor: build.glassColor || '#C8D8F0' }}
                                title={`Glass: ${build.glassColor}`}
                              />
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-[#8fa2c7]">Finish Type:</span>
                            <span className="text-white font-medium">{build.bodyFinish || 'Metallic'}</span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] pt-1 border-t border-white/5">
                            <span className="text-[#8fa2c7]">Estimated Cost:</span>
                            <span className="text-emerald-400 font-bold font-mono">
                              ${(build.totalEstimatedCost || 250000).toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Card Action Buttons */}
                      <div className="pt-4 mt-3 border-t border-white/10 flex items-center justify-between gap-1.5">
                        <button
                          onClick={() => navigate(`/configurator?build=${build.shareCode}`)}
                          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 px-2 rounded-lg bg-[#6091c3] text-[#0d131f] text-xs font-bold hover:brightness-110 transition-all cursor-pointer shadow"
                          title="Open in 3D Configurator"
                        >
                          <span className="material-symbols-outlined text-xs">view_in_ar</span>
                          <span>Launch</span>
                        </button>

                        <button
                          onClick={() => handleForkBuild(build.shareCode)}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                          title="Duplicate / Fork Build"
                        >
                          <span className="material-symbols-outlined text-sm">content_copy</span>
                        </button>

                        <button
                          onClick={() => handleCopyShare(build.shareCode)}
                          className="p-1.5 rounded-lg bg-white/5 border border-white/10 text-white/70 hover:bg-white/15 hover:text-white transition-colors cursor-pointer"
                          title="Copy Share Link"
                        >
                          <span className="material-symbols-outlined text-sm">share</span>
                        </button>

                        <button
                          onClick={() => handleDeleteBuild(build.shareCode, build.buildName)}
                          className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors cursor-pointer"
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
        )}

        {/* TAB 2: PROFILE INFORMATION */}
        {activeTab === 'profile' && (
          <div 
            className="rounded-2xl p-6 sm:p-8 backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(22, 36, 71, 0.75)',
              border: '1px solid rgba(96, 145, 195, 0.25)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
          >
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">Account Details</h2>
                <p className="text-xs text-[#8fa2c7]">
                  Manage your personal information and profile picture visible to certified tuning workshops.
                </p>
              </div>

              <form onSubmit={handleProfileSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-[#8fa2c7] mb-1.5">
                    Full Name <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="text"
                    value={profileForm.fullName}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d131f] border border-white/15 text-white text-xs outline-none focus:border-[#6091c3] transition-colors"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold text-[#8fa2c7] mb-1.5">
                    Contact Phone
                  </label>
                  <input
                    type="tel"
                    value={profileForm.phone}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+84 901 234 567"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d131f] border border-white/15 text-white text-xs outline-none focus:border-[#6091c3] transition-colors font-mono"
                  />
                </div>

                {/* Avatar URL */}
                <div>
                  <label className="block text-xs font-semibold text-[#8fa2c7] mb-1.5">
                    Avatar Image URL
                  </label>
                  <input
                    type="url"
                    value={profileForm.avatarUrl}
                    onChange={(e) => setProfileForm(prev => ({ ...prev, avatarUrl: e.target.value }))}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d131f] border border-white/15 text-white text-xs outline-none focus:border-[#6091c3] transition-colors font-mono"
                  />
                  <p className="text-[10px] text-[#8fa2c7] mt-1">
                    Provide a direct link to an avatar image (Unsplash, Gravatar, or CDN).
                  </p>
                </div>

                {/* Read-Only Account Fields */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-[#8fa2c7] mb-1.5">
                      Username (Immutable)
                    </label>
                    <input
                      type="text"
                      value={currentUser?.username || ''}
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d131f]/50 border border-white/10 text-white/50 text-xs font-mono cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#8fa2c7] mb-1.5">
                      Email Address (Protected)
                    </label>
                    <input
                      type="email"
                      value={currentUser?.email || ''}
                      disabled
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d131f]/50 border border-white/10 text-white/50 text-xs font-mono cursor-not-allowed"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={profileSaving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#6091c3] text-[#0d131f] hover:brightness-110 transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {profileSaving ? (
                      <>
                        <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">save</span>
                        <span>Save Profile Changes</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* TAB 3: SECURITY & PASSWORD */}
        {activeTab === 'security' && (
          <div 
            className="rounded-2xl p-6 sm:p-8 backdrop-blur-md"
            style={{
              backgroundColor: 'rgba(22, 36, 71, 0.75)',
              border: '1px solid rgba(96, 145, 195, 0.25)',
              boxShadow: '0 20px 40px rgba(0,0,0,0.4)'
            }}
          >
            <div className="max-w-2xl space-y-6">
              <div>
                <h2 className="text-lg font-bold text-white">Security & Password</h2>
                <p className="text-xs text-[#8fa2c7]">
                  Update your authentication credentials. Passwords are encrypted using BCrypt salted hashing.
                </p>
              </div>

              <form onSubmit={handlePasswordSubmit} className="space-y-4">
                {/* Current Password */}
                <div>
                  <label className="block text-xs font-semibold text-[#8fa2c7] mb-1.5">
                    Current Password <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={securityForm.currentPassword}
                    onChange={(e) => setSecurityForm(prev => ({ ...prev, currentPassword: e.target.value }))}
                    placeholder="Enter current password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d131f] border border-white/15 text-white text-xs outline-none focus:border-[#6091c3] transition-colors"
                  />
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-semibold text-[#8fa2c7] mb-1.5">
                    New Password <span className="text-rose-400">*</span> (min. 6 characters)
                  </label>
                  <input
                    type="password"
                    value={securityForm.newPassword}
                    onChange={(e) => setSecurityForm(prev => ({ ...prev, newPassword: e.target.value }))}
                    placeholder="Enter new strong password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d131f] border border-white/15 text-white text-xs outline-none focus:border-[#6091c3] transition-colors"
                  />
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-[#8fa2c7] mb-1.5">
                    Confirm New Password <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="password"
                    value={securityForm.confirmPassword}
                    onChange={(e) => setSecurityForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    placeholder="Confirm new password"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#0d131f] border border-white/15 text-white text-xs outline-none focus:border-[#6091c3] transition-colors"
                  />
                </div>

                {/* Submit Button */}
                <div className="pt-4 border-t border-white/10">
                  <button
                    type="submit"
                    disabled={passwordSaving}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#6091c3] text-[#0d131f] hover:brightness-110 transition-all shadow-md cursor-pointer disabled:opacity-50"
                  >
                    {passwordSaving ? (
                      <>
                        <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined text-sm">lock_reset</span>
                        <span>Update Password</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
