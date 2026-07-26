import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import api from '../../services/api'

const LOGO_URL =
  'https://api.builder.io/api/v1/image/assets/TEMP/125834ef82b85efc2a276f0b188074feb41b9fc1?width=96'
const MAP_PREVIEW_URL =
  'https://api.builder.io/api/v1/image/assets/TEMP/f5291117958bfe176983375bd9a8d2a218027943?width=832'
const AVATAR_1_URL =
  'https://api.builder.io/api/v1/image/assets/TEMP/f2ee1f78b9dbb1ea6b2cf4211b1663156f81fcfc?width=56'
const AVATAR_2_URL =
  'https://api.builder.io/api/v1/image/assets/TEMP/05813c71805c178a426ca5b6f0250d140a558001?width=56'

function PersonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="shrink-0">
      <path
        d="M8 8C6.9 8 5.95833 7.60833 5.175 6.825C4.39167 6.04167 4 5.1 4 4C4 2.9 4.39167 1.95833 5.175 1.175C5.95833 0.391667 6.9 0 8 0C9.1 0 10.0417 0.391667 10.825 1.175C11.6083 1.95833 12 2.9 12 4C12 5.1 11.6083 6.04167 10.825 6.825C10.0417 7.60833 9.1 8 8 8ZM0 16V13.2C0 12.6333 0.145833 12.1125 0.4375 11.6375C0.729167 11.1625 1.11667 10.8 1.6 10.55C2.63333 10.0333 3.68333 9.64583 4.75 9.3875C5.81667 9.12917 6.9 9 8 9C9.1 9 10.1833 9.12917 11.25 9.3875C12.3167 9.64583 13.3667 10.0333 14.4 10.55C14.8833 10.8 15.2708 11.1625 15.5625 11.6375C15.8542 12.1125 16 12.6333 16 13.2V16H0ZM2 14H14V13.2C14 13.0167 13.9542 12.85 13.8625 12.7C13.7708 12.55 13.65 12.4333 13.5 12.35C12.6 11.9 11.6917 11.5625 10.775 11.3375C9.85833 11.1125 8.93333 11 8 11C7.06667 11 6.14167 11.1125 5.225 11.3375C4.30833 11.5625 3.4 11.9 2.5 12.35C2.35 12.4333 2.22917 12.55 2.1375 12.7C2.04583 12.85 2 13.0167 2 13.2V14ZM8 6C8.55 6 9.02083 5.80417 9.4125 5.4125C9.80417 5.02083 10 4.55 10 4C10 3.45 9.80417 2.97917 9.4125 2.5875C9.02083 2.19583 8.55 2 8 2C7.45 2 6.97917 2.19583 6.5875 2.5875C6.19583 2.97917 6 3.45 6 4C6 4.55 6.19583 5.02083 6.5875 5.4125C6.97917 5.80417 7.45 6 8 6Z"
        fill="black"
        fillOpacity="0.4"
      />
    </svg>
  )
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" className="shrink-0">
      <path
        d="M16.95 18C14.8667 18 12.8083 17.5458 10.775 16.6375C8.74167 15.7292 6.89167 14.4417 5.225 12.775C3.55833 11.1083 2.27083 9.25833 1.3625 7.225C0.454167 5.19167 0 3.13333 0 1.05C0 0.75 0.1 0.5 0.3 0.3C0.5 0.1 0.75 0 1.05 0H5.1C5.33333 0 5.54167 0.0791667 5.725 0.2375C5.90833 0.395833 6.01667 0.583333 6.05 0.8L6.7 4.3C6.73333 4.56667 6.725 4.79167 6.675 4.975C6.625 5.15833 6.53333 5.31667 6.4 5.45L3.975 7.9C4.30833 8.51667 4.70417 9.1125 5.1625 9.6875C5.62083 10.2625 6.125 10.8167 6.675 11.35C7.19167 11.8667 7.73333 12.3458 8.3 12.7875C8.86667 13.2292 9.46667 13.6333 10.1 14L12.45 11.65C12.6 11.5 12.7958 11.3875 13.0375 11.3125C13.2792 11.2375 13.5167 11.2167 13.75 11.25L17.2 11.95C17.4333 12.0167 17.625 12.1375 17.775 12.3125C17.925 12.4875 18 12.6833 18 12.9V16.95C18 17.25 17.9 17.5 17.7 17.7C17.5 17.9 17.25 18 16.95 18Z"
        fill="black"
        fillOpacity="0.4"
      />
    </svg>
  )
}

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
        d="M2 21C1.45 21 0.979167 20.8042 0.5875 20.4125C0.195833 20.0208 0 19.55 0 19V9C0 8.45 0.195833 7.97917 0.5875 7.5875C0.979167 7.19583 1.45 7 2 7H3V5C3 3.61667 3.4875 2.4375 4.4625 1.4625C5.4375 0.4875 6.61667 0 8 0C9.38333 0 10.5625 0.4875 11.5375 1.4625C12.5125 2.4375 13 3.61667 13 5V7H14C14.55 7 15.0208 7.19583 15.4125 7.5875C15.8042 7.97917 16 8.45 16 9V19C16 19.55 15.8042 20.0208 15.4125 20.4125C15.0208 20.8042 14.55 21 14 21H2ZM2 19H14V9H2V19ZM8 16C8.55 16 9.02083 15.8042 9.4125 15.4125C9.80417 15.0208 10 14.55 10 14C10 13.45 9.80417 12.9792 9.4125 12.5875C9.02083 12.1958 8.55 12 8 12C7.45 12 6.97917 12.1958 6.5875 12.5875C6.19583 12.9792 6 13.45 6 14C6 14.55 6.19583 15.0208 6.5875 15.4125C6.97917 15.8042 7.45 16 8 16ZM5 7H11V5C11 4.16667 10.7083 3.45833 10.125 2.875C9.54167 2.29167 8.83333 2 8 2C7.16667 2 6.45833 2.29167 5.875 2.875C5.29167 3.45833 5 4.16667 5 5V7Z"
        fill="black"
        fillOpacity="0.4"
      />
    </svg>
  )
}

function LocationPinIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" className="shrink-0">
      <path
        d="M5.80417 12.775V11.6083C4.58889 11.4722 3.54618 10.9691 2.67604 10.099C1.8059 9.22882 1.30278 8.18611 1.16667 6.97083H0V5.80417H1.16667C1.30278 4.58889 1.8059 3.54618 2.67604 2.67604C3.54618 1.8059 4.58889 1.30278 5.80417 1.16667V0H6.97083V1.16667C8.18611 1.30278 9.22882 1.8059 10.099 2.67604C10.9691 3.54618 11.4722 4.58889 11.6083 5.80417H12.775V6.97083H11.6083C11.4722 8.18611 10.9691 9.22882 10.099 10.099C9.22882 10.9691 8.18611 11.4722 6.97083 11.6083V12.775H5.80417ZM6.3875 10.4708C7.51528 10.4708 8.47778 10.0722 9.275 9.275C10.0722 8.47778 10.4708 7.51528 10.4708 6.3875C10.4708 5.25972 10.0722 4.29722 9.275 3.5C8.47778 2.70278 7.51528 2.30417 6.3875 2.30417C5.25972 2.30417 4.29722 2.70278 3.5 3.5C2.70278 4.29722 2.30417 5.25972 2.30417 6.3875C2.30417 7.51528 2.70278 8.47778 3.5 9.275C4.29722 10.0722 5.25972 10.4708 6.3875 10.4708Z"
        fill="#63DCA6"
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

