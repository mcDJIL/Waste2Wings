import StatusBadge from '../../../components/riwayat/StatusBadge'

const EyeIcon = () => (
  <svg width="22" height="15" viewBox="0 0 22 15" fill="none">
    <path d="M11 12C12.25 12 13.3125 11.5625 14.1875 10.6875C15.0625 9.8125 15.5 8.75 15.5 7.5C15.5 6.25 15.0625 5.1875 14.1875 4.3125C13.3125 3.4375 12.25 3 11 3C9.75 3 8.6875 3.4375 7.8125 4.3125C6.9375 5.1875 6.5 6.25 6.5 7.5C6.5 8.75 6.9375 9.8125 7.8125 10.6875C8.6875 11.5625 9.75 12 11 12ZM11 10.2C10.25 10.2 9.6125 9.9375 9.0875 9.4125C8.5625 8.8875 8.3 8.25 8.3 7.5C8.3 6.75 8.5625 6.1125 9.0875 5.5875C9.6125 5.0625 10.25 4.8 11 4.8C11.75 4.8 12.3875 5.0625 12.9125 5.5875C13.4375 6.1125 13.7 6.75 13.7 7.5C13.7 8.25 13.4375 8.8875 12.9125 9.4125C12.3875 9.9375 11.75 10.2 11 10.2ZM11 15C8.56667 15 6.35 14.3208 4.35 12.9625C2.35 11.6042 0.9 9.78333 0 7.5C0.9 5.21667 2.35 3.39583 4.35 2.0375C6.35 0.679167 8.56667 0 11 0C13.4333 0 15.65 0.679167 17.65 2.0375C19.65 3.39583 21.1 5.21667 22 7.5C21.1 9.78333 19.65 11.6042 17.65 12.9625C15.65 14.3208 13.4333 15 11 15ZM11 13C12.8833 13 14.6125 12.5042 16.1875 11.5125C17.7625 10.5208 18.9667 9.18333 19.8 7.5C18.9667 5.81667 17.7625 4.47917 16.1875 3.4875C14.6125 2.49583 12.8833 2 11 2C9.11667 2 7.3875 2.49583 5.8125 3.4875C4.2375 4.47917 3.03333 5.81667 2.2 7.5C3.03333 9.18333 4.2375 10.5208 5.8125 11.5125C7.3875 12.5042 9.11667 13 11 13Z" fill="#3F4945" />
  </svg>
)

const ChevronLeftIcon = () => (
  <svg width="5" height="7" viewBox="0 0 5 7" fill="none">
    <path d="M3.5 7L0 3.5L3.5 0L4.31667 0.816667L1.63333 3.5L4.31667 6.18333L3.5 7Z" fill="#3F4945" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="5" height="7" viewBox="0 0 5 7" fill="none">
    <path d="M2.68333 3.5L0 0.816667L0.816667 0L4.31667 3.5L0.816667 7L0 6.18333L2.68333 3.5Z" fill="#3F4945" />
  </svg>
)

const AVATAR_COLORS = {
  AS: { bg: 'bg-[#81F9C1]', text: 'text-[#006C49]' },
  RK: { bg: 'bg-[#FFDEA4]', text: 'text-[#261900]' },
  DP: { bg: 'bg-[#BEC9C3]/30', text: 'text-[#3F4945]' },
}

