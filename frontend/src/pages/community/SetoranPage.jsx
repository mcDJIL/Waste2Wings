import { useState, useEffect } from 'react'
import Sidebar from '../../sections/community/dashboard/Sidebar'
import TopBar from '../../sections/community/dashboard/TopBar'
import DashboardFooter from '../../sections/community/dashboard/DashboardFooter'
import SubmissionModal from '../../components/modals/SubmissionModal'
import SubmissionHistoryTable from '../../sections/community/setoran/SubmissionHistoryTable'
import api from '../../services/api'

/* ── Icons ────────────────────────────────────────────── */
const PlusCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
    <path d="M9 15H11V11H15V9H11V5H9V9H5V11H9V15ZM10 20C8.61667 20 7.31667 19.7375 6.1 19.2125C4.88333 18.6875 3.825 17.975 2.925 17.075C2.025 16.175 1.3125 15.1167 0.7875 13.9C0.2625 12.6833 0 11.3833 0 10C0 8.61667 0.2625 7.31667 0.7875 6.1C1.3125 4.88333 2.025 3.825 2.925 2.925C3.825 2.025 4.88333 1.3125 6.1 0.7875C7.31667 0.2625 8.61667 0 10 0C11.3833 0 12.6833 0.2625 13.9 0.7875C15.1167 1.3125 16.175 2.025 17.075 2.925C17.975 3.825 18.6875 4.88333 19.2125 6.1C19.7375 7.31667 20 8.61667 20 10C20 11.3833 19.7375 12.6833 19.2125 13.9C18.6875 15.1167 17.975 16.175 17.075 17.075C16.175 17.975 15.1167 18.6875 13.9 19.2125C12.6833 19.7375 11.3833 20 10 20ZM10 18C12.2333 18 14.125 17.225 15.675 15.675C17.225 14.125 18 12.2333 18 10C18 7.76667 17.225 5.875 15.675 4.325C14.125 2.775 12.2333 2 10 2C7.76667 2 5.875 2.775 4.325 4.325C2.775 5.875 2 7.76667 2 10C2 12.2333 2.775 14.125 4.325 15.675C5.875 17.225 7.76667 18 10 18Z" fill="white" />
  </svg>
)

const TrendUpIcon = () => (
  <svg width="10" height="6" viewBox="0 0 10 6" fill="none">
    <path d="M0.7 6L0 5.3L3.7 1.575L5.7 3.575L8.3 1H7V0H10V3H9V1.7L5.7 5L3.7 3L0.7 6Z" fill="#006C49" />
  </svg>
)

const VerifiedIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M3.8 10.5L2.85 8.9L1.05 8.5L1.225 6.65L0 5.25L1.225 3.85L1.05 2L2.85 1.6L3.8 0L5.5 0.725L7.2 0L8.15 1.6L9.95 2L9.775 3.85L11 5.25L9.775 6.65L9.95 8.5L8.15 8.9L7.2 10.5L5.5 9.775L3.8 10.5ZM4.225 9.225L5.5 8.675L6.8 9.225L7.5 8.025L8.875 7.7L8.75 6.3L9.675 5.25L8.75 4.175L8.875 2.775L7.5 2.475L6.775 1.275L5.5 1.825L4.2 1.275L3.5 2.475L2.125 2.775L2.25 4.175L1.325 5.25L2.25 6.3L2.125 7.725L3.5 8.025L4.225 9.225ZM4.975 7.025L7.8 4.2L7.1 3.475L4.975 5.6L3.9 4.55L3.2 5.25L4.975 7.025Z" fill="#006C49" />
  </svg>
)

const GiftIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M1 7.5V8.5H9V7.5H1ZM1 2H2.1C2.05833 1.925 2.03125 1.84583 2.01875 1.7625C2.00625 1.67917 2 1.59167 2 1.5C2 1.08333 2.14583 0.729167 2.4375 0.4375C2.72917 0.145833 3.08333 0 3.5 0C3.75 0 3.98125 0.0645833 4.19375 0.19375C4.40625 0.322917 4.59167 0.483333 4.75 0.675L5 1L5.25 0.675C5.4 0.475 5.58333 0.3125 5.8 0.1875C6.01667 0.0625 6.25 0 6.5 0C6.91667 0 7.27083 0.145833 7.5625 0.4375C7.85417 0.729167 8 1.08333 8 1.5C8 1.59167 7.99375 1.67917 7.98125 1.7625C7.96875 1.84583 7.94167 1.925 7.9 2H9C9.275 2 9.51042 2.09792 9.70625 2.29375C9.90208 2.48958 10 2.725 10 3V8.5C10 8.775 9.90208 9.01042 9.70625 9.20625C9.51042 9.40208 9.275 9.5 9 9.5H1C0.725 9.5 0.489583 9.40208 0.29375 9.20625C0.0979166 9.01042 0 8.775 0 8.5V3C0 2.725 0.0979166 2.48958 0.29375 2.29375C0.489583 2.09792 0.725 2 1 2ZM1 6H9V3H6.45L7.5 4.425L6.7 5L5 2.7L3.3 5L2.5 4.425L3.525 3H1V6ZM3.5 2C3.64167 2 3.76042 1.95208 3.85625 1.85625C3.95208 1.76042 4 1.64167 4 1.5C4 1.35833 3.95208 1.23958 3.85625 1.14375C3.76042 1.04792 3.64167 1 3.5 1C3.35833 1 3.23958 1.04792 3.14375 1.14375C3.04792 1.23958 3 1.35833 3 1.5C3 1.64167 3.04792 1.76042 3.14375 1.85625C3.23958 1.95208 3.35833 2 3.5 2ZM6.5 2C6.64167 2 6.76042 1.95208 6.85625 1.85625C6.95208 1.76042 7 1.64167 7 1.5C7 1.35833 6.95208 1.23958 6.85625 1.14375C6.76042 1.04792 6.64167 1 6.5 1C6.35833 1 6.23958 1.04792 6.14375 1.14375C6.04792 1.23958 6 1.35833 6 1.5C6 1.64167 6.04792 1.76042 6.14375 1.85625C6.23958 1.95208 6.35833 2 6.5 2Z" fill="#C9A96E" />
  </svg>
)

const FilterIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M4.09534 9.33333C3.93007 9.33333 3.79152 9.27743 3.67972 9.16562C3.56791 9.05382 3.51201 8.91528 3.51201 8.75V5.25L0.128676 0.933333C-0.0171569 0.738889 -0.0390319 0.534722 0.0630515 0.320833C0.165135 0.106944 0.342565 0 0.595343 0H8.76201C9.01479 0 9.19222 0.106944 9.2943 0.320833C9.39638 0.534722 9.37451 0.738889 9.22868 0.933333L5.84534 5.25V8.75C5.84534 8.91528 5.78944 9.05382 5.67763 9.16562C5.56583 9.27743 5.42729 9.33333 5.26201 9.33333H4.09534ZM4.67868 4.84167L7.56618 1.16667H1.79118L4.67868 4.84167Z" fill="#3F4945" />
  </svg>
)

const DownloadIcon = () => (
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
    <path d="M4.66667 7L1.75 4.08333L2.56667 3.2375L4.08333 4.75417V0H5.25V4.75417L6.76667 3.2375L7.58333 4.08333L4.66667 7ZM1.16667 9.33333C0.845833 9.33333 0.571181 9.2191 0.342708 8.99063C0.114236 8.76215 0 8.4875 0 8.16667V6.41667H1.16667V8.16667H8.16667V6.41667H9.33333V8.16667C9.33333 8.4875 9.2191 8.76215 8.99063 8.99063C8.76215 9.2191 8.4875 9.33333 8.16667 9.33333H1.16667Z" fill="#3F4945" />
  </svg>
)

const EyeIcon = () => (
  <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
    <path d="M8.25 9C9.1875 9 9.98438 8.67188 10.6406 8.01562C11.2969 7.35938 11.625 6.5625 11.625 5.625C11.625 4.6875 11.2969 3.89062 10.6406 3.23438C9.98438 2.57812 9.1875 2.25 8.25 2.25C7.3125 2.25 6.51562 2.57812 5.85938 3.23438C5.20312 3.89062 4.875 4.6875 4.875 5.625C4.875 6.5625 5.20312 7.35938 5.85938 8.01562C6.51562 8.67188 7.3125 9 8.25 9ZM8.25 7.65C7.6875 7.65 7.20938 7.45312 6.81563 7.05937C6.42188 6.66562 6.225 6.1875 6.225 5.625C6.225 5.0625 6.42188 4.58438 6.81563 4.19063C7.20938 3.79688 7.6875 3.6 8.25 3.6C8.8125 3.6 9.29062 3.79688 9.68437 4.19063C10.0781 4.58438 10.275 5.0625 10.275 5.625C10.275 6.1875 10.0781 6.66562 9.68437 7.05937C9.29062 7.45312 8.8125 7.65 8.25 7.65ZM8.25 11.25C6.425 11.25 4.7625 10.7406 3.2625 9.72188C1.7625 8.70312 0.675 7.3375 0 5.625C0.675 3.9125 1.7625 2.54688 3.2625 1.52813C4.7625 0.509375 6.425 0 8.25 0C10.075 0 11.7375 0.509375 13.2375 1.52813C14.7375 2.54688 15.825 3.9125 16.5 5.625C15.825 7.3375 14.7375 8.70312 13.2375 9.72188C11.7375 10.7406 10.075 11.25 8.25 11.25ZM8.25 9.75C9.6625 9.75 10.9594 9.37812 12.1406 8.63437C13.3219 7.89062 14.225 6.8875 14.85 5.625C14.225 4.3625 13.3219 3.35938 12.1406 2.61562C10.9594 1.87187 9.6625 1.5 8.25 1.5C6.8375 1.5 5.54063 1.87187 4.35938 2.61562C3.17812 3.35938 2.275 4.3625 1.65 5.625C2.275 6.8875 3.17812 7.89062 4.35938 8.63437C5.54063 9.37812 6.8375 9.75 8.25 9.75Z" fill="#004536" />
  </svg>
)

