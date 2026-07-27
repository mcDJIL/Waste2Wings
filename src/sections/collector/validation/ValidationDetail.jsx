import { useState, useEffect } from 'react'

const ChevronDownIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path d="M7.2 9.6L12 14.4L16.8 9.6" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const VerifyIcon = () => (
  <svg width="22" height="21" viewBox="0 0 22 21" fill="none">
    <path d="M7.6 21L5.7 17.8L2.1 17L2.45 13.3L0 10.5L2.45 7.7L2.1 4L5.7 3.2L7.6 0L11 1.45L14.4 0L16.3 3.2L19.9 4L19.55 7.7L22 10.5L19.55 13.3L19.9 17L16.3 17.8L14.4 21L11 19.55L7.6 21ZM9.95 14.05L15.6 8.4L14.2 6.95L9.95 11.2L7.8 9.1L6.4 10.5L9.95 14.05Z" fill="white" />
  </svg>
)

const QUALITY_OPTIONS = ['Premium', 'Standard', 'Rendah', 'Reject']

export default function ValidationDetail({ submission, onVerify, onReject }) {
  const [volumeAktual, setVolumeAktual] = useState(submission?.estimatedLiter?.toString() || '0')
  const [sedimentLiter, setSedimentLiter] = useState('0')
  const [collectorNote, setCollectorNote] = useState('')
  const [qualityOpen, setQualityOpen]   = useState(false)
  const [imageExpanded, setImageExpanded] = useState(false)
  const [verifyLoading, setVerifyLoading] = useState(false)
  const [rejectLoading, setRejectLoading]  = useState(false)

  useEffect(() => {
    setVolumeAktual(submission?.estimatedLiter?.toString() || '0')
    setSedimentLiter('0')
    setCollectorNote('')
  }, [submission?.id])

  const cleanLiter = Math.max(0, parseFloat(volumeAktual || 0) - parseFloat(sedimentLiter || 0))

  const handleVerify = async () => {
    setVerifyLoading(true)
    await onVerify?.({
      actualLiter: parseFloat(volumeAktual),
      sedimentLiter: parseFloat(sedimentLiter),
      collectorNote: collectorNote.trim(),
    })
    setVerifyLoading(false)
  }

  const handleReject = async () => {
    setRejectLoading(true)
    await onReject?.({
      collectorNote: collectorNote.trim(),
    })
    setRejectLoading(false)
  }

  return (
    <div className="relative flex-1 overflow-y-auto">
      {/* Gold-bordered detail card */}
      <div
        className="
          m-6 rounded-2xl
          border-t-[3px] border-l border-r border-b border-[#C9A96E]
          bg-white/70 backdrop-blur-[10px]
          shadow-[0_20px_25px_-5px_rgba(0,0,0,0.10),0_8px_10px_-6px_rgba(0,0,0,0.10)]
          animate-fade-in
          flex flex-col gap-8 p-6 sm:p-8
        "
      >
        {/* ── Header ── */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-[rgba(190,201,195,0.20)]">
          <div className="flex items-center gap-4 sm:gap-5 min-w-0">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#81F9C1] flex items-center justify-center shrink-0
              shadow-[0_0_0_4px_rgba(129,249,193,0.30)] text-white font-bold text-lg">
              {submission?.community?.user?.name?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div className="flex flex-col gap-0.5 min-w-0">
              <span className="text-[#051C37] text-base font-normal leading-6">
                {submission?.community?.user?.name || 'Unknown'}
              </span>
              <div className="flex flex-wrap items-baseline gap-2 sm:gap-5">
                <span className="text-[#3F4945] text-sm sm:text-base font-normal leading-6 whitespace-nowrap">
                  ID Submission:
                </span>
                <span className="text-[#004536] font-bold text-sm sm:text-base leading-6 font-mono break-all">
                  {submission?.id?.substring(0, 12)}...
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col items-end gap-1 shrink-0">
            <span className="text-[#6F7975] text-sm sm:text-base font-normal leading-6 text-right">
              Tanggal Pengajuan
            </span>
            <span className="text-[#051C37] text-sm sm:text-base font-bold leading-6 text-right">
              {new Date(submission?.createdAt).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </span>
          </div>
        </div>

        {/* ── Data comparison ── */}
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
          {/* Data Pengajuan */}
          <div className="flex-1 rounded-xl border border-[rgba(190,201,195,0.20)] bg-[#F0F3FF] p-4 flex flex-col gap-3">
            <span className="text-[#BEC9C3] text-xs font-bold uppercase tracking-[0.6px]">
              DATA PENGAJUAN
            </span>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-start gap-4">
                <span className="text-[#3F4945] text-base font-normal leading-6">Volume Estimasi</span>
                <span className="text-[#051C37] text-base font-bold leading-6 text-right">
                  {submission?.estimatedLiter || 0} Liter
                </span>
              </div>
              <div className="flex justify-between items-start gap-4">
                <span className="text-[#3F4945] text-base font-normal leading-6">Dari Komunitas</span>
                <span className="text-[#051C37] text-base font-bold leading-6 text-right">
                  {submission?.community?.user?.phone || '-'}
                </span>
              </div>
            </div>
          </div>

          {/* Data Verifikasi */}
          <div className="flex-1 rounded-xl border border-[rgba(0,69,54,0.20)] bg-[rgba(0,69,54,0.05)] p-4 flex flex-col gap-4">
            <span className="text-[#004536] text-xs font-bold uppercase tracking-[0.6px]">
              DATA VERIFIKASI
            </span>

            {/* Volume Aktual */}
            <div className="flex flex-col gap-1">
              <label className="text-[#3F4945] text-xs font-bold leading-[18px]">
                Volume Aktual (Liter)
              </label>
              <input
                type="number"
                step="0.1"
                value={volumeAktual}
                onChange={(e) => setVolumeAktual(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#BEC9C3] bg-white
                  text-[#051C37] text-base font-bold leading-6 outline-none
                  focus:border-[#004536] focus:ring-2 focus:ring-[#004536]/10
                  transition-all duration-200"
              />
            </div>

            {/* Sedimen Liter */}
            <div className="flex flex-col gap-1">
              <label className="text-[#3F4945] text-xs font-bold leading-[18px]">
                Sedimen (Liter)
              </label>
              <input
                type="number"
                step="0.1"
                value={sedimentLiter}
                onChange={(e) => setSedimentLiter(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-[#BEC9C3] bg-white
                  text-[#051C37] text-base font-bold leading-6 outline-none
                  focus:border-[#004536] focus:ring-2 focus:ring-[#004536]/10
                  transition-all duration-200"
              />
            </div>

            {/* Collector Note */}
            <div className="flex flex-col gap-1">
              <label className="text-[#3F4945] text-xs font-bold leading-[18px]">
                Catatan (Opsional)
              </label>
              <textarea
                value={collectorNote}
                onChange={(e) => setCollectorNote(e.target.value)}
                placeholder="Tambahkan catatan tentang setoran ini..."
                className="w-full px-3 py-2 rounded-lg border border-[#BEC9C3] bg-white
                  text-[#051C37] text-base font-normal leading-6 outline-none resize-none
                  focus:border-[#004536] focus:ring-2 focus:ring-[#004536]/10
                  transition-all duration-200 min-h-[80px]"
              />
            </div>
          </div>
        </div>

        {/* ── Photo Evidence ── */}
        <div className="flex flex-col gap-3">
          <span className="text-[#3F4945] text-xs font-bold uppercase tracking-[0.6px]">
            BUKTI FOTO SETORAN
          </span>
          <div
            className="relative rounded-2xl overflow-hidden bg-[#DEE8FF] cursor-pointer group"
            style={{ aspectRatio: '188/95' }}
            onClick={() => setImageExpanded(true)}
          >
            <img
              src="https://api.builder.io/api/v1/image/assets/TEMP/0b9d6c493406133ef2f55a882b08aee61049cbb9?width=1082"
              alt="Bukti foto setoran"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center
              opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-12 h-12 rounded-full bg-white/90 flex items-center justify-center
                shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10)]">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M15 3H21V9M21 3L14 10M10 21H4V15M4 21L11 14" stroke="#004536" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* ── Summary & Actions ── */}
        <div className="flex flex-wrap items-center gap-6 p-6 rounded-2xl
          border border-[rgba(190,201,195,0.10)] bg-[rgba(213,227,255,0.30)]">
          {/* Clean volume estimate */}
          <div className="flex flex-col gap-1 flex-1 min-w-[140px]">
            <span className="text-[#3F4945] text-base font-normal leading-6">Volume Bersih</span>
            <div className="flex items-baseline gap-2">
              <span className="text-[#004536] text-base font-extrabold leading-6">
                {cleanLiter.toFixed(2)}
              </span>
              <span className="text-[rgba(0,69,54,0.70)] text-base font-bold leading-6">L</span>
            </div>
            <span className="text-[#6F7975] text-[11px] italic font-normal leading-[16.5px]">
              *{volumeAktual} L - {sedimentLiter} L sedimen
            </span>
          </div>

          <div className="w-px h-16 bg-[rgba(190,201,195,0.30)] hidden sm:block shrink-0" />

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleReject}
              disabled={rejectLoading}
              className="px-4 sm:px-6 py-2.5 rounded-xl border-2 border-[#BA1A1A]
                text-[#BA1A1A] font-bold text-base leading-6
                hover:bg-[#BA1A1A]/5 active:scale-95
                transition-all duration-200 disabled:opacity-60 whitespace-nowrap"
            >
              {rejectLoading ? 'Menolak...' : 'Tolak Setoran'}
            </button>

            <button
              onClick={handleVerify}
              disabled={verifyLoading}
              className="flex items-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl
                bg-gradient-to-r from-[#004536] to-[#006C49] text-white font-bold text-base leading-6
                shadow-[0_10px_15px_-3px_rgba(0,69,54,0.20),0_4px_6px_-4px_rgba(0,69,54,0.20)]
                hover:shadow-[0_16px_24px_-4px_rgba(0,69,54,0.35)]
                hover:-translate-y-0.5 active:translate-y-0 active:scale-95
                transition-all duration-200 disabled:opacity-60 whitespace-nowrap"
            >
              <VerifyIcon />
              {verifyLoading ? 'Menyimpan...' : 'Verifikasi & Simpan'}
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox */}
      {imageExpanded && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4
            animate-fade-in cursor-pointer"
          onClick={() => setImageExpanded(false)}
        >
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/0b9d6c493406133ef2f55a882b08aee61049cbb9?width=1082"
            alt="Bukti foto setoran"
            className="max-w-full max-h-full rounded-2xl object-contain shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          />
          <button
            onClick={() => setImageExpanded(false)}
            className="absolute top-6 right-6 w-10 h-10 rounded-full bg-white/20
              flex items-center justify-center text-white hover:bg-white/30
              transition-colors duration-150"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  )
}
