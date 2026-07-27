import { useEffect, useState } from 'react'

export default function MetricCard({ icon, badge, label, value, enterDelay = 0 }) {
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setEntered(true), enterDelay)
    return () => clearTimeout(t)
  }, [enterDelay])

  return (
    <div
      className={[
        'flex flex-col p-5 sm:p-6 rounded-xl border-t-2 border-t-[#C9A96E]',
        'bg-white/70 backdrop-blur-sm shadow-[0_4px_12px_0_rgba(11,94,75,0.05)] overflow-hidden',
        'transition-all duration-500 hover:shadow-[0_12px_28px_0_rgba(11,94,75,0.18)] hover:-translate-y-1 cursor-default select-none',
        entered ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5',
      ].join(' ')}
    >
      <div className="flex justify-between items-start gap-2">
        <div className="shrink-0">{icon}</div>
        {badge && <div className="shrink-0">{badge}</div>}
      </div>
      <div className="mt-4">
        <p className="text-[#3F4945] text-sm leading-6">{label}</p>
        <div className="text-sm font-bold leading-6 mt-0.5">{value}</div>
      </div>
    </div>
  )
}
