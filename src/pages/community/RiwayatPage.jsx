import { useState } from 'react'
import Sidebar from '../../sections/community/dashboard/Sidebar'
import TopBar from '../../sections/community/dashboard/TopBar'
import DashboardFooter from '../../sections/community/dashboard/DashboardFooter'
import SubmissionHistoryTable from '../../sections/community/setoran/SubmissionHistoryTable'

export default function RiwayatPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50/50 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-[287px] min-w-0">
        <TopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-4 sm:p-6 lg:p-12 flex flex-col gap-6">
          {/* Page Header */}
          <div className="flex flex-col gap-1">
            <h1 className="text-2xl sm:text-3xl lg:text-[36px] font-bold text-[#004536] tracking-tight leading-tight">
              Riwayat Setoran
            </h1>
            <p className="text-[#3F4945] text-sm sm:text-base leading-6 max-w-xl">
              Lihat semua riwayat setoran minyak jelantah Anda dengan filter status dan ekspor ke PDF.
            </p>
          </div>

          {/* History Table */}
          <SubmissionHistoryTable />
        </main>

        <DashboardFooter />
      </div>
    </div>
  )
}
