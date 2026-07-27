import { useEffect, useRef, useState } from 'react'

const CpoIcon = () => (
  <svg width="27" height="27" viewBox="0 0 27 27" fill="none">
    <path d="M8 21.3333L6.13333 19.4333L9.56667 16H0V13.3333H9.56667L6.13333 9.9L8 8L14.6667 14.6667L8 21.3333ZM18.6667 13.3333L12 6.66667L18.6667 0L20.5333 1.9L17.1 5.33333H26.6667V8H17.1L20.5333 11.4333L18.6667 13.3333Z" fill="#006C49" />
  </svg>
)

const TruckIcon = () => (
  <svg width="30" height="22" viewBox="0 0 30 22" fill="none">
    <path d="M6.66667 21.3333C5.55556 21.3333 4.61111 20.9444 3.83333 20.1667C3.05556 19.3889 2.66667 18.4444 2.66667 17.3333H0V2.66667C0 1.93333 0.261111 1.30556 0.783333 0.783333C1.30556 0.261111 1.93333 0 2.66667 0H21.3333V5.33333H25.3333L29.3333 10.6667V17.3333H26.6667C26.6667 18.4444 26.2778 19.3889 25.5 20.1667C24.7222 20.9444 23.7778 21.3333 22.6667 21.3333C21.5556 21.3333 20.6111 20.9444 19.8333 20.1667C19.0556 19.3889 18.6667 18.4444 18.6667 17.3333H10.6667C10.6667 18.4444 10.2778 19.3889 9.5 20.1667C8.72222 20.9444 7.77778 21.3333 6.66667 21.3333ZM6.66667 18.6667C7.04444 18.6667 7.36111 18.5389 7.61667 18.2833C7.87222 18.0278 8 17.7111 8 17.3333C8 16.9556 7.87222 16.6389 7.61667 16.3833C7.36111 16.1278 7.04444 16 6.66667 16C6.28889 16 5.97222 16.1278 5.71667 16.3833C5.46111 16.6389 5.33333 16.9556 5.33333 17.3333C5.33333 17.7111 5.46111 18.0278 5.71667 18.2833C5.97222 18.5389 6.28889 18.6667 6.66667 18.6667ZM2.66667 14.6667H3.73333C4.11111 14.2667 4.54444 13.9444 5.03333 13.7C5.52222 13.4556 6.06667 13.3333 6.66667 13.3333C7.26667 13.3333 7.81111 13.4556 8.3 13.7C8.78889 13.9444 9.22222 14.2667 9.6 14.6667H18.6667V2.66667H2.66667V14.6667ZM22.6667 18.6667C23.0444 18.6667 23.3611 18.5389 23.6167 18.2833C23.8722 18.0278 24 17.7111 24 17.3333C24 16.9556 23.8722 16.6389 23.6167 16.3833C23.3611 16.1278 23.0444 16 22.6667 16C22.2889 16 21.9722 16.1278 21.7167 16.3833C21.4611 16.6389 21.3333 16.9556 21.3333 17.3333C21.3333 17.7111 21.4611 18.0278 21.7167 18.2833C21.9722 18.5389 22.2889 18.6667 22.6667 18.6667ZM21.3333 12H27L24 8H21.3333V12Z" fill="#4E3807" />
  </svg>
)

const WarningIcon = () => (
  <svg width="19" height="16" viewBox="0 0 19 16" fill="none">
    <path d="M0 15.8333L9.16667 0L18.3333 15.8333H0ZM2.875 14.1667H15.4583L9.16667 3.33333L2.875 14.1667ZM9.16667 13.3333C9.40278 13.3333 9.60069 13.2535 9.76042 13.0938C9.92014 12.934 10 12.7361 10 12.5C10 12.2639 9.92014 12.066 9.76042 11.9062C9.60069 11.7465 9.40278 11.6667 9.16667 11.6667C8.93056 11.6667 8.73264 11.7465 8.57292 11.9062C8.41319 12.066 8.33333 12.2639 8.33333 12.5C8.33333 12.7361 8.41319 12.934 8.57292 13.0938C8.73264 13.2535 8.93056 13.3333 9.16667 13.3333ZM8.33333 10.8333H10V6.66667H8.33333V10.8333Z" fill="#BA1A1A" />
  </svg>
)

function CorrelationBar({ animated }) {
  return (
    <div className="relative h-2 w-full rounded-full bg-[#E7EEFF] overflow-hidden">
      <div
        className="absolute inset-y-0 left-0 rounded-full transition-all duration-1000 ease-out"
        style={{
          width: animated ? '84%' : '0%',
          background: 'linear-gradient(90deg, #006C49 0%, #81F9C1 100%)',
        }}
      />
    </div>
  )
}

