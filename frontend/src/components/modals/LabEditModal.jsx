import { useState } from 'react'
import { createPortal } from 'react-dom'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
  </svg>
)

export default function LabEditModal({ isOpen, labResult, onClose, onSuccess }) {
  const { showToast } = useToast()
  const [formData, setFormData] = useState({
    waterContentPercent: labResult?.waterContentPercent || '',
    ffaPercent: labResult?.ffaPercent || '',
    impurityPercent: labResult?.impurityPercent || '',
    grade: labResult?.grade || 'A',
    notes: labResult?.notes || '',
    reason: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'grade' ? value : value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!formData.reason.trim()) {
      setError('Alasan perubahan harus diisi')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      await api.patch(`/lab-results/${labResult.id}`, {
        waterContentPercent: parseFloat(formData.waterContentPercent),
        ffaPercent: parseFloat(formData.ffaPercent),
        impurityPercent: parseFloat(formData.impurityPercent),
        grade: formData.grade,
        notes: formData.notes,
        editReason: formData.reason,
      })

      showToast('Hasil lab berhasil diperbarui', 'success', 3000, 'Sukses')
      onSuccess?.()
      onClose()
    } catch (err) {
      console.error('Failed to update lab results:', err)
      setError(err.response?.data?.message || 'Gagal memperbarui hasil lab')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-lg shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] animate-fade-slide-up max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#004536] to-[#006C49] px-6 sm:px-8 py-5 flex items-center justify-between shrink-0 rounded-t-3xl">
          <h2 className="text-lg sm:text-xl font-bold text-white">Edit Hasil Uji Lab</h2>
          <button
            onClick={onClose}
            className="p-2 text-white hover:bg-white/20 rounded-lg transition-all duration-200"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200 mb-6">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Water Content */}
            <div>
              <label className="block text-sm font-bold text-[#051C37] mb-2">
                Kadar Air (%)
              </label>
              <input
                type="number"
                name="waterContentPercent"
                value={formData.waterContentPercent}
                onChange={handleChange}
                step="0.1"
                required
                placeholder="0.0"
                className="w-full px-4 py-2.5 rounded-lg border border-[rgba(190,201,195,0.30)] bg-white text-[#051C37] outline-none focus:border-[#004536] focus:ring-2 focus:ring-[#004536]/20 transition-all duration-200"
              />
            </div>

            {/* FFA */}
            <div>
              <label className="block text-sm font-bold text-[#051C37] mb-2">
                FFA (%)
              </label>
              <input
                type="number"
                name="ffaPercent"
                value={formData.ffaPercent}
                onChange={handleChange}
                step="0.1"
                required
                placeholder="0.0"
                className="w-full px-4 py-2.5 rounded-lg border border-[rgba(190,201,195,0.30)] bg-white text-[#051C37] outline-none focus:border-[#004536] focus:ring-2 focus:ring-[#004536]/20 transition-all duration-200"
              />
            </div>

            {/* Impurity */}
            <div>
              <label className="block text-sm font-bold text-[#051C37] mb-2">
                Kotoran (%)
              </label>
              <input
                type="number"
                name="impurityPercent"
                value={formData.impurityPercent}
                onChange={handleChange}
                step="0.1"
                required
                placeholder="0.0"
                className="w-full px-4 py-2.5 rounded-lg border border-[rgba(190,201,195,0.30)] bg-white text-[#051C37] outline-none focus:border-[#004536] focus:ring-2 focus:ring-[#004536]/20 transition-all duration-200"
              />
            </div>

            {/* Grade */}
            <div>
              <label className="block text-sm font-bold text-[#051C37] mb-2">
                Grade
              </label>
              <select
                name="grade"
                value={formData.grade}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg border border-[rgba(190,201,195,0.30)] bg-white text-[#051C37] outline-none focus:border-[#004536] focus:ring-2 focus:ring-[#004536]/20 transition-all duration-200"
              >
                <option value="A">Grade A</option>
                <option value="B">Grade B</option>
                <option value="C">Grade C</option>
                <option value="REJECT">REJECT</option>
              </select>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-bold text-[#051C37] mb-2">
                Catatan Teknis
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Catatan tambahan..."
                rows="3"
                className="w-full px-4 py-2.5 rounded-lg border border-[rgba(190,201,195,0.30)] bg-white text-[#051C37] outline-none focus:border-[#004536] focus:ring-2 focus:ring-[#004536]/20 transition-all duration-200 resize-none"
              />
            </div>

            {/* Reason for Edit */}
            <div className="p-4 rounded-lg bg-yellow-50 border border-yellow-200">
              <label className="block text-sm font-bold text-[#051C37] mb-2">
                Alasan Perubahan *
              </label>
              <textarea
                name="reason"
                value={formData.reason}
                onChange={handleChange}
                placeholder="Jelaskan alasan perubahan data hasil lab ini..."
                rows="4"
                required
                className="w-full px-4 py-2.5 rounded-lg border border-[rgba(190,201,195,0.30)] bg-white text-[#051C37] outline-none focus:border-[#004536] focus:ring-2 focus:ring-[#004536]/20 transition-all duration-200 resize-none"
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full px-4 py-2.5 rounded-lg bg-[#004536] text-white font-bold text-sm transition-all duration-200 hover:bg-[#006C49] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isLoading ? 'Memperbarui...' : 'Perbarui Hasil Lab'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