function AvatarInitials({ initials }) {
  const colors = AVATAR_COLORS[initials] ?? { bg: 'bg-[#BEC9C3]/30', text: 'text-[#3F4945]' }
  return (
    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${colors.bg}`}>
      <span className={`text-xs font-bold ${colors.text}`}>{initials}</span>
    </div>
  )
}

function DesktopRow({ row, onView, delay }) {
  const poinColor = row.poin > 0 ? 'text-[#006C49]' : 'text-[#3F4945]'
  return (
    <tr
      className="border-t border-[#BEC9C3]/10 hover:bg-[#006C49]/[0.03] transition-colors duration-150 group animate-fade-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <td className="px-6 py-4 text-[#051C37] text-sm whitespace-nowrap">{row.tanggal}</td>
      <td className="px-6 py-4">
        <span className="text-[#004536] text-sm font-normal">{row.idTransaksi}</span>
      </td>
      <td className="px-6 py-4">
        <div className="flex items-center gap-3">
          <AvatarInitials initials={row.initials} />
          <span className="text-[#051C37] text-sm">{row.pengepul}</span>
        </div>
      </td>
      <td className="px-6 py-4 text-[#051C37] text-sm font-semibold">{row.volume} L</td>
      <td className={`px-6 py-4 text-sm font-bold ${poinColor}`}>
        {row.poin > 0 ? `+${row.poin}` : row.poin}
      </td>
      <td className="px-6 py-4">
        <StatusBadge status={row.status} />
      </td>
      <td className="px-6 py-4 text-right">
        <button
          onClick={() => onView(row)}
          className="p-2 rounded-lg hover:bg-[#006C49]/10 active:scale-90 transition-all duration-150"
          aria-label={`Lihat detail ${row.idTransaksi}`}
        >
          <EyeIcon />
        </button>
      </td>
    </tr>
  )
}

function MobileCard({ row, onView, delay }) {
  const poinColor = row.poin > 0 ? 'text-[#006C49]' : 'text-[#3F4945]'
  return (
    <div
      className="p-4 border-t border-[#BEC9C3]/20 hover:bg-[#006C49]/[0.03] transition-colors duration-150 animate-fade-slide-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2">
          <AvatarInitials initials={row.initials} />
          <div>
            <p className="text-[#051C37] text-sm font-medium">{row.pengepul}</p>
            <p className="text-[#004536] text-xs">{row.idTransaksi}</p>
          </div>
        </div>
        <StatusBadge status={row.status} />
      </div>
      <div className="flex items-center justify-between mt-2">
        <div className="flex gap-4">
          <div>
            <p className="text-[#6F7975] text-[10px] uppercase tracking-wide">Tanggal</p>
            <p className="text-[#051C37] text-xs">{row.tanggal}</p>
          </div>
          <div>
            <p className="text-[#6F7975] text-[10px] uppercase tracking-wide">Volume</p>
            <p className="text-[#051C37] text-xs font-semibold">{row.volume} L</p>
          </div>
          <div>
            <p className="text-[#6F7975] text-[10px] uppercase tracking-wide">Poin</p>
            <p className={`text-xs font-bold ${poinColor}`}>
              {row.poin > 0 ? `+${row.poin}` : row.poin}
            </p>
          </div>
        </div>
        <button
          onClick={() => onView(row)}
          className="p-2 rounded-lg hover:bg-[#006C49]/10 active:scale-90 transition-all duration-150 shrink-0"
          aria-label={`Lihat detail ${row.idTransaksi}`}
        >
          <EyeIcon />
        </button>
      </div>
    </div>
  )
}

function PaginationButton({ children, active, disabled, onClick }) {
  if (active) {
    return (
      <button
        onClick={onClick}
        className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#004536] text-white text-sm
          transition-all duration-150"
      >
        {children}
      </button>
    )
  }
  if (disabled) {
    return (
      <button
        disabled
        className="px-2 h-8 flex items-center justify-center rounded-lg border border-[#BEC9C3]
          bg-white text-sm opacity-30 cursor-not-allowed"
      >
        {children}
      </button>
    )
  }
  return (
    <button
      onClick={onClick}
      className="w-8 h-8 flex items-center justify-center rounded-lg border border-[#BEC9C3]
        bg-white text-[#3F4945] text-sm hover:bg-[#004536]/5 active:scale-90
        transition-all duration-150"
    >
      {children}
    </button>
  )
}

const TABLE_HEADERS = ['Tanggal', 'ID Transaksi', 'Pengepul', 'Volume (L)', 'Poin', 'Status', 'Aksi']

export default function RiwayatTable({ rows, currentPage, totalPages, totalItems, perPage, onPageChange, onView }) {
  const start = (currentPage - 1) * perPage + 1
  const end = Math.min(currentPage * perPage, totalItems)

  const pageNumbers = []
  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) pageNumbers.push(i)
  } else {
    pageNumbers.push(1, 2, 3)
    if (currentPage > 4) pageNumbers.push('...')
    if (currentPage > 3 && currentPage < totalPages - 1) pageNumbers.push(currentPage)
    pageNumbers.push('...')
    pageNumbers.push(totalPages)
  }

  const uniquePages = [...new Set(pageNumbers)]

  return (
    <div className="rounded-2xl border border-[#BEC9C3]/30 bg-white/70 backdrop-blur-[10px] shadow-sm overflow-hidden animate-fade-slide-up">
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full min-w-[640px]">
          <thead className="bg-[#F0F3FF] border-b border-[#BEC9C3]/30">
            <tr>
              {TABLE_HEADERS.map((h, i) => (
                <th
                  key={h}
                  className={`px-6 py-4 text-[#3F4945] text-sm font-bold leading-6 ${i === TABLE_HEADERS.length - 1 ? 'text-right' : 'text-left'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <DesktopRow key={row.idTransaksi} row={row} onView={onView} delay={i * 40} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="sm:hidden">
        <div className="px-4 py-3 bg-[#F0F3FF] border-b border-[#BEC9C3]/30">
          <p className="text-[#3F4945] text-xs font-bold uppercase tracking-wide">Transaksi</p>
        </div>
        {rows.map((row, i) => (
          <MobileCard key={row.idTransaksi} row={row} onView={onView} delay={i * 40} />
        ))}
      </div>

      <div className="flex flex-col xs:flex-row items-start xs:items-center justify-between gap-3 px-4 sm:px-6 py-4 border-t border-[#BEC9C3]/30 bg-[#F0F3FF]">
        <p className="text-[#3F4945] text-xs sm:text-sm shrink-0">
          Menampilkan{' '}
          <span className="text-[#051C37] font-medium">{start} - {end}</span>
          {' '}dari{' '}
          <span className="text-[#051C37] font-medium">{totalItems}</span>
          {' '}transaksi
        </p>

        <div className="flex items-center gap-1">
          <PaginationButton disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
            <ChevronLeftIcon />
          </PaginationButton>

          {uniquePages.map((page, idx) =>
            page === '...'
              ? <span key={`ellipsis-${idx}`} className="px-1 text-[#3F4945] text-sm">...</span>
              : (
                <PaginationButton
                  key={page}
                  active={page === currentPage}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </PaginationButton>
              )
          )}

          <PaginationButton disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
            <ChevronRightIcon />
          </PaginationButton>
        </div>
      </div>
    </div>
  )
}
