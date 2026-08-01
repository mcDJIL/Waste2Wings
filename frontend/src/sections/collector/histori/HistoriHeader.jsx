const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 12L3 7L4.4 5.55L7 8.15V0H9V8.15L11.6 5.55L13 7L8 12ZM2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V11H2V14H14V11H16V14C16 14.55 15.8042 15.0208 15.4125 15.4125C15.0208 15.8042 14.55 16 14 16H2Z" fill="white" />
  </svg>
)

const OilDropIcon = () => (
  <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
    <path d="M9 19C6.783 19 4.896 18.233 3.337 16.7C1.779 15.167 1 13.3 1 11.1C1 10.017 1.208 9.004 1.625 8.063C2.042 7.121 2.617 6.283 3.35 5.55L9 0L14.65 5.55C15.383 6.283 15.958 7.121 16.375 8.063C16.792 9.004 17 10.017 17 11.1C17 13.3 16.221 15.167 14.663 16.7C13.104 18.233 11.217 19 9 19Z" fill="#006C49" />
  </svg>
)

const ReceiptIcon = () => (
  <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
    <path d="M3 20C2.167 20 1.458 19.708 0.875 19.125C0.292 18.542 0 17.833 0 17V14H3V0L4.5 1.5L6 0L7.5 1.5L9 0L10.5 1.5L12 0L13.5 1.5L15 0L16.5 1.5L18 0V17C18 17.833 17.708 18.542 17.125 19.125C16.542 19.708 15.833 20 15 20H3Z" fill="#4E3807" />
  </svg>
)

const WalletIcon = () => (
  <svg width="18" height="16" viewBox="0 0 18 16" fill="none">
    <path d="M13 10C12.167 10 11.458 9.708 10.875 9.125C10.292 8.542 10 7.833 10 7C10 6.167 10.292 5.458 10.875 4.875C11.458 4.292 12.167 4 13 4H18V2C18 1.45 17.804 0.979 17.413 0.588C17.021 0.196 16.55 0 16 0H2C1.45 0 0.979 0.196 0.588 0.588C0.196 0.979 0 1.45 0 2V14C0 14.55 0.196 15.021 0.588 15.413C0.979 15.804 1.45 16 2 16H16C16.55 16 17.021 15.804 17.413 15.413C17.804 15.021 18 14.55 18 14V12H13C12.167 12 11.458 11.708 10.875 11.125C10.292 10.542 10 9.833 10 9C10 8.167 10.292 7.458 10.875 6.875C11.458 6.292 12.167 6 13 6V8C12.717 8 12.479 8.096 12.288 8.288C12.096 8.479 12 8.717 12 9C12 9.283 12.096 9.521 12.288 9.713C12.479 9.904 12.717 10 13 10Z" fill="#004536" />
  </svg>
)

const STAT_CARDS = [
  {
    icon: <OilDropIcon />,
    iconBg: 'bg-[#81F9C1]/30',
    badge: { text: '+12.5%', className: 'bg-[#DCFCE7] text-[#15803D]' },
    label: 'Total Liter Terkumpul',
    value: '4,500',
    unit: 'L',
    decorBg: 'bg-[#C9A96E]',
  },
  {
    icon: <ReceiptIcon />,
    iconBg: 'bg-[#FFDEA4]/30',
    badge: { text: 'Update Real-time', className: 'bg-[#DBEAFE] text-[#1D4ED8]' },
    label: 'Total Transaksi',
    value: '128',
    unit: '',
    decorBg: 'bg-[#C9A96E]',
  },
  {
    icon: <WalletIcon />,
    iconBg: 'bg-[#0B5E4B]/20',
    badge: { text: '● Verified', className: 'text-[#006C49] text-xs font-bold' },
    label: 'Total Pendapatan',
    value: 'Rp 35.000k',
    unit: '',
    decorBg: 'bg-[#C9A96E]',
  },
]

