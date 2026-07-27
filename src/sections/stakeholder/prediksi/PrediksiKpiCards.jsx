function getMoneyFormat(amount) {
  if (!amount) return '$0'
  if (amount >= 1000000) return `$${(amount / 1000000).toFixed(2)}M`
  if (amount >= 1000) return `$${(amount / 1000).toFixed(0)}K`
  return `$${amount}`
}

function ArrowUpIcon({ color }) {
  return (
    <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
      <path d="M4.08333 9.33333V2.23125L0.816667 5.49792L0 4.66667L4.66667 0L9.33333 4.66667L8.51667 5.49792L5.25 2.23125V9.33333H4.08333Z" fill={color} />
    </svg>
  )
}

function StarIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
      <path d="M3.5 9.33333L5.83333 7.55417L8.16667 9.33333L7.29167 6.44583L9.625 4.78333H6.76667L5.83333 1.75L4.9 4.78333H2.04167L4.375 6.44583L3.5 9.33333ZM5.83333 11.6667C5.02639 11.6667 4.26806 11.5135 3.55833 11.2073C2.84861 10.901 2.23125 10.4854 1.70625 9.96042C1.18125 9.43542 0.765625 8.81806 0.459375 8.10833C0.153125 7.39861 0 6.64028 0 5.83333C0 5.02639 0.153125 4.26806 0.459375 3.55833C0.765625 2.84861 1.18125 2.23125 1.70625 1.70625C2.23125 1.18125 2.84861 0.765625 3.55833 0.459375C4.26806 0.153125 5.02639 0 5.83333 0C6.64028 0 7.39861 0.153125 8.10833 0.459375C8.81806 0.765625 9.43542 1.18125 9.96042 1.70625C10.4854 2.23125 10.901 2.84861 11.2073 3.55833C11.5135 4.26806 11.6667 5.02639 11.6667 5.83333C11.6667 6.64028 11.5135 7.39861 11.2073 8.10833C10.901 8.81806 10.4854 9.43542 9.96042 9.96042C9.43542 10.4854 8.81806 10.901 8.10833 11.2073C7.39861 11.5135 6.64028 11.6667 5.83333 11.6667Z" fill="#00734E" />
    </svg>
  )
}

function AiTrustCard() {
  return (
    <div className="flex flex-col gap-2 flex-1 p-6 rounded-xl border-t-[3px] border-[#C9A96E] border-x border-b bg-[rgba(11,94,75,0.05)] backdrop-blur-[10px]" style={{ borderColor: '#C9A96E' }}>
      <div className="relative h-[72px]">
        <span className="text-[#6F7975] text-base font-extrabold leading-6 tracking-[1.6px] uppercase absolute left-0 top-0">
          TINGKAT<br />KEPERCAYAAN<br />AI
        </span>
        <svg className="absolute right-0 top-4" width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M3 20V15.7C2.05 14.8333 1.3125 13.8208 0.7875 12.6625C0.2625 11.5042 0 10.2833 0 9C0 6.5 0.875 4.375 2.625 2.625C4.375 0.875 6.5 0 9 0C11.0833 0 12.9292 0.6125 14.5375 1.8375C16.1458 3.0625 17.1917 4.65833 17.675 6.625L18.975 11.75C19.0583 12.0667 19 12.3542 18.8 12.6125C18.6 12.8708 18.3333 13 18 13H16V16C16 16.55 15.8042 17.0208 15.4125 17.4125C15.0208 17.8042 14.55 18 14 18H12V20H10V16H14V11H16.7L15.75 7.125C15.3667 5.60833 14.55 4.375 13.3 3.425C12.05 2.475 10.6167 2 9 2C7.06667 2 5.41667 2.675 4.05 4.025C2.68333 5.375 2 7.01667 2 8.95C2 9.95 2.20417 10.9 2.6125 11.8C3.02083 12.7 3.6 13.5 4.35 14.2L5 14.8V20H3Z" fill="#006C49" />
        </svg>
      </div>

      <div className="flex items-end justify-between">
        <span className="text-[#004536] text-base font-extrabold leading-6">94.8%</span>
        <svg width="64" height="64" viewBox="0 0 64 64" fill="none">
          <g clipPath="url(#clip-ai-trust)">
            <path d="M32 60C47.4536 60 60 47.4536 60 32C60 16.5464 47.4536 4 32 4C16.5464 4 4 16.5464 4 32C4 47.4536 16.5464 60 32 60V60" stroke="#D5E3FF" strokeWidth="4" />
            <path d="M32 60C47.4536 60 60 47.4536 60 32C60 16.5464 47.4536 4 32 4C16.5464 4 4 16.5464 4 32C4 47.4536 16.5464 60 32 60V60" stroke="#006C49" strokeWidth="4" />
            <rect x="1.04102" y="20.9109" width="25.6418" height="14.4872" transform="rotate(-57.6516 1.04102 20.9109)" fill="#F2F7F6" />
          </g>
          <defs>
            <clipPath id="clip-ai-trust">
              <rect width="64" height="64" fill="white" transform="matrix(0 -1 1 0 0 64)" />
            </clipPath>
          </defs>
        </svg>
      </div>
    </div>
  )
}