export default function CorrelationSection() {
  const ref = useRef(null)
  const [animated, setAnimated] = useState(false)

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setAnimated(true) },
      { threshold: 0.2 }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="flex flex-col gap-6">
      {/* Section label */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-1 rounded-full bg-[#C9A96E] flex-shrink-0" />
        <p className="text-[#004536] text-base font-normal leading-6">Korelasi Komoditas Terkait</p>
      </div>

      {/* Two correlation cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
        {/* CPO vs Waste Oil */}
        <div className="flex flex-col gap-6 p-6 rounded-3xl border-t-2 border-[#C9A96E] bg-white/80 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[10px] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#006C49]/10 flex-shrink-0">
                <CpoIcon />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-[#004536] text-lg font-bold leading-7">CPO vs Waste Oil</p>
                <p className="text-[#3F4945] text-sm font-normal leading-6 uppercase tracking-tight">
                  INDEKS KORELASI HARGA
                </p>
              </div>
            </div>
            <span className="text-[#006C49] text-base font-extrabold leading-6 flex-shrink-0">0.84</span>
          </div>

          {/* Progress bar + labels */}
          <div className="flex flex-col gap-4">
            <CorrelationBar animated={animated} />
            <div className="flex justify-between items-start">
              <span className="text-[#3F4945] text-sm font-bold leading-6">Korelasi Rendah</span>
              <span className="text-[#3F4945] text-sm font-bold leading-6">Korelasi Tinggi</span>
            </div>

            {/* Description */}
            <p className="text-sm leading-relaxed">
              <span className="text-[#3F4945]">Hubungan harga yang sangat kuat. Kenaikan harga </span>
              <span className="text-[#004536] font-medium">Crude Palm Oil</span>
              <span className="text-[#3F4945]"> biasanya mendahului kenaikan Waste Oil dalam rentang waktu 14 hari kerja.</span>
            </p>

            {/* Change stats */}
            <div className="flex gap-3 pt-4 border-t border-[#BEC9C3]/20">
              <div className="flex flex-col items-center flex-1 py-3 rounded-xl bg-[#F0F3FF]">
                <span className="text-[#3F4945] text-sm font-normal leading-6">CPO Change</span>
                <span className="text-[#004536] text-sm font-bold leading-6">+1.2%</span>
              </div>
              <div className="flex flex-col items-center flex-1 py-3 rounded-xl bg-[#F0F3FF]">
                <span className="text-[#3F4945] text-sm font-normal leading-6">WO Change</span>
                <span className="text-[#004536] text-sm font-bold leading-6">+0.9%</span>
              </div>
            </div>
          </div>
        </div>

        {/* Fuel Surcharge Impact */}
        <div className="flex flex-col gap-6 p-6 rounded-3xl border-t-2 border-[#C9A96E] bg-white/80 shadow-[0_4px_4px_0_rgba(0,0,0,0.25)] backdrop-blur-[10px] hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300">
          {/* Header row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#FFDEA4]/30 flex-shrink-0">
                <TruckIcon />
              </div>
              <div className="flex flex-col gap-0.5">
                <p className="text-[#004536] text-lg font-bold leading-7">Fuel Surcharge Impact</p>
                <p className="text-[#3F4945] text-sm font-normal leading-6 uppercase tracking-tight">
                  DAMPAK LOGISTIK GLOBAL
                </p>
              </div>
            </div>
            <span className="text-[#BA1A1A] text-base font-extrabold leading-6 flex-shrink-0">-12.5%</span>
          </div>

          {/* Warning alert */}
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-2 p-4 rounded-2xl border border-[#BA1A1A]/10 bg-[#FFDAD6]/20">
              <div className="flex items-center gap-2">
                <WarningIcon />
                <span className="text-[#BA1A1A] text-sm font-bold leading-6">Peringatan Efisiensi</span>
              </div>
              <p className="text-[#3F4945] text-sm font-normal leading-6">
                Kenaikan biaya bahan bakar global menyebabkan kontraksi margin bersih sebesar 12.5% pada kuartal ini. Disarankan peninjauan rute koleksi.
              </p>
            </div>

            {/* Fuel index + margin risk */}
            <div className="flex gap-3">
              <div className="flex items-center gap-3 flex-1 p-3 rounded-xl bg-[#F0F3FF]">
                <div className="w-2 h-8 rounded-full bg-[#BA1A1A] flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[#3F4945] text-sm font-normal leading-6">Fuel Index</span>
                  <span className="text-[#004536] text-sm font-bold leading-6">142.8 pts</span>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-1 p-3 rounded-xl bg-[#F0F3FF]">
                <div className="w-2 h-8 rounded-full bg-[#C9A96E] flex-shrink-0" />
                <div className="flex flex-col">
                  <span className="text-[#3F4945] text-sm font-normal leading-6">Margin Risk</span>
                  <span className="text-[#004536] text-sm font-bold leading-6">High</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
