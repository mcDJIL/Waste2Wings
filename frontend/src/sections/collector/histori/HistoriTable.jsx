const EyeIcon = () => (
  <svg width="22" height="15" viewBox="0 0 22 15" fill="none">
    <path d="M11 12C12.25 12 13.313 11.563 14.188 10.688C15.063 9.813 15.5 8.75 15.5 7.5C15.5 6.25 15.063 5.188 14.188 4.313C13.313 3.438 12.25 3 11 3C9.75 3 8.688 3.438 7.813 4.313C6.938 5.188 6.5 6.25 6.5 7.5C6.5 8.75 6.938 9.813 7.813 10.688C8.688 11.563 9.75 12 11 12ZM11 10.2C10.25 10.2 9.613 9.938 9.088 9.413C8.563 8.888 8.3 8.25 8.3 7.5C8.3 6.75 8.563 6.113 9.088 5.588C9.613 5.063 10.25 4.8 11 4.8C11.75 4.8 12.388 5.063 12.913 5.588C13.438 6.113 13.7 6.75 13.7 7.5C13.7 8.25 13.438 8.888 12.913 9.413C12.388 9.938 11.75 10.2 11 10.2ZM11 15C8.567 15 6.35 14.321 4.35 12.963C2.35 11.604 0.9 9.783 0 7.5C0.9 5.217 2.35 3.396 4.35 2.038C6.35 0.679 8.567 0 11 0C13.433 0 15.65 0.679 17.65 2.038C19.65 3.396 21.1 5.217 22 7.5C21.1 9.783 19.65 11.604 17.65 12.963C15.65 14.321 13.433 15 11 15ZM11 13C12.883 13 14.613 12.504 16.188 11.513C17.763 10.521 18.967 9.183 19.8 7.5C18.967 5.817 17.763 4.479 16.188 3.488C14.613 2.496 12.883 2 11 2C9.117 2 7.388 2.496 5.813 3.488C4.238 4.479 3.033 5.817 2.2 7.5C3.033 9.183 4.238 10.521 5.813 11.513C7.388 12.504 9.117 13 11 13Z" fill="#6F7975" />
  </svg>
)

const ChevronLeftIcon = () => (
  <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
    <path d="M6 12L0 6L6 0L7.4 1.4L2.8 6L7.4 10.6L6 12Z" fill="#6F7975" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
    <path d="M4.6 6L0 1.4L1.4 0L7.4 6L1.4 12L0 10.6L4.6 6Z" fill="#6F7975" />
  </svg>
)

const STATUS_CONFIG = {
  TERVERIFIKASI: {
    dot: 'bg-[#006C49]',
    text: 'text-[#006C49]',
    bg: 'bg-[#81F9C1]/20',
    label: 'TERVERIFIKASI',
  },
  MENUNGGU: {
    dot: 'bg-[#4E3807]',
    text: 'text-[#4E3807]',
    bg: 'bg-[#674F1D]/20',
    label: 'MENUNGGU',
  },
  DITOLAK: {
    dot: 'bg-[#BA1A1A]',
    text: 'text-[#BA1A1A]',
    bg: 'bg-[#FFDAD6]/20',
    label: 'DITOLAK',
  },
}

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.MENUNGGU
  return (
    <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold leading-[16.5px] ${cfg.bg}`}
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${cfg.dot}`} />
      <span className={cfg.text}>{cfg.label}</span>
    </span>
  )
}

