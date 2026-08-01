import { useState } from 'react'
import SubmissionDetailModal from '../../../components/modals/SubmissionDetailModal'

const FilterIcon = () => (
  <svg width="9" height="8" viewBox="0 0 9 8" fill="none">
    <path d="M3.5 6V5H5.5V6H3.5ZM1.5 3.5V2.5H7.5V3.5H1.5ZM0 1V0H9V1H0Z" fill="#8E8994" />
  </svg>
)

const SearchIcon = () => (
  <svg width="9" height="9" viewBox="0 0 9 17" fill="none">
    <path d="M8.3 9L5.15 5.85C4.9 6.05 4.6125 6.20833 4.2875 6.325C3.9625 6.44167 3.61667 6.5 3.25 6.5C2.34167 6.5 1.57292 6.18542 0.94375 5.55625C0.314583 4.92708 0 4.15833 0 3.25C0 2.34167 0.314583 1.57292 0.94375 0.94375C1.57292 0.314583 2.34167 0 3.25 0C4.15833 0 4.92708 0.314583 5.55625 0.94375C6.18542 1.57292 6.5 2.34167 6.5 3.25C6.5 3.61667 6.44167 3.9625 6.325 4.2875C6.20833 4.6125 6.05 4.9 5.85 5.15L9 8.3L8.3 9ZM3.25 5.5C3.875 5.5 4.40625 5.28125 4.84375 4.84375C5.28125 4.40625 5.5 3.875 5.5 3.25C5.5 2.625 5.28125 2.09375 4.84375 1.65625C4.40625 1.21875 3.875 1 3.25 1C2.625 1 2.09375 1.21875 1.65625 1.65625C1.21875 2.09375 1 2.625 1 3.25C1 3.875 1.21875 4.40625 1.65625 4.84375C2.09375 5.28125 2.625 5.5 3.25 5.5Z" fill="#8E8994" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
    <path d="M5.4 7.2L0.6 2.4L1.8 1.2L6 5.4L10.2 1.2L11.4 2.4L6.6 7.2L5.4 7.2Z" fill="#6B7280" />
  </svg>
)

const EyeIcon = () => (
  <svg width="22" height="15" viewBox="0 0 22 15" fill="none">
    <path d="M11 12C12.25 12 13.3125 11.5625 14.1875 10.6875C15.0625 9.8125 15.5 8.75 15.5 7.5C15.5 6.25 15.0625 5.1875 14.1875 4.3125C13.3125 3.4375 12.25 3 11 3C9.75 3 8.6875 3.4375 7.8125 4.3125C6.9375 5.1875 6.5 6.25 6.5 7.5C6.5 8.75 6.9375 9.8125 7.8125 10.6875C8.6875 11.5625 9.75 12 11 12ZM11 10.2C10.25 10.2 9.6125 9.9375 9.0875 9.4125C8.5625 8.8875 8.3 8.25 8.3 7.5C8.3 6.75 8.5625 6.1125 9.0875 5.5875C9.6125 5.0625 10.25 4.8 11 4.8C11.75 4.8 12.3875 5.0625 12.9125 5.5875C13.4375 6.1125 13.7 6.75 13.7 7.5C13.7 8.25 13.4375 8.8875 12.9125 9.4125C12.3875 9.9375 11.75 10.2 11 10.2ZM11 15C8.56667 15 6.35 14.3208 4.35 12.9625C2.35 11.6042 0.9 9.78333 0 7.5C0.9 5.21667 2.35 3.39583 4.35 2.0375C6.35 0.679167 8.56667 0 11 0C13.4333 0 15.65 0.679167 17.65 2.0375C19.65 3.39583 21.1 5.21667 22 7.5C21.1 9.78333 19.65 11.6042 17.65 12.9625C15.65 14.3208 13.4333 15 11 15Z" fill="#8E8994" />
  </svg>
)

const PrevIcon = () => (
  <svg width="5" height="7" viewBox="0 0 5 7" fill="none">
    <path d="M3.5 7L0 3.5L3.5 0L4.31667 0.816667L1.63333 3.5L4.31667 6.18333L3.5 7Z" fill="#8E8994" />
  </svg>
)

const NextIcon = () => (
  <svg width="5" height="7" viewBox="0 0 5 7" fill="none">
    <path d="M2.68333 3.5L0 0.816667L0.816667 0L4.31667 3.5L0.816667 7L0 6.18333L2.68333 3.5Z" fill="#8E8994" />
  </svg>
)

const STATUS_OPTIONS = ['Semua Status', 'Menunggu Validasi', 'Tervalidasi', 'Ditolak']

