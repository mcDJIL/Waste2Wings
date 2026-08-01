export default function SubmissionCards({ summary, isLoading }) {
  return (
    <div className="flex flex-col gap-4 p-5 rounded-2xl border border-white/30 bg-white/70 backdrop-blur-[10px] shadow-sm">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-[#051C37] text-base font-semibold leading-6">
            Status Pengajuan
          </h3>
          <p className="text-[#3F4945] text-sm leading-6 mt-1">Ringkasan batch dan validasi</p>
        </div>
        <button className="text-[#004536] text-sm font-semibold hover:underline transition-all duration-200">
          Lihat Semua
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* Pending Batches Card */}
        <div className="flex flex-col gap-3 p-4 rounded-xl border border-[#BEC9C3]/30 hover:border-[#C9A96E]/60 transition-all duration-300 hover:shadow-sm group">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#FEF3C7] flex items-center justify-center flex-shrink-0">
                <span className="text-[#F59E0B] text-sm font-bold">⏳</span>
              </div>
              <div>
                <p className="text-[#051C37] text-sm font-bold leading-6">Pending</p>
                <p className="text-[#3F4945] text-xs leading-5">Menunggu validasi</p>
              </div>
            </div>
            <span className={`px-3 py-0.5 rounded-full text-xs font-bold leading-5 ${isLoading ? 'bg-[#F1F5F9]' : 'text-[#F59E0B] bg-[#FFFBEB]'}`}>
              {isLoading ? '...' : summary?.pendingBatchCount || 0}
            </span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[#3F4945] text-xs leading-5">Batch</p>
              <p className="text-[#051C37] text-base font-bold leading-6">{isLoading ? '...' : (summary?.pendingBatchCount || 0)} items</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-[#004536] text-white text-sm font-normal leading-6 transition-all duration-200 hover:bg-[#0B5E4B] hover:shadow-md active:scale-95">
              Lihat Detail
            </button>
          </div>
        </div>

        {/* Accepted Batches Card */}
        <div className="flex flex-col gap-3 p-4 rounded-xl border border-[#BEC9C3]/30 hover:border-[#C9A96E]/60 transition-all duration-300 hover:shadow-sm group">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#ECFDF5] flex items-center justify-center flex-shrink-0">
                <span className="text-[#047857] text-sm font-bold">✓</span>
              </div>
              <div>
                <p className="text-[#051C37] text-sm font-bold leading-6">Diterima</p>
                <p className="text-[#3F4945] text-xs leading-5">Sudah validasi</p>
              </div>
            </div>
            <span className={`px-3 py-0.5 rounded-full text-xs font-bold leading-5 ${isLoading ? 'bg-[#F1F5F9]' : 'text-[#047857] bg-[#ECFDF5]'}`}>
              {isLoading ? '...' : summary?.acceptedBatchCount || 0}
            </span>
          </div>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-[#3F4945] text-xs leading-5">Batch</p>
              <p className="text-[#051C37] text-base font-bold leading-6">{isLoading ? '...' : (summary?.acceptedBatchCount || 0)} items</p>
            </div>
            <button className="px-4 py-2 rounded-lg bg-[#047857] text-white text-sm font-normal leading-6 transition-all duration-200 hover:bg-[#065f46] hover:shadow-md active:scale-95">
              Lihat Detail
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
