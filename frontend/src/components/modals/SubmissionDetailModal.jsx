import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import api from '../../services/api'

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12L19 6.41Z" fill="currentColor" />
  </svg>
)

const LocationIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20ZM12.5 7H11V13L16.2 16.2L17 15.3L12.5 12.4V7Z" fill="#004536" />
  </svg>
)

const PhoneIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M6.62 10.79C9.06 15.4 12.6 18.94 17.21 21.38L20.9 17.69C21.27 17.32 21.81 17.2 22.31 17.4C23.92 18.1 25.64 18.5 27.5 18.5C28.33 18.5 29 19.17 29 20V27.5C29 28.33 28.33 29 27.5 29C13.12 29 2 17.88 2 3.5C2 2.67 2.67 2 3.5 2H11C11.83 2 12.5 2.67 12.5 3.5C12.5 5.36 12.9 7.08 13.6 8.69C13.8 9.19 13.68 9.73 13.31 10.1L9.62 13.79C15.24 18.4 18.6 21.76 23.21 27.38L26.9 23.69C27.27 23.32 27.81 23.2 28.31 23.4C29.92 24.1 31.64 24.5 33.5 24.5C34.33 24.5 35 25.17 35 26V33.5C35 34.33 34.33 35 33.5 35C19.12 35 8 23.88 8 9.5C8 8.67 8.67 8 9.5 8H17C17.83 8 18.5 8.67 18.5 9.5C18.5 11.36 18.9 13.08 19.6 14.69C19.8 15.19 19.68 15.73 19.31 16.1L15.62 19.79C21.24 25.4 24.6 28.76 29.21 34.38L32.9 30.69C33.27 30.32 33.81 30.2 34.31 30.4C35.92 31.1 37.64 31.5 39.5 31.5C40.33 31.5 41 32.17 41 33V40.5C41 41.33 40.33 42 39.5 42C25.12 42 14 30.88 14 16.5C14 15.67 14.67 15 15.5 15H23C23.83 15 24.5 15.67 24.5 16.5C24.5 18.36 24.9 20.08 25.6 21.69C25.8 22.19 25.68 22.73 25.31 23.1L21.62 26.79C27.24 32.4 30.6 35.76 35.21 41.38L38.9 37.69C39.27 37.32 39.81 37.2 40.31 37.4C41.92 38.1 43.64 38.5 45.5 38.5C46.33 38.5 47 39.17 47 40V47.5C47 48.33 46.33 49 45.5 49C31.12 49 20 37.88 20 23.5C20 22.67 20.67 22 21.5 22H29C29.83 22 30.5 22.67 30.5 23.5C30.5 25.36 30.9 27.08 31.6 28.69C31.8 29.19 31.68 29.73 31.31 30.1L27.62 33.79C33.24 39.4 36.6 42.76 41.21 48.38" fill="#004536" />
  </svg>
)

const getStatusBadge = (status) => {
  const statusMap = {
    SUBMITTED: { bg: '#FEF3C7', text: '#92400E', label: 'Menunggu' },
    ACCEPTED_BY_COLLECTOR: { bg: '#D1FAE5', text: '#065F46', label: 'Diterima Pengepul' },
    REJECTED_BY_COLLECTOR: { bg: '#FEE2E2', text: '#991B1B', label: 'Ditolak Pengepul' },
    IN_BATCH: { bg: '#DBEAFE', text: '#1E40AF', label: 'Dalam Batch' },
    COMPLETED: { bg: '#D1FAE5', text: '#065F46', label: 'Selesai' },
  }
  return statusMap[status] || { bg: '#F3F4F6', text: '#6B7280', label: status }
}

