import { useState, useEffect, useMemo } from 'react'
import { createPortal } from 'react-dom'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  ResponsiveContainer,
} from 'recharts'

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
  </svg>
)

const computeRadarScore = (value, limit, maxValue = 100) => {
  if (!value || !limit) return 0
  return Math.max(0, Math.min(maxValue, (1 - value / limit) * maxValue))
}

export default function LabResultsModal({ isOpen, batchId, batch, onClose, onSuccess }) {
  const { showToast } = useToast()
  const [labResult, setLabResult] = useState(null)
  const [batchData, setBatchData] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [error, setError] = useState('')
  const [note, setNote] = useState('')
  const [isEditMode, setIsEditMode] = useState(false)

  const cleanLiterValue = batchData?.totalCleanLiter ?? batch?.totalCleanLiter ?? 0

  useEffect(() => {
    if (isOpen && batchId) {
      loadLabResults()
    }
  }, [isOpen, batchId])

  const loadLabResults = async () => {
    try {
      setIsLoading(true)
      setError('')
      const [resultsRes, batchRes] = await Promise.all([
        api.get(`/batches/${batchId}/lab-results`),
        api.get(`/batches/${batchId}`),
      ])
      const labResultData = resultsRes.data?.labResult
      const batchDataResponse = batchRes.data?.batch || batchRes.data
      setLabResult(labResultData)
      setBatchData(batchDataResponse)

      const savedNote = labResultData?.stakeholderNote || batchDataResponse?.stakeholderNote || ''
      setNote(savedNote)

      const isVerified = ['ACCEPTED_BY_STAKEHOLDER', 'REJECTED_BY_STAKEHOLDER'].includes(batchDataResponse?.status)
      setIsEditMode(!isVerified) // View mode if already verified, Edit mode if pending
    } catch (err) {
      console.error('Failed to load lab results:', err)
      setError('Gagal memuat hasil lab')
    } finally {
      setIsLoading(false)
    }
  }

  const handleAccept = async () => {
    if (!note.trim()) {
      setError('Alasan keputusan/perubahan verifikasi wajib diisi untuk audit trail')
      return
    }

    try {
      setActionLoading('accept')
      await api.patch(`/batches/${batchId}/stakeholder-validation`, {
        status: 'ACCEPTED_BY_STAKEHOLDER',
        finalLiter: cleanLiterValue,
        stakeholderNote: note,
      })
      showToast('Batch berhasil diverifikasi & diterima', 'success', 3000, 'Sukses')
      await loadLabResults()
      onSuccess?.()
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
      setError('Alasan keputusan/perubahan verifikasi wajib diisi untuk audit trail')
      return
    }

    try {
      setActionLoading('reject')
      await api.patch(`/batches/${batchId}/stakeholder-validation`, {
        status: 'REJECTED_BY_STAKEHOLDER',
        stakeholderNote: note,
      })
      showToast('Batch berhasil ditolak', 'success', 3000, 'Sukses')
      await loadLabResults()
      onSuccess?.()
    } catch (err) {
      console.error('Failed to reject batch:', err)
      setError(err.response?.data?.message || 'Gagal menolak hasil lab')
      showToast('Gagal menolak hasil lab', 'error', 3000, 'Error')
    } finally {
      setActionLoading(null)
    }
  }

  const radarData = useMemo(() => {
    if (!labResult) return []
    const ffaLimit = 2.0
    const moistureLimit = 0.5
    const impurityLimit = 1.0

    return [
      { subject: 'MOISTURE', A: computeRadarScore(labResult.waterContentPercent, moistureLimit) },
      { subject: 'FFA', A: computeRadarScore(labResult.ffaPercent, ffaLimit) },
      { subject: 'IMPURITIES', A: computeRadarScore(labResult.impurityPercent, impurityLimit) },
    ]
  }, [labResult])

  const getStatusDisplay = () => {
    if (!batchData) return null
    const status = batchData.status
    if (status === 'ACCEPTED_BY_STAKEHOLDER') {
      return { label: '✓ DITERIMA (VERIFIED)', color: 'bg-emerald-100 text-emerald-800 border-emerald-300' }
    }
    if (status === 'REJECTED_BY_STAKEHOLDER') {
      return { label: '✕ DITOLAK', color: 'bg-rose-100 text-rose-800 border-rose-300' }
    }
    return { label: '⌛ MENUNGGU VERIFIKASI STAKEHOLDER', color: 'bg-amber-100 text-amber-800 border-amber-300' }
  }

  if (!isOpen) return null

  const isVerified = ['ACCEPTED_BY_STAKEHOLDER', 'REJECTED_BY_STAKEHOLDER'].includes(batchData?.status)

  const modalContent = (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-4xl min-w-0 shadow-2xl animate-fade-slide-up max-h-[90vh] overflow-hidden flex flex-col border border-[#E2E8F0]">
        {/* Header */}
        <div className="sticky top-0 bg-[#051C37] text-white px-6 py-5 flex items-center justify-between gap-4 shrink-0 rounded-t-3xl border-b border-white/10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[#81F9C1] text-xs font-mono font-bold">
                BATCH #{batchData?.batchCode || batch?.batchCode || batchId}
              </span>
              {getStatusDisplay() && (
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${getStatusDisplay().color}`}>
                  {getStatusDisplay().label}
                </span>
              )}
            </div>
            <h2 className="text-xl font-extrabold text-white">Detail Analisis & Verifikasi Hasil Lab</h2>
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
          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-3 border-[#004B3C] border-t-transparent rounded-full animate-spin" />
                <p className="text-sm font-bold text-[#004B3C]">Memuat analisis hasil lab...</p>
              </div>
            </div>
          ) : !labResult ? (
            <div className="p-8 text-center bg-amber-50 rounded-2xl border border-amber-200">
              <span className="text-3xl block mb-2">⌛</span>
              <h3 className="text-base font-bold text-amber-900">Belum Ada Hasil Uji Lab</h3>
              <p className="text-xs text-amber-700 mt-1">
                Batch ini belum diuji oleh Petugas Laboratorium (Lab Technician). Verifikasi hanya dapat dilakukan setelah Petugas Lab menginput data hasil uji mutu.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Main Analysis Section: Metrics Grid + Spectrometry Radar */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column: Metrics & Grade */}
                <div className="space-y-4">
                  <div className="p-4 rounded-2xl bg-[#004B3C] text-white flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block">QUALITY GRADE</span>
                      <span className="text-2xl font-extrabold text-[#81F9C1]">GRADE {labResult.grade}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] font-bold text-white/70 uppercase tracking-wider block">VOLUME BERSIH</span>
                      <span className="text-lg font-bold text-white">{cleanLiterValue} Liter</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase block">FREE FATTY ACID</span>
                      <span className="text-base font-extrabold text-[#004B3C] mt-1 block">{labResult.ffaPercent}%</span>
                      <span className="text-[10px] text-gray-400">A: &lt; 1% | B: 1-2% | C: &gt; 2%</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase block">MOISTURE CONTENT</span>
                      <span className="text-base font-extrabold text-[#004B3C] mt-1 block">{labResult.waterContentPercent}%</span>
                      <span className="text-[10px] text-gray-400">A: &lt; 0.2% | B: 0.2-0.5% | C: &gt; 0.5%</span>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#F8FAFC] border border-[#E2E8F0]">
                      <span className="text-[10px] font-bold text-[#64748B] uppercase block">IMPURITIES</span>
                      <span className="text-base font-extrabold text-[#004B3C] mt-1 block">{labResult.impurityPercent}%</span>
                      <span className="text-[10px] text-gray-400">Standard: &le; 1.0%</span>
                    </div>
                  </div>

                  {labResult.notes && (
                    <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200 text-xs">
                      <span className="font-bold text-amber-800 uppercase block mb-1">💬 Catatan Petugas Uji Lab:</span>
                      <p className="text-gray-700 font-medium">{labResult.notes}</p>
                      {labResult.testedBy?.name && (
                        <p className="text-[10px] text-gray-500 mt-2">Dianalisis oleh: {labResult.testedBy.name}</p>
                      )}
                    </div>
                  )}
                </div>

                {/* Right Column: Spectrometry Radar Chart */}
                <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] flex flex-col justify-center items-center">
                  <span className="text-xs font-bold text-[#64748B] uppercase tracking-wider mb-2">SPECTROMETRY RADAR GRAPH</span>
                  <div className="w-full h-56">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={radarData}>
                        <PolarGrid stroke="#CBD5E1" />
                        <PolarAngleAxis dataKey="subject" stroke="#64748B" tick={{ fontSize: 11, fontWeight: 700 }} />
                        <Radar name="Quality Score" dataKey="A" stroke="#004B3C" fill="#004B3C" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Stakeholder Verification Controls */}
              {isVerified && !isEditMode ? (
                /* VERIFIED READ-ONLY VIEW MODE */
                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-xs font-extrabold uppercase text-[#004B3C]">
                        📝 Status Keputusan Stakeholder
                      </span>
                      <p className="text-xs text-gray-500 mt-0.5">Batch ini telah memiliki keputusan verifikasi resmi.</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setIsEditMode(true)}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-white font-extrabold text-xs hover:bg-amber-600 transition-colors shadow-sm flex items-center gap-1.5"
                    >
                      ✏️ Ubah Status Verifikasi
                    </button>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-[#E2E8F0] text-xs space-y-2">
                    <span className="font-bold text-gray-500 uppercase block">Catatan Keputusan Tercatat:</span>
                    <p className="text-gray-800 font-semibold bg-[#F8FAFC] p-3 rounded-lg border border-[#E2E8F0] leading-relaxed">
                      {note || '— Tidak ada catatan —'}
                    </p>
                  </div>
                </div>
              ) : (
                /* EDIT / INPUT VERIFICATION MODE */
                <div className="p-5 rounded-2xl bg-[#F8FAFC] border border-[#E2E8F0] space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-extrabold uppercase text-[#004B3C]">
                      📝 {isVerified ? 'Alasan Perubahan Status Verifikasi' : 'Catatan Keputusan Stakeholder'}
                    </label>
                    {isVerified && (
                      <button
                        type="button"
                        onClick={() => setIsEditMode(false)}
                        className="text-xs text-gray-500 font-bold hover:underline"
                      >
                        Batal
                      </button>
                    )}
                  </div>

                  <textarea
                    value={note}
                    onChange={(e) => {
                      setNote(e.target.value)
                      if (error) setError('')
                    }}
                    placeholder={isVerified ? 'Wajib masukkan alasan mengapa status verifikasi batch ini diubah (dicatat di Audit Log)...' : 'Tuliskan catatan alasan penerimaan atau penolakan batch ini...'}
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-xl border border-[#E2E8F0] bg-white text-sm outline-none focus:border-[#004B3C] focus:ring-2 focus:ring-[#004B3C]/10 transition-all"
                  />
                  {error && <p className="text-xs font-bold text-red-600">{error}</p>}

                  <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                      onClick={handleReject}
                      disabled={actionLoading === 'reject' || !note.trim()}
                      className="flex-1 py-3 px-4 rounded-xl bg-rose-100 text-rose-800 font-extrabold text-xs hover:bg-rose-200 transition-colors disabled:opacity-50"
                    >
                      {actionLoading === 'reject' ? 'Menolak...' : '❌ Tolak Batch Ini'}
                    </button>
                    <button
                      onClick={handleAccept}
                      disabled={actionLoading === 'accept' || !note.trim()}
                      className="flex-1 py-3 px-4 rounded-xl bg-[#004B3C] text-white font-extrabold text-xs hover:bg-[#00382D] transition-colors disabled:opacity-50 shadow-md"
                    >
                      {actionLoading === 'accept' ? 'Memproses...' : '✅ Verifikasi & Terima Batch'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
