const regions = [
  { name: 'Jawa Timur', pct: 42, color: '#004536', width: '84px' },
  { name: 'Banten', pct: 28, color: '#006C49', width: '56px' },
  { name: 'Jawa Barat', pct: 15, color: '#A8F1D8', width: '30px' },
  { name: 'Sumatera Utara', pct: 10, color: '#C9A96E', width: '20px' },
]

const upcomingReviews = [
  {
    priority: 'SLA CRITICAL',
    priorityColor: 'text-[#BA1A1A]',
    borderColor: 'border-[rgba(186,26,26,0.20)]',
    bgColor: 'bg-[rgba(255,218,214,0.10)]',
    accentColor: '#BA1A1A',
    due: 'Due in 4h',
    company: 'PT Petro Kimia Sejahtera',
    location: 'Gresik • APP-88200',
  },
  {
    priority: 'HIGH PRIORITY',
    priorityColor: 'text-[#004536]',
    borderColor: 'border-[rgba(0,69,54,0.20)]',
    bgColor: 'bg-[rgba(11,94,75,0.05)]',
    accentColor: '#004536',
    due: 'Due Tomorrow',
    company: 'UD Berdikari Oil',
    location: 'Malang • APP-88215',
  },
  {
    priority: 'STANDARD',
    priorityColor: 'text-[#3F4945]',
    borderColor: 'border-[rgba(190,201,195,0.30)]',
    bgColor: 'bg-white',
    accentColor: '#6F7975',
    due: '15 Oct',
    company: 'CV Trans Logistik',
    location: 'Jakarta • APP-88222',
  },
]

function RegionBar({ name, pct, color, width }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between items-center">
        <span className="text-[#051C37] text-sm font-bold">{name}</span>
        <span className="text-[#051C37] text-sm font-bold">{pct}%</span>
      </div>
      <div className="h-2 rounded-full bg-[rgba(190,201,195,0.20)] overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-700 ease-out"
          style={{ width, backgroundColor: color }}
        />
      </div>
    </div>
  )
}

