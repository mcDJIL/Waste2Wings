import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import api from '../../services/api'
import { useAuth } from '../../contexts/AuthContext'

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
  </svg>
)

const calculateAutoGrade = (water, ffa) => {
  const w = parseFloat(water)
  const f = parseFloat(ffa)

  if (isNaN(w) && isNaN(f)) return 'A'
  const waterVal = isNaN(w) ? 0 : w
  const ffaVal = isNaN(f) ? 0 : f

  if (waterVal < 0.2 && ffaVal < 1.0) {
    return 'A'
  }
  if (waterVal <= 0.5 && ffaVal <= 2.0) {
    return 'B'
  }
  return 'C'
}

export default function LabInputModal({ isOpen, batchId, onClose, onSuccess }) {
  const { user } = useAuth()
  const isLabTech = user?.role === 'LAB_TECHNICIAN'

  const [batchData, setBatchData] = useState(null)
  const [isFetchingBatch, setIsFetchingBatch] = useState(false)
  const [isEditMode, setIsEditMode] = useState(false)

  const [formData, setFormData] = useState({
    waterContentPercent: '',
    ffaPercent: '',
    impurityPercent: '',
    notes: '',
    editReason: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && batchId) {
      fetchBatchDetails()
    }
  }, [isOpen, batchId])

  const fetchBatchDetails = async () => {
    try {
      setIsFetchingBatch(true)
      const res = await api.get(`/batches/${batchId}`)
      const data = res.data?.batch || res.data
      setBatchData(data)

      if (data?.labResult) {
        setFormData({
          waterContentPercent: data.labResult.waterContentPercent ?? '',
          ffaPercent: data.labResult.ffaPercent ?? '',
          impurityPercent: data.labResult.impurityPercent ?? '',
          notes: data.labResult.notes || '',
          editReason: '',
        })
        setIsEditMode(false) // Open in VIEW mode by default if lab result already exists
      } else {
        setFormData({
          waterContentPercent: '',
          ffaPercent: '',
          impurityPercent: '',
          notes: '',
          editReason: '',
        })
        setIsEditMode(true) // Open in INPUT mode if no lab result yet
      }
    } catch (err) {
      console.error('Failed to fetch batch detail:', err)
    } finally {
      setIsFetchingBatch(false)
    }
  }

  // Calculate grade dynamically based on water and ffa inputs
  const autoGrade = useMemo(() => {
    return calculateAutoGrade(
      formData.waterContentPercent,
      formData.ffaPercent
    )
  }, [formData.waterContentPercent, formData.ffaPercent])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    const hasLabResult = !!batchData?.labResult
    if (hasLabResult && !formData.editReason.trim()) {
      setError('Alasan pengeditan data lab wajib diisi untuk audit trail')
      return
    }

    try {
      setIsLoading(true)
      setError('')

      if (hasLabResult && batchData.labResult?.id) {
        // Update existing lab result
        await api.patch(`/lab-results/${batchData.labResult.id}`, {
          waterContentPercent: parseFloat(formData.waterContentPercent) || 0,
          ffaPercent: parseFloat(formData.ffaPercent) || 0,
          impurityPercent: parseFloat(formData.impurityPercent) || 0,
          grade: autoGrade,
          notes: formData.notes,
          reason: formData.editReason,
        })
      } else {
        // Create new lab result
        await api.post(`/batches/${batchId}/lab-results`, {
          waterContentPercent: parseFloat(formData.waterContentPercent) || 0,
          ffaPercent: parseFloat(formData.ffaPercent) || 0,
          impurityPercent: parseFloat(formData.impurityPercent) || 0,
          grade: autoGrade,
          notes: formData.notes,
        })
      }

      onSuccess?.()
      onClose()
    } catch (err) {
      console.error('Failed to submit lab results:', err)
      setError(err.response?.data?.message || 'Gagal menyimpan hasil uji lab')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const items = batchData?.items || []
  const hasLabResult = !!batchData?.labResult

  const getGradeBadgeStyle = (grade) => {
    switch (grade) {
      case 'A':
        return 'bg-emerald-100 text-emerald-800 border-emerald-300'
      case 'B':
        return 'bg-blue-100 text-blue-800 border-blue-300'
      case 'C':
        return 'bg-amber-100 text-amber-800 border-amber-300'
      case 'REJECT':
        return 'bg-rose-100 text-rose-800 border-rose-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-2xl min-w-0 shadow-2xl animate-fade-slide-up max-h-[90vh] overflow-hidden flex flex-col border border-[#E2E8F0]">
        {/* Header */}
        <div className="sticky top-0 bg-[#051C37] text-white px-6 py-5 flex items-center justify-between gap-4 shrink-0 rounded-t-3xl border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#81F9C1] text-xs font-mono font-bold">
                BATCH #{batchData?.batchCode || batchId}
              </span>
              <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getGradeBadgeStyle(autoGrade)}`}>
                GRADE {autoGrade}
              </span>
            </div>
            <h2 className="text-xl font-extrabold text-white">
              {hasLabResult && !isEditMode ? 'Detail Hasil Uji Lab' : hasLabResult ? 'Edit Data Uji Lab' : 'Input Hasil Uji Lab'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all duration-200 shrink-0"
          >
            <CloseIcon />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-6 sm:p-8 space-y-6">
          {error && (
            <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
              {error}
            </div>
          )}

          {/* Section 1: Rincian Isi Setoran Minyak Dalam Batch */}
          <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-extrabold text-[#004B3C] uppercase tracking-wider">
                📦 Rincian Isi Setoran Dalam Batch
              </span>
              <span className="text-xs font-bold text-gray-500">
                Total Volume: <strong className="text-[#004B3C]">{batchData?.totalCleanLiter || 0} Liter</strong> ({items.length} Setoran)
              </span>
            </div>

            {isFetchingBatch ? (
              <div className="py-4 text-center text-xs text-gray-400">Memuat rincian setoran...</div>
            ) : items.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {items.map((item, idx) => {
                  const sub = item.submission || {}
                  const cleanVol = item.cleanLiterAllocated ?? sub.cleanLiter ?? sub.actualLiter ?? sub.estimatedLiter ?? 0
                  const sedimentVol = sub.sedimentLiter ?? 0
                  const trxCode = sub.trxCode || item.submissionId || item.id

                  return (
                    <div
                      key={item.id || idx}
                      className="p-3 rounded-xl bg-white border border-[#E2E8F0] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center gap-3">
                        <span className="w-7 h-7 rounded-lg bg-[#004B3C]/10 text-[#004B3C] font-bold flex items-center justify-center text-xs">
                          #{idx + 1}
                        </span>
                        <div>
                          <p className="font-mono font-bold text-[#1E293B] text-xs">{trxCode}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">
                            {sub.createdAt ? new Date(sub.createdAt).toLocaleDateString('id-ID') : 'Setoran Minyak Jelantah'}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-[#004B3C] block text-sm">
                          {cleanVol} Liter <span className="text-[10px] font-normal text-gray-400">(Clean)</span>
                        </span>
                        <span className="text-[10px] font-bold text-amber-600 block">
                          🧪 {sedimentVol} L Sedimen
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <p className="text-xs text-gray-400 italic">Informasi rincian setoran tidak tersedia.</p>
            )}
          </div>

          {/* Section 2: View Mode vs Edit Mode */}
          {hasLabResult && !isEditMode ? (
            /* VIEW / DETAIL MODE */
            <div className="space-y-5 pt-2 border-t border-[#E2E8F0]">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-extrabold text-[#004B3C] uppercase tracking-wider">
                  🧪 Hasil Uji Mutu Laboratorium
                </h3>
                <button
                  type="button"
                  onClick={() => setIsEditMode(true)}
                  className="px-4 py-2 rounded-xl bg-amber-500 text-white font-extrabold text-xs hover:bg-amber-600 transition-colors shadow-sm flex items-center gap-1.5"
                >
                  ✏️ Edit Data Lab
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">KADAR AIR (%)</span>
                  <span className="text-base font-extrabold text-[#004B3C] mt-1 block">{formData.waterContentPercent}%</span>
                  <span className="text-[10px] text-gray-400">A: &lt; 0.2% | B: 0.2-0.5% | C: &gt; 0.5%</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">FFA (%)</span>
                  <span className="text-base font-extrabold text-[#004B3C] mt-1 block">{formData.ffaPercent}%</span>
                  <span className="text-[10px] text-gray-400">A: &lt; 1% | B: 1-2% | C: &gt; 2%</span>
                </div>

                <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                  <span className="text-[10px] font-bold text-gray-500 uppercase block">KOTORAN (%)</span>
                  <span className="text-base font-extrabold text-[#004B3C] mt-1 block">{formData.impurityPercent}%</span>
                  <span className="text-[10px] text-gray-400">Standard: &le; 1.0%</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#004B3C]/5 border border-[#004B3C]/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">QUALITY GRADE</span>
                  <span className="text-xs text-gray-600">Calculated automatically</span>
                </div>
                <span className={`px-4 py-2 rounded-xl text-sm font-extrabold border ${getGradeBadgeStyle(autoGrade)}`}>
                  GRADE {autoGrade}
                </span>
              </div>

              {formData.notes && (
                <div className="p-4 rounded-xl bg-gray-50 border border-gray-200 text-xs">
                  <span className="font-bold text-gray-700 uppercase block mb-1">💬 Catatan Lab:</span>
                  <p className="text-gray-700">{formData.notes}</p>
                </div>
              )}
            </div>
          ) : (
            /* EDIT / INPUT FORM MODE */
            <form onSubmit={handleSubmit} className="space-y-5">
              <h3 className="text-xs font-extrabold text-[#004B3C] uppercase tracking-wider pt-2 border-t border-[#E2E8F0]">
                🧪 {hasLabResult ? 'Edit Parameter Mutu Laboratorium' : 'Input Parameter Mutu Laboratorium'}
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {/* Water Content */}
                <div>
                  <label className="block text-xs font-bold text-[#051C37] mb-1.5">
                    Kadar Air (%) *
                  </label>
                  <input
                    type="number"
                    name="waterContentPercent"
                    value={formData.waterContentPercent}
                    onChange={handleChange}
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#051C37] font-bold text-sm outline-none focus:border-[#004B3C] focus:ring-2 focus:ring-[#004B3C]/10 transition-all"
                  />
                  <span className="text-[10px] text-gray-500 font-medium mt-1 block">A: &lt; 0.2% | B: 0.2-0.5% | C: &gt; 0.5%</span>
                </div>

                {/* FFA */}
                <div>
                  <label className="block text-xs font-bold text-[#051C37] mb-1.5">
                    FFA (%) *
                  </label>
                  <input
                    type="number"
                    name="ffaPercent"
                    value={formData.ffaPercent}
                    onChange={handleChange}
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#051C37] font-bold text-sm outline-none focus:border-[#004B3C] focus:ring-2 focus:ring-[#004B3C]/10 transition-all"
                  />
                  <span className="text-[10px] text-gray-500 font-medium mt-1 block">A: &lt; 1% | B: 1-2% | C: &gt; 2%</span>
                </div>

                {/* Impurity */}
                <div>
                  <label className="block text-xs font-bold text-[#051C37] mb-1.5">
                    Kotoran (%) *
                  </label>
                  <input
                    type="number"
                    name="impurityPercent"
                    value={formData.impurityPercent}
                    onChange={handleChange}
                    step="0.01"
                    required
                    placeholder="0.00"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-[#051C37] font-bold text-sm outline-none focus:border-[#004B3C] focus:ring-2 focus:ring-[#004B3C]/10 transition-all"
                  />
                  <span className="text-[10px] text-gray-400 mt-1 block">Batas Standar: &le; 1.0%</span>
                </div>
              </div>

              {/* Auto Grade Preview Badge Card */}
              <div className="p-4 rounded-2xl bg-[#004B3C]/5 border border-[#004B3C]/15 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider block">Kategori Grade Otomatis (Calculated)</span>
                  <span className="text-xs text-gray-600">Berdasarkan kalkulasi Kadar Air & FFA</span>
                </div>
                <span className={`px-4 py-2 rounded-xl text-sm font-extrabold border ${getGradeBadgeStyle(autoGrade)}`}>
                  GRADE {autoGrade}
                </span>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#051C37] mb-1.5">
                  Catatan Pengujian Laboratorium
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Tuliskan catatan teknis hasil uji sampel minyak..."
                  rows="3"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm outline-none focus:border-[#004B3C] focus:ring-2 focus:ring-[#004B3C]/10 transition-all resize-none"
                />
              </div>

              {/* Mandatory Edit Reason for Audit Trail */}
              {hasLabResult && (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2">
                  <label className="block text-xs font-extrabold text-amber-900 uppercase">
                    📝 Alasan Pengeditan Data Uji
                  </label>
                  <textarea
                    name="editReason"
                    value={formData.editReason}
                    onChange={handleChange}
                    required
                    placeholder="Wajib tuliskan alasan mengapa data uji lab ini diubah."
                    rows="2"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-amber-300 bg-white text-sm outline-none focus:border-amber-600 focus:ring-2 focus:ring-amber-500/20 transition-all resize-none"
                  />
                </div>
              )}

              {/* Submit / Cancel Edit Buttons */}
              <div className="flex items-center gap-3">
                {hasLabResult && (
                  <button
                    type="button"
                    onClick={() => setIsEditMode(false)}
                    className="px-4 py-3 rounded-xl border border-[#E2E8F0] font-bold text-xs hover:bg-gray-100 transition-colors"
                  >
                    Batal Edit
                  </button>
                )}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 px-4 py-3 rounded-xl bg-[#004B3C] text-white font-extrabold text-sm transition-all duration-200 hover:bg-[#00382D] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 shadow-md flex items-center justify-center gap-2"
                >
                  {isLoading
                    ? 'Menyimpan Data...'
                    : hasLabResult
                    ? '💾 Simpan Perubahan'
                    : '🧪 Simpan Hasil Uji Lab'}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
