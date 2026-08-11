import { useMemo } from 'react'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'

const formatNumber = (value) => Number(value || 0).toLocaleString('id-ID')

const formatMonth = (month, options = { month: 'short', year: '2-digit' }) => {
  const date = new Date(`${month}-01T00:00:00`)

  return Number.isNaN(date.getTime())
    ? month
    : date.toLocaleDateString('id-ID', options)
}

const formatAxisValue = (value) => {
  if (value >= 1000) return `${(value / 1000).toLocaleString('id-ID', { maximumFractionDigits: 1 })}k`
  return formatNumber(value)
}

function TrendTooltip({ active, payload }) {
  if (!active || !payload?.length) return null

  const trend = payload[0].payload

  return (
    <div className="flex max-w-[calc(100vw-2rem)] flex-col gap-1 rounded-lg bg-[#004536] px-3 py-2 text-xs shadow-lg">
      <p className="font-semibold text-[#81F9C1]">{formatMonth(trend.month, { month: 'long', year: 'numeric' })}</p>
      <p className="text-white">Volume: {formatNumber(trend.totalFinalLiter)} L</p>
      <p className="text-white">Pembelian: Rp{formatNumber(trend.totalPurchaseAmount)}</p>
      <p className="text-white">Harga rata-rata: Rp{formatNumber(trend.averagePricePerLiter)}/L</p>
      <p className="text-white/75">{formatNumber(trend.batchCount)} batch</p>
    </div>
  )
}

export default function PredictionChart({ trends = [], settings, isLoading }) {
  const chartData = useMemo(() => {
    if (!Array.isArray(trends)) return []

    return [...trends]
      .filter((trend) => trend?.month)
      .sort((a, b) => a.month.localeCompare(b.month))
  }, [trends])

  return (
    <div className="flex min-w-0 flex-col gap-4 rounded-2xl border border-[#C9A96E] border-t-2 bg-white/70 p-4 shadow-sm backdrop-blur-[10px] sm:gap-6 sm:p-5">
      <div className="flex min-w-0 flex-col gap-3 xs:flex-row xs:items-start xs:justify-between sm:gap-4">
        <div className="min-w-0">
          <h3 className="break-words text-base font-normal leading-6 text-[#051C37]">
            Tren Volume Pembelian Historis
          </h3>
          <p className="mt-1 break-words text-xs leading-5 text-[#3F4945] sm:text-sm sm:leading-6">
            Volume liter pembelian periode sebelumnya per bulan.
          </p>
        </div>
        {settings && (
          <div className="shrink-0 xs:text-right">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[#3F4945] sm:text-xs">
              Harga Acuan
            </p>
            <p className="text-base font-bold text-[#004536] sm:text-lg">
              Rp{formatNumber(settings.referencePricePerLiter)}/L
            </p>
          </div>
        )}
      </div>

      <div className="min-w-0">
        {isLoading ? (
          <div className="flex h-56 items-center justify-center text-sm text-[#3F4945] sm:h-64">
            Memuat data tren...
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex h-56 items-center justify-center text-sm text-[#3F4945] sm:h-64">
            Belum ada data tren
          </div>
        ) : (
          <div className="h-56 min-w-0 w-full sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                barCategoryGap="28%"
                margin={{ top: 12, right: 4, left: -16, bottom: 0 }}
              >
                <CartesianGrid vertical={false} stroke="rgba(190,201,195,0.35)" />
                <XAxis
                  dataKey="month"
                  axisLine={{ stroke: '#BEC9C3', strokeWidth: 1 }}
                  tickLine={false}
                  tick={{ fill: '#6F7975', fontSize: 10 }}
                  tickFormatter={(month) => formatMonth(month)}
                  interval="preserveStartEnd"
                  minTickGap={4}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#6F7975', fontSize: 10 }}
                  tickFormatter={formatAxisValue}
                  allowDecimals={false}
                  width={38}
                />
                <Tooltip
                  content={<TrendTooltip />}
                  cursor={{ fill: 'rgba(0,69,54,0.05)' }}
                  isAnimationActive={false}
                />
                <Bar dataKey="totalFinalLiter" radius={[6, 6, 0, 0]} animationDuration={500}>
                  {chartData.map((trend, index) => (
                    <Cell
                      key={trend.month}
                      fill={index === chartData.length - 1 ? '#006C49' : `rgba(0,69,54,${0.25 + (index % 4) * 0.12})`}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>
    </div>
  )
}
