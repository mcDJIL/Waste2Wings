const submissions = [
  {
    type: 'PT',
    name: 'PT. Tirta Abadi',
    id: '99283-X',
    grade: 'A',
    gradeColor: 'text-[#047857] bg-[#ECFDF5]',
    volume: '12,450',
  },
  {
    type: 'CV',
    name: 'CV. Hijau Lestari',
    id: '88122-Y',
    grade: 'B',
    gradeColor: 'text-[#B45309] bg-[#FFFBEB]',
    volume: '8,200',
  },
]

export default function SubmissionCards() {
  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl border border-white/30 bg-white/70 backdrop-blur-[10px] shadow-sm">
      <div className="flex justify-between items-center">
        <h3 className="text-[#051C37] text-base font-semibold leading-6">
          Pengajuan Pengepul Terbaru
        </h3>
        <button className="text-[#004536] text-sm font-semibold hover:underline transition-all duration-200">
          Lihat Semua
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {submissions.map((item, i) => (
          <div
            key={i}
            className="flex flex-col gap-3 p-4 rounded-xl border border-[#BEC9C3]/30 hover:border-[#C9A96E]/60 transition-all duration-300 hover:shadow-sm group"
          >
            {/* Header */}
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-[#D5E3FF] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#004536] text-sm font-bold">{item.type}</span>
                </div>
                <div>
                  <p className="text-[#051C37] text-sm font-bold leading-6">{item.name}</p>
                  <p className="text-[#3F4945] text-xs leading-5">ID: {item.id}</p>
                </div>
              </div>
              <span className={`px-3 py-0.5 rounded-full text-xs font-bold leading-5 ${item.gradeColor}`}>
                Grade {item.grade}
              </span>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end">
              <div>
                <p className="text-[#3F4945] text-xs leading-5">Volume</p>
                <p className="text-[#051C37] text-base font-bold leading-6">{item.volume} Liter</p>
              </div>
              <button className="px-4 py-2 rounded-lg bg-[#004536] text-white text-sm font-normal leading-6 transition-all duration-200 hover:bg-[#0B5E4B] hover:shadow-md active:scale-95 group-hover:shadow-[0_4px_14px_rgba(0,69,54,0.3)]">
                Detail & Validasi
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
