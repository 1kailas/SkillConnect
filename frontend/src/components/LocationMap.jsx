import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import { useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Component to update map center
function ChangeView({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

const LocationMap = ({
  center = [10.8505, 76.2711], // Default: Kerala, India
  zoom = 13,
  markers = [],
  onLocationSelect,
  height = '400px',
  interactive = true,
}) => {
  const handleMapClick = (e) => {
    if (interactive && onLocationSelect) {
      onLocationSelect({
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      });
    }
  };

  return (
    <div style={{ height, width: '100%' }} className="rounded-lg overflow-hidden shadow-md">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        onClick={handleMapClick}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} zoom={zoom} />
        
        {markers.map((marker, index) => (
          <Marker key={index} position={[marker.lat, marker.lng]}>
            {marker.popup && (
              <Popup>
                <div className="p-2">
                  <h3 className="font-bold text-slate-900">{marker.popup.title}</h3>
                  {marker.popup.description && (
                    <p className="text-sm text-slate-600 mt-1">{marker.popup.description}</p>
                  )}
                  {marker.popup.action && (
                    <button
                      onClick={marker.popup.action}
                      className="mt-2 text-xs bg-primary-500 text-white px-3 py-1 rounded"
                    >
                      {marker.popup.actionLabel || 'View Details'}
                    </button>
                  )}
                </div>
              </Popup>
            )}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default LocationMap;
