import { useState } from 'react'
import Sidebar from '../../components/stakeholder/Sidebar'
import TopNav from '../../components/stakeholder/TopNav'
import DashboardFooter from '../../components/stakeholder/DashboardFooter'
import MapControlsOverlay from '../../sections/stakeholder/map/MapControlsOverlay'
import MapLegendCard from '../../sections/stakeholder/map/MapLegendCard'
import MapStatsBar from '../../sections/stakeholder/map/MapStatsBar'
import MapMarkerLayer from '../../sections/stakeholder/map/MapMarkerLayer'
import IntelligencePanel from '../../sections/stakeholder/map/IntelligencePanel'

const MAP_IMAGE =
  'https://api.builder.io/api/v1/image/assets/TEMP/200b6b05f7058add9a07784485c160748666ed7c?width=2318'

export default function DistributionMapPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [zoom, setZoom] = useState(1)

  const handleZoomIn = () => setZoom((z) => Math.min(z + 0.1, 2))
  const handleZoomOut = () => setZoom((z) => Math.max(z - 0.1, 0.5))

  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex flex-col flex-1 min-w-0 lg:ml-[280px] transition-all duration-300">
        <TopNav onMenuToggle={() => setSidebarOpen((v) => !v)} />

        {/* Map + Panel row */}
        <div className="flex flex-1 overflow-hidden relative">

          {/* ── Map area ─────────────────────────────────── */}
          <div className="relative flex-1 overflow-hidden min-h-[320px]">
            {/* Map image background */}
            <div
              className="absolute inset-0 transition-transform duration-300 ease-out"
              style={{ transform: `scale(${zoom})`, transformOrigin: 'center center' }}
            >
              <img
                src={MAP_IMAGE}
                alt="Distribution map of Surabaya"
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>

            {/* Map overlays */}
            <MapControlsOverlay onZoomIn={handleZoomIn} onZoomOut={handleZoomOut} />
            <MapMarkerLayer />

            {/* Bottom overlay group: legend + stats */}
            <div className="absolute bottom-4 left-4 right-4 lg:right-auto flex flex-col gap-3 z-10">
              <MapLegendCard />
              <MapStatsBar />
            </div>

            {/* Mobile panel toggle button */}
            <button
              onClick={() => setPanelOpen(true)}
              className="absolute top-4 right-4 z-10 flex items-center gap-2 px-3 py-2 rounded-xl border border-white/30 bg-white/70 backdrop-blur-[10px] shadow-md text-brand-dark text-sm font-semibold lg:hidden hover:bg-white/90 transition-colors duration-200 active:scale-95"
            >
              <svg width="16" height="16" viewBox="0 0 19 19" fill="none">
                <path d="M15 6.66667L13.9583 4.375L11.6667 3.33333L13.9583 2.29167L15 0L16.0417 2.29167L18.3333 3.33333L16.0417 4.375L15 6.66667ZM6.66667 15.8333L4.58333 11.25L0 9.16667L4.58333 7.08333L6.66667 2.5L8.75 7.08333L13.3333 9.16667L8.75 11.25L6.66667 15.8333Z" fill="#004536" />
              </svg>
              Intelligence
            </button>
          </div>

          {/* ── Intelligence panel (desktop sidebar / mobile sheet) ── */}
          <IntelligencePanel
            isOpen={panelOpen}
            onClose={() => setPanelOpen(false)}
          />
        </div>

        <DashboardFooter />
      </div>
    </div>
  )
}