const ShopIcon = () => (
  <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
    <path d="M11.1107 4.69583V9.33333C11.1107 9.65417 10.9965 9.92882 10.768 10.1573C10.5395 10.3858 10.2649 10.5 9.94405 10.5H1.77738C1.45655 10.5 1.18189 10.3858 0.953423 10.1573C0.72495 9.92882 0.610714 9.65417 0.610714 9.33333V4.69583C0.387103 4.49167 0.214534 4.22917 0.093006 3.90833C-0.0285218 3.5875 -0.0309524 3.2375 0.0857143 2.85833L0.698214 0.875C0.775992 0.622222 0.914534 0.413194 1.11384 0.247917C1.31314 0.0826389 1.54405 0 1.80655 0H9.91488C10.1774 0 10.4059 0.0802083 10.6003 0.240625C10.7947 0.401042 10.9357 0.6125 11.0232 0.875L11.6357 2.85833C11.7524 3.2375 11.75 3.58264 11.6284 3.89375C11.5069 4.20486 11.3343 4.47222 11.1107 4.69583ZM7.14405 4.08333C7.40655 4.08333 7.60585 3.9934 7.74196 3.81354C7.87808 3.63368 7.93155 3.43194 7.90238 3.20833L7.58155 1.16667H6.44405V3.325C6.44405 3.52917 6.5121 3.7066 6.64821 3.85729C6.78433 4.00799 6.9496 4.08333 7.14405 4.08333ZM4.51905 4.08333C4.74266 4.08333 4.92495 4.00799 5.06592 3.85729C5.20689 3.7066 5.27738 3.52917 5.27738 3.325V1.16667H4.13988L3.81905 3.20833C3.78016 3.44167 3.8312 3.64583 3.97217 3.82083C4.11314 3.99583 4.29544 4.08333 4.51905 4.08333ZM1.92321 4.08333C2.09821 4.08333 2.25134 4.02014 2.38259 3.89375C2.51384 3.76736 2.59405 3.60694 2.62321 3.4125L2.94405 1.16667H1.80655L1.22321 3.12083C1.16488 3.31528 1.19648 3.52431 1.31801 3.74792C1.43953 3.97153 1.64127 4.08333 1.92321 4.08333ZM9.79821 4.08333C10.0802 4.08333 10.2843 3.97153 10.4107 3.74792C10.5371 3.52431 10.5663 3.31528 10.4982 3.12083L9.88571 1.16667H8.74821V3.325C8.74821 3.52917 8.81626 3.7066 8.95237 3.85729C9.08849 4.00799 9.25376 4.08333 9.44821 4.08333ZM9.79821 8.99583H9.08571V5.78125C9.08571 5.58611 9.01766 5.40903 8.88155 5.25C8.74544 5.09097 8.58016 5.00938 8.38571 5.00938H7.14405C6.94961 5.00938 6.78433 5.09097 6.64821 5.25C6.5121 5.40903 6.44405 5.58611 6.44405 5.78125V8.99583H5.27738V5.75C5.27738 5.55486 5.20933 5.37778 5.07321 5.21875C4.9371 5.05972 4.77182 4.98125 4.57738 4.98125H3.33571C3.14127 4.98125 2.97599 5.05972 2.83988 5.21875C2.70376 5.37778 2.63571 5.55486 2.63571 5.75V8.99583H1.46904V5.78125C1.46904 5.58611 1.401 5.40903 1.26488 5.25C1.12876 5.09097 0.963488 5.00938 0.769048 5.00938H0V9.34583C0 9.54028 0.0680952 9.71736 0.204286 9.87639C0.340476 10.0354 0.505714 10.1132 0.7 10.1132H2.44C2.63444 10.1132 2.79972 10.0354 2.93583 9.87639C3.07195 9.71736 3.14 9.54028 3.14 9.34583V8.10417C3.14 7.93333 3.19286 7.79375 3.29857 7.68542C3.40429 7.57708 3.53571 7.52292 3.69286 7.52292C3.85 7.52292 3.98143 7.57708 4.08714 7.68542C4.19286 7.79375 4.24571 7.93333 4.24571 8.10417V9.34583C4.24571 9.54028 4.31376 9.71736 4.44988 9.87639C4.585 10.0354 4.75024 10.1132 4.94467 10.1132H6.68571C6.88016 10.1132 7.04544 10.0354 7.18155 9.87639C7.31767 9.71736 7.38571 9.54028 7.38571 9.34583V8.10417C7.38571 7.93333 7.43857 7.79375 7.54429 7.68542C7.65 7.57708 7.78143 7.52292 7.93857 7.52292C8.09571 7.52292 8.22714 7.57708 8.33286 7.68542C8.43857 7.79375 8.49143 7.93333 8.49143 8.10417V9.34583C8.49143 9.54028 8.55948 9.71736 8.6956 9.87639C8.83171 10.0354 8.99695 10.1132 9.19139 10.1132H10.9324C11.1269 10.1132 11.2922 10.0354 11.4283 9.87639C11.5644 9.71736 11.6324 9.54028 11.6324 9.34583V5.00938H10.9324C10.7379 5.00938 10.5727 5.09097 10.4365 5.25C10.3004 5.40903 10.2324 5.58611 10.2324 5.78125V8.99583H9.79821V4.08333Z" fill="#004536" />
  </svg>
)

