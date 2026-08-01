export default function LabHeader({ onExport }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
      <div>
        <h1 className="text-[#051C37] text-2xl sm:text-3xl font-bold leading-tight">
          Manajemen Uji Laboratorium
        </h1>
        <p className="text-[#3F4945] text-sm mt-1 leading-5">
          Advanced analytical tracking for waste oil refinement standards.
        </p>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <button
          onClick={onExport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#BEC9C3]/40 bg-white text-[#3F4945] text-sm font-medium transition-all duration-200 hover:border-[#004536] hover:text-[#004536] hover:shadow-sm active:scale-95 whitespace-nowrap"
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <path d="M1 10v2a1 1 0 001 1h10a1 1 0 001-1v-2M4 6l3 3m0 0l3-3M7 9V1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Export Report
        </button>
      </div>
    </div>
  )
}