function StatCard({ icon, iconBg, badge, label, value, unit }) {
  return (
    <div className="relative flex-1 min-w-[220px] rounded-2xl border-t-[3px] border-[#C9A96E] bg-white/70 backdrop-blur-[10px] shadow-[0_1px_2px_rgba(0,0,0,0.30)] overflow-hidden p-6">
      <div className="flex items-center justify-between mb-3">
        <span className={`flex items-center justify-center w-10 h-10 rounded-xl ${iconBg}`}>
          {icon}
        </span>
        <span className={`px-2 py-1 rounded text-xs font-bold leading-4 ${badge.className}`}>
          {badge.text}
        </span>
      </div>
      <p className="text-[#3F4945] text-sm font-semibold tracking-[0.14px] mb-1" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
        {label}
      </p>
      <div className="flex items-baseline gap-1">
        <span className="text-[#004536] font-bold leading-[56px] tracking-[-1.2px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '48px' }}>
          {value}
        </span>
        {unit && (
          <span className="text-[#004536] text-2xl font-medium opacity-60 tracking-[-1.2px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            {unit}
          </span>
        )}
      </div>
    </div>
  )
}

export default function HistoriHeader({ summary, isLoading, onExport }) {
  const getStatCards = () => {
    if (!summary) return STAT_CARDS

    return [
      {
        icon: <OilDropIcon />,
        iconBg: 'bg-[#81F9C1]/30',
        badge: { text: '● Real-time', className: 'bg-[#DCFCE7] text-[#15803D]' },
        label: 'Total Liter Bersih',
        value: (summary?.totalCleanLiter || 0).toLocaleString('id-ID'),
        unit: 'L',
        decorBg: 'bg-[#C9A96E]',
      },
      {
        icon: <ReceiptIcon />,
        iconBg: 'bg-[#FFDEA4]/30',
        badge: { text: 'Tercatat', className: 'bg-[#DBEAFE] text-[#1D4ED8]' },
        label: 'Total Transaksi',
        value: (summary?.totalTransactions || 0).toString(),
        unit: '',
        decorBg: 'bg-[#C9A96E]',
      },
      {
        icon: <WalletIcon />,
        iconBg: 'bg-[#0B5E4B]/20',
        badge: { text: '● Verified', className: 'text-[#006C49] text-xs font-bold' },
        label: 'Total Pendapatan',
        value: `Rp ${((summary?.totalRevenueFromHen || 0) / 1000000).toFixed(1)}`,
        unit: 'J',
        decorBg: 'bg-[#C9A96E]',
      },
    ]
  }

  const statCards = getStatCards()

  return (
    <div className="flex flex-col gap-6">
      {/* Title row */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-[#004536] font-semibold leading-10" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '32px' }}>
            Histori Setoran
          </h1>
          <p className="text-[#3F4945] text-base font-normal leading-6 max-w-[672px]" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
            Pantau dan kelola seluruh riwayat transaksi pengumpulan minyak jelantah dengan sistem verifikasi real-time.
          </p>
        </div>

        <button
          onClick={onExport}
          className="flex items-center gap-3 px-6 py-3 rounded-xl text-white font-normal leading-6 shrink-0 shadow-[0_10px_15px_-3px_rgba(11,94,75,0.20),0_4px_6px_-4px_rgba(11,94,75,0.20)] hover:shadow-lg active:scale-95 transition-all"
          style={{
            fontFamily: 'Plus Jakarta Sans, sans-serif',
            background: 'linear-gradient(90deg, #0B5E4B 0%, #006C49 100%)',
          }}>
          <DownloadIcon />
          <span className="text-center">Ekspor Laporan<br />(PDF)</span>
        </button>
      </div>

      {/* Stat cards */}
      <div className="flex flex-col sm:flex-row gap-6">
        {isLoading ? (
          Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex-1 min-w-[220px] h-[150px] rounded-2xl bg-white/70 animate-pulse border-t-[3px] border-[#C9A96E]" />
          ))
        ) : (
          statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))
        )}
      </div>
    </div>
  )
}
