const LocationIcon = () => (
  <svg width="16" height="20" viewBox="0 0 16 20" fill="none">
    <path d="M8 10C8.55 10 9.02083 9.80417 9.4125 9.4125C9.80417 9.02083 10 8.55 10 8C10 7.45 9.80417 6.97917 9.4125 6.5875C9.02083 6.19583 8.55 6 8 6C7.45 6 6.97917 6.19583 6.5875 6.5875C6.19583 6.97917 6 7.45 6 8C6 8.55 6.19583 9.02083 6.5875 9.4125C6.97917 9.80417 7.45 10 8 10ZM8 17.35C10.0333 15.4833 11.5417 13.7875 12.525 12.2625C13.5083 10.7375 14 9.38333 14 8.2C14 6.38333 13.4208 4.89583 12.2625 3.7375C11.1042 2.57917 9.68333 2 8 2C6.31667 2 4.89583 2.57917 3.7375 3.7375C2.57917 4.89583 2 6.38333 2 8.2C2 9.38333 2.49167 10.7375 3.475 12.2625C4.45833 13.7875 5.96667 15.4833 8 17.35ZM8 20C5.31667 17.7167 3.3125 15.5958 1.9875 13.6375C0.6625 11.6792 0 9.86667 0 8.2C0 5.7 0.804167 3.70833 2.4125 2.225C4.02083 0.741667 5.88333 0 8 0C10.1167 0 11.9792 0.741667 13.5875 2.225C15.1958 3.70833 16 5.7 16 8.2C16 9.86667 15.3375 11.6792 14.0125 13.6375C12.6875 15.5958 10.6833 17.7167 8 20Z" fill="#C19A00" />
  </svg>
)

const ZoomIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
    <path d="M16.6 18L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13C4.68333 13 3.14583 12.3708 1.8875 11.1125C0.629167 9.85417 0 8.31667 0 6.5C0 4.68333 0.629167 3.14583 1.8875 1.8875C3.14583 0.629167 4.68333 0 6.5 0C8.31667 0 9.85417 0.629167 11.1125 1.8875C12.3708 3.14583 13 4.68333 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L18 16.6L16.6 18ZM6.5 11C7.75 11 8.8125 10.5625 9.6875 9.6875C10.5625 8.8125 11 7.75 11 6.5C11 5.25 10.5625 4.1875 9.6875 3.3125C8.8125 2.4375 7.75 2 6.5 2C5.25 2 4.1875 2.4375 3.3125 3.3125C2.4375 4.1875 2 5.25 2 6.5C2 7.75 2.4375 8.8125 3.3125 9.6875C4.1875 10.5625 5.25 11 6.5 11ZM5.5 9.5V7.5H3.5V5.5H5.5V3.5H7.5V5.5H9.5V7.5H7.5V9.5H5.5Z" fill="#5A4199" />
  </svg>
)

export default function ActiveDepositsMap() {
  return (
    <div className="flex flex-col p-6 rounded-2xl border border-[#E0DBDF] bg-white
      collector-card-enter h-full" style={{ animationDelay: '200ms' }}>

      {/* Header */}
      <div className="flex items-center gap-2 mb-6">
        <LocationIcon />
        <h3 className="text-[#1D1B1A] text-base font-bold font-poppins">
          Peta Lokasi Setoran Aktif
        </h3>
      </div>

      {/* Map image */}
      <div className="relative flex-1 rounded-xl overflow-hidden min-h-[220px]">
        <img
          src="https://api.builder.io/api/v1/image/assets/TEMP/f1f77419ac32933e206aea1eed211866d024d23e?width=579"
          alt="Peta lokasi setoran aktif"
          className="w-full h-full object-cover"
        />

        {/* Purple overlay */}
        <div className="absolute inset-0 bg-[#5A4199]/5 pointer-events-none" />

        {/* Zoom button */}
        <button className="absolute bottom-3 right-3 flex items-center justify-center
          w-9 h-9 rounded-xl bg-[#FAF9F6] shadow-sm
          hover:bg-white hover:shadow-md active:scale-95 transition-all duration-200">
          <ZoomIcon />
        </button>
      </div>

      {/* Caption */}
      <p className="text-[#5A5661]/80 text-[10px] italic text-center font-poppins mt-3">
        Data diperbarui secara real-time dari GPS kurir.
      </p>
    </div>
  )
}
