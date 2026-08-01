import { useState, useEffect } from 'react'
import api from '../../../services/api'
import SubmissionDetailModal from '../../../components/modals/SubmissionDetailModal'

const FilterIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M4.09534 9.33333C3.93007 9.33333 3.79152 9.27743 3.67972 9.16562C3.56791 9.05382 3.51201 8.91528 3.51201 8.75V5.25L0.128676 0.933333C-0.0171569 0.738889 -0.0390319 0.534722 0.0630515 0.320833C0.165135 0.106944 0.342565 0 0.595343 0H8.76201C9.01479 0 9.19222 0.106944 9.2943 0.320833C9.39638 0.534722 9.37451 0.738889 9.22868 0.933333L5.84534 5.25V8.75C5.84534 8.91528 5.78944 9.05382 5.67763 9.16562C5.56583 9.27743 5.42729 9.33333 5.26201 9.33333H4.09534ZM4.67868 4.84167L7.56618 1.16667H1.79118L4.67868 4.84167Z" fill="#3F4945" />
  </svg>
)

const DownloadIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M4.66667 7L1.75 4.08333L2.56667 3.2375L4.08333 4.75417V0H5.25V4.75417L6.76667 3.2375L7.58333 4.08333L4.66667 7ZM1.16667 9.33333C0.845833 9.33333 0.571181 9.2191 0.342708 8.99063C0.114236 8.76215 0 8.4875 0 8.16667V6.41667H1.16667V8.16667H8.16667V6.41667H9.33333V8.16667C9.33333 8.4875 9.2191 8.76215 8.99063 8.99063C8.76215 9.2191 8.4875 9.33333 8.16667 9.33333H1.16667Z" fill="#3F4945" />
  </svg>
)

const EyeIcon = () => (
  <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
    <path d="M8.25 9C9.1875 9 9.98438 8.67188 10.6406 8.01562C11.2969 7.35938 11.625 6.5625 11.625 5.625C11.625 4.6875 11.2969 3.89062 10.6406 3.23438C9.98438 2.57812 9.1875 2.25 8.25 2.25C7.3125 2.25 6.51562 2.57812 5.85938 3.23438C5.20312 3.89062 4.875 4.6875 4.875 5.625C4.875 6.5625 5.20312 7.35938 5.85938 8.01562C6.51562 8.67188 7.3125 9 8.25 9ZM8.25 7.65C7.6875 7.65 7.20938 7.45312 6.81563 7.05937C6.42188 6.66562 6.225 6.1875 6.225 5.625C6.225 5.0625 6.42188 4.58438 6.81563 4.19063C7.20938 3.79688 7.6875 3.6 8.25 3.6C8.8125 3.6 9.29062 3.79688 9.68437 4.19063C10.0781 4.58438 10.275 5.0625 10.275 5.625C10.275 6.1875 10.0781 6.66562 9.68437 7.05937C9.29062 7.45312 8.8125 7.65 8.25 7.65ZM8.25 11.25C6.425 11.25 4.7625 10.7406 3.2625 9.72188C1.7625 8.70312 0.675 7.3375 0 5.625C0.675 3.9125 1.7625 2.54688 3.2625 1.52813C4.7625 0.509375 6.425 0 8.25 0C10.075 0 11.7375 0.509375 13.2375 1.52813C14.7375 2.54688 15.825 3.9125 16.5 5.625C15.825 7.3375 14.7375 8.70312 13.2375 9.72188C11.7375 10.7406 10.075 11.25 8.25 11.25ZM8.25 9.75C9.6625 9.75 10.9594 9.37812 12.1406 8.63437C13.3219 7.89062 14.225 6.8875 14.85 5.625C14.225 4.3625 13.3219 3.35938 12.1406 2.61562C10.9594 1.87187 9.6625 1.5 8.25 1.5C6.8375 1.5 5.54063 1.87187 4.35938 2.61562C3.17812 3.35938 2.275 4.3625 1.65 5.625C2.275 6.8875 3.17812 7.89062 4.35938 8.63437C5.54063 9.37812 6.8375 9.75 8.25 9.75Z" fill="#004536" />
  </svg>
)

const ChevronLeftIcon = () => (
  <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
    <path d="M6 12L0 6L6 0L7.4 1.4L2.8 6L7.4 10.6L6 12Z" fill="#004536" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
    <path d="M4.6 6L0 1.4L1.4 0L7.4 6L1.4 12L0 10.6L4.6 6Z" fill="#004536" />
  </svg>
)

const STATUS_OPTIONS = [
  { value: '', label: 'Semua Status' },
  { value: 'SUBMITTED', label: 'Menunggu' },
  { value: 'ACCEPTED_BY_COLLECTOR', label: 'Diterima Pengepul' },
  { value: 'REJECTED_BY_COLLECTOR', label: 'Ditolak Pengepul' },
  { value: 'IN_BATCH', label: 'Dalam Batch' },
  { value: 'COMPLETED', label: 'Selesai' },
]

