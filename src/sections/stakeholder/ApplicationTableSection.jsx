import { useState } from 'react'
import GradeBadge from '../../components/stakeholder/GradeBadge'
import EntityAvatar from '../../components/stakeholder/EntityAvatar'

const allSubmissions = [
  { date: '12 Okt 2023', id: 'APP-88210', name: 'PT Sinar Energi', type: 'PT', industry: 'Logistics Industry', region: 'Surabaya, JATIM', grade: 'A' },
  { date: '11 Okt 2023', id: 'APP-88209', name: 'UD Maju Jaya', type: 'UD', industry: 'Local Collector', region: 'Gresik, JATIM', grade: 'B' },
  { date: '10 Okt 2023', id: 'APP-88195', name: 'CV Bintang Oli', type: 'CV', industry: 'Waste Recovery', region: 'Tangerang, BANTEN', grade: 'A' },
  { date: '09 Okt 2023', id: 'APP-88190', name: 'PT Karya Mandiri', type: 'PT', industry: 'Industrial Collector', region: 'Bekasi, JABAR', grade: 'A' },
  { date: '08 Okt 2023', id: 'APP-88182', name: 'CV Hijau Lestari', type: 'CV', industry: 'Eco Recovery', region: 'Medan, SUMUT', grade: 'B' },
  { date: '07 Okt 2023', id: 'APP-88175', name: 'UD Sejahtera Oil', type: 'UD', industry: 'Local Collector', region: 'Malang, JATIM', grade: 'A' },
  { date: '06 Okt 2023', id: 'APP-88168', name: 'PT Nusa Energi', type: 'PT', industry: 'Logistics Industry', region: 'Surabaya, JATIM', grade: 'A' },
  { date: '05 Okt 2023', id: 'APP-88161', name: 'CV Bumi Hijau', type: 'CV', industry: 'Waste Recovery', region: 'Tangerang, BANTEN', grade: 'B' },
  { date: '04 Okt 2023', id: 'APP-88154', name: 'UD Timur Jaya', type: 'UD', industry: 'Local Collector', region: 'Gresik, JATIM', grade: 'A' },
  { date: '03 Okt 2023', id: 'APP-88147', name: 'PT Citra Mitra', type: 'PT', industry: 'Industrial Collector', region: 'Jakarta, DKI', grade: 'B' },
]

const PAGE_SIZE = 4
const TOTAL = 24

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

function TableRow({ row, index }) {
  return (
    <tr
      className="border-t border-[rgba(190,201,195,0.20)] transition-colors duration-150 hover:bg-[rgba(0,69,54,0.03)] group"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <td className="px-4 sm:px-6 py-4 text-[#3F4945] text-sm whitespace-nowrap">{row.date}</td>
      <td className="px-4 sm:px-6 py-4 text-[#051C37] text-sm font-bold whitespace-nowrap">{row.id}</td>
      <td className="px-4 sm:px-6 py-4">
        <div className="flex items-center gap-2.5">
          <EntityAvatar type={row.type} />
          <div>
            <p className="text-[#051C37] text-sm font-bold leading-5 group-hover:text-[#004536] transition-colors duration-150">{row.name}</p>
            <p className="text-[#3F4945] text-xs leading-4">{row.industry}</p>
          </div>
        </div>
      </td>
      <td className="px-4 sm:px-6 py-4 text-[#3F4945] text-sm whitespace-nowrap hidden sm:table-cell">{row.region}</td>
      <td className="px-4 sm:px-6 py-4">
        <GradeBadge grade={row.grade} />
      </td>
    </tr>
  )
}

function MobileCard({ row }) {
  return (
    <div className="p-3 rounded-xl border border-[rgba(190,201,195,0.30)] bg-white/80 transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
      <div className="flex items-start justify-between gap-2 mb-2">
        <div>
          <p className="text-[#3F4945] text-xs">{row.date}</p>
          <p className="text-[#051C37] text-xs font-bold">{row.id}</p>
        </div>
        <GradeBadge grade={row.grade} />
      </div>
      <div className="flex items-center gap-2 mb-1">
        <EntityAvatar type={row.type} />
        <div>
          <p className="text-[#051C37] text-sm font-bold leading-5">{row.name}</p>
          <p className="text-[#3F4945] text-xs">{row.industry}</p>
        </div>
      </div>
      <p className="text-[#3F4945] text-xs mt-1">{row.region}</p>
    </div>
  )
}

export default function ApplicationTableSection() {
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('Semua Status')
  const [gradeFilter, setGradeFilter] = useState('Semua Grade')
  const [page, setPage] = useState(1)
  const [showAdvanced, setShowAdvanced] = useState(false)

  const filtered = allSubmissions.filter((r) => {
    const matchSearch = search === '' || r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())
    const matchGrade = gradeFilter === 'Semua Grade' || r.grade === gradeFilter.replace('Grade ', '')
    return matchSearch && matchGrade
  })

  const totalPages = Math.ceil(TOTAL / PAGE_SIZE)
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
            options={['Semua Status', 'Pending', 'Approved', 'Rejected']}
            value={statusFilter}
            onChange={(v) => { setStatusFilter(v); setPage(1) }}
          />

          <FilterDropdown
            label="Semua Grade"
            options={['Semua Grade', 'Grade A', 'Grade B']}
            value={gradeFilter}
            onChange={(v) => { setGradeFilter(v); setPage(1) }}
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
              {['Tanggal', 'ID Pengepul', 'Nama Entitas', 'Wilayah', 'Grade Prediksi'].map((h) => (
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
            {pageData.map((row, i) => (
              <TableRow key={row.id} row={row} index={i} />
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="sm:hidden flex flex-col gap-2 p-3">
        {pageData.map((row) => (
          <MobileCard key={row.id} row={row} />
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-4 sm:px-6 py-4 border-t border-[rgba(190,201,195,0.30)] bg-[rgba(240,243,255,0.30)]">
        <p className="text-[#3F4945] text-xs sm:text-sm">
          Menampilkan {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, TOTAL)} dari {TOTAL} Pengajuan
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
    </div>
  )
}
