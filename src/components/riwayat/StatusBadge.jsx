const STATUS_STYLES = {
  Selesai: 'border-[#006C49]/20 bg-[#006C49]/10 text-[#006C49]',
  Menunggu: 'border-[#C9A96E]/20 bg-[#C9A96E]/10 text-[#C9A96E]',
  Dibatalkan: 'border-[#BEC9C3]/30 bg-[#BEC9C3]/20 text-[#3F4945]',
}

export default function StatusBadge({ status }) {
  const style = STATUS_STYLES[status] ?? 'border-[#BEC9C3]/30 bg-[#BEC9C3]/20 text-[#3F4945]'
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full border text-xs font-medium whitespace-nowrap transition-all duration-200 ${style}`}>
      {status}
    </span>
  )
}
