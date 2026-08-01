function getMoneyFormat(amount) {
  if (!amount) return 'Rp0'
  return `Rp${amount.toLocaleString('id-ID')}`
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
    <div className="grid grid-cols-2 xl:grid-cols-3 gap-6">
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
    </div>
  )
}
