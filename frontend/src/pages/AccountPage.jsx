import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { userApi, buildApi } from '../services/api'
import ProfileSection from '../components/account/ProfileSection'
import SecuritySection from '../components/account/SecuritySection'
import SavedBuildsSection from '../components/account/SavedBuildsSection'

/**
 * AccountPage - Customer & Partner Profile, Security & 3D Saved Builds Library
 * Fully integrated with dark/light design system and backend API contracts.
 */
export default function AccountPage() {
  const navigate = useNavigate()
  const { currentUser, role, updateCurrentUser } = useAuth()

  const [activeTab, setActiveTab] = useState('builds') // 'builds' | 'profile' | 'security'
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
    GARAGE_OWNER: { bg: 'bg-[#EEF2FF] dark:bg-[#1E293B]', border: 'border-[#0213B2]/30 dark:border-blue-900/40', text: 'text-[#0213B2] dark:text-[#60A5FA]', label: 'Garage Owner (B2B)' },
    LEAD_TECHNICIAN: { bg: 'bg-emerald-50 dark:bg-emerald-950/40', border: 'border-emerald-300 dark:border-emerald-800', text: 'text-emerald-700 dark:text-emerald-400', label: 'Master Technician' },
    CAR_OWNER: { bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-300 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-400', label: 'Verified Car Owner' },
    CUSTOMER: { bg: 'bg-amber-50 dark:bg-amber-950/40', border: 'border-amber-300 dark:border-amber-800', text: 'text-amber-700 dark:text-amber-400', label: 'Verified Car Owner' },
    ADMIN: { bg: 'bg-purple-50 dark:bg-purple-950/40', border: 'border-purple-300 dark:border-purple-800', text: 'text-purple-700 dark:text-purple-400', label: 'System Administrator' }
  }

  const currentBadge = roleBadgeColors[role] || roleBadgeColors.CAR_OWNER

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 bg-[#F3F5FA] dark:bg-[#0B0C10] text-[#111827] dark:text-[#F8FAFC] transition-colors duration-200">
      {/* Toast Feedback */}
      {toast && (
        <div 
          className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 animate-in fade-in"
          style={{
            backgroundColor: toast.type === 'error' ? '#DC2626' : '#0213B2',
            border: '1px solid rgba(255,255,255,0.2)',
            color: '#FFFFFF'
          }}
        >
          <span className="material-symbols-outlined text-base">
            {toast.type === 'error' ? 'error' : 'check_circle'}
          </span>
          <span className="text-xs font-semibold">{toast.message}</span>
        </div>
      )}

      <div className="max-w-6xl mx-auto space-y-6">
        {/* User Hero Header Card */}
        <div 
          className="rounded-2xl p-6 sm:p-8 relative overflow-hidden bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] shadow-sm"
          data-preserve-white="true"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            {/* Avatar Preview */}
            <div className="relative group">
              <div 
                className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden flex items-center justify-center font-bold text-3xl shadow-md border-2 bg-gradient-to-br from-[#0213B2] to-[#0A26D9] text-white border-slate-200 dark:border-[#282A3A]"
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
                className={`absolute -bottom-2 -right-2 px-2 py-0.5 rounded-md text-[10px] font-mono font-bold uppercase shadow-sm border ${currentBadge.bg} ${currentBadge.border} ${currentBadge.text}`}
              >
                {role}
              </div>
            </div>

            {/* User Meta */}
            <div className="flex-1 text-center sm:text-left space-y-2">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-[#111827] dark:text-[#F8FAFC] tracking-tight">
                    {currentUser?.fullName || currentUser?.username}
                  </h1>
                  <p className="text-sm text-[#64748B] dark:text-[#94A3B8] font-mono">
                    @{currentUser?.username} • {currentUser?.email}
                  </p>
                </div>

                {/* Role & Access Badge */}
                <div 
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold tracking-wider uppercase self-center sm:self-start border ${currentBadge.bg} ${currentBadge.border} ${currentBadge.text}`}
                >
                  <span className="material-symbols-outlined text-sm">verified_user</span>
                  <span>{currentBadge.label}</span>
                </div>
              </div>

              {currentUser?.garageName && (
                <div className="inline-flex items-center gap-1.5 text-xs text-[#64748B] dark:text-[#94A3B8] pt-1">
                  <span className="material-symbols-outlined text-sm text-[#0213B2] dark:text-[#60A5FA]">domain</span>
                  <span>Affiliated Workshop: <strong className="text-[#111827] dark:text-[#F8FAFC]">{currentUser.garageName}</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 mt-8 border-t border-slate-100 dark:border-[#282A3A] pt-4 overflow-x-auto">
            <button
              onClick={() => setActiveTab('builds')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === 'builds'
                  ? 'bg-[#0213B2] text-white shadow-md shadow-[#0213B2]/20'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0213B2] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">directions_car</span>
              <span>My Saved Builds</span>
              <span 
                className={`px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === 'builds'
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 dark:bg-[#1E293B] text-[#64748B] dark:text-[#94A3B8]'
                }`}
              >
                {builds.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === 'profile'
                  ? 'bg-[#0213B2] text-white shadow-md shadow-[#0213B2]/20'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0213B2] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">person</span>
              <span>Profile Information</span>
            </button>

            <button
              onClick={() => setActiveTab('security')}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer ${
                activeTab === 'security'
                  ? 'bg-[#0213B2] text-white shadow-md shadow-[#0213B2]/20'
                  : 'text-[#64748B] dark:text-[#94A3B8] hover:text-[#0213B2] dark:hover:text-white hover:bg-[#F1F5F9] dark:hover:bg-[#1E293B]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">lock</span>
              <span>Security & Password</span>
            </button>
          </div>
        </div>

        {/* TAB CONTENTS */}
        {activeTab === 'builds' && (
          <SavedBuildsSection
            builds={builds}
            buildsLoading={buildsLoading}
            renamingCode={renamingCode}
            renameInput={renameInput}
            setRenameInput={setRenameInput}
            setRenamingCode={setRenamingCode}
            handleSaveRename={handleSaveRename}
            handleStartRename={handleStartRename}
            handleDeleteBuild={handleDeleteBuild}
            handleForkBuild={handleForkBuild}
            handleCopyShare={handleCopyShare}
            navigate={navigate}
          />
        )}

        {activeTab === 'profile' && (
          <ProfileSection
            profileForm={profileForm}
            setProfileForm={setProfileForm}
            handleProfileSubmit={handleProfileSubmit}
            profileSaving={profileSaving}
            currentUser={currentUser}
          />
        )}

        {activeTab === 'security' && (
          <SecuritySection
            securityForm={securityForm}
            setSecurityForm={setSecurityForm}
            handlePasswordSubmit={handlePasswordSubmit}
            passwordSaving={passwordSaving}
          />
        )}
      </div>
    </div>
  )
}
