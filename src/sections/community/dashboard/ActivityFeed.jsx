const ClockIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M13.3 14.7L14.7 13.3L11 9.6V5H9V10.4L13.3 14.7ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2167 18 14.1042 17.2208 15.6625 15.6625C17.2208 14.1042 18 12.2167 18 10C18 7.78333 17.2208 5.89583 15.6625 4.3375C14.1042 2.77917 12.2167 2 10 2C7.78333 2 5.89583 2.77917 4.3375 4.3375C2.77917 5.89583 2 7.78333 2 10C2 12.2167 2.77917 14.1042 4.3375 15.6625C5.89583 17.2208 7.78333 18 10 18Z" fill="#6F7975" />
  </svg>
)

const BadgeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M2 0H18C18.55 0 19.0208 0.195833 19.4125 0.5875C19.8042 0.979167 20 1.45 20 2V13C20 13.55 19.8042 14.0208 19.4125 14.4125C19.0208 14.8042 18.55 15 18 15H14V20L10 18L6 20V15H2C1.45 15 0.979167 14.8042 0.5875 14.4125C0.195833 14.0208 0 13.55 0 13V2C0 1.45 0.195833 0.979167 0.5875 0.5875C0.979167 0.195833 1.45 0 2 0ZM2 11H18V8H2V11Z" fill="#006C49" />
  </svg>
)

const getActivityIcon = (type) => {
  const map = {
    SUBMISSION_ACCEPTED: 'badge',
    SUBMISSION_SUBMITTED: 'clock',
    SUBMISSION_REJECTED: 'badge',
    SUBMISSION_COMPLETED: 'badge',
    PAYMENT_RECEIVED: 'badge',
    DEFAULT: 'badge',
  }
  return map[type] || map.DEFAULT
}

const getDotColor = (type) => {
  if (type.includes('ACCEPTED') || type.includes('COMPLETED') || type.includes('PAYMENT')) {
    return 'green'
  }
  if (type.includes('REJECTED')) {
    return 'red'
  }
  return 'gold'
}

function ActivityItemIcon({ iconType, imageSrc }) {
  if (iconType === 'image') {
    return (
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl overflow-hidden shrink-0">
        <img src={imageSrc} alt="Setoran" className="w-full h-full object-cover" />
      </div>
    )
  }
  if (iconType === 'clock') {
    return (
      <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#F0F3FF]/50 flex items-center justify-center shrink-0">
        <ClockIcon />
      </div>
    )
  }
  return (
    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl bg-[#81F9C1]/30 flex items-center justify-center shrink-0">
      <BadgeIcon />
    </div>
  )
}

function ActivityItem({ activity, isLast }) {
  const dotClass = activity.dotColor === 'green'
    ? 'bg-[#004536] shadow-[0_0_0_4px_rgba(0,69,54,0.20)]'
    : 'bg-[#C9A96E] shadow-[0_0_0_4px_rgba(201,169,110,0.20)]'

  return (
    <div className="flex gap-3 sm:gap-4 group">
      <div className="flex flex-col items-center pt-2 shrink-0">
        <div className={`w-3 h-3 rounded-full shrink-0 ${dotClass}`} />
        {!isLast && <div className="w-px flex-1 bg-[#BEC9C3]/30 mt-2 min-h-[2rem]" />}
      </div>

      <div className={`flex items-start justify-between flex-1 gap-3 ${!isLast ? 'pb-6 sm:pb-8' : ''}`}>
        <div className="min-w-0">
          <p className="text-[#051C37] font-bold text-sm sm:text-base leading-6 truncate">
            {activity.title}
          </p>
          <p className="text-[#3F4945] text-xs font-medium mt-0.5">{activity.subtitle}</p>
          <p className="text-[#6F7975] text-[10px] font-bold uppercase tracking-wide mt-1">
            {activity.timestamp}
          </p>
        </div>
        <ActivityItemIcon iconType={activity.iconType} imageSrc={activity.imageSrc} />
      </div>
    </div>
  )
}

export default function ActivityFeed({ activities, isLoading }) {
  const formatActivityData = (activity) => {
    return {
      id: activity.type,
      dotColor: getDotColor(activity.type),
      title: activity.message,
      subtitle: '',
      timestamp: new Date(activity.createdAt).toLocaleDateString('id-ID', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
      iconType: getActivityIcon(activity.type),
    }
  }

  const displayActivities = activities ? activities.map(formatActivityData) : []

  return (
    <div className="p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-[#8DD5BD]/10 bg-white
      shadow-[0_1px_2px_0_rgba(0,0,0,0.05)]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-[#051C37]">Aktivitas Terkini</h3>
        <button className="text-sm font-semibold text-[#006C49] hover:text-[#004536] transition-colors
          hover:underline underline-offset-2">
          Lihat Semua
        </button>
      </div>

      <div className="flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-4 h-4 border-2 border-[#006C49] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : displayActivities.length === 0 ? (
          <div className="text-center py-8 text-[#3F4945]">
            <p>Belum ada aktivitas</p>
          </div>
        ) : (
          displayActivities.map((activity, index) => (
            <ActivityItem
              key={activity.id + index}
              activity={activity}
              isLast={index === displayActivities.length - 1}
            />
          ))
        )}
      </div>
    </div>
  )
}
