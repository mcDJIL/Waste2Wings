import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
  </svg>
)

export default function LabResultsModal({ isOpen, batchId, batch, onClose, onSuccess }) {
  const { showToast } = useToast()
  const [labResult, setLabResult] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [error, setError] = useState('')
  const [note, setNote] = useState('')

  const cleanLiterValue = batch?.cleanLiter || 0

  useEffect(() => {
    if (isOpen && batchId) {
      loadLabResults()
    }
  }, [isOpen, batchId])

  const loadLabResults = async () => {
    try {
      setIsLoading(true)
      setError('')
      const response = await api.get(`/batches/${batchId}/lab-results`)
      setLabResult(response.data?.labResult)
      if (!response.data?.labResult) {
        setError('Belum ada hasil lab untuk batch ini')
      }
    } catch (err) {
      console.error('Failed to load lab results:', err)
      setError('Gagal memuat hasil lab')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async () => {
    if (!note.trim()) {
      setError('Catatan penerimaan harus diisi')
      return
    }

    try {
      setActionLoading('accept')
      await api.patch(`/batches/${batchId}/stakeholder-validation`, {
        status: 'ACCEPTED_BY_STAKEHOLDER',
        cleanLiter: cleanLiterValue,
        stakeholderNote: note,
      })
      showToast('Hasil lab berhasil diterima', 'success', 3000, 'Sukses')
      onSuccess?.()
      onClose()
    } catch (err) {
      console.error('Failed to accept batch:', err)
      setError(err.response?.data?.message || 'Gagal menerima hasil lab')
      showToast('Gagal menerima hasil lab', 'error', 3000, 'Error')
    } finally {
      setActionLoading(null)
    }
  }

  const handleReject = async () => {
    if (!note.trim()) {
      setError('Alasan penolakan harus diisi')
      return
    }

    try {
      setActionLoading('reject')
      await api.patch(`/batches/${batchId}/stakeholder-validation`, {
        status: 'REJECTED_BY_STAKEHOLDER',
        stakeholderNote: note,
      })
      showToast('Hasil lab berhasil ditolak', 'success', 3000, 'Sukses')
      onSuccess?.()
      onClose()
    } catch (err) {
      console.error('Failed to reject batch:', err)
      setError(err.response?.data?.message || 'Gagal menolak hasil lab')
      showToast('Gagal menolak hasil lab', 'error', 3000, 'Error')
    } finally {
      setActionLoading(null)
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] animate-fade-slide-up max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#004536] to-[#006C49] px-6 sm:px-8 py-5 flex items-center justify-between shrink-0 rounded-t-3xl">
          <h2 className="text-lg sm:text-xl font-bold text-white">Hasil Uji Lab</h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-200"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="w-6 h-6 border-2 border-[#006C49] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-[#3F4945]">Memuat hasil lab...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-yellow-50 text-yellow-700 text-sm border border-yellow-200">
              {error}
            </div>
          ) : labResult ? (
            <div className="space-y-6">
              {/* Lab Test Results Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                {labResult.waterContentPercent !== undefined && (
                  <div className="p-4 rounded-lg bg-gradient-to-br from-[#F0F3FF]/70 to-[#E8F1FF]/70 border border-[#BEC9C3]/15">
                    <p className="text-[10px] font-bold uppercase text-[#3F4945] mb-2 tracking-wide">Kadar Air</p>
                    <p className="text-lg font-bold text-[#004536]">{labResult.waterContentPercent}%</p>
                  </div>
                )}
                {labResult.ffaPercent !== undefined && (
                  <div className="p-4 rounded-lg bg-gradient-to-br from-[#F0F3FF]/70 to-[#E8F1FF]/70 border border-[#BEC9C3]/15">
                    <p className="text-[10px] font-bold uppercase text-[#3F4945] mb-2 tracking-wide">FFA</p>
                    <p className="text-lg font-bold text-[#006C49]">{labResult.ffaPercent}%</p>
                  </div>
                )}
                {labResult.impurityPercent !== undefined && (
                  <div className="p-4 rounded-lg bg-gradient-to-br from-[#F0F3FF]/70 to-[#E8F1FF]/70 border border-[#BEC9C3]/15">
                    <p className="text-[10px] font-bold uppercase text-[#3F4945] mb-2 tracking-wide">Kotoran</p>
                    <p className="text-lg font-bold text-[#004536]">{labResult.impurityPercent}%</p>
                  </div>
                )}
                {labResult.grade && (
                  <div className="p-4 rounded-lg bg-gradient-to-br from-[#D1FAE5]/70 to-[#A7F3D0]/70 border border-[#6EE7B7]/30">
                    <p className="text-[10px] font-bold uppercase text-[#065F46] mb-2 tracking-wide">Grade</p>
                    <p className="text-2xl font-bold text-[#065F46]">{labResult.grade}</p>
                  </div>
                )}
              </div>

              {/* Notes */}
              {labResult.notes && (
                <div className="border-t border-[#BEC9C3]/20 pt-6">
                  <h3 className="text-sm font-bold uppercase text-[#3F4945] tracking-wide mb-3">Catatan</h3>
                  <p className="text-sm text-[#3F4945] bg-[#FEF3C7]/50 p-4 rounded-lg border border-[#E4C285]/30 leading-relaxed">
                    {labResult.notes}
                  </p>
                </div>
              )}

              {/* Stakeholder Note */}
              <div className="border-t border-[#BEC9C3]/20 pt-6">
                <label className="block text-sm font-bold text-[#051C37] mb-2">
                  Catatan/Alasan *
                </label>
                <textarea
                  value={note}
                  onChange={(e) => {
                    setNote(e.target.value)
                    if (error && e.target.value.trim()) setError('')
                  }}
                  placeholder="Jelaskan alasan penerimaan atau penolakan hasil lab ini..."
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-lg border border-[rgba(190,201,195,0.30)] bg-white text-[#051C37] outline-none focus:border-[#004536] focus:ring-2 focus:ring-[#004536]/20 transition-all duration-200 resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="border-t border-[#BEC9C3]/20 pt-6 flex gap-3">
                <button
                  onClick={handleReject}
                  disabled={actionLoading || !note.trim()}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#FEE2E2] text-[#991B1B] font-bold text-sm transition-all duration-200 hover:bg-[#FECACA] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {actionLoading === 'reject' ? 'Menolak...' : 'Tolak'}
                </button>
                <button
                  onClick={handleAccept}
                  disabled={actionLoading || !note.trim()}
                  className="flex-1 px-4 py-2.5 rounded-lg bg-[#D1FAE5] text-[#065F46] font-bold text-sm transition-all duration-200 hover:bg-[#A7F3D0] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
                >
                  {actionLoading === 'accept' ? 'Menerima...' : 'Terima'}
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
