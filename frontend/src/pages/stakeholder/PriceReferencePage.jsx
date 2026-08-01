import { useState, useEffect } from 'react'
import api from '../../services/api'
import { useToast } from '../../contexts/ToastContext'
import Sidebar from '../../components/stakeholder/Sidebar'
import TopNav from '../../components/stakeholder/TopNav'
import DashboardFooter from '../../components/stakeholder/DashboardFooter'
import PriceReferenceHeader from '../../sections/stakeholder/referenceprice/PriceReferenceHeader'
import PriceSettingsSection from '../../sections/stakeholder/referenceprice/PriceSettingsSection'

export default function PriceReferencePage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [settings, setSettings] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { showToast } = useToast()

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      setIsLoading(true)
      const response = await api.get('/stakeholder/settings')
      setSettings(response.data?.setting)
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      showToast('Gagal memuat pengaturan', 'error', 3000, 'Error')
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateSettings = async (newSettings) => {
    try {
      await api.put('/stakeholder/settings', newSettings)
      setSettings(newSettings)
      showToast('Pengaturan berhasil diperbarui', 'success', 3000, 'Sukses')
    } catch (error) {
      console.error('Failed to update settings:', error)
      showToast('Gagal memperbarui pengaturan', 'error', 3000, 'Error')
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F5F7F6]">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col min-w-0 lg:ml-[280px] transition-all duration-300">
        <TopNav onMenuToggle={() => setSidebarOpen((v) => !v)} />

        <main className="flex-1 flex flex-col px-4 sm:px-6 md:px-10 py-8 gap-8 overflow-y-auto">
          <section className="animate-fade-slide-up" style={{ animationDelay: '0ms' }}>
            <PriceReferenceHeader />
          </section>

          <section className="animate-fade-slide-up" style={{ animationDelay: '60ms' }}>
            <PriceSettingsSection
              settings={settings}
              isLoading={isLoading}
              onUpdate={handleUpdateSettings}
            />
          </section>
        </main>

        <DashboardFooter />
      </div>
    </div>
  )
}