const TruckIcon = () => (
  <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
    <path d="M2.5 8C2.08333 8 1.72917 7.85417 1.4375 7.5625C1.14583 7.27083 1 6.91667 1 6.5H0V1C0 0.725 0.0979166 0.489583 0.29375 0.29375C0.489583 0.0979166 0.725 0 1 0H8V2H9.5L11 4V6.5H10C10 6.91667 9.85417 7.27083 9.5625 7.5625C9.27083 7.85417 8.91667 8 8.5 8C8.08333 8 7.72917 7.85417 7.4375 7.5625C7.14583 7.27083 7 6.91667 7 6.5H4C4 6.91667 3.85417 7.27083 3.5625 7.5625C3.27083 7.85417 2.91667 8 2.5 8ZM2.5 7C2.64167 7 2.76042 6.95208 2.85625 6.85625C2.95208 6.76042 3 6.64167 3 6.5C3 6.35833 2.95208 6.23958 2.85625 6.14375C2.76042 6.04792 2.64167 6 2.5 6C2.35833 6 2.23958 6.04792 2.14375 6.14375C2.04792 6.23958 2 6.35833 2 6.5C2 6.64167 2.04792 6.76042 2.14375 6.85625C2.23958 6.95208 2.35833 7 2.5 7ZM1 5.5H1.4C1.54167 5.35 1.70417 5.22917 1.8875 5.1375C2.07083 5.04583 2.275 5 2.5 5C2.725 5 2.92917 5.04583 3.1125 5.1375C3.29583 5.22917 3.45833 5.35 3.6 5.5H7V1H1V5.5ZM8.5 7C8.64167 7 8.76042 6.95208 8.85625 6.85625C8.95208 6.76042 9 6.64167 9 6.5C9 6.35833 8.95208 6.23958 8.85625 6.14375C8.76042 6.04792 8.64167 6 8.5 6C8.35833 6 8.23958 6.04792 8.14375 6.14375C8.04792 6.23958 8 6.35833 8 6.5C8 6.64167 8.04792 6.76042 8.14375 6.85625C8.23958 6.95208 8.35833 7 8.5 7ZM8 4.5H10.125L9 3H8V4.5Z" fill="#004536" />
  </svg>
)

const ChevronLeftIcon = () => (
  <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
    <path d="M6 12L0 6L6 0L7.4 1.4L2.8 6L7.4 10.6L6 12Z" fill="#004536" />
  </svg>
)

const ChevronRightIcon = () => (
  <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
    <path d="M4.6 6L0 1.4L1.4 0L7.4 6L1.4 12L0 10.6L4.6 6Z" fill="#004536" />
  </svg>
)

