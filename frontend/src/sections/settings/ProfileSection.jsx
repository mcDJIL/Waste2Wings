import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import api from '../../services/api'

function FormField({ id, label, value, onChange, type = 'text', placeholder = '', disabled = false }) {
  return (
    <div className="flex flex-col gap-2 sm:gap-3">
      <label htmlFor={id} className="text-[#404945] text-[10px] sm:text-xs font-bold tracking-[0.6px] uppercase">
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        className={`w-full px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg border border-[#BFC9C3]/30 text-[#051C37] text-sm sm:text-base outline-none transition-all duration-200 placeholder:text-[#6B7280] ${
          disabled
            ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
            : 'bg-white/50 focus:border-[#006C49]/60 focus:ring-2 focus:ring-[#006C49]/10'
        }`}
      />
    </div>
  )
}

export default function ProfileSection() {
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profile, setProfile] = useState(null)
  const [saveMessage, setSaveMessage] = useState('')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [address, setAddress] = useState('')

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/profiles/me')
        const profileData = response.data

        console.log('Profile data loaded:', profileData)

        setProfile(profileData)
        setName(profileData.user.name || '')
        setEmail(profileData.user.email || '')
        setPhone(profileData.user.phone || '')
        setAddress(profileData.profile?.address || profileData.user.address || '')
      } catch (error) {
        console.error('Failed to fetch profile:', error)
        setSaveMessage('Gagal memuat profil. Silakan refresh halaman.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [])

  const geocodeAddress = async (addressText) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(addressText)}`
      )
      const results = await response.json()

      if (results && results.length > 0) {
        return {
          latitude: parseFloat(results[0].lat),
          longitude: parseFloat(results[0].lon),
        }
      }

      // Fallback to default Jakarta coordinates if geocoding fails
      return {
        latitude: profile?.profile?.latitude || -6.2615,
        longitude: profile?.profile?.longitude || 106.8106,
      }
    } catch (error) {
      console.warn('Geocoding failed, using default coordinates:', error)
      return {
        latitude: profile?.profile?.latitude || -6.2615,
        longitude: profile?.profile?.longitude || 106.8106,
      }
    }
  }

  const handleSaveProfile = async () => {
    if (!name.trim() || !phone.trim() || !address.trim()) {
      setSaveMessage('Semua field harus diisi!')
      setTimeout(() => setSaveMessage(''), 3000)
      return
    }

    try {
      setIsSaving(true)
      setSaveMessage('')

      const profilePayload = {
        address: address.trim(),
      }

      // Only add latitude/longitude if the profile already has these fields (e.g., collector)
      if (profile?.profile?.latitude !== undefined || profile?.profile?.longitude !== undefined) {
        const { latitude, longitude } = await geocodeAddress(address)
        profilePayload.latitude = latitude
        profilePayload.longitude = longitude
      }

      const payload = {
        name: name.trim(),
        phone: phone.trim(),
        profile: profilePayload,
      }

      console.log('Sending payload:', payload)
      const response = await api.patch('/profiles/me', payload)
      console.log('Response from API:', response.data)

      // Update profile state with response data
      const updatedData = response.data
      setProfile(updatedData)

      // Update form states dengan data terbaru dari response
      setName(updatedData.name || '')
      setEmail(updatedData.email || '')
      setPhone(updatedData.phone || '')
      setAddress(updatedData.profile?.address || updatedData.address || '')

      setSaveMessage('✓ Profil berhasil diperbarui!')

      // Clear message after 3 seconds
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      console.error('Failed to update profile:', error)
      const errorMsg = error?.response?.data?.error?.message ||
                      error?.response?.data?.message ||
                      'Gagal memperbarui profil. Silakan coba lagi.'
      setSaveMessage(errorMsg)

      // Keep error message longer
      setTimeout(() => setSaveMessage(''), 5000)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <section className="rounded-xl border-t-2 border-[#C9A96E] bg-[#002D22]/5 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[10px] p-4 xs:p-6 sm:p-8">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006C49]"></div>
        </div>
      </section>
    )
  }

  return (
    <section className="rounded-xl border-t-2 border-[#C9A96E] bg-[#002D22]/5 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[10px] p-4 xs:p-6 sm:p-8 animate-fade-slide-up">
      {/* Section Header */}
      <div className="mb-6 pb-4 border-b border-[#BEC9C3]/20">
        <h2 className="text-lg sm:text-xl font-bold text-[#004536]">Profil Saya</h2>
        <p className="text-xs sm:text-sm text-[#3F4945] mt-1">Update informasi profil dan alamat Anda</p>
      </div>

      {/* Save Message */}
      {saveMessage && (
        <div className={`mb-4 p-3 rounded-lg text-sm font-medium transition-all ${
          saveMessage.includes('berhasil')
            ? 'bg-green-100 text-green-700 border border-green-300'
            : 'bg-red-100 text-red-700 border border-red-300'
        }`}>
          {saveMessage}
        </div>
      )}

      {/* Form fields grid */}
      <div className="w-full grid grid-cols-1 xs:grid-cols-2 gap-4 sm:gap-6">
        <FormField
          id="full-name"
          label="Nama Lengkap"
          value={name}
          onChange={setName}
          placeholder="Masukkan nama lengkap"
        />
        <FormField
          id="email"
          label="Alamat Email"
          type="email"
          value={email}
          onChange={setEmail}
          placeholder="Masukkan email"
          disabled
        />
        <FormField
          id="phone"
          label="Nomor Telepon"
          type="tel"
          value={phone}
          onChange={setPhone}
          placeholder="+62 ..."
        />
        <div className="xs:col-span-2">
          <FormField
            id="address"
            label="Alamat Lengkap"
            value={address}
            onChange={setAddress}
            placeholder="Masukkan alamat lengkap"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-6 sm:mt-8 flex gap-3 justify-end">
        <button
          onClick={handleSaveProfile}
          disabled={isSaving}
          className="px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg bg-[#006C49] text-white font-semibold text-sm sm:text-base hover:bg-[#005639] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isSaving ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
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
