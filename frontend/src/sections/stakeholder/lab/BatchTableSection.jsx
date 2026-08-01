import { useState, useMemo } from 'react'
import LabInputModal from '../../../components/modals/LabInputModal'
import LabResultsModal from '../../../components/modals/LabResultsModal'

const FILTER_TABS = ['All', 'LAB_REVIEW', 'ACCEPTED_BY_STAKEHOLDER']

const GRADE_STYLES = {
  premium: 'bg-[#004B3C] text-white',
  'grade-b': 'bg-[#F59E0B] text-white',
}

function FilterIcon() {
  return (
    <svg width="18" height="12" viewBox="0 0 18 12" fill="none">
      <path d="M7 12V10H11V12H7ZM3 7V5H15V7H3ZM0 2V0H18V2H0Z" fill="#64748B" />
    </svg>
  )
}

function ChevronIcon() {
  return (
    <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
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

function ArrowRightIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path
        d="M7.10208 5.25H0V4.08333H7.10208L3.83542 0.816667L4.66667 0L9.33333 4.66667L4.66667 9.33333L3.83542 8.51667L7.10208 5.25Z"
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

export default function BatchTableSection({ batches = [], selectedBatchId, onSelectBatch, isLoading = false, onRefresh }) {
  const [activeFilter, setActiveFilter] = useState('All')
  const [inputModalOpen, setInputModalOpen] = useState(false)
  const [resultsModalOpen, setResultsModalOpen] = useState(false)
  const [selectedBatchForModal, setSelectedBatchForModal] = useState(null)

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

  const filtered = useMemo(() => {
    return (batches || []).filter((b) => {
      if (activeFilter === 'All') return true
      return b.status === activeFilter
    })
  }, [batches, activeFilter])

  return (
    <div className="rounded-3xl border border-[#E2E8F0] bg-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05),0_2px_4px_-1px_rgba(0,0,0,0.03)] overflow-hidden animate-fade-slide-up">
      {/* Table header */}
      <div className="flex flex-col xs:flex-row xs:items-center justify-between gap-3 px-6 py-5 border-b border-[#F1F5F9] bg-white">
        <div className="flex items-center gap-3">
          <span className="text-[#004B3C] text-lg font-bold leading-7">Daftar Analisis Batch</span>
          <span className="px-2.5 py-0.5 rounded-full bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold leading-[15px]">
            LIVE DATA
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Filter tabs */}
          <div className="flex items-stretch rounded-xl border border-[#E2E8F0] overflow-hidden">
            {FILTER_TABS.map((tab, i) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
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

          {/* Filter icon button */}
          <button className="flex items-center justify-center p-2.5 rounded-xl border border-[#E2E8F0] hover:bg-[#F8FAFC] transition-colors duration-200">
            <FilterIcon />
          </button>
        </div>
      </div>

      {/* Table – desktop */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead>
            <tr className="bg-[rgba(248,250,252,0.50)]">
              {['ID BATCH', 'PROCESSING DATE', 'COLLECTOR SOURCE', 'QUALITY GRADE', 'MOISTURE %', 'FFA %', 'ACTIONS'].map(
                (col, i) => (
                  <th
                    key={col}
                    className={[
                      'px-6 py-4 text-[#94A3B8] text-[11px] font-bold leading-[16.5px] tracking-[1.1px] uppercase whitespace-nowrap',
                      i === 6 ? 'text-right' : 'text-left',
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
              Array.from({ length: 3 }).map((_, i) => (
                <tr key={i} className="border-t border-[#F1F5F9] animate-pulse">
                  <td colSpan={7} className="px-6 py-6">
                    <div className="h-6 bg-[#F1F5F9] rounded" />
                  </td>
                </tr>
              ))
            ) : filtered.length > 0 ? (
              filtered.map((batch, idx) => {
                const isSelected = selectedBatchId === batch.id
                const hasLabResult = batch.labResult !== null
                const moisture = batch.labResult?.waterContentPercent ?? 0
                const ffa = batch.labResult?.ffaPercent ?? 0
                const ffaAlert = ffa > 3.5

                return (
                  <tr
                    key={batch.id}
                    onClick={() => onSelectBatch(batch.id)}
                    className={[
                      'border-t border-[#F1F5F9] transition-colors duration-200 cursor-pointer group',
                      isSelected
                        ? 'bg-[rgba(45,212,191,0.05)]'
                        : 'hover:bg-[#F8FAFC]',
                      'animate-fade-slide-up',
                    ].join(' ')}
                    style={{ animationDelay: `${idx * 60}ms` }}
                  >
                    {/* ID */}
                    <td className="px-6 py-6">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-2 h-2 rounded-full flex-shrink-0"
                          style={{ background: getStatusColor(batch) }}
                        />
                        <span className="text-[#1E293B] text-base font-bold leading-6">{batch.batchCode}</span>
                      </div>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-6 text-[#475569] text-sm font-medium leading-5">
                      {new Date(batch.createdAt).toLocaleDateString('id-ID')}
                    </td>

                    {/* Source */}
                    <td className="px-6 py-6 text-[#475569] text-sm font-medium leading-5">{batch.collector?.companyName}</td>

                    {/* Grade */}
                    <td className="px-6 py-6">
                      {hasLabResult ? (
                        <span
                          className={[
                            'inline-flex items-center px-3 py-1 rounded-full text-[9px] font-extrabold leading-[15px] tracking-[-0.5px] whitespace-nowrap transition-transform duration-200 group-hover:scale-105',
                            batch.labResult?.grade === 'A' ? 'bg-[#004B3C] text-white' : batch.labResult?.grade === 'B' ? 'bg-[#F59E0B] text-white' : 'bg-[#EF4444] text-white',
                          ].join(' ')}
                        >
                          {getGradeLabel(batch)}
                        </span>
                      ) : (
                        <span className="text-[#94A3B8] text-xs">No result</span>
                      )}
                    </td>

                    {/* Moisture */}
                    <td className="px-6 py-6 text-[#1E293B] text-sm font-bold leading-5">
                      {hasLabResult ? `${moisture.toFixed(2)}%` : '-'}
                    </td>

                    {/* FFA */}
                    <td className="px-6 py-6">
                      <span
                        className={[
                          'text-sm font-extrabold leading-5',
                          ffaAlert && hasLabResult ? 'text-[#EF4444]' : 'text-[#1E293B]',
                        ].join(' ')}
                      >
                        {hasLabResult ? `${ffa.toFixed(2)}%` : '-'}
                      </span>
                    </td>

                    {/* Action */}
                    <td className="px-6 py-6 text-right">
                      <button
                        onClick={(e) => handleActionClick(e, batch)}
                        className="inline-flex items-center justify-center p-2 rounded-xl hover:bg-[#F1F5F9] transition-all duration-200 hover:scale-110 active:scale-95"
                      >
                        {!hasLabResult ? <BarChartIcon /> : <ChevronIcon />}
                      </button>
                    </td>
                  </tr>
                )
              })
            ) : (
              <tr>
                <td colSpan={7} className="px-6 py-10 text-center text-[#94A3B8] text-sm">
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
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="p-4 animate-pulse">
              <div className="h-20 bg-[#F1F5F9] rounded" />
            </div>
          ))
        ) : filtered.length > 0 ? (
          filtered.map((batch, idx) => {
            const isSelected = selectedBatchId === batch.id
            const hasLabResult = batch.labResult !== null
            const moisture = batch.labResult?.waterContentPercent ?? 0
            const ffa = batch.labResult?.ffaPercent ?? 0
            const ffaAlert = ffa > 3.5

            return (
              <div
                key={batch.id}
                onClick={() => onSelectBatch(batch.id)}
                className={[
                  'flex flex-col gap-3 p-4 cursor-pointer transition-colors duration-200 animate-fade-slide-up',
                  isSelected ? 'bg-[rgba(45,212,191,0.05)]' : 'hover:bg-[#F8FAFC]',
                ].join(' ')}
                style={{ animationDelay: `${idx * 60}ms` }}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: getStatusColor(batch) }} />
                    <span className="text-[#1E293B] text-base font-bold">{batch.batchCode}</span>
                  </div>
                  {hasLabResult && (
                    <span
                      className={[
                        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[9px] font-extrabold tracking-[-0.5px] whitespace-nowrap',
                        batch.labResult?.grade === 'A' ? 'bg-[#004B3C] text-white' : batch.labResult?.grade === 'B' ? 'bg-[#F59E0B] text-white' : 'bg-[#EF4444] text-white',
                      ].join(' ')}
                    >
                      {getGradeLabel(batch)}
                    </span>
                  )}
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
                    {!hasLabResult ? <BarChartIcon /> : <ChevronIcon />}
                  </button>
                </div>
              </div>
            )
          })
        ) : (
          <div className="p-4 text-center text-[#94A3B8] text-sm">Tidak ada batch yang sesuai.</div>
        )}
      </div>

      {/* Footer */}
      <div className="flex justify-center items-center gap-1.5 px-4 py-4 border-t border-[#F1F5F9] bg-[#F8FAFC]">
        <button className="flex items-center gap-1.5 text-[#004B3C] text-sm font-bold leading-5 hover:underline transition-all duration-200 group">
          <span>View Full History</span>
          <span className="transition-transform duration-200 group-hover:translate-x-0.5">
            <ArrowRightIcon />
          </span>
        </button>
      </div>

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
    </div>
  )
}
