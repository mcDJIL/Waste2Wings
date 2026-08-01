import { useState, useMemo } from 'react'

const getMoneyFormat = (amount) => {
  if (!amount) return 'Rp0'
  if (amount >= 1000000) return `Rp${(amount / 1000000).toFixed(1)}M`
  if (amount >= 1000) return `Rp${(amount / 1000).toFixed(0)}K`
  return `Rp${amount}`
}

export default function PredictionChart({ trends = [], settings, isLoading }) {
  const [hovered, setHovered] = useState(null)

  const months = useMemo(() => {
    if (!trends || trends.length === 0) return []

    const volumes = trends.map(t => t.totalFinalLiter || 0)
    const maxVolume = Math.max(...volumes)

    return trends.map((trend, idx) => ({
      label: new Date(trend.month + '-01').toLocaleDateString('id-ID', { month: 'short' }),
      height: maxVolume > 0 ? (trend.totalFinalLiter / maxVolume) * 100 : 0,
      volume: trend.totalFinalLiter,
      value: `${trend.totalFinalLiter?.toLocaleString('id-ID')} L`,
      isCurrent: idx === trends.length - 1,
    }))
  }, [trends])

  return (
    <div className="flex flex-col gap-6 p-5 rounded-2xl border-t-2 border border-[#C9A96E] bg-white/70 backdrop-blur-[10px] shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <div>
          <h3 className="text-[#051C37] text-base font-normal leading-6">Tren Volume Pembelian Historis</h3>
          <p className="text-[#3F4945] text-sm leading-6">Volume liter pembelian periode sebelumnya per bulan.</p>
        </div>
        {settings && (
          <div className="flex flex-col items-start sm:items-end gap-1">
            <p className="text-[#3F4945] text-xs uppercase tracking-wide font-semibold">Harga Acuan</p>
            <p className="text-[#004536] text-lg font-bold">Rp{settings.referencePricePerLiter?.toLocaleString('id-ID')}/L</p>
          </div>
        )}
      </div>

      {/* Chart */}
      <div className="flex flex-col gap-6">
        {/* Bar chart */}
        <div className="flex-1 min-w-0">
          {isLoading ? (
            <div className="h-[220px] flex items-center justify-center text-[#3F4945]">
              Memuat data tren...
            </div>
          ) : months.length === 0 ? (
            <div className="h-[220px] flex items-center justify-center text-[#3F4945]">
              Belum ada data tren
            </div>
          ) : (
            <>
              <div className="relative flex items-end gap-1.5 h-[220px] border-b border-l border-[#BEC9C3]/30 px-2 pb-2">
                {months.map((m, i) => (
                  <div
                    key={m.label}
                    className="flex-1 flex flex-col items-center justify-end gap-0 relative group cursor-pointer"
                    onMouseEnter={() => setHovered(i)}
                    onMouseLeave={() => setHovered(null)}
                  >
                    {/* Tooltip */}
                    {hovered === i && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 px-2 py-1 rounded bg-[#051C37] text-white text-[10px] font-normal whitespace-nowrap z-10 shadow-lg">
                        {m.value}
                      </div>
                    )}

                    <div
                      className="w-full rounded-t-lg transition-all duration-500"
                      style={{
                        height: `${Math.max(m.height, 15)}%`,
                        background: m.isCurrent
                          ? '#006C49'
                          : `rgba(0, 69, 54, ${0.2 + i * 0.1})`,
                        transform: hovered === i ? 'scaleY(1.02)' : 'scaleY(1)',
                        transformOrigin: 'bottom',
                      }}
                    />
                  </div>
                ))}
              </div>

              {/* X-axis labels */}
              <div className="flex items-center gap-1.5 px-2 mt-2">
                {months.map((m) => (
                  <div key={m.label} className="flex-1 text-center">
                    <span
                      className={`text-xs leading-6 ${
                        m.isCurrent ? 'text-[#006C49] font-bold' : 'text-[#3F4945]'
                      }`}
                    >
                      {m.label}
                    </span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  )
}
