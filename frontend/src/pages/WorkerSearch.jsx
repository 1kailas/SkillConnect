import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiStar, FiAward, FiFilter, FiBriefcase } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import LoadingSpinner from '../components/LoadingSpinner';

const WorkerSearch = () => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: '', category: '', location: '', rating: '' });
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Mason', 'Painter', 'Welder', 'AC Technician', 'Driver', 'Security', 'Other'];
  const locations = ['All', 'Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Thrissur', 'Kottayam'];

  useEffect(() => {
    fetchWorkers();
  }, []);

  const fetchWorkers = async () => {
    try {
      setLoading(true);
      const { data } = await api.get('/workers');
      setWorkers(data.data || []);
    } catch (error) {
      console.error('Error fetching workers:', error);
      toast.error('Failed to load workers');
    } finally {
      setLoading(false);
    }
  };

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = filters.search === '' || 
      worker.name?.toLowerCase().includes(filters.search.toLowerCase()) || 
      worker.profession?.toLowerCase().includes(filters.search.toLowerCase());
    
    const matchesCategory = filters.category === '' || filters.category === 'All' || 
      worker.profession?.toLowerCase().includes(filters.category.toLowerCase());
    
    const matchesLocation = filters.location === '' || filters.location === 'All' || 
      worker.location?.city === filters.location;
    
    const matchesRating = filters.rating === '' || 
      (worker.rating && worker.rating >= parseFloat(filters.rating));
    
    return matchesSearch && matchesCategory && matchesLocation && matchesRating;
  });

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">Find Skilled Workers</h1>
          <p className="text-lg text-slate-600">Connect with {workers.length}+ verified professionals across Kerala</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search workers..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="input pl-12 w-full" />
            </div>
            <button onClick={() => setShowFilters(!showFilters)} className="btn btn-outline md:w-auto">
              <FiFilter /> Filters
            </button>
            <button className="btn btn-primary md:w-auto">
              <FiSearch /> Search
            </button>
          </div>

          {showFilters && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 pt-6 border-t">
              <div>
                <label className="label">Profession</label>
                <select value={filters.category} onChange={(e) => setFilters({ ...filters, category: e.target.value })} className="input">
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Location</label>
                <select value={filters.location} onChange={(e) => setFilters({ ...filters, location: e.target.value })} className="input">
                  {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
              </div>
              <div>
                <label className="label">Minimum Rating</label>
                <select value={filters.rating} onChange={(e) => setFilters({ ...filters, rating: e.target.value })} className="input">
                  <option value="">All Ratings</option>
                  <option value="4.5">4.5+ Stars</option>
                  <option value="4.0">4.0+ Stars</option>
                  <option value="3.5">3.5+ Stars</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600">{filteredWorkers.length} workers found</p>
          <select className="input w-auto">
            <option>Highest Rated</option>
            <option>Most Reviews</option>
            <option>Most Experience</option>
            <option>Lowest Rate</option>
          </select>
        </div>

        {/* Worker Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map((worker, index) => (
            <motion.div key={worker._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Link to={`/workers/${worker._id}`} className="card hover:shadow-lg transition-all block h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-xl">
                      {worker.name?.charAt(0).toUpperCase() || 'W'}
                    </div>
                    <div>
                      <h3 className="font-heading font-bold text-slate-900">{worker.name}</h3>
                      <p className="text-sm text-slate-600">{worker.profession}</p>
                    </div>
                  </div>
                  {worker.isVerified && (
                    <div className="bg-emerald-100 text-emerald-700 p-1 rounded-full" title="Verified">
                      <FiAward className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-amber-600">
                    <FiStar className="w-4 h-4 fill-current" />
                    <span className="font-semibold">{worker.rating ? Number(worker.rating).toFixed(1) : 'N/A'}</span>
                    <span className="text-slate-500">({worker.totalReviews || 0})</span>
                  </div>
                  <span className="flex items-center gap-1 text-slate-600">
                    <FiMapPin className="w-4 h-4" />
                    {worker.location?.city || 'Not specified'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Experience</span>
                    <span className="font-medium">{worker.experience || 0} years</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Rate</span>
                    <span className="font-medium text-rose-600">₹{worker.hourlyRate || 0}/hour</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Status</span>
                    <span className={`font-medium ${worker.isActive ? 'text-emerald-600' : 'text-orange-600'}`}>
                      {worker.isActive ? 'Available' : 'Busy'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {worker.skills?.slice(0, 3).map((skill, i) => (
                    <span key={i} className="badge bg-primary-50 text-primary-700 text-xs">
                      {typeof skill === 'string' ? skill : skill.name}
                    </span>
                  ))}
                </div>

                <button className="btn btn-primary w-full">
                  <FiBriefcase /> View Profile
                </button>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredWorkers.length === 0 && (
          <div className="text-center py-12">
            <FiSearch className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No workers found</h3>
            <p className="text-slate-600">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerSearch;
