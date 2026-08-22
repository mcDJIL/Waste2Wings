import { useState, useMemo, useRef } from 'react'
import LabInputModal from '../../../components/modals/LabInputModal'
import LabResultsModal from '../../../components/modals/LabResultsModal'
import QRCodeModal from '../../../components/modals/QRCodeModal'

const PAGE_SIZE = 10
const FILTER_TABS = ['All', 'LAB_REVIEW', 'ACCEPTED_BY_STAKEHOLDER']

function FilterIcon() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
      <path d="M7 12V10H11V12H7ZM3 7V5H15V7H3ZM0 2V0H18V2H0Z" fill="#64748B" />
    </svg>
  )
}

function ChevronIcon({ expanded }) {
  return (
    <svg
      width="8"
      height="12"
      viewBox="0 0 8 12"
      fill="none"
      style={{ transform: expanded ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}
    >
      <path d="M4.6 6L0 1.4L1.4 0L7.4 6L1.4 12L0 10.6L4.6 6Z" fill="#94A3B8" />
    </svg>
  )
}

function BarChartIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path
        d="M4 14H6V9H4V14ZM12 14H14V4H12V14ZM8 14H10V11H8V14ZM8 9H10V7H8V9ZM2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2ZM2 16H16V2H2V16Z"
        fill="#004B3C"
      />
    </svg>
  )
}

function getGradeLabel(batch) {
  if (batch.labResult?.grade === 'A') return 'GRADE A'
  if (batch.labResult?.grade === 'B') return 'GRADE B'
  if (batch.labResult?.grade === 'REJECT') return 'REJECTED'
  return batch.status.replace(/_/g, ' ')
}

function getStatusColor(batch) {
  if (batch.labResult?.grade === 'A') return '#10B981'
  if (batch.labResult?.grade === 'B') return '#F59E0B'
  if (batch.labResult?.grade === 'REJECT') return '#EF4444'
  return '#64748B'
}

function getBatchDecisionBadge(batch) {
  if (batch.status === 'ACCEPTED_BY_STAKEHOLDER') {
    return { label: 'Diterima', icon: '✓', bg: '#ECFDF5', color: '#065F46', border: '#A7F3D0' }
  }
  if (batch.status === 'REJECTED_BY_STAKEHOLDER') {
    return { label: 'Ditolak', icon: '✕', bg: '#FEF2F2', color: '#991B1B', border: '#FECACA' }
  }
  if (batch.status === 'LAB_REVIEW') {
    return { label: 'Uji Lab', icon: '⧗', bg: '#EFF6FF', color: '#1D4ED8', border: '#BFDBFE' }
  }
  return null
}

function DecisionBadge({ batch }) {
  const badge = getBatchDecisionBadge(batch)
  if (!badge) return <span style={{ color: '#94A3B8', fontSize: 12 }}>—</span>
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: 4,
        padding: '3px 10px',
        borderRadius: 8,
        fontSize: 10,
        fontWeight: 700,
        background: badge.bg,
        color: badge.color,
        border: `1px solid ${badge.border}`,
        whiteSpace: 'nowrap',
      }}
    >
      {badge.icon} {badge.label}
    </span>
  )
}

function PaginationBar({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, padding: '12px 16px', borderTop: '1px solid #F1F5F9', background: '#F8FAFC' }}>
      <button
        disabled={page === 1}
        onClick={() => onPage(page - 1)}
        style={{
          width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 8, border: '1px solid #E2E8F0', background: 'white', color: '#64748B',
          fontSize: 16, fontWeight: 700, cursor: page === 1 ? 'not-allowed' : 'pointer', opacity: page === 1 ? 0.4 : 1,
        }}
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPage(p)}
          style={{
            width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
            borderRadius: 8, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s',
            background: p === page ? '#004B3C' : 'white',
            color: p === page ? 'white' : '#64748B',
            border: p === page ? '1px solid #004B3C' : '1px solid #E2E8F0',
          }}
        >
          {p}
        </button>
      ))}
      <button
        disabled={page === totalPages}
        onClick={() => onPage(page + 1)}
        style={{
          width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
          borderRadius: 8, border: '1px solid #E2E8F0', background: 'white', color: '#64748B',
          fontSize: 16, fontWeight: 700, cursor: page === totalPages ? 'not-allowed' : 'pointer', opacity: page === totalPages ? 0.4 : 1,
        }}
      >
        ›
      </button>
    </div>
  )
}

