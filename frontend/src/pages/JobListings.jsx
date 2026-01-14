import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiDollarSign, FiBriefcase, FiFilter, FiClock } from 'react-icons/fi';
import { motion } from 'framer-motion';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [filters, setFilters] = useState({ search: '', category: '', location: '', salaryRange: '' });
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Mason', 'Painter', 'Welder', 'Mechanic', 'Other'];
  const locations = ['All', 'Kottayam', 'Alappuzha', 'Kollam', 'Pathanamthitta', 'Idukki'];

  useEffect(() => {
    // Mock data - replace with API call
    setJobs([
      { id: 1, title: 'Senior Electrician Needed', company: 'Tech Park Solutions', location: 'Kottayam', category: 'Electrician', salary: '₹25,000 - ₹35,000/month', type: 'Full Time', posted: '2 days ago', applicants: 12, description: 'Looking for experienced electrician for commercial project' },
      { id: 2, title: 'Plumbing Expert Required', company: 'Home Services Ltd', location: 'Alappuzha', category: 'Plumber', salary: '₹20,000 - ₹30,000/month', type: 'Contract', posted: '1 day ago', applicants: 8, description: 'Residential plumbing work in new apartment complex' },
      { id: 3, title: 'Skilled Carpenter', company: 'Furniture World', location: 'Kollam', category: 'Carpenter', salary: '₹22,000 - ₹32,000/month', type: 'Full Time', posted: '3 days ago', applicants: 15, description: 'Custom furniture making for luxury projects' },
      { id: 4, title: 'Construction Mason', company: 'ABC Builders', location: 'Kottayam', category: 'Mason', salary: '₹18,000 - ₹25,000/month', type: 'Full Time', posted: '1 week ago', applicants: 20, description: 'Residential building construction work' },
      { id: 5, title: 'Automotive Mechanic', company: 'City Motors', location: 'Pathanamthitta', category: 'Mechanic', salary: '₹20,000 - ₹28,000/month', type: 'Full Time', posted: '4 days ago', applicants: 10, description: 'Experienced mechanic for service center' },
      { id: 6, title: 'Interior Painter', company: 'Design Studio', location: 'Alappuzha', category: 'Painter', salary: '₹15,000 - ₹22,000/month', type: 'Contract', posted: '5 days ago', applicants: 6, description: 'High-quality painting for premium homes' },
    ]);
  }, []);

  const filteredJobs = jobs.filter(job => {
    return (
      (filters.search === '' || job.title.toLowerCase().includes(filters.search.toLowerCase()) || job.company.toLowerCase().includes(filters.search.toLowerCase())) &&
      (filters.category === '' || filters.category === 'All' || job.category === filters.category) &&
      (filters.location === '' || filters.location === 'All' || job.location === filters.location)
    );
  });

  return (
    <div className="py-12">
      <div className="container-custom">
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-4">Find Your Next Job</h1>
          <p className="text-lg text-slate-600">Browse {jobs.length}+ job opportunities across Kerala</p>
        </div>

        {/* Search and Filter Bar */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
              <input type="text" placeholder="Search jobs..." value={filters.search} onChange={(e) => setFilters({ ...filters, search: e.target.value })} className="input pl-12 w-full" />
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
                <label className="label">Category</label>
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
                <label className="label">Job Type</label>
                <select className="input">
                  <option>All Types</option>
                  <option>Full Time</option>
                  <option>Part Time</option>
                  <option>Contract</option>
                </select>
              </div>
            </motion.div>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-slate-600">{filteredJobs.length} jobs found</p>
          <select className="input w-auto">
            <option>Most Recent</option>
            <option>Salary: High to Low</option>
            <option>Salary: Low to High</option>
            <option>Most Applicants</option>
          </select>
        </div>

        {/* Job Cards */}
        <div className="grid gap-6">
          {filteredJobs.map((job, index) => (
            <motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
              <Link to={`/jobs/${job.id}`} className="card hover:shadow-lg transition-all block">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <span className="badge bg-primary-100 text-primary-700">{job.category}</span>
                      <span className="badge bg-emerald-100 text-emerald-700">{job.type}</span>
                    </div>
                    <h2 className="text-xl font-heading font-bold text-slate-900 mb-2">{job.title}</h2>
                    <p className="text-slate-600 mb-3">{job.description}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                      <span className="flex items-center gap-1"><FiBriefcase className="w-4 h-4" />{job.company}</span>
                      <span className="flex items-center gap-1"><FiMapPin className="w-4 h-4" />{job.location}</span>
                      <span className="flex items-center gap-1"><FiDollarSign className="w-4 h-4" />{job.salary}</span>
                      <span className="flex items-center gap-1"><FiClock className="w-4 h-4" />{job.posted}</span>
                    </div>
                  </div>
                  <div className="flex md:flex-col items-center md:items-end gap-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-rose-600">{job.applicants}</div>
                      <div className="text-xs text-slate-500">Applicants</div>
                    </div>
                    <button className="btn btn-primary whitespace-nowrap">Apply Now</button>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>

        {filteredJobs.length === 0 && (
          <div className="text-center py-12">
            <FiBriefcase className="w-16 h-16 mx-auto text-slate-400 mb-4" />
            <h3 className="text-xl font-semibold text-slate-900 mb-2">No jobs found</h3>
            <p className="text-slate-600">Try adjusting your filters or search query</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobListings;
