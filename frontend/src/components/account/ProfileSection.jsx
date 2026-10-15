import React from 'react'

/**
 * ProfileSection - User Profile Information & Avatar Management
 */
export default function ProfileSection({
  profileForm,
  setProfileForm,
  handleProfileSubmit,
  profileSaving,
  currentUser
}) {
  return (
    <div className="rounded-2xl p-6 sm:p-8 bg-white dark:bg-[#14151D] border border-slate-200 dark:border-[#282A3A] shadow-sm" data-preserve-white="true">
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#111827] dark:text-[#F8FAFC]">Account Details</h2>
          <p className="text-xs text-[#64748B] dark:text-[#94A3B8]">
            Manage your personal information and profile picture visible to certified tuning workshops.
          </p>
        </div>

        <form onSubmit={handleProfileSubmit} className="space-y-4">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1.5">
              Full Name <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="text"
              value={profileForm.fullName}
              onChange={(e) => setProfileForm(prev => ({ ...prev, fullName: e.target.value }))}
              placeholder="Enter your full name"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1A1C26] border border-slate-300 dark:border-[#282A3A] text-[#111827] dark:text-[#F8FAFC] text-xs outline-none focus:border-[#0213B2] focus:ring-1 focus:ring-[#0213B2] transition-colors"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1.5">
              Contact Phone
            </label>
            <input
              type="tel"
              value={profileForm.phone}
              onChange={(e) => setProfileForm(prev => ({ ...prev, phone: e.target.value }))}
              placeholder="+84 901 234 567"
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1A1C26] border border-slate-300 dark:border-[#282A3A] text-[#111827] dark:text-[#F8FAFC] text-xs outline-none focus:border-[#0213B2] focus:ring-1 focus:ring-[#0213B2] transition-colors font-mono"
            />
          </div>

          {/* Avatar URL */}
          <div>
            <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1.5">
              Avatar Image URL
            </label>
            <input
              type="url"
              value={profileForm.avatarUrl}
              onChange={(e) => setProfileForm(prev => ({ ...prev, avatarUrl: e.target.value }))}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-3.5 py-2.5 rounded-xl bg-[#F8FAFC] dark:bg-[#1A1C26] border border-slate-300 dark:border-[#282A3A] text-[#111827] dark:text-[#F8FAFC] text-xs outline-none focus:border-[#0213B2] focus:ring-1 focus:ring-[#0213B2] transition-colors font-mono"
            />
            <p className="text-[10px] text-[#64748B] dark:text-[#94A3B8] mt-1">
              Provide a direct image URL (Unsplash, Gravatar, or CDN asset).
            </p>
          </div>

          {/* Read-Only Account Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1.5">
                Username (Immutable)
              </label>
              <input
                type="text"
                value={currentUser?.username || ''}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#1A1C26] border border-slate-200 dark:border-[#282A3A] text-[#64748B] dark:text-[#94A3B8] text-xs font-mono cursor-not-allowed opacity-80"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#64748B] dark:text-[#94A3B8] mb-1.5">
                Email Address (Protected)
              </label>
              <input
                type="email"
                value={currentUser?.email || ''}
                disabled
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-[#1A1C26] border border-slate-200 dark:border-[#282A3A] text-[#64748B] dark:text-[#94A3B8] text-xs font-mono cursor-not-allowed opacity-80"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-slate-100 dark:border-[#282A3A]">
            <button
              type="submit"
              disabled={profileSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#0213B2] text-white hover:bg-[#0115BC] transition-all shadow-md shadow-[#0213B2]/20 cursor-pointer disabled:opacity-50"
            >
              {profileSaving ? (
                <>
                  <span className="material-symbols-outlined text-sm animate-spin">refresh</span>
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <span className="material-symbols-outlined text-sm">save</span>
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
