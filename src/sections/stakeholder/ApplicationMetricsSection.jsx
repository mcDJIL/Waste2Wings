import MetricCard from '../../components/stakeholder/MetricCard'

function ClipboardIcon() {
  return (
    <div className="p-3 rounded-lg bg-[rgba(0,69,54,0.10)]">
      <svg width="19" height="21" viewBox="0 0 19 21" fill="none">
        <path
          d="M5 19C4.45 19 3.97917 18.8042 3.5875 18.4125C3.19583 18.0208 3 17.55 3 17V3C3 2.45 3.19583 1.97917 3.5875 1.5875C3.97917 1.19583 4.45 1 5 1H9.175C9.35833 0.416667 9.71667 -0.0625 10.25 -0.4375C10.7833 -0.8125 11.3667 -1 12 -1C12.6667 -1 13.2625 -0.8125 13.7875 -0.4375C14.3125 -0.0625 14.6667 0.416667 14.85 1H19C19.55 1 20.0208 1.19583 20.4125 1.5875C20.8042 1.97917 21 2.45 21 3V17C21 17.55 20.8042 18.0208 20.4125 18.4125C20.0208 18.8042 19.55 19 19 19H5ZM5 17H19V3H17V6H7V3H5V17ZM7 15H14V13H7V15ZM7 11H17V9H7V11ZM7 7H17V5H7V7ZM12 4.25C12.2167 4.25 12.3958 4.17917 12.5375 4.0375C12.6792 3.89583 12.75 3.71667 12.75 3.5C12.75 3.28333 12.6792 3.10417 12.5375 2.9625C12.3958 2.82083 12.2167 2.75 12 2.75C11.7833 2.75 11.6042 2.82083 11.4625 2.9625C11.3208 3.10417 11.25 3.28333 11.25 3.5C11.25 3.71667 11.3208 3.89583 11.4625 4.0375C11.6042 4.17917 11.7833 4.25 12 4.25Z"
          fill="#004536"
          transform="translate(-2, -2)"
        />
        <path
          d="M9 13C7.6167 13 6.4375 12.5125 5.4625 11.5375C4.4875 10.5625 4 9.3833 4 8C4 6.6167 4.4875 5.4375 5.4625 4.4625C6.4375 3.4875 7.6167 3 9 3C10.3833 3 11.5625 3.4875 12.5375 4.4625C13.5125 5.4375 14 6.6167 14 8C14 9.3833 13.5125 10.5625 12.5375 11.5375C11.5625 12.5125 10.3833 13 9 13ZM10.675 10.375L11.375 9.675L9.5 7.8V5H8.5V8.2L10.675 10.375ZM2 18V16H4C4 14.6167 4.4875 13.4375 5.4625 12.4625C6.4375 11.4875 7.6167 11 9 11C9.70833 11 10.3792 11.1458 11.0125 11.4375C11.6458 11.7292 12.1917 12.1333 12.65 12.65L14 11.3V17C14 17.2833 13.9042 17.5208 13.7125 17.7125C13.5208 17.9042 13.2833 18 13 18H2Z"
          fill="#004536"
          transform="translate(5, 6) scale(0.85)"
        />
      </svg>
    </div>
  )
}

function TaskIcon() {
  return (
    <div className="p-3 rounded-lg bg-[rgba(0,69,54,0.10)]">
      <svg width="19" height="20" viewBox="0 0 19 20" fill="none">
        <path
          d="M2 20C1.45 20 0.979167 19.8042 0.5875 19.4125C0.195833 19.0208 0 18.55 0 18V4C0 3.45 0.195833 2.97917 0.5875 2.5875C0.979167 2.19583 1.45 2 2 2H6.2C6.41667 1.4 6.77917 0.916667 7.2875 0.55C7.79583 0.183333 8.36667 0 9 0C9.63333 0 10.2042 0.183333 10.7125 0.55C11.2208 0.916667 11.5833 1.4 11.8 2H16C16.55 2 17.0208 2.19583 17.4125 2.5875C17.8042 2.97917 18 3.45 18 4V18C18 18.55 17.8042 19.0208 17.4125 19.4125C17.0208 19.8042 16.55 20 16 20H2ZM2 18H16V4H2V18ZM4 16H11V14H4V16ZM4 12H14V10H4V12ZM4 8H14V6H4V8ZM9 3.25C9.21667 3.25 9.39583 3.17917 9.5375 3.0375C9.67917 2.89583 9.75 2.71667 9.75 2.5C9.75 2.28333 9.67917 2.10417 9.5375 1.9625C9.39583 1.82083 9.21667 1.75 9 1.75C8.78333 1.75 8.60417 1.82083 8.4625 1.9625C8.32083 2.10417 8.25 2.28333 8.25 2.5C8.25 2.71667 8.32083 2.89583 8.4625 3.0375C8.60417 3.17917 8.78333 3.25 9 3.25Z"
          fill="#004536"
        />
      </svg>
    </div>
  )
}

