const months = ['JAN', 'FEB', 'MAR', 'APR', 'MEI', 'JUN', 'JUL', 'AGU', 'SEP', 'OKT', 'NOV', 'DES']

const aiInsights = [
  {
    color: '#006C49',
    title: 'Optimalisasi Arus Kas',
    desc: 'Konsolidasikan rute pasokan pada Q3 untuk mengurangi biaya operasional sekitar 14%.',
  },
  {
    color: '#C9A96E',
    title: 'Peringatan Volume Tinggi',
    desc: 'Proyeksi kenaikan 30% pengumpulan limbah industri selama musim pemeliharaan Okt-Nov.',
  },
  {
    color: '#BA1A1A',
    title: 'Penilaian Risiko',
    desc: 'Volatilitas harga minyak dasar global dapat mempengaruhi margin pemurnian sebesar ±6,2% kuartal depan.',
  },
]

function ForecastChart() {
  return (
    <div className="flex flex-col gap-6 flex-1 p-8 rounded-xl border border-white/30 bg-white/70 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[10px] overflow-hidden">
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

function AiInsightsPanel() {
  return (
    <div className="flex flex-col gap-6 p-8 rounded-xl border border-white/30 bg-white/70 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[10px]">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-[35px] h-[42px] flex items-center justify-center rounded-lg bg-[rgba(0,69,54,0.10)]">
          <svg width="19" height="22" viewBox="0 0 20 20" fill="none">
            <path d="M3 20V15.7C2.05 14.8333 1.3125 13.8208 0.7875 12.6625C0.2625 11.5042 0 10.2833 0 9C0 6.5 0.875 4.375 2.625 2.625C4.375 0.875 6.5 0 9 0C11.0833 0 12.9292 0.6125 14.5375 1.8375C16.1458 3.0625 17.1917 4.65833 17.675 6.625L18.975 11.75C19.0583 12.0667 19 12.3542 18.8 12.6125C18.6 12.8708 18.3333 13 18 13H16V16C16 16.55 15.8042 17.0208 15.4125 17.4125C15.0208 17.8042 14.55 18 14 18H12V20H10V16H14V11H16.7L15.75 7.125C15.3667 5.60833 14.55 4.375 13.3 3.425C12.05 2.475 10.6167 2 9 2C7.06667 2 5.41667 2.675 4.05 4.025C2.68333 5.375 2 7.01667 2 8.95C2 9.95 2.20417 10.9 2.6125 11.8C3.02083 12.7 3.6 13.5 4.35 14.2L5 14.8V20H3Z" fill="#004536" />
          </svg>
        </div>
        <h3 className="text-[#004536] text-base font-extrabold leading-5">Wawasan Finansial AI</h3>
      </div>

      {/* Insight items */}
      <div className="flex flex-col gap-6">
        {aiInsights.map((item) => (
          <div key={item.title} className="flex items-start gap-4">
            <div className="w-1 min-w-[4px] self-stretch rounded-full" style={{ background: item.color }} />
            <div className="flex flex-col gap-1">
              <p className="text-[#004536] text-base font-extrabold leading-6">{item.title}</p>
              <p className="text-[#3F4945] text-sm font-medium leading-5">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Footer link */}
      <div className="pt-6 border-t border-[rgba(190,201,195,0.30)]">
        <button className="w-full py-2 text-center text-[#004536] text-sm font-extrabold leading-5 hover:opacity-70 transition-opacity duration-200">
          Unduh PDF Strategi AI Lengkap
        </button>
      </div>
    </div>
  )
}

export default function ForecastChartSection() {
  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      <div className="xl:col-span-2 flex">
        <ForecastChart />
      </div>
      <div className="xl:col-span-1">
        <AiInsightsPanel />
      </div>
    </div>
  )
}
