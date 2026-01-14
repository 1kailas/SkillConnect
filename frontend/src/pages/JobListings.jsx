import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiSearch, FiMapPin, FiDollarSign, FiBriefcase, FiFilter, FiClock, FiUsers, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import api from '../lib/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';

const JobListings = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({ 
    search: '', 
    category: '', 
    location: '', 
    type: '',
    sortBy: '-createdAt'
  });
  const [showFilters, setShowFilters] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

  const categories = ['All', 'Electrician', 'Plumber', 'Carpenter', 'Mason', 'Painter', 'Welder', 'Mechanic', 'AC Technician', 'Other'];
  const locations = ['All', 'Kochi', 'Thiruvananthapuram', 'Kozhikode', 'Kottayam', 'Alappuzha', 'Kollam', 'Thrissur'];
  const jobTypes = ['All', 'Full Time', 'Part Time', 'Contract', 'Temporary'];
  const sortOptions = [
    { value: '-createdAt', label: 'Most Recent' },
    { value: '-salary.max', label: 'Salary: High to Low' },
    { value: 'salary.min', label: 'Salary: Low to High' }
  ];

  useEffect(() => {
    fetchJobs();
  }, [filters.sortBy, pagination.page]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const params = {
        page: pagination.page,
        limit: 10,
        sortBy: filters.sortBy
      };

      if (filters.search) params.search = filters.search;
      if (filters.category && filters.category !== 'All') params.category = filters.category;
      if (filters.location && filters.location !== 'All') params.city = filters.location;
      if (filters.type && filters.type !== 'All') params.type = filters.type;

      const { data } = await api.get('/jobs', { params });
      setJobs(data.data || []);
      setPagination(prev => ({
        ...prev,
        pages: data.pages || 1,
        total: data.total || 0
      }));
    } catch (err) {
      console.error('Error fetching jobs:', err);
      setError('Failed to load jobs. Please try again.');
      toast.error('Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchJobs();
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const applyFilters = () => {
    setPagination(prev => ({ ...prev, page: 1 }));
    fetchJobs();
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', location: '', type: '', sortBy: '-createdAt' });
    setPagination(prev => ({ ...prev, page: 1 }));
    setTimeout(fetchJobs, 0);
  };

  const formatSalary = (salary) => {
    if (!salary) return 'Negotiable';
    if (typeof salary === 'object') {
      const { min, max, amount, type } = salary;
      const salaryType = type ? `/${type}` : '';
      
      if (min && max && min !== max) {
        return `₹${min.toLocaleString()} - ₹${max.toLocaleString()}${salaryType}`;
      }
      if (min || amount) {
        return `₹${(min || amount).toLocaleString()}${salaryType}`;
      }
      return 'Negotiable';
    }
    return `₹${salary.toLocaleString()}`;
  };

  const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now - date) / (1000 * 60 * 60 * 24));
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return `${Math.floor(diffDays / 30)} months ago`;
  };

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="container-custom">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl md:text-4xl font-heading font-bold text-slate-900 mb-2">
            Find Your Next Opportunity
          </h1>
          <p className="text-lg text-slate-600">
            Browse {pagination.total || 'available'} job opportunities across Kerala
          </p>
        </motion.div>

        {/* Search and Filter Bar */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="card mb-8"
        >
          <form onSubmit={handleSearch}>
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input 
                  type="text" 
                  placeholder="Search by job title, company, or skills..." 
                  value={filters.search} 
                  onChange={(e) => handleFilterChange('search', e.target.value)} 
                  className="input pl-12 w-full"
                  aria-label="Search jobs"
                />
              </div>
              <button 
                type="button"
                onClick={() => setShowFilters(!showFilters)} 
                className="btn btn-outline md:w-auto"
                aria-expanded={showFilters}
              >
                <FiFilter /> Filters
                <FiChevronDown className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              <button type="submit" className="btn btn-primary md:w-auto">
                <FiSearch /> Search
              </button>
            </div>
          </form>

          <AnimatePresence>
            {showFilters && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }} 
                animate={{ opacity: 1, height: 'auto' }} 
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4 pt-6 border-t">
                  <div>
                    <label className="label">Category</label>
                    <select 
                      value={filters.category} 
                      onChange={(e) => handleFilterChange('category', e.target.value)} 
                      className="input"
                    >
                      {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Location</label>
                    <select 
                      value={filters.location} 
                      onChange={(e) => handleFilterChange('location', e.target.value)} 
                      className="input"
                    >
                      {locations.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">Job Type</label>
                    <select 
                      value={filters.type} 
                      onChange={(e) => handleFilterChange('type', e.target.value)} 
                      className="input"
                    >
                      {jobTypes.map(type => <option key={type} value={type}>{type}</option>)}
                    </select>
                  </div>
                  <div className="flex items-end gap-2">
                    <button type="button" onClick={applyFilters} className="btn btn-primary flex-1">
                      Apply
                    </button>
                    <button type="button" onClick={clearFilters} className="btn btn-ghost">
                      Clear
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Results Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <p className="text-slate-600 font-medium">
            {loading ? 'Loading...' : `${pagination.total} jobs found`}
          </p>
          <div className="flex items-center gap-2">
            <label className="text-sm text-slate-600">Sort by:</label>
            <select 
              value={filters.sortBy}
              onChange={(e) => handleFilterChange('sortBy', e.target.value)}
              className="input w-auto py-2"
            >
              {sortOptions.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Content */}
        {loading ? (
          <div className="py-12">
            <LoadingSpinner text="Loading jobs..." />
          </div>
        ) : error ? (
          <div className="card text-center py-12">
            <p className="text-red-600 mb-4">{error}</p>
            <button onClick={fetchJobs} className="btn btn-primary">Try Again</button>
          </div>
        ) : jobs.length === 0 ? (
          <EmptyState
            icon={FiBriefcase}
            title="No jobs found"
            description="Try adjusting your filters or search query to find more opportunities."
            action={<button onClick={clearFilters} className="btn btn-primary">Clear Filters</button>}
          />
        ) : (
          <>
            {/* Job Cards */}
            <div className="grid gap-4">
              {jobs.map((job, index) => (
                <motion.div 
                  key={job._id || index} 
                  initial={{ opacity: 0, y: 20 }} 
                  animate={{ opacity: 1, y: 0 }} 
                  transition={{ delay: index * 0.05 }}
                >
                  <Link 
                    to={`/jobs/${job._id}`} 
                    className="card hover:shadow-lg hover:border-primary-200 transition-all block group"
                  >
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <span className="badge bg-primary-100 text-primary-700">{job.category}</span>
                          <span className="badge bg-emerald-100 text-emerald-700">{job.type || 'Full Time'}</span>
                          {job.status === 'urgent' && (
                            <span className="badge bg-red-100 text-red-700">Urgent</span>
                          )}
                        </div>
                        <h2 className="text-xl font-heading font-bold text-slate-900 mb-2 group-hover:text-primary-600 transition-colors">
                          {job.title}
                        </h2>
                        <p className="text-slate-600 mb-3 line-clamp-2">{job.description}</p>
                        <div className="flex flex-wrap items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <FiBriefcase className="w-4 h-4" />
                            {job.employer?.companyName || job.company || 'Company'}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiMapPin className="w-4 h-4" />
                            {job.location?.city || job.location || 'Kerala'}
                          </span>
                          <span className="flex items-center gap-1 font-medium text-emerald-600">
                            <FiDollarSign className="w-4 h-4" />
                            {formatSalary(job.salary || job.budget)}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiClock className="w-4 h-4" />
                            {getTimeAgo(job.createdAt)}
                          </span>
                        </div>
                      </div>
                      <div className="flex lg:flex-col items-center lg:items-end gap-4 lg:gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 lg:border-l lg:pl-6">
                        <div className="text-center">
                          <div className="flex items-center gap-1 text-slate-600">
                            <FiUsers className="w-4 h-4" />
                            <span className="text-2xl font-bold text-primary-600">
                              {job.applicants?.length || 0}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500">Applicants</div>
                        </div>
                        <span className="btn btn-primary whitespace-nowrap group-hover:bg-primary-700">
                          View Details
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex justify-center gap-2 mt-8">
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
                  disabled={pagination.page === 1}
                  className="btn btn-outline disabled:opacity-50"
                >
                  Previous
                </button>
                <span className="flex items-center px-4 text-slate-600">
                  Page {pagination.page} of {pagination.pages}
                </span>
                <button
                  onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
                  disabled={pagination.page === pagination.pages}
                  className="btn btn-outline disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default JobListings;
