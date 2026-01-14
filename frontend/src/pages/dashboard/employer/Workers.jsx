import { useState } from 'react';
import { FiSearch, FiMapPin, FiStar, FiBriefcase, FiPhone, FiMail, FiMessageSquare } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Workers = () => {
  const [workers] = useState([
    { id: 1, name: 'Rajesh Kumar', profession: 'Electrician', location: 'Bangalore', experience: '5 years', rating: 4.8, reviews: 32, hourlyRate: 500, availability: 'Available', skills: ['Wiring', 'Panel Installation', 'Troubleshooting'], phone: '+91 98765 43210', verified: true },
    { id: 2, name: 'Suresh Patel', profession: 'Plumber', location: 'Bangalore', experience: '7 years', rating: 4.9, reviews: 45, hourlyRate: 450, availability: 'Available', skills: ['Pipe Fitting', 'Bathroom Fixing', 'Water Tank'], phone: '+91 98765 43211', verified: true },
    { id: 3, name: 'Amit Sharma', profession: 'Carpenter', location: 'Bangalore', experience: '4 years', rating: 4.6, reviews: 28, hourlyRate: 550, availability: 'Available', skills: ['Furniture Making', 'Door Fitting', 'Woodwork'], phone: '+91 98765 43212', verified: true },
    { id: 4, name: 'Vijay Kumar', profession: 'Painter', location: 'Bangalore', experience: '6 years', rating: 4.7, reviews: 35, hourlyRate: 400, availability: 'Busy', skills: ['Interior Painting', 'Exterior Painting', 'Texture'], phone: '+91 98765 43213', verified: true },
    { id: 5, name: 'Ravi Mehta', profession: 'Welder', location: 'Bangalore', experience: '8 years', rating: 4.9, reviews: 52, hourlyRate: 600, availability: 'Available', skills: ['Arc Welding', 'Gas Welding', 'Metal Fabrication'], phone: '+91 98765 43214', verified: true },
    { id: 6, name: 'Kiran Singh', profession: 'Mason', location: 'Bangalore', experience: '10 years', rating: 4.8, reviews: 48, hourlyRate: 500, availability: 'Available', skills: ['Bricklaying', 'Plastering', 'Tiling'], phone: '+91 98765 43215', verified: true },
  ]);

  const [filters, setFilters] = useState({
    search: '',
    profession: '',
    minRating: '',
    availability: '',
  });

  const professions = ['Electrician', 'Plumber', 'Carpenter', 'Painter', 'Mason', 'Welder', 'AC Technician'];

  const filteredWorkers = workers.filter(worker => {
    const matchesSearch = worker.name.toLowerCase().includes(filters.search.toLowerCase()) || 
                         worker.skills.some(skill => skill.toLowerCase().includes(filters.search.toLowerCase()));
    const matchesProfession = !filters.profession || worker.profession === filters.profession;
    const matchesRating = !filters.minRating || worker.rating >= parseFloat(filters.minRating);
    const matchesAvailability = !filters.availability || worker.availability === filters.availability;
    return matchesSearch && matchesProfession && matchesRating && matchesAvailability;
  });

  const handleContact = (workerName) => {
    toast.success(`Message sent to ${workerName}!`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Find Workers</h1>
        <p className="text-slate-600 mt-1">Discover skilled workers for your projects</p>
      </div>

      <div className="card">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search workers..."
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="input pl-10"
            />
          </div>
          <select
            value={filters.profession}
            onChange={(e) => setFilters({ ...filters, profession: e.target.value })}
            className="input"
          >
            <option value="">All Professions</option>
            {professions.map(prof => <option key={prof} value={prof}>{prof}</option>)}
          </select>
          <select
            value={filters.minRating}
            onChange={(e) => setFilters({ ...filters, minRating: e.target.value })}
            className="input"
          >
            <option value="">All Ratings</option>
            <option value="4.5">4.5+ Stars</option>
            <option value="4.0">4.0+ Stars</option>
            <option value="3.5">3.5+ Stars</option>
          </select>
          <select
            value={filters.availability}
            onChange={(e) => setFilters({ ...filters, availability: e.target.value })}
            className="input"
          >
            <option value="">All Availability</option>
            <option value="Available">Available Now</option>
            <option value="Busy">Busy</option>
          </select>
        </div>
      </div>

      <div className="text-sm text-slate-600">
        Showing {filteredWorkers.length} worker{filteredWorkers.length !== 1 ? 's' : ''}
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredWorkers.map((worker, index) => (
          <motion.div
            key={worker.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card hover:shadow-lg transition"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                {worker.name.charAt(0)}
              </div>
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-900">{worker.name}</h3>
                    <p className="text-sm text-slate-600">{worker.profession}</p>
                  </div>
                  {worker.verified && (
                    <span className="badge bg-emerald-100 text-emerald-700 text-xs">Verified</span>
                  )}
                </div>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FiMapPin className="w-4 h-4 text-slate-500" />
                <span>{worker.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-slate-700">
                <FiBriefcase className="w-4 h-4 text-slate-500" />
                <span>{worker.experience} experience</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1 text-amber-500">
                  {Array.from({ length: 5 }, (_, i) => (
                    <FiStar key={i} className={`w-4 h-4 ${i < Math.floor(worker.rating) ? 'fill-amber-400' : ''}`} />
                  ))}
                </div>
                <span className="text-sm font-medium text-slate-900">{worker.rating}</span>
                <span className="text-sm text-slate-500">({worker.reviews})</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-1 mb-4">
              {worker.skills.map((skill, idx) => (
                <span key={idx} className="badge bg-slate-100 text-slate-700 text-xs">{skill}</span>
              ))}
            </div>

            <div className="flex items-center justify-between mb-4 p-3 bg-emerald-50 rounded-lg">
              <div>
                <div className="text-xs text-emerald-700">Hourly Rate</div>
                <div className="text-lg font-bold text-emerald-900">₹{worker.hourlyRate}</div>
              </div>
              <span className={`badge ${worker.availability === 'Available' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                {worker.availability}
              </span>
            </div>

            <div className="flex gap-2">
              <Link to={`/worker/${worker.id}`} className="btn btn-outline flex-1 text-sm">
                View Profile
              </Link>
              <button onClick={() => handleContact(worker.name)} className="btn btn-primary flex-1 text-sm">
                <FiMessageSquare /> Contact
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {filteredWorkers.length === 0 && (
        <div className="card text-center py-12">
          <FiSearch className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No workers found</h3>
          <p className="text-slate-600">Try adjusting your search filters</p>
        </div>
      )}
    </div>
  );
};

export default Workers;
