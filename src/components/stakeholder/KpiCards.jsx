const getMoneyFormat = (amount) => {
  if (!amount) return 'Rp0'
  if (amount >= 1000000) return `Rp${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `Rp${(amount / 1000).toFixed(0)}K`
  return `Rp${amount}`
}

const getVolumeFormat = (volume) => {
  return `${volume?.toLocaleString('id-ID')}L` || '0L'
}

const WalletIcon = () => (
  <svg width="38" height="33" viewBox="0 0 38 33" fill="none">
    <rect width="38" height="33" rx="8" fill="#004536" fillOpacity="0.1" />
    <path d="M21 17C20.1667 17 19.4583 16.7083 18.875 16.125C18.2917 15.5417 18 14.8333 18 14C18 13.1667 18.2917 12.4583 18.875 11.875C19.4583 11.2917 20.1667 11 21 11C21.8333 11 22.5417 11.2917 23.125 11.875C23.7083 12.4583 24 13.1667 24 14C24 14.8333 23.7083 15.5417 23.125 16.125C22.5417 16.7083 21.8333 17 21 17ZM14 20C13.45 20 12.9792 19.8042 12.5875 19.4125C12.1958 19.0208 12 18.55 12 18V10C12 9.45 12.1958 8.97917 12.5875 8.5875C12.9792 8.19583 13.45 8 14 8H28C28.55 8 29.0208 8.19583 29.4125 8.5875C29.8042 8.97917 30 9.45 30 10V18C30 18.55 29.8042 19.0208 29.4125 19.4125C29.0208 19.8042 28.55 20 28 20H14ZM16 18H26C26 17.45 26.1958 16.9792 26.5875 16.5875C26.9792 16.1958 27.45 16 28 16V12C27.45 12 26.9792 11.8042 26.5875 11.4125C26.1958 11.0208 26 10.55 26 10H16C16 10.55 15.8042 11.0208 15.4125 11.4125C15.0208 11.8042 14.55 12 14 12V16C14.55 16 15.0208 16.1958 15.4125 16.5875C15.8042 16.9792 16 17.45 16 18ZM27 24H10C9.45 24 8.97917 23.8042 8.5875 23.4125C8.19583 23.0208 8 22.55 8 22V11H10V22H27V24Z" fill="#004536" />
  </svg>
)

const ClockIcon = () => (
  <svg width="35" height="39" viewBox="0 0 35 39" fill="none">
    <rect width="35" height="39" rx="8" fill="#4E3807" fillOpacity="0.1" />
    <path d="M22 29C20.6167 29 19.4375 28.5125 18.4625 27.5375C17.4875 26.5625 17 25.3833 17 24C17 22.6167 17.4875 21.4375 18.4625 20.4625C19.4375 19.4875 20.6167 19 22 19C23.3833 19 24.5625 19.4875 25.5375 20.4625C26.5125 21.4375 27 22.6167 27 24C27 25.3833 26.5125 26.5625 25.5375 27.5375C24.5625 28.5125 23.3833 29 22 29ZM23.675 26.375L24.375 25.675L22.5 23.8V21H21.5V24.2L23.675 26.375ZM10 28C9.45 28 8.97917 27.8042 8.5875 27.4125C8.19583 27.0208 8 26.55 8 26V12C8 11.45 8.19583 10.9792 8.5875 10.5875C8.97917 10.1958 9.45 10 10 10H14.175C14.3583 9.41667 14.7167 8.9375 15.25 8.5625C15.7833 8.1875 16.3667 8 17 8C17.6667 8 18.2625 8.1875 18.7875 8.5625C19.3125 8.9375 19.6667 9.41667 19.85 10H24C24.55 10 25.0208 10.1958 25.4125 10.5875C25.8042 10.9792 26 11.45 26 12V18.25C25.7 18.0333 25.3833 17.85 25.05 17.7C24.7167 17.55 24.3667 17.4167 24 17.3V12H22V15H12V12H10V26H15.3C15.4167 26.3667 15.55 26.7167 15.7 27.05C15.85 27.3833 16.0333 27.7 16.25 28H10ZM17 12C17.2833 12 17.5208 11.9042 17.7125 11.7125C17.9042 11.5208 18 11.2833 18 11C18 10.7167 17.9042 10.4792 17.7125 10.2875C17.5208 10.0958 17.2833 10 17 10C16.7167 10 16.4792 10.0958 16.2875 10.2875C16.0958 10.4792 16 10.7167 16 11C16 11.2833 16.0958 11.5208 16.2875 11.7125C16.4792 11.9042 16.7167 12 17 12Z" fill="#4E3807" />
  </svg>
)

const StarIcon = () => (
  <svg width="38" height="39" viewBox="0 0 38 39" fill="none">
    <rect width="38" height="39" rx="8" fill="#004536" fillOpacity="0.1" />
    <path d="M15.6 29L13.7 25.8L10.1 25L10.45 21.3L8 18.5L10.45 15.7L10.1 12L13.7 11.2L15.6 8L19 9.45L22.4 8L24.3 11.2L27.9 12L27.55 15.7L30 18.5L27.55 21.3L27.9 25L24.3 25.8L22.4 29L19 27.55L15.6 29ZM17.95 22.05L23.6 16.4L22.2 14.95L17.95 19.2L15.8 17.1L14.4 18.5L17.95 22.05Z" fill="#004536" />
  </svg>
)

export default function KpiCards({ summary, settings, trends = [], isLoading }) {
  const historical_volumes = trends.map(trend => trend.totalFinalLiter || 0)
  const totalHistoricalVolume = historical_volumes.reduce((sum, vol) => sum + vol, 0)

  const predictedFund = settings && totalHistoricalVolume > 0 ?
    getMoneyFormat(totalHistoricalVolume * (settings.referencePricePerLiter || 0)) : 'Rp0'

  const kpiData = [
    {
      label: 'TOTAL PEMBELIAN',
      value: summary ? getMoneyFormat(summary.finalPurchaseAmount) : 'Rp0',
      sub: summary ? getVolumeFormat(summary.finalLiterAcceptedByStakeholder) : '0L',
      subColor: 'text-[#006C49]',
      icon: <WalletIcon />,
    },
    {
      label: 'PENGAJUAN PENDING',
      value: summary?.pendingBatchCount || '0',
      sub: 'Menunggu Validasi Direksi',
      subColor: 'text-[#3F4945]',
      icon: <ClockIcon />,
    },
    {
      label: 'PREDIKSI DANA',
      value: predictedFund,
      sub: `@ Rp${settings?.referencePricePerLiter?.toLocaleString('id-ID')}/L`,
      subColor: 'text-[#006C49]',
      badge: true,
      icon: null,
    },
    {
      label: 'VOLUME TERKUMPUL',
      value: summary ? getVolumeFormat(summary.cleanLiterCollected) : '0L',
      valueColor: 'text-[#0B5E4B]',
      sub: getMoneyFormat(summary?.paidToCommunity) || 'Rp0',
      subColor: 'text-[#3F4945]',
      icon: <StarIcon />,
    },
  ]

  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpiData.map((kpi, i) => (
        <div
          key={i}
          className={`flex flex-col justify-between gap-3 p-5 rounded-xl border-t-2 border border-[#C9A96E] bg-white/70 backdrop-blur-[10px] shadow-sm min-h-[140px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md ${isLoading ? 'animate-pulse' : ''}`}
          style={{ animationDelay: `${i * 80}ms` }}
        >
          {/* Top row */}
          <div className="flex justify-between items-start gap-2">
            <span className="text-[#3F4945] text-xs font-normal uppercase tracking-[0.8px] leading-5">
              {kpi.label}
            </span>
            {kpi.badge ? (
              <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#81F9C1] text-[#006C49] text-[10px] font-bold leading-4 whitespace-nowrap">
                <svg width="8" height="10" viewBox="0 0 8 10" fill="none">
                  <path d="M2 10L2.5 6.5H0L4.5 0H5.5L5 4H8L3 10H2Z" fill="#006C49" />
                </svg>
                LIVE DATA
              </span>
            ) : (
              kpi.icon && <div className="flex-shrink-0">{kpi.icon}</div>
            )}
          </div>

          {/* Bottom */}
          <div>
            <p className={`text-xl font-bold leading-7 ${kpi.valueColor || 'text-[#051C37]'}`}>
              {isLoading ? '...' : kpi.value}
            </p>
            <p className={`text-sm font-semibold leading-6 mt-0.5 ${kpi.subColor}`}>{isLoading ? '...' : kpi.sub}</p>
          </div>
        </div>
      ))}
    </div>
  )
}