function StatusBadge({ status }) {
  const statusMap = {
    SUBMITTED: { bg: 'bg-[#FFDF93]', text: 'text-[#7A5F00]', label: 'MENUNGGU' },
    ACCEPTED_BY_COLLECTOR: { bg: 'bg-[#FFDF93]', text: 'text-[#7A5F00]', label: 'VALIDASI' },
    VERIFIED: { bg: 'bg-[#F1EBFD]', text: 'text-[#5A4199]', label: 'TERVERIFIKASI' },
    REJECTED: { bg: 'bg-[#FFDAD6]', text: 'text-[#BA1A1A]', label: 'DITOLAK' },
  }

  const config = statusMap[status] || statusMap.SUBMITTED

  return (
    <span className={`inline-flex items-center px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
      ${config.bg} ${config.text} font-poppins`}>
      {config.label}
    </span>
  )
}

function ActionCell({ status, name, submissionId, onViewDetail }) {
  if (status === 'validasi') {
    return (
      <button className="px-4 py-2 rounded-xl bg-[#5A4199] text-white text-sm font-medium font-poppins
        hover:bg-[#4a3489] active:scale-95 transition-all duration-200 shadow-sm">
        Validasi
      </button>
    )
  }
  return (
    <button
      onClick={() => onViewDetail(submissionId)}
      aria-label={`Lihat detail ${name}`}
      className="p-2 rounded-lg hover:bg-[#F1EBFD] active:scale-95 transition-all duration-200"
    >
      <EyeIcon />
    </button>
  )
}

function DepositRow({ row, index, onViewDetail }) {
  return (
    <tr
      className="border-t border-[#E0DBDF] hover:bg-[#FAF9F6] transition-colors duration-150
        animate-fade-in"
      style={{ animationDelay: `${300 + index * 80}ms`, animationFillMode: 'both' }}
    >
      {/* Nama Penyetor */}
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#F1E9FF] flex items-center justify-center shrink-0">
            <span className="text-[#5A4199] text-[10px] font-bold font-poppins">{row.initials}</span>
          </div>
          <div>
            <p className="text-[#1D1B1A] text-sm font-semibold font-poppins">{row.name}</p>
            <p className="text-[#8E8994] text-[11px] font-poppins">ID: {row.id}</p>
          </div>
        </div>
      </td>

      {/* Liter Diajukan */}
      <td className="px-6 py-4">
        <span className="text-[#1D1B1A] text-sm font-poppins">{row.liters}</span>
      </td>

      {/* Endapan % */}
      <td className="px-6 py-4">
        <span className={`text-sm font-poppins ${row.sedimentWarning ? 'text-[#BA1A1A]' : 'text-[#5A5661]'}`}>
          {row.sediment}
        </span>
      </td>

      {/* Liter Bersih */}
      <td className="px-6 py-4">
        <span className="text-[#1D1B1A] text-sm font-bold font-poppins">{row.netLiters}</span>
      </td>

      {/* Status */}
      <td className="px-6 py-4">
        <StatusBadge status={row.status} />
      </td>

      {/* Aksi */}
      <td className="px-6 py-4 text-right">
        <ActionCell status={row.status} name={row.name} submissionId={row.submissionId} onViewDetail={onViewDetail} />
      </td>
    </tr>
  )
}

export default function DepositsTable({ submissions, isLoading }) {
  const [selectedStatus, setSelectedStatus] = useState('Semua Status')
  const [searchQuery, setSearchQuery] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [detailModalOpen, setDetailModalOpen] = useState(false)
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null)

  const handleViewDetail = (submissionId) => {
    setSelectedSubmissionId(submissionId)
    setDetailModalOpen(true)
  }

  const depositRows = (submissions || []).map((sub) => {
    const sedimentPercent = sub.sedimentLiter && sub.actualLiter ? ((sub.sedimentLiter / sub.actualLiter) * 100).toFixed(1) : '0'
    const cleanLiter = (sub.cleanLiter || sub.actualLiter - (sub.sedimentLiter || 0)).toFixed(1)

    return {
      id: sub.id,
      submissionId: sub.id,
      initials: sub.communityName?.split(' ').slice(0, 2).map(w => w[0]).join('') || 'N/A',
      name: sub.communityName || 'Unknown',
      liters: `${sub.actualLiter?.toFixed(1) || 0} L`,
      sediment: `${sedimentPercent}%`,
      sedimentWarning: parseFloat(sedimentPercent) > 2,
      netLiters: `${cleanLiter} L`,
      status: sub.status,
    }
  })

  const totalPages = Math.max(1, Math.ceil(depositRows.length / 10))

  const filteredRows = depositRows.filter((row) => {
    const matchesSearch = row.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus =
      selectedStatus === 'Semua Status' ||
      (selectedStatus === 'Menunggu Validasi' && (row.status === 'SUBMITTED' || row.status === 'ACCEPTED_BY_COLLECTOR')) ||
      (selectedStatus === 'Tervalidasi' && row.status === 'VERIFIED')
    return matchesSearch && matchesStatus
  })

  const pendingCount = depositRows.filter(r => r.status === 'SUBMITTED' || r.status === 'ACCEPTED_BY_COLLECTOR').length

  return (
    <div className="rounded-2xl border border-[#E0DBDF] bg-white overflow-hidden
      collector-card-enter" style={{ animationDelay: '300ms' }}>

      {/* Table header */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5
        border-b border-[#E0DBDF]">
        <div className="flex items-center gap-3">
          <h3 className="text-[#1D1B1A] text-base font-bold font-poppins">Setoran Masuk</h3>
          <span className="px-2 py-0.5 rounded-md bg-[#F5F0F3] text-[#8E8994] text-[10px] font-bold font-poppins">
            {pendingCount} Tertunda
          </span>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Status filter */}
          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none flex items-center gap-2 px-8 py-2 pr-10
                rounded-xl border border-[#E0DBDF] bg-[#FCFAF8] text-[#1D1B1A]
                text-xs font-medium font-poppins outline-none cursor-pointer
                hover:border-[#5A4199]/40 transition-colors duration-200"
            >
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <FilterIcon />
            </div>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronDownIcon />
            </div>
          </div>

          {/* Search */}
          <div className="relative">
            <input
              type="text"
              placeholder="Cari penyetor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-48 pl-8 pr-4 py-2 rounded-xl border border-[#E0DBDF] bg-[#FCFAF8]
                text-[#1D1B1A] text-xs font-poppins outline-none
                focus:border-[#5A4199]/40 focus:shadow-[0_0_0_3px_rgba(90,65,153,0.10)]
                transition-all duration-200 placeholder:text-[#6B7280]"
            />
            <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <SearchIcon />
            </div>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-[#FCFAF8]/50">
              {['NAMA PENYETOR', 'LITER DIAJUKAN', 'ENDAPAN %', 'LITER BERSIH', 'STATUS', 'AKSI'].map((col, i) => (
                <th
                  key={col}
                  className={`px-6 py-4 text-[10px] font-bold tracking-[1px] uppercase text-[#8E8994] font-poppins
                    ${i === 5 ? 'text-right' : 'text-left'}`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-[#E0DBDF] animate-pulse">
                  <td colSpan={6} className="px-6 py-4">
                    <div className="h-6 bg-[#F5F0F3] rounded" />
                  </td>
                </tr>
              ))
            ) : filteredRows.length > 0 ? (
              filteredRows.map((row, index) => (
                <DepositRow key={row.id} row={row} index={index} onViewDetail={handleViewDetail} />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-[#8E8994] text-sm font-poppins">
                  Tidak ada data yang sesuai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-5
        border-t border-[#E0DBDF] bg-[#FCFAF8]/20">
        <span className="text-[#8E8994] text-[10px] font-medium font-poppins">
          Menampilkan {filteredRows.length} dari 42 entri setoran
        </span>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center justify-center w-8 h-8 rounded-xl border border-[#E0DBDF] bg-white
              hover:border-[#5A4199]/40 disabled:opacity-40 disabled:cursor-not-allowed
              active:scale-95 transition-all duration-150"
          >
            <PrevIcon />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`flex items-center justify-center w-8 h-8 rounded-xl text-xs font-bold font-poppins
                transition-all duration-150 active:scale-95
                ${currentPage === page
                  ? 'bg-[#5A4199] text-white shadow-sm'
                  : 'border border-[#E0DBDF] bg-white text-[#8E8994] hover:border-[#5A4199]/40'
                }`}
            >
              {page}
            </button>
          ))}

          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center justify-center w-8 h-8 rounded-xl border border-[#E0DBDF] bg-white
              hover:border-[#5A4199]/40 disabled:opacity-40 disabled:cursor-not-allowed
              active:scale-95 transition-all duration-150"
          >
            <NextIcon />
          </button>
        </div>
      </div>

      {/* Detail Modal */}
      <SubmissionDetailModal
        isOpen={detailModalOpen}
        submissionId={selectedSubmissionId}
        onClose={() => setDetailModalOpen(false)}
      />
    </div>
  )
}
