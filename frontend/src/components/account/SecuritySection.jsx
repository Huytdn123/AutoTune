import React from 'react'

export default function SecuritySection({
  securityForm,
  setSecurityForm,
  handlePasswordSubmit,
  passwordSaving
}) {
  return (
    <div className="rounded-2xl p-6 sm:p-8 bg-white border border-[#E2E8F0] shadow-sm">
      <div className="max-w-2xl space-y-6">
        <div>
          <h2 className="text-lg font-bold text-[#111827]">Security & Password</h2>
          <p className="text-xs text-[#475569]">
            Update your authentication credentials. Passwords are encrypted using BCrypt salted hashing.
          </p>
        </div>

        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          {/* Current Password */}
          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1.5">
              Current Password <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="password"
              value={securityForm.currentPassword}
              onChange={(e) => setSecurityForm(prev => ({ ...prev, currentPassword: e.target.value }))}
              placeholder="Enter current password"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#111827] text-xs outline-none focus:border-[#0213B2] transition-colors"
            />
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1.5">
              New Password <span className="text-[#DC2626]">*</span> (min. 6 characters)
            </label>
            <input
              type="password"
              value={securityForm.newPassword}
              onChange={(e) => setSecurityForm(prev => ({ ...prev, newPassword: e.target.value }))}
              placeholder="Enter new strong password"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#111827] text-xs outline-none focus:border-[#0213B2] transition-colors"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-[#475569] mb-1.5">
              Confirm New Password <span className="text-[#DC2626]">*</span>
            </label>
            <input
              type="password"
              value={securityForm.confirmPassword}
              onChange={(e) => setSecurityForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
              placeholder="Confirm new password"
              className="w-full px-3.5 py-2.5 rounded-xl bg-white border border-[#CBD5E1] text-[#111827] text-xs outline-none focus:border-[#0213B2] transition-colors"
            />
          </div>

          {/* Submit Button */}
          <div className="pt-4 border-t border-[#E2E8F0]">
            <button
              type="submit"
              disabled={passwordSaving}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#0213B2] text-white hover:bg-[#0115BC] transition-all shadow-sm cursor-pointer disabled:opacity-50"
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
  )
}
