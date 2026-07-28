const ExportIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
    <path d="M6.66667 10L2.5 5.83333L3.66667 4.625L5.83333 6.79167V0H7.5V6.79167L9.66667 4.625L10.8333 5.83333L6.66667 10ZM1.66667 13.3333C1.20833 13.3333 0.815972 13.1701 0.489583 12.8438C0.163194 12.5174 0 12.125 0 11.6667V9.16667H1.66667V11.6667H11.6667V9.16667H13.3333V11.6667C13.3333 12.125 13.1701 12.5174 12.8438 12.8438C12.5174 13.1701 12.125 13.3333 11.6667 13.3333H1.66667Z" fill="#004536" />
  </svg>
)

const SwapIcon = () => (
  <svg width="17" height="15" viewBox="0 0 17 15" fill="none">
    <path d="M4.16667 15L0 10.8333L4.16667 6.66667L5.35417 7.83333L3.1875 10H15.8333V11.6667H3.1875L5.35417 13.8333L4.16667 15ZM12.5 8.33333L11.3125 7.16667L13.4792 5H0.833333V3.33333H13.4792L11.3125 1.16667L12.5 0L16.6667 4.16667L12.5 8.33333Z" fill="white" />
  </svg>
)

export default function PriceReferenceHeader() {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="flex flex-col gap-1">
        <h1 className="text-[#004536] text-3xl xs:text-4xl md:text-5xl font-bold leading-tight tracking-tight">
          Harga Acuan Strategis
        </h1>
        <p className="text-[#3F4945] text-sm md:text-base font-normal leading-7">
          Indeks harga pasar real-time untuk optimalisasi margin profit
        </p>
      </div>
    </div>
  )
}