function getStatusBadge(status) {
  const statusMap = {
    SUBMITTED: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu' },
    ACCEPTED_BY_COLLECTOR: { bg: 'bg-green-100', text: 'text-green-800', label: 'Diterima Pengepul' },
    REJECTED_BY_COLLECTOR: { bg: 'bg-red-100', text: 'text-red-800', label: 'Ditolak Pengepul' },
    IN_BATCH: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Dalam Batch' },
    COMPLETED: { bg: 'bg-green-100', text: 'text-green-800', label: 'Selesai' },
  }
  return statusMap[status] || { bg: 'bg-gray-100', text: 'text-gray-800', label: status }
}

export default function SubmissionHistoryTable() {
  const [submissions, setSubmissions] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null)
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false)

  const itemsPerPage = 10
  const filteredSubmissions = submissions.filter(
    s => !selectedStatus || s.status === selectedStatus
  )
  const totalPages = Math.ceil(filteredSubmissions.length / itemsPerPage)
  const paginatedSubmissions = filteredSubmissions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  useEffect(() => {
    loadSubmissions()
  }, [])

  const loadSubmissions = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/submissions')
      setSubmissions(response.data.submissions || [])
      setCurrentPage(1)
    } catch (error) {
      console.error('Failed to load submissions:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleExportPDF = () => {
    // Create a simple PDF using browser print functionality
    const printWindow = window.open('', '_blank')
    const content = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Laporan Setoran Minyak Jelantah</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #004536; margin-bottom: 20px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; }
            th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
            th { background-color: #004536; color: white; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .footer { margin-top: 30px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <h1>Laporan Riwayat Setoran Minyak Jelantah</h1>
          <p>Tanggal Export: ${new Date().toLocaleDateString('id-ID')}</p>
          <table>
            <thead>
              <tr>
                <th>Tanggal</th>
                <th>ID Setoran</th>
                <th>Pengepul</th>
                <th>Volume</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              ${filteredSubmissions.map(s => `
                <tr>
                  <td>${new Date(s.createdAt).toLocaleDateString('id-ID')}</td>
                  <td>${s.id.substring(0, 12)}</td>
                  <td>${s.collector.companyName}</td>
                  <td>${s.estimatedLiter} L</td>
                  <td>${getStatusBadge(s.status).label}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <div class="footer">
            <p>Total Setoran: ${filteredSubmissions.length}</p>
            <p>Total Volume: ${filteredSubmissions.reduce((acc, s) => acc + s.estimatedLiter, 0)} L</p>
          </div>
        </body>
      </html>
    `
    printWindow.document.write(content)
    printWindow.document.close()
    setTimeout(() => printWindow.print(), 250)
  }

  const handleViewDetail = (id) => {
    setSelectedSubmissionId(id)
    setIsDetailModalOpen(true)
  }

  return (
    <>
      <div className="rounded-2xl border border-[#C9A96E] bg-white/70 backdrop-blur-[10px]
        shadow-[0_10px_30px_-10px_rgba(11,94,75,0.10)] overflow-hidden">

        <div className="flex items-center justify-between px-5 sm:px-8 py-5
          border-b border-[#BEC9C3]/20">
          <h3 className="text-[#004536] text-lg sm:text-xl font-bold">Riwayat Setoran</h3>
          <div className="flex items-center gap-1 flex-wrap">
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value)
                setCurrentPage(1)
              }}
              className="px-3 sm:px-4 py-2 rounded-lg text-[#3F4945] text-xs sm:text-sm font-semibold
                bg-[#F0F3FF] border border-[#BEC9C3]/20 outline-none
                hover:bg-[#E7EEFF] active:bg-[#D5E3FF] transition-colors cursor-pointer"
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <button
              onClick={handleExportPDF}
              className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg
                text-[#3F4945] text-xs sm:text-sm font-semibold
                hover:bg-[#004536]/5 active:bg-[#004536]/10 transition-colors duration-150"
            >
              <DownloadIcon />
              <span className="hidden xs:inline">Ekspor PDF</span>
            </button>
          </div>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F0F3FF]">
                {['Tanggal', 'ID Setoran', 'Pengepul', 'Volume', 'Status', 'Aksi'].map((h, i) => (
                  <th
                    key={h}
                    className={`text-[#004536] text-[11px] font-bold uppercase tracking-[1.2px]
                      px-6 lg:px-8 py-4 whitespace-nowrap
                      ${i === 5 ? 'text-right' : 'text-left'}`}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#006C49] border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-[#3F4945]">Memuat data...</span>
                    </div>
                  </td>
                </tr>
              ) : paginatedSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="6" className="px-6 py-8 text-center text-[#3F4945]">
                    Tidak ada data setoran
                  </td>
                </tr>
              ) : (
                paginatedSubmissions.map((sub, i) => (
                  <tr
                    key={sub.id}
                    className="border-t border-[#BEC9C3]/10 hover:bg-[#004536]/[0.02]
                      transition-colors duration-150 group animate-fade-in"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <td className="px-6 lg:px-8 py-5 text-[#051C37] text-sm leading-5 whitespace-nowrap">
                      {new Date(sub.createdAt).toLocaleDateString('id-ID')}
                    </td>
                    <td className="px-6 lg:px-8 py-5 text-[#3F4945] text-sm font-mono leading-5 whitespace-nowrap">
                      {sub.id.substring(0, 12)}...
                    </td>
                    <td className="px-6 lg:px-8 py-5">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-lg bg-[#A8F1D8] flex items-center justify-center shrink-0 text-[#004536] font-bold text-xs">
                          {sub.collector.companyName.charAt(0)}
                        </div>
                        <span className="text-sm text-black">{sub.collector.companyName}</span>
                      </div>
                    </td>
                    <td className="px-6 lg:px-8 py-5 text-[#004536] text-sm font-bold leading-5 whitespace-nowrap">
                      {sub.estimatedLiter} L
                    </td>
                    <td className="px-6 lg:px-8 py-5 whitespace-nowrap">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full
                        text-[11px] font-bold leading-5 ${getStatusBadge(sub.status).bg} ${getStatusBadge(sub.status).text}`}>
                        <span className="w-1.5 h-1.5 rounded-full block shrink-0" style={{
                          backgroundColor: getStatusBadge(sub.status).text
                        }} />
                        {getStatusBadge(sub.status).label}
                      </span>
                    </td>
                    <td className="px-6 lg:px-8 py-5 text-right">
                      <button
                        onClick={() => handleViewDetail(sub.id)}
                        className="inline-flex items-center justify-center w-8 h-8 rounded-full
                          hover:bg-[#004536]/10 active:bg-[#004536]/20
                          transition-all duration-150 group-hover:scale-110"
                      >
                        <EyeIcon />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile card list */}
        <div className="sm:hidden flex flex-col divide-y divide-[#BEC9C3]/15">
          {isLoading ? (
            <div className="px-4 py-8 flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-[#006C49] border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-[#3F4945]">Memuat data...</span>
            </div>
          ) : paginatedSubmissions.length === 0 ? (
            <div className="px-4 py-8 text-center text-[#3F4945]">
              Tidak ada data setoran
            </div>
          ) : (
            paginatedSubmissions.map((sub, i) => (
              <div
                key={sub.id}
                className="px-4 py-4 flex flex-col gap-2.5 hover:bg-[#004536]/[0.02]
                  transition-colors duration-150 animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[#3F4945] text-[11px] font-mono">{sub.id.substring(0, 12)}...</span>
                  <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full
                    text-[10px] font-bold whitespace-nowrap ${getStatusBadge(sub.status).bg} ${getStatusBadge(sub.status).text}`}>
                    {getStatusBadge(sub.status).label}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-6 h-6 rounded-lg bg-[#A8F1D8] flex items-center justify-center shrink-0 text-[#004536] font-bold text-xs">
                      {sub.collector.companyName.charAt(0)}
                    </div>
                    <span className="text-sm text-black font-medium truncate">{sub.collector.companyName}</span>
                  </div>
                  <span className="text-[#004536] text-sm font-bold shrink-0">{sub.estimatedLiter} L</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#3F4945] text-xs">
                    {new Date(sub.createdAt).toLocaleDateString('id-ID')}
                  </span>
                  <button
                    onClick={() => handleViewDetail(sub.id)}
                    className="inline-flex items-center justify-center w-8 h-8 rounded-full
                      hover:bg-[#004536]/10 transition-all duration-150"
                  >
                    <EyeIcon />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        {!isLoading && paginatedSubmissions.length > 0 && (
          <div className="flex flex-wrap items-center justify-between gap-3
            px-5 sm:px-8 py-5 border-t border-[#BEC9C3]/10 bg-white">
            <span className="text-[#3F4945] text-xs sm:text-sm font-medium">
              Menampilkan {paginatedSubmissions.length} dari {filteredSubmissions.length} setoran
            </span>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-full hover:bg-[#004536]/10 disabled:opacity-30
                  transition-all duration-150 active:scale-90"
              >
                <ChevronLeftIcon />
              </button>
              <div className="flex items-center gap-1.5">
                {Array.from({ length: Math.min(totalPages, 3) }).map((_, i) => {
                  const pageNum = i + 1
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-8 h-8 rounded-xl text-xs font-bold transition-all duration-200
                        ${currentPage === pageNum
                          ? 'bg-[#004536] text-white shadow-sm scale-105'
                          : 'text-[#3F4945] hover:bg-[#004536]/10 active:scale-90'
                        }`}
                    >
                      {pageNum}
                    </button>
                  )
                })}
              </div>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-full hover:bg-[#004536]/10 disabled:opacity-30
                  transition-all duration-150 active:scale-90"
              >
                <ChevronRightIcon />
              </button>
            </div>
          </div>
        )}
      </div>

      <SubmissionDetailModal
        isOpen={isDetailModalOpen}
        submissionId={selectedSubmissionId}
        onClose={() => {
          setIsDetailModalOpen(false)
          setSelectedSubmissionId(null)
        }}
      />
    </>
  )
}
