import { useState, useEffect } from 'react';
import { FiMapPin, FiSearch } from 'react-icons/fi';
import LocationMap from './LocationMap';

const LocationPicker = ({ onLocationSelect, initialLocation, label = 'Select Location' }) => {
  const [location, setLocation] = useState(initialLocation || { lat: 10.8505, lng: 76.2711 });
  const [address, setAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLocationSelect = async (newLocation) => {
    setLocation(newLocation);
    setIsLoading(true);

    try {
      // Reverse geocoding to get address
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${newLocation.lat}&lon=${newLocation.lng}`
      );
      const data = await response.json();
      const fullAddress = data.display_name || 'Unknown location';
      setAddress(fullAddress);

      if (onLocationSelect) {
        onLocationSelect({
          ...newLocation,
          address: fullAddress,
          city: data.address?.city || data.address?.town || data.address?.village || '',
          state: data.address?.state || '',
          country: data.address?.country || '',
        });
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Error fetching address');
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentLocation = () => {
    if ('geolocation' in navigator) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          handleLocationSelect(newLocation);
        },
        (error) => {
          console.error('Error getting location:', error);
          alert('Unable to get your location. Please select manually on the map.');
          setIsLoading(false);
        }
      );
    } else {
      alert('Geolocation is not supported by your browser');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <label className="label">{label}</label>
        <button
          type="button"
          onClick={getCurrentLocation}
          disabled={isLoading}
          className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
        >
          <FiMapPin className="w-4 h-4" />
          {isLoading ? 'Getting location...' : 'Use my location'}
        </button>
      </div>

      <LocationMap
        center={[location.lat, location.lng]}
        zoom={13}
        markers={[{ lat: location.lat, lng: location.lng }]}
        onLocationSelect={handleLocationSelect}
        height="300px"
      />

      {address && (
        <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <FiMapPin className="w-5 h-5 text-primary-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-slate-900">Selected Location</p>
              <p className="text-xs text-slate-600 mt-1">{address}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationPicker;
