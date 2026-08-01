import { useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'

const PERIOD_OPTIONS = ['3 Bulan Terakhir', '6 Bulan Terakhir', '12 Bulan Terakhir']

const chartData = [
  { month: 'Jan', price: 820 },
  { month: 'Feb', price: 870 },
  { month: 'Mar', price: 795 },
  { month: 'Apr', price: 910 },
  { month: 'Mei', price: 942.5, highlight: true },
  { month: 'Jun', price: 855 },
  { month: 'Jul', price: 780 },
  { month: 'Agu', price: 920 },
  { month: 'Sep', price: 880 },
  { month: 'Okt', price: 960 },
  { month: 'Nov', price: 830 },
  { month: 'Des', price: 880 },
]

const TrendUpIcon = () => (
  <svg width="15" height="9" viewBox="0 0 15 9" fill="none">
    <path d="M1.05 9L0 7.95L5.55 2.3625L8.55 5.3625L12.45 1.5H10.5V0H15V4.5H13.5V2.55L8.55 7.5L5.55 4.5L1.05 9Z" fill="#81F9C1" />
  </svg>
)

const ChevronDownIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
    <path d="M7.2 9.6L12 14.4L16.8 9.6" stroke="#6B7280" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="flex flex-col gap-0.5 px-3 py-2 rounded-lg bg-[#004536] shadow-lg">
      <p className="text-[#81F9C1] text-xs font-medium">{label}</p>
      <p className="text-white text-sm font-bold">${payload[0].value}</p>
    </div>
  )
}

export default function PriceChartSection() {
  const [period, setPeriod] = useState('6 Bulan Terakhir')
  const [dropdownOpen, setDropdownOpen] = useState(false)

  const visibleData =
    period === '3 Bulan Terakhir'
      ? chartData.slice(0, 3)
      : period === '12 Bulan Terakhir'
      ? chartData
      : chartData.slice(0, 6)

  return (
    <div className="flex flex-col gap-6 p-5 sm:p-8 rounded-3xl border-t-2 border-[#C9A96E] bg-white/80 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[10px] overflow-hidden">
      {/* Header row */}
      <div className="flex flex-col xs:flex-row xs:items-start xs:justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <p className="text-[#004536] text-base font-normal leading-6">Tren Harga Waste Oil Global</p>
          <p className="text-[#3F4945] text-sm italic font-normal leading-6">
            Data diperbarui secara real-time setiap 15 menit
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Trend badge */}
          <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-[#0B5E4B] text-[#81F9C1] text-sm font-normal leading-6">
            <TrendUpIcon />
            +4.2% Bulan Ini
          </span>

          {/* Period selector */}
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((v) => !v)}
              className="flex items-center gap-1.5 px-3 py-2 text-[#004536] text-sm font-bold leading-6 hover:bg-[#004536]/5 rounded-lg transition-colors duration-200"
            >
              {period}
              <span className={`transition-transform duration-200 ${dropdownOpen ? 'rotate-180' : ''}`}>
                <ChevronDownIcon />
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-1 z-10 flex flex-col min-w-[180px] py-1 rounded-xl bg-white shadow-xl border border-[#BEC9C3]/30 animate-fade-in">
                {PERIOD_OPTIONS.map((opt) => (
                  <button
                    key={opt}
                    onClick={() => { setPeriod(opt); setDropdownOpen(false) }}
                    className={`px-4 py-2 text-left text-sm transition-colors duration-150 ${opt === period ? 'text-[#004536] font-bold bg-[#004536]/5' : 'text-[#3F4945] hover:bg-[#F5F7F6]'}`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="w-full rounded-2xl bg-[#F0F3FF]/50 p-4" style={{ height: 320 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={visibleData} barCategoryGap="35%" margin={{ top: 24, right: 8, left: -10, bottom: 0 }}>
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6F7975', fontSize: 12, fontFamily: 'Plus Jakarta Sans' }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6F7975', fontSize: 11, fontFamily: 'Plus Jakarta Sans' }}
              tickFormatter={(v) => `$${v}`}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(0,69,54,0.05)', radius: 8 }} />
            <Bar dataKey="price" radius={[8, 8, 0, 0]} label={false}>
              {visibleData.map((entry, idx) => (
                <Cell
                  key={`cell-${idx}`}
                  fill={entry.highlight ? 'rgba(201,169,110,0.80)' : `rgba(0,69,54,${0.20 + (idx % 4) * 0.10})`}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
