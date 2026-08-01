import { useEffect, useRef, useState } from 'react'

function useCountUp(target, duration = 1400, delay = 200) {
  const [count, setCount] = useState(0)
  const startRef = useRef(null)
  const rafRef = useRef(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      const animate = (timestamp) => {
        if (!startRef.current) startRef.current = timestamp
        const elapsed = timestamp - startRef.current
        const progress = Math.min(elapsed / duration, 1)
        const eased = 1 - Math.pow(1 - progress, 3)
        setCount(Math.round(eased * target))
        if (progress < 1) rafRef.current = requestAnimationFrame(animate)
      }
      rafRef.current = requestAnimationFrame(animate)
    }, delay)

    return () => {
      clearTimeout(timer)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration, delay])

  return count
}

function OilDropIcon() {
  return (
    <svg width="16" height="19" viewBox="0 0 16 19" fill="none">
      <path d="M8 19C5.78333 19 3.89583 18.2333 2.3375 16.7C0.779167 15.1667 0 13.3 0 11.1C0 10.0167 0.208333 9.0042 0.625 8.0625C1.04167 7.12083 1.61667 6.2833 2.35 5.55L8 0L13.65 5.55C14.3833 6.2833 14.9583 7.12083 15.375 8.0625C15.7917 9.0042 16 10.0167 16 11.1C16 13.3 15.2208 15.1667 13.6625 16.7C12.1042 18.2333 10.2167 19 8 19ZM2.05 12H13.95C14.15 10.8 14.0375 9.775 13.6125 8.925C13.1875 8.075 12.75 7.4333 12.3 7L8 2.8L3.7 7C3.25 7.4333 2.8083 8.075 2.375 8.925C1.94167 9.775 1.81667 10.8 2.05 12Z" fill="#004536" />
    </svg>
  )
}

function VerifiedIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M7.6 21L5.7 17.8L2.1 17L2.45 13.3L0 10.5L2.45 7.7L2.1 4L5.7 3.2L7.6 0L11 1.45L14.4 0L16.3 3.2L19.9 4L19.55 7.7L22 10.5L19.55 13.3L19.9 17L16.3 17.8L14.4 21L11 19.55L7.6 21ZM9.95 14.05L15.6 8.4L14.2 6.95L9.95 11.2L7.8 9.1L6.4 10.5L9.95 14.05Z" fill="#006C49" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
      <path d="M5.73333 9.73333L10.4333 5.03333L9.5 4.1L5.73333 7.86667L3.83333 5.96667L2.9 6.9L5.73333 9.73333ZM6.66667 13.3333C5.74444 13.3333 4.87778 13.1583 4.06667 12.8083C3.25556 12.4583 2.55 11.9833 1.95 11.3833C1.35 10.7833 0.875 10.0778 0.525 9.26667C0.175 8.45555 0 7.58889 0 6.66667C0 5.74444 0.175 4.87778 0.525 4.06667C0.875 3.25556 1.35 2.55 1.95 1.95C2.55 1.35 3.25556 0.875 4.06667 0.525C4.87778 0.175 5.74444 0 6.66667 0C7.58889 0 8.45555 0.175 9.26667 0.525C10.0778 0.875 10.7833 1.35 11.3833 1.95C11.9833 2.55 12.4583 3.25556 12.8083 4.06667C13.1583 4.87778 13.3333 5.74444 13.3333 6.66667C13.3333 7.58889 13.1583 8.45555 12.8083 9.26667C12.4583 10.0778 11.9833 10.7833 11.3833 11.3833C10.7833 11.9833 10.0778 12.4583 9.26667 12.8083C8.45555 13.1583 7.58889 13.3333 6.66667 13.3333Z" fill="#006C49" />
    </svg>
  )
}

function TreeIcon() {
  return (
    <svg width="22" height="20" viewBox="0 0 22 20" fill="none">
      <path d="M5 20V16H0L3.2 10.5H1.7L8 0L11 4.3L14 0L20.3 10.5H18.8L22 16H17V20H13V16H9V20H5ZM14.725 14H18.35L14.475 8.5H16.15L13 4L10.225 8.025L13 12H11.15L13.725 14ZM3.65 14H14.35L10.475 8.5H12.15L9 4L5.85 8.5H7.525L3.65 14Z" fill="#674F1D" />
    </svg>
  )
}

