import { useState, useMemo } from 'react'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import GradeBadge from '../../components/stakeholder/GradeBadge'
import EntityAvatar from '../../components/stakeholder/EntityAvatar'
import LabResultsModal from '../../components/modals/LabResultsModal'

const PAGE_SIZE = 10

function FilterDropdown({ label, options, value, onChange }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[rgba(190,201,195,0.30)] bg-white text-[#051C37] text-sm font-bold transition-all duration-200 hover:border-[#004536] hover:shadow-sm whitespace-nowrap"
      >
        <span>{value || label}</span>
        <svg
          width="14" height="14" viewBox="0 0 24 24" fill="none"
          className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        >
          <path d="M7.2 9.6L12 14.4L16.8 9.6" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-1 w-max min-w-full bg-white border border-[rgba(190,201,195,0.30)] rounded-lg shadow-lg z-10 overflow-hidden animate-in fade-in duration-150">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => { onChange(opt); setOpen(false) }}
              className={`w-full text-left px-3 py-2 text-sm transition-colors duration-150 hover:bg-[rgba(0,69,54,0.06)] ${value === opt ? 'text-[#004536] font-bold bg-[rgba(0,69,54,0.04)]' : 'text-[#3F4945]'}`}
            >
              {opt}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function StatusBadge({ status }) {
  const statusMap = {
    SUBMITTED_TO_STAKEHOLDER: { bg: '#FEF3C7', text: '#92400E', label: 'Menunggu Review' },
    LAB_REVIEW: { bg: '#DBEAFE', text: '#1E40AF', label: 'Lab Review' },
    ACCEPTED_BY_STAKEHOLDER: { bg: '#D1FAE5', text: '#065F46', label: 'Diterima' },
    REJECTED_BY_STAKEHOLDER: { bg: '#FEE2E2', text: '#991B1B', label: 'Ditolak' },
  }
  const config = statusMap[status] || { bg: '#F3F4F6', text: '#6B7280', label: status }
  return (
    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: config.bg, color: config.text }}>
      {config.label}
    </span>
  )
}

