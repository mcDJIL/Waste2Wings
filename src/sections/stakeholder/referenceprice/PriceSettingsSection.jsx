import { useState, useEffect } from 'react'

function SaveIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M3 18C2.175 18 1.44375 17.7063 0.80625 17.1188C0.16875 16.5313 -0.125 15.8 0.0375 15.025L1.5 4.5C1.575 4.05 1.8 3.66875 2.175 3.35625C2.55 3.04375 2.975 2.875 3.45 2.875H11.25V0.5C11.25 0.225 11.35 0 11.55 -0.075C11.75 -0.15 11.925 -0.075 12.075 0.075L16.575 4.575C16.725 4.725 16.8 4.9 16.8 5.1C16.8 5.3 16.725 5.475 16.575 5.625L12.075 10.125C11.925 10.275 11.75 10.35 11.55 10.275C11.35 10.2 11.25 10.025 11.25 9.75V7.375H3.45C3.225 7.375 3.0375 7.45 2.88125 7.59375C2.725 7.7375 2.625 7.925 2.58125 8.15L1.125 15.2C1.05 15.525 1.1 15.8125 1.275 16.05C1.45 16.2875 1.65 16.4 1.875 16.4H15.75C16.025 16.4 16.25 16.5 16.425 16.7C16.6 16.9 16.675 17.125 16.65 17.375L16.5 17.5C16.35 17.65 16.175 17.725 15.975 17.725H3Z" fill="#004536" />
    </svg>
  )
}

