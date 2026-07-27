import { useMemo } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

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

const communityIcon = createPin('#006C49') // Dark green
const collectorIcon = createPin('#004B7E') // Dark blue

export default function MapWidgetInteractive({ markers = [], isLoading }) {
  const { communityMarkers, collectorMarkers, bounds } = useMemo(() => {
    const communities = markers.filter(m => m.type === 'COMMUNITY')
    const collectors = markers.filter(m => m.type === 'COLLECTOR')
    
    const allCoords = markers.map(m => [m.latitude, m.longitude])
    const bounds = allCoords.length > 0 ? [
      [Math.min(...allCoords.map(c => c[0])), Math.min(...allCoords.map(c => c[1]))],
      [Math.max(...allCoords.map(c => c[0])), Math.max(...allCoords.map(c => c[1]))],
    ] : [[-6.2, 106.8], [-6.3, 106.9]]
    
    return { communityMarkers: communities, collectorMarkers: collectors, bounds }
  }, [markers])

  if (isLoading) {
    return (
      <div className="flex flex-col gap-4 p-6 rounded-2xl border border-white/30 bg-white/70 backdrop-blur-[10px] shadow-sm h-full">
        <div className="flex justify-between items-center">
          <h3 className="text-[#051C37] text-base font-normal leading-6">Peta Sebaran</h3>
        </div>
        <div className="flex-1 rounded-xl overflow-hidden flex items-center justify-center text-[#3F4945]">
          Memuat peta...
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4 p-6 rounded-2xl border border-white/30 bg-white/70 backdrop-blur-[10px] shadow-sm h-full">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-[#051C37] text-base font-normal leading-6">Peta Sebaran</h3>
      </div>

      {/* Map */}
      <div className="relative flex-1 min-h-[240px] sm:min-h-[320px] rounded-xl overflow-hidden">
        {markers.length > 0 ? (
          <MapContainer
            bounds={bounds}
            boundsOptions={{ padding: [50, 50] }}
            style={{ width: '100%', height: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; OpenStreetMap contributors'
            />
            
            {communityMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={[marker.latitude, marker.longitude]}
                icon={communityIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold text-[#004536]">{marker.name}</p>
                    <p className="text-xs text-[#3F4945]">{marker.category}</p>
                    <p className="text-xs text-[#3F4945]">{marker.address}</p>
                    <p className="text-xs text-[#3F4945] mt-1">📞 {marker.user?.phone}</p>
                  </div>
                </Popup>
              </Marker>
            ))}

            {collectorMarkers.map((marker) => (
              <Marker
                key={marker.id}
                position={[marker.latitude, marker.longitude]}
                icon={collectorIcon}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-bold text-[#004536]">{marker.name}</p>
                    <p className="text-xs text-[#3F4945]">Kapasitas: {marker.capacityLiter} L</p>
                    <p className="text-xs text-[#3F4945]">Harga: Rp{marker.buyPricePerLiter?.toLocaleString('id-ID')}/L</p>
                    <p className="text-xs text-[#3F4945]">{marker.address}</p>
                    <p className="text-xs text-[#3F4945] mt-1">📞 {marker.user?.phone}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[#3F4945]">
            Belum ada data lokasi
          </div>
        )}
      </div>

      {/* Legend + Stats */}
      <div className="flex flex-col gap-3">
        <p className="text-[#3F4945] text-xs font-bold uppercase tracking-[0.8px] leading-5">DATA LOKASI</p>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-600 flex-shrink-0" />
            <span className="text-[#051C37] text-sm leading-6">Komunitas ({communityMarkers.length})</span>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-600 flex-shrink-0" />
            <span className="text-[#051C37] text-sm leading-6">Pengepul ({collectorMarkers.length})</span>
          </div>
        </div>
      </div>
    </div>
  )
}
