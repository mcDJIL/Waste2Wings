import { useState, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useToast } from '../../contexts/ToastContext'
import api from '../../services/api'

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
  </svg>
)

const LoadingSpinner = () => (
  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
)

export default function SubmissionModal({ isOpen, onClose, onSubmissionCreated }) {
  const { user } = useAuth()
  const { showToast } = useToast()
  const [estimatedLiter, setEstimatedLiter] = useState('')
  const [collectors, setCollectors] = useState([])
  const [selectedCollectorId, setSelectedCollectorId] = useState(null)
  const [isLoadingCollectors, setIsLoadingCollectors] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  // Get user's coordinates for nearby collectors query
  const userLat = user?.profile?.latitude || -6.2615
  const userLng = user?.profile?.longitude || 106.8106

  // Load nearby collectors when modal opens
  useEffect(() => {
    if (isOpen && collectors.length === 0) {
      loadNearbyCollectors()
    }
  }, [isOpen])

  const loadNearbyCollectors = async () => {
    try {
      setIsLoadingCollectors(true)
      setErrorMessage('')
      const response = await api.get('/collectors/nearby', {
        params: {
          lat: userLat,
          lng: userLng,
          limit: 10,
        },
      })

      // Handle different response structures
      const collectorsData = Array.isArray(response.data)
        ? response.data
        : response.data?.collectors || []

      console.log('Collectors loaded:', collectorsData)
      setCollectors(collectorsData)
    } catch (error) {
      console.error('Failed to load collectors:', error)
      setErrorMessage('Gagal memuat daftar pengepul. Silakan coba lagi.')
      setCollectors([])
    } finally {
      setIsLoadingCollectors(false)
    }
  }

  const handleSubmit = async () => {
    if (!estimatedLiter) {
      setErrorMessage('Silakan isi estimasi liter terlebih dahulu')
      return
    }

    if (!selectedCollectorId) {
      setErrorMessage('Silakan pilih pengepul terlebih dahulu')
      return
    }

    try {
      setIsSubmitting(true)
      setErrorMessage('')

      const payload = {
        collectorId: selectedCollectorId,
        estimatedLiter: parseFloat(estimatedLiter),
      }

      const response = await api.post('/submissions', payload)

      // Reset form
      setEstimatedLiter('')
      setSelectedCollectorId(null)
      setCollectors([])

      // Show success toast
      showToast('✓ Setoran berhasil dibuat!', 'success', 2000)

      // Close modal after delay
      setTimeout(() => {
        onClose()
      }, 500)

      // Notify parent component and refresh page
      if (onSubmissionCreated) {
        onSubmissionCreated(response.data)
      }

      // Refresh page after 2 seconds
      setTimeout(() => {
        window.location.reload()
      }, 2000)
    } catch (error) {
      console.error('Failed to create submission:', error)
      setErrorMessage(error?.response?.data?.error?.message || 'Gagal membuat setoran baru. Silakan coba lagi.')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] animate-fade-slide-up">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-[#BEC9C3]/20 px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-[#004536]">Buat Setoran Baru</h2>
          <button
            onClick={onClose}
            className="p-2 text-[#3F4945] hover:bg-gray-100 rounded-lg transition-colors"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col gap-6">
          {/* Estimasi Liter Input */}
          <div>
            <label className="block text-sm font-bold text-[#404945] uppercase mb-2">
              Estimasi Liter
            </label>
            <input
              type="number"
              value={estimatedLiter}
              onChange={(e) => setEstimatedLiter(e.target.value)}
              placeholder="Contoh: 25"
              min="0.1"
              step="0.1"
              className="w-full px-4 py-3 rounded-lg border border-[#BFC9C3]/30 bg-white/50 text-[#051C37] placeholder:text-[#6B7280] outline-none focus:border-[#006C49]/60 focus:ring-2 focus:ring-[#006C49]/10 transition-all"
            />
            <p className="text-xs text-[#3F4945] mt-1">Minimal 0.1 liter</p>
          </div>

          {/* Collector Selection */}
          <div>
            <label className="block text-sm font-bold text-[#404945] uppercase mb-3">
              Pilih Pengepul
            </label>

            {isLoadingCollectors ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-6 h-6 border-2 border-[#006C49] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-sm text-[#3F4945]">Memuat daftar pengepul...</p>
                </div>
              </div>
            ) : !Array.isArray(collectors) || collectors.length === 0 ? (
              <div className="text-center py-8 border border-[#BFC9C3]/20 rounded-lg">
                <p className="text-[#3F4945] text-sm">Tidak ada pengepul aktif di area Anda</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {collectors.map((collector) => (
                  <button
                    key={collector.id}
                    onClick={() => setSelectedCollectorId(collector.id)}
                    className={`w-full p-4 rounded-lg border-2 text-left transition-all ${
                      selectedCollectorId === collector.id
                        ? 'border-[#006C49] bg-[#006C49]/5'
                        : 'border-[#BFC9C3]/30 hover:border-[#006C49]/50'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-[#004536] text-sm">{collector.name}</h4>
                        <p className="text-xs text-[#3F4945] mt-1">{collector.address || 'Alamat tidak tersedia'}</p>
                        {collector.distance !== undefined && (
                          <p className="text-xs text-[#006C49] font-medium mt-2">
                            Jarak: {collector.distance.toFixed(2)} km
                          </p>
                        )}
                      </div>
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5 ${
                          selectedCollectorId === collector.id
                            ? 'border-[#006C49] bg-[#006C49]'
                            : 'border-[#BFC9C3]'
                        }`}
                      >
                        {selectedCollectorId === collector.id && (
                          <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className="text-white">
                            <path d="M10 2L4.5 8.5L2 6" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                          </svg>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 rounded-lg bg-red-100 text-red-700 text-sm border border-red-300">
              {errorMessage}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 px-6 py-3 rounded-lg border border-[#006C49] text-[#006C49] font-semibold hover:bg-[#006C49]/5 active:scale-95 transition-all"
            >
              Batal
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSubmitting || !estimatedLiter || !selectedCollectorId}
              className="flex-1 px-6 py-3 rounded-lg bg-[#006C49] text-white font-semibold hover:bg-[#005639] active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
            >
              {isSubmitting && <LoadingSpinner />}
              {isSubmitting ? 'Membuat...' : 'Buat Setoran'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
