import { useState } from 'react';
import { FiImage, FiPlus, FiEdit2, FiTrash2, FiExternalLink } from 'react-icons/fi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Portfolio = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [portfolio, setPortfolio] = useState([
    { id: 1, title: 'Home Electrical Wiring - Villa Project', description: 'Complete electrical installation for 3BHK villa including smart home integration', date: 'Dec 2023', category: 'Residential', images: ['https://images.unsplash.com/photo-1621905251918-48416bd8575a?w=400'], client: 'Mr. Ramesh Kumar' },
    { id: 2, title: 'Commercial Office Setup', description: 'Electrical setup for 5000 sq ft office space with backup power system', date: 'Oct 2023', category: 'Commercial', images: ['https://images.unsplash.com/photo-1497366216548-37526070297c?w=400'], client: 'Tech Solutions Pvt Ltd' },
    { id: 3, title: 'Industrial Panel Installation', description: 'Installed and configured industrial control panel for manufacturing unit', date: 'Aug 2023', category: 'Industrial', images: ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400'], client: 'ABC Manufacturing' },
    { id: 4, title: 'Solar Panel Setup', description: '5KW solar panel installation with battery backup system', date: 'Jun 2023', category: 'Renewable Energy', images: ['https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400'], client: 'Green Home Initiative' },
    { id: 5, title: 'Apartment Complex Wiring', description: 'Complete electrical work for 12 unit apartment complex', date: 'Apr 2023', category: 'Residential', images: ['https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=400'], client: 'Builders Consortium' },
    { id: 6, title: 'Restaurant Kitchen Setup', description: 'Commercial kitchen electrical setup with safety systems', date: 'Feb 2023', category: 'Commercial', images: ['https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400'], client: 'Spice Garden Restaurant' },
  ]);

  const categories = ['All', 'Residential', 'Commercial', 'Industrial', 'Renewable Energy'];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const filteredPortfolio = selectedCategory === 'All' 
    ? portfolio 
    : portfolio.filter(item => item.category === selectedCategory);

  const handleAdd = (e) => {
    e.preventDefault();
    toast.success('Portfolio item added successfully!');
    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-heading font-bold text-slate-900">Portfolio</h1>
          <p className="text-slate-600 mt-1">Showcase your best work and achievements</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="btn btn-primary w-full sm:w-auto">
          <FiPlus /> Add Project
        </button>
      </div>

      <div className="card">
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                selectedCategory === category
                  ? 'bg-primary-600 text-white'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {filteredPortfolio.length === 0 ? (
        <div className="card text-center py-12">
          <FiImage className="w-16 h-16 mx-auto text-slate-400 mb-4" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">No projects yet</h3>
          <p className="text-slate-600 mb-4">Start building your portfolio by adding your completed projects</p>
          <button onClick={() => setShowAddModal(true)} className="btn btn-primary">
            <FiPlus /> Add First Project
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPortfolio.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card overflow-hidden hover:shadow-lg transition"
            >
              <div className="relative h-48 bg-slate-200 rounded-lg overflow-hidden mb-4">
                <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 right-2 badge bg-white text-slate-700">{item.category}</span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{item.title}</h3>
              <p className="text-sm text-slate-600 mb-3 line-clamp-2">{item.description}</p>
              <div className="text-xs text-slate-500 mb-4 space-y-1">
                <p><span className="font-medium">Client:</span> {item.client}</p>
                <p><span className="font-medium">Date:</span> {item.date}</p>
              </div>
              <div className="flex gap-2">
                <button className="btn btn-outline flex-1 text-sm"><FiExternalLink /> View Details</button>
                <button className="btn btn-outline text-sm"><FiEdit2 /></button>
                <button className="btn btn-outline text-rose-600 hover:text-rose-700 hover:border-rose-600 text-sm"><FiTrash2 /></button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="bg-white rounded-2xl p-6 max-w-2xl w-full my-8">
            <h2 className="text-2xl font-heading font-bold text-slate-900 mb-4">Add Portfolio Project</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="label">Project Title *</label>
                <input type="text" className="input" placeholder="e.g., Home Electrical Wiring" required />
              </div>
              <div>
                <label className="label">Description *</label>
                <textarea className="input" rows="3" placeholder="Describe your project..." required></textarea>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="label">Category *</label>
                  <select className="input" required>
                    <option value="">Select category</option>
                    <option value="Residential">Residential</option>
                    <option value="Commercial">Commercial</option>
                    <option value="Industrial">Industrial</option>
                    <option value="Renewable Energy">Renewable Energy</option>
                  </select>
                </div>
                <div>
                  <label className="label">Completion Date *</label>
                  <input type="date" className="input" required />
                </div>
              </div>
              <div>
                <label className="label">Client Name</label>
                <input type="text" className="input" placeholder="Optional" />
              </div>
              <div>
                <label className="label">Upload Images *</label>
                <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-primary-400 transition cursor-pointer">
                  <FiImage className="w-8 h-8 mx-auto text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600">Click to upload or drag and drop</p>
                  <p className="text-xs text-slate-500 mt-1">JPG, PNG (Max 5 images, 2MB each)</p>
                  <input type="file" className="hidden" accept="image/*" multiple required />
                </div>
              </div>
              <div className="flex gap-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline flex-1">Cancel</button>
                <button type="submit" className="btn btn-primary flex-1">Add Project</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Portfolio;