export default function PrediksiKpiCards({ trends = [], settings, isLoading }) {
  const historical_volumes = trends.map(trend => trend.totalFinalLiter || 0)
  const totalHistoricalVolume = historical_volumes.reduce((sum, vol) => sum + vol, 0)
  const referencePricePerLiter = settings?.referencePricePerLiter || 0
  
  const predictedRevenue = totalHistoricalVolume * referencePricePerLiter
  const operationalCost = predictedRevenue * 0.27
  const netProfit = predictedRevenue - operationalCost

  const kpiCards = [
    {
      label: 'PENDAPATAN DIPREDIKSI',
      value: isLoading ? '...' : getMoneyFormat(predictedRevenue),
      badge: { text: `dari ${historical_volumes.length} periode`, color: '#00734E', arrowUp: false },
      icon: (
        <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
          <path d="M1.4 12L0 10.6L7.4 3.15L11.4 7.15L16.6 2H14V0H20V6H18V3.4L11.4 10L7.4 6L1.4 12Z" fill="#C9A96E" />
        </svg>
      ),
    },
    {
      label: 'BIAYA OPERASIONAL',
      value: isLoading ? '...' : getMoneyFormat(operationalCost),
      badge: { text: '27% dari pendapatan', color: '#BA1A1A', arrowUp: false },
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
          <path d="M4 14H6V9H4V14ZM12 14H14V4H12V14ZM8 14H10V11H8V14ZM8 9H10V7H8V9ZM2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2ZM2 16H16V2H2V16Z" fill="#BA1A1A" />
        </svg>
      ),
    },
    {
      label: 'PROYEKSI LABA BERSIH',
      value: isLoading ? '...' : getMoneyFormat(netProfit),
      badge: { text: 'Dari analisis tren', color: '#00734E', star: true },
      icon: (
        <svg width="22" height="16" viewBox="0 0 22 16" fill="none">
          <path d="M13 9C12.1667 9 11.4583 8.70833 10.875 8.125C10.2917 7.54167 10 6.83333 10 6C10 5.16667 10.2917 4.45833 10.875 3.875C11.4583 3.29167 12.1667 3 13 3C13.8333 3 14.5417 3.29167 15.125 3.875C15.7083 4.45833 16 5.16667 16 6C16 6.83333 15.7083 7.54167 15.125 8.125C14.5417 8.70833 13.8333 9 13 9ZM6 12C5.45 12 4.97917 11.8042 4.5875 11.4125C4.19583 11.0208 4 10.55 4 10V2C4 1.45 4.19583 0.979167 4.5875 0.5875C4.97917 0.195833 5.45 0 6 0H20C20.55 0 21.0208 0.195833 21.4125 0.5875C21.8042 0.979167 22 1.45 22 2V10C22 10.55 21.8042 11.0208 21.4125 11.4125C21.0208 11.8042 20.55 12 20 12H6ZM8 10H18C18 9.45 18.1958 8.97917 18.5875 8.5875C18.9792 8.19583 19.45 8 20 8V4C19.45 4 18.9792 3.80417 18.5875 3.4125C18.1958 3.02083 18 2.55 18 2H8C8 2.55 7.80417 3.02083 7.4125 3.4125C7.02083 3.80417 6.55 4 6 4V8C6.55 8 7.02083 8.19583 7.4125 8.5875C7.80417 8.97917 8 9.45 8 10ZM19 16H2C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V3H2V14H19V16Z" fill="#004536" />
        </svg>
      ),
    },
  ]

  return (
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-6">
      {kpiCards.map((card) => (
        <div
          key={card.label}
          className="flex flex-col gap-2 p-6 rounded-xl border-t-[3px] border-x border-b bg-white/70 backdrop-blur-[10px] transition-all duration-300"
          style={{ borderColor: '#C9A96E', opacity: isLoading ? 0.6 : 1 }}
        >
          <div className="flex items-start justify-between">
            <span className="text-[#6F7975] text-base font-extrabold leading-6 tracking-[1.6px] uppercase">
              {card.label}
            </span>
            {card.icon}
          </div>
          <span className="text-[#004536] text-base font-extrabold leading-6">{card.value}</span>
          <div className="flex items-center gap-1">
            {card.badge.arrowUp && <ArrowUpIcon color={card.badge.color} />}
            {card.badge.star && <StarIcon />}
            <span className="text-base font-bold leading-6" style={{ color: card.badge.color }}>
              {card.badge.text}
            </span>
          </div>
        </div>
      ))}
      <AiTrustCard />
    </div>
  )
}