/* ── Stat Card ───────────────────────────────────────── */
function StatCard({ label, value, icon, badge, badgeColor, delay, isLoading }) {
  if (isLoading) {
    return (
      <div
        className="animate-fade-slide-up flex-1 min-w-0 rounded-2xl border border-[#C9A96E]
          bg-white/70 backdrop-blur-[10px] p-5 sm:p-6 flex flex-col gap-3
          shadow-[0_10px_30px_-10px_rgba(11,94,75,0.10)] animate-pulse"
        style={{ animationDelay: delay }}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1.5 min-w-0 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="shrink-0 w-12 h-12 rounded-xl bg-gray-200"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-1/3"></div>
      </div>
    )
  }

  return (
    <div
      className="animate-fade-slide-up flex-1 min-w-0 rounded-2xl border border-[#C9A96E]
        bg-white/70 backdrop-blur-[10px] p-5 sm:p-6 flex flex-col gap-3
        shadow-[0_10px_30px_-10px_rgba(11,94,75,0.10)]
        hover:shadow-[0_16px_40px_-10px_rgba(11,94,75,0.18)]
        hover:-translate-y-0.5 transition-all duration-300"
      style={{ animationDelay: delay }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex flex-col gap-1.5 min-w-0">
          <span className="text-[#3F4945] text-sm sm:text-base font-normal leading-6">{label}</span>
          <span className="text-[#004536] text-2xl sm:text-[30px] font-bold leading-tight">{value}</span>
        </div>
        <div className="shrink-0 p-3 rounded-xl" style={{ background: icon.bg }}>
          {icon.svg}
        </div>
      </div>
      <div className="flex items-center gap-1.5">
        {badge.icon}
        <span className="text-xs font-bold leading-4" style={{ color: badgeColor }}>{badge.text}</span>
      </div>
    </div>
  )
}

/* ── Bar Chart ───────────────────────────────────────── */
function generateBarData(submissions) {
  const monthlyData = {}
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']

  submissions.forEach(sub => {
    const date = new Date(sub.createdAt)
    const monthKey = `${monthNames[date.getMonth()]}`
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = { count: 0, volume: 0 }
    }
    monthlyData[monthKey].count += 1
    monthlyData[monthKey].volume += sub.estimatedLiter || 0
  })

  const now = new Date()
  const last6Months = []
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i)
    const monthKey = monthNames[date.getMonth()]
    last6Months.push({
      month: monthKey,
      count: monthlyData[monthKey]?.count || 0,
      volume: monthlyData[monthKey]?.volume || 0,
    })
  }

  const maxVolume = Math.max(...last6Months.map(m => m.volume), 1)
  return last6Months.map(m => ({
    month: m.month,
    pct: (m.volume / maxVolume) * 100,
    active: m.count > 0,
    count: m.count,
  }))
}

