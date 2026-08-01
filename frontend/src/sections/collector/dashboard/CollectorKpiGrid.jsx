const TrendUpIcon = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
    <path d="M0.7 6L0 5.3L3.7 1.575L5.7 3.575L8.3 1H7V0H10V3H9V1.7L5.7 5L3.7 3L0.7 6Z" fill="#5A4199" />
  </svg>
)

function KpiCard({ icon, label, value, unit, badge, dotColor, delay = 0 }) {
  return (
    <div
      className="flex flex-col gap-3 p-6 rounded-2xl border border-[#E0DBDF] bg-white
        hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 collector-card-enter relative overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Icon + badge row */}
      <div className="flex items-start justify-between">
        <div className="shrink-0">{icon}</div>
        {badge && (
          <div className="flex items-center gap-1.5">
            {badge}
          </div>
        )}
        {dotColor && (
          <span className="w-2 h-2 rounded-full mt-2" style={{ background: dotColor }} />
        )}
      </div>

      {/* Label + value */}
      <div className="flex flex-col gap-1">
        <span className="text-[#8E8994] text-[11px] font-semibold tracking-[0.6px] uppercase font-poppins">
          {label}
        </span>
        <div className="flex items-baseline gap-1 kpi-value-enter" style={{ animationDelay: `${delay + 100}ms` }}>
          {value}
          {unit && (
            <span className="text-[#5A5661] text-lg font-normal font-poppins">{unit}</span>
          )}
        </div>
      </div>
    </div>
  )
}

const LiterIcon = () => (
  <div className="w-[34px] h-[41px] rounded-xl bg-[#F1E9FF] flex items-center justify-center">
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
      <path d="M1 18C0.716667 18 0.479167 17.9042 0.2875 17.7125C0.0958333 17.5208 0 17.2833 0 17C0 16.7167 0.0958333 16.4792 0.2875 16.2875C0.479167 16.0958 0.716667 16 1 16H2V10H1C0.716667 10 0.479167 9.90417 0.2875 9.7125C0.0958333 9.52083 0 9.28333 0 9C0 8.71667 0.0958333 8.47917 0.2875 8.2875C0.479167 8.09583 0.716667 8 1 8H2V2H1C0.716667 2 0.479167 1.90417 0.2875 1.7125C0.0958333 1.52083 0 1.28333 0 1C0 0.716667 0.0958333 0.479167 0.2875 0.2875C0.479167 0.0958333 0.716667 0 1 0H17C17.2833 0 17.5208 0.0958333 17.7125 0.2875C17.9042 0.479167 18 0.716667 18 1C18 1.28333 17.9042 1.52083 17.7125 1.7125C17.5208 1.90417 17.2833 2 17 2H16V8H17C17.2833 8 17.5208 8.09583 17.7125 8.2875C17.9042 8.47917 18 8.71667 18 9C18 9.28333 17.9042 9.52083 17.7125 9.7125C17.5208 9.90417 17.2833 10 17 10H16V16H17C17.2833 16 17.5208 16.0958 17.7125 16.2875C17.9042 16.4792 18 16.7167 18 17C18 17.2833 17.9042 17.5208 17.7125 17.7125C17.5208 17.9042 17.2833 18 17 18H1ZM9 13C9.83333 13 10.5417 12.7125 11.125 12.1375C11.7083 11.5625 12 10.8667 12 10.05C12 9.4 11.8125 8.84167 11.4375 8.375C11.0625 7.90833 10.25 6.95 9 5.5C7.75 6.93333 6.9375 7.8875 6.5625 8.3625C6.1875 8.8375 6 9.4 6 10.05C6 10.8667 6.29167 11.5625 6.875 12.1375C7.45833 12.7125 8.16667 13 9 13Z" fill="#22005D" />
    </svg>
  </div>
)

const ValidasiIcon = () => (
  <div className="w-[38px] h-[42px] rounded-xl bg-[#FFDF93] flex items-center justify-center">
    <svg width="22" height="19" viewBox="0 0 22 19" fill="none">
      <path d="M0 19L11 0L22 19H0ZM11 16C11.2833 16 11.5208 15.9042 11.7125 15.7125C11.9042 15.5208 12 15.2833 12 15C12 14.7167 11.9042 14.4792 11.7125 14.2875C11.5208 14.0958 11.2833 14 11 14C10.7167 14 10.4792 14.0958 10.2875 14.2875C10.0958 14.4792 10 14.7167 10 15C10 15.2833 10.0958 15.5208 10.2875 15.7125C10.4792 15.9042 10.7167 16 11 16ZM10 13H12V8H10V13Z" fill="#241A00" />
    </svg>
  </div>
)

