const SearchIcon = () => (
  <svg className="text-[#6F7975] shrink-0" width="16" height="16" viewBox="0 0 18 24" fill="none">
    <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11Z" fill="currentColor" />
  </svg>
)

const CalendarIcon = () => (
  <svg className="text-[#6F7975] shrink-0" width="16" height="16" viewBox="0 0 18 20" fill="none">
    <path d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H3V0H5V2H13V0H15V2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V8H2V18ZM2 6H16V4H2V6Z" fill="currentColor" />
  </svg>
)

const FilterIcon = () => (
  <svg className="text-[#6F7975] shrink-0" width="16" height="16" viewBox="0 0 18 12" fill="none">
    <path d="M7 12V10H11V12H7ZM3 7V5H15V7H3ZM0 2V0H18V2H0Z" fill="currentColor" />
  </svg>
)

const ChevronIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 7" fill="none">
    <path d="M6 7L0 1L1.05 0L6 4.9L10.95 0L12 1L6 7Z" fill="#6B7280" />
  </svg>
)

const AdjustIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M4.66667 10.5V7H5.83333V8.16667H10.5V9.33333H5.83333V10.5H4.66667ZM0 9.33333V8.16667H3.5V9.33333H0ZM2.33333 7V5.83333H0V4.66667H2.33333V3.5H3.5V7H2.33333ZM4.66667 5.83333V4.66667H10.5V5.83333H4.66667ZM7 3.5V0H8.16667V1.16667H10.5V2.33333H8.16667V3.5H7ZM0 2.33333V1.16667H5.83333V2.33333H0Z" fill="white" />
  </svg>
)

function FilterField({ label, children }) {
  return (
    <div className="flex flex-col gap-2 flex-1 min-w-[140px]">
      <label className="text-[#3F4945] text-sm font-normal leading-6">{label}</label>
      {children}
    </div>
  )
}

export default function RiwayatFilters({ search, onSearchChange, dateRange, onDateRangeChange, status, onStatusChange, onApply }) {
  return (
    <div className="p-4 sm:p-6 rounded-2xl border border-white/30 bg-white/70 backdrop-blur-[10px] shadow-sm animate-fade-slide-up">
      <div className="flex flex-wrap gap-3 sm:gap-4 items-end">
        <FilterField label="Cari ID atau Pengepul">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <SearchIcon />
            </span>
            <input
              type="text"
              value={search}
              onChange={e => onSearchChange(e.target.value)}
              placeholder="Contoh: TR-99210..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-[#BEC9C3] bg-white/50
                text-[#051C37] text-sm placeholder:text-[#6B7280] outline-none
                focus:border-[#006C49]/50 focus:ring-2 focus:ring-[#006C49]/10
                transition-all duration-200"
            />
          </div>
        </FilterField>

        <FilterField label="Rentang Waktu">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <CalendarIcon />
            </span>
            <select
              value={dateRange}
              onChange={e => onDateRangeChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#BEC9C3] bg-white/50
                text-[#051C37] text-sm outline-none appearance-none cursor-pointer
                focus:border-[#006C49]/50 focus:ring-2 focus:ring-[#006C49]/10
                transition-all duration-200"
            >
              <option value="30">30 Hari Terakhir</option>
              <option value="7">7 Hari Terakhir</option>
              <option value="90">90 Hari Terakhir</option>
              <option value="365">1 Tahun Terakhir</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronIcon />
            </span>
          </div>
        </FilterField>

        <FilterField label="Status">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2">
              <FilterIcon />
            </span>
            <select
              value={status}
              onChange={e => onStatusChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-[#BEC9C3] bg-white/50
                text-[#051C37] text-sm outline-none appearance-none cursor-pointer
                focus:border-[#006C49]/50 focus:ring-2 focus:ring-[#006C49]/10
                transition-all duration-200"
            >
              <option value="">Semua Status</option>
              <option value="Selesai">Selesai</option>
              <option value="Menunggu">Menunggu</option>
              <option value="Dibatalkan">Dibatalkan</option>
            </select>
            <span className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <ChevronIcon />
            </span>
          </div>
        </FilterField>

        <div className="flex items-end">
          <button
            onClick={onApply}
            className="flex items-center gap-2 px-5 sm:px-6 py-2.5 rounded-xl bg-[#004536] text-white text-sm font-normal
              hover:bg-[#005a47] active:scale-95 shadow-[0_4px_6px_-1px_rgba(0,69,54,0.20),0_2px_4px_-2px_rgba(0,69,54,0.20)]
              transition-all duration-200 whitespace-nowrap"
          >
            <AdjustIcon />
            Terapkan
          </button>
        </div>
      </div>
    </div>
  )
}