function ReviewCard({ review }) {
  return (
    <div
      className={[
        'relative flex flex-col gap-1 p-4 rounded-xl border overflow-hidden',
        'transition-all duration-200 hover:shadow-md hover:-translate-y-0.5',
        review.borderColor,
        review.bgColor,
      ].join(' ')}
    >
      {/* Left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1"
        style={{ backgroundColor: review.accentColor }}
      />

      <div className="flex justify-between items-start gap-2 pl-1">
        <span className={`text-xs font-bold uppercase tracking-tight ${review.priorityColor}`}>
          {review.priority}
        </span>
        <span className="text-[#3F4945] text-xs font-medium whitespace-nowrap">{review.due}</span>
      </div>
      <p className="text-[#051C37] text-sm font-bold leading-5 pl-1">{review.company}</p>
      <p className="text-[#3F4945] text-xs pl-1">{review.location}</p>
    </div>
  )
}

export default function RightSidebarSection() {
  return (
    <div className="flex flex-col gap-8 p-6">
      {/* Region Distribution */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
            <path d="M10 15L5 13.25L1.125 14.75C0.847222 14.8611 0.590278 14.8299 0.354167 14.6562C0.118056 14.4826 0 14.25 0 13.9583V2.29167C0 2.11111 0.0520833 1.95139 0.15625 1.8125C0.260417 1.67361 0.402778 1.56944 0.583333 1.5L5 0L10 1.75L13.875 0.25C14.1528 0.138889 14.4097 0.170139 14.6458 0.34375C14.8819 0.517361 15 0.75 15 1.04167V12.7083C15 12.8889 14.9479 13.0486 14.8438 13.1875C14.7396 13.3264 14.5972 13.4306 14.4167 13.5L10 15ZM9.16667 12.9583V3.20833L5.83333 2.04167V11.7917L9.16667 12.9583ZM10.8333 12.9583L13.3333 12.125V2.25L10.8333 3.20833V12.9583ZM1.66667 12.75L4.16667 11.7917V2.04167L1.66667 2.875V12.75Z" fill="#004536" />
          </svg>
          <h3 className="text-[#004536] text-sm font-bold leading-6">Region Distribution</h3>
        </div>

        <div className="flex flex-col gap-4">
          {regions.map((r) => (
            <RegionBar key={r.name} {...r} />
          ))}
        </div>
      </section>

      {/* Upcoming Reviews */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <svg width="13" height="17" viewBox="0 0 13 17" fill="none">
            <path d="M5.83333 9.16667H7.5V5H5.83333V9.16667ZM6.66667 11.6667C6.90278 11.6667 7.10069 11.5868 7.26042 11.4271C7.42014 11.2674 7.5 11.0694 7.5 10.8333C7.5 10.5972 7.42014 10.3993 7.26042 10.2396C7.10069 10.0799 6.90278 10 6.66667 10C6.43056 10 6.23264 10.0799 6.07292 10.2396C5.91319 10.3993 5.83333 10.5972 5.83333 10.8333C5.83333 11.0694 5.91319 11.2674 6.07292 11.4271C6.23264 11.5868 6.43056 11.6667 6.66667 11.6667ZM0 14.1667V12.5H1.66667V6.66667C1.66667 5.51389 2.01389 4.48958 2.70833 3.59375C3.40278 2.69792 4.30556 2.11111 5.41667 1.83333V1.25C5.41667 0.902778 5.53819 0.607639 5.78125 0.364583C6.02431 0.121528 6.31944 0 6.66667 0C7.01389 0 7.30903 0.121528 7.55208 0.364583C7.79514 0.607639 7.91667 0.902778 7.91667 1.25V1.83333C9.02778 2.11111 9.93056 2.69792 10.625 3.59375C11.3194 4.48958 11.6667 5.51389 11.6667 6.66667V12.5H13.3333V14.1667H0ZM6.66667 16.6667C6.20833 16.6667 5.81597 16.5035 5.48958 16.1771C5.16319 15.8507 5 15.4583 5 15H8.33333C8.33333 15.4583 8.17014 15.8507 7.84375 16.1771C7.51736 16.5035 7.125 16.6667 6.66667 16.6667ZM3.33333 12.5H10V6.66667C10 5.75 9.67361 4.96528 9.02083 4.3125C8.36806 3.65972 7.58333 3.33333 6.66667 3.33333C5.75 3.33333 4.96528 3.65972 4.3125 4.3125C3.65972 4.96528 3.33333 5.75 3.33333 6.66667V12.5Z" fill="#004536" />
          </svg>
          <h3 className="text-[#004536] text-sm font-bold leading-6">Upcoming Reviews</h3>
        </div>

        <div className="flex flex-col gap-3 pb-3">
          {upcomingReviews.map((r) => (
            <ReviewCard key={r.location} review={r} />
          ))}
        </div>

        <button className="w-full flex items-center justify-center py-3 rounded-xl border border-[rgba(0,69,54,0.20)] text-[#004536] text-sm font-bold transition-all duration-200 hover:bg-[rgba(0,69,54,0.06)] hover:shadow-sm active:scale-[0.98]">
          View All Priority Tasks
        </button>
      </section>

      {/* Lab Insights card */}
      <section className="relative rounded-xl border border-[#004536] border-t-2 bg-white/70 backdrop-blur-sm shadow-[0_4px_12px_0_rgba(11,94,75,0.05)] p-6 overflow-hidden">
        {/* Decorative blur orb */}
        <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full bg-[rgba(0,69,54,0.05)] blur-xl pointer-events-none" />

        <h4 className="text-[#004536] text-sm font-bold mb-2">Need Lab Insights?</h4>
        <p className="text-[#3F4945] text-xs leading-5 mb-4">
          Request detailed chemical analysis for any pending collector application directly from the review panel.
        </p>
        <a
          href="#"
          className="inline-flex items-center gap-1 text-[#004536] text-sm font-bold transition-all duration-200 hover:gap-2"
        >
          Go to Lab Portal
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
            <path d="M8.11667 6H0V4.66667H8.11667L4.38333 0.933333L5.33333 0L10.6667 5.33333L5.33333 10.6667L4.38333 9.73333L8.11667 6Z" fill="currentColor" />
          </svg>
        </a>
      </section>
    </div>
  )
}