function TableRow({ row, index }) {
  return (
    <tr
      className="border-t border-[rgba(190,201,195,0.20)] transition-colors duration-150 hover:bg-[rgba(0,69,54,0.03)] group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <td className="px-4 sm:px-6 py-4 text-[#3F4945] text-sm whitespace-nowrap">
        {new Date(row.createdAt).toLocaleDateString('id-ID')}
      </td>
      <td className="px-4 sm:px-6 py-4 text-[#051C37] text-sm font-bold whitespace-nowrap">{row.batchCode}</td>
      <td className="px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2.5">
          <div>
            <p className="text-[#051C37] text-sm font-bold leading-5 group-hover:text-[#004536] transition-colors duration-150">{row.collector?.companyName}</p>
            <p className="text-[#3F4945] text-xs leading-4">{row.totalCleanLiter} L</p>
          </div>
        </div>
      </td>
      <td className="px-4 sm:px-6 py-4 text-[#3F4945] text-sm whitespace-nowrap hidden sm:table-cell">{row.collector?.address}</td>
      <td className="px-4 sm:px-6 py-4">
        <StatusBadge status={row.status} />
      </td>
    </tr>
  )
}

function MobileCard({ row, onAction }) {
  return (
    <div className="p-3 rounded-xl border border-[rgba(190,201,195,0.30)] bg-white/80 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-[#3F4945] text-xs">{new Date(row.createdAt).toLocaleDateString('id-ID')}</p>
          <p className="text-[#051C37] text-xs font-bold">{row.batchCode}</p>
        </div>
        <StatusBadge status={row.status} />
      </div>
      <div className="flex items-center gap-2 mb-1">
        <div>
          <p className="text-[#051C37] text-sm font-bold leading-5">{row.collector?.companyName}</p>
          <p className="text-[#3F4945] text-xs">{row.totalCleanLiter} L</p>
        </div>
      </div>
      <p className="text-[#3F4945] text-xs mt-1">{row.collector?.address}</p>
      {row.status === 'SUBMITTED_TO_STAKEHOLDER' && (
        <button
          onClick={() => onAction(row, 'approve')}
          className="mt-2 w-full px-3 py-1.5 rounded-lg bg-green-600 text-white text-xs font-bold hover:bg-green-700 active:scale-95 transition-all duration-150"
        >
          Approve
        </button>
      )}
    </div>
  )
}

export default function ApplicationTableSection({ batches = [], isLoading = false }) {
  const { showToast } = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua Status')
  const [page, setPage] = useState(1)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [actionLoading, setActionLoading] = useState(null)
  const [labModalOpen, setLabModalOpen] = useState(false)
  const [selectedBatchId, setSelectedBatchId] = useState(null)

  const handleBatchAction = async (batch, action) => {
    try {
      setActionLoading(batch.id)
      if (action === 'approve') {
        await api.patch(`/batches/${batch.id}/stakeholder-validation`, {
          status: 'ACCEPTED_BY_STAKEHOLDER',
          cleanLiter: batch.totalCleanLiter,
        })
        showToast('Batch berhasil disetujui', 'success', 3000, 'Sukses')
        window.location.reload()
      } else if (action === 'review') {
        setSelectedBatchId(batch.id)
        setLabModalOpen(true)
      }
    } catch (error) {
      console.error('Failed to perform action:', error)
      showToast('Gagal memproses batch', 'error', 3000, 'Error')
    } finally {
      setActionLoading(null)
    }
  }

  const filtered = useMemo(() => {
    return (batches || []).filter((r) => {
      const matchSearch = search === '' || r.batchCode.toLowerCase().includes(search.toLowerCase()) || r.collector?.companyName.toLowerCase().includes(search.toLowerCase())
      const matchStatus = statusFilter === 'Semua Status' || r.status === statusFilter
      return matchSearch && matchStatus
    })
  }, [batches, search, statusFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const pageData = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <div className="rounded-2xl border border-white/30 bg-white/70 shadow-[0_4px_12px_0_rgba(11,94,75,0.20)] backdrop-blur-sm overflow-hidden">
      {/* Filters bar */}
      <div className="p-4 sm:p-6 border-b border-[rgba(190,201,195,0.30)] bg-[rgba(240,243,255,0.50)]">
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[120px]">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6F7975]"
              width="14" height="14" viewBox="0 0 15 15" fill="none"
            >
              <path d="M13.8333 15L8.58333 9.75C8.16667 10.0833 7.6875 10.3472 7.14583 10.5417C6.60417 10.7361 6.02778 10.8333 5.41667 10.8333C3.90278 10.8333 2.62153 10.309 1.57292 9.26042C0.524305 8.21181 0 6.93056 0 5.41667C0 3.90278 0.524305 2.62153 1.57292 1.57292C2.62153 0.524305 3.90278 0 5.41667 0C6.93056 0 8.21181 0.524305 9.26042 1.57292C10.309 2.62153 10.8333 3.90278 10.8333 5.41667C10.8333 6.02778 10.7361 6.60417 10.5417 7.14583C10.3472 7.6875 10.0833 8.16667 9.75 8.58333L15 13.8333L13.8333 15ZM5.41667 9.16667C6.45833 9.16667 7.34375 8.80208 8.07292 8.07292C8.80208 7.34375 9.16667 6.45833 9.16667 5.41667C9.16667 4.375 8.80208 3.48958 8.07292 2.76042C7.34375 2.03125 6.45833 1.66667 5.41667 1.66667C4.375 1.66667 3.48958 2.03125 2.76042 2.76042C2.03125 3.48958 1.66667 4.375 1.66667 5.41667C1.66667 6.45833 2.03125 7.34375 2.76042 8.07292C3.48958 8.80208 4.375 9.16667 5.41667 9.16667Z" fill="currentColor" />
            </svg>
            <input
              type="text"
              placeholder="Cari nama atau ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1) }}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-[rgba(190,201,195,0.30)] bg-white text-sm text-[#051C37] placeholder:text-[#6B7280] outline-none focus:border-[#004536] focus:ring-1 focus:ring-[#004536]/20 transition-all duration-200"
            />
          </div>

          <FilterDropdown
            label="Semua Status"
            options={['Semua Status', 'SUBMITTED_TO_STAKEHOLDER', 'LAB_REVIEW', 'ACCEPTED_BY_STAKEHOLDER', 'REJECTED_BY_STAKEHOLDER']}
            value={statusFilter}
            onChange={(v) => { setStatusFilter(v); setPage(1) }}
          />
        </div>

        {/* Advanced filters toggle */}
        <button
          onClick={() => setShowAdvanced((v) => !v)}
          className="flex items-center gap-2 mt-3 text-[#004536] text-sm font-bold transition-all duration-200 hover:opacity-70"
        >
          <svg width="14" height="9" viewBox="0 0 14 9" fill="none">
            <path d="M5.25 9V7.5H8.25V9H5.25ZM2.25 5.25V3.75H11.25V5.25H2.25ZM0 1.5V0H13.5V1.5H0Z" fill="currentColor" />
          </svg>
          Advanced Filters
          <svg
            width="12" height="12" viewBox="0 0 24 24" fill="none"
            className={`transition-transform duration-200 ${showAdvanced ? 'rotate-180' : ''}`}
          >
            <path d="M7.2 9.6L12 14.4L16.8 9.6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>

        {showAdvanced && (
          <div className="mt-3 pt-3 border-t border-[rgba(190,201,195,0.20)] grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 text-xs text-[#3F4945]">
            {['Wilayah', 'Tipe Entitas', 'Tanggal Mulai', 'Tanggal Akhir'].map((f) => (
              <div key={f} className="flex flex-col gap-1">
                <label className="font-semibold text-[#3F4945]">{f}</label>
                <input
                  placeholder={`Filter ${f}`}
                  className="px-2 py-1.5 rounded-md border border-[rgba(190,201,195,0.30)] bg-white text-xs outline-none focus:border-[#004536] transition-colors duration-150"
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[rgba(240,243,255,0.30)]">
              {['Tanggal', 'Batch Code', 'Pengepul', 'Wilayah', 'Status'].map((h) => (
                <th
                  key={h}
                  className="px-4 sm:px-6 py-5 text-left text-[#3F4945] text-sm font-bold leading-6 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-t border-[rgba(190,201,195,0.20)] animate-pulse">
                  <td colSpan={6} className="px-6 py-4">
                    <div className="h-6 bg-[#F5F0F3] rounded" />
                  </td>
                </tr>
              ))
            ) : pageData.length > 0 ? (
              pageData.map((row, i) => (
                <TableRow key={row.id} row={row} index={i} onAction={handleBatchAction} />
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-[#8E8994] text-sm">
                  Tidak ada batch yang sesuai.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden flex flex-col gap-2 p-3">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-3 rounded-xl border border-[rgba(190,201,195,0.30)] bg-white/80 animate-pulse">
              <div className="h-20 bg-[#F5F0F3] rounded" />
            </div>
          ))
        ) : pageData.length > 0 ? (
          pageData.map((row) => (
            <MobileCard key={row.id} row={row} onAction={handleBatchAction} />
          ))
        ) : (
          <p className="text-center text-[#8E8994] text-sm py-8">Tidak ada batch yang sesuai.</p>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-4 border-t border-[rgba(190,201,195,0.30)] bg-[rgba(240,243,255,0.30)]">
        <p className="text-[#3F4945] text-xs sm:text-sm">
          Menampilkan {filtered.length > 0 ? (page - 1) * PAGE_SIZE + 1 : 0} - {Math.min(page * PAGE_SIZE, filtered.length)} dari {filtered.length} Batch
        </p>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-[rgba(190,201,195,0.30)] text-[#051C37] transition-all duration-200 hover:bg-[rgba(0,69,54,0.06)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
              <path d="M5 10L0 5L5 0L6.16667 1.16667L2.33333 5L6.16667 8.83333L5 10Z" fill="currentColor" />
            </svg>
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={[
                'flex items-center justify-center w-9 h-9 rounded-lg text-sm font-bold transition-all duration-200',
                page === p
                  ? 'bg-[#004536] text-white shadow-md scale-105'
                  : 'border border-[rgba(190,201,195,0.30)] text-[#051C37] hover:bg-[rgba(0,69,54,0.06)]',
              ].join(' ')}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="flex items-center justify-center w-9 h-9 rounded-lg border border-[rgba(190,201,195,0.30)] text-[#051C37] transition-all duration-200 hover:bg-[rgba(0,69,54,0.06)] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <svg width="7" height="10" viewBox="0 0 7 10" fill="none">
              <path d="M3.83333 5L0 1.16667L1.16667 0L6.16667 5L1.16667 10L0 8.83333L3.83333 5Z" fill="currentColor" />
            </svg>
          </button>
        </div>
      </div>

      <LabResultsModal
        isOpen={labModalOpen}
        batchId={selectedBatchId}
        onClose={() => setLabModalOpen(false)}
      />
    </div>
  )
}
