import { useState } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiX, FiFileText, FiAward, FiTrendingUp, FiBarChart2 } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const SkillsManager = ({ skills = [], onUpdate, isEditing = false }) => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'chart'
  const [newSkill, setNewSkill] = useState({
    name: '',
    level: 'beginner',
    proofType: 'none',
    yearsOfExperience: 0,
    proof: {
      projectTitle: '',
      projectDescription: '',
      projectUrl: '',
      projectImage: '',
      certificateTitle: '',
      certificateIssuer: '',
      certificateDate: '',
      certificateUrl: '',
      certificateId: ''
    }
  });

  const levelConfig = {
    beginner: { 
      label: 'Beginner', 
      color: 'bg-blue-100 text-blue-700 border-blue-200',
      dotColor: 'bg-blue-500',
      description: 'Learning the basics'
    },
    intermediate: { 
      label: 'Intermediate', 
      color: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      dotColor: 'bg-yellow-500',
      description: 'Comfortable with most concepts'
    },
    advanced: { 
      label: 'Advanced', 
      color: 'bg-emerald-100 text-emerald-700 border-emerald-200',
      dotColor: 'bg-emerald-500',
      description: 'Expert level proficiency'
    }
  };

  const getSkillStats = () => {
    const stats = {
      total: skills.length,
      beginner: skills.filter(s => s.level === 'beginner').length,
      intermediate: skills.filter(s => s.level === 'intermediate').length,
      advanced: skills.filter(s => s.level === 'advanced').length,
      withProof: skills.filter(s => s.proofType !== 'none').length
    };
    return stats;
  };

  const stats = getSkillStats();

  const handleAddSkill = (skillData) => {
    const skillToAdd = {
      ...skillData,
      addedAt: new Date().toISOString()
    };

    const updatedSkills = [...skills, skillToAdd];
    onUpdate(updatedSkills);
    
    // Reset form
    setNewSkill({
      name: '',
      level: 'beginner',
      proofType: 'none',
      yearsOfExperience: 0,
      proof: {
        projectTitle: '',
        projectDescription: '',
        projectUrl: '',
        projectImage: '',
        certificateTitle: '',
        certificateIssuer: '',
        certificateDate: '',
        certificateUrl: '',
        certificateId: ''
      }
    });
    setShowAddModal(false);
    toast.success('Skill added successfully!');
  };

  const handleUpdateSkill = (skillData) => {
    const updatedSkills = skills.map(skill => 
      skill._id === skillData._id || 
      (skill.name === skillData.originalName && skill.level === skillData.originalLevel)
        ? skillData 
        : skill
    );
    onUpdate(updatedSkills);
    setEditingSkill(null);
    toast.success('Skill updated successfully!');
  };

  const handleDeleteSkill = (skillToDelete) => {
    if (window.confirm(`Are you sure you want to delete "${skillToDelete.name}"?`)) {
      const updatedSkills = skills.filter(skill => 
        !(skill.name === skillToDelete.name && skill.level === skillToDelete.level)
      );
      onUpdate(updatedSkills);
      toast.success('Skill deleted successfully!');
    }
  };

  const SkillCard = ({ skill, index }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="border border-slate-200 rounded-lg p-4 hover:border-primary-300 hover:shadow-md transition-all"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <h3 className="font-semibold text-slate-900 mb-1">{skill.name}</h3>
          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${levelConfig[skill.level]?.color || levelConfig.beginner.color}`}>
            <span className={`w-2 h-2 rounded-full ${levelConfig[skill.level]?.dotColor || levelConfig.beginner.dotColor}`}></span>
            {levelConfig[skill.level]?.label || 'Beginner'}
          </span>
        </div>
        {isEditing && (
          <div className="flex gap-2">
            <button
              onClick={() => {
                setEditingSkill({...skill, originalName: skill.name, originalLevel: skill.level});
              }}
              className="p-1.5 text-slate-600 hover:text-primary-600 hover:bg-primary-50 rounded transition"
            >
              <FiEdit2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDeleteSkill(skill)}
              className="p-1.5 text-slate-600 hover:text-rose-600 hover:bg-rose-50 rounded transition"
            >
              <FiTrash2 className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {skill.yearsOfExperience > 0 && (
        <p className="text-sm text-slate-600 mb-2">
          {skill.yearsOfExperience} {skill.yearsOfExperience === 1 ? 'year' : 'years'} of experience
        </p>
      )}

      {skill.proofType !== 'none' && (
        <div className="mt-3 pt-3 border-t border-slate-100">
          {skill.proofType === 'project' && skill.proof?.projectTitle && (
            <div className="flex items-start gap-2">
              <FiFileText className="w-4 h-4 text-primary-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {skill.proof.projectTitle}
                </p>
                {skill.proof.projectDescription && (
                  <p className="text-xs text-slate-600 line-clamp-2 mt-0.5">
                    {skill.proof.projectDescription}
                  </p>
                )}
                {skill.proof.projectUrl && (
                  <a
                    href={skill.proof.projectUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-primary-600 hover:text-primary-700 mt-1 inline-block"
                  >
                    View Project →
                  </a>
                )}
              </div>
            </div>
          )}
          
          {skill.proofType === 'certificate' && skill.proof?.certificateTitle && (
            <div className="flex items-start gap-2">
              <FiAward className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {skill.proof.certificateTitle}
                </p>
                {skill.proof.certificateIssuer && (
                  <p className="text-xs text-slate-600 mt-0.5">
                    Issued by {skill.proof.certificateIssuer}
                  </p>
                )}
                {skill.proof.certificateUrl && (
                  <a
                    href={skill.proof.certificateUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-emerald-600 hover:text-emerald-700 mt-1 inline-block"
                  >
                    View Certificate →
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );

  const SkillsChart = () => {
    const maxCount = Math.max(stats.beginner, stats.intermediate, stats.advanced, 1);
    
    return (
      <div className="space-y-6">
        {/* Bar Chart */}
        <div className="bg-white border border-slate-200 rounded-lg p-6">
          <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
            <FiBarChart2 className="w-5 h-5 text-primary-600" />
            Skills Distribution by Level
          </h3>
          <div className="space-y-4">
            {Object.entries(levelConfig).map(([level, config]) => {
              const count = stats[level];
              const percentage = stats.total > 0 ? (count / stats.total * 100) : 0;
              const barWidth = stats.total > 0 ? (count / maxCount * 100) : 0;
              
              return (
                <div key={level}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className={`w-3 h-3 rounded-full ${config.dotColor}`}></span>
                      <span className="text-sm font-medium text-slate-700">{config.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-slate-600">{count} skills</span>
                      <span className="text-xs text-slate-500">({percentage.toFixed(0)}%)</span>
                    </div>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${barWidth}%` }}
                      transition={{ duration: 0.8, ease: 'easeOut' }}
                      className={`h-full ${config.dotColor} rounded-full`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-gradient-to-br from-primary-50 to-violet-50 border border-primary-200 rounded-lg p-4">
            <div className="text-3xl font-bold text-primary-600 mb-1">{stats.total}</div>
            <div className="text-sm text-slate-600">Total Skills</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg p-4">
            <div className="text-3xl font-bold text-emerald-600 mb-1">{stats.withProof}</div>
            <div className="text-sm text-slate-600">With Proof</div>
          </div>
        </div>
      </div>
    );
  };

  const SkillModal = ({ skill, onSave, onClose, title }) => {
    const [localSkill, setLocalSkill] = useState(skill);

    const handleSave = () => {
      if (!localSkill.name.trim()) {
        toast.error('Please enter a skill name');
        return;
      }
      onSave(localSkill);
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
            <h2 className="text-xl font-heading font-bold text-slate-900">{title}</h2>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 transition">
              <FiX className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-4">
            {/* Skill Name */}
            <div>
              <label className="label">Skill Name *</label>
              <input
                type="text"
                value={localSkill.name}
                onChange={(e) => setLocalSkill({...localSkill, name: e.target.value})}
                className="input"
                placeholder="e.g., Electrical Wiring"
              />
            </div>

            {/* Skill Level */}
            <div>
              <label className="label">Proficiency Level *</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(levelConfig).map(([level, config]) => (
                  <button
                    key={level}
                    type="button"
                    onClick={() => setLocalSkill({...localSkill, level})}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      localSkill.level === level
                        ? `${config.color} border-current`
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <div className={`w-3 h-3 rounded-full mx-auto mb-2 ${config.dotColor}`}></div>
                    <div className="font-medium text-sm">{config.label}</div>
                    <div className="text-xs text-slate-600 mt-1">{config.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Years of Experience */}
            <div>
              <label className="label">Years of Experience</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={localSkill.yearsOfExperience}
                onChange={(e) => setLocalSkill({...localSkill, yearsOfExperience: parseFloat(e.target.value) || 0})}
                className="input"
                placeholder="0"
              />
            </div>

            {/* Proof Type */}
            <div>
              <label className="label">Add Proof (Optional)</label>
              <select
                value={localSkill.proofType}
                onChange={(e) => setLocalSkill({...localSkill, proofType: e.target.value})}
                className="input"
              >
                <option value="none">No Proof</option>
                <option value="project">Project</option>
                <option value="certificate">Certificate</option>
              </select>
            </div>

            {/* Project Proof Fields */}
            {localSkill.proofType === 'project' && (
              <div className="space-y-4 p-4 bg-primary-50 rounded-lg border border-primary-200">
                <h3 className="font-medium text-slate-900 flex items-center gap-2">
                  <FiFileText className="w-4 h-4 text-primary-600" />
                  Project Details
                </h3>
                <div>
                  <label className="label">Project Title</label>
                  <input
                    type="text"
                    value={localSkill.proof?.projectTitle || ''}
                    onChange={(e) => setLocalSkill({
                      ...localSkill,
                      proof: {...localSkill.proof, projectTitle: e.target.value}
                    })}
                    className="input"
                    placeholder="e.g., Smart Home Automation"
                  />
                </div>
                <div>
                  <label className="label">Description</label>
                  <textarea
                    value={localSkill.proof?.projectDescription || ''}
                    onChange={(e) => setLocalSkill({
                      ...localSkill,
                      proof: {...localSkill.proof, projectDescription: e.target.value}
                    })}
                    className="input min-h-[80px]"
                    placeholder="Brief description of the project..."
                  />
                </div>
                <div>
                  <label className="label">Project URL</label>
                  <input
                    type="url"
                    value={localSkill.proof?.projectUrl || ''}
                    onChange={(e) => setLocalSkill({
                      ...localSkill,
                      proof: {...localSkill.proof, projectUrl: e.target.value}
                    })}
                    className="input"
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}

            {/* Certificate Proof Fields */}
            {localSkill.proofType === 'certificate' && (
              <div className="space-y-4 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                <h3 className="font-medium text-slate-900 flex items-center gap-2">
                  <FiAward className="w-4 h-4 text-emerald-600" />
                  Certificate Details
                </h3>
                <div>
                  <label className="label">Certificate Title</label>
                  <input
                    type="text"
                    value={localSkill.proof?.certificateTitle || ''}
                    onChange={(e) => setLocalSkill({
                      ...localSkill,
                      proof: {...localSkill.proof, certificateTitle: e.target.value}
                    })}
                    className="input"
                    placeholder="e.g., Certified Electrician"
                  />
                </div>
                <div>
                  <label className="label">Issuing Organization</label>
                  <input
                    type="text"
                    value={localSkill.proof?.certificateIssuer || ''}
                    onChange={(e) => setLocalSkill({
                      ...localSkill,
                      proof: {...localSkill.proof, certificateIssuer: e.target.value}
                    })}
                    className="input"
                    placeholder="e.g., National Skills Authority"
                  />
                </div>
                <div>
                  <label className="label">Issue Date</label>
                  <input
                    type="date"
                    value={localSkill.proof?.certificateDate || ''}
                    onChange={(e) => setLocalSkill({
                      ...localSkill,
                      proof: {...localSkill.proof, certificateDate: e.target.value}
                    })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="label">Certificate ID</label>
                  <input
                    type="text"
                    value={localSkill.proof?.certificateId || ''}
                    onChange={(e) => setLocalSkill({
                      ...localSkill,
                      proof: {...localSkill.proof, certificateId: e.target.value}
                    })}
                    className="input"
                    placeholder="e.g., CERT-2024-12345"
                  />
                </div>
                <div>
                  <label className="label">Certificate URL</label>
                  <input
                    type="url"
                    value={localSkill.proof?.certificateUrl || ''}
                    onChange={(e) => setLocalSkill({
                      ...localSkill,
                      proof: {...localSkill.proof, certificateUrl: e.target.value}
                    })}
                    className="input"
                    placeholder="https://..."
                  />
                </div>
              </div>
            )}
          </div>

          <div className="sticky bottom-0 bg-slate-50 border-t border-slate-200 px-6 py-4 flex gap-3">
            <button onClick={onClose} className="btn btn-outline flex-1">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="btn btn-primary flex-1"
            >
              {title.includes('Add') ? 'Add Skill' : 'Update Skill'}
            </button>
          </div>
        </motion.div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header with View Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-heading font-bold text-slate-900">Skills & Expertise</h2>
          <p className="text-sm text-slate-600 mt-1">Showcase your skills with proof and proficiency levels</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-slate-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode('chart')}
              className={`px-3 py-1.5 rounded text-sm font-medium transition ${
                viewMode === 'chart' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-600'
              }`}
            >
              <FiTrendingUp className="inline w-4 h-4 mr-1" />
              Charts
            </button>
          </div>
          {isEditing && (
            <button
              onClick={() => setShowAddModal(true)}
              className="btn btn-primary flex items-center gap-2"
            >
              <FiPlus className="w-4 h-4" />
              Add Skill
            </button>
          )}
        </div>
      </div>

      {/* View Content */}
      {viewMode === 'grid' ? (
        skills.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {skills.map((skill, index) => (
              <SkillCard key={`${skill.name}-${skill.level}-${index}`} skill={skill} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-slate-50 rounded-lg border-2 border-dashed border-slate-200">
            <FiTrendingUp className="w-12 h-12 text-slate-400 mx-auto mb-3" />
            <p className="text-slate-600 mb-4">No skills added yet</p>
            {isEditing && (
              <button
                onClick={() => setShowAddModal(true)}
                className="btn btn-primary inline-flex items-center gap-2"
              >
                <FiPlus className="w-4 h-4" />
                Add Your First Skill
              </button>
            )}
          </div>
        )
      ) : (
        <SkillsChart />
      )}

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {showAddModal && (
          <SkillModal
            skill={newSkill}
            onSave={handleAddSkill}
            onClose={() => setShowAddModal(false)}
            title="Add New Skill"
          />
        )}
        {editingSkill && (
          <SkillModal
            skill={editingSkill}
            onSave={handleUpdateSkill}
            onClose={() => setEditingSkill(null)}
            title="Edit Skill"
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SkillsManager;
