import { useState } from 'react'
import PasswordField from '../../components/settings/PasswordField'

const LockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10H2C2 11.1 2.20833 12.1375 2.625 13.1125C3.04167 14.0875 3.6125 14.9375 4.3375 15.6625C5.0625 16.3875 5.9125 16.9625 6.8875 17.3875C7.8625 17.8125 8.9 18.025 10 18.025C12.2333 18.025 14.125 17.25 15.675 15.7C17.225 14.15 18 12.2583 18 10.025C18 7.79167 17.225 5.9 15.675 4.35C14.125 2.8 12.2333 2.025 10 2.025C8.51667 2.025 7.17083 2.3875 5.9625 3.1125C4.75417 3.8375 3.8 4.8 3.1 6H6V8H0V2H2V4C2.91667 2.78333 4.06667 1.8125 5.45 1.0875C6.83333 0.3625 8.35 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM8 14C7.71667 14 7.47917 13.9042 7.2875 13.7125C7.09583 13.5208 7 13.2833 7 13V10C7 9.71667 7.09583 9.47917 7.2875 9.2875C7.47917 9.09583 7.71667 9 8 9V8C8 7.45 8.19583 6.97917 8.5875 6.5875C8.97917 6.19583 9.45 6 10 6C10.55 6 11.0208 6.19583 11.4125 6.5875C11.8042 6.97917 12 7.45 12 8V9C12.2833 9 12.5208 9.09583 12.7125 9.2875C12.9042 9.47917 13 9.71667 13 10V13C13 13.2833 12.9042 13.5208 12.7125 13.7125C12.5208 13.9042 12.2833 14 12 14H8ZM9 9H11V8C11 7.71667 10.9042 7.47917 10.7125 7.2875C10.5208 7.09583 10.2833 7 10 7C9.71667 7 9.47917 7.09583 9.2875 7.2875C9.09583 7.47917 9 7.71667 9 8V9Z" fill="#002D22" />
  </svg>
)

export default function SecuritySection() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleCancel = () => {
    setCurrentPassword('')
    setNewPassword('')
    setSaved(false)
  }

  const handleSave = async () => {
    if (!currentPassword || !newPassword) return
    setIsSaving(true)
    await new Promise((r) => setTimeout(r, 900))
    setIsSaving(false)
    setSaved(true)
    setCurrentPassword('')
    setNewPassword('')
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <section
      className="rounded-xl border-t-2 border-[#C9A96E] bg-[#002D22]/5 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[10px] p-4 xs:p-6 sm:p-8 animate-fade-slide-up"
      style={{ animationDelay: '100ms' }}
    >
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5 sm:mb-6">
        <div className="flex items-center justify-center w-9 h-9 rounded-full bg-[#002D22]/10 shrink-0">
          <LockIcon />
        </div>
        <div>
          <h2 className="text-[#051C37] text-base sm:text-lg font-semibold leading-6">Keamanan &amp; Akses</h2>
          <p className="text-[#6B7280] text-xs hidden xs:block">Ubah kata sandi akun Anda</p>
        </div>
      </div>

      {/* Password fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-5 sm:mb-6">
        <PasswordField
          id="current-password"
          label="Kata Sandi Saat Ini"
          value={currentPassword}
          onChange={setCurrentPassword}
        />
        <PasswordField
          id="new-password"
          label="Kata Sandi Baru"
          value={newPassword}
          onChange={setNewPassword}
        />
      </div>

      {/* Success message */}
      {saved && (
        <div className="mb-4 px-4 py-2.5 rounded-lg bg-[#81F9C1]/30 border border-[#006C49]/30 text-[#004536] text-sm font-medium transition-all duration-300">
          Kata sandi berhasil diperbarui.
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-col-reverse xs:flex-row items-stretch xs:items-center justify-end gap-3">
        <button
          type="button"
          onClick={handleCancel}
          className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-full border border-[#002D22] text-[#002D22] text-xs sm:text-sm font-semibold tracking-[0.7px] hover:bg-[#002D22]/5 active:scale-95 transition-all duration-200 text-center"
        >
          Batalkan
        </button>
        <button
          type="button"
          onClick={handleSave}
          disabled={isSaving || !currentPassword || !newPassword}
          className={[
            'px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-white text-xs sm:text-sm font-semibold tracking-[0.7px]',
            'shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)]',
            'transition-all duration-200 text-center',
            isSaving || !currentPassword || !newPassword
              ? 'bg-[#002D22]/50 cursor-not-allowed'
              : 'bg-[#002D22] hover:bg-[#004536] active:scale-95',
          ].join(' ')}
        >
          {isSaving ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Menyimpan...
            </span>
          ) : (
            'Simpan Perubahan'
          )}
        </button>
      </div>
    </section>
  )
}