function AvatarInitials({ name }) {
  const initials = name.split(' ').slice(0, 2).map(w => w[0]).join('').toUpperCase()
  const colors = ['bg-[#A8F1D8]', 'bg-[#FFDEA4]', 'bg-[#D5E3FF]', 'bg-[#FFD6E7]', 'bg-[#C8F7C5]']
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center shrink-0`}>
      <span className="text-[#051C37] text-xs font-semibold">{initials}</span>
    </div>
  )
}

function PaginationButton({ children, active, disabled, onClick }) {
  if (active) {
    return (
      <button onClick={onClick}
        className="w-10 h-10 flex items-center justify-center rounded-lg bg-[#004536] text-white text-base font-normal shadow-[0_4px_6px_-1px_rgba(0,0,0,0.10),0_2px_4px_-2px_rgba(0,0,0,0.10)]"
        style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        {children}
      </button>
    )
  }
  if (disabled) {
    return (
      <button disabled
        className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#BEC9C3]/30 opacity-30 cursor-not-allowed">
        {children}
      </button>
    )
  }
  return (
    <button onClick={onClick}
      className="w-10 h-10 flex items-center justify-center rounded-lg border border-[#BEC9C3]/30 text-[#051C37] text-base font-normal hover:bg-[#F0F9F5] transition-colors"
      style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      {children}
    </button>
  )
}

function buildPageNumbers(current, total) {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  const pages = []
  if (current <= 4) {
    pages.push(1, 2, 3, '...', total)
  } else if (current >= total - 3) {
    pages.push(1, '...', total - 2, total - 1, total)
  } else {
    pages.push(1, '...', current - 1, current, current + 1, '...', total)
  }
  return pages
}

export default function HistoriTable({ rows, currentPage, totalPages, totalItems, perPage, onPageChange, onView }) {
  const startItem = (currentPage - 1) * perPage + 1
  const endItem = Math.min(currentPage * perPage, totalItems)
  const pageNums = buildPageNumbers(currentPage, totalPages)

  return (
    <div className="rounded-2xl border border-[#BEC9C3]/20 bg-white/70 backdrop-blur-[10px] shadow-[0_1px_2px_rgba(0,0,0,0.05)] overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-[#004536]/5">
            <tr>
              {['TANGGAL', 'ID TRANSAKSI', 'NAMA PENYETOR', 'VOLUME (L)', 'STATUS', 'AKSI'].map((h, i) => (
                <th key={h}
                  className={`px-6 py-5 text-[#004536] text-[11px] font-bold leading-[16.5px] tracking-[0.55px] uppercase
                    ${i === 3 ? 'text-right' : i === 5 ? 'text-center' : 'text-left'}`}
                  style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-[#6F7975] text-sm" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                  Tidak ada transaksi ditemukan.
                </td>
              </tr>
            ) : rows.map((row, idx) => (
              <tr key={row.idTransaksi}
                className={`border-t border-[#BEC9C3]/10 ${idx % 2 === 0 ? '' : 'bg-white/30'} hover:bg-[#F0F9F5]/50 transition-colors`}>
                {/* Tanggal */}
                <td className="px-6 py-4">
                  <p className="text-[#051C37] text-base font-normal leading-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {row.tanggal}
                  </p>
                  <p className="text-[#3F4945] text-[10px] font-normal leading-[15px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {row.waktu} WIB
                  </p>
                </td>
                {/* ID */}
                <td className="px-6 py-4">
                  <span className="text-[#004536] text-base font-bold leading-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {row.idTransaksi}
                  </span>
                </td>
                {/* Penyetor */}
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <AvatarInitials name={row.namaPenyetor} />
                    <span className="text-[#051C37] text-base font-normal leading-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                      {row.namaPenyetor}
                    </span>
                  </div>
                </td>
                {/* Volume */}
                <td className="px-6 py-4 text-right">
                  <span className="text-[#004536] text-base font-bold leading-6" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
                    {row.volume}
                  </span>
                </td>
                {/* Status */}
                <td className="px-6 py-4">
                  <StatusBadge status={row.status} />
                </td>
                {/* Aksi */}
                <td className="px-6 py-4 text-center">
                  <button
                    onClick={() => onView(row)}
                    className="inline-flex items-center justify-center p-2 rounded-lg hover:bg-[#F0F9F5] transition-colors"
                    title="Lihat detail"
                  >
                    <EyeIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#BEC9C3]/10 bg-[#F0F3FF]">
        <p className="text-[#3F4945] text-xs font-medium" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
          Menampilkan {startItem}–{endItem} dari {totalItems} Transaksi
        </p>
        <div className="flex items-center gap-2">
          <PaginationButton disabled={currentPage === 1} onClick={() => onPageChange(currentPage - 1)}>
            <ChevronLeftIcon />
          </PaginationButton>

          {pageNums.map((p, i) =>
            p === '...'
              ? <span key={`ellipsis-${i}`} className="w-10 h-10 flex items-center justify-center text-[#6F7975] text-base" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>...</span>
              : <PaginationButton key={p} active={p === currentPage} onClick={() => onPageChange(p)}>
                  {p}
                </PaginationButton>
          )}

          <PaginationButton disabled={currentPage === totalPages} onClick={() => onPageChange(currentPage + 1)}>
            <ChevronRightIcon />
          </PaginationButton>
        </div>
      </div>
    </div>
  )
}
