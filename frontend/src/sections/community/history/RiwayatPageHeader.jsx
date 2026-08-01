const TrendUpIcon = () => (
  <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
    <path d="M0.816667 7L0 6.18333L4.31667 1.8375L6.65 4.17083L9.68333 1.16667H8.16667V0H11.6667V3.5H10.5V1.98333L6.65 5.83333L4.31667 3.5L0.816667 7Z" fill="#006C49" />
  </svg>
)

const STAT_CARDS = [
  {
    label: 'TOTAL TRANSAKSI',
    value: '128',
    suffix: null,
    trend: null,
  },
  {
    label: 'LITER TERKUMPUL',
    value: '2,450',
    suffix: 'L',
    trend: null,
  },
  {
    label: 'EFISIENSI',
    value: '94%',
    suffix: null,
    trend: <TrendUpIcon />,
    valueColor: 'text-[#006C49]',
  },
]

function StatCard({ label, value, suffix, trend, valueColor = 'text-[#004536]', delay = 0 }) {
  return (
    <div
      className="flex-1 min-w-[140px] p-4 rounded-xl border-t-2 border border-[#C9A96E]
        bg-white/70 backdrop-blur-[10px] shadow-sm
        animate-fade-slide-up hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
      style={{ animationDelay: `${delay}ms` }}
    >
      <p className="text-[#3F4945] text-xs sm:text-sm font-normal uppercase tracking-[0.05em] leading-snug">
        {label}
      </p>
      <div className="flex items-end gap-1.5 mt-1">
        <span className={`text-base sm:text-lg font-bold leading-6 ${valueColor}`}>{value}</span>
        {suffix && <span className="text-[#004536] text-xs font-medium mb-0.5">{suffix}</span>}
        {trend && <span className="mb-0.5">{trend}</span>}
      </div>
    </div>
  )
}

export default function RiwayatPageHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 animate-fade-slide-up">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#004536] leading-6 tracking-tight leading-tight">
          Riwayat Setoran
        </h1>
        <p className="text-[#3F4945] text-sm sm:text-base leading-6">
          Pantau dan kelola seluruh riwayat kontribusi Anda.
        </p>
      </div>

      <div className="flex flex-wrap gap-3 sm:gap-4">
        {STAT_CARDS.map((card, i) => (
          <StatCard key={card.label} {...card} delay={i * 60} />
        ))}
      </div>
    </div>
  )
}
