import { useState } from 'react'

const months = [
  { label: 'Jan', height: 35, value: 'Rp2.1M' },
  { label: 'Feb', height: 48, value: 'Rp2.8M' },
  { label: 'Mar', height: 42, value: 'Rp2.5M' },
  { label: 'Apr', height: 63, value: 'Rp3.4M' },
  { label: 'Mei', height: 74, value: 'Rp3.9M' },
  { label: 'Jun', height: 80, value: 'Rp4.2M', isCurrent: true, isNext: true },
]

export default function PredictionChart() {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="flex flex-col gap-6 p-5 rounded-2xl border-t-2 border border-[#C9A96E] bg-white/70 backdrop-blur-[10px] shadow-sm">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between gap-4 sm:items-center">
        <div>
          <h3 className="text-[#051C37] text-base font-normal leading-6">Analisis Prediksi Dana</h3>
          <p className="text-[#3F4945] text-sm leading-6">Proyeksi arus kas 6 bulan mendatang berbasis AI.</p>
        </div>
        <button className="self-start sm:self-auto flex items-center gap-2 px-5 py-3 rounded-xl bg-[#051C37] text-white text-sm font-normal leading-6 transition-all duration-200 hover:bg-[#0B5E4B] hover:shadow-lg active:scale-95 whitespace-nowrap">
          <svg width="14" height="17" viewBox="0 0 14 17" fill="none">
            <path d="M3.33333 13.3333H10V11.6667H3.33333V13.3333ZM3.33333 10H10V8.33333H3.33333V10ZM1.66667 16.6667C1.20833 16.6667 0.815972 16.5035 0.489583 16.1771C0.163194 15.8507 0 15.4583 0 15V1.66667C0 1.20833 0.163194 0.815972 0.489583 0.489583C0.815972 0.163194 1.20833 0 1.66667 0H8.33333L13.3333 5V15C13.3333 15.4583 13.1701 15.8507 12.8438 16.1771C12.5174 16.5035 12.125 16.6667 11.6667 16.6667H1.66667ZM7.5 5.83333V1.66667H1.66667V15H11.6667V5.83333H7.5Z" fill="white" />
          </svg>
          Generate Laporan
        </button>
      </div>

      {/* Chart + Insight grid */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Bar chart */}
        <div className="flex-1 min-w-0">
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
                    {m.isNext ? `Next Month: ${m.value}` : m.value}
                  </div>
                )}

                <div
                  className="w-full rounded-t-lg transition-all duration-500"
                  style={{
                    height: `${m.height}%`,
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
        </div>

        {/* Insight panel */}
        <div className="flex flex-col gap-4 lg:w-52 xl:w-60">
          {/* AI Insight card */}
          <div className="flex flex-col gap-2 p-5 rounded-2xl border border-[#006C49]/20 bg-[rgba(129,249,193,0.30)]">
            <div className="flex items-center gap-2">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M4 14H6V9H4V14ZM12 14H14V4H12V14ZM8 14H10V11H8V14ZM8 9H10V7H8V9ZM2 18C1.45 18 0.979167 17.8042 0.5875 17.4125C0.195833 17.0208 0 16.55 0 16V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0H16C16.55 0 17.0208 0.195833 17.4125 0.5875C17.8042 0.979167 18 1.45 18 2V16C18 16.55 17.8042 17.0208 17.4125 17.4125C17.0208 17.8042 16.55 18 16 18H2Z" fill="#006C49" />
              </svg>
              <span className="text-[#006C49] text-sm font-bold uppercase tracking-wide">AI INSIGHT</span>
            </div>
            <p className="text-sm font-medium leading-6">
              <span className="text-[#051C37]">Dana meningkat </span>
              <span className="text-[#006C49] font-bold">8%</span>
              <span className="text-[#051C37]"> bulan depan berdasarkan tren pengumpulan regional Jawa Barat.</span>
            </p>
          </div>

          {/* Confidence card */}
          <div className="flex flex-col gap-1 p-5 rounded-2xl border border-[#BEC9C3]/30">
            <p className="text-[#3F4945] text-sm leading-6">Tingkat Kepercayaan</p>
            <div className="flex items-center gap-4">
              <p className="text-[#051C37] text-base font-bold leading-6">94.2%</p>
              <svg width="20" height="12" viewBox="0 0 20 12" fill="none">
                <path d="M1.4 12L0 10.6L7.4 3.15L11.4 7.15L16.6 2H14V0H20V6H18V3.4L11.4 10L7.4 6L1.4 12Z" fill="#006C49" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
