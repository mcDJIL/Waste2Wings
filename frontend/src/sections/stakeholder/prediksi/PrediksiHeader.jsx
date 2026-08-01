export default function PrediksiHeader() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-[#004536] text-base font-extrabold leading-6">Prediksi Dana</h2>
        <p className="text-[#3F4945] text-base font-semibold leading-6">
          Proyeksi keuangan dan ramalan pertumbuhan berbasis AI untuk siklus fiskal mendatang.
        </p>
      </div>

      <div className="flex items-center gap-3 flex-shrink-0">
        <button className="flex items-center gap-3 px-6 py-2 rounded-lg border-2 border-[#C9A96E] text-[#C9A96E] text-base font-extrabold leading-6 hover:bg-[#C9A96E]/10 transition-colors duration-200">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 12L3 7L4.4 5.55L7 8.15V0H9V8.15L11.6 5.55L13 7L8 12ZM2 16C1.45 16 0.979167 15.8042 0.5875 15.4125C0.195833 15.0208 0 14.55 0 14V11H2V14H14V11H16V14C16 14.55 15.8042 15.0208 15.4125 15.4125C15.0208 15.8042 14.55 16 14 16H2Z" fill="currentColor" />
          </svg>
          Ekspor Laporan
        </button>

        <button className="flex items-center gap-2.5 px-6 py-2.5 rounded-lg bg-[#004536] text-white text-base font-extrabold leading-6 hover:bg-[#0B5E4B] transition-colors duration-200">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 16C5.76667 16 3.875 15.225 2.325 13.675C0.775 12.125 0 10.2333 0 8C0 5.76667 0.775 3.875 2.325 2.325C3.875 0.775 5.76667 0 8 0C9.15 0 10.25 0.2375 11.3 0.7125C12.35 1.1875 13.25 1.86667 14 2.75V0H16V7H9V5H13.2C12.6667 4.06667 11.9375 3.33333 11.0125 2.8C10.0875 2.26667 9.08333 2 8 2C6.33333 2 4.91667 2.58333 3.75 3.75C2.58333 4.91667 2 6.33333 2 8C2 9.66667 2.58333 11.0833 3.75 12.25C4.91667 13.4167 6.33333 14 8 14C9.28333 14 10.4417 13.6333 11.475 12.9C12.5083 12.1667 13.2333 11.2 13.65 10H15.75C15.2833 11.7667 14.3333 13.2083 12.9 14.325C11.4667 15.4417 9.83333 16 8 16Z" fill="white" />
          </svg>
          Jalankan Sinkronisasi AI
        </button>
      </div>
    </div>
  )
}
