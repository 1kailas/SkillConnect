import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiStar, FiAward, FiFilter, FiBriefcase } from 'react-icons/fi';
import { motion } from 'framer-motion';

const WorkerSearch = () => {
  const [workers, setWorkers] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', location: '', rating: '' });
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Mason', 'Painter', 'Welder', 'Mechanic', 'Other'];
  const locations = ['All', 'Kottayam', 'Alappuzha', 'Kollam', 'Pathanamthitta', 'Idukki'];

  useEffect(() => {
    // Mock data - replace with API call
    setWorkers([
      { id: 1, name: 'Rajesh Kumar', profession: 'Senior Electrician', location: 'Kottayam', rating: 4.9, reviews: 45, experience: '12 years', hourlyRate: '₹500/hour', availability: 'Available', skills: ['Wiring', 'Industrial', 'Residential'], verified: true, image: 'https://ui-avatars.com/api/?name=Rajesh+Kumar&background=334e68&color=fff' },
      { id: 2, name: 'Amit Sharma', profession: 'Master Plumber', location: 'Alappuzha', rating: 4.8, reviews: 38, experience: '10 years', hourlyRate: '₹450/hour', availability: 'Available', skills: ['Pipefitting', 'Drainage', 'Installation'], verified: true, image: 'https://ui-avatars.com/api/?name=Amit+Sharma&background=334e68&color=fff' },
      { id: 3, name: 'Suresh Nair', profession: 'Expert Carpenter', location: 'Kollam', rating: 4.9, reviews: 52, experience: '15 years', hourlyRate: '₹550/hour', availability: 'Busy', skills: ['Furniture', 'Door/Windows', 'Cabinets'], verified: true, image: 'https://ui-avatars.com/api/?name=Suresh+Nair&background=334e68&color=fff' },
      { id: 4, name: 'Vijay Kumar', profession: 'Construction Mason', location: 'Kottayam', rating: 4.7, reviews: 30, experience: '8 years', hourlyRate: '₹400/hour', availability: 'Available', skills: ['Bricklaying', 'Plastering', 'Tiling'], verified: true, image: 'https://ui-avatars.com/api/?name=Vijay+Kumar&background=334e68&color=fff' },
      { id: 5, name: 'Ravi Menon', profession: 'Automotive Mechanic', location: 'Pathanamthitta', rating: 4.8, reviews: 42, experience: '11 years', hourlyRate: '₹475/hour', availability: 'Available', skills: ['Engine Repair', 'Diagnostics', 'Maintenance'], verified: true, image: 'https://ui-avatars.com/api/?name=Ravi+Menon&background=334e68&color=fff' },
      { id: 6, name: 'Anand Das', profession: 'Professional Painter', location: 'Alappuzha', rating: 4.6, reviews: 28, experience: '7 years', hourlyRate: '₹350/hour', availability: 'Available', skills: ['Interior', 'Exterior', 'Texture'], verified: false, image: 'https://ui-avatars.com/api/?name=Anand+Das&background=334e68&color=fff' },
    ]);
  }, []);

  const filteredWorkers = workers.filter(worker => {
    return (
      (filters.search === '' || worker.name.toLowerCase().includes(filters.search.toLowerCase()) || worker.profession.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.category === '' || filters.category === 'All' || worker.profession.includes(filters.category)) &&
      (filters.location === '' || filters.location === 'All' || worker.location === filters.location) &&
      (filters.rating === '' || worker.rating >= parseFloat(filters.rating))
    );
  });

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
            <motion.div key={worker.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Link to={`/workers/${worker.id}`} className="card hover:shadow-lg transition-all block h-full">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={worker.image} alt={worker.name} className="w-16 h-16 rounded-full" />
                    <div>
                      <h3 className="font-heading font-bold text-slate-900">{worker.name}</h3>
                      <p className="text-sm text-slate-600">{worker.profession}</p>
                    </div>
                  </div>
                  {worker.verified && (
                    <div className="bg-emerald-100 text-emerald-700 p-1 rounded-full" title="Verified">
                      <FiAward className="w-5 h-5" />
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-1 text-amber-600">
                    <FiStar className="w-4 h-4 fill-current" />
                    <span className="font-semibold">{worker.rating}</span>
                    <span className="text-slate-500">({worker.reviews})</span>
                  </div>
                  <span className="flex items-center gap-1 text-slate-600">
                    <FiMapPin className="w-4 h-4" />
                    {worker.location}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Experience</span>
                    <span className="font-medium">{worker.experience}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Rate</span>
                    <span className="font-medium text-rose-600">{worker.hourlyRate}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Status</span>
                    <span className={`font-medium ${worker.availability === 'Available' ? 'text-emerald-600' : 'text-orange-600'}`}>
                      {worker.availability}
                    </span>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  {worker.skills.slice(0, 3).map((skill, i) => (
                    <span key={i} className="badge bg-primary-50 text-primary-700 text-xs">{skill}</span>
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
