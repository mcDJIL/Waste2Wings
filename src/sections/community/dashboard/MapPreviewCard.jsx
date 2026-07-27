import { useState, useEffect, useRef } from 'react'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { useAuth } from '../../../contexts/AuthContext'
import api from '../../../services/api'

// Fix Leaflet default icon URLs broken by Vite bundling
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
})

const ExpandIcon = () => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M0 10.5V7.58333H1.16667V9.33333H2.91667V10.5H0ZM7.58333 10.5V9.33333H9.33333V7.58333H10.5V10.5H7.58333ZM0 2.91667V0H2.91667V1.16667H1.16667V2.91667H0ZM9.33333 2.91667V1.16667H7.58333V0H10.5V2.91667H9.33333Z" fill="#004536" />
  </svg>
)

const createMapPin = (color, label) => {
  return L.divIcon({
    className: '',
    iconSize: [32, 42],
    iconAnchor: [16, 42],
    popupAnchor: [0, -44],
    html: `<div style="position:relative;width:32px;height:42px;filter:drop-shadow(0 2px 4px rgba(0,0,0,.3))">
      <svg width="32" height="42" viewBox="0 0 32 42" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 8C11.03 8 7 12.03 7 17C7 24 16 34 16 34C16 34 25 24 25 17C25 12.03 20.97 8 16 8Z" fill="${color}" stroke="white" stroke-width="2"/>
        <circle cx="16" cy="17" r="4" fill="white"/>
      </svg>
      ${label ? `<div style="position:absolute;top:-4px;right:-16px;background:#004536;border:1.5px solid white;border-radius:10px;padding:0 5px;color:white;font-size:9px;font-weight:700;font-family:'Plus Jakarta Sans',sans-serif;white-space:nowrap;line-height:16px">${label}</div>` : ''}
    </div>`,
  })
}

function MapComponent({ userLat, userLng, collectors, selectedCollectorId, onCollectorClick }) {
  const mapRef = useRef(null)

  return (
    <MapContainer
      center={[userLat, userLng]}
      zoom={13}
      zoomControl={false}
      className="absolute inset-0 w-full h-full"
      ref={mapRef}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
      />

      {/* User marker */}
      <Marker position={[userLat, userLng]} icon={createMapPin('#004536', 'Anda')}>
        <Popup>
          <span className="font-semibold text-[#004536]">Lokasi Anda</span>
        </Popup>
      </Marker>

      {/* Collector markers */}
      {collectors.map((collector) => (
        <Marker
          key={collector.id}
          position={[collector.latitude, collector.longitude]}
          icon={createMapPin(selectedCollectorId === collector.id ? '#006C49' : '#2563EB', collector.companyName.substring(0, 3))}
          eventHandlers={{
            click: () => onCollectorClick(collector),
          }}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h4 className="font-bold text-[#004536] mb-1">{collector.companyName}</h4>
              <p className="text-[10px] text-[#3F4945] mb-2">{collector.address}</p>
              <p className="text-xs text-[#006C49] font-semibold">
                Jarak: {collector.distanceKm.toFixed(2)} km
              </p>
              <p className="text-[10px] text-[#3F4945] mt-1">
                Harga: Rp {collector.buyPricePerLiter.toLocaleString('id-ID')}/L
              </p>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  )
}

function CollectorItem({ collector, isSelected, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left p-3 rounded-xl border transition-all duration-200 cursor-pointer ${
        isSelected
          ? 'border-[#006C49] bg-[#006C49]/5'
          : 'border-[#BEC9C3]/10 bg-white hover:shadow-md hover:-translate-y-0.5'
      }`}
    >
      <p className="text-[#051C37] text-sm font-bold leading-5 truncate">{collector.companyName}</p>
      <p className="text-[#3F4945] text-[10px] mt-0.5 truncate">{collector.address}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-[#006C49] text-[10px] font-bold bg-[#006C49]/10 px-2 py-1 rounded-full">
          {collector.distanceKm.toFixed(2)} km
        </span>
        <span className="text-[#3F4945] text-[10px] font-medium">
          Rp {collector.buyPricePerLiter.toLocaleString('id-ID')}/L
        </span>
      </div>
    </button>
  )
}

export default function MapPreviewCard() {
  const { user } = useAuth()
  const [collectors, setCollectors] = useState([])
  const [selectedCollectorId, setSelectedCollectorId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  const userLat = user?.profile?.latitude || -6.2615
  const userLng = user?.profile?.longitude || 106.8106

  useEffect(() => {
    const loadCollectors = async () => {
      try {
        setIsLoading(true)
        const response = await api.get('/collectors/nearby', {
          params: {
            lat: userLat,
            lng: userLng,
            limit: 5,
          },
        })
        setCollectors(response.data.collectors || [])
        if (response.data.collectors && response.data.collectors.length > 0) {
          setSelectedCollectorId(response.data.collectors[0].id)
        }
      } catch (error) {
        console.error('Failed to load collectors:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadCollectors()
  }, [userLat, userLng])

  return (
    <div className="rounded-2xl sm:rounded-3xl border border-[#BEC9C3]/10 bg-white
      shadow-[0_1px_2px_0_rgba(0,0,0,0.05)] overflow-hidden flex flex-col h-full">

      <div className="px-6 py-5 bg-[#F0F3FF]/50 border-b border-[#BEC9C3]/20 shrink-0">
        <h3 className="text-[#051C37] text-base font-normal">Pengepul Terdekat</h3>
        <p className="text-[#3F4945] text-xs font-medium mt-0.5">Temukan titik drop-off tercepat</p>
      </div>

      <div className="relative h-52 sm:h-64 overflow-hidden shrink-0 bg-[#e8efe9]">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="flex flex-col items-center gap-2">
              <div className="w-6 h-6 border-2 border-[#006C49] border-t-transparent rounded-full animate-spin"></div>
              <p className="text-xs text-[#3F4945]">Memuat peta...</p>
            </div>
          </div>
        ) : collectors.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <p className="text-sm text-[#3F4945]">Tidak ada pengepul terdekat</p>
          </div>
        ) : (
          <MapComponent
            userLat={userLat}
            userLng={userLng}
            collectors={collectors}
            selectedCollectorId={selectedCollectorId}
            onCollectorClick={(collector) => setSelectedCollectorId(collector.id)}
          />
        )}

        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <a href="/community/map" className="pointer-events-auto flex items-center gap-2.5 px-4 py-3 rounded-full
            bg-white/90 backdrop-blur-sm text-[#004536] text-sm font-bold
            shadow-[0_10px_15px_-3px_rgba(0,0,0,0.10),0_4px_6px_-4px_rgba(0,0,0,0.10)]
            hover:bg-white hover:shadow-xl active:scale-95 transition-all duration-200">
            <ExpandIcon />
            Buka Peta Penuh
          </a>
        </div>
      </div>

      <div className="p-4 flex flex-col gap-2.5 flex-1 bg-[#F0F3FF]/30">
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <div className="w-4 h-4 border-2 border-[#006C49] border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : collectors.length === 0 ? (
          <p className="text-[#3F4945] text-xs text-center py-4">Tidak ada pengepul terdekat</p>
        ) : (
          collectors.map((collector) => (
            <CollectorItem
              key={collector.id}
              collector={collector}
              isSelected={selectedCollectorId === collector.id}
              onClick={() => setSelectedCollectorId(collector.id)}
            />
          ))
        )}
      </div>
    </div>
  )
}
