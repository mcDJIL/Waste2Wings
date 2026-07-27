export default function LabKpiCards({ batches = [] }) {
  const kpis = [
    {
      label: 'Total Batches',
      value: batches.length,
      unit: 'batches',
      iconBg: 'bg-[#D1FAE5]',
      icon: <span className="text-[#065F46] text-lg">📦</span>,
    },
    {
      label: 'Under Review',
      value: batches.filter((b) => b.status === 'LAB_REVIEW').length,
      unit: 'batches',
      iconBg: 'bg-[#DBEAFE]',
      icon: <span className="text-[#1E40AF] text-lg">🔍</span>,
    },
    {
      label: 'Accepted',
      value: batches.filter((b) => b.status === 'ACCEPTED_BY_STAKEHOLDER').length,
      unit: 'batches',
      iconBg: 'bg-[#D1FAE5]',
      icon: <span className="text-[#065F46] text-lg">✓</span>,
    },
    {
      label: 'Rejected',
      value: batches.filter((b) => b.status === 'REJECTED_BY_STAKEHOLDER').length,
      unit: 'batches',
      iconBg: 'bg-[#FEE2E2]',
      icon: <span className="text-[#991B1B] text-lg">✕</span>,
    },
  ]

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
            <div className={`flex-shrink-0 w-10 h-10 rounded-lg ${kpi.iconBg} flex items-center justify-center`}>
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
