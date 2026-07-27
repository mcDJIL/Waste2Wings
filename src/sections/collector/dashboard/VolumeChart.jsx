const TrendIcon = () => (
  <svg width="22" height="17" viewBox="0 0 22 17" fill="none">
    <path d="M2 17C1.45 17 0.979167 16.8042 0.5875 16.4125C0.195833 16.0208 0 15.55 0 15C0 14.45 0.195833 13.9792 0.5875 13.5875C0.979167 13.1958 1.45 13 2 13C2.1 13 2.1875 13 2.2625 13C2.3375 13 2.41667 13.0167 2.5 13.05L7.05 8.5C7.01667 8.41667 7 8.3375 7 8.2625C7 8.1875 7 8.1 7 8C7 7.45 7.19583 6.97917 7.5875 6.5875C7.97917 6.19583 8.45 6 9 6C9.55 6 10.0208 6.19583 10.4125 6.5875C10.8042 6.97917 11 7.45 11 8C11 8.03333 10.9833 8.2 10.95 8.5L13.5 11.05C13.5833 11.0167 13.6625 11 13.7375 11C13.8125 11 13.9 11 14 11C14.1 11 14.1875 11 14.2625 11C14.3375 11 14.4167 11.0167 14.5 11.05L18.05 7.5C18.0167 7.41667 18 7.3375 18 7.2625C18 7.1875 18 7.1 18 7C18 6.45 18.1958 5.97917 18.5875 5.5875C18.9792 5.19583 19.45 5 20 5C20.55 5 21.0208 5.19583 21.4125 5.5875C21.8042 5.97917 22 6.45 22 7C22 7.55 21.8042 8.02083 21.4125 8.4125C21.0208 8.80417 20.55 9 20 9C19.9 9 19.8125 9 19.7375 9C19.6625 9 19.5833 8.98333 19.5 8.95L15.95 12.5C15.9833 12.5833 16 12.6625 16 12.7375C16 12.8125 16 12.9 16 13C16 13.55 15.8042 14.0208 15.4125 14.4125C15.0208 14.8042 14.55 15 14 15C13.45 15 12.9792 14.8042 12.5875 14.4125C12.1958 14.0208 12 13.55 12 13C12 12.9 12 12.8125 12 12.7375C12 12.6625 12.0167 12.5833 12.05 12.5L9.5 9.95C9.41667 9.98333 9.3375 10 9.2625 10C9.1875 10 9.1 10 9 10C8.96667 10 8.8 9.98333 8.5 9.95L3.95 14.5C3.98333 14.5833 4 14.6625 4 14.7375C4 14.8125 4 14.9 4 15C4 15.55 3.80417 16.0208 3.4125 16.4125C3.02083 16.8042 2.55 17 2 17ZM3 6.975L2.375 5.625L1.025 5L2.375 4.375L3 3.025L3.625 4.375L4.975 5L3.625 5.625L3 6.975ZM14 6L13.05 3.95L11 3L13.05 2.05L14 0L14.95 2.05L17 3L14.95 3.95L14 6Z" fill="#5A4199" />
  </svg>
)

const DAYS = ['SEN', 'SEL', 'RAB', 'KAM', 'JUM', 'SAB', 'MIN']

export default function VolumeChart({ data, isLoading }) {
  return (
    <div className="flex flex-col gap-6 p-6 rounded-2xl border border-[#E0DBDF] bg-white
      collector-card-enter" style={{ animationDelay: '100ms' }}>

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendIcon />
          <h3 className="text-[#1D1B1A] text-base font-bold font-poppins">
            Tren Volume Minyak Jelantah (7 Hari Terakhir)
          </h3>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#5A4199]" />
          <span className="text-[#8E8994] text-[10px] font-poppins">Volume (L)</span>
        </div>
      </div>

      {isLoading ? (
        <div className="h-[220px] bg-[#FCFAF8] rounded-xl animate-pulse" />
      ) : (
        <>
          {/* SVG Chart */}
          <div className="flex flex-col gap-2">
            <div className="w-full overflow-hidden rounded-xl">
              <svg
                viewBox="0 0 652 220"
                fill="none"
                preserveAspectRatio="xMidYMid meet"
                className="w-full h-auto"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <linearGradient id="chartGradient" x1="0" y1="74" x2="0" y2="220" gradientUnits="userSpaceOnUse">
                    <stop stopColor="#5A4199" stopOpacity="0.2" />
                    <stop offset="1" stopColor="#5A4199" stopOpacity="0" />
                  </linearGradient>
                  <clipPath id="chartClip">
                    <rect width="652" height="220" />
                  </clipPath>
                </defs>

                <g clipPath="url(#chartClip)">
                  {/* Area fill */}
                  <path
                    d="M0 180C36.5185 166.667 73.037 140 109.556 99.9999C146.074 59.9999 182.593 66.6666 219.111 120C255.63 173.333 292.148 180 328.667 140C365.185 99.9999 401.704 103.333 438.222 150C474.741 170 616.621 153.333 653.14 99.9999V156V220H547.778H0V180Z"
                    fill="url(#chartGradient)"
                  />

                  {/* Line */}
                  <path
                    d="M0 180C36.6559 166.631 73.3118 139.892 109.968 99.7838C146.624 59.6757 183.28 66.3604 219.935 119.838C256.591 173.315 293.247 180 329.903 139.892C366.559 99.7838 403.215 103.126 439.871 149.919C476.527 169.973 615.018 153.261 651.674 99.7838"
                    stroke="#5A4199"
                    strokeWidth="1.95"
                    strokeLinecap="round"
                    className="chart-line-draw"
                  />

                  {/* Data points */}
                  {[
                    { cx: 113.6, cy: 96 },
                    { cx: 228.9, cy: 132 },
                    { cx: 349.1, cy: 123 },
                    { cx: 522.0, cy: 156 },
                    { cx: 651.6, cy: 100 },
                  ].map((pt, i) => (
                    <ellipse
                      key={i}
                      cx={pt.cx}
                      cy={pt.cy}
                      rx="4"
                      ry="4"
                      fill="#5A4199"
                      className="opacity-0 animate-fade-in"
                      style={{ animationDelay: `${800 + i * 100}ms`, animationFillMode: 'both' }}
                    />
                  ))}
                </g>
              </svg>
            </div>

            {/* Day labels */}
            <div className="flex justify-between px-2">
              {DAYS.map((day) => (
                <span
                  key={day}
                  className="text-[#8E8994] text-[10px] font-bold tracking-[-0.5px] uppercase font-poppins"
                >
                  {day}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