const PengajuanIcon = () => (
  <div className="w-[35px] h-[44px] rounded-xl bg-[#F1EBFD] flex items-center justify-center">
    <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
      <path d="M14 21C12.6167 21 11.4375 20.5125 10.4625 19.5375C9.4875 18.5625 9 17.3833 9 16C9 14.6167 9.4875 13.4375 10.4625 12.4625C11.4375 11.4875 12.6167 11 14 11C15.3833 11 16.5625 11.4875 17.5375 12.4625C18.5125 13.4375 19 14.6167 19 16C19 17.3833 18.5125 18.5625 17.5375 19.5375C16.5625 20.5125 15.3833 21 14 21ZM15.675 18.375L16.375 17.675L14.5 15.8V13H13.5V16.2L15.675 18.375ZM2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H6.175C6.35833 1.41667 6.71667 0.9375 7.25 0.5625C7.78333 0.1875 8.36667 0 9 0C9.66667 0 10.2625 0.1875 10.7875 0.5625C11.3125 0.9375 11.6667 1.41667 11.85 2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V10.25C17.7 10.0333 17.3833 9.85 17.05 9.7C16.7167 9.55 16.3667 9.41667 16 9.3V4H14V7H4V4H2V18H7.3C7.41667 18.3667 7.55 18.7167 7.7 19.05C7.85 19.3833 8.03333 19.7 8.25 20H2ZM9 4C9.28333 4 9.52083 3.90417 9.7125 3.7125C9.90417 3.52083 10 3.28333 10 3C10 2.71667 9.90417 2.47917 9.7125 2.2875C9.52083 2.09583 9.28333 2 9 2C8.71667 2 8.47917 2.09583 8.2875 2.2875C8.09583 2.47917 8 2.71667 8 3C8 3.28333 8.09583 3.52083 8.2875 3.7125C8.47917 3.90417 8.71667 4 9 4Z" fill="#645A7D" />
    </svg>
  </div>
)

const PendapatanIcon = () => (
  <div className="w-[35px] h-[41px] rounded-xl bg-[#F0EBEB] flex items-center justify-center">
    <svg width="19" height="18" viewBox="0 0 19 18" fill="none">
      <path d="M2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2H10C8.81667 2 7.85417 2.37083 7.1125 3.1125C6.37083 3.85417 6 4.81667 6 6V12C6 13.1833 6.37083 14.1458 7.1125 14.8875C7.85417 15.6292 8.81667 16 10 16H18C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2ZM10 14C9.45 14 8.97917 13.8042 8.5875 13.4125C8.19583 13.0208 8 12.55 8 12V6C8 5.45 8.19583 4.97917 8.5875 4.5875C8.97917 4.19583 9.45 4 10 4H17C17.55 4 18.0208 4.19583 18.4125 4.5875C18.8042 4.97917 19 5.45 19 6V12C19 12.55 18.8042 13.0208 18.4125 13.4125C18.0208 13.8042 17.55 14 17 14H10ZM13 10.5C13.4333 10.5 13.7917 10.3583 14.075 10.075C14.3583 9.79167 14.5 9.43333 14.5 9C14.5 8.56667 14.3583 8.20833 14.075 7.925C13.7917 7.64167 13.4333 7.5 13 7.5C12.5667 7.5 12.2083 7.64167 11.925 7.925C11.6417 8.20833 11.5 8.56667 11.5 9C11.5 9.43333 11.6417 9.79167 11.925 10.075C12.2083 10.3583 12.5667 10.5 13 10.5Z" fill="#5A4199" />
    </svg>
  </div>
)

export default function CollectorKpiGrid({ data, isLoading }) {
  const getKpiData = () => {
    if (!data) return []

    const summary = data.summary || data

    return [
      {
        id: 'liter',
        icon: <LiterIcon />,
        label: 'Total Liter Masuk',
        value: <span className="text-[#1D1B1A] text-2xl font-bold font-poppins">{(summary.totalIncomingLiter || 0).toLocaleString('id-ID')}</span>,
        unit: 'L',
        delay: 0,
      },
      {
        id: 'validasi',
        icon: <ValidasiIcon />,
        label: 'Perlu Validasi',
        value: (
          <div className="flex items-center gap-2">
            <span className="text-[#C19A00] text-2xl font-bold font-poppins">{summary.pendingValidationCount || 0}</span>
            <span className="text-[#C19A00] text-sm font-medium font-poppins">Tertunda</span>
          </div>
        ),
        dotColor: '#C19A00',
        delay: 80,
      },
      {
        id: 'pengajuan',
        icon: <PengajuanIcon />,
        label: 'Pengajuan ke HEN',
        value: (
          <div className="flex items-center gap-2">
            <span className="text-[#1D1B1A] text-2xl font-bold font-poppins">{summary.henSubmissionCount || 0}</span>
            <span className="text-[#5A5661] text-sm font-medium font-poppins">Dalam Proses</span>
          </div>
        ),
        delay: 160,
      },
      {
        id: 'pendapatan',
        icon: <PendapatanIcon />,
        label: 'Pendapatan Bulan Ini',
        value: <span className="text-[#1D1B1A] text-2xl font-bold font-poppins">Rp{((summary.monthlyRevenueFromHen || 0) / 1000000).toFixed(1)}</span>,
        unit: 'J',
        delay: 240,
      },
    ]
  }

  const kpiData = getKpiData()

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {isLoading ? (
        Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-[150px] bg-white rounded-2xl border border-[#E0DBDF] animate-pulse" />
        ))
      ) : (
        kpiData.map((kpi) => (
          <KpiCard
            key={kpi.id}
            icon={kpi.icon}
            label={kpi.label}
            value={kpi.value}
            unit={kpi.unit}
            badge={kpi.badge}
            dotColor={kpi.dotColor}
            delay={kpi.delay}
          />
        ))
      )}
    </div>
  )
}