function TrendChart({ submissions, isLoading }) {
  const barData = generateBarData(submissions)

  return (
    <div className="rounded-2xl border border-[#C9A96E] bg-white/70 backdrop-blur-[10px]
      p-6 sm:p-8 flex flex-col gap-6 overflow-hidden h-full
      shadow-[0_10px_30px_-10px_rgba(11,94,75,0.10)]">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-[#004536] text-lg sm:text-xl font-bold leading-7">Tren Kontribusi</h3>
          <p className="text-[#3F4945] text-xs leading-4 mt-0.5">
            {isLoading ? 'Memuat data...' : `${submissions.length} setoran tercatat`}
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0 mt-1">
          <span className="w-3 h-3 rounded-full bg-[#004536] block" />
          <span className="w-3 h-3 rounded-full bg-[#BEC9C3] block" />
        </div>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-40 sm:h-48">
          <div className="flex flex-col items-center gap-2">
            <div className="w-4 h-4 border-2 border-[#006C49] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-[#3F4945]">Memuat tren...</p>
          </div>
        </div>
      ) : (
        <div className="flex items-end justify-between gap-1 sm:gap-2 h-40 sm:h-48 px-1">
          {barData.map((bar, i) => (
            <div key={bar.month} className="flex flex-col items-center gap-2 flex-1 h-full justify-end group">
              <div
                className="w-full rounded-t-xl transition-all duration-700 ease-out hover:opacity-80 cursor-pointer"
                style={{
                  height: `${Math.max(bar.pct, 5)}%`,
                  background: bar.active ? 'rgba(0,69,54,0.55)' : 'rgba(190,201,195,0.25)',
                  animationDelay: `${i * 80}ms`,
                }}
                title={`${bar.month}: ${bar.count} setoran`}
              />
              <span className="text-[#3F4945] text-[9px] sm:text-[10px] text-center">{bar.month}</span>
              {bar.count > 0 && (
                <span className="text-[#006C49] text-[8px] font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                  {bar.count}
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ── History Table ───────────────────────────────────── */
const TRANSACTIONS = [
  { id: '#TRX-88219', date: '15 Okt 2023', collector: 'Bina Sejahtera',    volume: '15.5 L', status: 'selesai'  },
  { id: '#TRX-88110', date: '12 Okt 2023', collector: 'GreenCollector Hub', volume: '10.0 L', status: 'menunggu' },
  { id: '#TRX-87992', date: '05 Okt 2023', collector: 'EcoRanger Jkt',     volume: '22.0 L', status: 'selesai'  },
  { id: '#TRX-87501', date: '28 Sep 2023', collector: 'Bina Sejahtera',    volume: '8.5 L',  status: 'selesai'  },
]

function StatusBadge({ status }) {
  if (status === 'selesai') {
    return (
      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
        bg-[#006C49]/10 text-[#006C49] text-[11px] font-bold leading-5">
        <span className="w-1.5 h-1.5 rounded-full bg-[#006C49] status-pulse block shrink-0" />
        Selesai
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full
      bg-[#E4C285]/20 text-[#5A4312] text-[11px] font-bold leading-5 whitespace-nowrap">
      <span className="w-1.5 h-1.5 rounded-full bg-[#E4C285] block shrink-0" />
      Menunggu Validasi
    </span>
  )
}

function HistoryTable() {
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 3

  return (
    <div className="rounded-2xl border border-[#C9A96E] bg-white/70 backdrop-blur-[10px]
      shadow-[0_10px_30px_-10px_rgba(11,94,75,0.10)] overflow-hidden">

      <div className="flex items-center justify-between px-5 sm:px-8 py-5
        border-b border-[#BEC9C3]/20">
        <h3 className="text-[#004536] text-lg sm:text-xl font-bold">Riwayat Setoran</h3>
        <div className="flex items-center gap-1">
          <button className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg
            text-[#3F4945] text-xs sm:text-sm font-semibold
            hover:bg-[#004536]/5 active:bg-[#004536]/10 transition-colors duration-150">
            <FilterIcon />
            <span className="hidden xs:inline">Filter</span>
          </button>
          <button className="flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg
            text-[#3F4945] text-xs sm:text-sm font-semibold
            hover:bg-[#004536]/5 active:bg-[#004536]/10 transition-colors duration-150">
            <DownloadIcon />
            <span className="hidden xs:inline">Ekspor PDF</span>
          </button>
        </div>
      </div>

      {/* Desktop table */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-[#F0F3FF]">
              {['Tanggal', 'ID Transaksi', 'Pengepul', 'Volume', 'Status', 'Aksi'].map((h, i) => (
                <th
                  key={h}
                  className={`text-[#004536] text-[11px] font-bold uppercase tracking-[1.2px]
                    px-6 lg:px-8 py-4 whitespace-nowrap
                    ${i === 5 ? 'text-right' : 'text-left'}`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {TRANSACTIONS.map((tx, i) => (
              <tr
                key={tx.id}
                className="border-t border-[#BEC9C3]/10 hover:bg-[#004536]/[0.02]
                  transition-colors duration-150 group animate-fade-in"
                style={{ animationDelay: `${i * 60}ms` }}
              >
                <td className="px-6 lg:px-8 py-5 text-[#051C37] text-sm leading-5 whitespace-nowrap">{tx.date}</td>
                <td className="px-6 lg:px-8 py-5 text-[#3F4945] text-sm font-mono leading-5 whitespace-nowrap">{tx.id}</td>
                <td className="px-6 lg:px-8 py-5">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-lg bg-[#A8F1D8] flex items-center justify-center shrink-0">
                      <ShopIcon />
                    </div>
                    <span className="text-sm text-black leading-5">{tx.collector}</span>
                  </div>
                </td>
                <td className="px-6 lg:px-8 py-5 text-[#004536] text-sm font-bold leading-5 whitespace-nowrap">{tx.volume}</td>
                <td className="px-6 lg:px-8 py-5 whitespace-nowrap"><StatusBadge status={tx.status} /></td>
                <td className="px-6 lg:px-8 py-5 text-right">
                  <button className="inline-flex items-center justify-center w-8 h-8 rounded-full
                    hover:bg-[#004536]/10 active:bg-[#004536]/20
                    transition-all duration-150 group-hover:scale-110">
                    <EyeIcon />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile card list */}
      <div className="sm:hidden flex flex-col divide-y divide-[#BEC9C3]/15">
        {TRANSACTIONS.map((tx, i) => (
          <div
            key={tx.id}
            className="px-4 py-4 flex flex-col gap-2.5 hover:bg-[#004536]/[0.02]
              transition-colors duration-150 animate-fade-in"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[#3F4945] text-[11px] font-mono">{tx.id}</span>
              <StatusBadge status={tx.status} />
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-6 h-6 rounded-lg bg-[#A8F1D8] flex items-center justify-center shrink-0">
                  <ShopIcon />
                </div>
                <span className="text-sm text-black font-medium truncate">{tx.collector}</span>
              </div>
              <span className="text-[#004536] text-sm font-bold shrink-0">{tx.volume}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#3F4945] text-xs">{tx.date}</span>
              <button className="inline-flex items-center justify-center w-8 h-8 rounded-full
                hover:bg-[#004536]/10 transition-all duration-150">
                <EyeIcon />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap items-center justify-between gap-3
        px-5 sm:px-8 py-5 border-t border-[#BEC9C3]/10 bg-white">
        <span className="text-[#3F4945] text-xs sm:text-sm font-medium">
          Menampilkan 4 dari 48 transaksi
        </span>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full hover:bg-[#004536]/10 disabled:opacity-30
              transition-all duration-150 active:scale-90"
          >
            <ChevronLeftIcon />
          </button>
          <div className="flex items-center gap-1.5">
            {[1, 2, 3].map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 rounded-xl text-xs font-bold transition-all duration-200
                  ${currentPage === page
                    ? 'bg-[#004536] text-white shadow-sm scale-105'
                    : 'text-[#3F4945] hover:bg-[#004536]/10 active:scale-90'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full hover:bg-[#004536]/10 disabled:opacity-30
              transition-all duration-150 active:scale-90"
          >
            <ChevronRightIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function getLatestStatus(submission) {
  const map = {
    SUBMITTED: 'Menunggu',
    ACCEPTED_BY_COLLECTOR: 'Diterima',
    REJECTED_BY_COLLECTOR: 'Ditolak',
    IN_BATCH: 'Batch',
    COMPLETED: 'Selesai',
  }
  return map[submission?.status] || 'Unknown'
}

/* ── Page ────────────────────────────────────────────── */
export default function SetoranPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState(false)
  const [submissions, setSubmissions] = useState([])
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    const loadSubmissions = async () => {
      try {
        setIsLoadingData(true)
        const response = await api.get('/submissions')
        setSubmissions(response.data.submissions || [])
      } catch (error) {
        console.error('Failed to load submissions:', error)
      } finally {
        setIsLoadingData(false)
      }
    }

    loadSubmissions()
  }, [])

  // Generate stat cards dynamically based on submissions
  const getStatCards = (subs) => {
    const totalSubmissions = subs.length
    const totalLiter = subs.reduce((sum, s) => sum + (s.estimatedLiter || 0), 0)
    const completedSubmissions = subs.filter(s => s.status === 'COMPLETED').length

    return [
      {
        label: 'Total Setoran',
        value: `${totalSubmissions} kali`,
        icon: {
          bg: 'rgba(0,69,54,0.10)',
          svg: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M2 18C1.71667 18 1.479 17.904 1.287 17.712C1.095 17.52 1 17.283 1 17V1C1 0.716667 1.095 0.479167 1.287 0.2875C1.479 0.0958333 1.71667 0 2 0H14C14.2833 0 14.521 0.0958333 14.713 0.2875C14.905 0.479167 15 0.716667 15 1V11H17L14 15V17C14 17.283 13.904 17.52 13.712 17.712C13.52 17.904 13.283 18 13 18H2ZM2 16H13V14H2V16ZM2 12H13V2H2V12Z" fill="#004536"/>
            </svg>
          ),
        },
        badge: { icon: <TrendUpIcon />, text: `${completedSubmissions} selesai` },
        badgeColor: '#006C49',
        delay: '0ms',
      },
      {
        label: 'Total Volume',
        value: `${totalLiter} L`,
        icon: {
          bg: 'rgba(0,108,73,0.10)',
          svg: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M3.5 18C2.95 18 2.479 17.804 2.087 17.412C1.695 17.02 1.5 16.55 1.5 16V8.5C1.5 7.95 1.695 7.479 2.087 7.087C2.479 6.695 2.95 6.5 3.5 6.5H3V4C3 2.9 3.404 1.987 4.212 1.25C5.02 0.513 6.05 0 7.3 0C8.55 0 9.58 0.513 10.388 1.25C11.196 1.987 11.6 2.9 11.6 4V6.5H12.1C12.65 6.5 13.121 6.695 13.513 7.087C13.905 7.479 14.1 7.95 14.1 8.5V16C14.1 16.55 13.905 17.02 13.513 17.412C13.121 17.804 12.65 18 12.1 18H3.5ZM3.5 16H12.1V8.5H3.5V16ZM7.3 6.5C8.15 6.5 8.871 6.204 9.463 5.612C10.055 5.02 10.35 4.3 10.35 3.45C10.35 2.6 10.055 1.879 9.463 1.287C8.871 0.695 8.15 0.4 7.3 0.4C6.45 0.4 5.729 0.695 5.137 1.287C4.545 1.879 4.25 2.6 4.25 3.45C4.25 4.3 4.545 5.02 5.137 5.612C5.729 6.204 6.45 6.5 7.3 6.5Z" fill="#006C49"/>
            </svg>
          ),
        },
        badge: { icon: <VerifiedIcon />, text: 'Terkumpul' },
        badgeColor: '#006C49',
        delay: '80ms',
      },
      {
        label: 'Status Utama',
        value: subs.length > 0 ? getLatestStatus(subs[0]) : '-',
        icon: {
          bg: 'rgba(201,169,110,0.10)',
          svg: (
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M9 9C10.65 9 12.0125 8.3625 13.0875 7.0875C14.1625 5.8125 14.7 4.35 14.7 2.7C14.7 1.05 14.1625 -0.4125 13.0875 -1.6875C12.0125 -2.9625 10.65 -3.6 9 -3.6C7.35 -3.6 5.9875 -2.9625 4.9125 -1.6875C3.8375 -0.4125 3.3 1.05 3.3 2.7C3.3 4.35 3.8375 5.8125 4.9125 7.0875C5.9875 8.3625 7.35 9 9 9ZM0 18V14.175C0 13.275 0.2875 12.4875 0.8625 11.8125C1.4375 11.1375 2.2 10.8 3.15 10.8H14.85C15.8 10.8 16.5625 11.1375 17.1375 11.8125C17.7125 12.4875 18 13.275 18 14.175V18H0Z" fill="#C9A96E"/>
            </svg>
          ),
        },
        badge: { icon: <GiftIcon />, text: 'Terbaru' },
        badgeColor: '#C9A96E',
        delay: '160ms',
      },
    ]
  }

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-[287px] min-w-0">
        <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-12 flex flex-col gap-6">

          {/* Page Header */}
          <div
            className="animate-fade-slide-up flex flex-wrap items-end justify-between gap-4"
            style={{ animationDelay: '0ms' }}
          >
            <div className="flex flex-col gap-1">
              <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#004536]
                tracking-tight leading-tight">
                Setoran Saya
              </h1>
              <p className="text-[#3F4945] text-sm sm:text-base leading-6 max-w-xl">
                Pantau kontribusi Anda dalam menjaga ekosistem melalui pengelolaan minyak jelantah.
              </p>
            </div>
            <button
              onClick={() => setIsSubmissionModalOpen(true)}
              className="flex items-center gap-2 px-5 sm:px-8 py-3 rounded-xl
              font-bold text-white text-sm sm:text-base
              bg-gradient-to-r from-[#004536] to-[#2EAF7D]
              shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]
              hover:shadow-[0_20px_30px_-6px_rgba(0,69,54,0.35)]
              hover:-translate-y-0.5 active:translate-y-0 active:scale-95
              transition-all duration-300 whitespace-nowrap shrink-0">
              <PlusCircleIcon />
              Buat Setoran Baru
            </button>
          </div>

          {/* Stat Cards */}
          <div
            className="animate-fade-slide-up flex flex-col xs:flex-row gap-4"
            style={{ animationDelay: '80ms' }}
          >
            {getStatCards(submissions).map(card => (
              <StatCard key={card.label} {...card} isLoading={isLoadingData} />
            ))}
          </div>

          {/* Active Request + Trend Chart */}
          <div
            className="animate-fade-slide-up grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6"
            style={{ animationDelay: '160ms' }}
          >
            <div className="col-span-12">
              <TrendChart submissions={submissions} isLoading={isLoadingData} />
            </div>
          </div>
        </main>

        <DashboardFooter />
      </div>

      <SubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        onSubmissionCreated={() => {
          console.log('Submission created successfully')
        }}
      />
    </div>
  )
}
