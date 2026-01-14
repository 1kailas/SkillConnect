import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiMapPin, FiFilter, FiSearch, FiNavigation } from 'react-icons/fi';
import LocationMap from '../../../components/LocationMap';
import LoadingSpinner from '../../../components/LoadingSpinner';
import EmptyState from '../../../components/EmptyState';
import api from '../../../lib/axios';
import toast from 'react-hot-toast';

const WorkerSearch = () => {
  const [workers, setWorkers] = useState([]);
  const [filteredWorkers, setFilteredWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    profession: '',
    location: '',
    radius: 10, // km
    minRating: 0,
  });
  const [userLocation, setUserLocation] = useState(null);
  const [mapCenter, setMapCenter] = useState([10.8505, 76.2711]); // Kerala

  // Fetch real workers from API
  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/workers', {
        params: {
          limit: 50,
          availability: 'available'
        }
      });
      
      // Transform workers data for map compatibility
      const workersData = data.data.map(worker => ({
        _id: worker._id,
        name: worker.name,
        profession: worker.skills?.[0] || 'Skilled Worker',
        rating: worker.rating?.average || 0,
        reviews: worker.rating?.count || 0,
        hourlyRate: worker.hourlyRate || 0,
        location: {
          lat: worker.location?.coordinates?.[1] || 10.8505,
          lng: worker.location?.coordinates?.[0] || 76.2711,
          city: worker.location?.city || 'Kerala'
        },
        avatar: worker.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(worker.name)}`,
        skills: worker.skills || [],
        available: worker.availability?.status === 'available',
      }));
      
      setWorkers(workersData);
      setFilteredWorkers(workersData);
    } catch (error) {
      console.error('Error fetching workers:', error);
      toast.error('Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const getUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const location = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(location);
          setMapCenter([location.lat, location.lng]);
        },
        (error) => {
          console.error('Error getting location:', error);
        }
      );
    }
  };

  useEffect(() => {
    getUserLocation();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  useEffect(() => {
    let filtered = [...workers];

    if (filters.profession) {
      filtered = filtered.filter(w =>
        w.profession.toLowerCase().includes(filters.profession.toLowerCase())
      );
    }

    if (filters.location) {
      filtered = filtered.filter(w =>
        w.location.city.toLowerCase().includes(filters.location.toLowerCase())
      );
    }

    if (filters.minRating > 0) {
      filtered = filtered.filter(w => w.rating >= filters.minRating);
    }

    setFilteredWorkers(filtered);
  }, [filters, workers]);

  const mapMarkers = filteredWorkers.map(worker => ({
    lat: worker.location.lat,
    lng: worker.location.lng,
    popup: {
      title: worker.name,
      description: `${worker.profession} • ₹${worker.hourlyRate}/hr • ${worker.rating}⭐`,
      action: () => window.location.href = `/workers/${worker._id}`,
      actionLabel: 'View Profile',
    },
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Find Workers</h1>
          <p className="text-slate-600 mt-1">Search skilled workers near you</p>
        </div>
        <button
          onClick={getUserLocation}
          className="btn btn-outline flex items-center gap-2"
        >
          <FiNavigation className="w-4 h-4" />
          Use My Location
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Filters */}
        <div className="lg:col-span-1">
          <div className="card space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-semibold">
              <FiFilter />
              <h3>Filters</h3>
            </div>

            <div>
              <label className="label">Profession</label>
              <input
                type="text"
                placeholder="e.g., Electrician"
                value={filters.profession}
                onChange={(e) => handleFilterChange('profession', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label">Location</label>
              <input
                type="text"
                placeholder="e.g., Kochi"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                className="input"
              />
            </div>

            <div>
              <label className="label">Search Radius: {filters.radius} km</label>
              <input
                type="range"
                min="1"
                max="50"
                value={filters.radius}
                onChange={(e) => handleFilterChange('radius', e.target.value)}
                className="w-full"
              />
            </div>

            <div>
              <label className="label">Minimum Rating</label>
              <select
                value={filters.minRating}
                onChange={(e) => handleFilterChange('minRating', Number(e.target.value))}
                className="input"
              >
                <option value="0">Any Rating</option>
                <option value="4">4+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
                <option value="4.8">4.8+ Stars</option>
              </select>
            </div>

            <button
              onClick={() => setFilters({ profession: '', location: '', radius: 10, minRating: 0 })}
              className="btn btn-outline w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Map and Results */}
        <div className="lg:col-span-2 space-y-6">
          {/* Map */}
          <div className="card">
            <h3 className="font-semibold text-slate-900 mb-4">Workers Near You</h3>
            <LocationMap
              center={mapCenter}
              zoom={10}
              markers={mapMarkers}
              height="400px"
              interactive={false}
            />
          </div>

          {/* Workers List */}
          <div className="space-y-4">
            {loading ? (
              <LoadingSpinner text="Finding workers near you..." />
            ) : filteredWorkers.length === 0 ? (
              <EmptyState
                icon={FiSearch}
                title="No workers found"
                description="Try adjusting your filters or search in a different location"
              />
            ) : (
              filteredWorkers.map((worker) => (
                <div key={worker._id} className="card-hover">
                  <div className="flex gap-4">
                    <img
                      src={worker.avatar}
                      alt={worker.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="font-heading font-bold text-slate-900 text-lg">
                            {worker.name}
                          </h3>
                          <p className="text-primary-600 font-medium">{worker.profession}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-slate-900">
                            ₹{worker.hourlyRate}
                          </div>
                          <div className="text-sm text-slate-600">per hour</div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 mt-2 text-sm">
                        <div className="flex items-center gap-1">
                          <span className="text-amber-500">⭐</span>
                          <span className="font-medium">{worker.rating.toFixed(1)}</span>
                          <span className="text-slate-600">({worker.reviews})</span>
                        </div>
                        <div className="flex items-center gap-1 text-slate-600">
                          <FiMapPin className="w-4 h-4" />
                          {worker.location.city}
                        </div>
                        <div className={`px-2 py-1 rounded text-xs font-medium ${
                          worker.available 
                            ? 'bg-emerald-100 text-emerald-700' 
                            : 'bg-slate-100 text-slate-700'
                        }`}>
                          {worker.available ? 'Available' : 'Busy'}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        {worker.skills.slice(0, 4).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 bg-slate-100 text-slate-700 rounded-full text-xs"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>

                      <div className="flex gap-2 mt-4">
                        <Link to={`/workers/${worker._id}`} className="btn btn-primary flex-1">
                          View Profile
                        </Link>
                        <Link to={`/workers/${worker._id}`} className="btn btn-outline flex-1">
                          Contact
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerSearch;
