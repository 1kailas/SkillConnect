import api from '../lib/axios';

// Get all jobs
export const getJobs = async (params) => {
  const { data } = await api.get('/jobs', { params });
  return data;
};

// Search jobs
export const searchJobs = async (params) => {
  const { data } = await api.get('/jobs/search', { params });
  return data;
};

// Get job by ID
export const getJob = async (id) => {
  const { data } = await api.get(`/jobs/${id}`);
  return data;
};

// Create job
export const createJob = async (jobData) => {
  const { data } = await api.post('/jobs', jobData);
  return data;
};

// Update job
export const updateJob = async (id, jobData) => {
  const { data } = await api.put(`/jobs/${id}`, jobData);
  return data;
};

// Delete job
export const deleteJob = async (id) => {
  const { data } = await api.delete(`/jobs/${id}`);
  return data;
};

// Apply for job
export const applyForJob = async (id, applicationData) => {
  const { data } = await api.post(`/jobs/${id}/apply`, applicationData);
  return data;
};

// Get job applications (for employers)
export const getJobApplications = async (id) => {
  const { data } = await api.get(`/jobs/${id}/applications`);
  return data;
};

// Get my applications (for workers)
export const getMyApplications = async () => {
  const { data } = await api.get('/jobs/applications/me');
  return data;
};

// Update application status
export const updateApplicationStatus = async (jobId, applicationId, status) => {
  const { data } = await api.put(`/jobs/${jobId}/applications/${applicationId}`, { status });
  return data;
};

// Withdraw application
export const withdrawApplication = async (jobId, applicationId) => {
  const { data } = await api.delete(`/jobs/${jobId}/applications/${applicationId}`);
  return data;
};