export default function RegisterCard() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    namaLengkap: '',
    nomorTelepon: '',
    email: '',
    kataSandi: '',
    alamat: '',
  })
  const [selectedRole, setSelectedRole] = useState('COMMUNITY')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function handleChange(e) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setErrorMessage('')

    const { namaLengkap, nomorTelepon, email, kataSandi, alamat } = form
    if (!namaLengkap.trim() || !nomorTelepon.trim() || !email.trim() || !kataSandi || !alamat.trim()) {
      setErrorMessage('Semua field wajib diisi.')
      return
    }

    try {
      setIsSubmitting(true)
      const payload = {
        name: namaLengkap.trim(),
        email: email.trim(),
        password: kataSandi,
        role: selectedRole,
        phone: nomorTelepon.trim(),
        profile: {
          category: 'HOUSEHOLD',
          address: alamat.trim(),
          latitude: -6.2615,
          longitude: 106.8106,
        },
      }

      const response = await api.post('/auth/register', payload)
      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      navigate('/')
    } catch (error) {
      const message =
        error?.response?.data?.error?.message ||
        error?.response?.data?.message ||
        'Gagal mendaftar. Silakan coba lagi.'
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
      <div className="flex flex-col items-center mb-6 animate-fade-slide-up" style={{ animationDelay: '0.1s' }}>
        <img
          src={LOGO_URL}
          alt="HEN Waste Oil Logo"
          className="w-12 h-12 rounded-full object-cover mb-3"
        />
        <h2 className="text-black text-lg sm:text-xl font-bold leading-tight text-center">
          Daftar Akun Baru
        </h2>
      </div>

      {/* Role selection */}
      <div className="flex flex-col gap-3 mb-4 animate-fade-slide-up" style={{ animationDelay: '0.15s' }}>
        <p className="text-center text-[11px] text-black/50 sm:text-left">
          Pilih tipe akun sebelum melanjutkan.
        </p>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => setSelectedRole('COMMUNITY')}
            className={`rounded-[12px] py-2 text-xs font-semibold transition ${
              selectedRole === 'COMMUNITY'
                ? 'bg-[#0B5E4B] text-white border border-transparent'
                : 'bg-white text-black/70 border border-black/10 hover:border-[#0B5E4B]'
            }`}
          >
            Masyarakat
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('COLLECTOR')}
            className={`rounded-[12px] py-2 text-xs font-semibold transition ${
              selectedRole === 'COLLECTOR'
                ? 'bg-[#0B5E4B] text-white border border-transparent'
                : 'bg-white text-black/70 border border-black/10 hover:border-[#0B5E4B]'
            }`}
          >
            Pengepul
          </button>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        {/* Nama Lengkap */}
        <div className="input-glass flex items-center gap-2 rounded-[12px] px-3 py-2 animate-fade-slide-up" style={{ animationDelay: '0.15s' }}>
          <PersonIcon />
          <input
            type="text"
            name="namaLengkap"
            value={form.namaLengkap}
            onChange={handleChange}
            placeholder="Nama Lengkap"
            className="flex-1 bg-transparent outline-none text-xs sm:text-sm text-black/80 placeholder-black/30 min-w-0"
            autoComplete="name"
          />
        </div>

        {/* Nomor Telepon + Email */}
        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 animate-fade-slide-up" style={{ animationDelay: '0.2s' }}>
          <div className="input-glass flex items-center gap-2 rounded-[12px] px-3 py-2 flex-1 min-w-0">
            <PhoneIcon />
            <input
              type="tel"
              name="nomorTelepon"
              value={form.nomorTelepon}
              onChange={handleChange}
              placeholder="Nomor Telepon"
              className="flex-1 bg-transparent outline-none text-xs sm:text-sm text-black/80 placeholder-black/30 min-w-0"
              autoComplete="tel"
            />
          </div>
          <div className="input-glass flex items-center gap-2 rounded-[12px] px-3 py-2 flex-1 min-w-0">
            <EmailIcon />
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="Email"
              className="flex-1 bg-transparent outline-none text-xs sm:text-sm text-black/80 placeholder-black/30 min-w-0"
              autoComplete="email"
            />
          </div>
        </div>

        {/* Kata Sandi */}
        <div className="input-glass flex items-center gap-2 rounded-[12px] px-3 py-2 animate-fade-slide-up" style={{ animationDelay: '0.25s' }}>
          <LockIcon />
          <input
            type="password"
            name="kataSandi"
            value={form.kataSandi}
            onChange={handleChange}
            placeholder="Kata Sandi"
            className="flex-1 bg-transparent outline-none text-xs sm:text-sm text-black/80 placeholder-black/30 min-w-0"
            autoComplete="new-password"
          />
        </div>

        {errorMessage && (
          <div className="text-sm text-red-600 font-medium mt-1 animate-fade-slide-up" style={{ animationDelay: '0.27s' }}>
            {errorMessage}
          </div>
        )}

        {/* Alamat + Map Preview */}
        <div
          className="rounded-[12px] overflow-hidden animate-fade-slide-up"
          style={{
            background: 'rgba(0, 0, 0, 0.05)',
            border: '1px solid rgba(0, 0, 0, 0.10)',
            animationDelay: '0.3s',
          }}
        >
          <textarea
            name="alamat"
            value={form.alamat}
            onChange={handleChange}
            placeholder="Alamat Lengkap Penjemputan..."
            rows={3}
            className="w-full bg-transparent outline-none text-xs sm:text-sm text-black/80 placeholder-black/30 resize-none px-3 pt-3 pb-8"
          />
          <div className="relative">
            <img
              src={MAP_PREVIEW_URL}
              alt="Peta lokasi"
              className="w-full h-20 object-cover"
              style={{ filter: 'saturate(0.8)' }}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <button
                type="button"
                className="flex items-center gap-2 px-3 py-1 rounded-full cursor-pointer"
                style={{
                  background: 'rgba(29, 49, 77, 0.80)',
                  backdropFilter: 'blur(2px)',
                }}
              >
                <LocationPinIcon />
                <span className="text-white text-[10px] font-bold leading-[15px]">
                  Deteksi Otomatis
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="login-btn-gradient w-full flex items-center justify-center gap-2 rounded-[12px] py-3 mt-4 text-white font-bold text-xs sm:text-sm cursor-pointer animate-fade-slide-up"
          style={{ animationDelay: '0.35s' }}
        >
          <span>Daftar Sekarang</span>
          <ArrowRightIcon />
        </button>

        {/* Login Link */}
        <p
          className="text-center text-xs font-semibold animate-fade-slide-up text-[#3F4945]"
          style={{ animationDelay: '0.4s' }}
        >
          Sudah punya akun?{' '}
          <Link
            to="/login"
            className="text-[#63DCA6] font-bold hover:text-[#48c48f] transition-colors"
          >
            Masuk di sini
          </Link>
        </p>
      </form>

      {/* Social Proof */}
      <div
        className="flex items-center justify-center gap-3 mt-4 pt-4 animate-fade-slide-up"
        style={{
          borderTop: '1px solid rgba(0, 0, 0, 0.10)',
          animationDelay: '0.45s',
        }}
      >
        {/* Stacked Avatars */}
        <div className="flex items-center">
          <img
            src={AVATAR_1_URL}
            alt=""
            className="w-7 h-7 rounded-full object-cover"
            style={{ border: '1px solid rgba(0,0,0,0.20)' }}
          />
          <img
            src={AVATAR_2_URL}
            alt=""
            className="w-7 h-7 rounded-full object-cover -ml-2"
            style={{ border: '1px solid rgba(0,0,0,0.20)' }}
          />
          <div
            className="w-7 h-7 rounded-full -ml-2 flex items-center justify-center text-[8px] font-bold text-[#004536]"
            style={{ background: '#8DD5BC', border: '1px solid rgba(0,0,0,0.20)' }}
          >
            +1k
          </div>
        </div>

        {/* Proof Text */}
        <p className="text-[10px] text-black/50">
          Bergabung dengan{' '}
          <span className="text-[#63DCA6] font-bold">1,280+</span>{' '}
          pengumpul minyak
        </p>
      </div>
    </div>
  )
}
