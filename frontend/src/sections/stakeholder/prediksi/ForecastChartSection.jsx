const months = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES']

function ForecastChart({ trends = [], isLoading }) {
  return (
    <div className="flex flex-col gap-6 flex-1 p-8 rounded-xl border border-white/30 bg-white/70 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[10px] overflow-hidden" style={{ opacity: isLoading ? 0.6 : 1 }}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
        <div>
          <h3 className="text-[#004536] text-base font-extrabold leading-6">Proyeksi Keuangan (12B)</h3>
          <p className="text-[#3F4945] text-base font-semibold leading-6">
            Pemodelan prediktif berdasarkan tren asupan limbah saat ini.
          </p>
        </div>
        <div className="flex items-center gap-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#004536] flex-shrink-0" />
            <span className="text-[#6F7975] text-base font-bold leading-6">Ekspektasi</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-sm border-2 border-dashed border-[#C9A96E] flex-shrink-0" />
            <span className="text-[#6F7975] text-base font-bold leading-6">Target</span>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative flex-1 min-h-[280px]">
        <div className="absolute inset-0 border-b border-l border-[rgba(190,201,195,0.30)] overflow-hidden">
          <svg width="100%" height="100%" viewBox="0 0 614 422" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="forecast-gradient" x1="0" y1="84.4" x2="0" y2="422" gradientUnits="userSpaceOnUse">
                <stop stopColor="#0B5E4B" stopOpacity="0.2" />
                <stop offset="1" stopColor="#0B5E4B" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d="M0 369.25C34.1107 348.15 68.2213 323.533 102.332 295.4C136.443 267.267 170.553 246.167 204.664 232.1C238.775 218.033 272.885 203.967 306.996 189.9C341.107 175.833 375.217 154.733 409.328 126.6C443.439 98.4666 578.889 62 613 62V245.5V422H0V369.25Z" fill="url(#forecast-gradient)" />
            <path d="M0 369.25C34.1107 348.15 68.2213 323.533 102.332 295.4C136.443 267.267 170.553 246.167 204.664 232.1C238.775 218.033 272.885 203.967 306.996 189.9C341.107 175.833 375.217 154.733 409.328 126.6C443.439 98.4666 581.389 61 615.5 61" stroke="#0B5E4B" strokeWidth="3.13" />
            <path d="M0 390.35C34.1107 369.25 68.2213 344.633 102.332 316.5C136.443 288.367 170.553 267.267 204.664 253.2C238.775 239.133 272.885 225.067 306.996 211C341.107 196.933 375.217 175.833 409.328 147.7C443.439 119.567 578.389 73 612.5 73" stroke="#C9A96E" strokeWidth="1.57" strokeDasharray="6.27 6.27" />
          </svg>
        </div>

        {/* Month labels */}
        <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
          {months.map((m) => (
            <span key={m} className="text-[#6F7975] text-[10px] font-extrabold leading-[15px] tracking-[-0.5px] uppercase">
              {m}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}


export default function ForecastChartSection({ trends = [], isLoading }) {
  return (
    <div>
      <ForecastChart trends={trends} isLoading={isLoading} />
    </div>
  )
}
