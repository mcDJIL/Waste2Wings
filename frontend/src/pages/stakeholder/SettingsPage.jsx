import { useState } from 'react'
import Sidebar from '../../components/stakeholder/Sidebar'
import SettingsTopBar from '../../sections/settings/SettingsTopBar'
import ProfileSection from '../../sections/settings/ProfileSection'
import SettingsFooter from '../../sections/settings/SettingsFooter'

export default function StakeholderSettingsPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex" style={{ fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col lg:ml-[280px] min-w-0">
        <SettingsTopBar onMenuToggle={() => setSidebarOpen((v) => !v)} />

        <main className="flex-1 flex flex-col gap-4 xs:gap-5 sm:gap-6 px-3 xs:px-4 sm:px-8 lg:px-12 py-4 xs:py-5 sm:py-8">
          <ProfileSection />
        </main>

        <SettingsFooter />
      </div>
    </div>
  )
}
