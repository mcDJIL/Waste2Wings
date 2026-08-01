import { useState } from 'react'
import { Link } from 'react-router-dom'
import api from '../../services/api'
import logo from '../../assets/images/logo.png'

function EmailIcon() {
  return (
    <svg width="20" height="16" viewBox="0 0 20 16" fill="none" className="shrink-0">
      <path
        d="M2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V14C20 14.55 19.8042 15.0208 19.4125 15.4125C19.0208 15.8042 18.55 16 18 16H2ZM10 9L2 4V14H18V4L10 9ZM10 7L18 2H2L10 7ZM2 4V2V4V14V4Z"
        fill="black"
        fillOpacity="0.4"
      />
    </svg>
  )
}

function ArrowRightIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path
        d="M12.175 9H0V7H12.175L6.575 1.4L8 0L16 8L8 16L6.575 14.6L12.175 9Z"
        fill="white"
      />
    </svg>
  )
}

function BackArrowIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M3.825 7H16V9H3.825L9.425 14.6L8 16L0 8L8 0L9.425 1.4L3.825 7Z"
        fill="black"
        fillOpacity="0.6"
      />
    </svg>
  )
}

function PasswordIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
      <path
        d="M4 8H16V18C16 18.55 15.8042 19.0208 15.4125 19.4125C15.0208 19.8042 14.55 20 14 20H6C5.45 20 4.97917 19.8042 4.5875 19.4125C4.19583 19.0208 4 18.55 4 18V8ZM10 14C9.58333 14 9.229 13.854 8.937 13.562C8.645 13.27 8.49933 12.9167 8.5 12.5C8.5 12.0833 8.646 11.729 8.938 11.437C9.23 11.145 9.58333 10.9993 10 11C10.4167 11 10.771 11.146 11.063 11.438C11.355 11.73 11.5007 12.0833 11.5 12.5C11.5 12.9167 11.354 13.271 11.062 13.563C10.77 13.855 10.4167 14.0007 10 14ZM2 8V6C2 4.61667 2.48767 3.43767 3.463 2.463C4.43833 1.48833 5.61733 1 7 1H13C14.3833 1 15.5623 1.48767 16.537 2.463C17.5117 3.43833 18 4.61733 18 6V8H4V6C4 5.45 3.804 4.979 3.412 4.587C3.02 4.195 2.549 4 2 4V8Z"
        fill="black"
        fillOpacity="0.4"
      />
    </svg>
  )
}

function EyeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
      <path
        d="M10 13C11.0609 13 12.0783 12.5786 12.8284 11.8284C13.5786 11.0783 14 10.0609 14 9C14 7.93913 13.5786 6.92172 12.8284 6.17157C12.0783 5.42143 11.0609 5 10 5C8.93913 5 7.92172 5.42143 7.17157 6.17157C6.42143 6.92172 6 7.93913 6 9C6 10.0609 6.42143 11.0783 7.17157 11.8284C7.92172 12.5786 8.93913 13 10 13ZM10 11C9.20435 11 8.44129 10.6839 7.87868 10.1213C7.31607 9.55871 7 8.79565 7 8C7 7.20435 7.31607 6.44129 7.87868 5.87868C8.44129 5.31607 9.20435 5 10 5C10.7956 5 11.5587 5.31607 12.1213 5.87868C12.6839 6.44129 13 7.20435 13 8C13 8.79565 12.6839 9.55871 12.1213 10.1213C11.5587 10.6839 10.7956 11 10 11ZM10 16C5.59 16 1.95 13.35 0.5 9.5C1.95 5.65 5.59 3 10 3C14.41 3 18.05 5.65 19.5 9.5C18.05 13.35 14.41 16 10 16Z"
        fill="black"
        fillOpacity="0.4"
      />
    </svg>
  )
}

function EyeOffIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="shrink-0">
      <path
        d="M11.8 13.4L7.4 9C7.46667 8.63333 7.64167 8.33333 7.925 8.1C8.20833 7.86667 8.53333 7.75 8.9 7.75C9.63333 7.75 10.25 8.03333 10.75 8.6C11.25 9.16667 11.5 9.85 11.5 10.65C11.5 11.0167 11.45 11.35 11.35 11.65L11.8 13.4ZM19.3 17.7L14.85 13.25C15.7 12.25 16.4 11.0833 16.9 9.75C15.4 5.9 11.75 3.25 7.5 3.25C6.33333 3.25 5.21667 3.43333 4.15 3.8L0.3 0L2.1 2.1L17.4 17.5L19.3 17.7ZM10 16C14.4 16 18 13.35 19.45 9.5C18.95 8.35 18.3 7.3 17.5 6.4L15.85 8.05C16.15 8.65 16.3 9.3 16.3 10C16.3 11.85 15.5 13.45 14.25 14.65L12.4 12.8C12.45 12.5333 12.5 12.25 12.5 12C12.5 10.35 11.15 9 9.5 9C9.23333 9 8.98333 9.01667 8.73333 9.05L6.95 7.26667C7.63333 7.01667 8.35 6.9 9.1 6.9C10.6609 6.9 12.1783 7.51428 13.3284 8.66421C14.4786 9.81414 15.1 11.3315 15.1 12.8924C15.1 13.6424 14.9833 14.35 14.7333 14.9917L10 10.25C9.96667 10.25 9.93333 10.25 9.9 10.25C9.03333 10.25 8.33333 10.95 8.33333 11.8C8.33333 12.4333 8.66667 12.95 9.16667 13.25L10 16Z"
        fill="black"
        fillOpacity="0.4"
      />
    </svg>
  )
}

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1) // 1: email, 2: password
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleEmailSubmit(e) {
    e.preventDefault()
    setErrorMessage('')

    if (!email.trim()) {
      setErrorMessage('Email wajib diisi.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMessage('Format email tidak valid.')
      return
    }

    try {
      setIsSubmitting(true)
      await api.post('/auth/forgot-password/verify-email', {
        email: email.trim(),
      })
      setStep(2)
    } catch (error) {
      const message = error?.response?.data?.error?.message ||
                      error?.response?.data?.message ||
                      'Email tidak ditemukan dalam sistem.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault()
    setErrorMessage('')

    if (!newPassword.trim()) {
      setErrorMessage('Kata sandi wajib diisi.')
      return
    }

    if (newPassword.length < 6) {
      setErrorMessage('Kata sandi minimal 6 karakter.')
      return
    }

    try {
      setIsSubmitting(true)
      await api.post('/auth/forgot-password/reset', {
        email: email.trim(),
        newPassword: newPassword,
      })
      setEmail('')
      setNewPassword('')
      setStep(1)
      alert('Kata sandi berhasil direset. Silahkan login dengan kata sandi baru.')
    } catch (error) {
      const message = error?.response?.data?.error?.message ||
                      error?.response?.data?.message ||
                      'Gagal mereset kata sandi.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleBackClick() {
    if (step === 2) {
      setStep(1)
      setNewPassword('')
      setErrorMessage('')
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4 py-10 sm:px-8">
      <div
        className="w-full max-w-[400px] rounded-[24px] p-4 sm:p-5 animate-fade-slide-up"
        style={{
          background: 'rgba(0, 0, 0, 0.05)',
          border: '1px solid rgba(0, 0, 0, 0.10)',
          boxShadow: '0 16px 30px -12px rgba(0, 0, 0, 0.18)',
          backdropFilter: 'blur(12px)',
        }}
      >
        {/* Brand Identity */}
        <div className="flex flex-col items-center mb-5 animate-fade-slide-up" style={{ animationDelay: '0.1s' }}>
          <img
            src={logo}
            alt="HEN Waste Oil Logo"
            className="w-12 h-12 rounded-full object-cover mb-3"
          />
          <h2 className="text-black text-lg sm:text-xl font-bold leading-tight text-center">
            {step === 1 ? 'Lupa Kata Sandi' : 'Atur Kata Sandi Baru'}
          </h2>
          <p className="text-black/30 text-xs sm:text-sm font-normal text-center mt-2 max-w-[280px] mx-auto">
            {step === 1
              ? 'Masukkan email Anda untuk memverifikasi akun'
              : 'Masukkan kata sandi baru untuk akun Anda'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={step === 1 ? handleEmailSubmit : handlePasswordSubmit} className="flex flex-col gap-3">
          {/* Step 1: Email Input */}
          {step === 1 && (
            <div className="animate-fade-slide-up" style={{ animationDelay: '0.2s' }}>
              <label className="block text-[#3F4945] text-sm font-semibold tracking-[0.14px] mb-2">
                Email
              </label>
              <div className="input-glass flex items-center gap-2 rounded-[12px] px-3 py-2">
                <EmailIcon />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@gmail.com"
                  className="flex-1 bg-transparent outline-none text-xs sm:text-sm text-black/80 placeholder-black/30 min-w-0"
                  autoComplete="email"
                  disabled={isSubmitting}
                />
              </div>
            </div>
          )}

          {/* Step 2: Password Input */}
          {step === 2 && (
            <div className="animate-fade-slide-up" style={{ animationDelay: '0.2s' }}>
              <label className="block text-[#3F4945] text-sm font-semibold tracking-[0.14px] mb-2">
                Kata Sandi Baru
              </label>
              <div className="input-glass flex items-center gap-2 rounded-[12px] px-3 py-2">
                <PasswordIcon />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Masukkan kata sandi baru"
                  className="flex-1 bg-transparent outline-none text-xs sm:text-sm text-black/80 placeholder-black/30 min-w-0"
                  autoComplete="new-password"
                  disabled={isSubmitting}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="cursor-pointer hover:opacity-70 transition-opacity"
                  disabled={isSubmitting}
                >
                  {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                </button>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="text-sm text-red-600 font-medium animate-fade-slide-up" style={{ animationDelay: '0.25s' }}>
              {errorMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="login-btn-gradient w-full flex items-center justify-center gap-2 rounded-[12px] py-3 mt-2 text-white font-bold text-sm sm:text-base cursor-pointer animate-fade-slide-up disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ animationDelay: '0.3s' }}
          >
            <span>
              {isSubmitting
                ? 'Memproses...'
                : step === 1
                  ? 'Verifikasi Email'
                  : 'Reset Kata Sandi'}
            </span>
            <ArrowRightIcon />
          </button>
        </form>

        {/* Back Navigation */}
        {step === 2 ? (
          <button
            type="button"
            onClick={handleBackClick}
            className="flex items-center justify-center gap-2 text-sm font-semibold mt-4 text-[#3F4945] hover:text-black transition-colors animate-fade-slide-up w-full"
            style={{ animationDelay: '0.35s' }}
          >
            <BackArrowIcon />
            Kembali
          </button>
        ) : (
          <Link
            to="/login"
            className="flex items-center justify-center gap-2 text-sm font-semibold mt-4 text-[#3F4945] hover:text-black transition-colors animate-fade-slide-up w-full"
            style={{ animationDelay: '0.35s' }}
          >
            <BackArrowIcon />
            Kembali ke Login
          </Link>
        )}
      </div>
    </div>
  )
}
