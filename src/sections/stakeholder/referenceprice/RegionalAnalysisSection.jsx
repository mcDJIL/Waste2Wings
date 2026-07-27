const BadgeIcon = () => (
  <svg width="22" height="23" viewBox="0 0 38 38.72" fill="none">
    <path d="M15.6 30.7202L13.7 27.5202L10.1 26.7202L10.45 23.0202L8 20.2202L10.45 17.4202L10.1 13.7202L13.7 12.9202L15.6 9.72021L19 11.1702L22.4 9.72021L24.3 12.9202L27.9 13.7202L27.55 17.4202L30 20.2202L27.55 23.0202L27.9 26.7202L24.3 27.5202L22.4 30.7202L19 29.2702L15.6 30.7202ZM16.45 28.1702L19 27.0702L21.6 28.1702L23 25.7702L25.75 25.1202L25.5 22.3202L27.35 20.2202L25.5 18.0702L25.75 15.2702L23 14.6702L21.55 12.2702L19 13.3702L16.4 12.2702L15 14.6702L12.25 15.2702L12.5 18.0702L10.65 20.2202L12.5 22.3202L12.25 25.1702L15 25.7702L16.45 28.1702ZM17.95 23.7702L23.6 18.1202L22.2 16.6702L17.95 20.9202L15.8 18.8202L14.4 20.2202L17.95 23.7702Z" fill="#C9A96E" />
  </svg>
)

export default function RegionalAnalysisSection() {
  return (
    <div className="flex flex-col xl:flex-row gap-6">
      {/* Regional map card */}
      <div className="flex flex-col gap-6 flex-1 p-6 rounded-3xl border-t-2 border-[#C9A96E] bg-white/80 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[10px] overflow-hidden">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-[#004536] text-lg font-bold leading-7">
            Analisis Regional (Volume vs Harga)
          </h3>
          <span className="text-[#3F4945] text-sm font-normal leading-6 flex-shrink-0">
            Data Lokasi Aktif
          </span>
        </div>

        {/* Map image */}
        <div className="relative flex-1 rounded-2xl overflow-hidden min-h-[200px] xs:min-h-[260px] sm:min-h-[320px]">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/6769c9c17f2f65f9eb8c26d9dd47d8b9bde7abd0?width=1356"
            alt="Peta Regional Indonesia"
            className="w-full h-full object-cover"
            style={{ filter: 'saturate(0.8)' }}
          />
          {/* Region tooltip overlay */}
          <div className="absolute bottom-4 left-4 px-4 py-3 rounded-xl bg-white/90 backdrop-blur-sm border border-[#BEC9C3]/30 shadow-lg">
            <p className="text-[#004536] text-sm font-bold leading-5">Sumatera Utara</p>
            <p className="text-[#3F4945] text-xs font-bold leading-4">Volume: 12,400 MT | Harga: Stabil</p>
          </div>
        </div>
      </div>

      {/* Right sidebar: AI recommendation + ISCC */}
      <div className="flex flex-col gap-3 xl:w-[350px] flex-shrink-0">
        {/* AI Recommendation card */}
        <div className="flex flex-col gap-4 p-6 rounded-3xl bg-[#004536] backdrop-blur-[10px]">
          <div className="flex flex-col gap-1">
            <p className="text-[#81F9C1] text-sm font-normal leading-6 tracking-[1.6px] uppercase">
              REKOMENDASI AI
            </p>
            <h3 className="text-white text-xl font-bold leading-7">Peluang Arbitrase</h3>
          </div>

          <p className="text-white/80 text-sm font-normal leading-6">
            Sentimen pasar menunjukkan volatilitas rendah minggu depan. Rekomendasi: Tingkatkan stok cadangan 5%.
          </p>

          <button className="w-full py-3 rounded-xl bg-[#81F9C1] text-[#004536] text-sm font-bold leading-6 text-center hover:bg-[#a8f7d4] active:scale-95 transition-all duration-200">
            Lihat Strategi
          </button>
        </div>

        {/* ISCC Certification card */}
        <div className="flex flex-col gap-4 p-6 rounded-3xl border-t-2 border-[#C9A96E] bg-white/80 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[10px]">
          <div className="flex items-center gap-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#C9A96E]/10 flex-shrink-0">
              <BadgeIcon />
            </div>
            <p className="text-[#004536] text-base font-bold leading-6">Sertifikasi ISCC</p>
          </div>
          <p className="text-[#3F4945] text-sm font-normal leading-6">
            92% koleksi bulan ini telah memenuhi standar keberlanjutan internasional.
          </p>
        </div>
      </div>
    </div>
  )
}
