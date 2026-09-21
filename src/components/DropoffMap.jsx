import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Perbaikan ikon default Leaflet agar muncul dengan benar di React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function DropoffMap() {
  // Contoh data titik drop-off dari tabel database Prisma (drop_off_locations)
  const dropoffLocations = [
    { id: 1, name: "Bank Sampah Berkah Sidoarjo", lat: -7.4478, lng: 112.7183, type: "Pengepul Anorganik", address: "Jl. Pahlawan No. 12, Sidoarjo" },
    { id: 2, name: "Rumah Kompos Unesa", lat: -7.3122, lng: 112.7190, type: "Pengolah Organik", address: "Kampus Unesa Ketintang, Surabaya" },
    { id: 3, name: "Drop-Off Unit Sejahtera", lat: -7.4200, lng: 112.7000, type: "Pengepul Umum", address: "Jl. Gajah Mada, Sidoarjo" }
  ];

  // Koordinat pusat peta (Area Sidoarjo / Surabaya)
  const centerPosition = [-7.3756, 112.7164];

  return (
    <div className="w-full h-[450px] rounded-xl overflow-hidden shadow-sm border border-gray-200 z-0">
      <MapContainer center={centerPosition} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        {/* Layer Peta OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Looping Marker Berdasarkan Data Drop-Off */}
        {dropoffLocations.map((loc) => (
          <Marker key={loc.id} position={[loc.lat, loc.lng]}>
            <Popup>
              <div className="p-1">
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">{loc.type}</span>
                <h4 className="font-bold text-gray-800 text-sm mt-1">{loc.name}</h4>
                <p className="text-xs text-gray-600 mt-0.5">{loc.address}</p>
                <button 
                  onClick={() => alert(`Memilih rute ke ${loc.name}`)}
                  className="mt-2 bg-emerald-600 text-white text-xs px-3 py-1 rounded hover:bg-emerald-700 transition-colors"
                >
                  Pilih Lokasi Ini
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}