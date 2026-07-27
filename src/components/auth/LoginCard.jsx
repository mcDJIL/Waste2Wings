import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'
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

function LockIcon() {
  return (
    <svg width="16" height="21" viewBox="0 0 16 21" fill="none" className="shrink-0">
      <path
        d="M2 21C1.45 21 0.979167 20.8042 0.5875 20.4125C0.195833 20.0208 0 19.55 0 19V9C0 8.45 0.195833 7.97917 0.5875 7.5875C0.979167 7.19583 1.45 7 2 7H3V5C3 3.61667 3.4875 2.4375 4.4625 1.4625C5.4375 0.4875 6.61667 0 8 0C9.38333 0 10.5625 0.4875 11.5375 1.4625C12.5125 2.4375 13 3.61667 13 5V7H14C14.55 7 15.0208 7.19583 15.4125 7.5875C15.8042 7.97917 16 8.45 16 9V19C16 19.55 15.8042 20.0208 15.4125 20.4125C15.0208 20.8042 14.55 21 14 21H2ZM2 19H14V9H2V19ZM8 16C8.55 16 9.02083 15.8042 9.4125 15.4125C9.80417 15.0208 10 14.55 10 14C10 13.45 9.80417 12.9792 9.4125 12.5875C9.02083 12.1958 8.55 12 8 12C7.45 12 6.97917 12.1958 6.5875 12.5875C6.19583 12.9792 6 13.45 6 14C6 14.55 6.19583 15.0208 6.5875 15.4125C6.97917 15.8042 7.45 16 8 16ZM5 7H11V5C11 4.16667 10.7083 3.45833 10.125 2.875C9.54167 2.29167 8.83333 2 8 2C7.16667 2 6.45833 2.29167 5.875 2.875C5.29167 3.45833 5 4.16667 5 5V7ZM2 19V9V19Z"
        fill="black"
        fillOpacity="0.4"
      />
    </svg>
  )
}

function EyeIcon({ open }) {
  return open ? (
    <svg width="20" height="14" viewBox="0 0 20 14" fill="none">
      <path
        d="M10 0C5.45 0 1.57 2.93 0 7c1.57 4.07 5.45 7 10 7s8.43-2.93 10-7c-1.57-4.07-5.45-7-10-7zm0 11.67A4.667 4.667 0 1 1 10 2.33a4.667 4.667 0 0 1 0 9.34zm0-7.47a2.8 2.8 0 1 0 0 5.6 2.8 2.8 0 0 0 0-5.6z"
        fill="black"
        fillOpacity="0.4"
      />
    </svg>
  ) : (
    <svg width="20" height="18" viewBox="0 0 20 18" fill="none">
      <path
        d="M10 4.5c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92C19.07 13.07 20 11.13 20 9c0-4.28-5.06-8-10-8-1.27 0-2.49.25-3.61.7L8.17 3.48C8.76 3.17 9.37 4.5 10 4.5zM2 1.27 4.28 3.55l.46.46A9.93 9.93 0 0 0 0 9c1.73 4.39 6 7.5 10 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L17.73 19 19 17.73 3.27 0 2 1.27zM7.53 6.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55A4.967 4.967 0 0 1 10 14c-2.76 0-5-2.24-5-5 0-1.03.31-1.99.83-2.79l1.7 1.59z"
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

export default function LoginCard() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')

    if (!email.trim() || !password) {
      setErrorMessage('Email dan kata sandi wajib diisi.')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await api.post('/auth/login', {
        email: email.trim(),
        password,
      })

      const { token, user } = response.data
      login(token, user)
      const role = user.role?.toUpperCase()
      if (role === 'COMMUNITY') {
        navigate('/community/dashboard')
      } else if (role === 'COLLECTOR') {
        navigate('/collector/dashboard')
      } else if (role === 'STAKEHOLDER') {
        navigate('/stakeholder/dashboard')
      } else {
        navigate('/')
      }
    } catch (error) {
      const message = error?.response?.data?.error?.message || error?.response?.data?.message || 'Gagal terhubung ke server.'
      setErrorMessage(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
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
          Selamat Datang
        </h2>
        <p className="text-black/30 text-xs sm:text-sm font-normal text-center mt-2 max-w-[220px] mx-auto">
          Silahkan Masuk Ke Akun Anda Untuk Melanjutkan
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Email Field */}
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
            />
          </div>
        </div>

        {/* Password Field */}
        <div className="animate-fade-slide-up" style={{ animationDelay: '0.25s' }}>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[#3F4945] text-sm font-semibold tracking-[0.14px]">
              Kata Sandi
            </label>
            <a
              href="#"
              className="text-[#E57A16] text-sm underline underline-offset-2 hover:text-[#c96a0e] transition-colors"
            >
              Lupa Kata Sandi?
            </a>
          </div>
          <div className="input-glass flex items-center gap-2 rounded-[12px] px-3 py-2">
            <LockIcon />
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Kata Sandi"
              className="flex-1 bg-transparent outline-none text-xs sm:text-sm text-black/80 placeholder-black/30 min-w-0"
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="shrink-0 opacity-40 hover:opacity-70 transition-opacity cursor-pointer"
              aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
            >
              <EyeIcon open={showPassword} />
            </button>
          </div>
        </div>

        {errorMessage && (
          <div className="text-sm text-red-600 font-medium mt-1 animate-fade-slide-up" style={{ animationDelay: '0.29s' }}>
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
          <span>{isSubmitting ? 'Memproses...' : 'Masuk Ke Platform'}</span>
          <ArrowRightIcon />
        </button>
      </form>

      {/* Register Link */}
      <p
        className="text-center text-sm font-semibold mt-4 animate-fade-slide-up text-[#3F4945]"
        style={{ animationDelay: '0.35s' }}
      >
        Belum Memiliki Akun?{' '}
        <Link
          to="/register"
          className="text-[#63DCA6] font-bold underline underline-offset-2 hover:text-[#48c48f] transition-colors"
        >
          Daftar Sekarang
        </Link>
      </p>
    </div>
  )
}