export default function PriceSettingsSection({ settings, isLoading, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [formData, setFormData] = useState(
    settings || {
      referencePricePerLiter: 0,
      receptionLocationName: '',
      receptionAddress: '',
      latitude: 0,
      longitude: 0,
    }
  )

  useEffect(() => {
    if (settings) {
      setFormData(settings)
    }
  }, [settings])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'referencePricePerLiter' || name === 'latitude' || name === 'longitude' 
        ? parseFloat(value) || 0 
        : value,
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await onUpdate(formData)
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setFormData(
      settings || {
        referencePricePerLiter: 0,
        receptionLocationName: '',
        receptionAddress: '',
        latitude: 0,
        longitude: 0,
      }
    )
    setIsEditing(false)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="w-6 h-6 border-2 border-[#006C49] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm text-[#3F4945]">Memuat pengaturan...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Price Reference Card */}
      <div className="flex flex-col gap-6 p-6 rounded-xl border-t-2 border border-[#C9A96E] bg-white/70 backdrop-blur-[10px] shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-[#051C37] text-lg font-bold leading-7">Harga Acuan Minyak Jelantah</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="px-3 py-1.5 rounded-lg text-sm font-semibold text-[#004536] hover:bg-[#E8F5F1] transition-all duration-200"
            >
              Edit
            </button>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-[#3F4945] text-xs font-bold uppercase tracking-wide mb-2">
              Harga per Liter (Rp)
            </label>
            {isEditing ? (
              <input
                type="number"
                name="referencePricePerLiter"
                value={formData.referencePricePerLiter}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-[rgba(190,201,195,0.30)] bg-white text-[#051C37] outline-none focus:border-[#004536] focus:ring-2 focus:ring-[#004536]/20 transition-all duration-200"
              />
            ) : (
              <p className="text-[#004536] text-2xl font-bold">
                Rp{formData.referencePricePerLiter?.toLocaleString('id-ID')}
              </p>
            )}
          </div>

          {settings?.updatedBy && !isEditing && (
            <div className="pt-4 border-t border-[#BEC9C3]/20">
              <p className="text-[#3F4945] text-xs mb-2">
                Terakhir diperbarui oleh <strong>{settings.updatedBy.name}</strong>
              </p>
              <p className="text-[#6F7975] text-xs">
                {new Date(settings.updatedAt).toLocaleDateString('id-ID', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Reception Location Card */}
      <div className="flex flex-col gap-6 p-6 rounded-xl border-t-2 border border-[#C9A96E] bg-white/70 backdrop-blur-[10px] shadow-sm">
        <h3 className="text-[#051C37] text-lg font-bold leading-7">Lokasi Penerimaan</h3>

        <div className="space-y-4">
          <div>
            <label className="block text-[#3F4945] text-xs font-bold uppercase tracking-wide mb-2">
              Nama Lokasi
            </label>
            {isEditing ? (
              <input
                type="text"
                name="receptionLocationName"
                value={formData.receptionLocationName}
                onChange={handleInputChange}
                className="w-full px-4 py-2.5 rounded-lg border border-[rgba(190,201,195,0.30)] bg-white text-[#051C37] outline-none focus:border-[#004536] focus:ring-2 focus:ring-[#004536]/20 transition-all duration-200"
                placeholder="Nama lokasi penerimaan"
              />
            ) : (
              <p className="text-[#004536] text-base font-semibold">
                {formData.receptionLocationName || '—'}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[#3F4945] text-xs font-bold uppercase tracking-wide mb-2">
              Alamat
            </label>
            {isEditing ? (
              <textarea
                name="receptionAddress"
                value={formData.receptionAddress}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-4 py-2.5 rounded-lg border border-[rgba(190,201,195,0.30)] bg-white text-[#051C37] outline-none focus:border-[#004536] focus:ring-2 focus:ring-[#004536]/20 transition-all duration-200 resize-none"
                placeholder="Alamat lengkap lokasi penerimaan"
              />
            ) : (
              <p className="text-[#3F4945] text-sm leading-5">
                {formData.receptionAddress || '—'}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Coordinates Card */}
      <div className="flex flex-col gap-6 p-6 rounded-xl border-t-2 border border-[#C9A96E] bg-white/70 backdrop-blur-[10px] shadow-sm">
        <h3 className="text-[#051C37] text-lg font-bold leading-7">Koordinat GPS</h3>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-[#3F4945] text-xs font-bold uppercase tracking-wide mb-2">
              Latitude
            </label>
            {isEditing ? (
              <input
                type="number"
                name="latitude"
                value={formData.latitude}
                onChange={handleInputChange}
                step="0.0001"
                className="w-full px-4 py-2.5 rounded-lg border border-[rgba(190,201,195,0.30)] bg-white text-[#051C37] outline-none focus:border-[#004536] focus:ring-2 focus:ring-[#004536]/20 transition-all duration-200"
              />
            ) : (
              <p className="text-[#004536] text-base font-semibold">{formData.latitude}</p>
            )}
          </div>

          <div>
            <label className="block text-[#3F4945] text-xs font-bold uppercase tracking-wide mb-2">
              Longitude
            </label>
            {isEditing ? (
              <input
                type="number"
                name="longitude"
                value={formData.longitude}
                onChange={handleInputChange}
                step="0.0001"
                className="w-full px-4 py-2.5 rounded-lg border border-[rgba(190,201,195,0.30)] bg-white text-[#051C37] outline-none focus:border-[#004536] focus:ring-2 focus:ring-[#004536]/20 transition-all duration-200"
              />
            ) : (
              <p className="text-[#004536] text-base font-semibold">{formData.longitude}</p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      {isEditing && (
        <div className="flex items-end gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 px-6 py-2.5 rounded-lg bg-[#D1FAE5] text-[#065F46] font-bold text-sm transition-all duration-200 hover:bg-[#A7F3D0] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 flex items-center justify-center gap-2"
          >
            <SaveIcon />
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </button>
          <button
            onClick={handleCancel}
            disabled={isSaving}
            className="flex-1 px-6 py-2.5 rounded-lg bg-[#F3F4F6] text-[#374151] font-bold text-sm transition-all duration-200 hover:bg-[#E5E7EB] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
          >
            Batal
          </button>
        </div>
      )}
    </div>
  )
}
