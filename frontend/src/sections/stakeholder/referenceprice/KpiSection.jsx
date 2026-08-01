import { useEffect, useRef, useState } from 'react'
import api from '../../../services/api'

function Badge({ badge }) {
  if (badge.type === 'up') {
    return (
      <span className="flex items-center gap-1 px-2 py-1 rounded bg-[#81F9C1]/30 text-[#00734E] text-xs font-bold leading-4">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M0.7 6L0 5.3L3.7 1.575L5.7 3.575L8.3 1H7V0H10V3H9V1.7L5.7 5L3.7 3L0.7 6Z" fill="#00734E" />
        </svg>
        {badge.text}
      </span>
    )
  }
  if (badge.type === 'down') {
    return (
      <span className="flex items-center gap-1 px-2 py-1 rounded bg-[#FFDAD6] text-[#93000A] text-xs font-bold leading-4">
        <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
          <path d="M7 6V5H8.3L5.7 2.425L3.7 4.425L0 0.7L0.7 0L3.7 3L5.7 1L9 4.3V3H10V6H7Z" fill="#93000A" />
        </svg>
        {badge.text}
      </span>
    )
  }
  if (badge.type === 'tag-green') {
    return (
      <span className="px-2 py-1 rounded bg-[#A8F1D8] text-[#005140] text-xs font-bold leading-4">
        {badge.text}
      </span>
    )
  }
  return null
}

