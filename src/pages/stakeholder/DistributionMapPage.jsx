import { useState, useEffect, useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../../services/api'
import Sidebar from '../../components/stakeholder/Sidebar'
import TopNav from '../../components/stakeholder/TopNav'
import DashboardFooter from '../../components/stakeholder/DashboardFooter'

// Fix Leaflet icon URLs
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const createPin = (color, size = 32) => L.divIcon({
  className: '',
  iconSize: [size, size + 10],
  iconAnchor: [size / 2, size + 10],
  popupAnchor: [0, -(size + 12)],
  html: `<div style="filter:drop-shadow(0 2px 6px rgba(0,0,0,.35))">
    <svg width="${size}" height="${size + 10}" viewBox="0 0 32 42" fill="none">
      <path d="M16 2C10.48 2 6 6.48 6 12c0 9 10 22 10 22s10-13 10-22c0-5.52-4.48-10-10-10z"
        fill="${color}" stroke="white" stroke-width="2.5"/>
      <circle cx="16" cy="12" r="4.5" fill="white"/>
    </svg>
  </div>`,
})

const communityIcon = createPin('#006C49') // Green
const collectorIcon = createPin('#004B7E') // Blue

export default function DistributionMapPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [markers, setMarkers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setIsLoading(true)
        setError('')
        const response = await api.get('/dashboard/map')
        setMarkers(response.data?.markers || [])
      } catch (err) {
        console.error('Failed to fetch map data:', err)
        setError('Gagal memuat data peta')
      } finally {
        setIsLoading(false)
      }
    }

    fetchMapData()
  }, [])

  const { communityMarkers, collectorMarkers, bounds, center } = useMemo(() => {
    const communities = markers.filter(m => m.type === 'COMMUNITY')
    const collectors = markers.filter(m => m.type === 'COLLECTOR')

    const allCoords = markers.map(m => [m.latitude, m.longitude])
    const bounds = allCoords.length > 0 ? [
      [Math.min(...allCoords.map(c => c[0])), Math.min(...allCoords.map(c => c[1]))],
      [Math.max(...allCoords.map(c => c[0])), Math.max(...allCoords.map(c => c[1]))],
    ] : null

    const centerCoords = allCoords.length > 0 ? [
      allCoords.reduce((a, b) => a + b[0], 0) / allCoords.length,
      allCoords.reduce((a, b) => a + b[1], 0) / allCoords.length,
    ] : [-6.2, 106.8]

    return { communityMarkers: communities, collectorMarkers: collectors, bounds, center: centerCoords }
  }, [markers])

  return (
    <div className="flex min-h-screen bg-[#F5F7F6]">
      {/* Sidebar */}
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0 lg:ml-[280px] transition-all duration-300">
        {/* Top nav */}
        <TopNav onMenuToggle={() => setSidebarOpen((v) => !v)} />

        {/* Content */}
        <main className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="px-4 sm:px-6 md:px-10 py-8 border-b border-[#E2E8F0]">
            <div>
              <h1 className="text-[#051C37] text-2xl sm:text-3xl font-bold leading-tight">
                Peta Sebaran Komunitas & Pengepul
              </h1>
              <p className="text-[#3F4945] text-sm mt-1 leading-5">
                Visualisasi lokasi semua komunitas dan pengepul yang terdaftar.
              </p>
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 relative">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-8 h-8 border-3 border-[#006C49] border-t-transparent rounded-full animate-spin"></div>
                  <p className="text-[#3F4945]">Memuat peta...</p>
                </div>
              </div>
            ) : error ? (
              <div className="w-full h-full flex items-center justify-center">
                <div className="text-center">
                  <p className="text-[#EF4444] font-semibold">{error}</p>
                </div>
              </div>
            ) : markers.length === 0 ? (
              <div className="w-full h-full flex items-center justify-center">
                <p className="text-[#3F4945]">Belum ada data lokasi</p>
              </div>
            ) : (
              <MapContainer
                center={center}
                bounds={bounds}
                boundsOptions={{ padding: [50, 50] }}
                zoom={10}
                style={{ width: '100%', height: '100%' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; OpenStreetMap contributors'
                />

                {/* Community Markers */}
                {communityMarkers.map((marker) => (
                  <Marker
                    key={marker.id}
                    position={[marker.latitude, marker.longitude]}
                    icon={communityIcon}
                  >
                    <Popup>
                      <div className="text-sm max-w-xs">
                        <p className="font-bold text-[#004536] mb-1">{marker.name}</p>
                        <div className="space-y-1 text-xs text-[#3F4945]">
                          <p><strong>Kategori:</strong> {marker.category}</p>
                          <p><strong>Alamat:</strong> {marker.address}</p>
                          <p><strong>Kontak:</strong> {marker.user?.phone}</p>
                          <p><strong>Email:</strong> {marker.user?.email}</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}

                {/* Collector Markers */}
                {collectorMarkers.map((marker) => (
                  <Marker
                    key={marker.id}
                    position={[marker.latitude, marker.longitude]}
                    icon={collectorIcon}
                  >
                    <Popup>
                      <div className="text-sm max-w-xs">
                        <p className="font-bold text-[#004536] mb-1">{marker.name}</p>
                        <div className="space-y-1 text-xs text-[#3F4945]">
                          <p><strong>Alamat:</strong> {marker.address}</p>
                          <p><strong>Kapasitas:</strong> {marker.capacityLiter?.toLocaleString('id-ID')} L</p>
                          <p><strong>Harga Beli:</strong> Rp{marker.buyPricePerLiter?.toLocaleString('id-ID')}/L</p>
                          <p><strong>Kontak:</strong> {marker.user?.phone}</p>
                          <p><strong>Email:</strong> {marker.user?.email}</p>
                        </div>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}

            {/* Legend Overlay */}
            {!isLoading && markers.length > 0 && (
              <div className="absolute top-6 right-6 p-4 rounded-xl border border-[#BEC9C3]/20 bg-white/95 backdrop-blur-md shadow-[0_8px_24px_-4px_rgba(0,0,0,0.12)] z-[400] max-w-xs animate-fade-slide-up" style={{ animationDelay: '200ms' }}>
                <p className="text-[#051C37] text-sm font-bold leading-6 mb-3">Legenda</p>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <svg width="24" height="24" viewBox="0 0 32 42" fill="none">
                        <path d="M16 2C10.48 2 6 6.48 6 12c0 9 10 22 10 22s10-13 10-22c0-5.52-4.48-10-10-10z"
                          fill="#006C49" stroke="white" strokeWidth="2.5"/>
                        <circle cx="16" cy="12" r="4.5" fill="white"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#051C37] text-xs font-semibold">Komunitas ({communityMarkers.length})</p>
                      <p className="text-[#3F4945] text-[11px]">Sumber minyak jelantah</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-shrink-0">
                      <svg width="24" height="24" viewBox="0 0 32 42" fill="none">
                        <path d="M16 2C10.48 2 6 6.48 6 12c0 9 10 22 10 22s10-13 10-22c0-5.52-4.48-10-10-10z"
                          fill="#004B7E" stroke="white" strokeWidth="2.5"/>
                        <circle cx="16" cy="12" r="4.5" fill="white"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-[#051C37] text-xs font-semibold">Pengepul ({collectorMarkers.length})</p>
                      <p className="text-[#3F4945] text-[11px]">Pengumpul & penyaring</p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-4 border-t border-[#BEC9C3]/20">
                  <p className="text-[#3F4945] text-[10px] leading-4">
                    Total: {markers.length} lokasi
                  </p>
                </div>
              </div>
            )}
          </div>
        </main>

        {/* Footer */}
        <DashboardFooter />
      </div>
    </div>
  )
}
