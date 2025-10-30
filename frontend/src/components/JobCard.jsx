import React from 'react';
import { Clock, CheckCircle, Loader, Eye, Edit, Trash2, FileText, Briefcase, Building2, User, Calendar } from 'lucide-react';

const JobCard = ({ job, onOptimize, onEdit, onDelete, onViewChanges, isOptimizing }) => {
  const getStatusIcon = () => {
    switch (job.status) {
      case 'Optimized':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'Optimizing':
        return <Loader className="w-4 h-4 text-blue-500 animate-spin" />;
      default:
        return <Clock className="w-4 h-4 text-amber-500" />;
    }
  };

  const getStatusColor = () => {
    switch (job.status) {
      case 'Optimized':
        return 'text-green-700 bg-green-100 border-green-200';
      case 'Optimizing':
        return 'text-blue-700 bg-blue-100 border-blue-200';
      default:
        return 'text-amber-700 bg-amber-100 border-amber-200';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center space-x-2 mb-2">
              <User className="w-4 h-4 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-900">{job.clientName}</h3>
            </div>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <div className="flex items-center space-x-1">
                <Building2 className="w-4 h-4" />
                <span>{job.companyName}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Briefcase className="w-4 h-4" />
                <span className="font-medium">{job.position}</span>
              </div>
            </div>
          </div>
          <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${getStatusColor()}`}>
            {getStatusIcon()}
            {job.status}
          </div>
        </div>

        {/* Job Description Preview */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {job.jobDescription}
          </p>
        </div>

        {/* Optimized Date */}
        {job.optimizedOn && (
          <div className="flex items-center space-x-1 text-xs text-gray-500 mb-4">
            <Calendar className="w-3 h-3" />
            <span>Optimized on {new Date(job.optimizedOn).toLocaleDateString()}</span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="px-6 pb-6">
        <div className="space-y-3">
          {/* Primary Action - Optimize */}
          <button
            onClick={() => onOptimize(job._id)}
            disabled={job.status === 'Optimizing' || isOptimizing}
            className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 border border-transparent rounded-lg text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            {job.status === 'Optimizing' ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin" />
                Optimizing...
              </>
            ) : (
              'Optimize Resume'
            )}
          </button>

          {/* Secondary Actions Row */}
          <div className="flex gap-2">
            {job.status === 'Optimized' && (
              <button
                onClick={() => onViewChanges(job)}
                className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-green-300 rounded-lg text-sm font-medium text-green-700 bg-green-50 hover:bg-green-100 transition-colors"
              >
                <Eye className="w-4 h-4 mr-1" />
                View Changes
              </button>
            )}

            <button
              onClick={() => onEdit(job)}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
            >
              <Edit className="w-4 h-4 mr-1" />
              Edit
            </button>

            <button
              onClick={() => onDelete(job._id)}
              className="flex-1 inline-flex items-center justify-center px-3 py-2 border border-red-300 rounded-lg text-sm font-medium text-red-700 bg-red-50 hover:bg-red-100 transition-colors"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </button>
          </div>
        </div>

        {/* Job Link */}
        {job.jobLink && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <a
              href={job.jobLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              View Job Posting →
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobCard;