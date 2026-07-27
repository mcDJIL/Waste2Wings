import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import api from '../../services/api'
import ValidationSidebar from '../../sections/collector/dashboard/CollectorSidebar'
import CollectorTopBar from '../../sections/collector/dashboard/CollectorTopBar'
import CollectorFooter from '../../sections/collector/dashboard/CollectorFooter'
import MapRightPanel from '../../sections/collector/map/MapRightPanel'
import MapLegend from '../../sections/collector/map/MapLegend'

// Fix Leaflet icon URLs broken by Vite
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl:       'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl:     'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
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

const createTruck = () => L.divIcon({
  className: '',
  iconSize: [40, 32],
  iconAnchor: [20, 32],
  popupAnchor: [0, -34],
  html: `<div style="
    background:#004536;border-radius:8px;padding:6px 8px;
    display:flex;align-items:center;gap:4px;
    box-shadow:0 3px 10px rgba(0,0,0,.3);border:2px solid white">
    <svg width="18" height="14" viewBox="0 0 22 16" fill="none">
      <path d="M5 16C4.167 16 3.458 15.708 2.875 15.125C2.292 14.542 2 13.833 2 13H0V2C0 1.45 .196 .979 .588 .588C.979 .196 1.45 0 2 0h14v4h3l3 4v5h-2c0 .833-.292 1.542-.875 2.125C18.542 15.708 17.833 16 17 16s-1.458-.292-2.125-.875C14.292 14.542 14 13.833 14 13H8c0 .833-.292 1.542-.875 2.125C6.542 15.708 5.833 16 5 16zm0-2c.283 0 .521-.096.713-.287C5.904 13.521 6 13.283 6 13s-.096-.521-.287-.713C5.521 12.096 5.283 12 5 12s-.521.096-.713.287C4.096 12.479 4 12.717 4 13s.096.521.287.713C4.479 13.904 4.717 14 5 14zm12 0c.283 0 .521-.096.713-.287C17.904 13.521 18 13.283 18 13s-.096-.521-.287-.713C17.521 12.096 17.283 12 17 12s-.521.096-.713.287C16.096 12.479 16 12.717 16 13s.096.521.287.713C16.479 13.904 16.717 14 17 14zM16 9h4.25L18 6h-2v3z"
        fill="white"/>
    </svg>
    <span style="color:white;font-size:10px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif">#09</span>
  </div>`,
})

const createUserDot = () => L.divIcon({
  className: '',
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -12],
  html: `<div style="
    width:20px;height:20px;border-radius:50%;
    background:#81F9C1;border:2.5px solid #00734E;
    box-shadow:0 2px 8px rgba(0,0,0,.25);
    display:flex;align-items:center;justify-content:center">
    <div style="width:6px;height:6px;border-radius:50%;background:#00734E"></div>
  </div>`,
})

export default function MapPage() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [panelOpen, setPanelOpen] = useState(false)
  const [mapReady, setMapReady] = useState(false)
  const [mapData, setMapData] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [centerCoords, setCenterCoords] = useState([-7.257, 112.739])

  useEffect(() => {
    const t = setTimeout(() => setMapReady(true), 100)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/collectors/me/map')
        const data = response.data?.data || response.data

        if (data) {
          // Transform API response to match our data structure
          const transformedData = {
            collector: data.collector,
            henReceptionLocation: data.henReceptionLocation,
            communityMarkers: data.communityMarkers || [],
          }
          setMapData(transformedData)

          if (data.collector?.latitude && data.collector?.longitude) {
            setCenterCoords([data.collector.latitude, data.collector.longitude])
          }
        }
      } catch (error) {
        console.error('Failed to fetch map data:', error.response || error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchMapData()
  }, [])

  const buildMapPoints = () => {
    const points = []

    // Collector location
    if (mapData?.collector) {
      points.push({
        type: 'collector',
        icon: () => createPin('#004536'),
        pos: [mapData.collector.latitude, mapData.collector.longitude],
        popup: { name: mapData.collector.companyName, detail: mapData.collector.address },
      })
    }

    // HEN receiving location
    if (mapData?.henReceptionLocation) {
      points.push({
        type: 'hen',
        icon: () => createPin('#BA1A1A'),
        pos: [mapData.henReceptionLocation.latitude, mapData.henReceptionLocation.longitude],
        popup: { name: mapData.henReceptionLocation.name, detail: mapData.henReceptionLocation.address },
      })
    }

    // Community markers
    if (mapData?.communityMarkers && Array.isArray(mapData.communityMarkers)) {
      mapData.communityMarkers.forEach((marker) => {
        points.push({
          type: 'community',
          icon: createUserDot,
          pos: [marker.latitude, marker.longitude],
          popup: { name: marker.name, detail: `${marker.totalCleanLiter} L • ${marker.submissionCount} Setoran` },
        })
      })
    }

    return points
  }

  const mapPoints = buildMapPoints()

  return (
    <div className="min-h-screen bg-[#FAF9F6] flex">
      <ValidationSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col lg:ml-[280px] min-w-0">
        <CollectorTopBar onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

        {/* Main map + panel area */}
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden" style={{ minHeight: 0 }}>

          {/* Map area */}
          <div className="relative flex-1 min-h-[50vh] lg:min-h-0">
            {mapReady && !isLoading && (
              <MapContainer
                center={centerCoords}
                zoom={13}
                className="w-full h-full"
                style={{ minHeight: '100%' }}
                zoomControl={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {mapPoints.map((point, i) => (
                  <Marker
                    key={i}
                    position={point.pos}
                    icon={point.icon()}
                  >
                    <Popup>
                      <div className="flex flex-col gap-1 min-w-[140px]">
                        <span className="font-bold text-[#051C37] text-sm">{point.popup.name}</span>
                        <span className="text-[#3F4945] text-xs">{point.popup.detail}</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
            {isLoading && (
              <div className="w-full h-full flex items-center justify-center bg-[#FCFAF8]">
                <div className="animate-spin">
                  <div className="w-8 h-8 border-4 border-[#E0DBDF] border-t-[#004536] rounded-full" />
                </div>
              </div>
            )}

            {/* Map legend overlay */}
            <MapLegend />

            {/* Mobile panel toggle */}
            <button
              onClick={() => setPanelOpen(!panelOpen)}
              className="lg:hidden absolute top-4 right-4 z-[500] flex items-center gap-2
                px-4 py-2.5 rounded-xl bg-white shadow-lg border border-[rgba(190,201,195,0.30)]
                text-[#004536] text-sm font-bold hover:bg-[#004536]/5 transition-colors"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M3 9h14M3 15h14M17 3l4 4-4 4M17 13l4 4-4 4" stroke="#004536" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              {panelOpen ? 'Tutup' : 'Info Panel'}
            </button>
          </div>

          {/* Right panel — always visible on lg, toggleable on mobile */}
          <div className={`
            lg:flex flex-col
            transition-all duration-300 ease-in-out
            ${panelOpen ? 'flex' : 'hidden'}
          `}>
            <MapRightPanel mapData={mapData} />
          </div>
        </main>

        <CollectorFooter />
      </div>
    </div>
  )
}