export default function BatchTableSection({ batches = [], selectedBatchId, onSelectBatch, isLoading = false, onRefresh }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [page, setPage] = useState(1)
  const [inputModalOpen, setInputModalOpen] = useState(false)
  const [resultsModalOpen, setResultsModalOpen] = useState(false)
  const [selectedBatchForModal, setSelectedBatchForModal] = useState(null)
  const [qrModalOpen, setQrModalOpen] = useState(false)
  const [qrCodeValue, setQrCodeValue] = useState('')
  const detailRef = useRef(null)

  const handleQrClick = (e, code) => {
    e.stopPropagation()
    setQrCodeValue(code)
    setQrModalOpen(true)
  }

  const handleActionClick = (e, batch) => {
    e.stopPropagation()
    setSelectedBatchForModal(batch)
    if (batch.labResult) {
      setResultsModalOpen(true)
    } else {
      setInputModalOpen(true)
    }
  }

  const handleSuccess = () => {
    setInputModalOpen(false)
    setResultsModalOpen(false)
    onRefresh?.()
  }

  const handleModalClose = () => {
    setInputModalOpen(false)
    setResultsModalOpen(false)
    onRefresh?.()
  }

  const handleRowClick = (batchId) => {
    onSelectBatch(batchId)
    setTimeout(() => {
      detailRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 80)
  }

  const filtered = useMemo(() => {
    return (batches || []).filter((b) => {
      if (activeFilter === 'All') return true
      return b.status === activeFilter
    })
  }, [batches, activeFilter])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)
  const paginated = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

  const handleFilterChange = (tab) => {
    setActiveFilter(tab)
    setPage(1)
  }

  return (
    <>
      <div className="rounded-3xl border border-[#E2E8F0] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] overflow-hidden animate-fade-slide-up">
        {/* Table header */}
        <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 px-6 py-5 border-b border-[#F1F5F9] bg-white">
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-[#004B3C] text-lg font-bold leading-7">Daftar Analisis Batch</span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold leading-[15px]">
              LIVE DATA
            </span>
            {filtered.length > 0 && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold" style={{ background: 'rgba(0,75,60,0.08)', color: '#004B3C' }}>
                {filtered.length} batch
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-stretch rounded-xl border border-[#E2E8F0] overflow-hidden">
              {FILTER_TABS.map((tab, i) => (
                <button
                  key={tab}
                  onClick={() => handleFilterChange(tab)}
                  className={[
                    'px-4 py-2.5 text-sm font-medium leading-5 transition-colors duration-200',
                    i < FILTER_TABS.length - 1 ? 'border-r border-[#E2E8F0]' : '',
                    activeFilter === tab
                      ? 'bg-[#F8FAFC] text-[#1E293B] font-bold'
                      : 'bg-white text-[#64748B] hover:bg-[#F8FAFC]',
                  ].join(' ')}
                >
                  {tab}
                </button>
              ))}
            </div>
            <button className="flex items-center justify-center p-2.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors duration-200">
              <FilterIcon />
            </button>
          </div>
        </div>

        {/* Table – desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full min-w-[700px]">
            <thead>
              <tr className="bg-[rgba(248,250,252,0.50)]">
                {['ID BATCH', 'TGL PROSES', 'SUMBER PENGEPUL', 'QUALITY GRADE', 'STATUS', 'MOISTURE %', 'FFA %', 'ACTIONS'].map(
                  (col, i) => (
                    <th
                      key={col}
                      className={[
                        'px-6 py-4 text-[#94A3B8] text-[11px] font-bold leading-[16.5px] tracking-[1.1px] uppercase whitespace-nowrap',
                        i === 7 ? 'text-right' : 'text-left',
                      ].join(' ')}
                    >
                      {col}
                    </th>
                  )
                )}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="border-t border-[#F1F5F9] animate-pulse">
                    <td colSpan={8} className="px-6 py-5">
                      <div className="h-5 bg-[#F1F5F9] rounded" />
                    </td>
                  </tr>
                ))
              ) : paginated.length > 0 ? (
                paginated.map((batch, idx) => {
                  const isSelected = selectedBatchId === batch.id
                  const hasLabResult = batch.labResult !== null
                  const moisture = batch.labResult?.waterContentPercent ?? 0
                  const ffa = batch.labResult?.ffaPercent ?? 0
                  const ffaAlert = ffa > 3.5

                  return (
                    <tr
                      key={batch.id}
                      onClick={() => handleRowClick(batch.id)}
                      className={[
                        'border-t border-[#F1F5F9] transition-colors duration-200 cursor-pointer group',
                        isSelected ? 'bg-[rgba(0,75,60,0.04)]' : 'hover:bg-[#F8FAFC]',
                      ].join(' ')}
                      style={isSelected ? { boxShadow: 'inset 3px 0 0 #004B3C' } : {}}
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: getStatusColor(batch) }} />
                          <span className="text-[#1E293B] text-sm font-bold leading-5">{batch.batchCode}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-[#475569] text-sm font-medium">
                        {new Date(batch.createdAt).toLocaleDateString('id-ID')}
                      </td>
                      <td className="px-6 py-5 text-[#475569] text-sm font-medium">{batch.collector?.companyName}</td>
                      <td className="px-6 py-5">
                        {hasLabResult ? (
                          <span
                            className="inline-flex items-center px-3 py-1 rounded-full text-[9px] font-extrabold whitespace-nowrap"
                            style={{
                              background: batch.labResult?.grade === 'A' ? '#004B3C' : batch.labResult?.grade === 'B' ? '#F59E0B' : '#EF4444',
                              color: 'white',
                            }}
                          >
                            {getGradeLabel(batch)}
                          </span>
                        ) : (
                          <span className="text-[#94A3B8] text-xs">No result</span>
                        )}
                      </td>
                      <td className="px-6 py-5">
                        <DecisionBadge batch={batch} />
                      </td>
                      <td className="px-6 py-5 text-[#1E293B] text-sm font-bold">
                        {hasLabResult ? `${moisture.toFixed(2)}%` : '-'}
                      </td>
                      <td className="px-6 py-5">
                        <span className={['text-sm font-extrabold', ffaAlert && hasLabResult ? 'text-[#EF4444]' : 'text-[#1E293B]'].join(' ')}>
                          {hasLabResult ? `${ffa.toFixed(2)}%` : '-'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={(e) => handleQrClick(e, batch.batchCode)}
                            className="inline-flex items-center justify-center p-2 rounded-xl border border-[#E2E8F0] hover:bg-[#004B3C]/10 text-[#004B3C] text-xs font-bold transition-all duration-200"
                            title="Tampilkan QR Code Traceability"
                          >
                            📱 QR
                          </button>
                          <button
                            onClick={(e) => handleActionClick(e, batch)}
                            className="inline-flex items-center justify-center p-2 rounded-xl hover:bg-[#F1F5F9] transition-all duration-200 hover:scale-110 active:scale-95"
                            title={hasLabResult ? 'Lihat Detail' : 'Input Hasil Lab'}
                          >
                            {!hasLabResult ? <BarChartIcon /> : <ChevronIcon expanded={isSelected} />}
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-10 text-center text-[#94A3B8] text-sm">
                    Tidak ada batch yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Card list – mobile */}
        <div className="md:hidden flex flex-col divide-y divide-[#F1F5F9]">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="p-4 animate-pulse">
                <div className="h-20 bg-[#F1F5F9] rounded" />
              </div>
            ))
          ) : paginated.length > 0 ? (
            paginated.map((batch, idx) => {
              const isSelected = selectedBatchId === batch.id
              const hasLabResult = batch.labResult !== null
              const moisture = batch.labResult?.waterContentPercent ?? 0
              const ffa = batch.labResult?.ffaPercent ?? 0
              const ffaAlert = ffa > 3.5

              return (
                <div
                  key={batch.id}
                  onClick={() => handleRowClick(batch.id)}
                  className={['flex flex-col gap-3 p-4 cursor-pointer transition-colors duration-200', isSelected ? 'bg-[rgba(0,75,60,0.04)]' : 'hover:bg-[#F8FAFC]'].join(' ')}
                  style={isSelected ? { boxShadow: 'inset 3px 0 0 #004B3C' } : {}}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: getStatusColor(batch) }} />
                      <span className="text-[#1E293B] text-sm font-bold truncate">{batch.batchCode}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-shrink-0 flex-wrap justify-end">
                      <DecisionBadge batch={batch} />
                      {hasLabResult && (
                        <span
                          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold whitespace-nowrap"
                          style={{
                            background: batch.labResult?.grade === 'A' ? '#004B3C' : batch.labResult?.grade === 'B' ? '#F59E0B' : '#EF4444',
                            color: 'white',
                          }}
                        >
                          {getGradeLabel(batch)}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-[#475569]">
                    <span>{new Date(batch.createdAt).toLocaleDateString('id-ID')}</span>
                    <span>{batch.collector?.companyName}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div>
                      <span className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[1px]">Moisture</span>
                      <p className="text-[#1E293B] text-sm font-bold">{hasLabResult ? `${moisture.toFixed(2)}%` : '-'}</p>
                    </div>
                    <div>
                      <span className="text-[#94A3B8] text-[10px] font-bold uppercase tracking-[1px]">FFA</span>
                      <p className={['text-sm font-extrabold', ffaAlert && hasLabResult ? 'text-[#EF4444]' : 'text-[#1E293B]'].join(' ')}>
                        {hasLabResult ? `${ffa.toFixed(2)}%` : '-'}
                      </p>
                    </div>
                    <button
                      className="ml-auto flex items-center justify-center p-2 rounded-xl border border-[#E2E8F0] hover:bg-[#F1F5F9] transition-all duration-200"
                      onClick={(e) => handleActionClick(e, batch)}
                    >
                      {!hasLabResult ? <BarChartIcon /> : <ChevronIcon expanded={isSelected} />}
                    </button>
                  </div>
                </div>
              )
            })
          ) : (
            <div className="p-4 text-center text-[#94A3B8] text-sm">Tidak ada batch yang sesuai.</div>
          )}
        </div>

        {/* Pagination bar */}
        <PaginationBar page={safePage} totalPages={totalPages} onPage={setPage} />
      </div>

      {/* Scroll anchor – sits just before the detail section */}
      <div ref={detailRef} />

      {/* Modals */}
      <LabInputModal
        isOpen={inputModalOpen}
        batchId={selectedBatchForModal?.id}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />
      <LabResultsModal
        isOpen={resultsModalOpen}
        batchId={selectedBatchForModal?.id}
        batch={selectedBatchForModal}
        onClose={handleModalClose}
        onSuccess={handleSuccess}
      />
      <QRCodeModal
        isOpen={qrModalOpen}
        code={qrCodeValue}
        title="Batch Traceability QR Tag"
        subtitle={`Batch Pengiriman Pengepul #${qrCodeValue}`}
        onClose={() => setQrModalOpen(false)}
      />
    </>
  )
}
