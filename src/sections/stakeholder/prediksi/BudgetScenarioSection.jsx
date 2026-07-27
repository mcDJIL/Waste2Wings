import { useState } from 'react'

const allocations = [
  { label: 'Logistik & Transportasi', pct: 42, color: '#004536' },
  { label: 'Laboratorium & Pemurnian', pct: 28, color: '#006C49' },
  { label: 'Litbang & Teknologi', pct: 18, color: '#C9A96E' },
  { label: 'Insentif Jaringan', pct: 12, color: '#6F7975' },
]

function BudgetAllocationCard() {
  return (
    <div className="flex flex-col gap-6 p-8 rounded-xl border border-white/30 bg-white/70 backdrop-blur-[10px]">
      <h3 className="text-[#004536] text-base font-extrabold leading-6">Alokasi Terprediksi</h3>
      <div className="flex flex-col gap-6">
        {allocations.map((item) => (
          <div key={item.label} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-[#051C37] text-base font-bold leading-6">{item.label}</span>
              <span className="text-[#051C37] text-base font-extrabold leading-6">{item.pct}%</span>
            </div>
            <div className="h-2 rounded-full bg-[#DEE8FF] overflow-hidden">
              <div
                className="h-2 rounded-full transition-all duration-500"
                style={{ width: `${item.pct}%`, background: item.color }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ScenarioSimulatorCard({ trends = [], settings }) {
  const historical_volumes = trends.map(trend => trend.totalFinalLiter || 0)
  const avgVolume = historical_volumes.length > 0 ? historical_volumes.reduce((a, b) => a + b, 0) / historical_volumes.length : 12500

  const [volume, setVolume] = useState(avgVolume)
  const [price, setPrice] = useState(settings?.referencePricePerLiter || 1.85)

  const netProfit = ((volume * price * 0.0000135)).toFixed(2)

  return (
    <div className="relative flex flex-col gap-6 p-8 rounded-xl bg-[#004536] overflow-hidden">
      {/* Decorative blur orb */}
      <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-[rgba(201,169,110,0.10)] blur-[50px] pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3">
        <svg width="18" height="20" viewBox="0 0 18 20" fill="none">
          <path d="M2.15 17.85C1.46667 17.05 0.9375 16.1542 0.5625 15.1625C0.1875 14.1708 0 13.1167 0 12C0 9.5 0.875 7.375 2.625 5.625C4.375 3.875 6.5 3 9 3C9.03333 3 9.06667 3 9.1 3C9.13333 3 9.16667 3 9.2 3L7.6 1.4L9 0L13 4L9 8L7.575 6.575L9.15 5C9.11667 5 9.09167 5 9.075 5C9.05833 5 9.03333 5 9 5C7.06667 5 5.41667 5.68333 4.05 7.05C2.68333 8.41667 2 10.0667 2 12C2 12.85 2.1375 13.65 2.4125 14.4C2.6875 15.15 3.075 15.825 3.575 16.425L2.15 17.85ZM8 17.5C8 17.1167 7.87083 16.7375 7.6125 16.3625C7.35417 15.9875 7.06667 15.5958 6.75 15.1875C6.43333 14.7792 6.14583 14.3542 5.8875 13.9125C5.62917 13.4708 5.5 13 5.5 12.5C5.5 11.5333 5.84167 10.7083 6.525 10.025C7.20833 9.34167 8.03333 9 9 9C9.96667 9 10.7917 9.34167 11.475 10.025C12.1583 10.7083 12.5 11.5333 12.5 12.5C12.5 13 12.3708 13.4708 12.1125 13.9125C11.8542 14.3542 11.5667 14.7792 11.25 15.1875C10.9333 15.5958 10.6458 15.9875 10.3875 16.3625C10.1292 16.7375 10 17.1167 10 17.5H8ZM8 20V18.5H10V20H8ZM15.85 17.85L14.425 16.425C14.925 15.825 15.3125 15.15 15.5875 14.4C15.8625 13.65 16 12.85 16 12C16 10.9 15.7708 9.87917 15.3125 8.9375C14.8542 7.99583 14.225 7.20833 13.425 6.575L14.85 5.15C15.8167 5.98333 16.5833 6.9875 17.15 8.1625C17.7167 9.3375 18 10.6167 18 12C18 13.1167 17.8125 14.1708 17.4375 15.1625C17.0625 16.1542 16.5333 17.05 15.85 17.85Z" fill="#C9A96E" />
        </svg>
        <h3 className="text-white text-base font-extrabold leading-6">Simulator Skenario Dampak</h3>
      </div>

      {/* Controls + Result */}
      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Sliders */}
        <div className="flex flex-col gap-6 flex-1">
          {/* Volume slider */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between opacity-90">
              <span className="text-white text-base font-bold leading-6">Volume Minyak Jelantah (KL)</span>
              <span className="text-[#006C49] text-base font-extrabold leading-6">{volume.toLocaleString('id-ID')}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min={5000}
                max={25000}
                step={100}
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#C9A96E', background: '#0B5E4B' }}
              />
            </div>
            <div className="flex justify-between opacity-70">
              <span className="text-white text-[10px] font-extrabold leading-[15px] tracking-[1px] uppercase">DASAR (5RB)</span>
              <span className="text-white text-[10px] font-extrabold leading-[15px] tracking-[1px] uppercase">AGRESIF (25RB)</span>
            </div>
          </div>

          {/* Price slider */}
          <div className="flex flex-col gap-4">
            <div className="flex items-start justify-between opacity-90">
              <span className="text-white text-base font-bold leading-6">Harga Pasar Global ($/L)</span>
              <span className="text-[#006C49] text-base font-extrabold leading-6">{price.toFixed(2)}</span>
            </div>
            <div className="relative">
              <input
                type="range"
                min={0.5}
                max={4.0}
                step={0.05}
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer"
                style={{ accentColor: '#C9A96E', background: '#0B5E4B' }}
              />
            </div>
            <div className="flex justify-between opacity-70">
              <span className="text-white text-[10px] font-extrabold leading-[15px] tracking-[1px] uppercase">RENDAH (0.5)</span>
              <span className="text-white text-[10px] font-extrabold leading-[15px] tracking-[1px] uppercase">TINGGI (4.0)</span>
            </div>
          </div>
        </div>

        {/* Result card */}
        <div className="flex flex-col items-center justify-center gap-2 p-8 rounded-xl border border-white/10 bg-white/5 min-w-[200px] self-stretch">
          <span className="text-white/70 text-[10px] font-extrabold leading-[15px] tracking-[1px] uppercase text-center">
            SIMULASI LABA BERSIH
          </span>
          <span className="text-[#C9A96E] text-2xl font-extrabold leading-8">${netProfit}M</span>
          <span className="text-[#81F9C1] text-xs font-bold leading-4 mt-1">Menguntungkan</span>
        </div>
      </div>
    </div>
  )
}

export default function BudgetScenarioSection({ trends = [], settings, isLoading }) {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6" style={{ opacity: isLoading ? 0.6 : 1 }}>
      <div className="xl:col-span-1">
        <BudgetAllocationCard />
      </div>
      <div className="xl:col-span-2">
        <ScenarioSimulatorCard trends={trends} settings={settings} />
      </div>
    </div>
  )
}