export default function KpiSection() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  const [kpiData, setKpiData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true) }, { threshold: 0.1 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const fetchKpiData = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/dashboard/price-reference')
        setKpiData(response.data?.priceData || {})
      } catch (error) {
        console.error('Failed to fetch KPI data:', error)
        setKpiData({})
      } finally {
        setIsLoading(false)
      }
    }
    fetchKpiData()
  }, [])

  const getPercentageColor = (percentage) => {
    if (!percentage) return { type: 'tag-green', text: 'N/A' }
    if (percentage > 0) return { type: 'up', text: `+${percentage.toFixed(1)}%` }
    if (percentage < 0) return { type: 'down', text: `${percentage.toFixed(1)}%` }
    return { type: 'tag-green', text: 'Neutral' }
  }

  const buyPrice = kpiData?.buyPrice || 0
  const globalIndex = kpiData?.globalIndex || 0
  const priceGap = kpiData?.priceGap || 0
  const predictedPrice = kpiData?.predictedPrice || 0
  const buyPriceChange = kpiData?.buyPriceChange || 0
  const globalIndexChange = kpiData?.globalIndexChange || 0
  const priceGapChange = kpiData?.priceGapChange || 0
  const predictedPriceChange = kpiData?.predictedPriceChange || 0

  const kpiItems = [
    {
      label: 'HARGA BELI HEN (TODAY)',
      value: `Rp\n${buyPrice?.toLocaleString('id-ID') || '0'}`,
      unit: '/kg',
      badge: getPercentageColor(buyPriceChange),
      icon: (
        <svg width="18" height="21" viewBox="0 0 18 21" fill="none">
          <path d="M2 21C1.45 21 0.979167 20.8042 0.5875 20.4125C0.195833 20.0208 0 19.55 0 19V7C0 6.45 0.195833 5.97917 0.5875 5.5875C0.979167 5.19583 1.45 5 2 5H4C4 3.61667 4.4875 2.4375 5.4625 1.4625C6.4375 0.4875 7.61667 0 9 0C10.3833 0 11.5625 0.4875 12.5375 1.4625C13.5125 2.4375 14 3.61667 14 5H16C16.55 5 17.0208 5.19583 17.4125 5.5875C17.8042 5.97917 18 6.45 18 7V19C18 19.55 17.8042 20.0208 17.4125 20.4125C17.0208 20.8042 16.55 21 16 21H2ZM2 19H16V7H2V19ZM9 13C10.3833 13 11.5625 12.5125 12.5375 11.5375C13.5125 10.5625 14 9.38333 14 8H12C12 8.83333 11.7083 9.54167 11.125 10.125C10.5417 10.7083 9.83333 11 9 11C8.16667 11 7.45833 10.7083 6.875 10.125C6.29167 9.54167 6 8.83333 6 8H4C4 9.38333 4.4875 10.5625 5.4625 11.5375C6.4375 12.5125 7.61667 13 9 13ZM6 5H12C12 4.16667 11.7083 3.45833 11.125 2.875C10.5417 2.29167 9.83333 2 9 2C8.16667 2 7.45833 2.29167 6.875 2.875C6.29167 3.45833 6 4.16667 6 5Z" fill="#004536"/>
        </svg>
      ),
      iconBg: 'bg-[#004536]/10',
    },
    {
      label: 'INDEKS GLOBAL (ROTTERDAM)',
      value: `Rp${globalIndex?.toLocaleString('id-ID') || '0'}`,
      unit: '/ton',
      badge: getPercentageColor(globalIndexChange),
      icon: (
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M10.0125 20C8.6375 20 7.34167 19.7375 6.125 19.2125C4.90833 18.6875 3.84583 17.9708 2.9375 17.0625C2.02917 16.1542 1.3125 15.0917 0.7875 13.875C0.2625 12.6583 0 11.3625 0 9.9875C0 8.6125 0.2625 7.32083 0.7875 6.1125C1.3125 4.90417 2.02917 3.84583 2.9375 2.9375C3.84583 2.02917 4.90833 1.3125 6.125 0.7875C7.34167 0.2625 8.6375 0 10.0125 0C11.3875 0 12.6792 0.2625 13.8875 0.7875C15.0958 1.3125 16.1542 2.02917 17.0625 2.9375C17.9708 3.84583 18.6875 4.90417 19.2125 6.1125C19.7375 7.32083 20 8.6125 20 9.9875C20 11.3625 19.7375 12.6583 19.2125 13.875C18.6875 15.0917 17.9708 16.1542 17.0625 17.0625C16.1542 17.9708 15.0958 18.6875 13.8875 19.2125C12.6792 19.7375 11.3875 20 10.0125 20ZM10 17.95C10.4333 17.35 10.8083 16.725 11.125 16.075C11.4417 15.425 11.7 14.7333 11.9 14H8.1C8.3 14.7333 8.55833 15.425 8.875 16.075C9.19167 16.725 9.56667 17.35 10 17.95ZM7.4 17.55C7.1 17 6.8375 16.4292 6.6125 15.8375C6.3875 15.2458 6.2 14.6333 6.05 14H3.1C3.58333 14.8333 4.1875 15.5583 4.9125 16.175C5.6375 16.7917 6.46667 17.25 7.4 17.55ZM12.6 17.55C13.5333 17.25 14.3625 16.7917 15.0875 16.175C15.8125 15.5583 16.4167 14.8333 16.9 14H13.95C13.8 14.6333 13.6125 15.2458 13.3875 15.8375C13.1625 16.4292 12.9 17 12.6 17.55ZM2.25 12H5.65C5.6 11.6667 5.5625 11.3375 5.5375 11.0125C5.5125 10.6875 5.5 10.35 5.5 10C5.5 9.65 5.5125 9.3125 5.5375 8.9875C5.5625 8.6625 5.6 8.33333 5.65 8H2.25C2.16667 8.33333 2.10417 8.6625 2.0625 8.9875C2.02083 9.3125 2 9.65 2 10C2 10.35 2.02083 10.6875 2.0625 11.0125C2.10417 11.3375 2.16667 11.6667 2.25 12ZM14.35 12H17.75C17.8333 11.6667 17.8958 11.3375 17.9375 11.0125C17.9792 10.6875 18 10.35 18 10C18 9.65 17.9792 9.3125 17.9375 8.9875C17.8958 8.6625 17.8333 8.33333 17.75 8H14.35C14.4 8.33333 14.4375 8.6625 14.4625 8.9875C14.4875 9.3125 14.5 9.65 14.5 10C14.5 10.35 14.4875 10.6875 14.4625 11.0125C14.4375 11.3375 14.4 11.6667 14.35 12ZM6.05 6H9C9.15 5.36667 9.3375 4.75417 9.5625 4.1625C9.7875 3.57083 10.05 3 10.35 2.45C9.91667 2.6 9.54167 2.83333 9.225 3.15C8.90833 3.46667 8.63333 3.83333 8.4 4.25C8.16667 4.66667 7.98333 5.11667 7.85 5.6C7.71667 6.08333 7.6 6.58333 7.5 7H6.05C5.96667 6.58333 5.85 6.08333 5.7 5.6C5.55 5.11667 5.35833 4.66667 5.125 4.25C4.89167 3.83333 4.61667 3.46667 4.3 3.15C3.98333 2.83333 3.60833 2.6 3.175 2.45C3.475 3 3.73333 3.57083 3.95 4.1625C4.16667 4.75417 4.35417 5.36667 4.5 6H6.05ZM14.5 6H13C13.1333 5.6 13.25 5.11667 13.35 4.6C13.45 4.08333 13.6 3.58333 13.8 3.1C14.1833 3.25 14.525 3.48333 14.825 3.8C15.125 4.11667 15.3583 4.48333 15.525 4.9C15.6917 5.31667 15.8083 5.78333 15.875 6.3V6H14.5Z" fill="#4E3807"/>
        </svg>
      ),
      iconBg: 'bg-[#4E3807]/10',
    },
    {
      label: 'SELISIH HARGA (GAP)',
      value: `Rp\n${priceGap?.toLocaleString('id-ID') || '0'}`,
      unit: '/kg',
      badge: getPercentageColor(priceGapChange),
      icon: (
        <svg width="20" height="19" viewBox="0 0 20 19" fill="none">
          <path d="M0 19V17H9V5.825C8.56667 5.675 8.19167 5.44167 7.875 5.125C7.55833 4.80833 7.325 4.43333 7.175 4H4L7 11C7 11.8333 6.65833 12.5417 5.975 13.125C5.29167 13.7083 4.46667 14 3.5 14C2.53333 14 1.70833 13.7083 1.025 13.125C0.341667 12.5417 0 11.8333 0 11L3 4H1V2H7.175C7.375 1.41667 7.73333 0.9375 8.25 0.5625C8.76667 0.1875 9.35 0 10 0C10.65 0 11.2333 0.1875 11.75 0.5625C12.2667 0.9375 12.625 1.41667 12.825 2H19V4H17L20 11C20 11.8333 19.6583 12.5417 18.975 13.125C18.2917 13.7083 17.4667 14 16.5 14C15.5333 14 14.7083 13.7083 14.025 13.125C13.3417 12.5417 13 11.8333 13 11L16 4H12.825C12.675 4.43333 12.4417 4.80833 12.125 5.125C11.8083 5.44167 11.4333 5.675 11 5.825V17H20V19H0ZM14.625 11H18.375L16.5 6.65L14.625 11ZM1.625 11H5.375L3.5 6.65L1.625 11ZM10 4C10.2833 4 10.5208 3.90417 10.7125 3.7125C10.9042 3.52083 11 3.28333 11 3C11 2.71667 10.9042 2.47917 10.7125 2.2875C10.5208 2.09583 10.2833 2 10 2C9.71667 2 9.47917 2.09583 9.2875 2.2875C9.09583 2.47917 9 2.71667 9 3C9 3.28333 9.09583 3.52083 9.2875 3.7125C9.47917 3.90417 9.71667 4 10 4Z" fill="#006C49"/>
        </svg>
      ),
      iconBg: 'bg-[#006C49]/10',
    },
    {
      label: 'PREDIKSI HARGA BESOK',
      value: `Rp\n${predictedPrice?.toLocaleString('id-ID') || '0'}`,
      unit: '/kg',
      badge: getPercentageColor(predictedPriceChange),
      icon: (
        <svg width="22" height="19" viewBox="0 0 22 19" fill="none">
          <path d="M7.5 7L6.4 4.6L4 3.5L6.4 2.4L7.5 0L8.6 2.4L11 3.5L8.6 4.6L7.5 7ZM14 10L13.05 7.95L11 7L13.05 6.05L14 4L14.95 6.05L17 7L14.95 7.95L14 10ZM3 12L2.05 9.95L0 9L2.05 8.05L3 6L3.95 8.05L6 9L3.95 9.95L3 12ZM3.5 18.5L2 17L9.5 9.5L13.5 13.5L20.6 5.525L22 6.925L13.5 16.5L9.5 12.5L3.5 18.5Z" fill="#0B5E4B"/>
        </svg>
      ),
      iconBg: 'bg-[#0B5E4B]/10',
    },
  ]

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
        {Array(4).fill(0).map((_, i) => (
          <div key={i} className="h-32 rounded-2xl bg-white/50 backdrop-blur-[10px] animate-pulse" />
        ))}
      </div>
    )
  }

  return (
    <div ref={ref} className="grid grid-cols-1 xs:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6">
      {kpiItems.map((kpi, i) => (
        <div
          key={kpi.label}
          className="price-card-enter flex flex-col gap-4 p-6 rounded-2xl border border-[#C9A96E] border-t-2 bg-white/70 backdrop-blur-[10px] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.05)] hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
          style={{
            animationDelay: visible ? `${i * 80}ms` : '0ms',
            animationPlayState: visible ? 'running' : 'paused',
          }}
        >
          <div className="flex items-start justify-between">
            <div className={`flex items-center justify-center w-11 h-11 rounded-xl ${kpi.iconBg} flex-shrink-0`}>
              {kpi.icon}
            </div>
            <Badge badge={kpi.badge} />
          </div>
          <div>
            <p className="text-[#6F7975] text-[11px] font-medium leading-4 tracking-[0.6px] uppercase mb-2">
              {kpi.label}
            </p>
            <div className="flex items-end gap-1">
              <span className="text-[#051C37] text-3xl font-semibold leading-10 whitespace-pre-line">
                {kpi.value}
              </span>
              <span className="text-[#6F7975] text-sm font-medium leading-5 pb-1">{kpi.unit}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
