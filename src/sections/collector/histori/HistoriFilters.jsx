import { useState } from 'react'

const SearchIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.233 13 6.5 13C4.683 13 3.146 12.371 1.888 11.113C0.629 9.854 0 8.317 0 6.5C0 4.683 0.629 3.146 1.888 1.888C3.146 0.629 4.683 0 6.5 0C8.317 0 9.854 0.629 11.113 1.888C12.371 3.146 13 4.683 13 6.5C13 7.233 12.883 7.925 12.65 8.575C12.417 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.813 10.563 9.688 9.688C10.563 8.813 11 7.75 11 6.5C11 5.25 10.563 4.188 9.688 3.313C8.813 2.438 7.75 2 6.5 2C5.25 2 4.188 2.438 3.313 3.313C2.438 4.188 2 5.25 2 6.5C2 7.75 2.438 8.813 3.313 9.688C4.188 10.563 5.25 11 6.5 11Z" fill="#6F7975" />
  </svg>
)

const CalendarIcon = () => (
  <svg width="15" height="17" viewBox="0 0 15 17" fill="none">
    <path d="M1.667 16.667C1.208 16.667 0.816 16.504 0.49 16.177C0.163 15.851 0 15.458 0 15V3.333C0 2.875 0.163 2.483 0.49 2.156C0.816 1.83 1.208 1.667 1.667 1.667H2.5V0H4.167V1.667H10.833V0H12.5V1.667H13.333C13.792 1.667 14.184 1.83 14.51 2.156C14.837 2.483 15 2.875 15 3.333V15C15 15.458 14.837 15.851 14.51 16.177C14.184 16.504 13.792 16.667 13.333 16.667H1.667ZM1.667 15H13.333V6.667H1.667V15ZM1.667 5H13.333V3.333H1.667V5Z" fill="#6F7975" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M4 6L8 10L12 6" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const STATUS_FILTERS = [
  { label: 'Semua', value: '' },
  { label: 'Terverifikasi', value: 'TERVERIFIKASI' },
  { label: 'Menunggu', value: 'MENUNGGU' },
  { label: 'Ditolak', value: 'DITOLAK' },
]

const DATE_RANGES = [
  { label: '7 Hari Terakhir', value: '7' },
  { label: '30 Hari Terakhir', value: '30' },
  { label: '3 Bulan Terakhir', value: '90' },
  { label: 'Semua Waktu', value: 'all' },
]

export default function HistoriFilters({ search, onSearchChange, dateRange, onDateRangeChange, activeStatus, onStatusChange }) {
  const [dateOpen, setDateOpen] = useState(false)
  const selectedDateLabel = DATE_RANGES.find(d => d.value === dateRange)?.label ?? '7 Hari Terakhir'

  return (
    <div className="rounded-2xl border border-white/30 bg-white/70 backdrop-blur-[10px] px-6 py-5 flex flex-col gap-4">
      {/* Top row: search + date */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
            <SearchIcon />
          </span>
          <input
            type="text"
            value={search}
            onChange={e => onSearchChange(e.target.value)}
            placeholder="Cari penyetor atau ID transaksi..."
            className="w-full pl-12 pr-4 py-3.5 rounded-xl border border-[#BEC9C3]/30 bg-white text-[#051C37] text-sm font-semibold placeholder:text-[#6B7280] placeholder:font-semibold outline-none focus:border-[#004536]/40 focus:ring-2 focus:ring-[#004536]/10 transition-all"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', letterSpacing: '0.14px' }}
          />
        </div>

        {/* Date range */}
        <div className="relative">
          <button
            onClick={() => setDateOpen(o => !o)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#BEC9C3]/30 bg-white text-sm font-semibold text-[#051C37] whitespace-nowrap min-w-[180px]"
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            <CalendarIcon />
            <span className="flex-1 text-left">{selectedDateLabel}</span>
            <ChevronDownIcon />
          </button>
          {dateOpen && (
            <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-lg border border-[#BEC9C3]/30 overflow-hidden min-w-[180px]">
              {DATE_RANGES.map(d => (
                <button
                  key={d.value}
                  onClick={() => { onDateRangeChange(d.value); setDateOpen(false) }}
                  className={`w-full text-left px-4 py-2.5 text-sm hover:bg-[#F0F9F5] transition-colors
                    ${dateRange === d.value ? 'text-[#004536] font-semibold' : 'text-[#3F4945] font-medium'}`}
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
                >
                  {d.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Status filter chips */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[#3F4945] text-xs font-medium mr-2" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Filter Status:
        </span>
        {STATUS_FILTERS.map(f => (
          <button
            key={f.value}
            onClick={() => onStatusChange(f.value)}
            className={`px-4 py-2 rounded-full text-xs font-medium leading-4 transition-all duration-200
              ${activeStatus === f.value
                ? 'bg-[#004536] text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.10)]'
                : 'bg-white border border-[#BEC9C3]/30 text-[#3F4945] hover:bg-[#F0F9F5]'
              }`}
            style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}
          >
            {f.label}
          </button>
        ))}
      </div>
    </div>
  )
}
