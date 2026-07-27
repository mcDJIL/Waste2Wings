const kpis = [
  {
    label: 'TOTAL BATCH PROCESSED',
    value: '1,242',
    unit: 'units',
    badge: { text: '+12.4%', color: 'text-[#006C49] bg-[#ECFDF5]' },
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 3h16v3H3V3zm0 5h16v11H3V8zm4 3v5h8v-5H7z" fill="#004536" opacity=".15"/>
        <path d="M2 2h18v4H2V2zm1 5h16v12H3V7zm3 3v6h10v-6H6z" stroke="#004536" strokeWidth="1.3" strokeLinejoin="round"/>
      </svg>
    ),
    iconBg: 'bg-[#004536]/10',
  },
  {
    label: 'QUALITY INDEX AVERAGE',
    value: 'B+',
    unit: 'Elite Grade',
    badge: { text: 'Target: A', color: 'text-[#3F4945] bg-[#F3F4F6]' },
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="11" r="9" stroke="#004536" strokeWidth="1.3"/>
        <path d="M7 11.5l3 3 5-6" stroke="#006C49" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    iconBg: 'bg-[#004536]/10',
  },
  {
    label: 'SAF STANDARD COMPLIANCE',
    value: '92.4%',
    showBar: true,
    barValue: 92,
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2L3 6v5c0 4.97 3.4 9.63 8 10.93C16.6 20.63 20 15.97 20 11V6L11 2z" stroke="#004536" strokeWidth="1.3" strokeLinejoin="round"/>
        <path d="M8 11l2 2 4-4" stroke="#006C49" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    iconBg: 'bg-[#004536]/10',
  },
  {
    label: 'PENDING VALIDATION',
    value: '08',
    unit: 'batches',
    badge: { text: 'HIGH RISK', color: 'text-[#DC2626] bg-[#FEF2F2]' },
    icon: (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="2" width="11" height="15" rx="1" stroke="#4E3807" strokeWidth="1.3"/>
        <path d="M6 6h8M6 9h8M6 12h5" stroke="#4E3807" strokeWidth="1.3" strokeLinecap="round"/>
        <circle cx="16" cy="16" r="4" fill="#FEF2F2" stroke="#DC2626" strokeWidth="1.3"/>
        <path d="M16 13.5v3M16 17.5v.5" stroke="#DC2626" strokeWidth="1.3" strokeLinecap="round"/>
      </svg>
    ),
    iconBg: 'bg-[#4E3807]/10',
  },
]

export default function LabKpiCards() {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-4 gap-4">
      {kpis.map((kpi, i) => (
        <div
          key={i}
          className="flex flex-col justify-between gap-3 p-5 rounded-xl border-t-2 border border-[#C9A96E] bg-white/70 backdrop-blur-[10px] shadow-sm min-h-[130px] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md animate-fade-slide-up"
          style={{ animationDelay: `${i * 60}ms` }}
        >
          <div className="flex justify-between items-start gap-2">
            <span className="text-[#3F4945] text-[10px] font-normal uppercase tracking-[0.8px] leading-4">
              {kpi.label}
            </span>
            <div className={`flex-shrink-0 p-1.5 rounded-lg ${kpi.iconBg}`}>
              {kpi.icon}
            </div>
          </div>

          <div>
            {kpi.badge && (
              <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-bold mb-1 ${kpi.badge.color}`}>
                {kpi.badge.text}
              </span>
            )}
            <div className="flex items-baseline gap-1.5">
              <span className="text-[#051C37] text-2xl font-bold leading-7">{kpi.value}</span>
              {kpi.unit && <span className="text-[#3F4945] text-xs">{kpi.unit}</span>}
            </div>
            {kpi.showBar && (
              <div className="mt-2 w-full h-1.5 rounded-full bg-[#BEC9C3]/40 overflow-hidden">
                <div
                  className="h-full bg-[#006C49] rounded-full transition-all duration-700"
                  style={{ width: `${kpi.barValue}%` }}
                />
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
