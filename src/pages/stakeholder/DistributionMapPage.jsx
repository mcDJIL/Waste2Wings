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
                      <div className="min-w-[240px] p-3 bg-white rounded-lg">
                        <div className="flex items-start gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#D1FAE5] flex items-center justify-center flex-shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" fill="#065F46" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-[#051C37] text-sm leading-tight">{marker.name}</h4>
                            <div className="space-y-1.5 mt-2 text-xs">
                              <div className="flex items-center gap-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                  <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" fill="#6F7975" />
                                </svg>
                                <span className="text-[#3F4945]">{marker.category}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8z" fill="#6F7975" />
                                </svg>
                                <span className="text-[#3F4945]">{marker.address}</span>
                              </div>
                              <div className="flex items-center gap-1 pt-1 border-t border-[#E5E7EB]">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                  <path d="M17 12h-5v5h5v-5zM16.5 3.1h.5V1h-21v16h2v2h2v-2h12v2h2v-2h2V4.9c0-.9-.9-1.8-1.9-1.8z" fill="#006C49" />
                                </svg>
                                <span className="text-[#006C49] font-semibold">{marker.user?.phone || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
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
                      <div className="min-w-[250px] p-3 bg-white rounded-lg">
                        <div className="flex items-start gap-2.5">
                          <div className="w-9 h-9 rounded-full bg-[#DBEAFE] flex items-center justify-center flex-shrink-0">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                              <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.06c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z" fill="#004B7E" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-[#051C37] text-sm leading-tight">{marker.name}</h4>
                            <div className="space-y-1.5 mt-2 text-xs">
                              <div className="flex items-center gap-1">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#6F7975" />
                                </svg>
                                <span className="text-[#3F4945]">{marker.address}</span>
                              </div>
                              <div className="flex items-center justify-between p-1.5 rounded bg-[#F3F4F6]">
                                <span className="text-[#6F7975]">Kapasitas</span>
                                <span className="font-semibold text-[#004B7E]">{marker.capacityLiter?.toLocaleString('id-ID')} L</span>
                              </div>
                              <div className="flex items-center justify-between p-1.5 rounded bg-[#FEF3C7]">
                                <span className="text-[#6F7975]">Harga Beli</span>
                                <span className="font-semibold text-[#B45309]">Rp{marker.buyPricePerLiter?.toLocaleString('id-ID')}/L</span>
                              </div>
                              <div className="flex items-center gap-1 pt-1 border-t border-[#E5E7EB]">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                                  <path d="M17 12h-5v5h5v-5zM16.5 3.1h.5V1h-21v16h2v2h2v-2h12v2h2v-2h2V4.9c0-.9-.9-1.8-1.9-1.8z" fill="#004B7E" />
                                </svg>
                                <span className="text-[#004B7E] font-semibold text-[10px]">{marker.user?.phone || 'N/A'}</span>
                              </div>
                            </div>
                          </div>
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
