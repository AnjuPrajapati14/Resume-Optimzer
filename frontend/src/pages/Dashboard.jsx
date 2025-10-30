import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Plus, RefreshCw, FileText } from 'lucide-react';
import JobCard from '../components/JobCard';
import AddJobModal from '../components/AddJobModal';
import ResumeChangesModal from '../components/ResumeChangesModal';
import BaseResumeModal from '../components/BaseResumeModal';

const rawBase = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7500/api';
const API_BASE_URL = rawBase.replace(/\/+$/, '');

const Dashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isChangesModalOpen, setIsChangesModalOpen] = useState(false);
  const [isBaseResumeModalOpen, setIsBaseResumeModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [optimizingJobs, setOptimizingJobs] = useState(new Set());
  const [globalBaseResume, setGlobalBaseResume] = useState('');

  useEffect(() => {
    fetchJobs();
    loadGlobalBaseResume();
  }, []);

  const loadGlobalBaseResume = () => {
    const savedResume = localStorage.getItem('flashfire-base-resume');
    if (savedResume) {
      console.log('Loading saved resume from localStorage:', savedResume);
      setGlobalBaseResume(savedResume);
    } else {
      // Set default base resume
      const defaultResume = `John Doe
Software Engineer
Email: john.doe@email.com | Phone: (555) 123-4567

EXPERIENCE
Software Developer at Tech Corp (2022-Present)
- Developed web applications using React and Node.js
- Collaborated with cross-functional teams
- Maintained code quality and documentation

Junior Developer at StartupXYZ (2020-2022)
- Built responsive websites
- Worked with databases and APIs
- Participated in agile development processes

EDUCATION
Bachelor of Science in Computer Science
University of Technology (2016-2020)

SKILLS
- JavaScript, React, Node.js
- HTML, CSS, MongoDB
- Git, Agile methodologies`;
      console.log('Setting default resume:', defaultResume);
      setGlobalBaseResume(defaultResume);
      localStorage.setItem('flashfire-base-resume', defaultResume);
    }
  };

  const fetchJobs = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/jobs`);
      setJobs(response.data);
    } catch (error) {
      toast.error('Failed to fetch jobs');
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddJob = async (jobData) => {
    try {
      if (editingJob) {
        const response = await axios.put(`${API_BASE_URL}/jobs/${editingJob._id}`, jobData);
        setJobs(jobs.map(job => job._id === editingJob._id ? response.data : job));
        toast.success('Job updated successfully');
        setEditingJob(null);
      } else {
        // Include the current base resume when creating a new job
        const currentBaseResume = localStorage.getItem('flashfire-base-resume') || globalBaseResume;
        const jobDataWithBaseResume = {
          ...jobData,
          baseResume: currentBaseResume
        };
        console.log('Creating new job with base resume:', currentBaseResume.substring(0, 50) + '...');
        
        const response = await axios.post(`${API_BASE_URL}/jobs`, jobDataWithBaseResume);
        setJobs([response.data, ...jobs]);
        toast.success('Job added successfully');
      }
      setIsAddModalOpen(false);
    } catch (error) {
      toast.error('Failed to save job');
      console.error('Error saving job:', error);
    }
  };

  const handleOptimizeResume = async (jobId) => {
    setOptimizingJobs(prev => new Set(prev).add(jobId));
    
    try {
      setJobs(jobs.map(job => 
        job._id === jobId ? { ...job, status: 'Optimizing' } : job
      ));

      const response = await axios.post(`${API_BASE_URL}/optimize/${jobId}`);
      
      if (response.data.success) {
        setJobs(jobs.map(job => 
          job._id === jobId ? response.data.job : job
        ));
        toast.success('Resume optimized successfully!');
      }
    } catch (error) {
      toast.error('Failed to optimize resume');
      console.error('Error optimizing resume:', error);
      
      setJobs(jobs.map(job => 
        job._id === jobId ? { ...job, status: 'Pending Optimization' } : job
      ));
    } finally {
      setOptimizingJobs(prev => {
        const newSet = new Set(prev);
        newSet.delete(jobId);
        return newSet;
      });
    }
  };

  const handleEditJob = (job) => {
    setEditingJob(job);
    setIsAddModalOpen(true);
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    try {
      await axios.delete(`${API_BASE_URL}/jobs/${jobId}`);
      setJobs(jobs.filter(job => job._id !== jobId));
      toast.success('Job deleted successfully');
    } catch (error) {
      toast.error('Failed to delete job');
      console.error('Error deleting job:', error);
    }
  };

  const handleViewChanges = (job) => {
    setSelectedJob(job);
    setIsChangesModalOpen(true);
  };

  const handleViewBaseResume = (job) => {
    setSelectedJob(job);
    setIsBaseResumeModalOpen(true);
  };

  const handleViewGlobalBaseResume = () => {
    if (!isBaseResumeModalOpen) {
      console.log('Opening Base Resume modal...');
      setIsBaseResumeModalOpen(true);
    }
  };

  const handleUpdateJob = (updatedJob) => {
    if (updatedJob._id === 'global-base-resume') {
      // Update global base resume
      console.log('Dashboard: Updating global base resume:', updatedJob.baseResume.substring(0, 50) + '...');
      setGlobalBaseResume(updatedJob.baseResume);
      localStorage.setItem('flashfire-base-resume', updatedJob.baseResume);
      console.log('Dashboard: Global base resume updated in state and localStorage');
    } else {
      setJobs(jobs.map(job => job._id === updatedJob._id ? updatedJob : job));
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setEditingJob(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Resume Optimizer Dashboard</h1>
            <p className="mt-2 text-sm text-gray-700">
              Manage job applications and optimize resumes with AI
            </p>
          </div>
          <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none space-x-3">
            <button
              onClick={handleViewGlobalBaseResume}
              className="inline-flex items-center px-4 py-2 border border-blue-300 rounded-lg shadow-sm text-sm font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 transition-colors"
            >
              <FileText className="w-4 h-4 mr-2" />
              Edit Base Resume
            </button>
            <button
              onClick={fetchJobs}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </button>
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Job
            </button>
          </div>
        </div>

        {/* Jobs Grid */}
        <div className="mt-8">
          {jobs.length === 0 ? (
            <div className="text-center py-12">
              <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Plus className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-500 mb-6">Get started by adding your first job card.</p>
              <button
                onClick={() => setIsAddModalOpen(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-lg text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Job
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {jobs.map((job) => (
                <JobCard
                  key={job._id}
                  job={job}
                  onOptimize={handleOptimizeResume}
                  onEdit={handleEditJob}
                  onDelete={handleDeleteJob}
                  onViewChanges={handleViewChanges}
                  isOptimizing={optimizingJobs.has(job._id)}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <AddJobModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSubmit={handleAddJob}
        editingJob={editingJob}
      />

      <ResumeChangesModal
        isOpen={isChangesModalOpen}
        onClose={() => setIsChangesModalOpen(false)}
        job={selectedJob}
      />

      <BaseResumeModal
        isOpen={isBaseResumeModalOpen}
        onClose={() => setIsBaseResumeModalOpen(false)}
        onUpdate={handleUpdateJob}
      />
    </div>
  );
};

export default Dashboard;