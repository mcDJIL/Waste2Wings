const OilDropIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M0.583333 10.5C0.418056 10.5 0.279514 10.4441 0.167708 10.3323C0.0559028 10.2205 0 10.0819 0 9.91667C0 9.75139 0.0559028 9.61285 0.167708 9.50104C0.279514 9.38924 0.418056 9.33333 0.583333 9.33333H1.16667V5.83333H0.583333C0.418056 5.83333 0.279514 5.77743 0.167708 5.66563C0.0559028 5.55382 0 5.41528 0 5.25C0 5.08472 0.0559028 4.94618 0.167708 4.83437C0.279514 4.72257 0.418056 4.66667 0.583333 4.66667H1.16667V1.16667H0.583333C0.418056 1.16667 0.279514 1.11076 0.167708 0.998958C0.0559028 0.887153 0 0.748611 0 0.583333C0 0.418056 0.0559028 0.279514 0.167708 0.167708C0.279514 0.0559028 0.418056 0 0.583333 0H9.91667C10.0819 0 10.2205 0.0559028 10.3323 0.167708C10.4441 0.279514 10.5 0.418056 10.5 0.583333C10.5 0.748611 10.4441 0.887153 10.3323 0.998958C10.2205 1.11076 10.0819 1.16667 9.91667 1.16667H9.33333V4.66667H9.91667C10.0819 4.66667 10.2205 4.72257 10.3323 4.83437C10.4441 4.94618 10.5 5.08472 10.5 5.25C10.5 5.41528 10.4441 5.55382 10.3323 5.66563C10.2205 5.77743 10.0819 5.83333 9.91667 5.83333H9.33333V9.33333H9.91667C10.0819 9.33333 10.2205 9.38924 10.3323 9.50104C10.4441 9.61285 10.5 9.75139 10.5 9.91667C10.5 10.0819 10.4441 10.2205 10.3323 10.3323C10.2205 10.4441 10.0819 10.5 9.91667 10.5H0.583333ZM2.33333 9.33333H8.16667V5.83333C8.00139 5.83333 7.86285 5.77743 7.75104 5.66563C7.63924 5.55382 7.58333 5.41528 7.58333 5.25C7.58333 5.08472 7.63924 4.94618 7.75104 4.83437C7.86285 4.72257 8.00139 4.66667 8.16667 4.66667V1.16667H2.33333V4.66667C2.49861 4.66667 2.6371 4.72257 2.74891 4.83437C2.86071 4.94618 2.91667 5.08472 2.91667 5.25C2.91667 5.41528 2.86071 5.55382 2.74891 5.66563C2.6371 5.77743 2.49861 5.83333 2.33333 5.83333V9.33333Z" fill="#BEC9C3"/>
  </svg>
)

function QueueItem({ submission, isSelected, onClick, animDelay }) {
  const getStatusColor = (status) => {
    if (status === 'SUBMITTED') {
      return 'bg-[rgba(0,69,54,0.10)]'
    }
    return 'bg-[rgba(190,201,195,0.10)]'
  }

  const getStatusLabel = (status) => {
    const map = {
      'SUBMITTED': 'MENUNGGU',
      'ACCEPTED_BY_COLLECTOR': 'DITERIMA',
      'REJECTED_BY_COLLECTOR': 'DITOLAK',
      'IN_BATCH': 'BATCH',
      'COMPLETED': 'SELESAI',
    }
    return map[status] || status
  }

  return (
    <button
      onClick={onClick}
      className={`
        flex flex-col gap-2 p-4 rounded-xl w-full text-left cursor-pointer
        animate-fade-in transition-all duration-200
        ${isSelected
          ? 'border-l-4 border-t border-r border-b border-[#004536] bg-white/70 backdrop-blur-[10px] shadow-[0_0_0_1px_rgba(0,69,54,0.20),0_1px_2px_0_rgba(0,0,0,0.05)]'
          : 'border border-[rgba(190,201,195,0.30)] bg-white/50 hover:border-[#004536]/40 hover:bg-white/80 hover:shadow-sm'
        }
      `}
      style={{ animationDelay: animDelay }}
    >
      <div className="flex items-start justify-between gap-2 w-full">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-[#051C37] text-base font-bold leading-6 truncate">
            {submission.community?.user?.name || 'Unknown'}
          </span>
          <span className="text-[#3F4945] text-xs font-normal leading-[18px] truncate">
            {submission.id.substring(0, 12)}...
          </span>
        </div>
        {submission.status === 'SUBMITTED' ? (
          <span className={`flex items-center gap-1.5 px-2 py-1 rounded-lg ${getStatusColor(submission.status)} shrink-0`}>
            <span className="w-1.5 h-1.5 rounded-full bg-[#004536] status-pulse shrink-0" />
            <span className="text-[#004536] text-[10px] font-bold leading-[15px] whitespace-nowrap">
              {getStatusLabel(submission.status)}
            </span>
          </span>
        ) : (
          <span className="text-[#BEC9C3] text-[10px] font-bold leading-[15px] shrink-0 pt-1">
            {getStatusLabel(submission.status)}
          </span>
        )}
      </div>

      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-2">
          <OilDropIcon />
          <span className="text-[#051C37] text-base font-bold leading-6">
            {submission.estimatedLiter || 0} L
          </span>
        </div>
        <span className="text-[#6F7975] text-[11px] font-medium leading-[16.5px]">
          {new Date(submission.createdAt).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </button>
  )
}

export default function ValidationQueue({ submissions, selectedId, onSelect, isLoading, pendingCount }) {
  if (isLoading) {
    return (
      <div className="flex flex-col h-full border-r border-[rgba(190,201,195,0.10)]">
        <div className="flex items-center justify-center flex-1">
          <div className="w-6 h-6 border-2 border-[#006C49] border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full border-r border-[rgba(190,201,195,0.10)]">
      <div className="flex items-center justify-between px-6 pt-6 pb-5 shrink-0">
        <span className="text-[#004536] text-base font-normal leading-6">Antrean Validasi</span>
        <span className="px-3 py-1 rounded-full bg-[#81F9C1] text-[#00734E] text-xs font-bold leading-[18px]">
          {pendingCount} Menunggu
        </span>
      </div>

      <div className="flex flex-col gap-3 px-6 pb-6 flex-1 overflow-y-auto">
        {submissions && submissions.length > 0 ? (
          submissions.map((submission, i) => (
            <QueueItem
              key={submission.id}
              submission={submission}
              isSelected={selectedId === submission.id}
              onClick={() => onSelect(submission)}
              animDelay={`${i * 50}ms`}
            />
          ))
        ) : (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-[#3F4945]">Tidak ada data validasi</p>
          </div>
        )}
      </div>
    </div>
  )
}