export default function SubmissionDetailModal({ isOpen, submissionId, onClose }) {
  const [submission, setSubmission] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && submissionId) {
      loadSubmissionDetail()
    }
  }, [isOpen, submissionId])

  const loadSubmissionDetail = async () => {
    try {
      setIsLoading(true)
      setError('')
      const response = await api.get(`/submissions/${submissionId}`)
      setSubmission(response.data.submission)
    } catch (err) {
      console.error('Failed to load submission detail:', err)
      setError('Gagal memuat detail setoran')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  const modalContent = (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl w-full max-w-xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.35)] animate-fade-slide-up max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-[#004536] to-[#006C49] px-6 sm:px-8 py-5 flex items-center justify-between shrink-0 rounded-t-3xl">
          <h2 className="text-lg sm:text-xl font-bold text-white">Detail Setoran</h2>
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
                <p className="text-sm text-[#3F4945]">Memuat detail...</p>
              </div>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-red-50 text-red-700 text-sm border border-red-200">
              {error}
            </div>
          ) : submission ? (
            <div className="space-y-5">
              {/* Status Badge */}
              <div className="flex items-center justify-between pb-4 border-b border-[#BEC9C3]/20">
                <span className="text-[#3F4945] font-semibold text-sm">Status Setoran</span>
                <span
                  className={`px-4 py-2 rounded-full text-xs font-bold`}
                  style={{
                    backgroundColor: getStatusBadge(submission.status).bg,
                    color: getStatusBadge(submission.status).text,
                  }}
                >
                  {getStatusBadge(submission.status).label}
                </span>
              </div>

              {/* Submission Info */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-4 border-b border-[#BEC9C3]/20">
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#3F4945] tracking-wide mb-2">ID</p>
                  <p className="text-xs font-mono text-[#051C37]">{submission.id.substring(0, 12)}</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#3F4945] tracking-wide mb-2">Estimasi</p>
                  <p className="text-sm font-bold text-[#004536]">{submission.estimatedLiter} L</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase text-[#3F4945] tracking-wide mb-2">Tanggal</p>
                  <p className="text-xs text-[#051C37]">
                    {new Date(submission.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                    })}
                  </p>
                </div>
                {submission.actualLiter && (
                  <div>
                    <p className="text-[10px] font-bold uppercase text-[#3F4945] tracking-wide mb-2">Aktual</p>
                    <p className="text-sm font-bold text-[#006C49]">{submission.actualLiter} L</p>
                  </div>
                )}
              </div>

              {/* Community Info */}
              <div className="pb-4 border-b border-[#BEC9C3]/20">
                <h3 className="text-xs font-bold uppercase text-[#3F4945] tracking-wide mb-3">Dari Komunitas</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F0F3FF]/50 border border-[#BEC9C3]/10">
                    <div className="w-9 h-9 rounded-full bg-[#81F9C1] flex items-center justify-center shrink-0">
                      <span className="text-[#004536] font-bold text-xs">
                        {submission.community.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#051C37]">{submission.community.user.name}</p>
                      <p className="text-xs text-[#3F4945] mt-0.5">{submission.community.category}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#3F4945] px-3">
                    <LocationIcon />
                    <span>{submission.community.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#3F4945] px-3">
                    <PhoneIcon />
                    <a href={`tel:${submission.community.user.phone}`} className="hover:text-[#006C49]">
                      {submission.community.user.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Collector Info */}
              <div className="pb-4 border-b border-[#BEC9C3]/20">
                <h3 className="text-xs font-bold uppercase text-[#3F4945] tracking-wide mb-3">Ke Pengepul</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-3 rounded-xl bg-[#F0F3FF]/50 border border-[#BEC9C3]/10">
                    <div className="w-9 h-9 rounded-full bg-[#006C49] flex items-center justify-center shrink-0">
                      <span className="text-white font-bold text-xs">
                        {submission.collector.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-bold text-[#051C37]">{submission.collector.companyName}</p>
                      <p className="text-xs text-[#006C49] font-semibold mt-0.5">
                        Rp {submission.collector.buyPricePerLiter.toLocaleString('id-ID')}/L
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-[#3F4945] px-3">
                    <LocationIcon />
                    <span>{submission.collector.address}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#3F4945] px-3">
                    <PhoneIcon />
                    <a href={`tel:${submission.collector.user.phone}`} className="hover:text-[#006C49]">
                      {submission.collector.user.phone}
                    </a>
                  </div>
                </div>
              </div>

              {/* Payment Info (if completed) */}
              {submission.totalPaid && (
                <div className="pb-4 border-b border-[#BEC9C3]/20">
                  <h3 className="text-xs font-bold uppercase text-[#3F4945] tracking-wide mb-3">Pembayaran</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg bg-[#F0F3FF]/50 border border-[#BEC9C3]/10">
                      <p className="text-[10px] font-bold uppercase text-[#3F4945] mb-1">Harga/L</p>
                      <p className="text-sm font-bold text-[#006C49]">
                        Rp {submission.pricePerLiter?.toLocaleString('id-ID')}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg bg-[#F0F3FF]/50 border border-[#BEC9C3]/10">
                      <p className="text-[10px] font-bold uppercase text-[#3F4945] mb-1">Total</p>
                      <p className="text-sm font-bold text-[#004536]">
                        Rp {submission.totalPaid.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Notes */}
              {submission.collectorNote && (
                <div>
                  <h3 className="text-xs font-bold uppercase text-[#3F4945] tracking-wide mb-2">Catatan</h3>
                  <p className="text-sm text-[#3F4945] bg-[#FEF3C7]/50 p-3 rounded-lg border border-[#E4C285]/30">
                    {submission.collectorNote}
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )

  return createPortal(modalContent, document.body)
}