function ClockIcon() {
  return (
    <div className="p-3 rounded-lg bg-[rgba(0,108,73,0.10)]">
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <path
          d="M6 2V0H12V2H6ZM8 11H10V5H8V11ZM9 18C7.76667 18 6.60417 17.7625 5.5125 17.2875C4.42083 16.8125 3.46667 16.1667 2.65 15.35C1.83333 14.5333 1.1875 13.5792 0.7125 12.4875C0.2375 11.3958 0 10.2333 0 9C0 7.76667 0.2375 6.60417 0.7125 5.5125C1.1875 4.42083 1.83333 3.46667 2.65 2.65C3.46667 1.83333 4.42083 1.1875 5.5125 0.7125C6.60417 0.2375 7.76667 0 9 0C10.0333 0 11.025 0.166667 11.975 0.5C12.925 0.833333 13.8167 1.31667 14.65 1.95L16.05 0.55L17.45 1.95L16.05 3.35C16.6833 4.18333 17.1667 5.075 17.5 6.025C17.8333 6.975 18 7.96667 18 9C18 10.2333 17.7625 11.3958 17.2875 12.4875C16.8125 13.5792 16.1667 14.5333 15.35 15.35C14.5333 16.1667 13.5792 16.8125 12.4875 17.2875C11.3958 17.7625 10.2333 18 9 18ZM9 16C10.9333 16 12.5833 15.3167 13.95 13.95C15.3167 12.5833 16 10.9333 16 9C16 7.06667 15.3167 5.41667 13.95 4.05C12.5833 2.68333 10.9333 2 9 2C7.06667 2 5.41667 2.68333 4.05 4.05C2.68333 5.41667 2 7.06667 2 9C2 10.9333 2.68333 12.5833 4.05 13.95C5.41667 15.3167 7.06667 16 9 16Z"
          fill="#006C49"
        />
      </svg>
    </div>
  )
}

function BadgeIcon() {
  return (
    <div className="p-3 rounded-lg bg-[rgba(103,79,29,0.10)]">
      <svg width="20" height="21" viewBox="0 0 20 21" fill="none">
        <path
          d="M7.6 21L5.7 17.8L2.1 17L2.45 13.3L0 10.5L2.45 7.7L2.1 4L5.7 3.2L7.6 0L11 1.45L14.4 0L16.3 3.2L19.9 4L19.55 7.7L22 10.5L19.55 13.3L19.9 17L16.3 17.8L14.4 21L11 19.55L7.6 21ZM8.45 18.45L11 17.35L13.6 18.45L15 16.05L17.75 15.4L17.5 12.6L19.35 10.5L17.5 8.35L17.75 5.55L15 4.95L13.55 2.55L11 3.65L8.4 2.55L7 4.95L4.25 5.55L4.5 8.35L2.65 10.5L4.5 12.6L4.25 15.45L7 16.05L8.45 18.45ZM9.95 14.05L15.6 8.4L14.2 6.95L9.95 11.2L7.8 9.1L6.4 10.5L9.95 14.05Z"
          fill="#FFDEA4"
          transform="translate(-1, -0.5)"
        />
      </svg>
    </div>
  )
}

export default function ApplicationMetricsSection({ batches = [], isLoading = false }) {
  const stats = {
    total: batches.length,
    pending: batches.filter(b => b.status === 'SUBMITTED_TO_STAKEHOLDER').length,
    approved: batches.filter(b => b.status === 'ACCEPTED_BY_STAKEHOLDER').length,
    rejected: batches.filter(b => b.status === 'REJECTED_BY_STAKEHOLDER').length,
  }

  const totalLiters = batches.reduce((sum, b) => sum + (b.totalCleanLiter || 0), 0)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      <MetricCard
        icon={<TaskIcon />}
        badge={
          <p className="text-sm font-bold text-[#3F4945] text-right leading-5">
            {stats.pending} Pending
          </p>
        }
        label="Total Pengajuan Batch"
        value={
          <span>
            <span className="text-[#051C37]">{stats.total}</span>{' '}
            <span className="text-[#3F4945]">Batch</span>
          </span>
        }
        enterDelay={0}
      />

      <MetricCard
        icon={<ClockIcon />}
        badge={
          <span className="inline-block px-2 py-0.5 rounded bg-[rgba(0,115,78,0.10)] text-[#81F9C1] text-sm font-bold">
            {stats.approved} Diterima
          </span>
        }
        label="Total Liter Diterima"
        value={
          <span>
            <span className="text-[#051C37]">{batches.filter(b => b.status === 'ACCEPTED_BY_STAKEHOLDER').reduce((sum, b) => sum + (b.finalLiter || 0), 0)}</span>{' '}
            <span className="text-[#3F4945]">Liter</span>
          </span>
        }
        enterDelay={100}
      />

      <MetricCard
        icon={<BadgeIcon />}
        badge={
          <p className="text-sm font-bold text-[#3F4945] text-right leading-5">
            {stats.total > 0 ? `${Math.round((stats.approved / stats.total) * 100)}%` : '0%'}<br />Accepted
          </p>
        }
        label="Tingkat Penerimaan"
        value={
          <span>
            <span className="text-[#051C37]">{stats.approved}</span>{' '}
            <span className="text-[#3F4945]">dari {stats.total}</span>
          </span>
        }
        enterDelay={200}
      />
    </div>
  )
}
