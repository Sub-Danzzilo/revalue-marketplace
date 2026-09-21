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

export default function DropoffMap({ locations = [] }) {
  const validLocations = locations.filter((location) => (
    Number.isFinite(Number(location.latitude)) && Number.isFinite(Number(location.longitude))
  ));
  const centerPosition = validLocations.length > 0
    ? [Number(validLocations[0].latitude), Number(validLocations[0].longitude)]
    : [-7.3756, 112.7164];

  return (
    <div className="dropoff-map">
      <MapContainer center={centerPosition} zoom={12} scrollWheelZoom style={{ height: '100%', width: '100%' }}>
        {/* Layer Peta OpenStreetMap */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Looping Marker Berdasarkan Data Drop-Off */}
        {validLocations.map((loc) => (
          <Marker key={loc.id} position={[Number(loc.latitude), Number(loc.longitude)]}>
            <Popup>
              <div className="map-popup">
                <strong>{loc.name}</strong>
                <span>{loc.address}</span>
                <a href={`https://www.google.com/maps/dir/?api=1&destination=${loc.latitude},${loc.longitude}`} target="_blank" rel="noreferrer">
                  Buka rute
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}