function TotalSetoranCard({ data, isLoading }) {
  const targetValue = data?.totalCleanLiter || 0
  const count = useCountUp(targetValue, 1400, 300)

  if (isLoading) {
    return (
      <div className="flex-1 min-w-0 p-6 rounded-2xl border-t-[3px] border-[#C9A96E] bg-white
        shadow-[0_5px_5px_0_rgba(0,0,0,0.10)] animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-w-0 p-6 rounded-2xl border-t-[3px] border-[#C9A96E] bg-white
      shadow-[0_5px_5px_0_rgba(0,0,0,0.10)] hover:shadow-xl hover:-translate-y-1
      transition-all duration-300 cursor-default">
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 rounded-xl bg-[#004536]/10">
          <OilDropIcon />
        </div>
        <span className="text-xs font-bold text-[#C9A96E] bg-[#C9A96E]/10 px-2 py-1 rounded-lg">
          {data?.totalSubmissions || 0} Setoran
        </span>
      </div>
      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.6px] text-[#3F4945] mt-4">
        Total Volume Bersih
      </p>
      <div className="flex items-end gap-1 mt-1">
        <span className="text-4xl sm:text-5xl font-bold text-[#004536] leading-none tabular-nums">
          {count}
        </span>
        <span className="text-xl sm:text-2xl font-semibold text-[#004536] mb-1">L</span>
      </div>
    </div>
  )
}

function StatusTerakhirCard({ data, isLoading }) {
  if (isLoading) {
    return (
      <div className="flex-1 min-w-0 p-6 rounded-2xl border-t-[3px] border-[#C9A96E] bg-white
        shadow-[0_5px_5px_0_rgba(0,0,0,0.10)] animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  const latest = data?.latestSubmission
  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffHours = Math.floor((now - date) / (1000 * 60 * 60))
    if (diffHours < 1) return 'Baru saja'
    if (diffHours < 24) return `${diffHours} jam yang lalu`
    const diffDays = Math.floor(diffHours / 24)
    return `${diffDays} hari yang lalu`
  }

  const getStatusLabel = (status) => {
    const map = {
      SUBMITTED: 'Menunggu',
      ACCEPTED_BY_COLLECTOR: 'Diterima Pengepul',
      REJECTED_BY_COLLECTOR: 'Ditolak Pengepul',
      IN_BATCH: 'Dalam Batch',
      COMPLETED: 'Selesai',
    }
    return map[status] || status
  }

  return (
    <div className="flex-1 min-w-0 p-6 rounded-2xl border-t-[3px] border-[#C9A96E] bg-white
      shadow-[0_5px_5px_0_rgba(0,0,0,0.10)] hover:shadow-xl hover:-translate-y-1
      transition-all duration-300 cursor-default">
      <div className="flex justify-between items-start">
        <div className="p-2 rounded-xl bg-[#006C49]/10">
          <VerifiedIcon />
        </div>
        <span className="text-[#3F4945] text-xs font-medium">{latest ? formatDate(latest.createdAt) : '-'}</span>
      </div>
      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.6px] text-[#3F4945] mt-5">
        Status Terakhir
      </p>
      <div className="flex items-center gap-2 mt-1 flex-wrap">
        <span className="text-xl sm:text-2xl font-semibold text-[#006C49]">
          {latest ? getStatusLabel(latest.status) : '-'}
        </span>
        {latest && <CheckCircleIcon />}
      </div>
    </div>
  )
}

function PendapatanCard({ data, isLoading }) {
  const count = useCountUp(data?.totalPaid || 0, 1400, 300)

  if (isLoading) {
    return (
      <div className="flex-1 min-w-0 p-6 rounded-2xl border-t-[3px] border-[#C9A96E] bg-white
        shadow-[0_5px_5px_0_rgba(0,0,0,0.10)] animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-10 bg-gray-200 rounded w-1/2"></div>
      </div>
    )
  }

  return (
    <div className="flex-1 min-w-0 p-6 rounded-2xl border-t-[3px] border-[#C9A96E] bg-white
      shadow-[0_5px_5px_0_rgba(0,0,0,0.10)] hover:shadow-xl hover:-translate-y-1
      transition-all duration-300 cursor-default">
      <div className="flex justify-between items-start mb-3">
        <div className="p-2 rounded-xl bg-[#674F1D]/10">
          <TreeIcon />
        </div>
        <span className="text-xs font-bold text-[#674F1D] bg-[#674F1D]/10 px-2 py-1 rounded-lg">
          Total
        </span>
      </div>
      <p className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.6px] text-[#3F4945] mt-4">
        Total Pendapatan
      </p>
      <div className="flex items-end gap-1 mt-1">
        <span className="text-2xl sm:text-3xl font-bold text-[#004536] leading-none tabular-nums">
          Rp {count.toLocaleString('id-ID')}
        </span>
      </div>
    </div>
  )
}

export default function StatCards({ data, isLoading }) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
      <TotalSetoranCard data={data} isLoading={isLoading} />
      <StatusTerakhirCard data={data} isLoading={isLoading} />
      <PendapatanCard data={data} isLoading={isLoading} />
    </div>
  )
}
